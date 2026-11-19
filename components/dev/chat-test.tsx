"use client"

import { useChat } from "@ai-sdk/react"
import { getToolName, isStaticToolUIPart } from "ai"
import { CircleAlertIcon, SearchIcon, SparkleIcon } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"

import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"
import { MAX_SYSTEM_PROMPT_LENGTH } from "@/lib/chat-limits"
// `import type` is removed at build time, so this server-only file never reaches the browser.
import type { ChatTestMessage } from "@/lib/server/tools/registry"
import { TOOL_LABELS } from "@/lib/tool-names"

const DEFAULT_SYSTEM_PROMPT =
  "You are an academic advisor for Dallas College. Answer in short, simple steps. If you are not sure, say so and suggest talking to a Dallas College Success Coach. When tools are on, use search_resources before answering questions about Dallas College services, and include the source link."

/** One tool call inside an AI message (issue #42). */
type ToolPart = Extract<ChatTestMessage["parts"][number], { type: `tool-${string}` }>

/**
 * Developer test UI for /dev/chat-test (issue #30). English only: this is a
 * tool for the team, not a page for students.
 *
 * The system prompt and "Use tools" setting are sent with every message (not
 * set once on useChat), so changing them applies to the very next message.
 */
function ChatTest() {
  const systemId = useId()
  const messageId = useId()
  const toolsId = useId()
  const endRef = useRef<HTMLDivElement>(null)
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT)
  const [useTools, setUseTools] = useState(true)
  const [input, setInput] = useState("")

  const { messages, sendMessage, status, error, stop, setMessages, clearError } = useChat<ChatTestMessage>()
  const busy = status === "submitted" || status === "streaming"

  // "Thinking…": the AI is working but nothing new is on screen yet. That's
  // before its first word, and between steps (after a tool finishes, before
  // the answer starts). A running tool shows its own line instead.
  const lastMessage = messages.at(-1)
  const lastPart = lastMessage?.role === "assistant" ? lastMessage.parts.at(-1) : undefined
  const toolRunning =
    lastPart !== undefined &&
    isStaticToolUIPart(lastPart) &&
    (lastPart.state === "input-streaming" || lastPart.state === "input-available")
  const showingText = lastPart?.type === "text" && lastPart.text.length > 0
  const thinking = busy && !showingText && !toolRunning

  // Keep the newest message in view while it streams in.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" })
  }, [messages])

  function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    void sendMessage({ text }, { body: { systemPrompt, useTools } })
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

      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Settings: system prompt and tools */}
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

          <div className="mt-2 flex items-center gap-2">
            <input
              id={toolsId}
              type="checkbox"
              checked={useTools}
              onChange={(event) => setUseTools(event.target.checked)}
              // Switching mid-chat would leave tool calls the AI can no longer
              // see, which confuses some models, so it's locked until Clear chat.
              disabled={busy || messages.length > 0}
              className="size-5 accent-brand-navy"
            />
            <label htmlFor={toolsId} className="font-bold">
              Use tools
            </label>
          </div>
          <p className="text-sm text-brand-muted">
            {messages.length > 0
              ? "Clear the chat to change this."
              : "Lets the AI search sample PTK resources (search_resources) before answering. Your model must support tool calling. To test the error state, ask it to search for “fail-test”."}
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
                        : "flex max-w-full flex-col gap-2 self-start rounded-xl border border-brand-line bg-white px-3 py-2"
                    }
                  >
                    <span className="block text-xs font-bold opacity-75">
                      {message.role === "user" ? "You" : "Assistant"}
                    </span>
                    {/* Parts in the order they happened: tool steps first, then the answer. */}
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <span key={index} className="block whitespace-pre-wrap">
                            {part.text}
                          </span>
                        )
                      }
                      if (isStaticToolUIPart(part)) {
                        return <ToolStep key={part.toolCallId} part={part} busy={busy} />
                      }
                      return null
                    })}
                  </li>
                ))}
              </ul>
            )}
            {thinking && (
              <Trace className="mt-3">
                <TraceLine status="running">
                  <TraceIcon>
                    <SparkleIcon />
                  </TraceIcon>
                  <TraceTitle>Thinking…</TraceTitle>
                </TraceLine>
              </Trace>
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

/** The progress text for a tool, from lib/tool-names.ts (with a fallback for unlisted tools). */
function toolLabels(name: string) {
  return TOOL_LABELS[name] ?? { running: `Running ${name}`, done: `Ran ${name}`, failed: `Couldn't run ${name}` }
}

/**
 * Shows one tool call as a progress line, following shadcn's Tool pattern
 * (Trace + Code Block): a plain line while it runs, and a line you can click
 * to open (raw input and output) once it finishes. Works for any tool.
 *
 * Source links come straight from the tool's output, never from the AI's
 * text, so they can't be garbled (a lesson from the Success Coach chatbot).
 */
function ToolStep({ part, busy }: { part: ToolPart; busy: boolean }) {
  const labels = toolLabels(getToolName(part))
  const query = part.input?.query
  const withQuery = (text: string) => (query ? `${text} \u00b7 ${query}` : text)

  if (part.state === "output-available" || part.state === "output-error") {
    const failed = part.state === "output-error"
    const results = failed ? [] : part.output.results

    return (
      <Trace>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine status={failed ? "error" : undefined}>
              <TraceIcon>{failed ? <CircleAlertIcon /> : <SearchIcon />}</TraceIcon>
              <TraceTitle>
                {failed
                  ? withQuery(labels.failed)
                  : `${withQuery(labels.done)} \u00b7 ${results.length} ${results.length === 1 ? "result" : "results"}`}
              </TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm">
              <CodeBlockContent wrap className="max-h-64">
                {failed ? part.errorText : JSON.stringify({ input: part.input, output: part.output }, null, 2)}
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        {results.length > 0 && (
          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {results.map((result) => (
              <li key={result.source_url}>
                <a href={result.source_url} target="_blank" rel="noreferrer" className="text-brand-navy underline">
                  {result.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Trace>
    )
  }

  // Still waiting for the result. If the chat isn't busy any more, Stop was pressed.
  return (
    <Trace>
      <TraceLine status={busy ? "running" : "error"}>
        <TraceIcon>
          <SearchIcon />
        </TraceIcon>
        <TraceTitle>{busy ? `${withQuery(labels.running)}\u2026` : `${withQuery(labels.running)} (stopped)`}</TraceTitle>
      </TraceLine>
    </Trace>
  )
}

export { ChatTest }