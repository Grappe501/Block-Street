/**
 * CAE-11.12-W6 — Recommendation feedback store (non-mutating to domain)
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { RecommendationFeedbackAction } from "./contracts";

const KEY = "knowledge_intelligence_feedback";

export type IntelligenceFeedback = {
  feedback_id: string;
  recommendation_id: string;
  action: RecommendationFeedbackAction;
  actor_human_id: string;
  institution_id: string;
  reason_optional?: string;
  recorded_at: string;
};

export function recordIntelligenceFeedback(input: {
  recommendation_id: string;
  action: RecommendationFeedbackAction;
  actor_human_id: string;
  institution_id: string;
  reason_optional?: string;
}): IntelligenceFeedback {
  const entry: IntelligenceFeedback = {
    feedback_id: caeId("kfb"),
    recommendation_id: input.recommendation_id,
    action: input.action,
    actor_human_id: input.actor_human_id,
    institution_id: input.institution_id,
    reason_optional: input.reason_optional,
    recorded_at: nowIso(),
  };
  const rows = readStoreSlice<IntelligenceFeedback>(KEY);
  rows.push(entry);
  writeStoreSlice(KEY, rows);
  return entry;
}

export function isRecommendationDismissed(recommendationId: string, actorHumanId: string): boolean {
  return readStoreSlice<IntelligenceFeedback>(KEY).some(
    (f) =>
      f.recommendation_id === recommendationId &&
      f.actor_human_id === actorHumanId &&
      (f.action === "dismissed" || f.action === "not_helpful" || f.action === "incorrect")
  );
}
