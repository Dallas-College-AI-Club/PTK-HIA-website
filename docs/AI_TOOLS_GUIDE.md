# AI Tools Guide

How our chatbot can run our own server code while it answers, and how to add a
new "tool". Started in issue #42. The layout follows the AI Club's earlier
[Success Coach chatbot](https://github.com/Dallas-College-AI-Club/success-coach-chatbot)
(`apps/frontend/lib/tools/`).

## What is a tool?

A **tool** is a function on our server that the AI can ask us to run. The AI
can't search PTK's resources by itself, but it can say "please run
`search_resources` with the query 'free bus pass'". Our server runs it, sends
the result back to the AI, and the AI writes its answer using that result.

## How one question flows

1. A student asks: "How do I get a free bus pass?"
2. **Step 1 (AI):** the AI reads the tool's description and **asks for a tool**:
   `search_resources({ query: "free bus pass" })`.
3. **Our server runs the tool** and gets `{ found: true, results: [...] }`.
4. **Step 2 (AI):** the results go back to the AI, which **writes the answer**
   and gives the result's link.

All of this happens inside one request to `/api/chat`. We allow up to 3 steps
(`stopWhen: isStepCount(3)`), so the AI can't keep calling tools forever.

## How useChat shows tool calls

Older AI SDK guides (and issue #42) mention `message.toolInvocations`. **That
was removed.** In AI SDK 7, which we use, each message has a list of
`parts`, in the order they happened:

| Part `type` | What it is |
| :--- | :--- |
| `"step-start"` | A new AI step began (e.g. step 2, after a tool finished) |
| `"tool-search_resources"` | One tool call: `tool-` + the tool's name |
| `"text"` | Words of the answer |

A tool part also has a `state`, which changes while it runs:

| `state` | Meaning | `/dev/chat-test` shows |
| :--- | :--- | :--- |
| `"input-streaming"` | The AI is still writing the tool's input | "Searching PTK resources…" |
| `"input-available"` | Input is ready; our server is running the tool | "Searching PTK resources…" |
| `"output-available"` | The tool finished; `part.output` has the result | "Searched PTK resources · 1 result" + links |
| `"output-error"` | The tool failed; `part.errorText` says why | "Couldn't search PTK resources" (red) |

So one answer with a search looks like:
`step-start` → `tool-search_resources` (states change as it runs) →
`step-start` → `text`. The test page shows **"Thinking…"** whenever the AI is
working but nothing new is on screen yet: before the first step, and between
the tool finishing and the answer starting.

Helpers from `ai`: `isStaticToolUIPart(part)` checks if a part is a tool
call, and `getToolName(part)` gives its name.

## Where things live

| File | What it does |
| :--- | :--- |
| `lib/server/tools/search-resources.ts` | One tool: its `DESCRIPTION`, `INPUT_SCHEMA` and `EXECUTE`. |
| `lib/server/tools/registry.ts` | `TOOL_REGISTRY`: every tool the AI can use. Also the `ChatTestMessage` type. |
| `lib/tool-names.ts` | Each tool's name and progress text (running / done / failed). No server code, so the browser can use it. |
| `app/api/chat/route.ts` | Gives `TOOL_REGISTRY` to the AI (only where dev tools are on, for now). |
| `components/dev/chat-test.tsx` | Shows each tool call on `/dev/chat-test` with its progress text, source links and raw JSON. |

## How to add a tool

1. **Name it** in `lib/tool-names.ts` (snake_case), with its progress text:

   ```ts
   export const GET_CAMPUS_HOURS_TOOL_NAME = "get_campus_hours";

   // inside TOOL_LABELS:
   [GET_CAMPUS_HOURS_TOOL_NAME]: {
      running: "Checking campus hours",
      done: "Checked campus hours",
      failed: "Couldn't check campus hours",
   },
   ```

2. **Write it** in a new file, `lib/server/tools/get-campus-hours.ts`:

   ```ts
   import "server-only";

   import { z } from "zod";

   // Tell the AI what it's for and WHEN to use it. The AI reads this.
   export const DESCRIPTION = [
      "Returns the opening hours for one Dallas College campus.",
      "Call this tool when the student asks when a campus is open.",
   ].join("\n");

   // What the AI must send. zod checks it before EXECUTE runs.
   export const INPUT_SCHEMA = z.object({
      campus: z.string().trim().min(1).describe("Campus name, e.g. 'El Centro'."),
   });

   // Runs on our server. Return small, plain JSON with a `found` flag.
   export async function EXECUTE(input: z.infer<typeof INPUT_SCHEMA>) {
      const { campus } = INPUT_SCHEMA.parse(input);
      return { found: true, campus, hours: "Mon to Fri, 7 a.m. to 10 p.m." };
   }
   ```

3. **Register it** in `lib/server/tools/registry.ts`:

   ```ts
   import * as getCampusHours from "./get-campus-hours";

   // inside TOOL_REGISTRY:
   [GET_CAMPUS_HOURS_TOOL_NAME]: tool({
      description: getCampusHours.DESCRIPTION,
      inputSchema: getCampusHours.INPUT_SCHEMA,
      execute: getCampusHours.EXECUTE,
   }),
   ```

4. **Show it** on `/dev/chat-test`: the progress line uses its text from
   `lib/tool-names.ts` automatically. `ToolStep` in
   `components/dev/chat-test.tsx` also reads `query` and `results`; if the new
   tool's input or output is shaped differently, `npm run build` points to the
   exact lines to update.
5. **Test it** on `/dev/chat-test` (see below).

## Our rules for tools

- **Server only.** Tool files live in `lib/server/tools/` and start with
  `import "server-only"`. Browser code may only use `lib/tool-names.ts`, or
  `import type` from the registry.
- **Check the input with zod.** Never trust what the AI sends.
- **Return small, plain JSON with `found`.** `found: false` means "not in our
  verified records", and the AI is told not to guess.
- **Never return secrets** (API keys, connection strings, student data the
  question doesn't need). Whatever a tool returns is sent to the AI provider.
- **Write the `DESCRIPTION` for the AI.** Say what the tool does, when to call
  it, give examples, and say what to do when nothing is found. This matters
  more than the code for whether the AI uses it well.
- **Links come from the tool, not the AI.** Show source links from the tool's
  output. Small models can garble a URL when they retype it.
- **Dev tools only until reviewed.** New tools run only where dev tools are on
  (local, or a Vercel preview with `ENABLE_DEV_TOOLS=true`), never on the live site.

## How to test

1. In `.env.local`, set `LLM_MODEL_NAME` to a model that **supports tool calling**.
   On OpenRouter's model list, filter by "Tools". Many free models don't
   support it, and then the AI simply never calls the tool.
2. Run `npm run dev` and open `http://localhost:3000/dev/chat-test`.
3. Keep **Use tools** checked and ask: "How do I get a free bus pass?"
   - You should see "Searching PTK resources · free bus pass…", then
     "Searched PTK resources · free bus pass · 1 result" with its link
     ("Get your DART GoPass"), then the answer.
   - Click the line to see the raw input and output.
4. Ask the AI to `Use search_resources with the query "fail-test"`: you should
   see a red "Couldn't search PTK resources" line.
5. Press **Clear chat**, uncheck **Use tools**, and ask again: no tool line appears.

## Good to know

- **Errors:** if a tool throws an error, the AI is told it failed and can still
  reply. With dev tools on, the real error message is shown. The real search
  should catch database errors and return `found: false` instead of throwing.
- **Stop:** pressing Stop cancels the AI as well (`abortSignal`), and the line
  shows "(stopped)". The next message still works.
- **The real search (#28, #45):** `search_resources` searches the text and
  links on our own pages (from `lib/i18n/en.ts`) with a simple word match for
  now. Child care and counseling questions return the Talk to Someone page,
  because our site has no page for them yet. The real version will use the
  **Xenova/multilingual-e5-small** model: it turns the query into 384 numbers
  (an "embedding") and finds the chunks whose numbers are closest. The Python
  pipeline (#45) creates the chunk embeddings with the same model. For this
  model, queries start with `"query: "` and chunks with `"passage: "`. Only
  `EXECUTE` changes; the description, input and output stay the same.
- **Who calls the search:** for the live site we may run the search on
  *every* question instead of letting the AI choose, because small models
  sometimes skip tools. The search code is the same either way: only who calls
  it changes.
- **Other languages:** the tool asks the AI to write the search query in
  English, because PTK's documents are in English. The sample search needs
  that. The e5 model can match other languages too, but English queries
  against English documents usually match best. The AI still answers in the
  student's language.
- **Showing tool calls:** the test page follows shadcn's
  [Tool](https://ui.shadcn.com/docs/ai-elements/base/tool) pattern, built
  from our `Trace` and `Code Block` components.
