/**
 * The five languages the site supports (issue #12).
 *
 * `nativeName` is how each language writes its own name, so a visitor who
 * can't read English still finds theirs. `dir` is the reading direction:
 * "rtl" (right-to-left) flips the whole layout, which only Arabic needs.
 *
 * Used by: the language selector, the first-visit prompt, the Get Connected
 * form's "Preferred language" field, and (later) the chatbot.
 */
export const languages = [
   { code: "en", nativeName: "English", dir: "ltr" },
   { code: "es", nativeName: "Español", dir: "ltr" },
   { code: "ar", nativeName: "العربية", dir: "rtl" },
   { code: "my", nativeName: "မြန်မာ", dir: "ltr" },
   { code: "sw", nativeName: "Kiswahili", dir: "ltr" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

export const defaultLanguage: LanguageCode = "en";

/** Where the visitor's choice is saved in the browser (localStorage key). */
export const LANGUAGE_STORAGE_KEY = "ptk-language";

export function isLanguageCode(value: unknown): value is LanguageCode {
   return languages.some((language) => language.code === value);
}

export function getLanguage(code: LanguageCode) {
   return languages.find((language) => language.code === code) ?? languages[0];
}
