"use client"

import { ArrowRight, Info, MessageCircle } from "lucide-react"
import { useRouter } from "@/i18n/navigation"
import { useId, useRef, useState } from "react"

import { getMessages } from "@/lib/i18n"
import { sitePages } from "@/lib/site-pages"
import { useLocale } from "next-intl"

/**
 * Home page chat box. Sends the question to the chatbot page as ?q=...
 * (the chatbot page reads it). Popular buttons fill in the box.
 *
 * Phone: question box on its own full-width line, Ask button below.
 * Desktop: question box and Ask button side by side.
 * The box grows with the text, so long languages are never cut off.
 */
function AskBox() {
  const t = getMessages(useLocale())
  const router = useRouter()
  const inputId = useId()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [question, setQuestion] = useState("")

  function ask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const q = question.trim()
    if (!q) {
      inputRef.current?.focus()
      return
    }
    router.push(`${sitePages.askQuestion.href}?q=${encodeURIComponent(q)}`)
  }

  function choosePopular(text: string) {
    setQuestion(text)
    inputRef.current?.focus()
  }

  return (
    <form
      onSubmit={ask}
      className="flex flex-col gap-3 rounded-2xl border border-brand-line bg-white p-4 shadow-[0_1px_3px_rgba(15,27,51,0.08)] md:gap-3.5 md:p-[22px]"
    >
      <label htmlFor={inputId} className="flex items-center gap-2 text-[17px] font-extrabold text-brand-navy-dark md:gap-2.5 md:text-[19px]">
        <MessageCircle aria-hidden="true" className="size-[22px] shrink-0 md:size-6" />
        {t.home.askLabel}
      </label>

      <div className="flex flex-col gap-2 md:flex-row md:gap-2.5">
        <textarea
          ref={inputRef}
          id={inputId}
          name="q"
          rows={2}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            // Enter sends, Shift+Enter adds a new line. Ignore Enter while an
            // input-method keyboard (Burmese, Arabic, Vietnamese…) is still
            // composing a word: that Enter confirms the word, not the question.
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              event.currentTarget.form?.requestSubmit()
            }
          }}
          placeholder={t.home.askPlaceholder}
          className="field-sizing-content min-h-[72px] w-full resize-none rounded-xl border-2 border-brand-navy bg-white p-3 text-base text-brand-ink placeholder:text-brand-muted md:min-h-[54px] md:flex-1 md:px-4 md:py-3 md:text-[17px]"
        />
        <button
          type="submit"
          className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-1 font-bold text-white hover:bg-brand-navy-dark md:min-h-[54px] md:self-start md:px-6 md:text-[17px]"
        >
          {t.home.askButton}
          <ArrowRight aria-hidden="true" className="size-5 shrink-0" strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[15px] font-semibold text-brand-muted">{t.home.popular}</span>
        {t.home.popularQuestions.map(({ label, question: text }) => (
          <button
            key={label}
            type="button"
            onClick={() => choosePopular(text)}
            className="min-h-11 rounded-[22px] bg-brand-tint px-4 py-1.5 text-[15px] font-bold text-brand-navy hover:bg-brand-line-soft"
          >
            {label}
          </button>
        ))}
      </div>

      <p className="flex items-start gap-2 text-[15px] text-brand-muted">
        <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
        {t.home.aiNotice}
      </p>
    </form>
  )
}

export { AskBox }
