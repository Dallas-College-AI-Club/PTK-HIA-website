import { en, type Messages } from "./en";

export type { Messages };

/**
 * Returns the text for the current language.
 * English only for now; the language selector will plug in here
 * (each language is one file in this folder with the same keys as en.ts).
 */
export function getMessages(): Messages {
   return en;
}
