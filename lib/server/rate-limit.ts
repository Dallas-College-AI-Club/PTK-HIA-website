import "server-only";

/**
 * A simple rate limit for /api/chat (issue #28), so one person (or a script)
 * can't run up our OpenRouter bill.
 *
 * How it works: we remember when each visitor (by IP address) asked recently.
 * If they asked too often in the last minute or hour, the request is refused.
 *
 * Good to know:
 * - The limits are loose on purpose: a whole classroom on campus Wi-Fi can
 *   share one IP address.
 * - This lives in the server's memory. On Vercel there can be several copies
 *   of the server, each with its own count, and a restart clears it. So it
 *   stops quick bursts, not a determined attacker. For stronger protection,
 *   also add a Rate Limit rule in Vercel's Firewall for /api/chat.
 */

type Window = { limit: number; ms: number };

/** Per visitor: at most 10 questions a minute and 100 an hour. */
const WINDOWS: Window[] = [
   { limit: 10, ms: 60 * 1000 },
   { limit: 100, ms: 60 * 60 * 1000 },
];

const LONGEST_WINDOW_MS = Math.max(...WINDOWS.map((window) => window.ms));

/** Stop remembering visitors past this many, so memory can't grow forever. */
const MAX_TRACKED_VISITORS = 10_000;

/** visitor → times (ms) of their recent requests, oldest first */
const requestsByVisitor = new Map<string, number[]>();

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

/**
 * Counts one request for this visitor, unless they're over a limit.
 * @param visitor Who is asking, e.g. their IP address (see getVisitorId).
 */
export function checkRateLimit(visitor: string, now = Date.now()): RateLimitResult {
   const recent = (requestsByVisitor.get(visitor) ?? []).filter((time) => now - time < LONGEST_WINDOW_MS);

   for (const { limit, ms } of WINDOWS) {
      const inWindow = recent.filter((time) => now - time < ms);
      if (inWindow.length >= limit) {
         // They can ask again once the oldest request in this window is old enough.
         const retryAfterMs = ms - (now - inWindow[0]);
         requestsByVisitor.set(visitor, recent);
         return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
      }
   }

   recent.push(now);
   requestsByVisitor.set(visitor, recent);
   forgetOldVisitors(now);
   return { allowed: true };
}

/**
 * Who is asking. Vercel puts the visitor's IP address first in
 * x-forwarded-for. Locally there's no such header, so everyone is "local".
 */
export function getVisitorId(req: Request) {
   const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
   return forwardedFor || req.headers.get("x-real-ip")?.trim() || "local";
}

/** Drops visitors with no recent requests once the list gets long. */
function forgetOldVisitors(now: number) {
   if (requestsByVisitor.size <= MAX_TRACKED_VISITORS) return;

   for (const [visitor, times] of requestsByVisitor) {
      if (times.every((time) => now - time >= LONGEST_WINDOW_MS)) requestsByVisitor.delete(visitor);
   }

   // Still too many (a flood of new addresses): forget the oldest ones.
   for (const visitor of requestsByVisitor.keys()) {
      if (requestsByVisitor.size <= MAX_TRACKED_VISITORS) break;
      requestsByVisitor.delete(visitor);
   }
}
