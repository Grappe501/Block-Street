"use client";

import { useEffect, useState } from "react";

export default function IdentityAppealsPage() {
  const [appeals, setAppeals] = useState<Record<string, unknown>[]>([]);
  const [caseId, setCaseId] = useState("");
  const [statement, setStatement] = useState("");
  const [remedy, setRemedy] = useState("");

  useEffect(() => {
    fetch("/api/v1/identity/appeals/me")
      .then((r) => r.json())
      .then((d) => setAppeals(d.data?.appeals ?? []));
  }, []);

  async function fileAppeal(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/v1/identity/appeals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        case_id: caseId,
        appeal_ground: "new_evidence",
        statement,
        requested_remedy: remedy,
      }),
    });
    const res = await fetch("/api/v1/identity/appeals/me");
    const d = await res.json();
    setAppeals(d.data?.appeals ?? []);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">My appeals</h1>
      <p className="text-sm text-slate-600">Independent review of adverse identity decisions.</p>

      <form onSubmit={fileAppeal} className="space-y-2 rounded border p-4 text-sm">
        <input className="w-full rounded border px-3 py-2" placeholder="Case ID" value={caseId} onChange={(e) => setCaseId(e.target.value)} />
        <textarea className="w-full rounded border px-3 py-2" placeholder="Appeal statement" value={statement} onChange={(e) => setStatement(e.target.value)} />
        <input className="w-full rounded border px-3 py-2" placeholder="Requested remedy" value={remedy} onChange={(e) => setRemedy(e.target.value)} />
        <button type="submit" className="rounded bg-violet-700 px-3 py-2 text-white">File appeal</button>
      </form>

      <ul className="space-y-2 text-sm">
        {appeals.map((a) => (
          <li key={String(a.id)} className="rounded border p-3">
            Case {String(a.case_id)} — {String(a.status)} — {String(a.appeal_ground)}
          </li>
        ))}
      </ul>
    </div>
  );
}
