export function AdminMission() {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Mission Statement</h2>
        <p className="mt-3 text-lg text-slate-700">
          Give Arkansas college students and young adults one shared organizing home —
          where every campus builds its own voice, every county welcomes those not in school,
          and student energy becomes real civic power.
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Guiding Principles</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { title: "Student-Led", desc: "Students decide direction; platform serves them" },
            { title: "Campus-Rooted", desc: "Every school gets its own hub" },
            { title: "County-Connected", desc: "75 county catch-all spaces for non-students" },
            { title: "Statewide-Connected", desc: "Local organizing links to global committees" },
            { title: "Nonpartisan by Design", desc: "Tools, not political direction" },
            { title: "Relational, Not Broadcast", desc: "Every person gets a share link + QR code" },
          ].map((p) => (
            <div key={p.title} className="rounded-lg bg-slate-50 p-4">
              <p className="font-semibold text-brand-700">{p.title}</p>
              <p className="mt-1 text-sm text-slate-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Two Entry Paths</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-brand-200 bg-brand-50 p-4">
            <p className="font-bold text-brand-900">🎓 Campus Path</p>
            <p className="mt-2 text-sm text-brand-800">
              College, university, trade school, junior college, future high schools.
              Each gets a hub with committees, events, leadership, outreach.
            </p>
          </div>
          <div className="rounded-lg border border-accent-200 bg-accent-50 p-4">
            <p className="font-bold text-accent-900">📍 County Path</p>
            <p className="mt-2 text-sm text-accent-800">
              Young adults not in school. 75 Arkansas counties each get a catch-all
              youth organizing hub.
            </p>
          </div>
        </div>
      </div>

      <div className="card bg-brand-950 text-white">
        <h2 className="text-lg font-bold">North Star</h2>
        <p className="mt-3 text-brand-100">
          By election season, students across Arkansas find each other, organize by campus,
          coordinate across campuses, and speak with a collective voice —
          without the platform forcing a political direction.
        </p>
        <p className="mt-4 text-sm italic text-brand-200">
          Full docs: docs/mission/ · docs/architecture/NONPARTISAN-RULES.md
        </p>
      </div>
    </div>
  );
}
