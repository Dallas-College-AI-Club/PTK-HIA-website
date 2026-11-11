"use client"

import { ArrowRight, MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { getMessages } from "@/lib/i18n"
import { pageContainer } from "@/lib/layout"
import { isActivePage, sitePages } from "@/lib/site-pages"
import { cn } from "@/lib/utils"

/**
 * "Still have a question?" box above the footer.
 * Shown on every page except Home (it already has the chat box)
 * and Ask a Question (the chatbot page itself).
 */
function StillHaveQuestion() {
  const t = getMessages()
  const pathname = usePathname()
  const chatbotHref = sitePages.askQuestion.href

  if (isActivePage(pathname, sitePages.home.href) || isActivePage(pathname, chatbotHref)) return null

  return (
    <section aria-labelledby="still-have-question" className={cn(pageContainer, "pb-5 md:pb-10")}>
      <div className="flex flex-col gap-3 rounded-2xl border-2 border-brand-line bg-brand-tint p-4 md:flex-row md:items-center md:gap-5 md:rounded-[18px] md:px-7 md:py-6">
        <div className="flex items-center gap-3 md:flex-1 md:gap-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-navy md:size-14 md:rounded-[14px]">
            <MessageCircle aria-hidden="true" className="size-6 md:size-7" />
          </span>
          <div className="min-w-0">
            <h2 id="still-have-question" className="text-[19px] font-extrabold text-brand-navy-dark md:text-[22px]">
              {t.layout.stillHaveQuestion}
            </h2>
            <p className="hidden text-brand-muted md:block">{t.layout.stillHaveQuestionBody}</p>
          </div>
        </div>
        <Link
          href={chatbotHref}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-navy px-3 py-1 text-center font-bold text-white hover:bg-brand-navy-dark md:min-h-[52px] md:px-[22px] md:text-[17px]"
        >
          <span className="md:hidden">{t.layout.askInYourLanguage}</span>
          <span className="hidden md:inline">{t.pages.askQuestion}</span>
          <ArrowRight aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  )
}

export { StillHaveQuestion }
