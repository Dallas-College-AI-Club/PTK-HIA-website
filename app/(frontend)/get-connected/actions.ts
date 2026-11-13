"use server";

import { contactRequestSchema, type ContactRequestErrorKey } from "@/lib/contact-request";
import { createRequestId, emailContactRequest } from "@/lib/server/contact-request-email";

export type ContactFormState = {
   status: "idle" | "error" | "sent";
   /** Field name -> error key from en.ts (getConnected.errors). */
   fieldErrors?: Partial<Record<string, ContactRequestErrorKey>>;
   /** What the visitor typed, so the form keeps it after an error. */
   values?: Record<string, string>;
};

/**
 * Runs on the server when the Get Connected form is sent.
 * Flow: browser form -> this function -> email to PTK and the Success
 * Coaches (and, TODO, the Neon database) -> back to the form, which shows
 * errors or the thank-you message.
 */
export async function submitContactRequest(
   _previous: ContactFormState,
   formData: FormData,
): Promise<ContactFormState> {
   const values = Object.fromEntries(
      [...formData.entries()].map(([key, value]) => [key, String(value)]),
   );

   const result = contactRequestSchema.safeParse(values);

   if (!result.success) {
      const fieldErrors: ContactFormState["fieldErrors"] = {};
      for (const issue of result.error.issues) {
         const field = String(issue.path[0]);
         // Keep the first error per field.
         fieldErrors[field] ??= issue.message as ContactRequestErrorKey;
      }
      return { status: "error", fieldErrors, values };
   }

   // Shown in the email so PTK and the Success Coaches can refer to it.
   const requestId = createRequestId();

   // TODO(Angie, with backend): save result.data to Neon.
   // 1. Add a contact_requests table in lib/db/schema.ts (fields match
   //    lib/contact-request.ts, plus created_at; use requestId as the id).
   // 2. await db.insert(contactRequestsTable).values(result.data)
   // 3. On failure return { status: "error", fieldErrors: { form: "generic" }, values }.
   // Ask in the team chat first: drizzle.config.ts still points at src/db.

   try {
      await emailContactRequest(requestId, result.data);
   } catch (error) {
      // Nothing is saved yet, so show an error and let the visitor try again
      // instead of a thank-you for a request nobody received.
      console.error(`Get Connected email failed (${requestId}):`, error);
      return { status: "error", fieldErrors: { form: "generic" }, values };
   }

   return { status: "sent" };
}