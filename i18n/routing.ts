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
   // Only the URL decides the language. Don't redirect visitors based on their
   // browser language yet (the Spanish text is still a mock). The first-visit
   // language prompt is issue #12.
   localeDetection: false,
});