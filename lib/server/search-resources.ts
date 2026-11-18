import "server-only";

import { z } from "zod";

/**
 * search_resources: finds PTK's verified resources for a question (issue #42).
 *
 * MOCK: searches a few hardcoded resources with a simple word match.
 * TODO(#28): replace EXECUTE's search with a vector search of the
 * knowledge_entry table in Neon: embed the query with
 * Xenova/multilingual-e5-small (384 numbers, "query: " prefix) and return the
 * closest chunk embeddings from #45. DESCRIPTION, INPUT_SCHEMA and the output
 * shape stay the same, so nothing else has to change.
 */

/** PTK's six resource topics (AGENTS.md, Feature A). */
export const RESOURCE_TOPICS = ["esl", "tuition", "childcare", "transit", "refugee-aid", "counseling"] as const;

type ResourceTopic = (typeof RESOURCE_TOPICS)[number];

type Resource = {
   title: string;
   topic: ResourceTopic;
   source_url: string;
   text: string;
};

/** Most results one search returns, so the AI gets a short, focused list. */
const MAX_RESULTS = 3;

/** What the AI reads to decide when and how to use this tool. */
export const DESCRIPTION = [
   "Searches PTK's verified Dallas College student resources and returns the closest matches.",
   "Topics: ESL classes, tuition and financial aid, child care, the free DART bus pass,",
   "refugee and Dreamer aid, and counseling.",
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
   "If found is false, the information is not in PTK's verified resources. Say so,",
   "suggest talking to a Dallas College Success Coach, and do not guess.",
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
 * SAMPLE DATA: a few resources summarized from PTK's resource list, shaped like
 * the chunks from the data pipeline (#43).
 */
const MOCK_RESOURCES: Resource[] = [
   {
      title: "English as a Second Language (ESL)",
      topic: "esl",
      source_url: "https://www.dallascollege.edu/study/esl/",
      text: "Dallas College offers noncredit ESL for everyday and workplace English, and credit ESOL for students working toward a degree. Evening, weekend and hybrid classes are available for working learners.",
   },
   {
      title: "Free Adult Education and ESL Academy",
      topic: "esl",
      source_url: "https://www.dallascollege.edu/cd/dcc/adult-ed/",
      text: "Free English classes (ESL Academy levels 1 to 5) and GED preparation for adults 16 and older, regardless of visa or residency status. Start with an interest form, an orientation and a meeting with a coach.",
   },
   {
      title: "Make Payments (tuition installment plans)",
      topic: "tuition",
      source_url: "https://www.dallascollege.edu/paying-for-college/payments/",
      text: "Tuition is due 7 days after you register. You can pay in full or set up a 3-part installment plan through Workday, so your classes are not dropped for non-payment.",
   },
   {
      title: "Financial Aid",
      topic: "tuition",
      source_url: "https://www.dallascollege.edu/paying-for-college/financial-aid/",
      text: "Grants, work-study, loans and tuition exemptions. Fill out the FAFSA or TASFA with Dallas College school code 004453. Priority deadlines: Fall May 1, Spring October 1, Summer March 1.",
   },
   {
      title: "Child Care Support Services",
      topic: "childcare",
      source_url: "https://www.dallascollege.edu/resources/student-care-network/child-care/",
      text: "Help paying for child care while you study, free YMCA drop-in child watch at El Centro and Richland (ages 3 to 12, up to 4 hours), and on-campus child care centers at several campuses.",
   },
   {
      title: "DART Student GoPass (free bus and train pass)",
      topic: "transit",
      source_url: "https://www.dallascollege.edu/resources/dart-gopass/",
      text: "A free DART pass for buses, light rail and GoLink. You qualify with 6 or more credit hours in Fall or Spring, or 3 or more in Summer. Request it in Workday and use it in the DART GoPass app.",
   },
   {
      title: "Resources for Dreamers and DACA Students",
      topic: "refugee-aid",
      source_url: "https://www.dallascollege.edu/students/dreamers/",
      text: "Support for DACA, undocumented and newcomer students: in-state tuition rules, TheDream.US scholarships, community legal resources and confidential help.",
   },
   {
      title: "Counseling and Psychological Services",
      topic: "counseling",
      source_url: "https://www.dallascollege.edu/resources/counseling/",
      text: "Free, confidential counseling for enrolled students, online or in person, with same-day crisis care. In a crisis, call or text 988 at any time.",
   },
];

/**
 * A very simple keyword search over the sample data: counts how many words of
 * the query appear in each resource, then keeps only the strong matches.
 */
function searchMockResources(query: string, topic?: ResourceTopic): Resource[] {
   const words = query
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 2);

   const scored = MOCK_RESOURCES.filter((resource) => !topic || resource.topic === topic)
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