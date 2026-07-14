import { CalendarChrome, CalendarCard, CalendarHonestyBanner, CalendarSection } from "@/components/calendar/CalendarChrome";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { listKellyRequests } from "@/lib/calendar";

export const metadata = { title: "Calendar · Kelly" };

export default function KellyHubPage() {
  const requests = listKellyRequests({ kind: "command" });

  return (
    <CalendarChrome
      title="Kelly calendar"
      subtitle="Candidate travel and visit windows — command visibility in soft beta."
      nav={<CalendarNav variant="kelly" />}
    >
      <CalendarHonestyBanner />
      <CalendarSection title="Kelly lanes">
        <div className="grid gap-3 sm:grid-cols-2">
          <CalendarCard href="/calendar/kelly/requests" title="Requests" note="New visit asks" accent />
          <CalendarCard href="/calendar/kelly/holds" title="Holds" note="Tentative windows" />
          <CalendarCard href="/calendar/kelly/confirmed" title="Confirmed" note="Approved on calendar" />
          <CalendarCard href="/calendar/kelly/travel" title="Travel" note="Buffer windows (shell)" />
          <CalendarCard href="/calendar/kelly/conflicts" title="Conflicts" note="Overlap detection" />
        </div>
      </CalendarSection>
      <CalendarSection title={`${requests.length} Kelly-tagged events`}>
        <ul className="list-disc space-y-1 pl-5 font-fieldSans text-sm text-field-ink/80">
          {requests.map((r) => (
            <li key={r.event_id}>
              {r.title} — {r.status}
            </li>
          ))}
        </ul>
      </CalendarSection>
    </CalendarChrome>
  );
}
