"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DemoRecordBanner, ModeBadge } from "@/components/identity/ModeBadge";
import { LockedFeature } from "@/components/identity/ModeBadge";

export default function AdminIdentityOverviewPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/v1/july14/admin-overview")
      .then((r) => r.json())
      .then((d) => {
        const payload = d.data ?? d;
        setData(payload);
      })
      .catch(() => fetch("/api/admin/identity-trust/overview").then((r) => r.json()).then(setData));
  }, []);

  const overview = data?.overview as Record<string, unknown> | undefined;
  const live = overview?.live as Record<string, number> | undefined;
  const demo = overview?.demonstration as Record<string, string | number> | undefined;
  const demoHumans = (overview?.demo_humans as { public_name: string; role: string; mode: string }[]) ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Institution Identity Administration</h1>
          <p className="text-sm text-slate-600">Aggregate overview — no private verification evidence.</p>
        </div>
        <div className="flex gap-2 text-sm">
          <Link href="/admin/identity/audit" className="rounded border px-3 py-1">Audit</Link>
          <Link href="/admin/identity/intelligence" className="rounded border px-3 py-1">Intelligence</Link>
          <Link href="/ops/identity" className="rounded bg-indigo-700 px-3 py-1 text-white">Operations</Link>
        </div>
      </div>

      <DemoRecordBanner>Aggregate demonstration metrics below are labeled and not production events</DemoRecordBanner>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {[
          ["Total Humans", live?.total_humans ?? demo?.total_humans],
          ["Sponsored", live?.sponsored ?? demo?.sponsored],
          ["Verified", live?.verified ?? demo?.verified],
          ["Provisional", live?.provisional ?? demo?.provisional],
          ["Invitations pending", live?.invitations_pending ?? demo?.invitations_pending],
          ["Verification requests", demo?.verification_requests],
          ["Memberships", demo?.memberships],
          ["Identity cases", demo?.identity_cases],
          ["Duplicate candidates", demo?.duplicate_candidates],
          ["Federation memberships", demo?.federation_memberships],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded border p-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="text-xl font-bold">{String(value ?? "—")}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-emerald-800" role="status">
        Audit health: {String(overview?.audit_health ?? demo?.audit_health ?? "healthy")}
      </p>

      <section>
        <h2 className="font-bold text-slate-900">Demonstration cohort</h2>
        <ul className="mt-2 space-y-2">
          {demoHumans.map((h) => (
            <li key={h.public_name} className="flex flex-wrap items-center justify-between gap-2 rounded border p-3 text-sm">
              <div>
                <p className="font-medium">{h.public_name}</p>
                <p className="text-xs text-slate-600">{h.role}</p>
              </div>
              <ModeBadge mode={h.mode as "live" | "demo" | "locked"} />
            </li>
          ))}
        </ul>
      </section>

      <LockedFeature
        title="Identity Intelligence enforcement"
        reason="Automatic fraud conclusions, verification-ring enforcement, and bot removal remain locked until Wave 5 certification."
      />
    </div>
  );
}
