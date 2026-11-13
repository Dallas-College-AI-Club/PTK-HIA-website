import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { locale as urlLocale } from "next/root-params";

import { routing } from "./routing";

/**
 * Tells next-intl which language the current page is in, so getLocale() and
 * useLocale() work. The language comes from the [locale] part of the URL
 * (next/root-params), which keeps pages fast with Cache Components.
 *
 * Our text lives in lib/i18n (getMessages), not in next-intl, so no messages
 * are returned here.
 */
export default getRequestConfig(async ({ locale }) => {
   // `locale` is only set when code asks for a specific language.
   const requested = locale ?? (await urlLocale());
   return { locale: hasLocale(routing.locales, requested) ? requested : routing.defaultLocale };
});