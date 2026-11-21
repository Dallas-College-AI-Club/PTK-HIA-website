# Site artwork

Added in issue #53. These are original drawings made for this project. They
are **not** PTK's official crest or the Dallas College seal. If PTK sends an
approved logo, replace the files below with the same names.

## Files

| File | Where it shows |
| :--- | :--- |
| `public/logo.svg` | Top bar, next to "PTK × AI Club" (navy tile, gold book) |
| `public/logo-on-navy.svg` | Footer on desktop (gold tile, so it shows on navy) |
| `app/icon.svg` | Browser tab icon (modern browsers) |
| `app/favicon.ico` | Browser tab icon (older browsers), 16, 32 and 48 px |
| `app/apple-icon.png` | Icon when someone adds the site to an iPhone home screen (180 px) |
| `public/home-hello.svg` | Home picture on tablets and computers (520 × 440) |
| `public/home-hello-strip.svg` | Home picture on phones: a short, wide strip (360 × 110) |

## Swapping in an official logo

1. Get the logo as an SVG (or a PNG at least 512 px wide).
2. Replace `public/logo.svg`, and make a version that shows on navy for
   `public/logo-on-navy.svg`.
3. Replace the 3 tab icons in `app/` (`icon.svg`, `favicon.ico`,
   `apple-icon.png`). Keep the same names: Next.js finds them automatically.
4. Check the top bar, the footer and the browser tab on a phone and a
   computer.

## The Home picture

It says "hello" in our 5 languages: Hello, Hola, مرحبا, မင်္ဂလာပါ, Habari.

- The words are real text, so they look sharp at any size. They use the
  phone's or computer's own fonts for Arabic and Burmese.
- Screen readers read the description in `home.illustrationAlt`
  (`lib/i18n/en.ts` and `es.ts`). If the picture changes, update it there.
- If we add a language, add its greeting to both files.

## Footer links

In `components/ui/footer.tsx`:

- **Instagram:** `PTK_INSTAGRAM_URL` (opens in a new tab).
- **Privacy:** `PRIVACY_URL` points to our `/privacy` page. Its text is in
  `privacy` in `lib/i18n/en.ts` and `es.ts`. **Every sentence must stay
  true:** if the site starts collecting or keeping something new (a form
  field, saving chats, analytics, a cookie), update that page in the same pull
  request.
