import { loadIntelligenceSignals } from "../wave5/data";
import { getSignal, markSignalBenign, markSignalFalsePositive, triageSignal, updateSignalStatus } from "../wave5/signals";
import { openIdentityCase } from "../wave3/cases";
import { createWorkItem, listWorkItems } from "./queue";
import { recordOperationsAudit } from "./audit";
import { assertOperationalAuthority } from "./authority";

export function listIntelligenceSignalsForReview(filters?: { status?: string; institution_id?: string }) {
  let signals = loadIntelligenceSignals();
  if (filters?.status) signals = signals.filter((s) => s.status === filters.status);
  return signals
    .map((s) => ({
      ...s,
      advisory_label: "ADVISORY SIGNAL — not proof of wrongdoing",
      work_item_id: listWorkItems({ work_type: "intelligence_signal_review" }).find((w) => w.source_id === s.id)?.id ?? null,
    }))
    .sort((a, b) => b.priority - a.priority);
}

export function getIntelligenceSignalDetail(signalId: string) {
  const signal = getSignal(signalId);
  if (!signal) return null;
  const workItem = listWorkItems({ work_type: "intelligence_signal_review" }).find((w) => w.source_id === signalId);
  return {
    ...signal,
    advisory_label: "ADVISORY SIGNAL — not proof of wrongdoing",
    prohibited_automatic_actions: signal.prohibited_automatic_actions,
    work_item: workItem ?? null,
    recommended_actions: ["Human triage", "Mark benign if explainable", "Open governed case if adverse action needed"],
  };
}

export function triageIntelligenceSignal(signalId: string, operatorId: string) {
  assertOperationalAuthority(operatorId, "review_case", "Triage intelligence signal");
  const signal = triageSignal(signalId);
  const work = ensureSignalWorkItem(signal.id, signal.summary, signal.subject_human_ids[0], signal.institution_ids[0]);
  if (work.assigned_to_human_id !== operatorId) {
    const { assignWorkItem } = require("./queue") as typeof import("./queue");
    assignWorkItem(work.id, operatorId, operatorId);
  }
  recordOperationsAudit({
    event_type: "intelligence_signal_triaged",
    actor_human_id: operatorId,
    subject_human_id: signal.subject_human_ids[0] ?? null,
    institution_id: signal.institution_ids[0] ?? null,
    resource_type: "intelligence_signal",
    resource_id: signalId,
    summary: signal.summary,
    correlation_id: signalId,
  });
  return { signal, work_item_id: work.id };
}

export function markIntelligenceSignalBenign(signalId: string, operatorId: string, reason?: string) {
  assertOperationalAuthority(operatorId, "review_case", "Mark signal benign");
  const signal = markSignalBenign(signalId);
  const work = listWorkItems({ work_type: "intelligence_signal_review" }).find((w) => w.source_id === signalId);
  if (work) {
    const { completeWorkItem } = require("./queue") as typeof import("./queue");
    completeWorkItem(work.id, operatorId);
  }
  recordOperationsAudit({
    event_type: "intelligence_signal_benign",
    actor_human_id: operatorId,
    subject_human_id: signal.subject_human_ids[0] ?? null,
    institution_id: signal.institution_ids[0] ?? null,
    resource_type: "intelligence_signal",
    resource_id: signalId,
    summary: reason ?? "Marked benign after review",
    correlation_id: signalId,
  });
  return signal;
}

export function reportIntelligenceFalsePositive(signalId: string, operatorId: string, reason: string) {
  assertOperationalAuthority(operatorId, "review_case", "Report false positive");
  markSignalFalsePositive(signalId, operatorId, reason);
  const work = listWorkItems({ work_type: "intelligence_signal_review" }).find((w) => w.source_id === signalId);
  if (work) {
    const { completeWorkItem } = require("./queue") as typeof import("./queue");
    completeWorkItem(work.id, operatorId);
  }
  return getSignal(signalId);
}

export function openCaseFromIntelligenceSignal(signalId: string, operatorId: string) {
  assertOperationalAuthority(operatorId, "review_case", "Open case from signal");
  const signal = getSignal(signalId);
  if (!signal) throw new Error("Signal not found");

  const caseRecord = openIdentityCase({
    case_type: "verification_conflict",
    subject_human_id: signal.subject_human_ids[0] ?? operatorId,
    institution_id: signal.institution_ids[0] ?? "inst-block-street",
    reporting_human_id: operatorId,
    originating_event_id: signalId,
    summary: `Governed review opened from advisory signal: ${signal.signal_code}`,
  });

  updateSignalStatus(signalId, "identity_governance_referral");
  recordOperationsAudit({
    event_type: "intelligence_signal_case_opened",
    actor_human_id: operatorId,
    subject_human_id: caseRecord.subject_human_id,
    institution_id: caseRecord.institution_id,
    resource_type: "identity_case",
    resource_id: caseRecord.id,
    summary: `Case opened from signal ${signalId} — signal alone is not evidence`,
    correlation_id: signalId,
  });

  return { signal_id: signalId, case_id: caseRecord.id, advisory_note: "Adverse decision requires evidence beyond the signal." };
}

function ensureSignalWorkItem(signalId: string, summary: string, subjectId?: string, institutionId?: string) {
  const existing = listWorkItems({ work_type: "intelligence_signal_review" }).find((w) => w.source_id === signalId);
  if (existing) return existing;
  return createWorkItem({
    work_type: "intelligence_signal_review",
    source_type: "intelligence_signal",
    source_id: signalId,
    subject_human_id: subjectId,
    institution_id: institutionId,
    summary,
    severity: "review",
    required_authority: "identity_reviewer",
    advisory_signal: true,
    priority: 4,
  });
}

export function syncIntelligenceSignalsToQueue() {
  const signals = loadIntelligenceSignals().filter(
    (s) => ["generated", "pending_triage"].includes(s.status)
  );
  let created = 0;
  for (const s of signals) {
    const existing = listWorkItems({ work_type: "intelligence_signal_review" }).find((w) => w.source_id === s.id);
    if (!existing) {
      ensureSignalWorkItem(s.id, s.summary, s.subject_human_ids[0], s.institution_ids[0]);
      created++;
    }
  }
  return { synced: created };
}
