import Link from "next/link";
import type { CalendarCandidateSummary } from "@/lib/calendar/candidate-request/types";

export function CandidateSoftBetaNote() {
  return (
    <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 font-fieldSans text-xs text-amber-900">
      Soft-beta candidate request workflow. Request ≠ confirmation — nothing here is durable production authority while Gate A is open.
    </p>
  );
}

export function EventCandidateSummaryCard({
  summary,
  eventId,
}: {
  summary: CalendarCandidateSummary;
  eventId: string;
}) {
  const total =
    summary.requestTotal +
    summary.briefingTotal +
    summary.travelTotal +
    summary.communicationTotal +
    summary.confirmationTotal;
  if (total === 0) return null;
  return (
    <section className="rounded-lg border bg-white p-4 font-fieldSans text-sm">
      <h2 className="font-bold text-field-pine">Candidate request</h2>
      <p className="text-field-ink/70">
        Status: {summary.attendanceSnapshot.replace(/_/g, " ")} · Request {summary.requestReady}/{summary.requestTotal} ·
        Travel {summary.travelReady}/{summary.travelTotal}
      </p>
      {summary.incompleteRequired > 0 && (
        <p className="text-xs text-amber-800">{summary.incompleteRequired} required incomplete</p>
      )}
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <Link href={`/calendar/event/${eventId}/candidate-request`} className="text-field-pine underline">Open request</Link>
        <Link href={`/calendar/event/${eventId}/candidate-request/travel`} className="text-field-pine underline">Travel</Link>
      </div>
    </section>
  );
}
