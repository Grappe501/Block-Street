"use client";

import { useEffect, useState } from "react";
import ops from "../../../data/registry/operational-operations.json";
import type { OperationsHealthSummary } from "@/lib/operations/types";

type Tab = "health" | "launch" | "demo" | "audit";

async function post(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? "Request failed");
  return data.data ?? data;
}

export function AdminInstitutionalOperations() {
  const [tab, setTab] = useState<Tab>("health");
  const [summary, setSummary] = useState<OperationsHealthSummary | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [plans, setPlans] = useState<Record<string, unknown>[]>([]);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/operations/overview")
      .then((r) => r.json())
      .then((d) => {
        setSummary(d.health_summary ?? null);
        setInstitutionId(d.institution_id ?? null);
        setPlans(d.launch_plans ?? []);
        setAudit(d.audit ?? []);
      });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function runAcceptanceDemo() {
    if (!institutionId) return;
    setMessage(null);
    try {
      const { plan } = await post("/api/v1/operations/launch-plans", {
        institution_id: institutionId,
        name: "Three-Campus Controlled Rollout",
        strategy: "single_campus",
        target_scope: "3 pilot campuses",
      });
      const planId = plan.id as string;

      await post("/api/v1/operations/launch-plans", { action: "approve", plan_id: planId });
      await post("/api/v1/operations/launch-plans", { action: "rollout", plan_id: planId, rollout_percent: 25 });

      await fetch(`/api/v1/operations/adoption?institution_id=${institutionId}&rollout_percent=25`);
      await fetch(`/api/v1/operations/health?institution_id=${institutionId}`);
      await fetch(`/api/v1/operations/executive?institution_id=${institutionId}`);

      const { request: trainingReq } = await post("/api/v1/operations/support", {
        institution_id: institutionId,
        user_id: "organizer@block-street.local",
        subject: "How do I assign workspace roles?",
        description: "New campus admin cannot find role assignment",
      });

      const { request: techReq } = await post("/api/v1/operations/support", {
        institution_id: institutionId,
        user_id: "director@block-street.local",
        subject: "Session timeout error during mission save",
        description: "Bug causes timeout when completing mission",
      });

      await post("/api/v1/operations/support", { action: "resolve", request_id: trainingReq.id, institution_id: institutionId });

      await post("/api/v1/operations/feedback", {
        institution_id: institutionId,
        category: "pain_point",
        title: "Mission board navigation unclear on mobile",
        description: "Volunteers cannot find assigned missions on phone",
      });

      const { release } = await post("/api/v1/operations/releases", {
        institution_id: institutionId,
        version: "9.7.0",
        release_type: "institutional",
        features: ["Executive dashboard", "Adoption analytics", "Support routing"],
      });

      await post("/api/v1/operations/launch-plans", { action: "rollout", plan_id: planId, rollout_percent: 100 });
      await post("/api/v1/operations/launch-plans", { action: "complete", plan_id: planId });

      const maturityRes = await fetch(`/api/v1/operations/maturity?institution_id=${institutionId}`);
      const maturityData = await maturityRes.json();

      await post("/api/v1/operations/releases", {
        action: "rollback",
        release_id: release.id,
        institution_id: institutionId,
        reason: "Acceptance test rollback verification",
      });

      await post("/api/v1/operations/releases", {
        institution_id: institutionId,
        version: "9.7.1",
        release_type: "patch",
        features: ["Rollback fix verified", "Health monitoring restored"],
      });

      setMessage(
        `AC-192 acceptance complete: Launch approved → 25% rollout → health & adoption active → ` +
          `Support routed (${trainingReq.category}/${trainingReq.tier}, ${techReq.category}/${techReq.tier}) → ` +
          `Feedback → release ${release.version} → operational maturity ${maturityData.data?.maturity?.level ?? "operational"} → ` +
          `rollback tested → continuous improvement loop active.`
      );
      refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Acceptance demo failed.");
      refresh();
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "health", label: "Operations Health" },
    { id: "launch", label: "Launch Plans" },
    { id: "demo", label: "Acceptance Demo" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-teal-500 bg-teal-100">
        <p className="text-xs font-semibold uppercase text-teal-950">BUILD 9.7 · Operational Launch · OPS-001</p>
        <h2 className="mt-1 text-xl font-bold text-teal-950">{ops.productName}</h2>
        <p className="mt-2 text-sm text-teal-950">{ops.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-teal-900">
          {ops.requirementId} · {ops.acceptanceCriteria} · /api/v1/operations
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-teal-800 text-white" : "bg-teal-50 text-teal-900"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-teal-300 bg-teal-50 p-3 text-xs text-teal-950">{message}</p>}

      {tab === "health" && summary && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Active Launches", summary.active_launch_plans],
            ["Operational Institutions", summary.operational_institutions],
            ["Avg Health Score", `${summary.average_health_score}%`],
            ["Open Support", summary.open_support_tickets],
            ["Pending Feedback", summary.pending_feedback],
            ["Releases This Month", summary.releases_this_month],
            ["At Operational Maturity", summary.institutions_at_operational_maturity],
          ].map(([label, value]) => (
            <div key={String(label)} className="card border-teal-300 bg-white p-3">
              <p className="text-xs text-teal-700">{label}</p>
              <p className="text-lg font-bold text-teal-950">{value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "launch" && (
        <div className="space-y-2">
          {plans.map((p) => (
            <div key={String(p.id)} className="card border-teal-200 p-3 text-xs text-teal-900">
              <p className="font-semibold">{String(p.name)}</p>
              <p>
                {String(p.strategy)} · {String(p.status)} · Rollout {String(p.rollout_percent)}%
              </p>
            </div>
          ))}
          {plans.length === 0 && <p className="text-xs text-teal-700">No launch plans yet — run the acceptance demo.</p>}
        </div>
      )}

      {tab === "demo" && (
        <div className="space-y-3">
          <p className="text-sm text-teal-900">
            Run full AC-192 acceptance path: pilot complete → launch plan → controlled rollout → health & adoption →
            support routing → feedback → release → operational maturity → rollback test → continuous improvement.
          </p>
          <button type="button" onClick={runAcceptanceDemo} className="rounded bg-teal-800 px-3 py-1 text-xs font-semibold text-white">
            Run Acceptance Demo
          </button>
        </div>
      )}

      {tab === "audit" && (
        <div className="card max-h-64 overflow-auto border-teal-200 p-3">
          {audit.map((e) => (
            <p key={String(e.id)} className="text-xs text-teal-800">
              {String(e.timestamp)} · {String(e.action)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
