import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { PreparationSoftBetaNote } from "@/components/calendar/preparation/PreparationSoftBetaNote";
import { getEventById } from "@/lib/calendar";
import {
  ensurePreparationFromEvent,
  getPreparationItemById,
  markPreparationReady,
  setCommunicationState,
  transitionPreparationItem,
} from "@/lib/calendar/preparation";

export default async function EventPreparationItemPage({
  params,
}: {
  params: Promise<{ eventId: string; itemId: string }>;
}) {
  const { eventId, itemId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensurePreparationFromEvent(event);
  const item = getPreparationItemById(itemId);
  if (!item || item.eventId !== eventId) notFound();

  async function markReady() {
    "use server";
    markPreparationReady(itemId, "usr-mgr-001");
  }

  async function markInProgress() {
    "use server";
    transitionPreparationItem(itemId, "in_progress", "usr-mgr-001");
  }

  async function markSentManually() {
    "use server";
    setCommunicationState(itemId, "sent_manually");
  }

  return (
    <CalendarChrome title={item.label} subtitle={event.title} backHref={`/calendar/event/${eventId}/preparation`} backLabel="Preparation">
      <CalendarHonestyBanner />
      <PreparationSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Preparation item">
        <dl className="font-fieldSans text-sm space-y-1">
          <div><dt className="inline font-bold">Category: </dt><dd className="inline">{item.category}</dd></div>
          <div><dt className="inline font-bold">Status: </dt><dd className="inline">{item.itemStatus}</dd></div>
          <div><dt className="inline font-bold">Required: </dt><dd className="inline">{item.required ? "Yes" : "No"}</dd></div>
          <div><dt className="inline font-bold">Due: </dt><dd className="inline">{item.dueAt ?? "—"}</dd></div>
          <div><dt className="inline font-bold">Blocks readiness: </dt><dd className="inline">{item.blocksReadiness ? "Yes" : "No"}</dd></div>
          <div><dt className="inline font-bold">Communication: </dt><dd className="inline">{item.communicationState.replace(/_/g, " ")}</dd></div>
        </dl>
        <form action={markInProgress} className="mt-3"><button type="submit" className="rounded border px-3 py-2 text-sm">Start</button></form>
        <form action={markReady} className="mt-2"><button type="submit" className="rounded bg-field-pine px-3 py-2 text-sm text-white">Mark ready (soft beta)</button></form>
        {(item.category === "promotion" || item.category === "reminder") && (
          <form action={markSentManually} className="mt-2"><button type="submit" className="rounded border px-3 py-2 text-sm">Record manual send</button></form>
        )}
      </CalendarSection>
    </CalendarChrome>
  );
}
