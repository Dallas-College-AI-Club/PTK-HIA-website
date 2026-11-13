import { getLocale } from "next-intl/server";
import { Suspense } from "react";

import { BackArrow, ChatPanel } from "@/components/ui/chat-panel";
import { getMessages } from "@/lib/i18n";
import { pageContainer } from "@/lib/layout";
import { cn } from "@/lib/utils";

export default async function Chatbot() {
   const t = getMessages(await getLocale());

   return (
      <div className={cn(pageContainer, "max-w-[860px] pt-3 pb-6 md:pt-6 md:pb-12")}>
         <div className="mb-4 flex items-center gap-3 md:mb-6">
            {/* Phones get this small arrow instead of the big "← Home" button. */}
            <BackArrow label={t.layout.backHome} />
            <div>
               <h1 className="text-2xl leading-tight font-extrabold text-brand-navy-dark md:text-[40px]">
                  {t.chatbot.title}
               </h1>
               <p className="text-[15px] text-brand-muted md:text-[19px] md:font-semibold">{t.chatbot.subtitle}</p>
            </div>
         </div>

         {/* ChatPanel reads ?q= from the address, which needs a Suspense boundary. */}
         <Suspense>
            <ChatPanel />
         </Suspense>
      </div>
   );
}