import "server-only";

/**
 * Whether developer-only tools (like the /dev/chat-test page) are allowed.
 * - Always on while running `npm run dev`.
 * - Off in production builds (the live site), unless ENABLE_DEV_TOOLS=true is
 *   set, for example on a Vercel preview used for testing.
 */
export function devToolsEnabled() {
   return process.env.NODE_ENV !== "production" || process.env.ENABLE_DEV_TOOLS === "true";
}