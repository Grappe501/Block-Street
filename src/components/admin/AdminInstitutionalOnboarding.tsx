"use client";

import { useEffect, useState } from "react";
import onb from "../../../data/registry/guided-onboarding.json";
import type { OnboardingHealth, OnboardingJourney } from "@/lib/onboarding/types";

type Tab = "health" | "invitations" | "journeys" | "demo" | "audit";

export function AdminInstitutionalOnboarding() {
  const [tab, setTab] = useState<Tab>("health");
  const [health, setHealth] = useState<OnboardingHealth | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Record<string, unknown>[]>([]);
  const [invitations, setInvitations] = useState<Record<string, unknown>[]>([]);
  const [journeys, setJourneys] = useState<OnboardingJourney[]>([]);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [activeJourneyId, setActiveJourneyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/onboarding/overview").then((r) => r.json()).then((d) => {
      setHealth(d.health ?? null);
      setInstitutionId(d.institution_id ?? null);
      setTemplates(d.templates ?? []);
      setInvitations(d.invitations ?? []);
      setJourneys(d.journeys ?? []);
      setAudit(d.audit ?? []);
      if (!activeJourneyId && d.journeys?.length) setActiveJourneyId(d.journeys[0].id);
    });
  }

  useEffect(() => { refresh(); }, []);

  async function inviteStudent() {
    if (!institutionId) return;
    setMessage(null);
    const res = await fetch("/api/v1/onboarding/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        institution_id: institutionId,
        email: "student@example.com",
        role_key: "student",
        message: "Join the University of Arkansas Campus Chapter",
      }),
    });
    const data = await res.json();
    setMessage(res.ok ? `Invitation sent. Accept URL: ${data.data?.accept_url ?? "created"}` : data.error?.message ?? "Failed.");
    refresh();
  }

  async function runAcceptanceDemo() {
    if (!institutionId) return;
    setMessage(null);

    const invRes = await fetch("/api/v1/onboarding/invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        institution_id: institutionId,
        email: "director@block-street.local",
        role_key: "student",
      }),
    });
    const invData = await invRes.json();
    const acceptUrl = invData.data?.accept_url as string | undefined;
    const token = acceptUrl?.split("token=")[1];
    if (!token) { setMessage("Invitation failed."); return; }

    const acceptRes = await fetch(`/api/v1/onboarding/invitations/${token}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_email: "director@block-street.local",
        unit_name: "University of Arkansas Campus Chapter",
        institution_name: "Block Street Network",
      }),
    });
    const acceptData = await acceptRes.json();
    const journeyId = acceptData.data?.journey?.id;
    if (!journeyId) { setMessage(acceptData.error?.message ?? "Journey failed."); return; }
    setActiveJourneyId(journeyId);

    const steps = [
      () => fetch(`/api/v1/onboarding/journeys/${journeyId}/checklist`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ item_key: "verify_identity" }) }),
      () => fetch(`/api/v1/onboarding/journeys/${journeyId}/checklist`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ item_key: "complete_profile" }) }),
      () => fetch(`/api/v1/onboarding/journeys/${journeyId}/checklist`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ item_key: "join_chapter" }) }),
      () => fetch(`/api/v1/onboarding/journeys/${journeyId}/training`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ training_key: "civic_foundations" }) }),
      () => fetch(`/api/v1/onboarding/journeys/${journeyId}/tour`, { method: "POST" }),
      () => fetch(`/api/v1/onboarding/journeys/${journeyId}/checklist`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ item_key: "meet_mentor" }) }),
      () => fetch(`/api/v1/onboarding/journeys/${journeyId}/mission`, { method: "POST" }),
    ];

    for (const step of steps) await step();
    setMessage("Acceptance demo complete: student journey → Operational readiness.");
    refresh();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "health", label: "Onboarding Health" },
    { id: "invitations", label: "Invitations" },
    { id: "journeys", label: "Journeys" },
    { id: "demo", label: "Acceptance Demo" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-emerald-500 bg-emerald-100">
        <p className="text-xs font-semibold uppercase text-emerald-950">BUILD 9.4 · Guided Onboarding · ONB-001</p>
        <h2 className="mt-1 text-xl font-bold text-emerald-950">{onb.productName}</h2>
        <p className="mt-2 text-sm text-emerald-950">{onb.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-emerald-900">{onb.requirementId} · {onb.acceptanceCriteria} · /api/v1/onboarding</p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-emerald-800 text-white" : "bg-emerald-50 text-emerald-900"}`}>
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-950">{message}</p>}

      {tab === "health" && health && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Invited", health.invited],
            ["In Progress", health.in_progress],
            ["Completed", health.completed],
            ["Blocked", health.blocked],
            ["Avg Completion", `${health.average_completion}%`],
            ["Operational Ready", health.operational_ready],
          ].map(([label, value]) => (
            <div key={String(label)} className="card border-emerald-300 bg-white p-3">
              <p className="text-xs text-emerald-700">{label}</p>
              <p className="text-lg font-bold text-emerald-950">{value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "invitations" && (
        <div className="space-y-3">
          <button type="button" onClick={inviteStudent} className="rounded bg-emerald-800 px-3 py-1 text-xs font-semibold text-white">Invite Student Organizer</button>
          <p className="text-xs text-emerald-800">{invitations.length} institutional invitations · {templates.length} journey templates</p>
          {invitations.map((inv) => (
            <div key={String(inv.id)} className="card border-emerald-200 p-2 text-xs text-emerald-900">
              {String(inv.email)} · {String(inv.role_key)} · {String(inv.status)}
            </div>
          ))}
        </div>
      )}

      {tab === "journeys" && (
        <div className="space-y-2">
          {journeys.map((j) => (
            <div key={j.id} className="card border-emerald-200 p-3 text-xs text-emerald-900">
              <p className="font-semibold">{j.unit_name} · {j.role_key}</p>
              <p>Readiness: {j.readiness_state} ({j.readiness_score}%) · Unlocked: {j.unlocked_features.join(", ")}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "demo" && (
        <div className="space-y-3">
          <p className="text-sm text-emerald-900">Run full AC-189 acceptance path: invite → accept → civic training → tour → mentor → first mission → operational.</p>
          <button type="button" onClick={runAcceptanceDemo} className="rounded bg-emerald-800 px-3 py-1 text-xs font-semibold text-white">Run Acceptance Demo</button>
        </div>
      )}

      {tab === "audit" && (
        <div className="card max-h-64 overflow-auto border-emerald-200 p-3">
          {audit.map((e) => (
            <p key={String(e.id)} className="text-xs text-emerald-800">{String(e.timestamp)} · {String(e.action)}</p>
          ))}
        </div>
      )}
    </div>
  );
}
