import { defineRouting } from "next-intl/routing";

import { locales } from "@/lib/i18n";

/**
 * Which languages get pages, and how their URLs look.
 * - English keeps the plain URLs: /get-connected
 * - Other languages add a prefix: /es/get-connected
 */
export const routing = defineRouting({
   locales,
   defaultLocale: "en",
   localePrefix: "as-needed",
   // Remember the visitor's language (issue #12). A returning visitor who opens
   // the plain address (/) is sent to the language they used last, by the
   // server, so the page never flashes in English first. A first-time visitor
   // starts in their browser's language if we have it, and the first-visit
   // prompt (components/ui/language-prompt.tsx) lets them pick.
   localeDetection: true,
   // The cookie only holds the language code (e.g. "es"). Kept for a year.
   localeCookie: { maxAge: 60 * 60 * 24 * 365 },
});