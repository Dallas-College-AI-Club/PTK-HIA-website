import { Shield } from "lucide-react"
import Image from "next/image"
import { getLocale } from "next-intl/server"
import type { ReactNode } from "react"

import { Link } from "@/i18n/navigation"
import { getMessages } from "@/lib/i18n"
import { pageContainer } from "@/lib/layout"
import { cn } from "@/lib/utils"

/** The Dallas College PTK chapter's Instagram (AGENTS.md: footer requirement). */
const PTK_INSTAGRAM_URL: string | null = "https://www.instagram.com/ptkaax/"
/** Our privacy page (issue #53). Links inside the site keep the visitor's language. */
const PRIVACY_URL: string | null = "/privacy"

/** Footer, repeated on every page. */
async function Footer() {
  const t = getMessages(await getLocale())

  return (
    <footer data-slot="footer" className="bg-brand-navy text-white">
      <div className={cn(pageContainer, "flex flex-col gap-4 py-6 text-center md:gap-5 md:py-9 md:text-start")}>
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-3.5">
            {/* Gold version of the logo, so it shows up on navy. Decorative: the text says who we are. */}
            <Image src="/logo-on-navy.svg" alt="" width={44} height={44} className="hidden size-11 shrink-0 md:block" />
            <p className="text-[17px] font-bold md:text-lg">{t.layout.footerPoweredBy}</p>
          </div>

          <nav aria-label={t.layout.footerNavLabel} className="flex flex-wrap justify-center gap-2.5 md:gap-3">
            <FooterLink href={PTK_INSTAGRAM_URL} external comingSoon={t.layout.comingSoon}>
              <InstagramIcon />
              {t.layout.footerInstagram}
            </FooterLink>
            <FooterLink href={PRIVACY_URL} comingSoon={t.layout.comingSoon}>
              <Shield aria-hidden="true" className="size-5" />
              {t.layout.footerPrivacy}
            </FooterLink>
          </nav>
        </div>

        <p className="text-sm text-brand-on-navy-muted md:border-t md:border-white/25 md:pt-5 md:text-[15px]">
          {t.layout.footerNotOfficial}
        </p>
      </div>
    </footer>
  )
}

const footerLinkClass =
  "flex min-h-11 items-center gap-2 rounded-full border-2 border-white px-4 py-1 font-bold text-white"

/**
 * A footer pill link. Until its address is set (href is null) it shows as
 * dimmed "coming soon" text instead of a link that goes nowhere.
 */
function FooterLink({
  href,
  external = false,
  comingSoon,
  children,
}: {
  href: string | null
  external?: boolean
  comingSoon: string
  children: ReactNode
}) {
  if (!href) {
    return (
      <span aria-disabled="true" title={comingSoon} className={cn(footerLinkClass, "opacity-60")}>
        {children}
        <span className="sr-only">({comingSoon})</span>
      </span>
    )
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cn(footerLinkClass, "hover:bg-white/10")}>
        {children}
      </a>
    )
  }

  // Our own pages: Link keeps the language (/privacy becomes /es/privacy on Spanish pages).
  return (
    <Link href={href} className={cn(footerLinkClass, "hover:bg-white/10")}>
      {children}
    </Link>
  )
}

/** Lucide v1 has no brand icons, so the Instagram glyph is drawn here. */
function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  )
}

export { Footer }
