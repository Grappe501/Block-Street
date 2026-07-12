"use client";

import { useEffect, useState } from "react";

export default function ExecutiveIdentityPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/v1/executive/identity/overview").then((r) => r.json()).then((d) => setData(d.data ?? d));
  }, []);

  const summary = data?.summary as Record<string, string | number> | undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Executive Identity Oversight</h1>
      <p className="text-sm text-slate-600">Aggregate identity health — no case-level authority granted.</p>

      {summary && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="region" aria-label="Executive summary">
          {Object.entries(summary).map(([key, value]) => (
            <div key={key} className="rounded border p-3">
              <p className="text-xs text-slate-500">{key.replace(/_/g, " ")}</p>
              <p className="text-lg font-bold">{String(value)}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500">
        {data?.limitations ? (data.limitations as string[]).join(" · ") : "Aggregate views only"}
      </p>
    </div>
  );
}
