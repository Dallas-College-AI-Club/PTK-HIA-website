import { LanguageProvider } from "@/components/ui/language-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { applySavedLanguageScript } from "@/lib/i18n/apply-language";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
   return (
      // lang/dir start as English; the script below swaps them to the saved
      // language before the page paints, so React must not "fix" them back.
      <html
         lang="en"
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
            <LanguageProvider>
               <TooltipProvider>{children}</TooltipProvider>
            </LanguageProvider>
         </body>
      </html>
   );
}
