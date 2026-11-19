import "server-only";

import { z } from "zod";

import { getMessages } from "@/lib/i18n";
import { sitePages } from "@/lib/site-pages";

/**
 * search_resources: finds PTK's verified resources for a question (issue #42).
 *
 * MOCK: searches the text and links already on our own pages (Learn English,
 * Start College, Pay for College, Talk to Someone) with a simple word match.
 * The text comes from lib/i18n/en.ts, so it stays in sync with the pages.
 * TODO(#28): replace EXECUTE's search with a vector search of the
 * knowledge_entry table in Neon: embed the query with
 * Xenova/multilingual-e5-small (384 numbers, "query: " prefix) and return the
 * closest chunk embeddings from #45. DESCRIPTION, INPUT_SCHEMA and the output
 * shape stay the same, so nothing else has to change.
 */

/** PTK's resource topics (AGENTS.md, Feature A), plus admissions (Start College). */
export const RESOURCE_TOPICS = [
   "esl",
   "admissions",
   "tuition",
   "childcare",
   "transit",
   "refugee-aid",
   "counseling",
] as const;

type ResourceTopic = (typeof RESOURCE_TOPICS)[number];

type Resource = {
   title: string;
   topics: ResourceTopic[];
   source_url: string;
   text: string;
};

/** Most results one search returns, so the AI gets a short, focused list. */
const MAX_RESULTS = 3;

/** What the AI reads to decide when and how to use this tool. */
export const DESCRIPTION = [
   "Searches PTK's verified Dallas College student resources and returns the closest matches.",
   "Covers: ESL (night and weekend classes, registration steps, locations), how to register",
   "for college, financial aid (FAFSA, TASFA, keeping your aid), scholarships, the free DART",
   "bus pass, and help for Dreamers and DACA students. For child care, counseling or anything",
   "else, it returns the Talk to Someone page, where a real person at Dallas College can help.",
   "",
   "Call this tool before answering any question about Dallas College services.",
   "",
   "Examples:",
   '- "how do I get a free bus pass"',
   '- "are there English classes at night"',
   '- "¿hay ayuda para pagar el cuidado de niños?" (search for "child care help")',
   "",
   "Write the query in English, even if the student wrote in another language.",
   "Search ONCE per question: rewording the same query does not find different records.",
   "",
   "Each result's text IS the verified answer: use its facts and give its source_url as the link.",
   "Results are short summaries: do not add details (dates, amounts, rules) they don't state.",
   "If found is false, the information is not in PTK's verified resources. Say so,",
   "suggest the Talk to Someone page or a Dallas College Success Coach, and do not guess.",
].join("\n");

/** What the AI must send. The SDK checks it before EXECUTE runs. */
export const INPUT_SCHEMA = z.object({
   query: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .describe("What to search for, in English, e.g. 'free bus pass'."),
   topic: z
      .enum(RESOURCE_TOPICS)
      .optional()
      .describe("Only search one topic, if the question is clearly about it."),
});

/**
 * The links on our pages. Copied from each page's LINKS (keep them the same
 * if a page's link changes): esl/page.tsx, start-college/page.tsx and
 * financial-aid/page.tsx.
 */
const PAGE_LINKS = {
   eslNightsWeekends: "https://www.dallascollege.edu/special-programs/nights-weekends/",
   eslRegistration: "https://www.dallascollege.edu/admissions/registration/",
   eslLocations: "https://www.dallascollege.edu/locations/",
   registration: "https://www.dallascollege.edu/admissions/registration/",
   aidOverview: "https://www.dallascollege.edu/paying-for-college/financial-aid/",
   fafsa: "https://www.dallascollege.edu/paying-for-college/financial-aid/apply/fafsa/",
   tasfa: "https://www.dallascollege.edu/paying-for-college/financial-aid/apply/tasfa/",
   keepAid: "https://www.dallascollege.edu/paying-for-college/financial-aid/maintain-eligibility/",
   goPass: "https://www.dallascollege.edu/resources/dart-gopass/",
   scholarships: "https://www.dallascollege.edu/paying-for-college/scholarships-aid/",
   dreamers: "https://www.dallascollege.edu/students/dreamers/",
} as const;

/**
 * SAMPLE DATA: one resource per link on our pages, built from the English page
 * text (lib/i18n/en.ts). Each resource's text = the page section + the link's
 * label and hint, so a search finds the same words a visitor reads.
 */
