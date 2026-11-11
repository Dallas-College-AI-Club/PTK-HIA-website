"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { getMessages } from "@/lib/i18n"
import { pageContainer } from "@/lib/layout"
import { isActivePage, mainNavPages, sitePages } from "@/lib/site-pages"
import { cn } from "@/lib/utils"

/**
 * Desktop page links (row 2 of the top bar). The only client-side part of the
 * navbar: it needs the current URL to highlight the page you're on.
 * Links wrap onto another line if a language is very long.
 */
function NavLinks() {
  const t = getMessages()
  const pathname = usePathname()

  return (
    <nav aria-label={t.layout.mainNavLabel} className="hidden border-t border-brand-line-soft md:block">
      <ul className={cn(pageContainer, "flex flex-wrap gap-1 py-1.5")}>
        {mainNavPages.map((key) => {
          const { href, icon: Icon, emphasis } = sitePages[key]
          const active = isActivePage(pathname, href)

          return (
            // The primary page (Ask a Question) is pushed to the end of the row.
            <li key={key} className={cn(emphasis === "primary" && "ml-auto")}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-1.5 rounded-[10px] px-3 whitespace-nowrap",
                  emphasis === "primary"
                    ? cn("gap-2 px-4 font-bold text-white", active ? "bg-brand-navy-dark" : "bg-brand-navy hover:bg-brand-navy-dark")
                    : cn(
                        "text-brand-ink",
                        active ? "bg-brand-tint font-extrabold text-brand-navy-dark" : "font-semibold hover:bg-brand-page",
                      ),
                )}
              >
                {emphasis === "gold" ? (
                  <span className="flex size-[26px] items-center justify-center rounded-full bg-brand-gold text-brand-navy-dark">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                ) : (
                  <Icon aria-hidden="true" className={cn("size-5", emphasis !== "primary" && "text-brand-navy")} />
                )}
                {t.pages[key]}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export { NavLinks }
