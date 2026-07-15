import type { EventAttentionSeverity, EventReadinessState } from "@/lib/calendar/operations";
import { ATTENTION_SEVERITY_LABELS, READINESS_STATE_LABELS } from "@/lib/calendar/operations";

export function ReadinessBadge({ state }: { state: EventReadinessState }) {
  const label = READINESS_STATE_LABELS[state];
  const tone =
    state === "blocked"
      ? "border-red-300 bg-red-50 text-red-900"
      : state === "ready" || state === "complete"
        ? "border-emerald-300 bg-emerald-50 text-emerald-900"
        : state === "in_progress"
          ? "border-amber-300 bg-amber-50 text-amber-900"
          : state === "not_required"
            ? "border-field-ink/10 bg-field-paper text-field-ink/60"
            : "border-field-ink/20 bg-white text-field-ink/80";
  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 font-fieldSans text-xs font-semibold ${tone}`}>
      {label}
    </span>
  );
}

export function AttentionBadge({ severity }: { severity: EventAttentionSeverity }) {
  const label = ATTENTION_SEVERITY_LABELS[severity];
  const tone =
    severity === "critical"
      ? "border-red-400 bg-red-100 text-red-950"
      : severity === "urgent"
        ? "border-orange-300 bg-orange-50 text-orange-950"
        : severity === "needs_attention"
          ? "border-amber-300 bg-amber-50 text-amber-950"
          : severity === "watch"
            ? "border-sky-200 bg-sky-50 text-sky-900"
            : "border-field-ink/10 bg-field-paper text-field-ink/55";
  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 font-fieldSans text-xs font-semibold ${tone}`}>
      {label}
    </span>
  );
}

export function SoftBetaOperationsNote() {
  return (
    <p className="font-fieldSans text-xs text-field-mist/80">
      Gate A: OPEN · Persistence: session_soft_beta · RBAC: audit_only · Enforcement: false · Scheduling authority:
      soft beta · Records are not Postgres-authoritative.
    </p>
  );
}
