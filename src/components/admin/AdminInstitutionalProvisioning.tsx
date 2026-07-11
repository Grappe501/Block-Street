"use client";

import { useEffect, useState } from "react";
import prv from "../../../data/registry/institutional-provisioning.json";
import type { ProvisioningAttentionItem, ProvisioningHealth } from "@/lib/provisioning/types";

type Tab = "health" | "requests" | "templates" | "attention" | "audit";

interface RequestRow {
  id: string;
  requested_name: string;
  institution_type: string;
  status: string;
  risk_level: string | null;
  institution_id: string | null;
}

export function AdminInstitutionalProvisioning() {
  const [tab, setTab] = useState<Tab>("health");
  const [health, setHealth] = useState<ProvisioningHealth | null>(null);
  const [attention, setAttention] = useState<ProvisioningAttentionItem[]>([]);
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [templates, setTemplates] = useState<Record<string, unknown>[]>([]);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [types, setTypes] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    requested_name: "",
    institution_type: "multi_campus_network",
    requesting_user_id: "director@block-street.local",
    purpose: "",
    intended_users: 200,
    intended_regions: "Arkansas",
    executive_sponsor: "",
    administrative_owner_contact: "",
    security_contact: "",
    data_owner_contact: "",
    support_contact: "",
    anticipated_data_types: "student,organizing",
  });

  function refresh() {
    fetch("/api/admin/provisioning/overview")
      .then((r) => r.json())
      .then((d) => {
        setHealth(d.health ?? null);
        setAttention(d.attention_queue ?? []);
        setRequests(d.requests ?? []);
        setTemplates(d.templates ?? []);
        setAudit(d.audit ?? []);
        setTypes(d.institution_types ?? []);
      });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/provisioning/overview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        intended_regions: form.intended_regions.split(",").map((s) => s.trim()),
        anticipated_data_types: form.anticipated_data_types.split(",").map((s) => s.trim()),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed to create request.");
      return;
    }
    setMessage(`Request created: ${data.request?.id}`);
    refresh();
  }

  async function action(path: string, body?: Record<string, unknown>) {
    setMessage(null);
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error?.message ?? data.error ?? "Action failed.");
      return;
    }
    setMessage("Action completed.");
    refresh();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "health", label: "Provisioning Health" },
    { id: "requests", label: "Requests" },
    { id: "templates", label: "Templates" },
    { id: "attention", label: "Attention Queue" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-amber-500 bg-amber-100">
        <p className="text-xs font-semibold uppercase text-amber-950">BUILD 9.1 · Institutional Provisioning · PRV-001</p>
        <h2 className="mt-1 text-xl font-bold text-amber-950">{prv.productName}</h2>
        <p className="mt-2 text-sm text-amber-950">No institution enters without clear ownership, explicit scope, secure defaults, and a visible launch state.</p>
        <p className="mt-2 text-xs font-semibold text-amber-900">{prv.requirementId} · {prv.acceptanceCriteria} · /api/v1/institutions</p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-amber-800 text-white" : "bg-amber-50 text-amber-900"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-amber-300 bg-amber-50 p-3 text-xs text-amber-950">{message}</p>}

      {tab === "health" && health && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Under Review", health.requests_under_review],
            ["Active Jobs", health.active_provisioning_jobs],
            ["Avg Time (min)", health.average_provisioning_time_minutes],
            ["Blocked", health.blocked_institutions],
            ["Validation Success", `${health.validation_success_rate}%`],
            ["Manual Interventions", health.manual_interventions],
            ["Template Coverage", `${health.template_coverage_percent}%`],
            ["Baseline Failures", health.security_baseline_failures],
          ].map(([label, val]) => (
            <div key={String(label)} className="card border-amber-200 bg-white p-3 text-xs">
              <p className="text-amber-700">{label}</p>
              <p className="text-lg font-bold text-amber-950">{val}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "attention" && (
        <ul className="space-y-2 text-xs">
          {attention.length === 0 ? (
            <li className="card border-emerald-200 bg-emerald-50 p-3 text-emerald-900">No blocking attention items.</li>
          ) : (
            attention.map((a, i) => (
              <li key={`${a.institution_id}-${i}`} className={`card p-3 ${a.severity === "blocking" ? "border-red-300 bg-red-50 text-red-900" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
                <p className="font-semibold">{a.institution_name} · {a.category}</p>
                <p>{a.message}</p>
              </li>
            ))
          )}
        </ul>
      )}

      {tab === "requests" && (
        <div className="space-y-4">
          <form onSubmit={submitRequest} className="card space-y-3 border-amber-200 bg-white p-4 text-xs">
            <p className="font-semibold text-amber-950">New Institution Request</p>
            <div className="grid gap-2 md:grid-cols-2">
              <label className="block">
                <span className="text-amber-800">Institution Name</span>
                <input className="mt-1 w-full rounded border px-2 py-1" value={form.requested_name} onChange={(e) => setForm({ ...form, requested_name: e.target.value })} required />
              </label>
              <label className="block">
                <span className="text-amber-800">Institution Type</span>
                <select className="mt-1 w-full rounded border px-2 py-1" value={form.institution_type} onChange={(e) => setForm({ ...form, institution_type: e.target.value })}>
                  {types.map((t) => (
                    <option key={String(t.key)} value={String(t.key)}>{String(t.name)}</option>
                  ))}
                </select>
              </label>
              <label className="block md:col-span-2">
                <span className="text-amber-800">Purpose</span>
                <input className="mt-1 w-full rounded border px-2 py-1" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required />
              </label>
              {(
                [
                  ["executive_sponsor", "Executive Sponsor"],
                  ["administrative_owner_contact", "Administrative Owner"],
                  ["security_contact", "Security Contact"],
                  ["data_owner_contact", "Data Owner"],
                  ["support_contact", "Support Contact"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block">
                  <span className="text-amber-800">{label}</span>
                  <input className="mt-1 w-full rounded border px-2 py-1" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
                </label>
              ))}
            </div>
            <button type="submit" className="rounded bg-amber-800 px-3 py-1 font-semibold text-white">Create Draft Request</button>
          </form>

          <ul className="space-y-2 text-xs">
            {requests.map((r) => (
              <li key={r.id} className="card border-amber-200 bg-white p-3">
                <p className="font-semibold">{r.requested_name} · {r.status} · {r.risk_level ?? "—"}</p>
                <p>{r.institution_type} · {r.id}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.status === "draft" && (
                    <button type="button" className="rounded bg-amber-700 px-2 py-0.5 text-white" onClick={() => action(`/api/v1/institutions/requests/${r.id}/submit`)}>
                      Submit
                    </button>
                  )}
                  {r.status === "under_review" && (
                    <button type="button" className="rounded bg-emerald-700 px-2 py-0.5 text-white" onClick={() => action(`/api/v1/institutions/requests/${r.id}/approve`, { template_id: "tpl-multi-campus-v1" })}>
                      Approve
                    </button>
                  )}
                  {r.status === "approved" && (
                    <button type="button" className="rounded bg-sky-700 px-2 py-0.5 text-white" onClick={() => action(`/api/v1/institutions/provision`, { request_id: r.id })}>
                      Run Provisioning
                    </button>
                  )}
                  {r.institution_id && (
                    <button type="button" className="rounded bg-violet-700 px-2 py-0.5 text-white" onClick={() => action(`/api/v1/institutions/${r.institution_id}/provisioning/validate`)}>
                      Validate
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "templates" && (
        <ul className="space-y-2 text-xs">
          {templates.map((t) => (
            <li key={String(t.id)} className="card border-amber-200 bg-white p-3">
              <p className="font-semibold">{String(t.name)} v{String(t.version)}</p>
              <p>{String(t.institution_type)} · {String(t.status)} · {Array.isArray(t.default_workspaces) ? `${(t.default_workspaces as unknown[]).length} workspaces` : ""}</p>
            </li>
          ))}
        </ul>
      )}

      {tab === "audit" && (
        <ul className="space-y-2 text-xs">
          {audit.map((e) => (
            <li key={String(e.id)} className="card border-amber-200 bg-white p-3">
              <p className="font-semibold">{String(e.action)} · {String(e.result)}</p>
              <p>{String(e.actor_id)} · {String(e.timestamp)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
