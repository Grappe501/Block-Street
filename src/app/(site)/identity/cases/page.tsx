"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CaseView = {
  public_case_id: string;
  case_type: string;
  status: string;
  summary: string;
  response_due_at: string | null;
  appeal_deadline: string | null;
  restrictions: string[];
  decision: string | null;
};

export default function IdentityCasesPage() {
  const [cases, setCases] = useState<CaseView[]>([]);
  const [responseCase, setResponseCase] = useState("");
  const [statement, setStatement] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/v1/identity/cases/me")
      .then((r) => r.json())
      .then((d) => setCases(d.data?.cases ?? []));
  }, []);

  async function submitResponse(e: React.FormEvent) {
    e.preventDefault();
    const c = cases.find((x) => x.public_case_id === responseCase);
    if (!c) return;
    const res = await fetch("/api/v1/identity/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "respond", case_id: responseCase, statement }),
    });
    setMessage(res.ok ? "Response submitted." : "Failed to submit response.");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">My identity cases</h1>
      <p className="text-sm text-slate-600">Governed review — not a hidden accusation.</p>

      {cases.length === 0 ? (
        <p className="text-sm text-slate-600">No active identity cases.</p>
      ) : (
        <ul className="space-y-3">
          {cases.map((c) => (
            <li key={c.public_case_id} className="rounded border border-slate-200 p-4 text-sm">
              <p className="font-semibold">{c.case_type.replace(/_/g, " ")}</p>
              <p>{c.summary}</p>
              <p>Status: {c.status}</p>
              {c.restrictions.length > 0 && <p>Restrictions: {c.restrictions.join(", ")}</p>}
              {c.response_due_at && <p>Response due: {new Date(c.response_due_at).toLocaleDateString()}</p>}
              {c.decision && <p>Decision: {c.decision}</p>}
              {c.appeal_deadline && (
                <Link href="/identity/appeals" className="text-violet-700 underline">
                  Appeal available until {new Date(c.appeal_deadline).toLocaleDateString()}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submitResponse} className="space-y-2 rounded border p-4 text-sm">
        <p className="font-medium">Submit a response</p>
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Case ID"
          value={responseCase}
          onChange={(e) => setResponseCase(e.target.value)}
        />
        <textarea
          className="w-full rounded border px-3 py-2"
          placeholder="Your statement"
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
        />
        <button type="submit" className="rounded bg-violet-700 px-3 py-2 text-white">
          Submit response
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
