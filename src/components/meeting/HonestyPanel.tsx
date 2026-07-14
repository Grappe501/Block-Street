import { JULY14_AGENDA_REGISTRY } from "@/lib/presentations/july14-registry";

type HonestyPanelProps = {
  compact?: boolean;
  title?: string;
  workingNow?: string[];
  stillCompleting?: string[];
  className?: string;
};

export function HonestyPanel({
  compact = false,
  title = "What is live today?",
  workingNow,
  stillCompleting,
  className = "",
}: HonestyPanelProps) {
  const now = workingNow ?? JULY14_AGENDA_REGISTRY.honesty.working_now;
  const pending = stillCompleting ?? JULY14_AGENDA_REGISTRY.honesty.still_being_completed;

  return (
    <details
      className={`rounded-xl border border-slate-200 bg-white ${compact ? "p-3" : "p-4"} ${className}`}
      open={!compact}
    >
      <summary className="cursor-pointer text-sm font-bold text-slate-900">{title}</summary>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold text-emerald-700">Working now</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-slate-700">
            {now.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold text-amber-700">Still being completed</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-slate-700">
            {pending.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Soft beta is credible. Launch readiness is not certified. Invite-chain package remains PRESENT, not CERTIFIED.
      </p>
    </details>
  );
}
