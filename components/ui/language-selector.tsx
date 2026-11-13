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
import { useLanguage } from "@/components/ui/language-provider"
import { getMessages } from "@/lib/i18n"
import { getLanguage, isLanguageCode, languages } from "@/lib/i18n/languages"

/**
 * Language button in the top bar (issue #12). Lives in the slot Jason left in
 * navbar.tsx: keep it within ~120px on phones and ~160px on desktop.
 *
 * TODO(Angie):
 * 1. Match the button to the approved mockup (border, icon, font sizes).
 * 2. Check it on a 375px-wide screen with the longest name (Kiswahili).
 * 3. Check the menu opens on the left side when the page is Arabic (RTL).
 */
function LanguageSelector() {
  const t = getMessages(useLocale())
  const { current, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.language.label}
        className="flex min-h-11 w-[120px] items-center justify-center gap-1.5 rounded-full border-2 border-brand-line bg-white px-2.5 font-semibold text-brand-ink md:w-40"
      >
        <Globe aria-hidden="true" className="size-5 shrink-0" />
        {/* lang= tells screen readers how to pronounce the name */}
        <span lang={current} className="truncate">
          {getLanguage(current).nativeName}
        </span>
        <ChevronDownIcon aria-hidden="true" className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={current}
          onValueChange={(value) => {
            if (isLanguageCode(value)) setLanguage(value)
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
