import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { getMessages } from "@/lib/i18n";
import { pageContainer } from "@/lib/layout";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
   const t = getMessages(await getLocale());

   return {
      title: `${t.privacy.title} | ${t.brand.name}`,
      description: t.privacy.description,
   };
}

/**
 * Privacy page (issue #53), linked from the footer. The text is in
 * lib/i18n (privacy). Every sentence must stay true: if the site starts
 * collecting or keeping something new (a form field, saving chats to the
 * database, analytics, a cookie), update the text in the same pull request.
 */
export default async function Privacy() {
   const t = getMessages(await getLocale());
   const text = t.privacy;

   return (
      <div className={cn(pageContainer, "max-w-[860px] pt-3 pb-8 md:pt-6 md:pb-14")}>
         <h1 className="text-[32px] leading-tight font-extrabold text-brand-navy-dark md:text-[44px]">{text.title}</h1>

         <div className="mt-4 flex flex-col gap-3 text-[17px] md:text-lg">
            {text.intro.map((paragraph) => (
               <p key={paragraph}>{paragraph}</p>
            ))}
         </div>

         <div className="mt-6 flex flex-col gap-4 md:mt-8 md:gap-5">
            {text.sections.map((section, index) => (
               <section
                  key={section.title}
                  aria-labelledby={`privacy-${index}`}
                  className="rounded-2xl border-2 border-brand-line bg-white p-4 md:p-6"
               >
                  <h2
                     id={`privacy-${index}`}
                     className="flex items-center gap-2.5 text-xl font-extrabold text-brand-navy-dark md:text-[22px]"
                  >
                     {index === 0 && <ShieldCheck aria-hidden="true" className="size-6 shrink-0 text-brand-navy" />}
                     {section.title}
                  </h2>
                  <ul className="mt-3 flex list-disc flex-col gap-2 ps-6 text-base md:text-[17px]">
                     {section.items.map((item) => (
                        <li key={item}>{item}</li>
                     ))}
                  </ul>
               </section>
            ))}
         </div>
      </div>
   );
}
