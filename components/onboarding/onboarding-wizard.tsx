"use client"

import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react"
import { useLocale } from "next-intl"
import { useEffect, useId, useRef, useState } from "react"

import { StepIndicator } from "@/components/onboarding/step-indicator"
import { useRouter } from "@/i18n/navigation"
import { formatNumber, getMessages } from "@/lib/i18n"
import {
  emptyAnswers,
  ONBOARDING_STEPS,
  optionText,
  saveAnswers,
  type OnboardingAnswers,
  type OnboardingOptionId,
} from "@/lib/onboarding"
import { sitePages } from "@/lib/site-pages"
import { cn } from "@/lib/utils"

/**
 * The /start questions, one step at a time (issue #49).
 *
 * - The steps and answers come from lib/onboarding.ts, so adding or changing
 *   an answer never needs changes here.
 * - The answers are kept in this component's state (useState) while the
 *   student answers.
 * - Each answer is a real checkbox (keyboard and screen reader friendly),
 *   drawn as a big picture card.
 * - "Start chatting" keeps the answers in this tab's memory (sessionStorage,
 *   see lib/onboarding.ts) and opens the chatbot, which reads them there.
 */
function OnboardingWizard() {
  const locale = useLocale()
  const t = getMessages(locale)
  const text = t.onboarding
  const router = useRouter()
  const formId = useId()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const movedStep = useRef(false)

  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<OnboardingAnswers>(emptyAnswers)
  const [showError, setShowError] = useState(false)

  const step = ONBOARDING_STEPS[currentStep]
  const stepText = text.steps[step.id]
  const picked = answers[step.id]
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1
  const invalid = showError && step.required && picked.length === 0
  const hintId = `${formId}-hint`
  const errorId = `${formId}-error`

  // After Next or Back, move focus to the new question so keyboard and screen
  // reader users start there (not on the first page load).
  useEffect(() => {
    if (!movedStep.current) return
    headingRef.current?.focus()
  }, [currentStep])

  function toggle(id: OnboardingOptionId, exclusive: boolean) {
    setShowError(false)
    setAnswers((all) => {
      const current = all[step.id]
      const exclusiveIds = step.options.filter((option) => "exclusive" in option && option.exclusive).map((option) => option.id)
      let next: OnboardingOptionId[]
      if (current.includes(id)) next = current.filter((picked) => picked !== id)
      // "I'm not sure" clears the other answers; any other answer clears it.
      else if (exclusive) next = [id]
      else next = [...current.filter((picked) => !(exclusiveIds as string[]).includes(picked)), id]
      return { ...all, [step.id]: next }
    })
  }

  function goTo(index: number) {
    movedStep.current = true
    setShowError(false)
    setCurrentStep(index)
  }

  function finish(finalAnswers: OnboardingAnswers) {
    // Placeholder hand-off from the issue (AC 6): shows the answers in the
    // browser console. The chat page reads them from this tab's memory.
    console.log("[onboarding] answers", finalAnswers)
    saveAnswers(finalAnswers)
    router.push(sitePages.askQuestion.href)
  }

  function next(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step.required && picked.length === 0) {
      setShowError(true)
      return
    }
    if (isLastStep) finish(answers)
    else goTo(currentStep + 1)
  }

  function skip() {
    const skipped = { ...answers, [step.id]: [] }
    setAnswers(skipped)
    if (isLastStep) finish(skipped)
    else goTo(currentStep + 1)
  }

  const secondaryButton =
    "flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 border-brand-navy bg-white px-5 font-bold text-brand-navy hover:bg-brand-tint md:text-[17px]"

  return (
    <form onSubmit={next} noValidate className="flex flex-col gap-5 md:gap-6">
      <StepIndicator
        step={currentStep + 1}
        total={ONBOARDING_STEPS.length}
        label={text.progress
          .replace("{step}", formatNumber(currentStep + 1, locale))
          .replace("{total}", formatNumber(ONBOARDING_STEPS.length, locale))}
      />

      <fieldset
        aria-describedby={invalid ? `${hintId} ${errorId}` : hintId}
        aria-invalid={invalid || undefined}
        className="min-w-0"
      >
        {/* The legend names the group of checkboxes for screen readers. */}
        <legend className="mb-2 w-full">
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl leading-tight font-extrabold text-brand-navy-dark outline-none md:text-[30px]"
          >
            {stepText.title}
          </h2>
        </legend>
        <div className="flex flex-col gap-4">
          <p id={hintId} className="text-[17px] text-brand-muted">
            {stepText.hint}
          </p>

          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-4">
            {step.options.map((option) => {
              const checked = (picked as string[]).includes(option.id)
              const Icon = option.icon
              const exclusive = "exclusive" in option && option.exclusive === true

              return (
                <label
                  key={option.id}
                  className={cn(
                    "relative flex min-h-[112px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 px-2 py-3.5 text-center md:min-h-[84px] md:flex-row md:justify-start md:gap-3.5 md:px-[18px] md:text-start",
                    "has-[input:focus-visible]:outline-[3px] has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-brand-navy",
                    checked
                      ? "border-brand-navy bg-brand-gold-soft ring-1 ring-brand-navy"
                      : invalid
                        ? "border-red-700 bg-white"
                        : "border-brand-line bg-white hover:border-brand-navy",
                  )}
                >
                  <input
                    type="checkbox"
                    name={step.id}
                    value={option.id}
                    checked={checked}
                    onChange={() => toggle(option.id, exclusive)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-[14px]",
                      checked ? "bg-brand-gold text-brand-navy-dark" : "bg-brand-tint text-brand-navy",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <span className="text-base leading-snug font-extrabold text-brand-navy-dark md:flex-1 md:text-lg">
                    {optionText(t, option.id).label}
                  </span>
                  {/* Check mark in the corner when picked (the checkbox itself says "checked" to screen readers). */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute end-2 top-2 flex size-6 items-center justify-center rounded-full md:static md:size-7",
                      checked ? "bg-brand-navy text-white" : "border-2 border-brand-line bg-white",
                    )}
                  >
                    {checked && <Check className="size-4" strokeWidth={3} />}
                  </span>
                </label>
              )
            })}
          </div>

          {invalid && "error" in stepText && (
            <p id={errorId} role="alert" className="font-bold text-red-700">
              {stepText.error}
            </p>
          )}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-2.5 border-t border-brand-line-soft pt-4 md:gap-3">
        {currentStep > 0 && (
          <button type="button" onClick={() => goTo(currentStep - 1)} className={secondaryButton}>
            <ArrowLeft aria-hidden="true" className="size-5 rtl:-scale-x-100" strokeWidth={2.5} />
            {text.back}
          </button>
        )}
        <div className="ms-auto flex flex-wrap gap-2.5 md:gap-3">
          {!step.required && (
            <button type="button" onClick={skip} className={cn(secondaryButton, "border-brand-line")}>
              {text.skip}
            </button>
          )}
          <button
            type="submit"
            className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-brand-navy px-6 font-bold text-white hover:bg-brand-navy-dark md:text-[17px]"
          >
            {isLastStep ? text.startChatting : text.next}
            {isLastStep ? (
              <MessageCircle aria-hidden="true" className="size-5" />
            ) : (
              <ArrowRight aria-hidden="true" className="size-5 rtl:-scale-x-100" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

export { OnboardingWizard }
