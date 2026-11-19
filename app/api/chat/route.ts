import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
   convertToModelMessages,
   createUIMessageStreamResponse,
   isStepCount,
   safeValidateUIMessages,
   streamText,
   toUIMessageStream,
} from "ai";
import { z } from "zod";

import { MAX_SYSTEM_PROMPT_LENGTH } from "@/lib/chat-limits";
import { MAX_HISTORY_MESSAGES, MAX_QUESTION_LENGTH } from "@/lib/chatbot";
import { devToolsEnabled } from "@/lib/dev-tools";
import { chatbotInstructions } from "@/lib/server/chatbot-prompt";
import { checkRateLimit, getVisitorId } from "@/lib/server/rate-limit";
import { TOOL_REGISTRY, type ChatbotMessage } from "@/lib/server/tools/registry";
import { SEARCH_RESOURCES_TOOL_NAME } from "@/lib/tool-names";

/** Biggest request we read, in characters (a long chat is about 30,000). */
const MAX_BODY_LENGTH = 200_000;

/**
 * What the browser may send. Only "user" and "assistant" messages: a
 * "system" message could change the chatbot's rules, so it's refused.
 */
const requestSchema = z.object({
   messages: z
      .array(z.looseObject({ role: z.enum(["user", "assistant"]) }))
      .min(1),
   // The website's language, e.g. "es" (live chatbot).
   locale: z.string().max(10).optional(),
   // Only from /dev/chat-test, and only used where dev tools are on.
   devTest: z.boolean().optional(),
   systemPrompt: z.string().optional(),
   useTools: z.boolean().optional(),
});

/**
 * The chatbot endpoint. Two kinds of requests:
 * - The live chatbot ("Ask a Question" page, issue #28): our own rules, the
 *   search always runs first, and visitors are rate limited.
 * - /dev/chat-test (issues #30, #42): your own system prompt and tools on or
 *   off. Only where dev tools are on (local, or a preview with
 *   ENABLE_DEV_TOOLS=true).
 */
export async function POST(req: Request) {
   const raw = await req.text();
   if (raw.length > MAX_BODY_LENGTH) {
      return textResponse(413, "The request is too big.");
   }

   let json: unknown;
   try {
      json = JSON.parse(raw);
   } catch {
      return textResponse(400, "The request is not valid JSON.");
   }
   const request = requestSchema.safeParse(json);
   if (!request.success) {
      return textResponse(400, "The request is not in the expected format.");
   }
   const { locale, devTest, systemPrompt, useTools } = request.data;

   const devTools = devToolsEnabled();
   const isDevTest = devTools && devTest === true;

   // Rate limit the live chatbot before doing any work, so spam costs us nothing.
   if (!isDevTest) {
      const limit = checkRateLimit(getVisitorId(req));
      if (!limit.allowed) {
         return textResponse(429, "Too many questions. Please wait a moment and try again.", {
            "Retry-After": String(limit.retryAfterSeconds),
         });
      }
   }

   // Check every message part (text, tool calls and their results) is well formed.
   const validated = await safeValidateUIMessages<ChatbotMessage>({
      messages: request.data.messages,
      tools: TOOL_REGISTRY,
   });
   if (!validated.success) {
      return textResponse(400, "The messages are not in the expected format.");
   }
   const messages = validated.data;

   if (!isDevTest) {
      const problem = checkLiveMessages(messages);
      if (problem) return textResponse(400, problem);
   }

   const apiKey = process.env.OPENROUTER_API_KEY;
   const modelName = process.env.LLM_MODEL_NAME;
   if (!apiKey || !modelName) {
      return textResponse(500, "OpenRouter is not set up. Add OPENROUTER_API_KEY and LLM_MODEL_NAME to .env.local.");
   }

   let settings;
   if (isDevTest) {
      // /dev/chat-test: its own system prompt (if any), and tools only if its
      // "Use tools" box is checked.
      if (systemPrompt && systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH) {
         return textResponse(400, `The system prompt is too long (max ${MAX_SYSTEM_PROMPT_LENGTH} characters).`);
      }
      settings = {
         instructions: systemPrompt?.trim() || undefined,
         tools: useTools === true ? TOOL_REGISTRY : undefined,
         // Up to 3 steps: the AI asks for a tool, reads the result, then answers.
         stopWhen: isStepCount(3),
      };
   } else {
      // Live chatbot: our rules (the browser can't change them), and two steps.
      settings = {
         instructions: chatbotInstructions(locale ?? "en"),
         tools: TOOL_REGISTRY,
         // Step 1: the AI MUST search (small models sometimes skip tools).
         // Step 2: it MUST answer from the results (no second search).
         prepareStep: ({ stepNumber }: { stepNumber: number }) => ({
            toolChoice:
               stepNumber === 0 ? ({ type: "tool", toolName: SEARCH_RESOURCES_TOOL_NAME } as const) : ("none" as const),
         }),
         stopWhen: isStepCount(2),
         // Answers are short. This also caps what one answer can cost.
         maxOutputTokens: 800,
      };
   }

   const openrouter = createOpenRouter({ apiKey });

   const result = streamText({
      model: openrouter.chat(modelName),
      // Pressing Stop (or closing the page) cancels the AI too, so we don't
      // keep paying for an answer nobody will see.
      abortSignal: req.signal,
      // ignoreIncompleteToolCalls: if Stop was pressed during a tool call, skip
      // that unfinished call instead of failing the next message.
      messages: await convertToModelMessages(messages, { tools: settings.tools, ignoreIncompleteToolCalls: true }),
      ...settings,
   });

   return createUIMessageStreamResponse({
      stream: toUIMessageStream({
         stream: result.stream,
         onError: (error: unknown) => {
            const message = error instanceof Error ? error.message : String(error);
            // Shows up in the terminal locally, and in Vercel's logs on the live site.
            console.error("[/api/chat]", message);
            // With dev tools on, show the real error (e.g. a wrong API key or a
            // model without tool support). On the live site, a general message:
            // the chat page shows its own friendly text anyway.
            return devTools ? message : "Something went wrong.";
         },
      }),
   });
}

/** Extra checks for the live chatbot. Returns what's wrong, or nothing. */
function checkLiveMessages(messages: ChatbotMessage[]) {
   // The page sends 10. A few more are allowed, just in case.
   if (messages.length > MAX_HISTORY_MESSAGES + 2) return "Too many messages.";
   if (messages.at(-1)?.role !== "user") return "The last message must be a question.";

   // Questions are text only (no files or images).
   const notText = messages.some((message) => message.role === "user" && message.parts.some((part) => part.type !== "text"));
   if (notText) return "Questions must be text.";

   const tooLong = messages.some(
      (message) =>
         message.role === "user" &&
         message.parts.reduce((length, part) => length + (part.type === "text" ? part.text.length : 0), 0) >
            MAX_QUESTION_LENGTH,
   );
   if (tooLong) return `A question can be at most ${MAX_QUESTION_LENGTH} characters.`;
}

function textResponse(status: number, message: string, headers?: Record<string, string>) {
   return new Response(message, { status, headers });
}
