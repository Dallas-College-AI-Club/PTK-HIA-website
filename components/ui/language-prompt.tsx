"use client"

import { Check, Globe } from "lucide-react"
import { useLocale } from "next-intl"

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { useLanguage, useSwitchLanguage } from "@/components/ui/language-provider"
import { getMessages } from "@/lib/i18n"
import { isLanguageCode, languages } from "@/lib/i18n/languages"
import { cn } from "@/lib/utils"

/**
 * First-visit "Choose your language" prompt (issue #12).
 *
 * - Shows only while no language is saved in this browser, so returning
 *   visitors don't see it. (It appears after the page loads: the server
 *   can't see the browser's saved choice.)
 * - One big button per language, each name in its own script, so anyone can
 *   find theirs without reading English.
 * - Picking a language opens the same page in it. Closing the prompt (Esc,
 *   or tapping outside) keeps the page's current language.
 */
function LanguagePrompt() {
  const locale = useLocale()
  const t = getMessages(locale).language
  const { language, setLanguage } = useLanguage()
  const switchLanguage = useSwitchLanguage()

  const pageLanguage = isLanguageCode(locale) ? locale : "en"

  return (
    <Dialog
      open={language === null}
      onOpenChange={(open) => {
        if (!open) setLanguage(pageLanguage)
      }}
    >
      <DialogContent showCloseButton={false} className="gap-5 rounded-3xl bg-white p-5 text-brand-ink sm:max-w-sm md:p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-tint text-brand-navy">
            <Globe aria-hidden="true" className="size-7" />
          </span>
          <DialogTitle className="text-2xl font-extrabold text-brand-navy-dark">{t.chooseTitle}</DialogTitle>
          {/* The same question in every language, so it's clear before picking. */}
          <DialogDescription className="flex flex-col text-[15px] text-brand-muted">
            {languages
              .filter((option) => option.code !== pageLanguage)
              .map((option) => (
                <span key={option.code} lang={option.code} dir={option.dir}>
                  {getMessages(option.code).language.chooseTitle}
                </span>
              ))}
          </DialogDescription>
        </div>

        <ul className="flex flex-col gap-2.5">
          {languages.map((option) => {
            const isCurrent = option.code === pageLanguage

            return (
              <li key={option.code}>
                <button
                  type="button"
                  lang={option.code}
                  dir={option.dir}
                  aria-current={isCurrent || undefined}
                  onClick={() => switchLanguage(option.code)}
                  className={cn(
                    "flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 text-start text-lg font-bold text-brand-navy-dark hover:border-brand-navy",
                    isCurrent ? "border-brand-navy bg-brand-gold-soft" : "border-brand-line bg-white",
                  )}
                >
                  <span className="flex-1">{option.nativeName}</span>
                  {isCurrent && <Check aria-hidden="true" className="size-5 shrink-0 text-brand-navy" strokeWidth={3} />}
                </button>
              </li>
            )
          })}
        </ul>
      </DialogContent>
    </Dialog>
  )
}

export { LanguagePrompt }
