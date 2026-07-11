"use client";

import { useEffect, useState } from "react";
import trn from "../../../data/registry/training-certification.json";
import type { TrainingHealth } from "@/lib/training/types";

type Tab = "health" | "paths" | "demo" | "audit";

const LESSON_IDS = [
  "les-wsa-1",
  "les-wsa-2",
  "les-wsa-3",
  "les-wsa-4",
  "les-wsa-5",
  "les-wsa-6",
  "les-wsa-7",
];

const LEARNER_ID = "learner-wsa@block-street.local";
const FAIL_LEARNER_ID = "learner-fail@block-street.local";
const PATH_ID = "lp-workspace-admin";
const ASSESSMENT_ID = "asm-wsa-practical";
const CERT_ID = "cert-workspace-admin";

export function AdminInstitutionalTraining() {
  const [tab, setTab] = useState<Tab>("health");
  const [health, setHealth] = useState<TrainingHealth | null>(null);
  const [institutionId, setInstitutionId] = useState<string | null>(null);
  const [paths, setPaths] = useState<Record<string, unknown>[]>([]);
  const [certifications, setCertifications] = useState<Record<string, unknown>[]>([]);
  const [audit, setAudit] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  function refresh() {
    fetch("/api/admin/training/overview")
      .then((r) => r.json())
      .then((d) => {
        setHealth(d.health ?? null);
        setInstitutionId(d.institution_id ?? null);
        setPaths(d.learning_paths ?? []);
        setCertifications(d.certifications ?? []);
        setAudit(d.audit ?? []);
      });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function runAcceptanceDemo() {
    if (!institutionId) return;
    setMessage(null);

    const assignRes = await fetch("/api/v1/training/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: LEARNER_ID,
        learning_path_id: PATH_ID,
        institution_id: institutionId,
        reason: "role_requirement",
      }),
    });
    const assignData = await assignRes.json();
    if (!assignRes.ok) {
      setMessage(assignData.error?.message ?? "Assignment failed.");
      return;
    }
    const learnerRecordId = assignData.data?.learner_record?.id as string;

    for (const lessonId of LESSON_IDS) {
      await fetch(`/api/v1/training/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learner_record_id: learnerRecordId }),
      });
    }

    const wsRes = await fetch("/api/v1/training/practice-workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        learning_path_id: PATH_ID,
        institution_id: institutionId,
        user_id: LEARNER_ID,
      }),
    });
    const wsData = await wsRes.json();
    const workspaceId = wsData.data?.workspace?.id as string;

    const guidedRes = await fetch("/api/v1/training/scenarios/guided_role_assignment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "start",
        user_id: LEARNER_ID,
        workspace_id: workspaceId,
        mode: "guided",
      }),
    });
    const guidedData = await guidedRes.json();
    const guidedAttemptId = guidedData.data?.attempt?.id as string;
    await fetch("/api/v1/training/scenarios/guided_role_assignment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "complete",
        attempt_id: guidedAttemptId,
        actions: ["invite_user", "assign_role", "review_permissions"],
        errors: 0,
        hints_used: 1,
        human_help_count: 0,
      }),
    });

    const indepRes = await fetch("/api/v1/training/scenarios/independent_administration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "start",
        user_id: LEARNER_ID,
        workspace_id: workspaceId,
        mode: "independent",
      }),
    });
    const indepData = await indepRes.json();
    const indepAttemptId = indepData.data?.attempt?.id as string;
    await fetch("/api/v1/training/scenarios/independent_administration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "complete",
        attempt_id: indepAttemptId,
        actions: ["invite_user", "assign_role", "revoke_session", "audit_summary"],
        errors: 0,
        hints_used: 0,
        human_help_count: 0,
      }),
    });

    const asmRes = await fetch(`/api/v1/training/assessments/${ASSESSMENT_ID}/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: LEARNER_ID, evidence_reference: "practical-demonstration" }),
    });
    const asmData = await asmRes.json();
    const attemptId = asmData.data?.attempt?.id as string;

    await fetch(`/api/v1/training/assessment-attempts/${attemptId}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passed: true, rubric_notes: "All criteria met — scope, approval path, no restricted fields." }),
    });

    const certRes = await fetch(`/api/v1/training/certifications/${CERT_ID}/issue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: LEARNER_ID,
        institution_id: institutionId,
        evidence_reference: "assessment-passed",
      }),
    });
    if (!certRes.ok) {
      const certErr = await certRes.json();
      setMessage(certErr.error?.message ?? "Certification issuance failed.");
      refresh();
      return;
    }

    const failAssign = await fetch("/api/v1/training/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: FAIL_LEARNER_ID,
        learning_path_id: PATH_ID,
        institution_id: institutionId,
        reason: "remediation_demo",
      }),
    });
    const failData = await failAssign.json();
    const failRecordId = failData.data?.learner_record?.id as string;
    for (const lessonId of LESSON_IDS) {
      await fetch(`/api/v1/training/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learner_record_id: failRecordId }),
      });
    }
    const failAsm = await fetch(`/api/v1/training/assessments/${ASSESSMENT_ID}/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: FAIL_LEARNER_ID }),
    });
    const failAsmData = await failAsm.json();
    const failAttemptId = failAsmData.data?.attempt?.id as string;
    await fetch(`/api/v1/training/assessment-attempts/${failAttemptId}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passed: false, rubric_notes: "Incorrect scope selection — remediation assigned." }),
    });

    const selfIssue = await fetch(`/api/v1/training/certifications/${CERT_ID}/issue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "director@block-street.local",
        institution_id: institutionId,
      }),
    });

    const certData = await certRes.json();
    const awardId = certData.data?.award?.id as string;
    if (awardId) {
      await fetch(`/api/v1/training/certification-awards/${awardId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Documented policy violation — access review triggered." }),
      });
    }

    const selfIssueDenied = !selfIssue.ok;
    setMessage(
      `AC-190 acceptance complete: Workspace Admin path → lessons → practice → assessment → certification issued. ` +
        `Eligibility for workspaces.manage granted (role assignment still required). ` +
        `Failed learner remediation assigned. Self-issue ${selfIssueDenied ? "denied" : "unexpected"}. ` +
        `Certification suspended with audit.`
    );
    refresh();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "health", label: "Training Health" },
    { id: "paths", label: "Learning Paths" },
    { id: "demo", label: "Acceptance Demo" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-6">
      <div className="card border-violet-500 bg-violet-100">
        <p className="text-xs font-semibold uppercase text-violet-950">BUILD 9.5 · Training & Certification · TRN-001</p>
        <h2 className="mt-1 text-xl font-bold text-violet-950">{trn.productName}</h2>
        <p className="mt-2 text-sm text-violet-950">{trn.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-violet-900">
          {trn.requirementId} · {trn.acceptanceCriteria} · /api/v1/training
        </p>
      </div>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? "bg-violet-800 text-white" : "bg-violet-50 text-violet-900"}`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {message && <p className="card border-violet-300 bg-violet-50 p-3 text-xs text-violet-950">{message}</p>}

      {tab === "health" && health && (
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Assigned Learners", health.assigned_learners],
            ["In Progress", health.in_progress],
            ["Completed", health.completed],
            ["Overdue", health.overdue],
            ["Assessment Pass Rate", `${health.assessment_pass_rate}%`],
            ["Active Certifications", health.active_certifications],
            ["Expiring in 60 Days", health.expiring_in_60_days],
            ["Human Help / Learner", health.human_help_per_learner],
          ].map(([label, value]) => (
            <div key={String(label)} className="card border-violet-300 bg-white p-3">
              <p className="text-xs text-violet-700">{label}</p>
              <p className="text-lg font-bold text-violet-950">{value}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "paths" && (
        <div className="space-y-2">
          <p className="text-xs text-violet-800">{paths.length} learning paths · {certifications.length} certification definitions</p>
          {paths.map((p) => (
            <div key={String(p.id)} className="card border-violet-200 p-3 text-xs text-violet-900">
              <p className="font-semibold">{String(p.name)}</p>
              <p>{String(p.description)}</p>
              <p className="mt-1 text-violet-700">
                Role: {String(p.target_role_key ?? "—")} · Permission: {String(p.target_permission_key ?? "—")}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "demo" && (
        <div className="space-y-3">
          <p className="text-sm text-violet-900">
            Run full AC-190 acceptance path: assign Workspace Administrator path → complete lessons → practice scenarios →
            practical assessment → qualified evaluator → certification → remediation → self-issue denial → suspension.
          </p>
          <button
            type="button"
            onClick={runAcceptanceDemo}
            className="rounded bg-violet-800 px-3 py-1 text-xs font-semibold text-white"
          >
            Run Acceptance Demo
          </button>
        </div>
      )}

      {tab === "audit" && (
        <div className="card max-h-64 overflow-auto border-violet-200 p-3">
          {audit.map((e) => (
            <p key={String(e.id)} className="text-xs text-violet-800">
              {String(e.timestamp)} · {String(e.action)} · {String(e.target_type)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
