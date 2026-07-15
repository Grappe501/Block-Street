import Link from "next/link";
import type { EventOperationsSummary } from "@/lib/calendar/operations";
import { AttentionBadge, ReadinessBadge } from "./OperationsBadges";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function EventOperationsRow({ summary }: { summary: EventOperationsSummary }) {
  const mainReason = summary.attentionReasons[0] ?? "No immediate attention flags.";
  return (
    <article className="rounded-xl border border-field-ink/15 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            href={`/calendar/event/${summary.eventId}`}
            className="font-fieldSans text-sm font-bold text-field-ink hover:text-field-pine"
          >
            {summary.title}
          </Link>
          <p className="mt-1 font-fieldSans text-xs text-field-ink/65">{formatWhen(summary.startAt)}</p>
          <p className="mt-1 font-fieldSans text-xs text-field-ink/55">{summary.scopeLabels.join(" · ")}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <AttentionBadge severity={summary.attentionSeverity} />
          <ReadinessBadge state={summary.overallReadiness} />
        </div>
      </div>
      <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div>
          <dt className="font-fieldSans font-semibold text-field-ink/55">Owner</dt>
          <dd className="font-fieldSans text-field-ink/85">{summary.ownerLabel ?? "Unassigned"}</dd>
        </div>
        <div>
          <dt className="font-fieldSans font-semibold text-field-ink/55">Attention</dt>
          <dd className="font-fieldSans text-field-ink/85">{mainReason}</dd>
        </div>
        <div>
          <dt className="font-fieldSans font-semibold text-field-ink/55">Staffing</dt>
          <dd className="font-fieldSans text-field-ink/85">{summary.staffingStatus.replace(/_/g, " ")}</dd>
        </div>
        <div>
          <dt className="font-fieldSans font-semibold text-field-ink/55">Approval / Kelly</dt>
          <dd className="font-fieldSans text-field-ink/85">
            {summary.approvalStatus.replace(/_/g, " ")} · {summary.candidateAttendanceStatus.replace(/_/g, " ")}
          </dd>
        </div>
      </dl>
      {summary.primaryNextAction ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-field-ink/10 pt-3">
          <p className="font-fieldSans text-xs text-field-ink/75">
            <span className="font-semibold text-field-ink">Next: </span>
            {summary.primaryNextAction.label}
          </p>
          <Link
            href={summary.primaryNextAction.route}
            className="rounded-lg bg-field-dusk px-3 py-1.5 font-fieldSans text-xs font-bold text-field-wheat hover:bg-field-pine"
          >
            Open
          </Link>
        </div>
      ) : null}
    </article>
  );
}

export function EventOperationsQueue({ summaries }: { summaries: EventOperationsSummary[] }) {
  if (summaries.length === 0) {
    return <p className="font-fieldSans text-sm text-field-ink/60">No events in this queue.</p>;
  }
  return (
    <ul className="space-y-3">
      {summaries.map((s) => (
        <li key={s.eventId}>
          <EventOperationsRow summary={s} />
        </li>
      ))}
    </ul>
  );
}
