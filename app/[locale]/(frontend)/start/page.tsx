import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { getMessages } from "@/lib/i18n";
import { pageContainer } from "@/lib/layout";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
   const t = getMessages(await getLocale());

   return {
      title: `${t.onboarding.title} | ${t.brand.name}`,
      description: t.onboarding.intro,
   };
}

/**
 * Onboarding (issue #49): 2 quick picture questions, then the chatbot opens
 * with questions that match the answers. Linked from Home ("Not sure where to
 * start?"). The questions live in lib/onboarding.ts.
 */
export default async function Start() {
   const t = getMessages(await getLocale());

   return (
      <div className={cn(pageContainer, "max-w-[960px] pt-3 pb-8 md:pt-6 md:pb-14")}>
         <div className="mb-5 md:mb-8">
            <h1 className="text-[32px] leading-tight font-extrabold text-brand-navy-dark md:text-[44px]">
               {t.onboarding.title}
            </h1>
            <p className="mt-1.5 text-[17px] text-brand-muted md:text-xl">{t.onboarding.intro}</p>
         </div>
         <div className="md:rounded-[18px] md:border md:border-brand-line md:bg-white md:p-8">
            <OnboardingWizard />
         </div>
      </div>
   );
}
