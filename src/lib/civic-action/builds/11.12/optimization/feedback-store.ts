/**
 * CAE-11.12-W7 — Optimization feedback store (separate from W6 intelligence feedback)
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";

export type OptimizationFeedbackAction =
  | "accepted"
  | "rejected"
  | "modified"
  | "deferred"
  | "already_implemented"
  | "not_applicable";

export type OptimizationFeedbackRecord = {
  feedback_id: string;
  optimization_id: string;
  action: OptimizationFeedbackAction;
  actor_human_id: string;
  institution_id: string;
  recorded_at: string;
  notes_optional?: string;
};

const KEY = "knowledge_optimization_feedback";

export function recordOptimizationFeedback(input: {
  optimization_id: string;
  action: OptimizationFeedbackAction;
  actor_human_id: string;
  institution_id: string;
  notes_optional?: string;
}): OptimizationFeedbackRecord {
  const entry: OptimizationFeedbackRecord = {
    feedback_id: caeId("kofb"),
    optimization_id: input.optimization_id,
    action: input.action,
    actor_human_id: input.actor_human_id,
    institution_id: input.institution_id,
    recorded_at: nowIso(),
    notes_optional: input.notes_optional,
  };
  const rows = readStoreSlice<OptimizationFeedbackRecord>(KEY);
  rows.push(entry);
  writeStoreSlice(KEY, rows);
  return entry;
}

export function isOptimizationRejected(optimizationId: string, institutionId: string): boolean {
  return readStoreSlice<OptimizationFeedbackRecord>(KEY).some(
    (f) =>
      f.optimization_id === optimizationId &&
      f.institution_id === institutionId &&
      (f.action === "rejected" || f.action === "not_applicable")
  );
}

export function listOptimizationFeedback(institutionId: string, limit = 100) {
  return readStoreSlice<OptimizationFeedbackRecord>(KEY)
    .filter((f) => f.institution_id === institutionId)
    .slice(-limit);
}
