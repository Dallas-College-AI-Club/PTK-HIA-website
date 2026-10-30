import {
   convertToModelMessages,
   createUIMessageStreamResponse,
   streamText,
   toUIMessageStream,
   UIMessage,
} from "ai";

export async function POST(req: Request) {
   const { messages }: { messages: UIMessage[] } = await req.json();

   const result = streamText({
      model: process.env.LLM_MODEL_NAME!,
      messages: await convertToModelMessages(messages),
   });

   return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
   });
}
