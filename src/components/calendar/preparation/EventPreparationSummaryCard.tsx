import Link from "next/link";
import type { CalendarPreparationSummary } from "@/lib/calendar/preparation/types";

export function EventPreparationSummaryCard({
  summary,
  eventId,
}: {
  summary: CalendarPreparationSummary;
  eventId: string;
}) {
  return (
    <section className="rounded-lg border bg-white p-4 font-fieldSans text-sm">
      <h2 className="font-bold text-field-pine">Preparation checklist</h2>
      <p className="text-field-ink/70">
        Logistics {summary.logisticsReady}/{summary.logisticsTotal} · Materials {summary.materialsReady}/{summary.materialsTotal} ·
        Promotion {summary.promotionReady}/{summary.promotionTotal} · Reminders {summary.remindersReady}/{summary.remindersTotal}
      </p>
      {summary.incompleteRequired > 0 && (
        <p className="text-xs text-amber-800">
          {summary.incompleteRequired} required incomplete · {summary.overdueCount} overdue
        </p>
      )}
      {summary.primaryGap && <p className="text-xs text-amber-800">Primary gap: {summary.primaryGap}</p>}
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <Link href={`/calendar/event/${eventId}/preparation`} className="text-field-pine underline">
          Open checklist
        </Link>
        <Link href={`/calendar/event/${eventId}/preparation/materials`} className="text-field-pine underline">
          Materials
        </Link>
        <Link href={`/calendar/event/${eventId}/preparation/promotion`} className="text-field-pine underline">
          Promotion
        </Link>
      </div>
    </section>
  );
}
