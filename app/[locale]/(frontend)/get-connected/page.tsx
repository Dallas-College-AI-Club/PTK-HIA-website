import { HandHeart, Mail } from "lucide-react";
import { getLocale } from "next-intl/server";

import { GetConnectedForm } from "@/components/ui/get-connected-form";
import { getMessages } from "@/lib/i18n";
import { pageContainer } from "@/lib/layout";

const PTK_EMAIL = "ptkalphaalphaxi1@gmail.com";

export default async function GetConnected() {
   const messages = getMessages(await getLocale());
   const t = messages.getConnected;
   const { comingSoon } = messages.layout;

   return (
      <div className={pageContainer}>
         <h1 className="mt-6 text-3xl font-extrabold">{t.title}</h1>
         <p className="mt-2 mb-6 max-w-xl text-lg">{t.intro}</p>
         <GetConnectedForm />

         <div className="mt-12 mb-8 flex max-w-xl flex-col gap-10">
            <section aria-labelledby="ptk-contact">
               <h2 id="ptk-contact" className="flex items-center gap-2 text-xl font-bold">
                  <Mail aria-hidden="true" className="size-6 shrink-0 text-brand-navy" />
                  {t.ptkContact.title}
               </h2>
               <p className="mt-2 mb-4">{t.ptkContact.body}</p>
               <a
                  href={`mailto:${PTK_EMAIL}`}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-brand-navy px-6 text-[17px] font-bold text-brand-navy hover:bg-brand-tint"
               >
                  <Mail aria-hidden="true" className="size-5 shrink-0" />
                  {t.ptkContact.emailButton}
               </a>
               {/* Shown in full so visitors can copy it if no email app opens. */}
               <p className="mt-2 text-sm break-all text-brand-muted">{PTK_EMAIL}</p>
            </section>

            <section aria-labelledby="peer-mentor">
               <h2 id="peer-mentor" className="flex items-center gap-2 text-xl font-bold">
                  <HandHeart aria-hidden="true" className="size-6 shrink-0 text-brand-navy" />
                  {t.peerMentor.title}
               </h2>
               <p className="mt-2">{t.peerMentor.body}</p>
               <p className="mt-1 text-sm font-bold text-brand-muted">{comingSoon}</p>
            </section>
         </div>
      </div>
   );
}