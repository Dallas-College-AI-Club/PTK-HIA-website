import { getLocale } from "next-intl/server"

import { LanguageSelector } from "@/components/ui/language-selector"
import { NavLinks } from "@/components/ui/nav-links"
import { Link } from "@/i18n/navigation"
import { getMessages } from "@/lib/i18n"
import { pageContainer } from "@/lib/layout"
import { cn } from "@/lib/utils"

/**
 * Top bar, repeated on every page.
 * Row 1 (all screens): logo, language selector.
 * Row 2 (desktop only): page links, ending with a filled "Ask a Question"
 * button (see nav-links.tsx). Two rows in every language, so long
 * translations wrap onto another line instead of breaking the bar.
 * Phones get the bottom bar instead of page links (see bottom-bar.tsx).
 */
async function NavBar() {
  const t = getMessages(await getLocale())

  return (
    <header
      data-slot="navbar"
      className="border-b border-brand-line-soft bg-white text-brand-ink"
    >
      <div className={cn(pageContainer, "flex min-h-16 flex-wrap items-center gap-x-6 gap-y-3 py-2 md:min-h-[72px]")}>
        <Link href="/" className="flex items-center gap-3 text-brand-navy-dark">
          {/* TODO: replace with the real PTK logo file */}
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border-2 border-dashed border-brand-navy text-[10px] font-bold text-brand-navy md:size-11">
            {t.brand.logoPlaceholder}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-extrabold md:text-lg">{t.brand.name}</span>
            <span className="hidden text-sm text-brand-muted md:block">{t.brand.college}</span>
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1.5 md:gap-2">
          {/* Language selector (issue #12). Keep it within ~120px on phones
              and ~160px on desktop. */}
          <div data-slot="language-selector">
            <LanguageSelector />
          </div>
        </div>
      </div>

      <NavLinks />
    </header>
  )
}

export { NavBar }
