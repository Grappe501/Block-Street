"use client";

import { useEffect, useState } from "react";
import prv from "../../../data/registry/institutional-provisioning.json";
import ils from "../../../data/registry/institutional-launch.json";
import type { InstitutionProvisioning, LaunchOverview } from "@/lib/launch/types";

type Tab = "overview" | "provisionings" | "templates";

export function AdminInstitutionalProvisioning() {
  const [tab, setTab] = useState<Tab>("overview");
  const [overview, setOverview] = useState<LaunchOverview | null>(null);
  const [provisionings, setProvisionings] = useState<InstitutionProvisioning[]>([]);
  const [templates, setTemplates] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState({
    institution_name: "",
    institution_type: "campus_network",
    requesting_user: "director@block-street.local",
    executive_owner: "",
    technical_owner: "",
    security_owner: "",
    primary_administrator: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/launch/overview")
      .then((r) => r.json())
      .then((d) => {
        setOverview(d.overview ?? null);
        setProvisionings(d.provisionings ?? []);
        setTemplates(d.templates ?? []);
      });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function submitProvisioning(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/admin/launch/overview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error?.message ?? "Failed to create provisioning request.");
      return;
    }
    setMessage(`Provisioning requested: ${data.provisioning?.institution_name}`);
    setForm({ ...form, institution_name: "", executive_owner: "", technical_owner: "", security_owner: "", primary_administrator: "" });
    refresh();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Launch Dashboard" },
    { id: "provisionings", label: "Provisionings" },
    { id: "templates", label: "Templates" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-amber-500 bg-amber-100">
        <p className="text-xs font-semibold uppercase text-amber-950">BUILD 9.1 · Institutional Provisioning</p>
        <h2 className="mt-1 text-xl font-bold text-amber-950">{prv.productName}</h2>
        <p className="mt-2 text-sm text-amber-950">{prv.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-amber-900">
          {prv.requirementId} · {prv.acceptanceCriteria} · /api/v1/launch
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-amber-800 text-white" : "bg-amber-50 text-amber-900"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && overview && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Phase Progress", `${overview.steps_complete}/${overview.steps_total}`],
            ["Provisionings", overview.provisioning_total],
            ["In Pipeline", overview.provisioning_in_pipeline],
            ["Active Institutions", overview.provisioning_active],
            ["Config Templates", overview.configuration_templates],
            ["Launch Readiness", `${overview.launch_readiness_score}%`],
            ["Human Help / Session", overview.human_help_count_avg],
            ["Open Support Issues", overview.open_support_issues],
          ].map(([label, val]) => (
            <div key={String(label)} className="card border-amber-200 bg-white p-3 text-xs">
              <p className="text-amber-700">{label}</p>
              <p className="text-lg font-bold text-amber-950">{val}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "provisionings" && (
        <div className="space-y-4">
          <form onSubmit={submitProvisioning} className="card space-y-3 border-amber-200 bg-white p-4 text-xs">
            <p className="font-semibold text-amber-950">Request New Institution</p>
            <div className="grid gap-2 md:grid-cols-2">
              {(
                [
                  ["institution_name", "Institution Name"],
                  ["executive_owner", "Executive Owner"],
                  ["technical_owner", "Technical Owner"],
                  ["security_owner", "Security Owner"],
                  ["primary_administrator", "Primary Administrator"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block">
                  <span className="text-amber-800">{label}</span>
                  <input
                    className="mt-1 w-full rounded border border-amber-200 px-2 py-1"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    required={key === "institution_name"}
                  />
                </label>
              ))}
            </div>
            <button type="submit" className="rounded bg-amber-800 px-3 py-1 font-semibold text-white">
              Submit Provisioning Request
            </button>
            {message && <p className="text-amber-900">{message}</p>}
          </form>

          <ul className="space-y-2 text-xs text-amber-900">
            {provisionings.length === 0 ? (
              <li className="card border-amber-200 bg-amber-50 p-3">No provisioning records yet.</li>
            ) : (
              provisionings.map((p) => (
                <li key={p.id} className="card border-amber-200 bg-white p-3">
                  <p className="font-semibold">{p.institution_name} · {p.status}</p>
                  <p>{p.institution_type} · {p.risk_classification} risk · {p.primary_administrator || "—"}</p>
                  <p className="text-amber-700">{p.id} · created {p.created_at}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {tab === "templates" && (
        <ul className="space-y-2 text-xs text-amber-900">
          {templates.map((t) => (
            <li key={String(t.id)} className="card border-amber-200 bg-white p-3">
              <p className="font-semibold">{String(t.name)}</p>
              <p>{String(t.institution_type)} · {String(t.status)}</p>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-amber-800">
        {ils.productName} · {ils.requirementId} · governed by institutional launch architecture
      </p>
    </div>
  );
}
