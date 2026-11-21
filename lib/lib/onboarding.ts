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
   /** Short, stable id, saved and sent to the server (e.g. "childcare"). */
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
 * Cleans answers from outside: what this tab saved, or the body /api/chat
 * receives, e.g. { needs: ["esl"] }. Keeps only ids that are in this list, so
 * nothing else (removed answers, typos, free text) ever reaches the AI.
 * Never throws.
 */
export function parseAnswers(input: unknown): OnboardingAnswers {
   const answers = emptyAnswers();
   if (!input || typeof input !== "object") return answers;

   for (const step of ONBOARDING_STEPS) {
      const raw: unknown = (input as Record<string, unknown>)[step.id];
      const ids = Array.isArray(raw) ? raw : [];
      const known = step.options.map((option) => option.id as OnboardingOptionId);
      answers[step.id] = known.filter((id) => ids.includes(id));
   }
   return answers;
}

/*
 * Where the answers are kept: this browser tab's memory (sessionStorage).
 * - Not in the page address, so they never show in browser history or in a
 *   link the student shares.
 * - Kept if the page is refreshed, and deleted when the tab is closed (good
 *   for shared or library computers).
 * - sessionStorage can be blocked (some private windows), so every read and
 *   write is wrapped. If it fails, the chat simply shows the usual questions.
 */
const STORAGE_KEY = "ptk-onboarding";

/** Saves the answers for this tab. */
export function saveAnswers(answers: OnboardingAnswers) {
   try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
   } catch {
      // Not saved: the chat will show its usual starter questions.
   }
}

/**
 * The saved answers as stored text (or null). Text, not an object, so React's
 * useSyncExternalStore sees the same value on every read. Turn it into
 * answers with parseSavedAnswers.
 */
export function readSavedAnswers(): string | null {
   try {
      return sessionStorage.getItem(STORAGE_KEY);
   } catch {
      return null;
   }
}

/** The answers from readSavedAnswers' text (empty if missing or broken). */
export function parseSavedAnswers(saved: string | null): OnboardingAnswers {
   if (!saved) return emptyAnswers();
   try {
      return parseAnswers(JSON.parse(saved));
   } catch {
      return emptyAnswers();
   }
}

/** An answer's words in the visitor's language. */
export function optionText(t: Messages, id: OnboardingOptionId): { label: string; question?: string } {
   return t.onboarding.options[id];
}

/** Starter questions for the chat that match the "needs" answers. */
export function starterQuestionsFor(t: Messages, answers: OnboardingAnswers) {
   return answers.needs.map((id) => optionText(t, id).question).filter((question) => question !== undefined);
}
