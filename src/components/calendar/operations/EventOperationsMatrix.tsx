import Link from "next/link";
import type { EventOperationsSummary } from "@/lib/calendar/operations";
import { getReadinessDimensionState } from "@/lib/calendar/operations";
import { READINESS_STATE_LABELS } from "@/lib/calendar/operations";
import type { EventReadinessState } from "@/lib/calendar/operations";
import { EventOperationsRow } from "./EventOperationsRow";

const MATRIX_COLUMNS = [
  ["ownership", "Owner"],
  ["approval", "Approval"],
  ["venue", "Venue"],
  ["candidate", "Kelly"],
  ["staffing", "Staffing"],
  ["tasks", "Tasks"],
  ["promotion", "Promotion"],
  ["verification", "Verification"],
] as const;

function cellLabel(state: string): string {
  return READINESS_STATE_LABELS[state as EventReadinessState] ?? state;
}

function cellRoute(summary: EventOperationsSummary, dimension: string): string {
  const item = summary.readiness.find((r) => r.dimension === dimension);
  return item?.route ?? `/calendar/event/${summary.eventId}`;
}

export function EventOperationsMatrix({ summaries }: { summaries: EventOperationsSummary[] }) {
  const upcoming = summaries.filter((s) => !s.isPast).slice(0, 12);

  return (
    <div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] border-collapse font-fieldSans text-xs">
          <thead>
            <tr className="border-b border-field-ink/15 text-left text-field-ink/60">
              <th className="px-2 py-2 font-semibold">Event</th>
              {MATRIX_COLUMNS.map(([, label]) => (
                <th key={label} className="px-2 py-2 font-semibold">
                  {label}
                </th>
              ))}
              <th className="px-2 py-2 font-semibold">Overall</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map((s) => (
              <tr key={s.eventId} className="border-b border-field-ink/10">
                <td className="px-2 py-2">
                  <Link href={`/calendar/event/${s.eventId}`} className="font-semibold text-field-pine hover:underline">
                    {s.title}
                  </Link>
                </td>
                {MATRIX_COLUMNS.map(([dim]) => {
                  const state = getReadinessDimensionState(s, dim);
                  return (
                    <td key={dim} className="px-2 py-2">
                      <Link
                        href={cellRoute(s, dim)}
                        className="text-field-ink/85 hover:text-field-pine hover:underline"
                        aria-label={`${s.title} ${dim}: ${cellLabel(state)}`}
                      >
                        {cellLabel(state)}
                      </Link>
                    </td>
                  );
                })}
                <td className="px-2 py-2 font-semibold text-field-ink">{cellLabel(s.overallReadiness)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden" aria-label="Readiness matrix — mobile card view">
        {upcoming.map((s) => (
          <EventOperationsRow key={s.eventId} summary={s} />
        ))}
      </div>
    </div>
  );
}
