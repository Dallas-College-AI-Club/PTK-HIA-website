import { en, type Messages } from "./en";
import { es } from "./es";

export type { Messages };

/**
 * One text file per language, all with the same keys as en.ts.
 * Only languages listed here get their own pages (/es/...). To add one:
 * create the file (copy en.ts), translate it, and add it here.
 */
const messagesByLocale = { en, es } satisfies Record<string, Messages>;

export type Locale = keyof typeof messagesByLocale;

/** The languages that have pages, e.g. ["en", "es"]. Used by i18n/routing.ts. */
export const locales = Object.keys(messagesByLocale) as Locale[];

/**
 * Returns the text for a language. Where to get the language:
 * - Server Components: `getMessages(await getLocale())` (from next-intl/server)
 * - Client Components: `getMessages(useLocale())` (from next-intl)
 * Unknown languages fall back to English.
 */
export function getMessages(locale: string): Messages {
   return messagesByLocale[locale as Locale] ?? en;
}