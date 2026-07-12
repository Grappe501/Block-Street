"use client";

import { useEffect, useState } from "react";

export default function IntelligenceReviewPage() {
  const [signals, setSignals] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState("");

  const load = () => {
    fetch("/api/v1/identity-ops/intelligence-signals").then((r) => r.json()).then((d) => setSignals(d.data ?? []));
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (signalId: string, action: string) => {
    const res = await fetch("/api/v1/identity-ops/intelligence-signals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, signal_id: signalId, reason: "Reviewed by operator" }),
    });
    const d = await res.json();
    setMessage(res.ok ? `Signal ${action} completed.` : d.error?.message ?? "Failed");
    load();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Intelligence Signal Review Center</h1>
      <p className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900" role="note">
        Signals are advisory only. They detect patterns — accountable Humans determine meaning. No automatic punishment.
      </p>

      <ul className="space-y-4">
        {signals.map((s) => (
          <li key={String(s.id)} className="rounded border p-4">
            <p className="text-xs font-semibold uppercase text-amber-700">{String(s.advisory_label ?? "ADVISORY SIGNAL")}</p>
            <p className="mt-1 font-medium">{String(s.summary)}</p>
            <p className="text-xs text-slate-500">{String(s.signal_code)} · {String(s.severity)} · {String(s.status)}</p>
            {Array.isArray(s.supporting_features) && (
              <ul className="mt-2 text-xs text-slate-600">
                {(s.supporting_features as string[]).map((f) => (
                  <li key={f}>Observed: {f}</li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => act(String(s.id), "triage")}>Triage</button>
              <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => act(String(s.id), "benign")}>Mark benign</button>
              <button type="button" className="rounded border px-2 py-1 text-xs" onClick={() => act(String(s.id), "false_positive")}>False positive</button>
              <button type="button" className="rounded bg-indigo-700 px-2 py-1 text-xs text-white" onClick={() => act(String(s.id), "open_case")}>Open governed case</button>
            </div>
          </li>
        ))}
      </ul>
      {signals.length === 0 && <p className="text-sm text-slate-500">No signals pending review.</p>}
      {message && <p className="text-sm text-indigo-800">{message}</p>}
    </div>
  );
}
