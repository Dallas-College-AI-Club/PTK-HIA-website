import { getMessages } from "@/lib/i18n";

/** One answer from the chatbot, with the PTK resource it came from. */
export type ChatAnswer = {
   text: string;
   sourceLabel?: string;
   sourceUrl?: string;
};

/**
 * Gets an answer for the visitor's question.
 *
 * PLACEHOLDER: this does not call any AI yet. It waits a moment and returns
 * a placeholder answer, so the page can be built and tested on its own.
 *
 * TODO(backend): connect this to the backend. The plan:
 * 1. The backend finds the parts of PTK's collected resources that match the
 *    question (this is called RAG: "retrieval-augmented generation"). That
 *    data comes from the data team's work in issues #10 and #17.
 * 2. It asks the AI to answer using only those parts, in the visitor's
 *    language, and sends back the answer plus its source.
 * 3. This function then becomes a call to /api/chat (or whatever route the
 *    backend team creates), passing the question and the language.
 * The chat page won't need to change: it only uses this function.
 */
export async function askChatbot(question: string, language = "en"): Promise<ChatAnswer> {
   void question;
   void language; // TODO(#12): send the visitor's chosen language to the backend.

   await new Promise((resolve) => setTimeout(resolve, 700));

   const t = getMessages(language).chatbot;
   return { text: t.placeholderAnswer, sourceLabel: t.placeholderSource };
}
