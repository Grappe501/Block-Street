import { notFound } from "next/navigation";
import { CalendarChrome, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { EventSubnav } from "@/components/calendar/CalendarNav";
import { FollowUpSoftBetaNote } from "@/components/calendar/followup/ReportChecklistTable";
import { getEventById } from "@/lib/calendar";
import {
  ensureFollowUpFromEvent,
  getFollowUpItemById,
  setFollowUpFieldValue,
  submitFollowUpItem,
  transitionFollowUpItem,
} from "@/lib/calendar/followup";

export default async function EventReportItemPage({
  params,
}: {
  params: Promise<{ eventId: string; itemId: string }>;
}) {
  const { eventId, itemId } = await params;
  const event = getEventById(eventId);
  if (!event) notFound();
  ensureFollowUpFromEvent(event);
  const item = getFollowUpItemById(itemId);
  if (!item || item.eventId !== eventId) notFound();

  async function markDraft() {
    "use server";
    transitionFollowUpItem(itemId, "draft", "usr-mgr-001");
  }

  async function submitItem() {
    "use server";
    submitFollowUpItem(itemId, "usr-mgr-001");
  }

  async function saveCount(formData: FormData) {
    "use server";
    const raw = formData.get("valueCount");
    const valueCount = raw ? Number(raw) : null;
    setFollowUpFieldValue(itemId, { valueCount }, "usr-mgr-001");
  }

  async function saveText(formData: FormData) {
    "use server";
    const valueText = String(formData.get("valueText") ?? "");
    setFollowUpFieldValue(itemId, { valueText }, "usr-mgr-001");
  }

  async function saveBoolean(formData: FormData) {
    "use server";
    const valueBoolean = formData.get("valueBoolean") === "on";
    setFollowUpFieldValue(itemId, { valueBoolean }, "usr-mgr-001");
  }

  return (
    <CalendarChrome title={item.label} subtitle={event.title} backHref={`/calendar/event/${eventId}/report`} backLabel="Report">
      <CalendarHonestyBanner />
      <FollowUpSoftBetaNote />
      <EventSubnav eventId={eventId} />
      <CalendarSection title="Report item">
        <dl className="font-fieldSans text-sm space-y-1">
          <div><dt className="inline font-bold">Category: </dt><dd className="inline">{item.category}</dd></div>
          <div><dt className="inline font-bold">Status: </dt><dd className="inline">{item.itemStatus}</dd></div>
          <div><dt className="inline font-bold">Required: </dt><dd className="inline">{item.required ? "Yes" : "No"}</dd></div>
          <div><dt className="inline font-bold">Due: </dt><dd className="inline">{item.dueAt ?? "—"}</dd></div>
          <div><dt className="inline font-bold">Metric type: </dt><dd className="inline">{item.metricType ?? "—"}</dd></div>
        </dl>
        {item.metricType === "count" && (
          <form action={saveCount} className="mt-3 flex gap-2 items-end">
            <label className="font-fieldSans text-sm">
              Count
              <input name="valueCount" type="number" defaultValue={item.valueCount ?? ""} className="ml-2 rounded border px-2 py-1" />
            </label>
            <button type="submit" className="rounded border px-3 py-2 text-sm">Save</button>
          </form>
        )}
        {item.metricType === "text" && (
          <form action={saveText} className="mt-3 space-y-2">
            <textarea name="valueText" defaultValue={item.valueText ?? ""} className="w-full rounded border p-2 text-sm" rows={4} />
            <button type="submit" className="rounded border px-3 py-2 text-sm">Save</button>
          </form>
        )}
        {item.metricType === "boolean" && (
          <form action={saveBoolean} className="mt-3 flex items-center gap-2">
            <input name="valueBoolean" type="checkbox" defaultChecked={item.valueBoolean ?? false} />
            <span className="font-fieldSans text-sm">Complete</span>
            <button type="submit" className="rounded border px-3 py-2 text-sm">Save</button>
          </form>
        )}
        <form action={markDraft} className="mt-3"><button type="submit" className="rounded border px-3 py-2 text-sm">Mark draft</button></form>
        <form action={submitItem} className="mt-2"><button type="submit" className="rounded bg-field-pine px-3 py-2 text-sm text-white">Submit (soft beta)</button></form>
      </CalendarSection>
    </CalendarChrome>
  );
}
