import "server-only";

import { tool, type InferUITools, type UIDataTypes, type UIMessage } from "ai";

import { SEARCH_RESOURCES_TOOL_NAME } from "@/lib/tool-names";

import * as searchResources from "./search-resources";

/**
 * Every tool the AI can use (issue #42). How to add one: docs/AI_TOOLS_GUIDE.md.
 *
 * For now these only run where dev tools are on (see app/api/chat/route.ts),
 * because search_resources uses sample data, not the real database.
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
 * Pass it to useChat<ChatTestMessage>() so tool parts are fully typed.
 * Client components must use `import type` for this (the type is removed at
 * build time, so this server-only file never reaches the browser).
 */
export type ChatTestMessage = UIMessage<unknown, UIDataTypes, InferUITools<typeof TOOL_REGISTRY>>;