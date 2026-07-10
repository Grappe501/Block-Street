"use client";

const PRINCIPLES = [
  { id: "GM-P1", title: "Foundation Before Features", summary: "Registration, hubs, networks, admin, search, mobile — first." },
  { id: "GM-P2", title: "Build Vertically", summary: "Complete end-to-end before starting next capability." },
  { id: "GM-P3", title: "Version, Don't Rewrite", summary: "Extend — never rebuild from scratch." },
  { id: "GM-P4", title: "Measure Before Expanding", summary: "Usage + organizing strength + North Star alignment." },
  { id: "GM-P5", title: "Local Before Statewide", summary: "Campus/county first. Statewide enhances local." },
  { id: "GM-P6", title: "Feedback Drives Priorities", summary: "Observe → learn → publish next roadmap." },
  { id: "GM-P7", title: "Registry Expansion", summary: "Universities → jr colleges → trade → high schools." },
  { id: "GM-P8", title: "Progressive Personalization", summary: "Every release feels more local." },
  { id: "GM-P9", title: "Leadership Development", summary: "Grow organizers over time — staged tools." },
  { id: "GM-P10", title: "Modular Architecture", summary: "Independent modules, stable interfaces." },
];

const V1_ITEMS = [
  { item: "WHY homepage", status: "done" },
  { item: "75 county pages", status: "done" },
  { item: "Institution registry + pages", status: "progress" },
  { item: "County-first signup", status: "pending" },
  { item: "Share link + QR", status: "pending" },
  { item: "Network board", status: "pending" },
  { item: "Netlify DB", status: "pending" },
  { item: "Leader test (Jul 12)", status: "pending" },
  { item: "Launch call (Jul 14)", status: "pending" },
];

const ROADMAP = [
  { ver: "1.0.0", date: "Jul 14", focus: "Launch — signup + network + map" },
  { ver: "1.1.0", date: "Aug", focus: "Committees + moderation" },
  { ver: "1.2.0", date: "Aug–Sep", focus: "Events + voter registration" },
  { ver: "1.3.0", date: "Sep–Oct", focus: "Messaging + outreach" },
  { ver: "1.4.0", date: "Oct", focus: "Surveys + collective voice" },
];

export function AdminGrowthModel() {
  return (
    <div className="space-y-6">
      <div className="card border-green-200 bg-green-50">
        <p className="text-xs font-semibold uppercase text-green-800">PHASE-001.6 · Foundational Constitution Complete</p>
        <h2 className="mt-1 text-xl font-bold text-green-950">Growth Model</h2>
        <p className="mt-2 text-lg font-semibold text-green-900">Launch early. Learn quickly. Improve continuously.</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Critical Dates [GM-V1]</h2>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {[
              ["Jul 12", "Leader testing"],
              ["Jul 14", "Launch call (~50 students)"],
              ["Fall 2026", "Voter registration push"],
              ["Nov 3, 2026", "Election"],
            ].map(([date, event]) => (
              <tr key={date} className="border-b border-slate-100">
                <td className="py-2 pr-4 font-semibold text-brand-600">{date}</td>
                <td className="py-2">{event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">V1 Launch Scope [GM-V1]</h2>
        <div className="mt-3 space-y-2">
          {V1_ITEMS.map((v) => (
            <div key={v.item} className="flex items-center justify-between text-sm">
              <span>{v.item}</span>
              <span className={`badge ${v.status === "done" ? "bg-green-100 text-green-800" : v.status === "progress" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>
                {v.status === "done" ? "Done" : v.status === "progress" ? "In Progress" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-bold text-slate-900">10 Growth Principles</h2>
        {PRINCIPLES.map((p) => (
          <div key={p.id} className="card !p-3">
            <span className="text-xs font-mono text-green-700">{p.id}</span>
            <p className="font-semibold text-slate-900">{p.title}</p>
            <p className="text-sm text-slate-600">{p.summary}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Version Roadmap [GM-ROAD]</h2>
        <div className="mt-3 space-y-2">
          {ROADMAP.map((r) => (
            <div key={r.ver} className="flex gap-4 text-sm">
              <span className="font-mono font-bold text-brand-600 w-12">{r.ver}</span>
              <span className="text-slate-500 w-16">{r.date}</span>
              <span>{r.focus}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-brand-200 bg-brand-50">
        <p className="font-bold text-brand-900">Next: Phase 2 — Arkansas Organizing Registry</p>
        <p className="mt-1 text-sm text-brand-800">Canonical data backbone. Every page builds on this.</p>
      </div>

      <p className="text-sm text-slate-500">Full document: docs/build-steps/PHASE-001.6-GROWTH-MODEL.md</p>
    </div>
  );
}
