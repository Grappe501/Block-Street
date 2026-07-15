import Link from "next/link";
import type { EventOperationsSummary } from "@/lib/calendar/operations";
import { AttentionBadge } from "./OperationsBadges";

export function EventOperationsWidget({
  title,
  summaries,
  moreHref,
  variant = "default",
}: {
  title: string;
  summaries: EventOperationsSummary[];
  moreHref: string;
  variant?: "default" | "college" | "county" | "campaign";
}) {
  const sorted = [...summaries]
    .filter((s) => s.attentionSeverity !== "none" || variant === "default")
    .sort((a, b) => a.startAt.localeCompare(b.startAt))
    .slice(0, 5);

  const nextEvent = [...summaries].sort((a, b) => a.startAt.localeCompare(b.startAt)).find((s) => !s.isPast);

  return (
    <div className="rounded-xl border border-field-ink/15 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-fieldDisplay text-lg text-field-ink">{title}</h3>
        <Link href={moreHref} className="font-fieldSans text-xs font-semibold text-field-pine underline">
          View all
        </Link>
      </div>
      <p className="mt-1 font-fieldSans text-xs text-field-ink/55">
        Soft beta · session catalog · Gate A OPEN
      </p>

      {variant === "college" && nextEvent ? (
        <div className="mt-3 rounded-lg border border-field-ink/10 bg-field-paper px-3 py-2">
          <p className="font-fieldSans text-xs font-semibold text-field-ink/55">Next campus event</p>
          <Link href={`/calendar/event/${nextEvent.eventId}`} className="font-fieldSans text-sm font-bold text-field-pine underline">
            {nextEvent.title}
          </Link>
        </div>
      ) : null}

      {variant === "county" && nextEvent ? (
        <div className="mt-3 rounded-lg border border-field-ink/10 bg-field-paper px-3 py-2">
          <p className="font-fieldSans text-xs font-semibold text-field-ink/55">Next county event</p>
          <Link href={`/calendar/event/${nextEvent.eventId}`} className="font-fieldSans text-sm font-bold text-field-pine underline">
            {nextEvent.title}
          </Link>
        </div>
      ) : null}

      {variant === "campaign" ? (
        <p className="mt-2 font-fieldSans text-xs text-field-ink/65">
          {summaries.filter((s) => s.kellyRequested).length} Kelly request(s) ·{" "}
          {summaries.filter((s) => s.attentionKeys.includes("critical_staffing_gap")).length} critical staffing gap(s)
        </p>
      ) : null}

      <ul className="mt-3 space-y-2">
        {sorted.length === 0 ? (
          <li className="font-fieldSans text-sm text-field-ink/60">No events in this scope.</li>
        ) : (
          sorted.map((s) => (
            <li key={s.eventId} className="rounded-lg border border-field-ink/10 px-3 py-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link href={`/calendar/event/${s.eventId}`} className="font-fieldSans text-sm font-semibold text-field-ink hover:text-field-pine">
                  {s.title}
                </Link>
                <AttentionBadge severity={s.attentionSeverity} />
              </div>
              <p className="mt-1 font-fieldSans text-xs text-field-ink/60">
                {s.attentionReasons[0] ?? s.ownerLabel ?? "On track"}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
