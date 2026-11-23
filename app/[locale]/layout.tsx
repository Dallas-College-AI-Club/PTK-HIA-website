import { LanguageProvider } from "@/components/ui/language-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { routing } from "@/i18n/routing";
import { getMessages } from "@/lib/i18n";
import { getLanguage, isLanguageCode, RTL_ENABLED } from "@/lib/i18n/languages";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Geist_Mono, Noto_Sans, Noto_Sans_Arabic, Noto_Sans_Myanmar } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as urlLocale } from "next/root-params";
import "../globals.css";

// Noto Sans for Latin letters, plus its matching Arabic and Burmese fonts
// (issue #55), so every language looks like one family. The browser only
// downloads the Arabic or Burmese font on a page that uses those letters, so
// they aren't preloaded. The three are combined into --font-sans in globals.css.
const notoSans = Noto_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-noto" });
const notoSansArabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-noto-arabic", preload: false });
const notoSansMyanmar = Noto_Sans_Myanmar({ subsets: ["myanmar"], variable: "--font-noto-myanmar", preload: false });

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

/** Tab title and search description in the page's language (pages can set their own). */
export async function generateMetadata(): Promise<Metadata> {
   const t = getMessages(await urlLocale());

   return {
      title: `${t.brand.name} | ${t.brand.college}`,
      description: t.brand.description,
   };
}

// Build every language's pages ahead of time (needed with Cache Components).
export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
   // The language comes from the URL: /es/... is Spanish, /ar/... is Arabic,
   // and so on (plain addresses are English).
   const locale = await urlLocale();
   if (!hasLocale(routing.locales, locale)) notFound();
   // Arabic reads right to left. The browser mirrors the layout, and Tailwind's
   // start/end classes (ms-, pe-, start-, end-) and rtl: variants follow it.
   const dir = RTL_ENABLED && isLanguageCode(locale) ? getLanguage(locale).dir : "ltr";

   return (
      // lang and dir come from the URL only, so every page shows in one language
      // and direction. (#12: the language selector switches pages by changing
      // the URL.)
      <html
         lang={locale}
         dir={dir}
         suppressHydrationWarning
         className={cn(
            "h-full",
            "antialiased",
            geistMono.variable,
            "font-sans",
            notoSans.variable,
            notoSansArabic.variable,
            notoSansMyanmar.variable,
         )}
      >
         <body className="min-h-full flex flex-col">
            {/* Lets client components read the language with useLocale().
                Our text comes from lib/i18n, so next-intl gets no messages. */}
            <NextIntlClientProvider locale={locale} messages={null}>
               <LanguageProvider>
                  <TooltipProvider>{children}</TooltipProvider>
               </LanguageProvider>
            </NextIntlClientProvider>
         </body>
      </html>
   );
}