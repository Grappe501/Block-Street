import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { AssignmentSoftBetaNote } from "@/components/calendar/assignments/AssignmentSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { ensureAssignmentDemoFixtures, listOpenReplacementNeeds, rankReplacementCandidates } from "@/lib/calendar/assignments";

export default async function EventStaffingReplacementsPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureAssignmentDemoFixtures();
  const needs = listOpenReplacementNeeds({ eventId });

  return (
    <CalendarChrome title="Replacements" subtitle={event.title} backHref={`/calendar/event/${eventId}/staffing`} backLabel="Staffing">
      <CalendarHonestyBanner />
      <AssignmentSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Open replacement needs">
        <ul className="space-y-3 font-fieldSans text-sm">
          {needs.map((n) => (
            <li key={n.replacementNeedId} className="rounded-lg border bg-white p-3">
              <p>{n.roleKey} · {n.urgency} · {n.status}</p>
              <p className="text-xs text-field-ink/60">Candidates: {rankReplacementCandidates(n).map((c) => `${c.kind}:${c.rank}`).join(", ") || "none"}</p>
            </li>
          ))}
          {needs.length === 0 && <p className="text-field-ink/70">No open replacement needs.</p>}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
