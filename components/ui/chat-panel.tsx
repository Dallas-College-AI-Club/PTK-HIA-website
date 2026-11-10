"use client"

import { ArrowLeft, ArrowRight, ArrowUp, ChevronRight, FileText, MessageCircle, ThumbsDown, ThumbsUp, Users } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"

import { askChatbot } from "@/lib/chatbot"
import { getMessages } from "@/lib/i18n"
import { sitePages } from "@/lib/site-pages"
import { cn } from "@/lib/utils"

type ChatMessage =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "bot"; text: string; sourceLabel?: string; sourceUrl?: string; failed?: boolean }

type Feedback = "yes" | "no"

/**
 * The chatbot page's conversation (issue: chatbot page UI).
 *
 * How it works:
 * 1. A question arrives from the Home page as ?q=... (or the visitor types
 *    one, or taps a starter question).
 * 2. The question is added to the list as a "user" message.
 * 3. askChatbot() in lib/chatbot.ts gets the answer. For now that's a
 *    placeholder; later it calls the backend (RAG).
 * 4. The answer is added as a "bot" message with its source, a
 *    "Was this helpful?" question and a link to talk to a real person.
 */
function ChatPanel() {
  const t = getMessages().chatbot
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const inputId = useId()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)
  const askedFromUrl = useRef(false)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [question, setQuestion] = useState("")
  const [thinking, setThinking] = useState(false)
  const [feedback, setFeedback] = useState<Record<number, Feedback>>({})

  async function ask(text: string) {
    const q = text.trim()
    if (!q || thinking) return

    setMessages((list) => [...list, { id: nextId.current++, role: "user", text: q }])
    setQuestion("")
    setThinking(true)
    try {
      const answer = await askChatbot(q)
      setMessages((list) => [...list, { id: nextId.current++, role: "bot", ...answer }])
    } catch {
      setMessages((list) => [...list, { id: nextId.current++, role: "bot", text: t.error, failed: true }])
    } finally {
      setThinking(false)
    }
  }

  // A question sent from the Home page (?q=...) is asked once, then removed
  // from the address so a refresh doesn't ask it again.
  useEffect(() => {
    const q = searchParams.get("q")
    if (!q || askedFromUrl.current) return
    askedFromUrl.current = true
    router.replace(pathname, { scroll: false })
    void ask(q)
    // ask() is intentionally left out: this should only run for the first ?q=.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pathname, router])

  // Keep the newest message in view.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" })
  }, [messages, thinking])

  const hasAnswer = messages.some((message) => message.role === "bot")
  const lastBotId = [...messages].reverse().find((message) => message.role === "bot")?.id

  return (
    <div className="flex flex-col gap-4 md:rounded-[18px] md:border md:border-brand-line md:bg-white md:p-6">
      <div role="log" aria-label={t.conversationLabel} className="flex flex-col gap-3 md:gap-4">
        {messages.length === 0 && !thinking && (
          <>
            <BotBubble name={t.botName}>
              <p>{t.greeting}</p>
            </BotBubble>
            <div className="flex flex-col gap-2">
              <h2 className="text-[15px] font-bold text-brand-muted">{t.tapAQuestion}</h2>
              {t.starterQuestions.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => void ask(starter)}
                  className="flex min-h-[52px] items-center gap-2.5 rounded-[14px] border-2 border-brand-line bg-white px-3.5 py-2 text-start text-base font-bold text-brand-navy-dark hover:border-brand-navy"
                >
                  <span className="flex-1">{starter}</span>
                  <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-brand-navy" strokeWidth={2.5} />
                </button>
              ))}
            </div>
          </>
        )}

        {messages.map((message) =>
          message.role === "user" ? (
            <div
              key={message.id}
              className="max-w-[85%] self-end rounded-[18px] rounded-br-[4px] bg-brand-navy px-4 py-3 font-semibold text-white md:max-w-[70%] md:text-[17px]"
            >
              <span className="sr-only">{t.youSaid} </span>
              {message.text}
            </div>
          ) : (
            <BotBubble key={message.id} name={t.botName}>
              <p>{message.text}</p>
              {message.sourceLabel && (
                <SourceLink label={`${t.source} ${message.sourceLabel}`} href={message.sourceUrl} />
              )}
              {message.id === lastBotId && !message.failed && (
                <HelpfulQuestion
                  value={feedback[message.id]}
                  onChoose={(choice) => setFeedback((all) => ({ ...all, [message.id]: choice }))}
                />
              )}
            </BotBubble>
          ),
        )}

        {thinking && (
          <BotBubble name={t.botName}>
            <p role="status" className="text-brand-muted">{t.thinking}</p>
          </BotBubble>
        )}
        <div ref={endRef} />
      </div>

      {hasAnswer && (
        <Link
          href={sitePages.talkToSomeone.href}
          className="flex min-h-[60px] items-center gap-3 rounded-2xl border-[3px] border-brand-navy bg-brand-gold-soft px-3.5 py-2 text-brand-navy-dark md:min-h-[68px] md:gap-3.5 md:px-[18px]"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-gold md:size-11">
            <Users aria-hidden="true" className="size-[22px] md:size-6" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="font-extrabold md:text-lg">{t.talkToPerson}</span>
            <span className="text-sm text-brand-muted md:text-[15px]">{t.talkToPersonBody}</span>
          </span>
          <ChevronRight aria-hidden="true" className="size-[22px] shrink-0 text-brand-navy" strokeWidth={2.5} />
        </Link>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!question.trim()) {
            inputRef.current?.focus()
            return
          }
          void ask(question)
        }}
        className="flex flex-col gap-2 border-t border-brand-line pt-3 md:border-brand-line-soft md:pt-4"
      >
        <label htmlFor={inputId} className={cn("font-bold text-brand-navy-dark", !hasAnswer && "sr-only")}>
          {hasAnswer ? t.askAnother : t.inputLabel}
        </label>
        <div className="flex items-end gap-2 md:gap-2.5">
          <textarea
            ref={inputRef}
            id={inputId}
            name="question"
            rows={1}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              // Enter sends, Shift+Enter adds a new line. Ignore Enter while an
              // input-method keyboard (Burmese, Arabic…) is still composing a word.
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
            placeholder={t.inputLabel}
            className="field-sizing-content min-h-[52px] w-full min-w-0 flex-1 resize-none rounded-xl border-2 border-brand-navy bg-white px-3.5 py-3 text-base text-brand-ink placeholder:text-brand-muted md:min-h-[54px] md:px-4 md:text-[17px]"
          />
          {/* Phone: square arrow button. Desktop: "Ask →" like the Home page. */}
          <button
            type="submit"
            aria-label={t.send}
            disabled={thinking}
            className="flex size-[52px] shrink-0 items-center justify-center rounded-xl bg-brand-navy font-bold text-white hover:bg-brand-navy-dark disabled:opacity-60 md:h-[54px] md:w-auto md:gap-2 md:px-6 md:text-[17px]"
          >
            <ArrowUp aria-hidden="true" className="size-[22px] md:hidden" strokeWidth={2.5} />
            <span aria-hidden="true" className="hidden md:inline">{t.askButton}</span>
            <ArrowRight aria-hidden="true" className="hidden size-5 md:block" strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-[13px] leading-snug text-brand-muted md:text-[15px]">{getMessages().home.aiNotice}</p>
      </form>
    </div>
  )
}

