import {
   Briefcase,
   ExternalLink,
   GraduationCap,
   MessagesSquare,
   type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getMessages } from "@/lib/i18n";
import { pageContainer } from "@/lib/layout";
import { cn } from "@/lib/utils";
/**
 * ESL page. It follows the Dallas College ESL page (links.source) in the same
 * order: ESOL and ESL difference, ESOL courses, ESL courses, application
 * process, and who to contact.
 *
 * All words are in lib/i18n/en.ts (the "esl" block). Web addresses, phone
 * numbers, emails and course numbers are the same in every language, so they
 * live in this file.
 */

const DALLAS_COLLEGE = "https://www.dallascollege.edu";

const links = {
   source: `${DALLAS_COLLEGE}/study/esl/`,
   workReadyU: `${DALLAS_COLLEGE}/special-programs/workreadyu/english-second-language/`,
   successCoaching: `${DALLAS_COLLEGE}/resources/success-coaching/`,
   apply: `${DALLAS_COLLEGE}/admissions/application`,
   placementTest: `${DALLAS_COLLEGE}/resources/testing-centers/esol-esl-placement/`,
};

/** Links inside the footnotes, keyed as in en.ts. "areaOfStudy" jumps to the heading on this page. */
const footnoteLinks: Record<string, string> = {
   areaOfStudy: "#area-of-study",
   healthPackets: `${DALLAS_COLLEGE}/schools/health-sciences/health-packets/`,
   payingForCollege: `${DALLAS_COLLEGE}/paying-for-college/`,
   onet: "https://www.onetonline.org/",
};

/** "Helpful Dallas College Pages": one address per card, keyed as in en.ts. */
const helpfulPageLinks: Record<string, string> = {
   registration: `${DALLAS_COLLEGE}/admissions/registration/`,
   nightsWeekends: `${DALLAS_COLLEGE}/special-programs/nights-weekends/`,
   locations: `${DALLAS_COLLEGE}/locations/`,
};

const contacts = {
   continuingEdEmail: "ContinuingEd@DallasCollege.edu",
};

/** Where each application step's link goes, in the same order as the steps in en.ts. */
const esolStepLinks = [links.apply, links.placementTest, links.successCoaching];
const eslStepLinks = [links.successCoaching];

/** ESOL course numbers: one row per level, one column per skill. */
const esolSkills = ["listeningSpeaking", "reading", "writing", "grammar"] as const;

const esolLevels = [
   { level: 1, listeningSpeaking: "ESOL 0031", reading: "ESOL 0041", writing: "ESOL 0051", grammar: "ESOL 0061" },
   { level: 2, listeningSpeaking: "ESOL 0032", reading: "ESOL 0042", writing: "ESOL 0052", grammar: "ESOL 0062" },
   { level: 3, listeningSpeaking: "ESOL 0033", reading: "ESOL 0043", writing: "ESOL 0053", grammar: "ESOL 0063" },
   { level: 4, listeningSpeaking: "ESOL 0034", reading: "ESOL 0044", writing: "ESOL 0054", grammar: "ESOL 0064" },
];

// Font sizes follow the other pages: text-3xl title, text-lg body text, and
// the text-xl / md:text-[22px] section headings used on financial-aid.
const sectionHeading = "mb-4 text-xl font-extrabold text-brand-navy-dark md:mb-6 md:text-[22px]";
const card = "rounded-2xl border-2 border-brand-line bg-white p-4 md:rounded-[18px] md:p-6";
const cardTitle = "text-lg font-extrabold text-brand-navy-dark";
const bodyText = "text-lg";
const bulletList = "flex list-disc flex-col gap-2 ps-5 marker:text-brand-navy";
const tableCell = "px-3.5 py-2.5 text-start";

const t = getMessages();

export const metadata: Metadata = {
   title: `${t.esl.title} | ${t.brand.name}`,
   description: t.esl.description,
};

