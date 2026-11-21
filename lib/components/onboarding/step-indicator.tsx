/**
 * "Step 1 of 2" plus a bar that fills up (issue #49). The words carry the
 * meaning; the bar is only a picture of them, so screen readers skip it.
 */
function StepIndicator({ step, total, label }: { step: number; total: number; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[15px] font-bold text-brand-muted">{label}</p>
      <div aria-hidden="true" className="flex gap-1.5">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={`h-2 flex-1 rounded-full ${index < step ? "bg-brand-navy" : "bg-brand-line-soft"}`}
          />
        ))}
      </div>
    </div>
  )
}

export { StepIndicator }
