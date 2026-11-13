"use client"

import { useLocale } from "next-intl"
import { useActionState } from "react"

import {
  submitContactRequest,
  type ContactFormState,
} from "@/app/[locale]/(frontend)/get-connected/actions"
import { Field, FieldError, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/ui/language-provider"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { helpTopics, situations } from "@/lib/contact-request"
import { getMessages } from "@/lib/i18n"
import { languages } from "@/lib/i18n/languages"

const initialState: ContactFormState = { status: "idle" }

/**
 * The Get Connected form (issue #11).
 *
 * TODO(Angie):
 * 1. Style it like the approved mockup: big fields (min 48px tall), 16px+
 *    text, full width on phones.
 * 2. Validation UX: check a field when the visitor leaves it (onBlur), and
 *    clear its error as soon as they fix it. Right now errors only show
 *    after pressing Send.
 * 3. Move focus to the first field with an error after a failed send.
 * 4. Design the thank-you state (mockup "Request sent" page).
 */
function GetConnectedForm() {
  const t = getMessages(useLocale()).getConnected
  const { current } = useLanguage()
  const [state, formAction, pending] = useActionState(submitContactRequest, initialState)

  if (state.status === "sent") {
    return (
      <div role="status" className="rounded-2xl border-2 border-brand-line p-6">
        <h2 className="text-xl font-bold">{t.thankYouTitle}</h2>
        <p>{t.thankYouBody}</p>
      </div>
    )
  }

  const errorFor = (field: string) => {
    const key = state.fieldErrors?.[field]
    return key ? t.errors[key] : undefined
  }
  const value = (field: string) => state.values?.[field]

  return (
    <form action={formAction} noValidate className="max-w-xl">
      <FieldGroup>
        <Field data-invalid={!!errorFor("fullName")}>
          <FieldLabel htmlFor="fullName">{t.fields.fullName}</FieldLabel>
          <Input id="fullName" name="fullName" autoComplete="name" required
            defaultValue={value("fullName")} aria-invalid={!!errorFor("fullName")} />
          <FieldError>{errorFor("fullName")}</FieldError>
        </Field>

        <FieldDescription>{t.fields.contactHint}</FieldDescription>
        <Field data-invalid={!!errorFor("email")}>
          <FieldLabel htmlFor="email">{t.fields.email}</FieldLabel>
          <Input id="email" name="email" type="email" autoComplete="email"
            defaultValue={value("email")} aria-invalid={!!errorFor("email")} />
          <FieldError>{errorFor("email")}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="phone">{t.fields.phone}</FieldLabel>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={value("phone")} />
        </Field>

        <Field data-invalid={!!errorFor("preferredLanguage")}>
          <FieldLabel htmlFor="preferredLanguage">{t.fields.preferredLanguage}</FieldLabel>
          {/* Starts on the language the visitor picked in the top bar. */}
          <NativeSelect id="preferredLanguage" name="preferredLanguage" className="w-full"
            defaultValue={value("preferredLanguage") ?? current}>
            {languages.map((language) => (
              <NativeSelectOption key={language.code} value={language.code} lang={language.code}>
                {language.nativeName}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError>{errorFor("preferredLanguage")}</FieldError>
        </Field>

        <Field data-invalid={!!errorFor("situation")}>
          <FieldLabel htmlFor="situation">{t.fields.situation}</FieldLabel>
          <NativeSelect id="situation" name="situation" className="w-full"
            defaultValue={value("situation") ?? ""} aria-invalid={!!errorFor("situation")}>
            <NativeSelectOption value="" disabled>{t.fields.choose}</NativeSelectOption>
            {situations.map((key) => (
              <NativeSelectOption key={key} value={key}>{t.situations[key]}</NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError>{errorFor("situation")}</FieldError>
        </Field>

        <Field data-invalid={!!errorFor("helpWith")}>
          <FieldLabel htmlFor="helpWith">{t.fields.helpWith}</FieldLabel>
          <NativeSelect id="helpWith" name="helpWith" className="w-full"
            defaultValue={value("helpWith") ?? ""} aria-invalid={!!errorFor("helpWith")}>
            <NativeSelectOption value="" disabled>{t.fields.choose}</NativeSelectOption>
            {helpTopics.map((key) => (
              <NativeSelectOption key={key} value={key}>{t.helpTopics[key]}</NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError>{errorFor("helpWith")}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="notes">{t.fields.notes}</FieldLabel>
          <Textarea id="notes" name="notes" rows={4} defaultValue={value("notes")} />
        </Field>

        <FieldError>{errorFor("form")}</FieldError>
        <p className="text-sm text-brand-muted">{t.privacyNote}</p>

        <button type="submit" disabled={pending}
          className="min-h-12 rounded-full bg-brand-navy px-6 text-[17px] font-bold text-white disabled:opacity-60">
          {pending ? t.sending : t.submit}
        </button>
      </FieldGroup>
    </form>
  )
}

export { GetConnectedForm }
