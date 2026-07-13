/**
 * CAE-11.12-W6 — Human review routing for intelligence outputs
 */
import { caeId } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { IntelligenceConfidence, IntelligenceResult } from "./contracts";

const KEY = "knowledge_intelligence_review_queue";

export type IntelligenceReviewItem = {
  review_id: string;
  intelligence_result_id: string;
  reason: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "assigned" | "resolved";
  institution_id: string;
};

export function shouldRouteToHumanReview(input: {
  confidence: IntelligenceConfidence;
  conflicting_evidence?: string[];
  legal_or_safety?: boolean;
  affects_human_opportunity?: boolean;
}): boolean {
  if (input.legal_or_safety) return true;
  if (input.affects_human_opportunity) return true;
  if (input.conflicting_evidence && input.conflicting_evidence.length > 0) return true;
  if (input.confidence === "low" || input.confidence === "speculative") return true;
  return false;
}

export function enqueueIntelligenceReview(
  result: IntelligenceResult,
  reason: string,
  priority: IntelligenceReviewItem["priority"] = "medium"
): IntelligenceReviewItem {
  const item: IntelligenceReviewItem = {
    review_id: caeId("irq"),
    intelligence_result_id: result.intelligence_result_id,
    reason,
    priority,
    status: "pending",
    institution_id: result.request_id.split("-")[0] ?? "unknown",
  };
  const rows = readStoreSlice<IntelligenceReviewItem>(KEY);
  rows.push(item);
  writeStoreSlice(KEY, rows);
  return item;
}
