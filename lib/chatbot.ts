import { isStaticToolUIPart } from "ai";

// `import type` is removed at build time, so this server-only file never reaches the browser.
import type { ChatbotMessage } from "@/lib/server/tools/registry";

/**
 * Shared chatbot helpers (issue #28). Safe for the browser: no server code.
 * The chat page (components/ui/chat-panel.tsx) and /api/chat both use these
 * limits, so they always agree.
 */

/** Longest question a visitor can send, in characters. */
export const MAX_QUESTION_LENGTH = 1000;

/**
 * How many recent messages the page sends with each question (5 questions and
 * 5 answers). Enough for follow-up questions like "and on weekends?", while
 * keeping each request small and cheap.
 */
export const MAX_HISTORY_MESSAGES = 10;

/** One PTK resource an answer came from. */
export type ChatSource = {
   sourceLabel: string;
   sourceUrl: string;
};

/** All the answer text in a message (an answer can arrive in several text parts). */
export function getMessageText(message: ChatbotMessage) {
   return message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("")
      .trim();
}

/**
 * The sources for an answer, taken from what the search tool returned (not
 * from the AI's text, so links can't be garbled). Duplicates removed, max 3.
 */
export function getSources(message: ChatbotMessage): ChatSource[] {
   const sources = new Map<string, ChatSource>();

   for (const part of message.parts) {
      if (!isStaticToolUIPart(part) || part.state !== "output-available") continue;
      for (const result of part.output.results) {
         if (!sources.has(result.source_url)) {
            sources.set(result.source_url, { sourceLabel: result.title, sourceUrl: result.source_url });
         }
      }
   }

   return [...sources.values()].slice(0, 3);
}

/** True when /api/chat said "too many questions, wait a bit" (HTTP 429). */
export function isRateLimitError(error: Error | undefined) {
   return error !== undefined && "statusCode" in error && error.statusCode === 429;
}
