import {
   BookOpen,
   GraduationCap,
   House,
   MessageCircle,
   Users,
   Wallet,
   type LucideIcon,
} from "lucide-react";

/**
 * One list of the site's pages, shared by the navbar, the Home cards and the
 * phone bottom bar, so every place uses the same name, link, icon and styling.
 * Names come from the translation file (lib/i18n) using the same key.
 */
export type SitePageKey =
   | "home"
   | "learnEnglish"
   | "startCollege"
   | "payForCollege"
   | "talkToSomeone"
   | "askQuestion";

/**
 * How a page stands out wherever it is linked:
 * - "gold": gold icon (Talk to Someone: reaching a real person)
 * - "primary": filled navy button (Ask a Question: the site's main feature)
 */
export type PageEmphasis = "gold" | "primary";

export type SitePage = { href: string; icon: LucideIcon; emphasis?: PageEmphasis };

export const sitePages: Record<SitePageKey, SitePage> = {
   home: { href: "/", icon: House },
   learnEnglish: { href: "/esl", icon: BookOpen },
   // Start College page is still being confirmed with the product owner.
   startCollege: { href: "/start-college", icon: GraduationCap },
   payForCollege: { href: "/financial-aid", icon: Wallet },
   talkToSomeone: { href: "/get-connected", icon: Users, emphasis: "gold" },
   askQuestion: { href: "/chatbot", icon: MessageCircle, emphasis: "primary" },
};

/** Desktop navbar links, in order. */
export const mainNavPages: SitePageKey[] = [
   "home",
   "learnEnglish",
   "startCollege",
   "payForCollege",
   "talkToSomeone",
   "askQuestion",
];

/** Phone bottom bar: the three actions people need from any page. */
export const bottomBarPages: SitePageKey[] = ["home", "askQuestion", "talkToSomeone"];

/** True when `pathname` is this page (or a page inside it). */
export function isActivePage(pathname: string, href: string) {
   return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
