import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { LifecycleChecklistTable, LifecycleSoftBetaNote } from "@/components/calendar/lifecycle/LifecyclePanels";
import { buildLifecycleSummary, ensureLifecycleFromEvent, getEventById, listLifecycleRows } from "@/lib/calendar";

export const metadata = { title: "Calendar · Event approvals" };

export default async function EventApprovalsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureLifecycleFromEvent(event);
  const summary = buildLifecycleSummary(eventId, event.operational_status, event.approval_status);
  const rows = listLifecycleRows(eventId, "approval");

  return (
    <CalendarChrome title={`${event.title} — Approvals`} subtitle="Calendar approval workflow" backHref={`/calendar/event/${eventId}`} backLabel="Event">
      <CalendarHonestyBanner />
      <EventSubnav eventId={eventId} />
      <LifecycleSoftBetaNote />
      <CalendarSection title="Approvals">
        <p className="font-fieldSans text-sm text-field-ink/80">
          Approval status: <strong>{String(event.approval_status ?? "not_submitted")}</strong> · Checklist{" "}
          {summary.approvalReady}/{summary.approvalTotal}
        </p>
        <p className="mt-2 font-fieldSans text-xs text-field-ink/60">
          Calendar approval only — separate from venue or legal verification.
        </p>
        <div className="mt-4">
          <LifecycleChecklistTable rows={rows} eventId={eventId} />
        </div>
      </CalendarSection>
    </CalendarChrome>
  );
}
