export function ChainFlow({
  steps,
  compact = false,
  /** `dark` = light text for dusk/presentation backgrounds; `light` = ink on paper */
  tone = "light",
}: {
  steps: string[];
  compact?: boolean;
  tone?: "light" | "dark";
}) {
  const labelClass = tone === "dark" ? "text-field-mist" : "text-field-ink";
  const railClass = tone === "dark" ? "bg-field-wheat/40" : "bg-field-canopy/35";

  return (
    <ol
      className={`flex flex-col gap-0 ${compact ? "" : "lg:flex-row lg:flex-wrap lg:items-stretch lg:gap-2"}`}
      aria-label="Process chain"
    >
      {steps.map((step, i) => (
        <li
          key={step}
          className={`group relative flex items-center gap-3 animate-fieldRise ${compact ? "py-2" : "lg:flex-col lg:items-start lg:gap-2 lg:py-0"}`}
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-field-wheat/90 font-fieldSans text-xs font-bold text-field-dusk">
              {i + 1}
            </span>
            <span
              className={`font-fieldSans font-semibold ${labelClass} ${compact ? "text-sm" : "text-sm lg:max-w-[9.5rem] lg:text-[13px] lg:leading-snug"}`}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 ? (
            <span
              aria-hidden
              className={`ml-4 h-6 w-px lg:ml-0 lg:mt-1 lg:h-px lg:w-8 lg:self-center ${railClass}`}
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
