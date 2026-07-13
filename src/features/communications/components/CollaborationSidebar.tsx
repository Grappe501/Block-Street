export function CollaborationSidebar({
  mentions,
  actionItems,
  meetings,
  missionUpdates,
  roleFocus,
}: {
  mentions: { id: string; text: string; href: string; when: string }[];
  actionItems: { id: string; description: string; due_date: string | null; href: string }[];
  meetings: { id: string; title: string; when: string | null; href: string }[];
  missionUpdates: { id: string; text: string; href: string }[];
  roleFocus: string[];
}) {
  return (
    <div className="space-y-4">
      <section className="card">
        <h2 className="text-sm font-bold text-slate-900">Your Focus</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          {roleFocus.map((f) => (
            <li key={f}>· {f}</li>
          ))}
        </ul>
      </section>

      {mentions.length > 0 && (
        <section className="card">
          <h2 className="text-sm font-bold text-slate-900">Mentions</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {mentions.map((m) => (
              <li key={m.id}>{m.text}</li>
            ))}
          </ul>
        </section>
      )}

      {actionItems.length > 0 && (
        <section className="card">
          <h2 className="text-sm font-bold text-slate-900">Action Items</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {actionItems.map((a) => (
              <li key={a.id}>{a.description}</li>
            ))}
          </ul>
        </section>
      )}

      {meetings.length > 0 && (
        <section className="card">
          <h2 className="text-sm font-bold text-slate-900">Meetings</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {meetings.map((m) => (
              <li key={m.id}>{m.title}</li>
            ))}
          </ul>
        </section>
      )}

      {missionUpdates.length > 0 && (
        <section className="card">
          <h2 className="text-sm font-bold text-slate-900">Mission Updates</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {missionUpdates.map((u) => (
              <li key={u.id}>{u.text}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
