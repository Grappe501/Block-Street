"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function IdentityCertificationPage() {
  const [status, setStatus] = useState<Record<string, unknown> | null>(null);
  const [cert, setCert] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/v1/identity-trust/wave7/status").then((r) => r.json()).then((d) => setStatus(d.data ?? d));
  }

  useEffect(() => {
    refresh();
  }, []);

  async function runCertification() {
    setMessage(null);
    const res = await fetch("/api/v1/identity-trust/wave7/certification", { method: "POST" });
    const data = await res.json();
    setCert(data.data ?? data);
    setMessage(data.data?.all_passed ? "Wave 7 certification passed" : "Wave 7 certification incomplete — review gates");
    refresh();
  }

  const requirements = status?.requirements as Record<string, number> | undefined;
  const launch = status?.launch as Record<string, unknown> | undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Identity Certification</h1>
          <p className="text-sm text-slate-600">ITL-W7-001 — constitutional proof, red-team validation, controlled launch</p>
        </div>
        <Link href="/ops/identity" className="text-sm text-indigo-700 underline">
          Back to ops center
        </Link>
      </div>

      {requirements && (
        <div className="grid gap-3 sm:grid-cols-4" role="region" aria-label="Requirements coverage">
          <div className="rounded border p-3">
            <p className="text-xs text-slate-500">Total requirements</p>
            <p className="text-xl font-bold">{requirements.total}</p>
          </div>
          <div className="rounded border p-3">
            <p className="text-xs text-slate-500">Tested</p>
            <p className="text-xl font-bold">{requirements.tested}</p>
          </div>
          <div className="rounded border p-3">
            <p className="text-xs text-slate-500">Failed</p>
            <p className="text-xl font-bold">{requirements.failed}</p>
          </div>
          <div className="rounded border p-3">
            <p className="text-xs text-slate-500">Production certified</p>
            <p className="text-sm font-semibold">{launch?.production_certified ? "Yes" : "No"}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={runCertification} className="rounded bg-indigo-700 px-4 py-2 text-sm text-white">
          Run Wave 7 certification
        </button>
        <button
          type="button"
          onClick={() => fetch("/api/v1/identity-certification/drift", { method: "POST" }).then(() => refresh())}
          className="rounded border border-indigo-300 px-4 py-2 text-sm text-indigo-900"
        >
          Scan constitutional drift
        </button>
        <button
          type="button"
          onClick={() => fetch("/api/v1/identity-red-team/engagements", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).then(() => refresh())}
          className="rounded border border-indigo-300 px-4 py-2 text-sm text-indigo-900"
        >
          Run red-team scenarios
        </button>
      </div>

      {message && <p className="text-sm text-indigo-950">{message}</p>}

      <pre className="max-h-96 overflow-auto rounded border bg-slate-50 p-3 text-xs">
        {JSON.stringify(cert ?? status, null, 2)}
      </pre>
    </div>
  );
}
