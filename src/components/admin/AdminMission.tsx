import { PLATFORM } from "@/lib/data";

export function AdminMission() {
  return (
    <div className="space-y-6">
      <div className="card border-brand-200 bg-brand-50">
        <p className="text-xs font-semibold uppercase text-brand-600">Platform Identity</p>
        <h2 className="mt-1 text-2xl font-bold text-brand-900">{PLATFORM.workingName}</h2>
        <p className="mt-1 text-sm text-brand-700">{PLATFORM.fullName}</p>
        <p className="mt-3 text-brand-800">{PLATFORM.motto}</p>
        <p className="mt-3 text-sm text-brand-800">{PLATFORM.fullName} — see PHASE-001.1 [MS-001]</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Golden Circle Teaching</h2>
        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-red-50 p-4 border border-red-100">
            <p className="font-bold text-red-900">WHY — Emotional Call to Action</p>
            <p className="mt-1 text-sm text-red-800">Our generation decides Arkansas&apos;s future. We become impossible to ignore when we organize.</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-4 border border-amber-100">
            <p className="font-bold text-amber-900">HOW — Build Power</p>
            <p className="mt-1 text-sm text-amber-800">Relationships → numbers → voting block → collective voice politicians cannot ignore.</p>
          </div>
          <div className="rounded-lg bg-green-50 p-4 border border-green-100">
            <p className="font-bold text-green-900">WHAT — Tools (staged)</p>
            <p className="mt-1 text-sm text-green-800">Signup, share links, QR, network boards, map, committees, events, voter registration.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Core Principles</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "Youth-led — students run moderation & rules",
            "Nonpartisan infrastructure",
            "Equal standing — no privileged campuses",
            "Relational organizing first",
            "No school impersonation",
            "Teaching built in — they don't know what to do yet",
            "Honor-system affiliation (county → school)",
            "Distributed leadership through participation",
          ].map((p) => (
            <div key={p} className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{p}</div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-slate-900">Critical Dates</h2>
        <table className="mt-4 w-full text-sm">
          <tbody>
            {[
              ["Jul 10", "Constitution + master plan"],
              ["Jul 12", "College leaders testing"],
              ["Jul 14", "Launch call (~50 students)"],
              ["Fall 2026", "Voter registration push"],
              ["Nov 3, 2026", "Election"],
            ].map(([date, event]) => (
              <tr key={date} className="border-b border-slate-100">
                <td className="py-2 pr-4 font-semibold text-brand-600">{date}</td>
                <td className="py-2 text-slate-700">{event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-slate-500">
        Full constitution: docs/PROJECT_CONSTITUTION_AND_MISSION_DOCTRINE.md
      </p>
    </div>
  );
}
