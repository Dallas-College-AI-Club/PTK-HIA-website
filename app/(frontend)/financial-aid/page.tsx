import { ArrowRight, BusFront, ExternalLink, GraduationCap, Landmark, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { getMessages, type Messages } from "@/lib/i18n";
import { pageContainer } from "@/lib/layout";
import { sitePages } from "@/lib/site-pages";

// Official Dallas College pages, from PTK's knowledge base directory.
const LINKS = {
   aidOverview: "https://www.dallascollege.edu/paying-for-college/financial-aid/",
   fafsa: "https://www.dallascollege.edu/paying-for-college/financial-aid/apply/fafsa/",
   tasfa: "https://www.dallascollege.edu/paying-for-college/financial-aid/apply/tasfa/",
   keepAid: "https://www.dallascollege.edu/paying-for-college/financial-aid/maintain-eligibility/",
   goPass: "https://www.dallascollege.edu/resources/dart-gopass/",
   scholarships: "https://www.dallascollege.edu/paying-for-college/scholarships-aid/",
   dreamers: "https://www.dallascollege.edu/students/dreamers/",
} as const;

type SectionKey = keyof Messages["financialAid"]["sections"];
type LinkKey = keyof typeof LINKS;

const SECTIONS: { key: SectionKey; icon: LucideIcon; links: LinkKey[] }[] = [
   { key: "aid", icon: Landmark, links: ["aidOverview", "fafsa", "tasfa", "keepAid"] },
   { key: "busPass", icon: BusFront, links: ["goPass"] },
   { key: "scholarships", icon: GraduationCap, links: ["scholarships", "dreamers"] },
];

export default function FinancialAid() {
   const t = getMessages();

   return (
      <div className={pageContainer}>
         <h1 className="mt-6 text-3xl font-extrabold">{t.pages.payForCollege}</h1>
         <p className="mt-2 mb-6 max-w-xl text-lg">{t.financialAid.intro}</p>

         <div className="flex max-w-3xl flex-col gap-10">
            {SECTIONS.map(({ key, icon: Icon, links }) => {
               const section = t.financialAid.sections[key];
               return (
                  <section key={key} aria-labelledby={`section-${key}`}>
                     <div className="flex items-center gap-3">
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-brand-tint text-brand-navy">
                           <Icon aria-hidden="true" className="size-7" />
                        </span>
                        <h2
                           id={`section-${key}`}
                           className="text-xl font-extrabold text-brand-navy-dark md:text-[22px]"
                        >
                           {section.title}
                        </h2>
                     </div>
                     <p className="mt-3 mb-4 text-lg">{section.body}</p>

                     <ul className="flex flex-col gap-3">
                        {links.map((linkKey) => {
                           const link = t.financialAid.links[linkKey];
                           return (
                              <li key={linkKey}>
                                 <a
                                    href={LINKS[linkKey]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 border-brand-line bg-white px-4 py-3 hover:border-brand-navy"
                                 >
                                    <span>
                                       <span className="block text-[17px] font-bold text-brand-navy-dark">
                                          {link.label}
                                       </span>
                                       {"hint" in link && (
                                          <span className="block text-[15px] text-brand-muted md:text-base">
                                             {link.hint}
                                          </span>
                                       )}
                                    </span>
                                    <ExternalLink aria-hidden="true" className="size-5 shrink-0 text-brand-navy" />
                                    <span className="sr-only">{t.layout.opensNewTab}</span>
                                 </a>
                              </li>
                           );
                        })}
                     </ul>
                  </section>
               );
            })}
         </div>

         <p className="mt-6 mb-8 max-w-xl text-brand-muted">
            {t.financialAid.englishNote}{" "}
            <Link
               href={sitePages.talkToSomeone.href}
               className="inline-flex items-center gap-1 font-bold text-brand-navy underline"
            >
               {t.pages.talkToSomeone}
               <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
         </p>
      </div>
   );
}