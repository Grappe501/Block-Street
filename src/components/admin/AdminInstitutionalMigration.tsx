"use client";

import { useEffect, useState } from "react";
import mig from "../../../data/registry/data-migration.json";
import type { MigrationHealth, MigrationProject } from "@/lib/migration/types";

type Tab = "health" | "projects" | "workflow" | "readiness" | "audit";

export function AdminInstitutionalMigration() {
  const [tab, setTab] = useState<Tab>("health");
  const [health, setHealth] = useState<MigrationHealth | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [projects, setProjects] = useState<MigrationProject[]>([]);
  const [attention, setAttention] = useState<Array<{ type: string; message: string; severity: string }>>([]);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<Record<string, unknown> | null>(null);

  function refresh() {
    fetch("/api/admin/migration/overview").then((r) => r.json()).then((d) => {
      setHealth(d.health ?? null);
      setInstitutionId(d.institution_id ?? null);
      setProjects(d.projects ?? []);
      setAttention(d.attention ?? []);
      setAudit(d.audit ?? []);
      if (!activeProjectId && d.projects?.length) setActiveProjectId(d.projects[0].id);
    });
    if (institutionId && activeProjectId) {
      fetch(`/api/v1/institutions/${institutionId}/data-readiness?project_id=${activeProjectId}`)
        .then((r) => r.json())
        .then((d) => setReadiness(d.data ?? d));
    }
  }

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    if (institutionId && activeProjectId) {
      fetch(`/api/v1/institutions/${institutionId}/data-readiness?project_id=${activeProjectId}`)
        .then((r) => r.json())
        .then((d) => setReadiness(d.data ?? d));
    }
  }, [institutionId, activeProjectId]);

  async function createProject() {
    if (!institutionId) return;
    setMessage(null);
    const res = await fetch("/api/v1/migrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        institution_id: institutionId,
        name: "Initial Institutional Migration",
        migration_type: "initial_institutional",
        target_domains: ["users", "memberships", "campuses", "organizations", "events", "documents", "volunteer_history", "communication_consent"],
        migration_owner_user_id: "director@block-street.local",
        data_owner_user_id: "director@block-street.local",
        security_reviewer_user_id: "director@block-street.local",
        institution_approver_user_id: "director@block-street.local",
        risk_level: "M3",
      }),
    });
    const data = await res.json();
    if (!res.ok) { setMessage(data.error?.message ?? "Create failed."); return; }
    setActiveProjectId(data.data?.project?.id ?? null);
    setMessage("Migration project created (M3 risk).");
    refresh();
  }

  async function seedSources() {
    if (!activeProjectId) return;
    const sources = [
      { name: "Campus Roster 2025", source_type: "csv", source_system: "spreadsheet", source_owner_user_id: "director@block-street.local", source_location_reference: "legacy/campus-roster.csv", contains_personal_data: true },
      { name: "Volunteer History", source_type: "csv", source_system: "spreadsheet", source_owner_user_id: "director@block-street.local", source_location_reference: "legacy/volunteers.csv" },
      { name: "Organization Directory", source_type: "csv", source_system: "crm", source_owner_user_id: "director@block-street.local", source_location_reference: "legacy/orgs.csv" },
      { name: "Event Calendar Export", source_type: "ics", source_system: "calendar", source_owner_user_id: "director@block-street.local", source_location_reference: "legacy/events.ics" },
      { name: "Unowned Contact List", source_type: "csv", source_system: "spreadsheet", source_location_reference: "legacy/contacts.csv", contains_personal_data: true },
    ];
    for (const s of sources) {
      await fetch(`/api/v1/migrations/${activeProjectId}/sources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
    }
    setMessage("5 legacy sources inventoried (1 ownerless).");
    refresh();
  }

  async function runIntakeDemo() {
    if (!activeProjectId) return;
    const detail = await fetch(`/api/v1/migrations/${activeProjectId}`).then((r) => r.json());
    const sources = detail.data?.sources ?? [];
    const roster = sources.find((s: { name: string }) => s.name.includes("Campus Roster"));
    if (!roster) { setMessage("Add sources first."); return; }
    const csv = "name,email,campus,consent\nJane Doe,jane@block-street.local,uark,verified\nJohn Smith,,University of Arkansas,transactional\nAlex Lee,alex@example.com,Unknown Campus,\nBob Notes,bob@example.com,uca,verified\n";
    await fetch(`/api/v1/migrations/${activeProjectId}/intake/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ migration_source_id: roster.id, original_filename: "campus-roster.csv", content: csv }),
    });
    const secret = await fetch(`/api/v1/migrations/${activeProjectId}/intake/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        migration_source_id: roster.id,
        original_filename: "config-leak.csv",
        content: "api_key=sk-live-secret123",
      }),
    });
    const secretData = await secret.json();
    setMessage(secretData.data?.quarantined ? "Intake complete. Secret file quarantined." : "Intake complete.");
    refresh();
  }

  async function migrationAction(action: string, extra?: Record<string, unknown>) {
    if (!activeProjectId) return;
    setMessage(null);
    const endpoints: Record<string, string> = {
      validate: `/api/v1/migrations/${activeProjectId}/validate`,
      dry_run: `/api/v1/migrations/${activeProjectId}/dry-run`,
      import: `/api/v1/migrations/${activeProjectId}/import`,
      reconcile: `/api/v1/migrations/${activeProjectId}/reconcile`,
    };
    const res = await fetch(endpoints[action] ?? `/api/v1/migrations/${activeProjectId}/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(extra ?? {}),
    });
    const data = await res.json();
    setMessage(res.ok ? `${action} completed.` : data.error?.message ?? "Failed.");
    refresh();
  }

  async function approveAll() {
    if (!activeProjectId) return;
    for (const type of ["mapping", "dry_run", "security", "data_owner", "institution"]) {
      await fetch(`/api/v1/migrations/${activeProjectId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approval_type: type }),
      });
    }
    setMessage("All migration approvals recorded.");
    refresh();
  }

  async function assessReadiness() {
    if (!institutionId || !activeProjectId) return;
    const res = await fetch(`/api/v1/institutions/${institutionId}/data-readiness`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "assess", migration_project_id: activeProjectId }),
    });
    const data = await res.json();
    setReadiness(data.data ?? data);
    setMessage("Data readiness assessed.");
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "health", label: "Migration Health" },
    { id: "projects", label: "Projects" },
    { id: "workflow", label: "Workflow" },
    { id: "readiness", label: "Data Readiness" },
    { id: "audit", label: "Audit" },
  ];

  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="space-y-6">
      <div className="card border-slate-500 bg-slate-100">
        <p className="text-xs font-semibold uppercase text-slate-950">BUILD 9.3 · Migration & Data Readiness · MIG-001</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">{mig.productName}</h2>
        <p className="mt-2 text-sm text-slate-950">{mig.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-slate-900">{mig.requirementId} · {mig.acceptanceCriteria} · /api/v1/migrations</p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-slate-800 text-white" : "bg-slate-50 text-slate-900"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-slate-300 bg-slate-50 p-3 text-xs text-slate-950">{message}</p>}

      {tab === "health" && health && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Active Projects", health.active_projects],
            ["Records in Staging", health.records_in_staging],
            ["Validation Pass Rate", `${health.validation_pass_rate}%`],
            ["Open Exceptions", health.open_exceptions],
            ["Identity Conflicts", health.identity_conflicts],
            ["Quarantined Items", health.quarantined_items],
            ["Reconciliation Success", `${health.reconciliation_success_rate}%`],
            ["Readiness Blockers", health.readiness_blockers],
          ].map(([label, value]) => (
            <div key={String(label)} className="card border-slate-300 bg-white p-3">
              <p className="text-xs text-slate-600">{label}</p>
              <p className="text-lg font-bold text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "health" && attention.length > 0 && (
        <div className="card border-amber-300 bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-950">Attention Queue</p>
          <ul className="mt-2 space-y-1">
            {attention.slice(0, 8).map((a, i) => (
              <li key={i} className="text-xs text-amber-900">[{a.severity}] {a.message}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "projects" && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={createProject} className="rounded bg-slate-800 px-3 py-1 text-xs font-semibold text-white">Create Migration Project</button>
            <button type="button" onClick={seedSources} className="rounded bg-slate-600 px-3 py-1 text-xs font-semibold text-white">Inventory Sources</button>
          </div>
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveProjectId(p.id)}
              className={`card w-full border-l-4 p-3 text-left ${activeProjectId === p.id ? "border-slate-800 bg-slate-50" : "border-slate-300"}`}
            >
              <p className="font-semibold text-slate-950">{p.name}</p>
              <p className="text-xs text-slate-600">{p.risk_level} · {p.status} · {p.target_domains.join(", ")}</p>
            </button>
          ))}
        </div>
      )}

      {tab === "workflow" && activeProject && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-950">Active: {activeProject.name} ({activeProject.status})</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={runIntakeDemo} className="rounded bg-slate-700 px-3 py-1 text-xs font-semibold text-white">Secure Intake Demo</button>
            <button type="button" onClick={() => migrationAction("validate")} className="rounded bg-slate-600 px-3 py-1 text-xs font-semibold text-white">Validate</button>
            <button type="button" onClick={() => migrationAction("dry_run")} className="rounded bg-slate-600 px-3 py-1 text-xs font-semibold text-white">Dry Run</button>
            <button type="button" onClick={approveAll} className="rounded bg-slate-600 px-3 py-1 text-xs font-semibold text-white">Record Approvals</button>
            <button type="button" onClick={() => migrationAction("import")} className="rounded bg-slate-600 px-3 py-1 text-xs font-semibold text-white">Import Batch</button>
            <button type="button" onClick={() => migrationAction("import", { resume_from_checkpoint: "1" })} className="rounded bg-slate-500 px-3 py-1 text-xs font-semibold text-white">Resume Import</button>
            <button type="button" onClick={() => migrationAction("reconcile")} className="rounded bg-slate-600 px-3 py-1 text-xs font-semibold text-white">Reconcile</button>
          </div>
        </div>
      )}

      {tab === "readiness" && (
        <div className="space-y-3">
          <button type="button" onClick={assessReadiness} className="rounded bg-slate-800 px-3 py-1 text-xs font-semibold text-white">Assess Data Readiness</button>
          {readiness && (
            <div className="card border-slate-300 p-4">
              <p className="text-sm font-semibold">Overall: {(readiness as { overall_percent?: number }).overall_percent ?? "—"}%</p>
              <ul className="mt-2 space-y-1">
                {((readiness as { assessments?: Array<{ data_domain: string; status: string; overall_score: number }> }).assessments ?? []).map((a) => (
                  <li key={a.data_domain} className="text-xs text-slate-800">{a.data_domain}: {a.status} ({a.overall_score}%)</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {tab === "audit" && (
        <div className="card max-h-64 overflow-auto border-slate-300 p-3">
          {audit.map((e) => (
            <p key={String(e.id)} className="text-xs text-slate-700">{String(e.timestamp)} · {String(e.action)} · {String(e.result)}</p>
          ))}
        </div>
      )}
    </div>
  );
}
