/**
 * CAE-11.12-W5 — Analytics projection (derived only)
 */
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { KnowledgeEventOutboxRecord } from "../services/events";

export type KnowledgeAnalyticsCounter = {
  institution_id: string;
  metric: string;
  count: number;
  updated_at: string;
};

const ANALYTICS_KEY = "knowledge_analytics_counters";

const COUNTED_EVENTS: Record<string, string> = {
  "knowledge.learning_completed": "course_completions",
  "knowledge.certification_awarded": "certifications_awarded",
  "knowledge.artifact_published": "artifacts_published",
  "knowledge.competency_verified": "competencies_verified",
};

export function projectKnowledgeAnalytics(record: KnowledgeEventOutboxRecord) {
  const metric = COUNTED_EVENTS[record.event_type];
  if (!metric) return null;
  const institutionId = (record.payload.institution_id as string) ?? "";
  const counters = readStoreSlice<KnowledgeAnalyticsCounter>(ANALYTICS_KEY);
  const existing = counters.find((c) => c.institution_id === institutionId && c.metric === metric);
  if (existing) {
    existing.count += 1;
    existing.updated_at = record.occurred_at;
  } else {
    counters.push({
      institution_id: institutionId,
      metric,
      count: 1,
      updated_at: record.occurred_at,
    });
  }
  writeStoreSlice(ANALYTICS_KEY, counters);
  return { metric, institution_id: institutionId };
}
