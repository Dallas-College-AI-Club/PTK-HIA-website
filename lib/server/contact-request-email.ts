import "server-only";

import { randomInt } from "node:crypto";

import nodemailer from "nodemailer";

import type { ContactRequest } from "@/lib/contact-request";
import { getMessages } from "@/lib/i18n";
import type { LanguageCode } from "@/lib/i18n/languages";

/**
 * Emails a Get Connected request to PTK and the Dallas College Success
 * Coaches (issue #11). It sends from PTK's Gmail account.
 *
 * Setup (plain English): docs/GET_CONNECTED_EMAIL_SETUP.md
 * Needs these in .env.local (and in Vercel):
 *   GMAIL_USER          the Gmail address that sends the email
 *   GMAIL_APP_PASSWORD  a Gmail "App Password" (not the normal password)
 *   CONTACT_EMAIL_TO    who receives it, separated by commas
 */

// The email goes to staff, so the language is written in English.
const languageNames: Record<LanguageCode, string> = {
   en: "English",
   es: "Spanish",
   ar: "Arabic",
   my: "Burmese",
   sw: "Swahili",
};

// No look-alike characters (0/O, 1/I/L), so the ID is easy to read out loud.
const ID_CHARACTERS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/**
 * A short ID for one request, like GC-20261112-7F3KQ (Get Connected, the date
 * in Dallas, 5 random characters). PTK and the Success Coaches get the same
 * email, so they can both point to a request by its ID.
 */
export function createRequestId(now = new Date()) {
   // en-CA formats the date as YYYY-MM-DD.
   const date = now.toLocaleDateString("en-CA", { timeZone: "America/Chicago" }).replaceAll("-", "");
   const random = Array.from({ length: 5 }, () => ID_CHARACTERS[randomInt(ID_CHARACTERS.length)]).join("");
   return `GC-${date}-${random}`;
}

export async function emailContactRequest(requestId: string, request: ContactRequest) {
   const user = process.env.GMAIL_USER;
   const pass = process.env.GMAIL_APP_PASSWORD;
   const to = process.env.CONTACT_EMAIL_TO;

   if (!user || !pass || !to) {
      throw new Error(
         "Get Connected email is not set up. Add GMAIL_USER, GMAIL_APP_PASSWORD and CONTACT_EMAIL_TO to .env.local.",
      );
   }

   const t = getMessages().getConnected;
   const helpWith = t.helpTopics[request.helpWith];
   // Keep the visitor's name on one line, so it can't add fake lines.
   const name = request.fullName.replace(/\s+/g, " ");

   const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });

   await transporter.sendMail({
      from: { name: "PTK Get Connected", address: user },
      to,
      // "Reply" goes straight to the visitor when they gave an email.
      replyTo: request.email || undefined,
      // The ID also keeps each request in its own email thread.
      subject: `[${requestId}] Get Connected: ${helpWith} (${name})`,
      // Plain text only, so nothing the visitor types can change how the email looks.
      text: [
         "New Get Connected request from the PTK × AI Club website.",
         "",
         `Request ID: ${requestId}`,
         `Name: ${name}`,
         `Email: ${request.email || "Not given"}`,
         `Phone: ${request.phone || "Not given"}`,
         `Preferred language: ${languageNames[request.preferredLanguage]}`,
         `Describes them best: ${t.situations[request.situation]}`,
         `Needs help with: ${helpWith}`,
         "",
         "Notes:",
         request.notes || "None",
         "",
         request.email
            ? "Reply to this email to answer them directly."
            : "They did not give an email. Please call or text the phone number above.",
         `Please use the request ID ${requestId} when talking about this request.`,
      ].join("\n"),
   });
}