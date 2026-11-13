import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

/**
 * Runs before every page request and works out the language from the URL:
 * /es/esl is Spanish, /esl is English. (Next.js 16 calls this file proxy.ts;
 * older guides call it middleware.ts.)
 */
export default createMiddleware(routing);

export const config = {
   // Skip API routes, Next.js internals and files with an extension (favicon.ico, images).
   matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};