import { ArrowRight, ClipboardCheck, ExternalLink, MapPin, Moon, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getMessages, type Messages } from "@/lib/i18n";
import { pageContainer } from "@/lib/layout";
import { sitePages } from "@/lib/site-pages";

/**
 * ESL & Classes page. The README lists what it holds: night and weekend
 * programs, registration steps, and locations. Same format as the
 * financial-aid page: intro, one section per topic (icon, heading, short text,
 * link row), then a "Need help?" note.
 *
 * All words are in lib/i18n/en.ts (the "esl" block). The web addresses are the
 * same in every language, so they live here.
 */
const DALLAS_COLLEGE = "https://www.dallascollege.edu";

const LINKS = {
   nightsWeekends: `${DALLAS_COLLEGE}/special-programs/nights-weekends/`,
   registration: `${DALLAS_COLLEGE}/admissions/registration/`,
   locations: `${DALLAS_COLLEGE}/locations/`,
} as const;

type SectionKey = keyof Messages["esl"]["sections"];
type LinkKey = keyof typeof LINKS;

const SECTIONS: { key: SectionKey; icon: LucideIcon; links: LinkKey[] }[] = [
   { key: "nightsWeekends", icon: Moon, links: ["nightsWeekends"] },
   { key: "registration", icon: ClipboardCheck, links: ["registration"] },
   { key: "locations", icon: MapPin, links: ["locations"] },
];

export async function generateMetadata(): Promise<Metadata> {
   const t = getMessages(await getLocale());

   return {
      title: `${t.esl.title} | ${t.brand.name}`,
      description: t.esl.description,
   };
}

export default async function Esl() {
   const t = getMessages(await getLocale());

   return (
      <div className={pageContainer}>
         <h1 className="mt-6 text-3xl font-extrabold">{t.esl.title}</h1>
         <p className="mt-2 mb-6 max-w-xl text-lg">{t.esl.intro}</p>

         <div className="flex max-w-3xl flex-col gap-10">
            {SECTIONS.map(({ key, icon: Icon, links }) => {
               const section = t.esl.sections[key];

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
                           const link = t.esl.links[linkKey];
                           return (
                              <li key={linkKey}>
                                 <a
                                    href={LINKS[linkKey]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 border-brand-line bg-white px-4 py-3 hover:border-brand-navy"
                                 >
                                    <span className="text-[17px] font-bold text-brand-navy-dark">
                                       {link.label}
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
            {t.esl.englishNote}{" "}
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
