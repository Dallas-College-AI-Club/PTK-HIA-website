"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { getMessages } from "@/lib/i18n"
import { pageContainer } from "@/lib/layout"
import { cn } from "@/lib/utils"

/** "← Home" button at the top of every page except Home. */
function BackHome() {
  const t = getMessages()
  const pathname = usePathname()

  if (pathname === "/") return null

  return (
    <div className={cn(pageContainer, "pt-4 md:pt-8")}>
      <Link
        href="/"
        className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-brand-navy py-1 pr-5 pl-3.5 text-[17px] font-bold text-brand-navy hover:bg-brand-tint"
      >
        <ArrowLeft aria-hidden="true" className="size-[22px]" strokeWidth={2.5} />
        {t.layout.backHome}
      </Link>
    </div>
  )
}

export { BackHome }
