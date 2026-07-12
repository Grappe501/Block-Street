"use client";

import type { OrganizationHealthDimension } from "@/lib/civic-action/builds/11.1/optimization/contracts";

const STATE_STYLES: Record<OrganizationHealthDimension["state"], string> = {
  healthy: "border-green-200 bg-green-50",
  attention: "border-amber-200 bg-amber-50",
  critical: "border-red-200 bg-red-50",
};

export function InstitutionHealthPanel({ dimensions }: { dimensions: OrganizationHealthDimension[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Organizational health</h2>
      <p className="text-xs text-slate-500">Health dimensions — not vanity metrics</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {dimensions.map((d) => (
          <div key={d.dimension} className={`rounded-lg border p-3 ${STATE_STYLES[d.state]}`}>
            <p className="text-sm font-medium text-slate-900">{d.label}</p>
            <p className="text-2xl font-semibold text-slate-800">{d.score_band}</p>
            <p className="mt-1 text-xs text-slate-600">{d.explanation}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
