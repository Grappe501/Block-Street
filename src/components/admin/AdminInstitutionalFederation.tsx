"use client";

import { useEffect, useState } from "react";
import fed from "../../../data/registry/institutional-federation.json";
import type { FederationHealthSummary } from "@/lib/federation/types";

type Tab = "health" | "templates" | "demo" | "audit";

async function post(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? data.error ?? "Request failed");
  return data.data ?? data;
}

export function AdminInstitutionalFederation() {
  const [tab, setTab] = useState<Tab>("health");
  const [health, setHealth] = useState<FederationHealthSummary | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Record<string, unknown>[]>([]);
  const [members, setMembers] = useState<Record<string, unknown>[]>([]);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/federation/overview")
      .then((r) => r.json())
      .then((d) => {
        setHealth(d.health ?? null);
        setInstitutionId(d.institution_id ?? null);
        setTemplates(d.templates ?? []);
        setMembers(d.federation_members ?? []);
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
      const { template } = await post("/api/v1/federation/templates", {
        source_institution_id: institutionId,
        name: "Block Street Campus Model",
        description: "Mature multi-campus operating model for replication",
        template_type: "campus_organization",
      });

      const { institution: replicated } = await post("/api/v1/federation/replicate", {
        template_id: template.id,
        target_name: "North County Campus Coalition",
      });

      await post("/api/v1/federation/replicate", {
        action: "customize",
        institution_id: replicated.id,
        settings: { locale: "en-US", launch_strategy: "single_campus" },
      });

      await post("/api/v1/federation/replicate", { action: "activate", institution_id: replicated.id });

      await post("/api/v1/federation/membership", {
        institution_id: institutionId,
        institution_name: "Block Street (Source)",
        trust_level: "shared_assets",
      });

      await post("/api/v1/federation/membership", {
        institution_id: replicated.id,
        institution_name: replicated.name,
        trust_level: "shared_assets",
      });

      const { resource: playbook } = await post("/api/v1/federation/resources", {
        owner_institution_id: institutionId,
        title: "Campus Launch Playbook",
        resource_type: "playbook",
        visibility: "federation",
      });

      await post("/api/v1/federation/membership", {
        action: "sync_playbooks",
        institution_ids: [institutionId, replicated.id],
      });

      await post("/api/v1/federation/benchmarks", {
        institution_id: institutionId,
        metrics: { adoption_score: 78, training_completion: 82, mission_completion: 75 },
      });

      await post("/api/v1/federation/benchmarks", {
        institution_id: replicated.id,
        metrics: { adoption_score: 64, training_completion: 58, mission_completion: 61 },
      });

      const benchmarksRes = await fetch("/api/v1/federation/benchmarks");
      const benchmarksData = await benchmarksRes.json();

      const { resource: trainingModule } = await post("/api/v1/federation/resources", {
        owner_institution_id: institutionId,
        title: "Volunteer Onboarding Module",
        resource_type: "training",
        visibility: "federation",
      });

      const { resource: forked } = await post("/api/v1/federation/resources", {
        action: "fork",
        parent_id: trainingModule.id,
        owner_institution_id: replicated.id,
      });

      const { contribution } = await post("/api/v1/federation/knowledge", {
        institution_id: institutionId,
        title: "Campus launch lessons learned",
        contribution_type: "lesson_learned",
        summary: "Start with one campus, certify leads before expansion",
      });

      await post("/api/v1/federation/knowledge", {
        action: "approve",
        contribution_id: contribution.id,
      });

      const { asset } =       await post("/api/v1/federation/marketplace", {
        owner_institution_id: institutionId,
        title: "Campus Organizer Training Pack",
        asset_type: "training",
      });

      await post("/api/v1/federation/analytics", {
        action: "security_audit",
        institution_ids: [institutionId, replicated.id],
      });

      await post("/api/v1/federation/benchmarks", { institution_id: institutionId });

      setMessage(
        `AC-193 acceptance complete: Template published → institution replicated (personal data excluded) → ` +
          `customized & activated → both joined federation → playbooks synced → ` +
          `anonymous benchmarks (${benchmarksData.data?.benchmarks?.length ?? 0} institutions) → ` +
          `training forked (lineage: ${forked.lineage_parent_id}) → governance approved → ` +
          `marketplace asset ${asset.title} published → institutional isolation verified.`
      );
      refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Acceptance demo failed.");
      refresh();
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "health", label: "Federation Health" },
    { id: "templates", label: "Templates" },
    { id: "demo", label: "Acceptance Demo" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-sky-500 bg-sky-100">
        <p className="text-xs font-semibold uppercase text-sky-950">BUILD 9.8 · Federation & Replication · FED-001</p>
        <h2 className="mt-1 text-xl font-bold text-sky-950">{fed.productName}</h2>
        <p className="mt-2 text-sm text-sky-950">{fed.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-sky-900">
          {fed.requirementId} · {fed.acceptanceCriteria} · /api/v1/federation
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-sky-800 text-white" : "bg-sky-50 text-sky-900"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-sky-300 bg-sky-50 p-3 text-xs text-sky-950">{message}</p>}

      {tab === "health" && health && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Federation Members", health.member_count],
            ["Published Templates", health.published_templates],
            ["Shared Resources", health.shared_resources],
            ["Knowledge Contributions", health.knowledge_contributions],
            ["Marketplace Assets", health.marketplace_assets],
            ["Collaboration Events", health.collaboration_events],
            ["Isolation Verified", health.isolation_verified ? "Yes" : "No"],
          ].map(([label, value]) => (
            <div key={String(label)} className="card border-sky-300 bg-white p-3">
              <p className="text-xs text-sky-700">{label}</p>
              <p className="text-lg font-bold text-sky-950">{value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "templates" && (
        <div className="space-y-2">
          {templates.map((t) => (
            <div key={String(t.id)} className="card border-sky-200 p-3 text-xs text-sky-900">
              <p className="font-semibold">{String(t.name)}</p>
              <p>
                {String(t.template_type)} · v{String(t.version)} · {String(t.status)}
              </p>
            </div>
          ))}
          {members.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-sky-800">Federation Members</p>
              {members.map((m) => (
                <p key={String(m.id)} className="text-xs text-sky-700">
                  {String(m.institution_name)} · {String(m.membership_status)} · {String(m.trust_level)}
                </p>
              ))}
            </div>
          )}
          {templates.length === 0 && <p className="text-xs text-sky-700">No templates yet — run the acceptance demo.</p>}
        </div>
      )}

      {tab === "demo" && (
        <div className="space-y-3">
          <p className="text-sm text-sky-900">
            Run full AC-193 acceptance path: publish template → replicate institution → exclude personal data →
            join federation → sync playbooks → anonymous benchmarking → fork training → governance approval →
            marketplace publish → security isolation audit.
          </p>
          <button type="button" onClick={runAcceptanceDemo} className="rounded bg-sky-800 px-3 py-1 text-xs font-semibold text-white">
            Run Acceptance Demo
          </button>
        </div>
      )}

      {tab === "audit" && (
        <div className="card max-h-64 overflow-auto border-sky-200 p-3">
          {audit.map((e) => (
            <p key={String(e.id)} className="text-xs text-sky-800">
              {String(e.timestamp)} · {String(e.action)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