function buildMockResources(): Resource[] {
   const t = getMessages("en");
   const esl = t.esl;
   const aid = t.financialAid;
   const join = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(" ");

   return [
      // Learn English page
      {
         title: esl.sections.nightsWeekends.title,
         topics: ["esl"],
         source_url: PAGE_LINKS.eslNightsWeekends,
         text: join(t.pages.learnEnglish + ":", esl.sections.nightsWeekends.body, esl.links.nightsWeekends.label),
      },
      {
         title: esl.sections.registration.title,
         topics: ["esl", "admissions"],
         source_url: PAGE_LINKS.eslRegistration,
         text: join(t.pages.learnEnglish + ":", esl.sections.registration.body, esl.links.registration.label),
      },
      {
         title: esl.sections.locations.title,
         topics: ["esl"],
         source_url: PAGE_LINKS.eslLocations,
         text: join(t.pages.learnEnglish + ":", esl.sections.locations.body, esl.links.locations.label),
      },
      // Start College page
      {
         title: t.startCollege.registrationLink,
         topics: ["admissions"],
         source_url: PAGE_LINKS.registration,
         text: join(t.pages.startCollege + ":", t.startCollege.intro, "Apply and register for college classes."),
      },
      // Pay for College page
      {
         title: aid.links.aidOverview.label,
         topics: ["tuition"],
         source_url: PAGE_LINKS.aidOverview,
         text: join(aid.sections.aid.title + ":", aid.sections.aid.body),
      },
      {
         title: aid.links.fafsa.label,
         topics: ["tuition", "refugee-aid"],
         source_url: PAGE_LINKS.fafsa,
         text: join(aid.sections.aid.title + ":", aid.sections.aid.body, aid.links.fafsa.hint),
      },
      {
         title: aid.links.tasfa.label,
         topics: ["tuition", "refugee-aid"],
         source_url: PAGE_LINKS.tasfa,
         text: join(aid.sections.aid.title + ":", aid.sections.aid.body, aid.links.tasfa.hint),
      },
      {
         title: aid.links.keepAid.label,
         topics: ["tuition"],
         source_url: PAGE_LINKS.keepAid,
         text: join(aid.sections.aid.title + ":", "Keep your financial aid. Apply every year."),
      },
      {
         title: aid.links.goPass.label,
         topics: ["transit"],
         source_url: PAGE_LINKS.goPass,
         text: join(aid.sections.busPass.title + ":", aid.sections.busPass.body),
      },
      {
         title: aid.links.scholarships.label,
         topics: ["tuition"],
         source_url: PAGE_LINKS.scholarships,
         text: join(aid.sections.scholarships.title + ":", aid.sections.scholarships.body, aid.links.scholarships.hint),
      },
      {
         title: aid.links.dreamers.label,
         topics: ["refugee-aid", "tuition"],
         source_url: PAGE_LINKS.dreamers,
         text: join(aid.sections.scholarships.title + ":", aid.links.dreamers.label + "."),
      },
      // Talk to Someone page: the only place our site covers child care and counseling.
      {
         title: t.pages.talkToSomeone,
         topics: ["childcare", "counseling", "admissions", "esl", "tuition", "transit", "refugee-aid"],
         source_url: sitePages.talkToSomeone.href,
         text: join(
            t.getConnected.intro,
            t.getConnected.privacyNote,
            "They can help with:",
            Object.values(t.getConnected.helpTopics).join(", ") + ".",
         ),
      },
   ];
}

const MOCK_RESOURCES = buildMockResources();

/**
 * Common words that say nothing about the topic. Without this list, "where are
 * the campuses" would match "are" inside "childcare".
 * (Same idea as SEARCH_FILLER in the Success Coach chatbot.)
 */
const FILLER_WORDS = new Set(
   "the and are for can how what where when who why does with you your get need want there any about dallas college".split(
      " ",
   ),
);

/**
 * A very simple keyword search over the sample data: counts how many words of
 * the query appear in each resource, then keeps only the strong matches.
 */
function searchMockResources(query: string, topic?: ResourceTopic): Resource[] {
   const words = query
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 2 && !FILLER_WORDS.has(word));

   const scored = MOCK_RESOURCES.filter((resource) => !topic || resource.topics.includes(topic))
      .map((resource) => {
         const searchable = `${resource.title} ${resource.text}`.toLowerCase();
         return { resource, score: words.filter((word) => searchable.includes(word)).length };
      })
      .sort((a, b) => b.score - a.score);

   // With a topic, every resource in it counts. Without one, keep results that
   // match more than half as many words as the best result (so "free bus pass"
   // doesn't also return everything that's "free").
   const bestScore = scored[0]?.score ?? 0;
   return scored
      .filter(({ score }) => (topic ? true : score > 0 && score > bestScore / 2))
      .slice(0, MAX_RESULTS)
      .map(({ resource }) => resource);
}

/** Runs on our server when the AI calls the tool. What it returns goes back to the AI. */
export async function EXECUTE(input: z.infer<typeof INPUT_SCHEMA>) {
   const { query, topic } = INPUT_SCHEMA.parse(input);

   // Pretend to be a slow database so the "Searching…" line is visible.
   await new Promise((resolve) => setTimeout(resolve, 1000));

   // Test switch: lets us see the error state on /dev/chat-test on purpose.
   // (The real search should catch database errors and return found: false.)
   if (query.toLowerCase().includes("fail-test")) {
      throw new Error("Test failure: the search query contained 'fail-test'.");
   }

   const results = searchMockResources(query, topic);
   return { found: results.length > 0, results };
}