import { LanguageProvider } from "@/components/ui/language-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { routing } from "@/i18n/routing";
import { applySavedLanguageScript } from "@/lib/i18n/apply-language";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Geist_Mono, Noto_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { locale as urlLocale } from "next/root-params";
import "../globals.css";

// Noto Sans has matching fonts for Arabic and Burmese (Noto Sans Arabic /
// Noto Sans Myanmar), which can be added when those languages are turned on.
const notoSans = Noto_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "PTK × AI Club | Dallas College",
   description:
      "Find ESL classes, start college, pay for college, and connect with a real person at Dallas College, in your language.",
};

// Build every language's pages ahead of time (needed with Cache Components).
export function generateStaticParams() {
   return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
   // The language comes from the URL: /es/... is Spanish, everything else English.
   const locale = await urlLocale();
   if (!hasLocale(routing.locales, locale)) notFound();

   return (
      // lang comes from the URL. TODO(#12, Angie): the script below still swaps
      // lang/dir to the language saved in the browser; switch the selector to
      // change the URL instead, then remove the script.
      <html
         lang={locale}
         dir="ltr"
         suppressHydrationWarning
         className={cn(
            "h-full",
            "antialiased",
            geistMono.variable,
            "font-sans",
            notoSans.variable,
         )}
      >
         <head>
            <script dangerouslySetInnerHTML={{ __html: applySavedLanguageScript }} />
         </head>
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