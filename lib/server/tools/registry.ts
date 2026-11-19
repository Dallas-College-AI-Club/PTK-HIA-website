import "server-only";

import { tool, type InferUITools, type UIDataTypes, type UIMessage } from "ai";

import { SEARCH_RESOURCES_TOOL_NAME } from "@/lib/tool-names";

import * as searchResources from "./search-resources";

/**
 * Every tool the AI can use (issue #42). How to add one: docs/AI_TOOLS_GUIDE.md.
 *
 * The live chatbot (issue #28) and /dev/chat-test both use them. See
 * app/api/chat/route.ts.
 */
export const TOOL_REGISTRY = {
   [SEARCH_RESOURCES_TOOL_NAME]: tool({
      description: searchResources.DESCRIPTION,
      inputSchema: searchResources.INPUT_SCHEMA,
      execute: searchResources.EXECUTE,
   }),
};

/**
 * The shape of a chat message, including every tool's input and output.
 * Pass it to useChat<ChatbotMessage>() so tool parts are fully typed.
 * Client components must use `import type` for this (the type is removed at
 * build time, so this server-only file never reaches the browser).
 */
export type ChatbotMessage = UIMessage<unknown, UIDataTypes, InferUITools<typeof TOOL_REGISTRY>>;

/** The same shape, used by /dev/chat-test. */
export type ChatTestMessage = ChatbotMessage;