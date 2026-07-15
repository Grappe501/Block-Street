import Link from "next/link";
import type { CalendarRsvpSummary } from "@/lib/calendar/rsvp/types";
import type { CalendarVerificationSummary } from "@/lib/calendar/verification/types";

export function RsvpSoftBetaNote() {
  return (
    <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 font-fieldSans text-xs text-amber-900">
      Soft-beta RSVP tracking. Responses are not durable attendance records while Gate A is open.
    </p>
  );
}

export function VerificationSoftBetaNote() {
  return (
    <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 font-fieldSans text-xs text-amber-900">
      Soft-beta venue and compliance verification. Calendar approval ≠ venue or legal approval.
    </p>
  );
}

export function EventRsvpSummaryCard({ summary, eventId }: { summary: CalendarRsvpSummary; eventId: string }) {
  if (summary.planTotal + summary.operationsTotal === 0) return null;
  return (
    <section className="rounded-lg border bg-white p-4 font-fieldSans text-sm">
      <h2 className="font-bold text-field-pine">RSVP plan</h2>
      <p className="text-field-ink/70">
        Plan {summary.planReady}/{summary.planTotal} · Operations {summary.operationsReady}/{summary.operationsTotal} ·
        {summary.headcountEstimate} estimated attendees
      </p>
      {summary.incompleteRequired > 0 && (
        <p className="text-xs text-amber-800">{summary.incompleteRequired} required incomplete</p>
      )}
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <Link href={`/calendar/event/${eventId}/rsvp`} className="text-field-pine underline">Open RSVP</Link>
        <Link href={`/calendar/event/${eventId}/rsvp/records`} className="text-field-pine underline">Records</Link>
      </div>
    </section>
  );
}

export function EventVerificationSummaryCard({
  summary,
  eventId,
}: {
  summary: CalendarVerificationSummary;
  eventId: string;
}) {
  const total = summary.venueTotal + summary.campusTotal + summary.legalTotal + summary.accessibilityTotal;
  if (total === 0) return null;
  const done = summary.venueVerified + summary.campusVerified + summary.legalVerified + summary.accessibilityVerified;
  return (
    <section className="rounded-lg border bg-white p-4 font-fieldSans text-sm">
      <h2 className="font-bold text-field-pine">Verification checklist</h2>
      <p className="text-field-ink/70">
        Venue {summary.venueVerified}/{summary.venueTotal} · Campus {summary.campusVerified}/{summary.campusTotal} ·
        {done}/{total} complete
      </p>
      {summary.primaryGap && <p className="text-xs text-amber-800">Primary gap: {summary.primaryGap}</p>}
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <Link href={`/calendar/event/${eventId}/verification`} className="text-field-pine underline">Open verification</Link>
        <Link href={`/calendar/event/${eventId}/verification/venue`} className="text-field-pine underline">Venue</Link>
      </div>
    </section>
  );
}

export function ChecklistTable({
  rows,
  eventId,
  basePath,
}: {
  rows: { itemId: string; label: string; required: boolean; status: string; dueAt?: string | null; category?: string }[];
  eventId: string;
  basePath: string;
}) {
  if (rows.length === 0) return <p className="font-fieldSans text-sm text-field-ink/70">No checklist items seeded.</p>;
  return (
    <table className="w-full font-fieldSans text-sm">
      <thead>
        <tr className="border-b text-left text-xs uppercase text-field-ink/60">
          <th className="py-2 pr-2">Item</th>
          {rows[0]?.category && <th className="py-2 pr-2">Category</th>}
          <th className="py-2 pr-2">Status</th>
          <th className="py-2 pr-2">Due</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.itemId} className="border-b border-field-ink/10">
            <td className="py-2 pr-2">
              <Link href={`${basePath}/${row.itemId}`} className="text-field-pine underline">{row.label}</Link>
              {row.required && <span className="ml-1 text-xs text-amber-800">required</span>}
            </td>
            {row.category && <td className="py-2 pr-2 capitalize">{row.category}</td>}
            <td className="py-2 pr-2">{row.status.replace(/_/g, " ")}</td>
            <td className="py-2 pr-2">{row.dueAt ? new Date(row.dueAt).toLocaleString() : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
