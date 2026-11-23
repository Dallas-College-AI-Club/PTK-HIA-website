"use client"

import { useLocale } from "next-intl"
import { createContext, useCallback, useContext, useSyncExternalStore } from "react"

import { usePathname, useRouter } from "@/i18n/navigation"

import {
  defaultLanguage,
  isLanguageCode,
  LANGUAGE_STORAGE_KEY,
  type LanguageCode,
} from "@/lib/i18n/languages"

type LanguageContextValue = {
  /** The visitor's language, or null if they haven't picked one yet. */
  language: LanguageCode | null
  setLanguage: (code: LanguageCode) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

// localStorage can throw (private windows, blocked storage), so every read
// and write is wrapped. If it fails, the site still works in English.
function readSaved(): LanguageCode | null {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    return isLanguageCode(saved) ? saved : null
  } catch {
    return null
  }
}

const listeners = new Set<() => void>()
function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * Remembers the visitor's language for the whole site.
 * Wrapped around every page in app/layout.tsx, so the selector, the
 * first-visit prompt and (later) the chatbot all read the same value.
 */
function LanguageProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore reads localStorage safely: on the server (no
  // localStorage) it uses the third function, so there's no hydration error.
  const language = useSyncExternalStore(subscribe, readSaved, () => null)

  const setLanguage = useCallback((code: LanguageCode) => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, code)
    } catch {
      // Not saved (storage blocked). The page itself still follows its address.
    }
    listeners.forEach((listener) => listener())
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

/** Read or change the language from any client component. */
function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used inside <LanguageProvider>")
  return {
    ...context,
    /** The language to show right now (English until they pick one). */
    current: context.language ?? defaultLanguage,
  }
}

/**
 * Switches the site's language (issue #12): remembers the choice (so the
 * first-visit prompt doesn't come back) and opens the same page in that
 * language, e.g. /esl → /ar/esl. The language cookie is updated by next-intl.
 */
function useSwitchLanguage() {
  const { setLanguage } = useLanguage()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  return useCallback(
    (code: LanguageCode) => {
      setLanguage(code)
      if (code !== locale) router.replace(pathname, { locale: code, scroll: false })
    },
    [setLanguage, locale, pathname, router],
  )
}

export { LanguageProvider, useLanguage, useSwitchLanguage }
