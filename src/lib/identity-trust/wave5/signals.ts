import { itlId, nowIso } from "../utils";
import type { IdentityIntelligenceAlert } from "../types";
import { loadIntelligenceSignals, persistIntelligenceSignals } from "./data";
import type { IdentityIntelligenceSignal, SignalConfidence, SignalSeverity } from "./types";
import { PROHIBITED_AUTOMATIC_ACTIONS, defaultSeverityPriority, getRuleByCode } from "./rules";

export function createSignal(input: {
  signal_code: string;
  signal_type: string;
  subject_human_ids: string[];
  institution_ids?: string[];
  severity: SignalSeverity;
  confidence: SignalConfidence;
  summary: string;
  supporting_features: string[];
  countervailing_features?: string[];
  known_limitations?: string[];
  rule_code: string;
}): IdentityIntelligenceSignal {
  const rule = getRuleByCode(input.rule_code);
  const signal: IdentityIntelligenceSignal = {
    id: itlId("iis"),
    signal_code: input.signal_code,
    signal_type: input.signal_type,
    subject_human_ids: input.subject_human_ids,
    institution_ids: input.institution_ids ?? [],
    severity: input.severity,
    confidence: input.confidence,
    priority: defaultSeverityPriority(input.severity),
    summary: input.summary,
    supporting_features: input.supporting_features,
    countervailing_features: input.countervailing_features ?? [],
    known_limitations: input.known_limitations ?? ["Signal describes observed pattern, not proven wrongdoing."],
    rule_id: rule?.id ?? null,
    rule_version: rule?.version ?? "1.0",
    generated_at: nowIso(),
    expires_at: new Date(Date.now() + 90 * 86400000).toISOString(),
    status: "generated",
    prohibited_automatic_actions: PROHIBITED_AUTOMATIC_ACTIONS,
  };

  const all = loadIntelligenceSignals();
  const dup = all.find(
    (s) =>
      s.signal_code === signal.signal_code &&
      s.status !== "closed" &&
      s.status !== "expired" &&
      s.subject_human_ids.join() === signal.subject_human_ids.join()
  );
  if (dup) return dup;

  all.push(signal);
  persistIntelligenceSignals(all);
  return signal;
}

export function listSignals(filters?: {
  status?: IdentityIntelligenceSignal["status"];
  severity?: SignalSeverity;
  institution_id?: string;
}) {
  let signals = loadIntelligenceSignals();
  if (filters?.status) signals = signals.filter((s) => s.status === filters.status);
  if (filters?.severity) signals = signals.filter((s) => s.severity === filters.severity);
  if (filters?.institution_id) signals = signals.filter((s) => s.institution_ids.includes(filters.institution_id!));
  return signals.sort((a, b) => b.priority - a.priority || b.generated_at.localeCompare(a.generated_at));
}

export function getSignal(signalId: string) {
  return loadIntelligenceSignals().find((s) => s.id === signalId) ?? null;
}

export function updateSignalStatus(
  signalId: string,
  status: IdentityIntelligenceSignal["status"]
): IdentityIntelligenceSignal {
  const signals = loadIntelligenceSignals();
  const idx = signals.findIndex((s) => s.id === signalId);
  if (idx < 0) throw new Error("Signal not found");
  signals[idx] = { ...signals[idx], status };
  persistIntelligenceSignals(signals);
  return signals[idx];
}

export function triageSignal(signalId: string): IdentityIntelligenceSignal {
  return updateSignalStatus(signalId, "pending_triage");
}

export function markSignalBenign(signalId: string): IdentityIntelligenceSignal {
  return updateSignalStatus(signalId, "benign");
}

export function markSignalFalsePositive(signalId: string, reviewedBy: string, reason: string) {
  const { loadSignalFalsePositives, persistSignalFalsePositives } = require("./data") as typeof import("./data");
  updateSignalStatus(signalId, "false_positive");
  const fp = {
    id: itlId("isfp"),
    signal_id: signalId,
    review_outcome: "false_positive",
    false_positive_reason: reason,
    reviewed_by: reviewedBy,
    recorded_at: nowIso(),
  };
  const all = loadSignalFalsePositives();
  all.push(fp);
  persistSignalFalsePositives(all);
  return fp;
}

export function closeSignal(signalId: string): IdentityIntelligenceSignal {
  return updateSignalStatus(signalId, "closed");
}

const SIGNAL_TO_ALERT: Record<string, IdentityIntelligenceAlert["alert_type"]> = {
  "DUP-POSSIBLE-MATCH": "duplicate_identity",
  "SPN-VELOCITY": "mass_invitation",
  "INV-PROVISIONAL-CLUSTER": "fraud_ring",
  "VER-RECIPROCAL-PAIR": "trust_anomaly",
  "VER-DISPUTE-RATE": "trust_anomaly",
};

export function toLegacyAlert(signal: IdentityIntelligenceSignal): IdentityIntelligenceAlert {
  const severity: IdentityIntelligenceAlert["severity"] =
    signal.severity === "SI-5" || signal.severity === "SI-4"
      ? "critical"
      : signal.severity === "SI-3"
        ? "warning"
        : "info";
  const status: IdentityIntelligenceAlert["status"] =
    signal.status === "closed" || signal.status === "benign" || signal.status === "false_positive"
      ? "resolved"
      : signal.status === "under_review"
        ? "investigating"
        : "open";

  return {
    id: signal.id,
    alert_type: SIGNAL_TO_ALERT[signal.signal_code] ?? "trust_anomaly",
    severity,
    subject_user_ids: signal.subject_human_ids,
    explanation: signal.summary,
    ai_recommendation: `Human triage required. ${signal.prohibited_automatic_actions[0]}`,
    requires_human_action: true,
    created_at: signal.generated_at,
    status,
  };
}
