"use client";

import { useEffect, useState } from "react";
import admin from "../../../data/registry/administration-platform.json";
import type { AdminOverview, AdministrativeContext, AttentionItem } from "@/lib/admin/types";

type Tab = "overview" | "users" | "roles" | "organizations" | "approvals" | "audit" | "flags";

export function AdminAdministrationPlatform() {
  const [tab, setTab] = useState<Tab>("overview");
  const [context, setContext] = useState<AdministrativeContext | null>(null);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [attention, setAttention] = useState<AttentionItem[]>([]);
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [roles, setRoles] = useState<Record<string, unknown>[]>([]);
  const [organizations, setOrganizations] = useState<Record<string, unknown>[]>([]);
  const [approvals, setApprovals] = useState<Record<string, unknown>[]>([]);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [simulation, setSimulation] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/overview")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else {
          setContext(d.context ?? null);
          setOverview(d.overview ?? null);
        }
      });
    fetch("/api/admin/attention").then((r) => r.json()).then((d) => setAttention(d.items ?? []));
  }, []);

  useEffect(() => {
    if (tab === "users") fetch("/api/admin/users").then((r) => r.json()).then((d) => setUsers(d.users ?? []));
    if (tab === "roles") fetch("/api/admin/roles").then((r) => r.json()).then((d) => setRoles(d.roles ?? []));
    if (tab === "organizations") fetch("/api/admin/organizations").then((r) => r.json()).then((d) => setOrganizations(d.organizations ?? []));
    if (tab === "approvals") fetch("/api/admin/approvals").then((r) => r.json()).then((d) => setApprovals(d.approvals ?? []));
    if (tab === "audit") fetch("/api/admin/audit").then((r) => r.json()).then((d) => setAudit(d.events ?? []));
    if (tab === "flags") fetch("/api/admin/feature-flags").then((r) => r.json()).then((d) => setFlags(d.feature_flags ?? {}));
  }, [tab]);

  async function simulateRole(roleId: string) {
    const res = await fetch(`/api/admin/roles/${roleId}/simulate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role_id: roleId }) });
    const data = await res.json();
    setSimulation(data.simulation ?? null);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "organizations", label: "Organizations" },
    { id: "roles", label: "Roles" },
    { id: "approvals", label: "Approvals" },
    { id: "audit", label: "Audit" },
    { id: "flags", label: "Feature Flags" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-slate-500 bg-slate-200">
        <p className="text-xs font-semibold uppercase text-slate-900">BUILD 8.2 · Administration Platform</p>
        <h2 className="mt-1 text-xl font-bold text-slate-950">{admin.productName}</h2>
        <p className="mt-2 text-sm text-slate-900">{admin.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-slate-800">{admin.requirementId} · {admin.acceptanceCriteria}</p>
        {context && (
          <p className="mt-2 rounded bg-white/80 p-2 text-xs text-slate-900">
            <strong>Admin context:</strong> {context.administrative_role_names.join(", ")} · IAL {context.authentication_strength}
            {context.organization_id && ` · Org ${context.organization_id}`}
          </p>
        )}
        {error && <p className="mt-2 text-sm text-red-800" role="alert">{error}</p>}
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && overview && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Active users", overview.users_active],
            ["Organizations", overview.organizations],
            ["Workspaces", overview.workspaces],
            ["Pending invitations", overview.pending_invitations],
            ["Pending approvals", overview.pending_approvals],
            ["Failed jobs", overview.failed_jobs],
            ["Platform health", overview.platform_health],
          ].map(([label, val]) => (
            <div key={String(label)} className="card border-slate-200 bg-white p-3 text-xs">
              <p className="text-slate-600">{label}</p>
              <p className="text-lg font-bold text-slate-950">{val}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "overview" && (
        <div className="card border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-950">Attention Queue</h3>
          <ul className="mt-2 space-y-1 text-xs text-slate-800">
            {attention.map((a) => (
              <li key={a.id} className="rounded bg-slate-50 px-2 py-1">{a.severity}: {a.issue} — {a.required_action}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "users" && (
        <div className="card border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-950">Users</h3>
          <ul className="mt-2 space-y-1 text-xs">
            {users.map((u) => (
              <li key={String(u.user_id)} className="rounded border border-slate-100 p-2">
                <strong>{String(u.display_name)}</strong> · {String(u.primary_email)} · {String(u.account_status)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "organizations" && (
        <div className="card border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-950">Organizations</h3>
          <ul className="mt-2 space-y-1 text-xs">
            {organizations.map((o) => (
              <li key={String(o.organization_id)} className="rounded bg-slate-50 px-2 py-1">{String(o.name)} · {String(o.status)}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "roles" && (
        <div className="space-y-4">
          <div className="card border-slate-200 bg-white p-4">
            <h3 className="text-sm font-bold text-slate-950">Roles</h3>
            <ul className="mt-2 space-y-2 text-xs">
              {roles.map((r) => (
                <li key={String(r.id)} className="rounded border border-slate-100 p-2">
                  <p className="font-bold text-slate-950">{String(r.display_name)}</p>
                  <p className="text-slate-600">{String(r.description)}</p>
                  <button type="button" onClick={() => simulateRole(String(r.id))} className="mt-1 text-slate-700 underline">Simulate role</button>
                </li>
              ))}
            </ul>
          </div>
          {simulation && (
            <div className="card border-amber-200 bg-amber-50 p-4 text-xs">
              <h4 className="font-bold text-amber-950">Permission preview: {String(simulation.role_name)}</h4>
              <p className="mt-1 text-amber-900">Allowed: {(simulation.allowed_permissions as string[])?.slice(0, 8).join(", ")}…</p>
              <p className="mt-1 text-amber-800">Routes: {(simulation.visible_routes as string[])?.join(", ")}</p>
            </div>
          )}
        </div>
      )}

      {tab === "approvals" && (
        <div className="card border-slate-200 bg-white p-4 text-xs">
          <h3 className="text-sm font-bold text-slate-950">Pending Approvals ({approvals.length})</h3>
          {approvals.length === 0 && <p className="mt-2 text-slate-600">No pending approvals</p>}
        </div>
      )}

      {tab === "audit" && (
        <div className="card border-slate-200 bg-white p-4">
          <h3 className="text-sm font-bold text-slate-950">Administrative Audit</h3>
          <ul className="mt-2 max-h-64 space-y-1 overflow-y-auto text-xs text-slate-800">
            {audit.map((e, i) => (
              <li key={i}>{String(e.timestamp ?? "").slice(0, 19)} · {String(e.action_type)} · {String(e.result)}</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "flags" && (
        <div className="card border-slate-200 bg-white p-4 text-xs">
          <h3 className="text-sm font-bold text-slate-950">Admin Feature Flags</h3>
          <ul className="mt-2 space-y-1">
            {Object.entries(flags).map(([k, v]) => (
              <li key={k}><code>{k}</code>: {v ? "enabled" : "disabled"}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
