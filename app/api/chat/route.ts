import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
   convertToModelMessages,
   createUIMessageStreamResponse,
   streamText,
   toUIMessageStream,
   UIMessage,
} from "ai";

import { MAX_SYSTEM_PROMPT_LENGTH  } from "@/lib/chat-limits";
import { devToolsEnabled } from "@/lib/dev-tools";

export async function POST(req: Request) {
   const { messages, systemPrompt }: { messages: UIMessage[]; systemPrompt?: unknown } = await req.json();

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

   const openrouter = createOpenRouter({ apiKey });

   const result = streamText({
      model: openrouter.chat(modelName),
      // AI SDK 7 calls the system prompt `instructions` (`system` is deprecated).
      instructions,
      messages: await convertToModelMessages(messages),
   });

   return createUIMessageStreamResponse({
      stream: toUIMessageStream({
         stream: result.stream,
         // With dev tools on, show the real error (e.g. a wrong API key) to help
         // debugging. On the live site keep the SDK's generic message.
         ...(devTools && {
            onError: (error: unknown) => (error instanceof Error ? error.message : String(error)),
         }),
      }),
   });
}