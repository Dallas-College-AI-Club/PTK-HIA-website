# Languages

The site is in English, Spanish, Arabic, Burmese and Swahili (issue #55). Each
language has its own pages: `/` is English, `/es`, `/ar`, `/my` and `/sw` are
the others. **The address decides the language**, including whether the page
reads right to left.

## Where the text lives

Every word a visitor sees is in one file per language, in `lib/i18n/`:

| File | Language |
| :--- | :--- |
| `en.ts` | English (the original: every other file copies its keys) |
| `es.ts` | Spanish |
| `ar.ts` | Arabic (right to left) |
| `my.ts` | Burmese |
| `sw.ts` | Swahili |

Every file must have exactly the same keys as `en.ts`. If a line is missing or
extra, `npx tsc --noEmit` and the build point to it.

**Before a language goes live, a native speaker should read it.** The chatbot
answers in any language on its own; these files are only the page text.

## Adding a language

1. Add it to the list in `lib/i18n/languages.ts`: its code, its name written
   in its own language, and `dir` (`"rtl"` only for right-to-left scripts).
2. Copy `lib/i18n/en.ts` to `lib/i18n/<code>.ts`, rename `en` to the code,
   change the first line to `import type { Messages } from "./en";` and
   `export const <code>: Messages = {`, then translate the text in quotes.
   Don't translate the keys (the words before each `:`).
3. Add it to `messagesByLocale` in `lib/i18n/index.ts`. That creates its pages.
4. If it uses a new alphabet, add the matching Noto Sans font in
   `app/[locale]/layout.tsx` (with `preload: false`) and add it to `--font-sans`
   in `app/globals.css`.
5. Add its greeting to the Home picture (`public/home-hello*.svg`, see
   `docs/SITE_ARTWORK.md`) if you want it there too.
6. Check every page on a phone: no sideways scrolling, nothing cut off.

## Right to left (Arabic)

- `RTL_ENABLED` in `lib/i18n/languages.ts` turns it on. The page gets
  `dir="rtl"` from its address, and the browser mirrors the layout.
- When you style something, use **start/end** instead of left/right, so it
  flips by itself: `ms-`/`me-` (margin), `ps-`/`pe-` (padding),
  `start-`/`end-` (position), `text-start`, `rounded-s-`/`rounded-e-`.
- Arrows that point sideways get `rtl:-scale-x-100` so they point the right
  way, e.g. `<ArrowRight className="size-5 rtl:-scale-x-100" />`.
- Don't flip: logos, pictures, English names like "Dallas College", check
  marks, the up arrow on Send, or numbers (we use 1, 2, 3).
- **Fields:** email and phone are always `dir="ltr"` (with `rtl:text-right`
  so they line up with the other fields). Anything people type freely (name,
  notes, questions) uses `dir="auto"`, so it follows what they type. Chat
  messages use `dir="auto"` too.
- **Text size:** Arabic pages show all text about 10% larger
  (`font-size-adjust` in `app/globals.css`), because Arabic letters look
  smaller than Latin ones at the same size.

## Burmese

- Burmese letters stack marks above and below the line, so Burmese pages get a
  taller line height (`app/globals.css`). Check long Burmese words on a phone.
- Burmese is written in **Unicode** (not the older Zawgyi encoding), like
  modern Burmese websites.
- Numbers use Burmese digits (၁, ၂, ၃). In the language file, type them
  directly (`မေးခွန်း ၂ ခု`). In code, use `formatNumber(value, locale)` from
  `lib/i18n`, which does it for you.

## Spanish

- Questions open with ¿ and exclamations with ¡.
- We use the formal *usted* ("Escriba su pregunta"), like most public and
  college websites.
- Titles and buttons use sentence case ("Hacer una pregunta"), not English
  Title Case.

## Every language

- Every page has a browser-tab title and search description in its language
  (each page's `generateMetadata`, and `brand.description` for the rest).
- Search engines are told about the other language versions of each page
  automatically (next-intl adds the links).
- The Talk to Someone form defaults "Preferred language" to the page's
  language.
