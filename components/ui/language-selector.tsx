"use client"

import { ChevronDownIcon, Globe } from "lucide-react"
import { useLocale } from "next-intl"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage, useSwitchLanguage } from "@/components/ui/language-provider"
import { getMessages } from "@/lib/i18n"
import { getLanguage, isLanguageCode, languages } from "@/lib/i18n/languages"

/**
 * Language button in the top bar (issue #12). Shows the page's language in
 * its own script; picking another opens the same page in that language and
 * remembers the choice. Keep it within ~120px on phones and ~160px on desktop.
 */
function LanguageSelector() {
  const locale = useLocale()
  const t = getMessages(locale)
  const { current } = useLanguage()
  const switchLanguage = useSwitchLanguage()
  // Show the language this page is in (from its address, e.g. /ar), not only
  // the saved choice, so an Arabic page never says "English" (issue #55).
  const shown = isLanguageCode(locale) ? locale : current

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.language.label}
        className="flex min-h-11 w-[120px] items-center justify-center gap-1.5 rounded-full border-2 border-brand-line bg-white px-2.5 font-semibold text-brand-ink md:w-40"
      >
        <Globe aria-hidden="true" className="size-5 shrink-0" />
        {/* lang= tells screen readers how to pronounce the name */}
        <span lang={shown} className="truncate">
          {getLanguage(shown).nativeName}
        </span>
        <ChevronDownIcon aria-hidden="true" className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={shown}
          onValueChange={(value) => {
            if (isLanguageCode(value)) switchLanguage(value)
          }}
        >
          {languages.map((language) => (
            <DropdownMenuRadioItem
              key={language.code}
              value={language.code}
              lang={language.code}
              dir={language.dir}
              className="min-h-11 text-base"
            >
              {language.nativeName}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { LanguageSelector }
