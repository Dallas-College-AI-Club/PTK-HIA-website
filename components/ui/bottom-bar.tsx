"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { getMessages } from "@/lib/i18n"
import { bottomBarPages, isActivePage, sitePages } from "@/lib/site-pages"
import { cn } from "@/lib/utils"

/**
 * Phone-only bar that stays at the bottom of the screen on every page:
 * Home · Ask a Question · Talk to Someone. No hidden ☰ menu.
 *
 * It is `sticky` (not `fixed`), placed last in the page: it stays pinned to
 * the bottom of the screen while scrolling but still takes up its own space,
 * so it never covers the footer, however tall it grows (wrapped labels in
 * longer languages, iPhone home-indicator area).
 */
function BottomBar() {
  const t = getMessages()
  const pathname = usePathname()

  return (
    <nav
      aria-label={t.layout.quickActionsLabel}
      className="sticky bottom-0 z-40 grid min-h-[76px] grid-cols-3 border-t border-brand-line bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(15,27,51,0.10)] md:hidden"
    >
      {bottomBarPages.map((key) => {
        const { href, icon: Icon, emphasis } = sitePages[key]
        const active = isActivePage(pathname, href)

        return (
          <Link
            key={key}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 border-t-4 px-1 py-1.5 text-center text-sm leading-tight",
              active
                ? "border-brand-gold font-extrabold text-brand-navy-dark"
                : "border-transparent font-semibold text-brand-ink",
            )}
          >
            {emphasis === "gold" ? (
              <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-brand-gold text-brand-navy-dark">
                <Icon aria-hidden="true" className="size-[18px]" />
              </span>
            ) : (
              <Icon aria-hidden="true" className="size-6 shrink-0" />
            )}
            {t.pages[key]}
          </Link>
        )
      })}
    </nav>
  )
}

export { BottomBar }
