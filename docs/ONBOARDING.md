# Onboarding ("Find what you need")

Added in issue #49. Two quick picture questions that help the chatbot start
with the right topics. Students reach it from the **"Not sure where to start?"**
button on Home. It lives at `/start` (Spanish: `/es/start`).

## Why it's built this way

Our students include English learners, refugees and working parents, so the
questions follow our rules (AGENTS.md and the MVP doc):

- **Tap, don't type.** Every answer is a big picture card.
- **Few words, few steps.** Two questions, and the second can be skipped.
- **Nothing sensitive.** No names, IDs or immigration status. Never add those.
- **Nothing saved.** The answers only travel to the chat in the page address.

## What happens

1. **Step 1: "What do you need help with?"** Tap one or more (required, but
   "I'm not sure" counts). Picking "I'm not sure" clears the others.
2. **Step 2: "Anything else about you?"** Optional: tap any, or Skip.
3. **Start chatting** opens the chatbot with the answers in the address, for
   example `/chatbot?needs=childcare,transit&about=parent`. The answers are
   also printed in the browser console (`[onboarding] answers`).
4. **The chat page** shows "You picked: …" (with a Change link), and starter
   questions for each need picked.
5. **Every question sent** includes the answers. The server keeps only answers
   from our list and tells the AI, in English, for example: "What do you need
   help with? Child care, Bus pass". The AI uses this to choose what to search
   for and to tailor its answer.

## How to add or change an answer

Everything is in **one list**: `ONBOARDING_STEPS` in `lib/onboarding.ts`. The
page, the chat and the server all read it, so nothing else needs changing.

**Add an answer** (example: "Food help"):

1. In `lib/onboarding.ts`, add it to a step's `options`. Pick an icon from
   [lucide.dev](https://lucide.dev/icons) and import it at the top:
   ```ts
   { id: "food", icon: Apple },
   ```
   The `id` is short, lowercase, and goes in the address, so keep it stable.
2. In `lib/i18n/en.ts`, add its words under `onboarding.options`. A `question`
   is optional: it becomes a starter question in the chat (step 1 only).
   ```ts
   food: { label: "Food help", question: "Is there free food for students?" },
   ```
3. Add the same key to `lib/i18n/es.ts` (and every other language file).
   `npx tsc --noEmit` lists any file that's missing it.

**Change an answer's words:** edit its `label` or `question` in the language
files. The `id` can stay the same.

**Remove an answer:** delete its line in `lib/onboarding.ts` and its words in
the language files. Old links that still mention it are ignored safely.

**Make an answer clear the others** (like "I'm not sure"): add
`exclusive: true` to it.

**Add a whole step:** add another `{ id, required, options }` to
`ONBOARDING_STEPS`, and its `title`, `hint` (and `error` if required) under
`onboarding.steps` in each language file. The "Step 1 of 3" counter and the
buttons adjust by themselves.

## Files

| File | What it does |
| :--- | :--- |
| `lib/onboarding.ts` | The steps and answers, plus helpers (cleaning answers from the address or the browser, starter questions). |
| `components/onboarding/onboarding-wizard.tsx` | The questions, one step at a time. |
| `components/onboarding/step-indicator.tsx` | "Step 1 of 2" and its progress bar. |
| `app/[locale]/(frontend)/start/page.tsx` | The `/start` page. |
| `components/ui/chat-panel.tsx` | Reads the answers, shows "You picked" and the matching starter questions, and sends the answers with each question. |
| `lib/server/chatbot-prompt.ts` | Tells the AI what the student picked. |

## How to test

1. On Home, click **"Not sure where to start?"**.
2. Click **Next** without picking: a red message appears.
3. Pick "Child care" and "Bus pass", then **Next**, pick "I'm a parent", then
   **Start chatting**.
4. The chat shows "You picked: Child care, Bus pass, I'm a parent" and two
   matching questions. The browser console shows `[onboarding] answers`.
5. Try it at `/es/start`, on a phone-sized window, and with the keyboard only
   (Tab to a card, Space to pick it).
