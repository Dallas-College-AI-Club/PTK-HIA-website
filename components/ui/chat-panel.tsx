"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ArrowLeft, ArrowRight, ArrowUp, ChevronRight, FileText, MessageCircle, RotateCcw, ThumbsDown, ThumbsUp, Users } from "lucide-react"
import { useLocale } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"
import { Link, usePathname, useRouter } from "@/i18n/navigation"

import { getMessageText, getSources, isRateLimitError, MAX_HISTORY_MESSAGES, MAX_QUESTION_LENGTH } from "@/lib/chatbot"
import { getMessages } from "@/lib/i18n"
// `import type` is removed at build time, so this server-only file never reaches the browser.
import type { ChatbotMessage } from "@/lib/server/tools/registry"
import { sitePages } from "@/lib/site-pages"
import { cn } from "@/lib/utils"

type Feedback = "yes" | "no"

/**
 * Sends questions to /api/chat. Only the last few messages go with each
 * question, so requests stay small (the server refuses long histories).
 */
const transport = new DefaultChatTransport<ChatbotMessage>({
  api: "/api/chat",
  prepareSendMessagesRequest: ({ messages, body }) => ({
    body: { ...body, messages: messages.slice(-MAX_HISTORY_MESSAGES) },
  }),
})

/**
 * The chatbot page's conversation (issue #28).
 *
 * How it works:
 * 1. A question arrives from the Home page as ?q=... (or the visitor types
 *    one, or taps a starter question).
 * 2. useChat sends it to /api/chat with the page's language.
 * 3. The server searches PTK's resources, and the AI answers from them in
 *    the visitor's language. The answer appears word by word.
 * 4. Under the answer: its sources (from the search, not the AI's text), a
 *    "Was this helpful?" question and a link to talk to a real person.
 */
function ChatPanel() {
  const locale = useLocale()
  const pageText = getMessages(locale)
  const t = pageText.chatbot
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const inputId = useId()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const askedFromUrl = useRef(false)

  const { messages, sendMessage, regenerate, status, error, clearError } = useChat<ChatbotMessage>({ transport })
  const [question, setQuestion] = useState("")
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({})

  const busy = status === "submitted" || status === "streaming"
  const lastMessage = messages.at(-1)
  // "Looking for an answer…" until the first words of the answer arrive.
  const thinking = busy && !(lastMessage?.role === "assistant" && getMessageText(lastMessage))

  function ask(text: string) {
    const q = text.trim().slice(0, MAX_QUESTION_LENGTH)
    if (!q || busy) return
    if (error) clearError()
    setQuestion("")
    void sendMessage({ text: q }, { body: { locale } })
  }

  function tryAgain() {
    clearError()
    void regenerate({ body: { locale } })
  }

  // A question sent from the Home page (?q=...) is asked once, then removed
  // from the address so a refresh doesn't ask it again.
  // It waits one moment (setTimeout) because in development React mounts the
  // page twice, and useChat cancels its request when the first copy goes away.
  useEffect(() => {
    const q = searchParams.get("q")
    if (!q || askedFromUrl.current) return
    const timer = setTimeout(() => {
      askedFromUrl.current = true
      router.replace(pathname, { scroll: false })
      ask(q)
    }, 0)
    return () => clearTimeout(timer)
    // ask() is intentionally left out: this should only run for the first ?q=.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pathname, router])

  // Keep the newest message in view.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" })
  }, [messages, thinking, error])

  const answers = messages.filter((message) => message.role === "assistant" && getMessageText(message))
  const hasAnswer = answers.length > 0
  const lastAnswerId = answers.at(-1)?.id

  return (
    <div className="flex flex-col gap-4 md:rounded-[18px] md:border md:border-brand-line md:bg-white md:p-6">
      <div role="log" aria-label={t.conversationLabel} aria-busy={busy} className="flex flex-col gap-3 md:gap-4">
        {messages.length === 0 && !busy && (
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
                  onClick={() => ask(starter)}
                  className="flex min-h-[52px] items-center gap-2.5 rounded-[14px] border-2 border-brand-line bg-white px-3.5 py-2 text-start text-base font-bold text-brand-navy-dark hover:border-brand-navy"
                >
                  <span className="flex-1">{starter}</span>
                  <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-brand-navy" strokeWidth={2.5} />
                </button>
              ))}
            </div>
          </>
        )}

        {messages.map((message) => {
          const text = getMessageText(message)

          if (message.role === "user") {
            return (
              <div
                key={message.id}
                className="max-w-[85%] self-end rounded-[18px] rounded-br-[4px] bg-brand-navy px-4 py-3 font-semibold break-words whitespace-pre-wrap text-white md:max-w-[70%] md:text-[17px]"
              >
                <span className="sr-only">{t.youSaid} </span>
                {text}
              </div>
            )
          }

          // An answer with no words yet is shown as "Looking for an answer…" below.
          if (!text) return null

          const stillWriting = busy && message.id === lastMessage?.id
          const sources = stillWriting ? [] : getSources(message)

          return (
            <BotBubble key={message.id} name={t.botName}>
              <p className="break-words whitespace-pre-wrap">{text}</p>
              {sources.length > 0 && (
                <ul className="flex flex-col gap-0.5">
                  {sources.map((source) => (
                    <li key={source.sourceUrl}>
                      <SourceLink label={`${t.source} ${source.sourceLabel}`} href={source.sourceUrl} />
                    </li>
                  ))}
                </ul>
              )}
              {message.id === lastAnswerId && !stillWriting && !error && (
                <HelpfulQuestion
                  value={feedback[message.id]}
                  onChoose={(choice) => setFeedback((all) => ({ ...all, [message.id]: choice }))}
                />
              )}
            </BotBubble>
          )
        })}

        {thinking && (
          <BotBubble name={t.botName}>
            <p role="status" className="text-brand-muted">{t.thinking}</p>
          </BotBubble>
        )}

        {error && (
          <BotBubble name={t.botName}>
            <p role="alert">{isRateLimitError(error) ? t.tooManyQuestions : t.error}</p>
            <button
              type="button"
              onClick={tryAgain}
              className="flex h-11 w-fit items-center gap-2 rounded-full border-2 border-brand-navy bg-white px-4 text-[15px] font-bold text-brand-navy hover:bg-brand-tint"
            >
              <RotateCcw aria-hidden="true" className="size-[18px]" />
              {t.tryAgain}
            </button>
          </BotBubble>
        )}
        <div ref={endRef} />
      </div>

      {(hasAnswer || error) && (
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
          ask(question)
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
            maxLength={MAX_QUESTION_LENGTH}
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
            disabled={busy}
            className="flex size-[52px] shrink-0 items-center justify-center rounded-xl bg-brand-navy font-bold text-white hover:bg-brand-navy-dark disabled:opacity-60 md:h-[54px] md:w-auto md:gap-2 md:px-6 md:text-[17px]"
          >
            <ArrowUp aria-hidden="true" className="size-[22px] md:hidden" strokeWidth={2.5} />
            <span aria-hidden="true" className="hidden md:inline">{t.askButton}</span>
            <ArrowRight aria-hidden="true" className="hidden size-5 md:block" strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-[13px] leading-snug text-brand-muted md:text-[15px]">{pageText.home.aiNotice}</p>
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

  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cn(className, "underline")}>
      {content}
    </a>
  ) : (
    <span className={className}>{content}</span>
  )
}

function HelpfulQuestion({ value, onChoose }: { value?: Feedback; onChoose: (choice: Feedback) => void }) {
  const t = getMessages(useLocale()).chatbot

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
