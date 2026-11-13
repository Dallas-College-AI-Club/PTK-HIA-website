import { z } from "zod";

import { languages } from "@/lib/i18n/languages";

/**
 * What a Get Connected request contains (issue #11), and the rules it must
 * pass. The same rules run on the server, so nobody can skip them by
 * changing the page in their browser.
 *
 * Error messages are keys into getConnected.errors in lib/i18n/en.ts, so the
 * text can be translated later without touching this file.
 *
 * Privacy (README): never add questions about immigration status or other
 * sensitive information.
 */

export const situations = [
   "highSchoolSenior",
   "currentStudent",
   "parent",
   "refugee",
   "eslLearner",
   "other",
] as const;

export const helpTopics = [
   "admissions",
   "esl",
   "financialAid",
   "childcare",
   "transportation",
   "counseling",
   "other",
] as const;

const languageCodes = languages.map((language) => language.code) as [
   (typeof languages)[number]["code"],
   ...(typeof languages)[number]["code"][],
];

export const contactRequestSchema = z
   .object({
      fullName: z.string().trim().min(1, "fullNameRequired").max(200),
      email: z.union([z.literal(""), z.email("emailInvalid")]),
      phone: z.string().trim().max(40),
      preferredLanguage: z.enum(languageCodes, "choose"),
      situation: z.enum(situations, "choose"),
      helpWith: z.enum(helpTopics, "choose"),
      notes: z.string().trim().max(2000),
   })
   // At least one way to reach them. `when` makes this check run even if
   // another field (like the name) already failed, so all errors show at once.
   .refine((data) => Boolean(data.email?.trim() || data.phone?.trim()), {
      message: "contactRequired",
      path: ["email"],
      when: () => true,
   });

export type ContactRequest = z.infer<typeof contactRequestSchema>;
export type ContactRequestErrorKey =
   | "fullNameRequired"
   | "contactRequired"
   | "emailInvalid"
   | "choose"
   | "generic";
