import { ArrowRight, Baby, Bus, ChevronRight, Heart, ImageIcon, type LucideIcon } from "lucide-react";
import { getLocale } from "next-intl/server";

import { AskBox } from "@/components/ui/ask-box";
import { Link } from "@/i18n/navigation";
import { getMessages, type Messages } from "@/lib/i18n";
import { pageContainer } from "@/lib/layout";
import { sitePages, type SitePageKey } from "@/lib/site-pages";
import { cn } from "@/lib/utils";

const cardPages = ["learnEnglish", "startCollege", "payForCollege", "talkToSomeone"] as const satisfies readonly SitePageKey[];

const moreHelp: { key: keyof Messages["home"]["moreHelpItems"]; icon: LucideIcon }[] = [
   { key: "childcare", icon: Baby },
   { key: "busPass", icon: Bus },
   { key: "counseling", icon: Heart },
];

export default async function Home() {
   const t = getMessages(await getLocale());

   return (
      <>
         {/* Welcome + chat box + illustration */}
         <section aria-labelledby="welcome" className="border-b border-brand-line-soft bg-brand-page">
            <div className={cn(pageContainer, "flex flex-col gap-[18px] pt-6 pb-7 md:flex-row md:items-center md:gap-14 md:pt-14 md:pb-16")}>
               <div className="flex min-w-0 flex-1 flex-col gap-[18px] md:gap-6">
                  <div>
                     <h1 id="welcome" className="text-[40px] leading-[1.1] font-extrabold text-brand-navy-dark md:text-[60px]">
                        {t.home.welcome}
                     </h1>
                     <p className="mt-1.5 text-xl font-semibold md:mt-2.5 md:text-2xl">{t.home.howCanWeHelp}</p>
                  </div>
                  <AskBox />
               </div>

               {/* TODO: replace with the illustration file from the design team */}
               <div
                  role="img"
                  aria-label={t.home.illustrationAlt}
                  className="flex h-[110px] shrink-0 items-center justify-center gap-2.5 rounded-[18px] border-2 border-dashed border-brand-placeholder bg-white p-4 font-bold text-brand-muted md:h-[440px] md:w-[520px] md:flex-col md:rounded-3xl"
               >
                  <ImageIcon aria-hidden="true" className="size-8 md:size-12" strokeWidth={1.5} />
                  {t.home.illustrationPlaceholder}
               </div>
            </div>
         </section>

         {/* Main paths */}
         <section aria-labelledby="what-do-you-need" className={cn(pageContainer, "pt-7 pb-2 md:pt-14 md:pb-6")}>
            <h2 id="what-do-you-need" className="mb-4 text-2xl font-extrabold text-brand-navy-dark md:mb-6 md:text-[30px]">
               {t.home.whatDoYouNeed}
            </h2>
            <ul className="grid gap-3 md:grid-cols-4 md:gap-5">
               {cardPages.map((key) => {
                  const { href, icon: Icon, emphasis } = sitePages[key];
                  const card = t.home.cards[key];
                  const highlight = emphasis === "gold";

                  return (
                     <li key={key} className="flex">
                        {/* The whole card is one link (no separate "Go" button). */}
                        <Link
                           href={href}
                           className={cn(
                              "flex w-full items-center gap-3.5 rounded-2xl p-4 text-brand-ink md:min-h-[236px] md:flex-col md:items-stretch md:rounded-[18px] md:p-6",
                              highlight
                                 ? "border-[3px] border-brand-navy bg-brand-gold-soft"
                                 : "border-2 border-brand-line bg-white hover:border-brand-navy",
                           )}
                        >
                           <span
                              className={cn(
                                 "flex size-14 shrink-0 items-center justify-center rounded-[14px] md:size-16 md:rounded-2xl",
                                 highlight ? "bg-brand-gold text-brand-navy-dark" : "bg-brand-tint text-brand-navy",
                              )}
                           >
                              <Icon aria-hidden="true" className="size-7 md:size-8" />
                           </span>
                           <span className="flex min-w-0 flex-1 flex-col md:gap-3.5">
                              <span className="text-[19px] font-extrabold text-brand-navy-dark md:text-[23px]">{card.title}</span>
                              <span className="text-[15px] text-brand-muted md:text-base">{card.description}</span>
                           </span>
                           <ChevronRight aria-hidden="true" className="size-[22px] shrink-0 text-brand-navy md:hidden" strokeWidth={2.5} />
                           <span
                              className={cn(
                                 "hidden size-10 items-center justify-center self-end rounded-full md:flex",
                                 highlight ? "bg-brand-gold text-brand-navy-dark" : "bg-brand-navy text-white",
                              )}
                           >
                              <ArrowRight aria-hidden="true" className="size-5" strokeWidth={2.5} />
                           </span>
                        </Link>
                     </li>
                  );
               })}
            </ul>
         </section>

         {/* More help: each tile opens the chatbot with that question filled in */}
         <section aria-labelledby="more-help" className={cn(pageContainer, "pt-5 pb-8 md:pt-6 md:pb-16")}>
            <h2 id="more-help" className="mb-3 text-xl font-extrabold text-brand-navy-dark md:mb-4 md:text-[22px]">
               {t.home.moreHelp}
            </h2>
            <ul className="grid grid-cols-3 gap-2.5 md:max-w-[900px] md:gap-4">
               {moreHelp.map(({ key, icon: Icon }) => {
                  const item = t.home.moreHelpItems[key];

                  return (
                     <li key={key} className="flex">
                        <Link
                           href={{ pathname: sitePages.askQuestion.href, query: { q: item.question } }}
                           className="flex w-full flex-col items-center gap-2 rounded-[14px] border-2 border-brand-line bg-white px-1.5 py-3.5 text-center text-[15px] font-bold text-brand-navy-dark hover:border-brand-navy md:min-h-[76px] md:flex-row md:gap-3.5 md:px-[18px] md:text-left md:text-lg"
                        >
                           <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand-navy md:size-12">
                              <Icon aria-hidden="true" className="size-6" />
                           </span>
                           {item.label}
                        </Link>
                     </li>
                  );
               })}
            </ul>
         </section>
      </>
   );
}