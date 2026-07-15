import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { StaffingSoftBetaNote } from "@/components/calendar/staffing/StaffingSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import { listActiveRequirements, listShifts, TRAINING_CATALOG } from "@/lib/calendar/staffing";

export default async function StaffingTrainingPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  const keys = new Set<string>();
  listActiveRequirements(eventId).forEach((r) => r.trainingRequirementKeys.forEach((k) => keys.add(k)));
  listShifts(eventId).forEach((s) => s.trainingRequirementKeys.forEach((k) => keys.add(k)));
  const training = TRAINING_CATALOG.filter((t) => keys.has(t.trainingKey));

  return (
    <CalendarChrome title="Training requirements" subtitle={event.title} backHref={`/calendar/event/${eventId}/staffing`} backLabel="Staffing">
      <CalendarHonestyBanner />
      <StaffingSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title={`${training.length} training requirements`}>
        <ul className="space-y-2 font-fieldSans text-sm">
          {training.map((t) => (
            <li key={t.trainingKey} className="rounded-lg border bg-white p-3">
              <p className="font-bold">{t.label}</p>
              <p className="text-field-ink/70">{t.completionMode.replace(/_/g, " ")} · allows interest if missing: {t.allowsInterestIfMissing ? "yes" : "no"}</p>
            </li>
          ))}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
