/**
 * CAE-11.7-W6 — Recommendation feedback store (non-mutating to domain)
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { RecommendationFeedback, RecommendationFeedbackAction } from "./contracts";

const KEY = "communication_intelligence_feedback";

export function recordRecommendationFeedback(input: {
  recommendation_id: string;
  action: RecommendationFeedbackAction;
  actor_human_id: string;
  institution_id: string;
  notes_optional?: string;
}): RecommendationFeedback {
  const entry: RecommendationFeedback = {
    feedback_id: caeId("cfb"),
    recommendation_id: input.recommendation_id,
    action: input.action,
    actor_human_id: input.actor_human_id,
    institution_id: input.institution_id,
    recorded_at: nowIso(),
    notes_optional: input.notes_optional,
  };
  const rows = readStoreSlice<RecommendationFeedback>(KEY);
  rows.push(entry);
  writeStoreSlice(KEY, rows);
  return entry;
}

export function isRecommendationDismissed(recommendationId: string, actorHumanId: string): boolean {
  return readStoreSlice<RecommendationFeedback>(KEY).some(
    (f) =>
      f.recommendation_id === recommendationId &&
      f.actor_human_id === actorHumanId &&
      (f.action === "dismiss" || f.action === "not_relevant" || f.action === "wrong")
  );
}
