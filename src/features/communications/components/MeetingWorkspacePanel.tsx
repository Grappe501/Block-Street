import type { MeetingWorkspaceView } from "@/lib/civic-action/builds/11.7/ux";

export function MeetingWorkspacePanel({ view }: { view: MeetingWorkspaceView }) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{view.display_name}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {view.status_label}
          {view.scheduled_at ? ` · ${view.scheduled_at}` : ""}
        </p>
        <p className="mt-2 text-slate-700">{view.purpose}</p>
        {view.location && <p className="text-sm text-slate-600">Location: {view.location}</p>}
      </header>

      <section aria-labelledby="agenda-heading">
        <h2 id="agenda-heading" className="text-lg font-bold text-slate-900">
          Agenda
        </h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
          {view.agenda_items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </section>

      {view.minutes_text && (
        <section aria-labelledby="minutes-heading">
          <h2 id="minutes-heading" className="text-lg font-bold text-slate-900">
            Minutes
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{view.minutes_text}</p>
        </section>
      )}

      {view.action_items.length > 0 && (
        <section aria-labelledby="meeting-actions-heading">
          <h2 id="meeting-actions-heading" className="text-lg font-bold text-slate-900">
            Action Items
          </h2>
          <ul className="mt-2 space-y-2">
            {view.action_items.map((a) => (
              <li key={a.id} className="card text-sm">
                {a.description} — <span className="text-slate-500">{a.assignee_label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
