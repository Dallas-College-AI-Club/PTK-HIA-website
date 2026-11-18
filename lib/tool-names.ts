/**
 * Tool names and the progress text the chat shows for each tool (issue #42).
 *
 * This file has NO server imports, so browser code can use it. The tools
 * themselves live in lib/server/tools/ and must never reach the browser.
 * Both sides import the name from here, so renaming a tool is one change.
 * (Same pattern as the Success Coach chatbot's lib/tools/names.ts.)
 */

export const SEARCH_RESOURCES_TOOL_NAME = "search_resources";

/** What the chat shows while a tool runs, after it finishes, and if it fails. */
export const TOOL_LABELS: Record<string, { running: string; done: string; failed: string }> = {
   [SEARCH_RESOURCES_TOOL_NAME]: {
      running: "Searching PTK resources",
      done: "Searched PTK resources",
      failed: "Couldn't search PTK resources",
   },
};