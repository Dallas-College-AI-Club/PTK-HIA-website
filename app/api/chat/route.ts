import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
   convertToModelMessages,
   createUIMessageStreamResponse,
   isStepCount,
   streamText,
   toUIMessageStream,
   UIMessage,
} from "ai";

import { MAX_SYSTEM_PROMPT_LENGTH  } from "@/lib/chat-limits";
import { devToolsEnabled } from "@/lib/dev-tools";
import { TOOL_REGISTRY } from "@/lib/server/tools/registry";

export async function POST(req: Request) {
   const {
      messages,
      systemPrompt,
      useTools,
   }: { messages: UIMessage[]; systemPrompt?: unknown; useTools?: unknown } = await req.json();

   const apiKey = process.env.OPENROUTER_API_KEY;
   const modelName = process.env.LLM_MODEL_NAME;
   if (!apiKey || !modelName) {
      return new Response("OpenRouter is not set up. Add OPENROUTER_API_KEY and LLM_MODEL_NAME to .env.local.", {
         status: 500,
      });
   }

   // Only the developer test page (/dev/chat-test) sends its own system prompt,
   // and it's only used where dev tools are on (issue #30). On the live site it's
   // ignored, so nobody can run our OpenRouter key with their own instructions.
   const devTools = devToolsEnabled();
   let instructions: string | undefined;
   if (devTools && typeof systemPrompt === "string" && systemPrompt.trim()) {
      if (systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH) {
         return new Response(`The system prompt is too long (max ${MAX_SYSTEM_PROMPT_LENGTH} characters).`, {
            status: 400,
         });
      }
      instructions = systemPrompt;
   }

   // Tools (issue #42) search sample data for now, so they only run where dev
   // tools are on and the dev page asked for them. The live chatbot is unchanged.
   const tools = devTools && useTools === true ? TOOL_REGISTRY : undefined;

   const openrouter = createOpenRouter({ apiKey });

   const result = streamText({
      model: openrouter.chat(modelName),
      // Pressing Stop (or closing the page) cancels the AI too, so we don't
      // keep paying for an answer nobody will see.
      abortSignal: req.signal,
      // AI SDK 7 calls the system prompt `instructions` (`system` is deprecated).
      instructions,
      // ignoreIncompleteToolCalls: if Stop was pressed during a tool call, skip
      // that unfinished call instead of failing the next message.
      messages: await convertToModelMessages(messages, { tools, ignoreIncompleteToolCalls: true }),
      tools,
      // Up to 3 steps: the AI asks for a tool, reads the result, then answers.
      // (AI SDK 7's version of `maxSteps: 3`.)
      stopWhen: isStepCount(3),
   });

   return createUIMessageStreamResponse({
      stream: toUIMessageStream({
         stream: result.stream,
         // With dev tools on, show the real error (e.g. a wrong API key or a
         // failed tool) to help debugging. On the live site keep the SDK's
         // generic message.
         ...(devTools && {
            onError: (error: unknown) => (error instanceof Error ? error.message : String(error)),
         }),
      }),
   });
}