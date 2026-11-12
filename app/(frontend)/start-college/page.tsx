import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

import { getMessages } from "@/lib/i18n";
import { pageContainer } from "@/lib/layout";
import { sitePages } from "@/lib/site-pages";

// For now this page sends visitors to Dallas College's own registration page.
const REGISTRATION_URL = "https://www.dallascollege.edu/admissions/registration/";

export default function StartCollege() {
   const t = getMessages();

   return (
      <div className={pageContainer}>
         <h1 className="mt-6 text-3xl font-extrabold">{t.pages.startCollege}</h1>
         <p className="mt-2 mb-6 max-w-xl text-lg">{t.startCollege.intro}</p>

         <a
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-navy px-6 py-2 text-[17px] font-bold text-white hover:bg-brand-navy-dark"
         >
            {t.startCollege.registrationLink}
            <ExternalLink aria-hidden="true" className="size-5 shrink-0" />
            <span className="sr-only">{t.startCollege.opensNewTab}</span>
         </a>

         <p className="mt-6 mb-8 max-w-xl text-brand-muted">
            {t.startCollege.englishNote}{" "}
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