"use client"

import { useLanguage } from "@/components/ui/language-provider"

/**
 * First-visit "Choose your language" prompt (issue #12).
 * Shows only while no language is saved, so returning visitors skip it.
 *
 * Not on the page yet. TODO(Angie):
 * 1. Build it with Dialog from components/ui/dialog.tsx: one big button per
 *    language (min 44px tall), each name in its own script, like the mockup.
 * 2. On click: setLanguage(code). That saves it, so the prompt won't return.
 * 3. Add <LanguagePrompt /> to app/(frontend)/layout.tsx.
 * 4. Test: clear localStorage, reload, pick Arabic, reload. No prompt, page RTL.
 */
function LanguagePrompt() {
  const { language } = useLanguage()

  if (language !== null) return null

  return null // TODO(Angie): replace with the dialog described above
}

export { LanguagePrompt }
