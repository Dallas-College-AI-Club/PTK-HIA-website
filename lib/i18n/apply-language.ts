import { getLanguage, LANGUAGE_STORAGE_KEY, languages, RTL_ENABLED, type LanguageCode } from "./languages";

/**
 * Sets <html lang="…" dir="…">. Changing `dir` to "rtl" is what flips the
 * layout for Arabic: the browser mirrors text alignment and flex rows, and
 * Tailwind's logical classes (ms-, me-, ps-, pe-, start-, end-) follow it.
 */
export function applyLanguage(code: LanguageCode) {
   const language = getLanguage(code);
   document.documentElement.lang = language.code;
   document.documentElement.dir = RTL_ENABLED ? language.dir : "ltr";
}

/**
 * The same job as applyLanguage, written as a tiny script that runs in the
 * <head> before the page is painted (see app/layout.tsx). Without it, an
 * Arabic visitor would see the page left-to-right for a moment, then jump.
 * It has to be plain text because it runs before React loads.
 */
export const applySavedLanguageScript = `(function(){try{
var rtl=${JSON.stringify((RTL_ENABLED ? languages : []).filter((l) => l.dir === "rtl").map((l) => l.code))};
var c=localStorage.getItem(${JSON.stringify(LANGUAGE_STORAGE_KEY)});
if(!c)return;
document.documentElement.lang=c;
document.documentElement.dir=rtl.indexOf(c)>-1?"rtl":"ltr";
}catch(e){}})();`;