export default function Esl() {
   const { difference, esolCourses, eslCourses, application, helpfulPages, footnotes, source } = t.esl;

   return (
      <>
         <header className={pageContainer}>
            <h1 className="mt-6 text-3xl font-extrabold">{t.esl.title}</h1>
         </header>

         {/* ESOL and ESL: What's the Difference? */}
         <section aria-labelledby="difference" className={cn(pageContainer, "pt-6 md:pt-10")}>
            <h2 id="difference" className={sectionHeading}>
               {difference.heading}
            </h2>
            <div className="grid gap-3 md:grid-cols-2 md:gap-5">
               <DifferenceCard icon={GraduationCap} title={difference.esol.title} body={difference.esol.body} />
               <DifferenceCard icon={MessagesSquare} title={difference.esl.title} body={difference.esl.body} />
            </div>

            {/* Gold card: WorkReadyU is free, so it is the one that stands out. */}
            <div className="mt-3 flex items-start gap-3.5 rounded-2xl border-[3px] border-brand-navy bg-brand-gold-soft p-4 md:mt-5 md:items-center md:gap-5 md:rounded-[18px] md:p-6">
               <span className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-brand-gold text-brand-navy-dark md:size-16 md:rounded-2xl">
                  <Briefcase aria-hidden="true" className="size-7 md:size-8" />
               </span>
               <p className={cn(bodyText, "min-w-0")}>
                  <InlineText {...difference.workReadyU} href={links.workReadyU} />
               </p>
            </div>
         </section>

         {/* Area of Study Overview: a heading in the Dallas College page, directly above the course sections */}
         <h2 id="area-of-study" className={cn(pageContainer, sectionHeading, "pt-8 md:pt-14")}>
            {t.esl.areaOfStudy}
         </h2>

         {/* ESOL Courses */}
         <section aria-labelledby="esol-courses" className={cn(pageContainer, "pt-0")}>
            <h2 id="esol-courses" className={sectionHeading}>
               {esolCourses.heading}
            </h2>
            <div className={cn(card, "flex min-w-0 flex-col gap-4")}>
               <p className={bodyText}>{esolCourses.intro}</p>

               {/* On a narrow phone the table scrolls sideways inside this box
                   (tabIndex lets keyboard users scroll it too). The Level column
                   stays in place while scrolling, so each row keeps its level. */}
               <div
                  role="region"
                  aria-labelledby="esol-courses-caption"
                  tabIndex={0}
                  className="overflow-x-auto rounded-xl border-2 border-brand-line"
               >
                  <table className="w-full min-w-[520px] border-collapse">
                     <caption id="esol-courses-caption" className={cn(tableCell, "font-bold text-brand-navy-dark")}>
                        <span className="sticky start-3.5 inline-block">{esolCourses.tableCaption}</span>
                     </caption>
                     <thead className="bg-brand-navy text-white">
                        <tr>
                           <th scope="col" className={cn(tableCell, "sticky start-0 bg-brand-navy font-bold")}>
                              {esolCourses.columns.level}
                           </th>
                           {esolSkills.map((skill) => (
                              <th key={skill} scope="col" className={cn(tableCell, "font-bold")}>
                                 {esolCourses.columns[skill]}
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody>
                        {esolLevels.map((row) => (
                           <tr key={row.level} className="border-t border-brand-line bg-white even:bg-brand-page">
                              <th
                                 scope="row"
                                 className={cn(tableCell, "sticky start-0 bg-inherit font-extrabold text-brand-navy-dark")}
                              >
                                 {row.level}
                              </th>
                              {esolSkills.map((skill) => (
                                 <td key={skill} className={cn(tableCell, "whitespace-nowrap")}>
                                    {row[skill]}
                                 </td>
                              ))}
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <p className={bodyText}>{esolCourses.extra}</p>
               <div>
                  <p className={cn(bodyText, "mb-2 font-bold")}>{esolCourses.completeHeading}</p>
                  <ul className={cn(bulletList, bodyText)}>
                     {esolCourses.completeOptions.map((option) => (
                        <li key={option}>{option}</li>
                     ))}
                  </ul>
               </div>
            </div>
         </section>

         {/* ESL Courses */}
         <section aria-labelledby="esl-courses" className={cn(pageContainer, "pt-8 md:pt-14")}>
            <h2 id="esl-courses" className={sectionHeading}>
               {eslCourses.heading}
            </h2>
            <div className={cn(card, "flex flex-col gap-4")}>
               <p className={bodyText}>{eslCourses.intro}</p>
               <h3 className={cardTitle}>{eslCourses.listHeading}</h3>
               <ul className="grid gap-2 md:grid-cols-2">
                  {eslCourses.courses.map(({ code, name }) => (
                     <li
                        key={code}
                        className="flex flex-col rounded-xl bg-brand-page px-3.5 py-2.5 md:flex-row md:items-baseline md:gap-3"
                     >
                        <span className="shrink-0 font-extrabold text-brand-navy-dark">{code}</span>
                        <span>{name}</span>
                     </li>
                  ))}
               </ul>
               <p className={cn(bodyText, "rounded-xl bg-brand-tint px-3.5 py-3")}>{eslCourses.completion}</p>
            </div>
         </section>

         {/* Application Process: ESOL, then ESL */}
         <section aria-labelledby="application" className={cn(pageContainer, "pt-8 md:pt-14")}>
            <h2 id="application" className={sectionHeading}>
               {application.heading}
            </h2>
            <div className="grid gap-3 md:grid-cols-2 md:gap-5">
               <StepList title={application.esol.title} steps={application.esol.steps} hrefs={esolStepLinks} />
               <StepList title={application.esl.title} steps={application.esl.steps} hrefs={eslStepLinks} />
            </div>
            <p className={cn(bodyText, "mt-4 md:mt-6")}>
               {application.questions.before}
               <MailLink email={contacts.continuingEdEmail} />
               {application.questions.after}
            </p>
         </section>

         {/* Helpful Dallas College Pages: registration, nights and weekends, locations */}
         <section aria-labelledby="helpful-pages" className={cn(pageContainer, "pt-8 md:pt-14")}>
            <h2 id="helpful-pages" className={sectionHeading}>
               {helpfulPages.heading}
            </h2>
            <ul className="grid gap-3 md:grid-cols-3 md:gap-5">
               {helpfulPages.items.map(({ key, title, description }) => (
                  <li key={key} className="flex">
                     <a
                        href={helpfulPageLinks[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(card, "flex min-h-11 w-full flex-col gap-2 hover:border-brand-navy")}
                     >
                        <span className="flex items-start justify-between gap-3">
                           <span className={cardTitle}>{title}</span>
                           <ExternalLink aria-hidden="true" className="mt-1 size-5 shrink-0 text-brand-navy" strokeWidth={2.5} />
                        </span>
                        <span className={cn(bodyText, "text-brand-ink")}>{description}</span>
                        <span className="sr-only">({t.esl.opensInNewTab})</span>
                     </a>
                  </li>
               ))}
            </ul>
         </section>

         {/* Footnotes. The numbers match the Dallas College page. */}
         <section aria-label={footnotes.label} className={cn(pageContainer, "pt-8 md:pt-14")}>
            <ol role="list" className="flex flex-col gap-2 border-t-2 border-brand-line pt-4 text-brand-muted">
               {footnotes.items.map((pieces, index) => (
                  <li key={index} className="flex gap-2">
                     <span aria-hidden="true" className="shrink-0 font-bold">
                        {index + 1}
                     </span>
                     <p className="min-w-0">
                        {pieces.map((piece, pieceIndex) =>
                           typeof piece === "string" ? (
                              piece
                           ) : (
                              <FootnoteLink key={pieceIndex} href={footnoteLinks[piece.link]}>
                                 {piece.label}
                              </FootnoteLink>
                           ),
                        )}
                     </p>
                  </li>
               ))}
            </ol>
         </section>

         {/* Where the information on this page comes from */}
         <p
            className={cn(
               pageContainer,
               "flex flex-wrap items-center gap-x-2 pt-5 pb-7 text-brand-muted md:pt-8 md:pb-12",
            )}
         >
            <span>{source.label}</span>
            <TextLink href={links.source}>{source.linkLabel}</TextLink>
            <span>{source.updated}</span>
         </p>
      </>
   );
}

/** ESOL or ESL: icon, name and the paragraph from the Dallas College page. */
function DifferenceCard({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
   return (
      <div className={cn(card, "flex flex-col gap-3.5")}>
         <div className="flex items-center gap-3.5">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-brand-tint text-brand-navy md:size-16 md:rounded-2xl">
               <Icon aria-hidden="true" className="size-7 md:size-8" />
            </span>
            <h3 className={cardTitle}>{title}</h3>
         </div>
         <p className={bodyText}>{body}</p>
      </div>
   );
}

/** A sentence with one link inside it: before text, the link, after text. */
function InlineText({ before, link, after, href }: { before: string; link: string; after: string; href: string }) {
   return (
      <>
         {before}
         <TextLink href={href}>{link}</TextLink>
         {after}
      </>
   );
}

/**
 * Numbered steps. A step with a link has it inside the sentence. `hrefs` holds
 * the link addresses in order, one for each step that has a link.
 */
function StepList({
   title,
   steps,
   hrefs,
}: {
   title: string;
   steps: { before: string; link: string; after: string }[];
   hrefs: string[];
}) {
   let nextLink = 0;

   return (
      <div className={card}>
         <h3 className={cn(cardTitle, "mb-4")}>{title}</h3>
         {/* role="list" keeps this announced as a list in Safari, which drops it when bullets are hidden. */}
         <ol role="list" className="flex flex-col gap-4">
            {steps.map((step, index) => {
               const href = step.link ? hrefs[nextLink++] : undefined;

               return (
                  <li key={index} className="flex items-start gap-3.5">
                     <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-navy text-[17px] font-extrabold text-white"
                     >
                        {index + 1}
                     </span>
                     <p className={cn(bodyText, "min-w-0 pt-1")}>
                        {href ? <InlineText {...step} href={href} /> : step.before}
                     </p>
                  </li>
               );
            })}
         </ol>
      </div>
   );
}

/** Underlined link to a Dallas College page. Opens in a new tab so this site stays open. */
function TextLink({ href, children }: { href: string; children: ReactNode }) {
   return (
      <a
         href={href}
         target="_blank"
         rel="noopener noreferrer"
         className="inline-flex min-h-11 items-center gap-1.5 font-bold text-brand-navy underline underline-offset-4 hover:text-brand-navy-dark"
      >
         {children}
         <ExternalLink aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={2.5} />
         <span className="sr-only">({t.esl.opensInNewTab})</span>
      </a>
   );
}

/**
 * A link inside a footnote. Addresses starting with "#" jump to a heading on
 * this page; all others open the Dallas College (or O*NET) page in a new tab.
 */
function FootnoteLink({ href, children }: { href: string; children: ReactNode }) {
   const className = "font-bold text-brand-navy underline underline-offset-4 hover:text-brand-navy-dark";

   if (href.startsWith("#")) {
      return (
         <a href={href} className={className}>
            {children}
         </a>
      );
   }

   return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
         {children}
         <span className="sr-only"> ({t.esl.opensInNewTab})</span>
      </a>
   );
}

/** An email address inside a sentence; tapping it opens the mail app. */
function MailLink({ email }: { email: string }) {
   return (
      <a
         href={`mailto:${email}`}
         className="font-bold text-brand-navy underline underline-offset-4 [overflow-wrap:anywhere] hover:text-brand-navy-dark"
      >
         {email}
      </a>
   );
}