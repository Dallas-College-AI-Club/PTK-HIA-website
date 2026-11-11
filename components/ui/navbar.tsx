import Link from "next/link"

import { NavLinks } from "@/components/ui/nav-links"
import { getMessages } from "@/lib/i18n"
import { pageContainer } from "@/lib/layout"
import { cn } from "@/lib/utils"

/**
 * Top bar, repeated on every page.
 * Row 1 (all screens): logo, Text size, language selector.
 * Row 2 (desktop only): page links, ending with a filled "Ask a Question"
 * button (see nav-links.tsx). Two rows in every language, so long
 * translations wrap onto another line instead of breaking the bar.
 * Phones get the bottom bar instead of page links (see bottom-bar.tsx).
 */
function NavBar() {
  const t = getMessages()

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
          {/* TODO: text size (16px -> 20px) will be implemented later.
              Disabled until then so it isn't a button that silently does nothing. */}
          <button
            type="button"
            disabled
            aria-label={`${t.layout.textSize} (${t.layout.comingSoon})`}
            title={t.layout.comingSoon}
            className="flex min-h-11 min-w-11 cursor-not-allowed items-center justify-center gap-2 rounded-full border-2 border-brand-line bg-white px-2.5 font-semibold text-brand-ink opacity-60 md:px-3.5"
          >
            <span aria-hidden="true" className="text-[17px] font-extrabold">
              Aa
            </span>
            <span aria-hidden="true" className="hidden md:inline">
              {t.layout.textSize}
            </span>
          </button>

          {/* Placeholder: the language selector is built by another teammate.
              Keep it within ~120px on phones and ~160px on desktop. */}
          <div
            data-slot="language-selector"
            className="flex min-h-11 w-[120px] items-center justify-center rounded-full border-2 border-dashed border-brand-placeholder px-2 py-1 text-center text-sm leading-tight font-bold text-brand-muted md:w-40"
          >
            {t.layout.languagePlaceholder}
          </div>
        </div>
      </div>

      <NavLinks />
    </header>
  )
}

export { NavBar }
