import { TooltipProvider } from "@/components/ui/tooltip";
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
      <html
         lang="en"
         className={cn(
            "h-full",
            "antialiased",
            geistMono.variable,
            "font-sans",
            notoSans.variable,
         )}
      >
         <body className="min-h-full flex flex-col">
            <TooltipProvider>{children}</TooltipProvider>
         </body>
      </html>
   );
}
