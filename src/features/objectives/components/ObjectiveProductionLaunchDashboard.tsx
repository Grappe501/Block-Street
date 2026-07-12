"use client";

import { useCallback, useEffect, useState } from "react";
import type { LaunchControlView, ProductionCertificationView } from "@/lib/civic-action/builds/11.2/production/contracts";
import { ObjectiveLaunchControlCenter } from "./ObjectiveLaunchControlCenter";

export function ObjectiveProductionLaunchDashboard() {
  const [launch, setLaunch] = useState<LaunchControlView | null>(null);
  const [levels, setLevels] = useState<ProductionCertificationView[]>([]);
  const [health, setHealth] = useState<{ status: string; waves_certified: number; highest_certification: string | null } | null>(null);

  const load = useCallback(() => {
    fetch("/api/v1/objectives/production/launch")
      .then((r) => r.json())
      .then((d) => setLaunch(d.data?.launch ?? null));
    fetch("/api/v1/objectives/production/certification")
      .then((r) => r.json())
      .then((d) => setLevels(d.data?.production_levels ?? []));
    fetch("/api/v1/objectives/production/health")
      .then((r) => r.json())
      .then((d) => setHealth(d.data?.health ?? null));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSignOff(type: "release" | "pilot" | "organization" | "statewide") {
    await fetch("/api/v1/objectives/production/sign-off", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sign_off_type: type, decision: "approved" }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      {health && (
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
          <span className="font-medium text-slate-900">System health: {health.status}</span>
          <span className="ml-4 text-slate-600">
            {health.waves_certified}/7 waves certified
            {health.highest_certification ? ` · ${health.highest_certification.replace(/_/g, " ")}` : ""}
          </span>
        </section>
      )}
      <ObjectiveLaunchControlCenter launch={launch} levels={levels} onSignOff={handleSignOff} />
    </div>
  );
}
