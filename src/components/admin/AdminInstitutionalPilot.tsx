"use client";

import { useEffect, useState } from "react";
import plt from "../../../data/registry/pilot-acceptance.json";
import type { PilotHealth } from "@/lib/pilot/types";

type Tab = "health" | "programs" | "demo" | "audit";

async function post(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? "Request failed");
  return data.data ?? data;
}

export function AdminInstitutionalPilot() {
  const [tab, setTab] = useState<Tab>("health");
  const [health, setHealth] = useState<PilotHealth | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [pilots, setPilots] = useState<Record<string, unknown>[]>([]);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/pilot/overview")
      .then((r) => r.json())
      .then((d) => {
        setHealth(d.health ?? null);
        setInstitutionId(d.institution_id ?? null);
        setPilots(d.pilots ?? []);
        setAudit(d.audit ?? []);
      });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function runSession(workflowId: string, programId: string, participantId: string, observerId: string, device: string, helpCount: number) {
    const { session } = await post(`/api/v1/pilot-workflows/${workflowId}/sessions`, {
      program_id: programId,
      participant_id: participantId,
      observer_id: observerId,
      device_type: device,
    });
    await post(`/api/v1/pilot-sessions/${session.id}/start`, {});
    for (let i = 0; i < helpCount; i++) {
      await post(`/api/v1/pilot-sessions/${session.id}/help-events`, {
        help_type: i === 0 ? "navigation" : "workflow",
        severity: i >= 2 ? "H3" : "H2",
        workflow_step: "step_" + (i + 1),
        question_asked: "Where do I go next?",
        help_provided: "Observer provided directional guidance",
      });
    }
    if (helpCount > 0) {
      await post(`/api/v1/pilot-sessions/${session.id}/observations`, {
        observation_type: "hesitation",
        workflow_step: "navigation",
        participant_statement: "I expected this to be in settings",
        severity: "moderate",
        observer_notes: "Long pause before help requested",
      });
    }
    await post(`/api/v1/pilot-sessions/${session.id}/complete`, { outcome: "success" });
    return session;
  }

  async function runAcceptanceDemo() {
    if (!institutionId) return;
    setMessage(null);

    try {
      const { program } = await post("/api/v1/pilots", {
        institution_id: institutionId,
        name: "Multi-Campus Phase A–D Acceptance Pilot",
        description: "PLT-001 full acceptance path across phases A through D",
        phase: "A",
        pilot_owner_user_id: "director@block-street.local",
        observation_lead_user_id: "director@block-street.local",
      });
      const pilotId = program.id as string;

      const { workflows } = await post(`/api/v1/pilots/${pilotId}/workflows`, {});
      const workflowList = workflows as { id: string; name: string }[];

      const { cohort: refCohort } = await post(`/api/v1/pilots/${pilotId}/cohorts`, {
        action: "create_cohort",
        name: "Reference Operators",
        cohort_type: "reference_operators",
      });
      const { participant: refPart } = await post(`/api/v1/pilots/${pilotId}/cohorts`, {
        action: "add_participant",
        cohort_id: refCohort.id,
        user_id: "director@block-street.local",
        role_id: "role-platform-admin",
        experience_level: "expert",
        device_profile: "desktop",
      });

      await post(`/api/v1/pilots/${pilotId}/readiness`, {});
      await post(`/api/v1/pilots/${pilotId}/start`, {});

      for (const wf of workflowList.slice(0, 4)) {
        await runSession(wf.id, pilotId, refPart.id, "director@block-street.local", "desktop", 0);
      }

      const { issue: p2Issue } = await post(`/api/v1/pilots/${pilotId}/issues`, {
        severity: "P2",
        title: "Model mismatch — mission board terminology",
        description: "Reference operator expected 'Mission' label in navigation",
        issue_domain: "terminology",
        root_cause: "bad_label",
        workflow_id: workflowList[3]?.id,
      });
      await post(`/api/v1/pilot-issues/${p2Issue.id}/corrective-actions`, { action_type: "content_fix", owner: "director@block-street.local" });
      const retestSession = await runSession(workflowList[3]?.id ?? workflowList[0].id, pilotId, refPart.id, "director@block-street.local", "desktop", 0);
      await post(`/api/v1/pilot-issues/${p2Issue.id}/retests`, { new_session_id: retestSession.id, human_help_delta: -1 });

      await post(`/api/v1/pilots/${pilotId}/acceptance-gates`, { phase: "A" });
      await post(`/api/v1/pilots/${pilotId}/advance-phase`, {});

      const { cohort: internalCohort } = await post(`/api/v1/pilots/${pilotId}/cohorts`, {
        action: "create_cohort",
        name: "Trusted Internal Users",
        cohort_type: "internal_users",
      });
      const { participant: internalPart } = await post(`/api/v1/pilots/${pilotId}/cohorts`, {
        action: "add_participant",
        cohort_id: internalCohort.id,
        user_id: "organizer@block-street.local",
        role_id: "role-org-admin",
        experience_level: "experienced",
        device_profile: "mobile",
      });

      for (const wf of workflowList.slice(0, 3)) {
        await runSession(wf.id, pilotId, internalPart.id, "director@block-street.local", "mobile", 2);
      }

      const gateB = await post(`/api/v1/pilots/${pilotId}/acceptance-gates`, { phase: "B" });

      await post(`/api/v1/pilot-issues/${p2Issue.id}/corrective-actions`, { action_type: "onboarding_update", owner: "director@block-street.local" });
      const { participant: newPart } = await post(`/api/v1/pilots/${pilotId}/cohorts`, {
        action: "add_participant",
        cohort_id: internalCohort.id,
        user_id: "learner-wsa@block-street.local",
        role_id: "role-ws-admin",
        experience_level: "new",
        device_profile: "mobile",
      });
      for (const wf of workflowList.slice(0, 3)) {
        await runSession(wf.id, pilotId, newPart.id, "director@block-street.local", "mobile", 0);
      }

      await post(`/api/v1/pilots/${pilotId}/advance-phase`, {});
      await post(`/api/v1/pilots/${pilotId}/advance-phase`, {});

      const { participant: externalPart } = await post(`/api/v1/pilots/${pilotId}/cohorts`, {
        action: "add_participant",
        cohort_id: internalCohort.id,
        user_id: "student@example.com",
        role_id: "role-organizer",
        experience_level: "new",
        device_profile: "mobile",
      });
      await runSession(workflowList[0].id, pilotId, externalPart.id, "director@block-street.local", "mobile", 1);
      await runSession(workflowList[1].id, pilotId, externalPart.id, "director@block-street.local", "desktop", 0);

      const { issue: a11yIssue } = await post(`/api/v1/pilots/${pilotId}/issues`, {
        severity: "P3",
        title: "Accessibility — focus order on mobile onboarding",
        description: "Screen reader focus skips mission link",
        issue_domain: "accessibility",
        root_cause: "information_architecture",
      });
      await post(`/api/v1/pilot-issues/${a11yIssue.id}/corrective-actions`, { action_type: "product_fix", owner: "director@block-street.local" });

      await post(`/api/v1/pilots/${pilotId}/acceptance-gates`, { phase: "C" });
      await post(`/api/v1/pilots/${pilotId}/advance-phase`, {});

      for (const wf of workflowList) {
        await runSession(wf.id, pilotId, internalPart.id, "director@block-street.local", "desktop", 0);
      }

      await post(`/api/v1/pilots/${pilotId}/engineering-intervention`, {
        reason: "Session timeout during live mission workflow — technical defect",
      });
      const { issue: techIssue } = await post(`/api/v1/pilots/${pilotId}/issues`, {
        severity: "P2",
        title: "Session timeout during mission completion",
        description: "Engineering intervention required for timeout defect",
        issue_domain: "technical",
        root_cause: "technical_defect",
      });
      await post(`/api/v1/pilot-issues/${techIssue.id}/corrective-actions`, { action_type: "integration_repair", owner: "director@block-street.local" });
      const fixSession = await runSession(workflowList[3]?.id ?? workflowList[0].id, pilotId, internalPart.id, "director@block-street.local", "desktop", 0);
      await post(`/api/v1/pilot-issues/${techIssue.id}/retests`, { new_session_id: fixSession.id, human_help_delta: 0 });

      await post(`/api/v1/pilots/${pilotId}/acceptance-gates`, { phase: "D" });
      const { recommendation } = await post(`/api/v1/pilots/${pilotId}/launch-recommendation`, {});

      setMessage(
        `AC-191 acceptance complete: Phase A→D pilot · P2 model mismatch retested · Phase B gate ${gateB.gate?.status ?? "reviewed"} · ` +
          `Accessibility corrected · Engineering intervention classified · Launch: ${recommendation?.recommended_launch_scope ?? "recorded"} · ` +
          `Conditions: mass messaging restricted, AI draft-only.`
      );
      refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Acceptance demo failed.");
      refresh();
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "health", label: "Pilot Health" },
    { id: "programs", label: "Programs" },
    { id: "demo", label: "Acceptance Demo" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-rose-500 bg-rose-100">
        <p className="text-xs font-semibold uppercase text-rose-950">BUILD 9.6 · Pilot & Acceptance · PLT-001</p>
        <h2 className="mt-1 text-xl font-bold text-rose-950">{plt.productName}</h2>
        <p className="mt-2 text-sm text-rose-950">{plt.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-rose-900">
          {plt.requirementId} · {plt.acceptanceCriteria} · /api/v1/pilots
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-rose-800 text-white" : "bg-rose-50 text-rose-900"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-rose-300 bg-rose-50 p-3 text-xs text-rose-950">{message}</p>}

      {tab === "health" && health && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Active Programs", health.active_programs],
            ["Sessions Today", health.sessions_today],
            ["Workflow Success", `${health.workflow_success_rate}%`],
            ["Avg Human Help", health.average_human_help],
            ["H4 Takeovers", health.h4_takeovers],
            ["P0 Issues", health.p0_issues],
            ["P1 Issues", health.p1_issues],
            ["Retests Pending", health.retests_pending],
            ["Engineering Interventions", health.engineering_interventions],
            ["Launch Recs Pending", health.launch_recommendations_pending],
          ].map(([label, value]) => (
            <div key={String(label)} className="card border-rose-300 bg-white p-3">
              <p className="text-xs text-rose-700">{label}</p>
              <p className="text-lg font-bold text-rose-950">{value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "programs" && (
        <div className="space-y-2">
          {pilots.map((p) => (
            <div key={String(p.id)} className="card border-rose-200 p-3 text-xs text-rose-900">
              <p className="font-semibold">{String(p.name)}</p>
              <p>
                Phase {String(p.phase)} · {String(p.status)} · {String(p.risk_level)}
              </p>
            </div>
          ))}
          {pilots.length === 0 && <p className="text-xs text-rose-700">No pilot programs yet — run the acceptance demo.</p>}
        </div>
      )}

      {tab === "demo" && (
        <div className="space-y-3">
          <p className="text-sm text-rose-900">
            Run full AC-191 acceptance path: Phase A reference operators → P2 issue & retest → Phase B human-help threshold →
            Phase C external users → Phase D institutional pilot → engineering intervention → launch recommendation.
          </p>
          <button
            type="button"
            onClick={runAcceptanceDemo}
            className="rounded bg-rose-800 px-3 py-1 text-xs font-semibold text-white"
          >
            Run Acceptance Demo
          </button>
        </div>
      )}

      {tab === "audit" && (
        <div className="card max-h-64 overflow-auto border-rose-200 p-3">
          {audit.map((e) => (
            <p key={String(e.id)} className="text-xs text-rose-800">
              {String(e.timestamp)} · {String(e.action)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