function BotBubble({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="flex max-w-[92%] flex-col gap-2 self-start rounded-[18px] rounded-bl-[4px] border-2 border-brand-line bg-white px-4 py-3.5 md:max-w-[80%] md:bg-brand-page md:text-[17px]">
      <span className="flex items-center gap-2 text-sm font-extrabold text-brand-navy md:text-[15px]">
        <span className="flex size-7 items-center justify-center rounded-lg bg-brand-tint">
          <MessageCircle aria-hidden="true" className="size-4" strokeWidth={2.2} />
        </span>
        {name}
      </span>
      {children}
    </div>
  )
}

function SourceLink({ label, href }: { label: string; href?: string }) {
  const content = (
    <>
      <FileText aria-hidden="true" className="size-4 shrink-0" />
      {label}
    </>
  )
  const className = "flex min-h-8 items-center gap-1.5 text-sm font-bold text-brand-navy md:text-[15px]"

  // No link until the backend sends real sources.
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cn(className, "underline")}>
      {content}
    </a>
  ) : (
    <span className={className}>{content}</span>
  )
}

function HelpfulQuestion({ value, onChoose }: { value?: Feedback; onChoose: (choice: Feedback) => void }) {
  const t = getMessages().chatbot

  // TODO(backend): save the feedback so the team can see which answers need work.
  if (value) {
    return <p role="status" className="text-[15px] font-semibold text-brand-muted">{t.thanksForFeedback}</p>
  }

  const buttonClass =
    "flex h-11 min-w-[76px] items-center justify-center gap-1.5 rounded-full border-2 border-brand-line bg-white px-3.5 text-[15px] font-bold text-brand-navy hover:border-brand-navy"

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      <span className="me-auto text-[15px] font-semibold text-brand-muted">{t.helpful}</span>
      <button type="button" onClick={() => onChoose("yes")} className={buttonClass}>
        <ThumbsUp aria-hidden="true" className="size-[18px]" />
        {t.yes}
      </button>
      <button type="button" onClick={() => onChoose("no")} className={buttonClass}>
        <ThumbsDown aria-hidden="true" className="size-[18px]" />
        {t.no}
      </button>
    </div>
  )
}

/** Small round "back to Home" arrow, used next to the title on phones. */
function BackArrow({ label }: { label: string }) {
  return (
    <Link
      href={sitePages.home.href}
      aria-label={label}
      className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-brand-navy bg-white text-brand-navy hover:bg-brand-tint md:hidden"
    >
      <ArrowLeft aria-hidden="true" className="size-[22px]" strokeWidth={2.5} />
    </Link>
  )
}

export { BackArrow, ChatPanel }
