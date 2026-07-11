"use client";

import { useEffect, useState } from "react";
import org from "../../../data/registry/organizational-modeling.json";
import type { OrganizationHealth } from "@/lib/organization/types";

type Tab = "health" | "structure" | "configure" | "audit";

function renderTree(nodes: Array<{ unit: { name: string; unit_type: string; id: string }; children: unknown[]; depth: number }>, depth = 0): React.ReactNode {
  return nodes.map((n) => (
    <div key={n.unit.id} style={{ marginLeft: depth * 16 }} className="text-xs text-indigo-900">
      <p className="font-semibold">{n.unit.name} <span className="font-normal text-indigo-600">({n.unit.unit_type})</span></p>
      {Array.isArray(n.children) && n.children.length > 0 ? renderTree(n.children as typeof nodes, depth + 1) : null}
    </div>
  ));
}

export function AdminInstitutionalOrganization() {
  const [tab, setTab] = useState<Tab>("health");
  const [health, setHealth] = useState<OrganizationHealth | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Record<string, unknown>[]>([]);
  const [structure, setStructure] = useState<Record<string, unknown> | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/organization/overview").then((r) => r.json()).then((d) => {
      setHealth(d.health ?? null);
      setInstitutionId(d.institution_id ?? null);
      setTemplates(d.templates ?? []);
      setAudit(d.audit ?? []);
    });
    if (institutionId) {
      fetch(`/api/v1/institutions/${institutionId}/structure`).then((r) => r.json()).then((d) => setStructure(d.data ?? null));
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (institutionId) {
      fetch(`/api/v1/institutions/${institutionId}/structure`).then((r) => r.json()).then((d) => setStructure(d.data ?? null));
    }
  }, [institutionId]);

  async function applyTemplate() {
    if (!institutionId) return;
    setMessage(null);
    const res = await fetch(`/api/v1/institutions/${institutionId}/configuration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "apply_template",
        template_id: "org-tpl-multi-campus-v1",
        campus_units: [
          { name: "University of Arkansas", parent_region_key: "region_nw", owner: "director@block-street.local" },
          { name: "Arkansas State University", parent_region_key: "region_south", owner: "director@block-street.local" },
          { name: "University of Central Arkansas", parent_region_key: "region_central", owner: "director@block-street.local" },
        ],
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error?.message ?? "Template apply failed.");
      return;
    }
    setDraftId(data.data?.draft?.id ?? null);
    setMessage("Multi-campus template applied. Draft created.");
    refresh();
  }

  async function configAction(action: string) {
    if (!institutionId || !draftId) return;
    const res = await fetch(`/api/v1/institutions/${institutionId}/configuration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, draft_id: draftId }),
    });
    const data = await res.json();
    setMessage(res.ok ? `${action} completed.` : data.error?.message ?? "Failed.");
    refresh();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "health", label: "Structure Health" },
    { id: "structure", label: "Org Chart" },
    { id: "configure", label: "Configuration" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-indigo-500 bg-indigo-100">
        <p className="text-xs font-semibold uppercase text-indigo-950">BUILD 9.2 · Organizational Modeling · ORG-001</p>
        <h2 className="mt-1 text-xl font-bold text-indigo-950">{org.productName}</h2>
        <p className="mt-2 text-sm text-indigo-950">{org.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-indigo-900">{org.requirementId} · {org.acceptanceCriteria} · /api/v1/organizational-units</p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-indigo-800 text-white" : "bg-indigo-50 text-indigo-900"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-indigo-300 bg-indigo-50 p-3 text-xs text-indigo-950">{message}</p>}

      {tab === "health" && health && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Active Units", health.active_units],
            ["Campuses", health.campuses],
            ["Chapters", health.chapters],
            ["Departments", health.departments],
            ["Ownerless Units", health.ownerless_units],
            ["Leadership Vacancies", health.leadership_vacancies],
            ["Config Warnings", health.configuration_warnings],
            ["Pending Reorgs", health.pending_reorganizations],
            ["Validation", health.structure_validation],
          ].map(([label, val]) => (
            <div key={String(label)} className="card border-indigo-200 bg-white p-3 text-xs">
              <p className="text-indigo-700">{label}</p>
              <p className="text-lg font-bold text-indigo-950">{val}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "structure" && structure && (
        <div className="card border-indigo-200 bg-white p-4">
          <p className="mb-3 text-xs font-semibold text-indigo-950">Organizational Chart</p>
          {renderTree((structure.tree as never) ?? [])}
        </div>
      )}

      {tab === "configure" && (
        <div className="space-y-4 text-xs">
          <div className="card border-indigo-200 bg-white p-4">
            <p className="font-semibold text-indigo-950">Templates</p>
            <ul className="mt-2 space-y-1">
              {templates.map((t) => (
                <li key={String(t.id)}>{String(t.name)} v{String(t.version)}</li>
              ))}
            </ul>
            <button type="button" onClick={applyTemplate} className="mt-3 rounded bg-indigo-800 px-3 py-1 font-semibold text-white">
              Apply Multi-Campus Template
            </button>
          </div>
          {draftId && (
            <div className="flex flex-wrap gap-2">
              <button type="button" className="rounded bg-indigo-700 px-2 py-1 text-white" onClick={() => configAction("submit")}>Submit & Validate</button>
              <button type="button" className="rounded bg-emerald-700 px-2 py-1 text-white" onClick={() => configAction("approve")}>Approve</button>
              <button type="button" className="rounded bg-violet-700 px-2 py-1 text-white" onClick={() => configAction("activate")}>Activate</button>
            </div>
          )}
          <p className="text-indigo-700">Institution: {institutionId ?? "Provision an institution first (Build 9.1)"}</p>
        </div>
      )}

      {tab === "audit" && (
        <ul className="space-y-2 text-xs">
          {audit.map((e) => (
            <li key={String(e.id)} className="card border-indigo-200 bg-white p-3">
              <p className="font-semibold">{String(e.action)} · {String(e.result)}</p>
              <p>{String(e.timestamp)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
