"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BuildBar = { id: string; name: string; system_id: string; percent: number; current_wave: string | null };
type ScaffoldData = {
  phase_overall_percent?: number;
  current_wave?: string;
  recommended_next_wave?: string;
  waves_completed_count?: number;
  total_planned_waves?: number;
  build_progress_bar?: BuildBar[];
};

export function AdminCivicActionLayer() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [scaffold, setScaffold] = useState<ScaffoldData | null>(null);
  const [cert, setCert] = useState<Record<string, unknown> | null>(null);

  function refresh() {
    fetch("/api/v1/civic-action/overview").then((r) => r.json()).then((d) => setData(d.data ?? d));
    fetch("/api/v1/civic-action/scaffold").then((r) => r.json()).then((d) => {
      const payload = d.data ?? d;
      setScaffold(payload.scaffold ?? payload);
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function runCert() {
    const res = await fetch("/api/v1/civic-action/overview", { method: "POST" });
    const d = await res.json();
    setCert(d.data ?? d);
    refresh();
  }

  const ops = data?.operations as Record<string, unknown> | undefined;
  const cc = ops?.command_center as Record<string, unknown> | undefined;
  const today = cc?.today as Record<string, number> | undefined;
  const invariants = (data?.invariants as { id: string; passed: boolean; detail: string }[]) ?? [];
  const builds = scaffold?.build_progress_bar ?? [];

  return (
    <div className="space-y-6">
      <div className="card border-orange-400 bg-orange-50">
        <p className="text-xs font-semibold uppercase text-orange-900">Phase 11 · CAE-SCAFFOLD-001</p>
        <h2 className="mt-1 text-xl font-bold text-orange-950">Civic Action Operating System</h2>
        <p className="mt-2 text-sm text-orange-900">
          16 builds × 8 waves = 128 implementation waves. Current: {scaffold?.current_wave ?? "—"} → next: {scaffold?.recommended_next_wave ?? "—"}
        </p>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-2 flex-1 rounded bg-orange-200">
            <div
              className="h-2 rounded bg-orange-700 transition-all"
              style={{ width: `${scaffold?.phase_overall_percent ?? 0}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-orange-900">{scaffold?.phase_overall_percent ?? 0}%</span>
        </div>
        <p className="mt-1 text-xs text-orange-800">
          {scaffold?.waves_completed_count ?? 0} / {scaffold?.total_planned_waves ?? 128} waves complete
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={runCert} className="rounded bg-orange-700 px-3 py-1 text-xs text-white">Run CAE certification</button>
          <Link href="/operations" className="rounded border border-orange-400 px-3 py-1 text-xs text-orange-900">Operations Center</Link>
          <Link href="/initiative/ini-youth-civic-2026" className="rounded border border-orange-400 px-3 py-1 text-xs text-orange-900">Youth Civic Initiative</Link>
        </div>
      </div>

      {builds.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-bold">Build Progress (16)</h3>
          <ul className="mt-3 space-y-2">
            {builds.map((b) => (
              <li key={b.id}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{b.id} · {b.system_id}</span>
                  <span>{b.percent}% {b.current_wave ? `· ${b.current_wave}` : ""}</span>
                </div>
                <div className="mt-1 h-1.5 rounded bg-slate-200">
                  <div className="h-1.5 rounded bg-orange-600" style={{ width: `${b.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {today && (
        <div className="grid gap-2 sm:grid-cols-4">
          {Object.entries(today).map(([k, v]) => (
            <div key={k} className="card text-center">
              <p className="text-xs text-slate-500">{k.replace(/_/g, " ")}</p>
              <p className="text-lg font-bold">{v}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h3 className="text-sm font-bold">Invariants</h3>
        <ul className="mt-2 space-y-1 text-xs">
          {invariants.map((i) => (
            <li key={i.id} className={i.passed ? "text-emerald-800" : "text-red-800"}>
              {i.passed ? "✓" : "✗"} {i.id}: {i.detail}
            </li>
          ))}
        </ul>
      </div>

      {cert && (
        <pre className="max-h-48 overflow-auto rounded border bg-slate-50 p-2 text-xs">{JSON.stringify(cert, null, 2)}</pre>
      )}
    </div>
  );
}
