import { en, type Messages } from "./en";
import { ar } from "./ar";
import { es } from "./es";
import { my } from "./my";
import { sw } from "./sw";

export type { Messages };

/**
 * One text file per language, all with the same keys as en.ts.
 * Only languages listed here get their own pages (/es/...). To add one:
 * create the file (copy en.ts), translate it, and add it here.
 */
const messagesByLocale = { en, es, ar, my, sw } satisfies Record<string, Messages>;

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

/**
 * Digits for languages that don't write 0-9. Burmese sites write numbers with
 * Burmese digits (၁, ၂, ၃). Arabic keeps 1, 2, 3, which is common on Arabic
 * sites in the U.S. (Swapped by hand: not every browser can do this itself.)
 */
const LOCAL_DIGITS: Record<string, string> = { my: "၀၁၂၃၄၅၆၇၈၉" };

/** A whole number written the way the page's language writes it, e.g. 2 → "၂" in Burmese. */
export function formatNumber(value: number, locale: string) {
   const digits = LOCAL_DIGITS[locale];
   return digits ? String(value).replace(/[0-9]/g, (digit) => digits[Number(digit)]) : String(value);
}
