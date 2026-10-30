import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
   convertToModelMessages,
   createUIMessageStreamResponse,
   streamText,
   toUIMessageStream,
   UIMessage,
} from "ai";

export async function POST(req: Request) {
   const { messages }: { messages: UIMessage[] } = await req.json();

   const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY!,
   });

   const result = streamText({
      model: openrouter.chat(process.env.LLM_MODEL_NAME!),
      messages: await convertToModelMessages(messages),
   });

   return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
   });
}
