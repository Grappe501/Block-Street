import Link from "next/link";
import type { EventOperationsSummary } from "@/lib/calendar/operations";
import { AttentionBadge, ReadinessBadge } from "./OperationsBadges";
import { READINESS_STATE_LABELS } from "@/lib/calendar/operations";

export function EventOperationsPanel({ summary }: { summary: EventOperationsSummary }) {
  const eventId = summary.eventId;
  const drilldowns = [
    { href: `/calendar/event/${eventId}/approvals`, label: "Approvals", status: summary.approvalStatus },
    { href: `/calendar/event/${eventId}/staffing`, label: "Staffing", status: summary.staffingStatus },
    { href: `/calendar/event/${eventId}/candidate-request`, label: "Candidate", status: summary.candidateAttendanceStatus },
    { href: `/calendar/event/${eventId}/report`, label: "Report", status: summary.operationalStatus },
    { href: `/calendar/event/${eventId}/approvals`, label: "Publication", status: summary.publicationStatus, planned: true },
    { href: `/command/events/conflicts`, label: "Conflicts", status: summary.hasConflict ? "unresolved" : "clear", planned: !summary.hasConflict },
  ] as const;

  return (
    <section className="rounded-xl border border-field-ink/15 bg-white p-4" aria-labelledby="event-ops-panel">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id="event-ops-panel" className="font-fieldDisplay text-lg text-field-ink">
          Event Operations
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <AttentionBadge severity={summary.attentionSeverity} />
          <ReadinessBadge state={summary.overallReadiness} />
        </div>
      </div>
      <p className="mt-2 font-fieldSans text-xs text-field-ink/60">
        Soft-beta readiness from seed/session catalog — not production scheduling authority.
      </p>

      {summary.attentionReasons.length > 0 ? (
        <div className="mt-4">
          <p className="font-fieldSans text-xs font-semibold uppercase text-field-ink/55">Attention</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/85">
            {summary.attentionReasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {summary.primaryNextAction ? (
        <div className="mt-4 rounded-lg border border-field-pine/30 bg-field-paper px-3 py-2">
          <p className="font-fieldSans text-xs font-semibold text-field-ink/55">Primary next action</p>
          <p className="mt-1 font-fieldSans text-sm text-field-ink">{summary.primaryNextAction.label}</p>
          <Link href={summary.primaryNextAction.route} className="mt-2 inline-block text-sm font-semibold text-field-pine underline">
            Go →
          </Link>
        </div>
      ) : null}

      <div className="mt-4">
        <p className="font-fieldSans text-xs font-semibold uppercase text-field-ink/55">Readiness dimensions</p>
        <ul className="mt-2 divide-y divide-field-ink/10 rounded-lg border border-field-ink/10">
          {summary.readiness.map((item) => (
            <li key={item.dimension} className="flex flex-wrap items-start justify-between gap-2 px-3 py-2">
              <div className="min-w-0">
                <p className="font-fieldSans text-sm font-semibold text-field-ink">{item.label}</p>
                <p className="font-fieldSans text-xs text-field-ink/70">{item.explanation}</p>
              </div>
              <span className="shrink-0 font-fieldSans text-xs font-semibold text-field-ink/80">
                {READINESS_STATE_LABELS[item.state]}
              </span>
            </li>
          ))}
        </ul>
        {summary.readinessRatio ? (
          <p className="mt-2 font-fieldSans text-xs text-field-ink/55">
            {summary.readinessRatio.completed}/{summary.readinessRatio.required} required dimensions ready or complete
          </p>
        ) : null}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {drilldowns.map((d) => (
          <Link
            key={d.label}
            href={d.href}
            className="rounded-lg border border-field-ink/15 px-3 py-2 hover:border-field-pine/40"
          >
            <p className="font-fieldSans text-xs font-semibold text-field-ink">{d.label}</p>
            <p className="font-fieldSans text-xs text-field-ink/65">{String(d.status).replace(/_/g, " ")}</p>
            {"planned" in d && d.planned ? (
              <p className="mt-1 font-fieldSans text-[11px] text-field-ink/50">Planned for CAL-P2 · soft-beta preview</p>
            ) : null}
          </Link>
        ))}
      </div>

      <p className="mt-4 font-fieldSans text-xs text-field-ink/55">
        Owner: {summary.ownerLabel ?? "Unassigned (soft beta)"} · Conflict:{" "}
        {summary.hasConflict ? "unresolved — review conflicts board" : "none flagged"}
      </p>
    </section>
  );
}
