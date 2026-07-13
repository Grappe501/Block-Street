import type { MeetingIntelligenceInsight } from "@/lib/civic-action/builds/11.7/intelligence/meeting-analysis";

export function MeetingIntelligencePanel({ meetings }: { meetings: MeetingIntelligenceInsight[] }) {
  return (
    <section aria-labelledby="meeting-intel" className="card">
      <h2 id="meeting-intel" className="text-lg font-bold text-slate-900">
        Meeting Intelligence
      </h2>
      <ul className="mt-3 space-y-2">
        {meetings.length === 0 ? (
          <li className="text-sm text-slate-600">No meetings in scope.</li>
        ) : (
          meetings.map((m) => (
            <li key={m.meeting_id}>
              <p className="font-medium text-slate-900">{m.display_name}</p>
              <p className="text-sm text-slate-600">
                Agenda {m.agenda_completion_percent}% · {m.efficiency_band} · {m.open_action_items} open actions
              </p>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
