import {
   Baby,
   BookOpen,
   Briefcase,
   Bus,
   CircleHelp,
   GraduationCap,
   Heart,
   Sparkles,
   Users,
   Wallet,
   type LucideIcon,
} from "lucide-react";

import type { Messages } from "@/lib/i18n";

/**
 * The onboarding questions on /start (issue #49), as data. The wizard, the
 * chat page and /api/chat all read this list, so it's the ONE place to add,
 * remove or reorder a step or an answer. How-to: docs/ONBOARDING.md.
 *
 * Each id also needs its words in lib/i18n (en.ts and es.ts):
 * - a step: `onboarding.steps.<stepId>` (title, hint, and error if required)
 * - an answer: `onboarding.options.<optionId>` (label, plus an optional
 *   starter `question` for the chat)
 * TypeScript points out any id that's missing its words.
 *
 * Never add questions about immigration status, IDs or anything private
 * (AGENTS.md / MVP doc: the site collects no sensitive information).
 */

export type OnboardingOption = {
   /** Short, stable id: it goes in the chat's address (?needs=childcare). */
   id: string;
   icon: LucideIcon;
   /** Picking it clears the other answers in its step (e.g. "I'm not sure"). */
   exclusive?: boolean;
};

export type OnboardingStep = {
   id: string;
   /** The student must pick at least one answer before Next. */
   required: boolean;
   options: readonly OnboardingOption[];
};

export const ONBOARDING_STEPS = [
   {
      id: "needs",
      required: true,
      options: [
         { id: "esl", icon: BookOpen },
         { id: "college", icon: GraduationCap },
         { id: "pay", icon: Wallet },
         { id: "childcare", icon: Baby },
         { id: "transit", icon: Bus },
         { id: "counseling", icon: Heart },
         { id: "not-sure", icon: CircleHelp, exclusive: true },
      ],
   },
   {
      id: "about",
      required: false,
      options: [
         { id: "parent", icon: Users },
         { id: "works-days", icon: Briefcase },
         { id: "new", icon: Sparkles },
      ],
   },
] as const satisfies readonly OnboardingStep[];

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number]["id"];
export type OnboardingOptionId = (typeof ONBOARDING_STEPS)[number]["options"][number]["id"];

/** The student's answers: the option ids they picked in each step. */
export type OnboardingAnswers = Record<OnboardingStepId, OnboardingOptionId[]>;

/** Answers with nothing picked yet. */
export function emptyAnswers(): OnboardingAnswers {
   return Object.fromEntries(ONBOARDING_STEPS.map((step) => [step.id, []])) as unknown as OnboardingAnswers;
}

/** True when at least one answer was picked in any step. */
export function hasAnswers(answers: OnboardingAnswers) {
   return ONBOARDING_STEPS.some((step) => answers[step.id].length > 0);
}

/**
 * Cleans answers from outside: the chat page's address (?needs=a,b) or the
 * body /api/chat receives. Keeps only ids that are in this list, so nothing
 * else (old links, typos, free text) ever reaches the AI. Never throws.
 */
export function parseAnswers(input: unknown): OnboardingAnswers {
   const answers = emptyAnswers();
   if (!input || typeof input !== "object") return answers;

   for (const step of ONBOARDING_STEPS) {
      const raw: unknown =
         input instanceof URLSearchParams ? input.get(step.id) : (input as Record<string, unknown>)[step.id];
      // From an address: "a,b". From JSON: ["a", "b"].
      const ids = typeof raw === "string" ? raw.split(",") : Array.isArray(raw) ? raw : [];
      const known = step.options.map((option) => option.id as OnboardingOptionId);
      answers[step.id] = known.filter((id) => ids.includes(id));
   }
   return answers;
}

/** Answers as the chat page's address query, e.g. { needs: "esl,transit" }. */
export function answersToQuery(answers: OnboardingAnswers) {
   const query: Record<string, string> = {};
   for (const step of ONBOARDING_STEPS) {
      if (answers[step.id].length > 0) query[step.id] = answers[step.id].join(",");
   }
   return query;
}

/** An answer's words in the visitor's language. */
export function optionText(t: Messages, id: OnboardingOptionId): { label: string; question?: string } {
   return t.onboarding.options[id];
}

/** Starter questions for the chat that match the "needs" answers. */
export function starterQuestionsFor(t: Messages, answers: OnboardingAnswers) {
   return answers.needs.map((id) => optionText(t, id).question).filter((question) => question !== undefined);
}
