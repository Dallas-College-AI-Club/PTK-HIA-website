"use client"

import { useChat } from "@ai-sdk/react"
import { useEffect, useId, useRef, useState } from "react"

import { MAX_SYSTEM_PROMPT_LENGTH } from "@/lib/chat-limits"

const DEFAULT_SYSTEM_PROMPT =
  "You are an academic advisor for Dallas College. Answer in short, simple steps. If you are not sure, say so and suggest talking to a Dallas College Success Coach."

/**
 * Developer test UI for /dev/chat-test (issue #30). English only: this is a
 * tool for the team, not a page for students.
 *
 * The system prompt is sent with every message (not set once on useChat),
 * so changing it applies to the very next message.
 */
function ChatTest() {
  const systemId = useId()
  const messageId = useId()
  const endRef = useRef<HTMLDivElement>(null)
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT)
  const [input, setInput] = useState("")

  const { messages, sendMessage, status, error, stop, setMessages, clearError } = useChat()
  const busy = status === "submitted" || status === "streaming"

  // Keep the newest message in view while it streams in.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" })
  }, [messages])

  function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    void sendMessage({ text }, { body: { systemPrompt } })
    setInput("")
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 text-brand-ink md:p-8">
      <header>
        <h1 className="text-2xl font-extrabold text-brand-navy-dark">Chat test (developer only)</h1>
        <p className="text-brand-muted">
          Tests OpenRouter through <code>/api/chat</code> with your own system prompt. Uses{" "}
          <code>OPENROUTER_API_KEY</code> and <code>LLM_MODEL_NAME</code> from <code>.env.local</code>. Not
          shown on the live site.
        </p>
      </header>

      <div className="grid flex-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* System prompt */}
        <section className="flex flex-col gap-2">
          <label htmlFor={systemId} className="font-bold">
            System prompt
          </label>
          <textarea
            id={systemId}
            value={systemPrompt}
            onChange={(event) => setSystemPrompt(event.target.value)}
            maxLength={MAX_SYSTEM_PROMPT_LENGTH}
            rows={10}
            className="min-h-40 w-full resize-y rounded-xl border-2 border-brand-line bg-white p-3 font-mono text-sm"
          />
          <p className="text-sm text-brand-muted">
            {systemPrompt.length} / {MAX_SYSTEM_PROMPT_LENGTH} characters. Applies to the next message you send.
          </p>
        </section>

        {/* Chat */}
        <section className="flex min-h-[28rem] flex-col gap-3">
          <div
            role="log"
            aria-label="Chat history"
            className="h-[28rem] overflow-y-auto rounded-xl border-2 border-brand-line bg-brand-page p-3 md:h-[32rem]"
          >
            {messages.length === 0 ? (
              <p className="text-brand-muted">No messages yet. Send one below.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {messages.map((message) => (
                  <li
                    key={message.id}
                    className={
                      message.role === "user"
                        ? "self-end rounded-xl bg-brand-navy px-3 py-2 text-white"
                        : "self-start rounded-xl border border-brand-line bg-white px-3 py-2"
                    }
                  >
                    <span className="block text-xs font-bold opacity-75">
                      {message.role === "user" ? "You" : "Assistant"}
                    </span>
                    <span className="whitespace-pre-wrap">
                      {message.parts.map((part) => (part.type === "text" ? part.text : "")).join("")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div ref={endRef} />
          </div>

          <p role="status" className="text-sm text-brand-muted">
            Status: <span className="font-bold">{status}</span>
          </p>

          {error && (
            <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border-2 border-red-700 bg-red-50 p-3 text-red-900">
              <p className="whitespace-pre-wrap">{error.message}</p>
              <button type="button" onClick={clearError} className="shrink-0 font-bold underline">
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={send} className="flex flex-col gap-2">
            <label htmlFor={messageId} className="font-bold">
              Message
            </label>
            <textarea
              id={messageId}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                // Enter sends, Shift+Enter adds a new line (not while an IME is composing).
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
              rows={3}
              placeholder="Type a test message"
              className="w-full resize-y rounded-xl border-2 border-brand-navy bg-white p-3"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="min-h-11 rounded-full bg-brand-navy px-5 font-bold text-white disabled:opacity-50"
              >
                Send
              </button>
              {busy && (
                <button
                  type="button"
                  onClick={() => void stop()}
                  className="min-h-11 rounded-full border-2 border-brand-navy px-5 font-bold text-brand-navy"
                >
                  Stop
                </button>
              )}
              <button
                type="button"
                onClick={() => setMessages([])}
                disabled={busy || messages.length === 0}
                className="min-h-11 rounded-full border-2 border-brand-line px-5 font-bold disabled:opacity-50"
              >
                Clear chat
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}

export { ChatTest }