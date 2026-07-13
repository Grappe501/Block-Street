/**
 * CAE-11.12-W7 — Knowledge stewardship operations queues
 */
import { toIntelligenceContext } from "../intelligence/api-context";
import { knowledgeIntelligenceService } from "../intelligence";
import { DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "../ux/experience-context";
import { nowIso } from "../../../utils";

export type StewardWorkItem = {
  work_item_id: string;
  queue: string;
  title: string;
  priority: "low" | "medium" | "high" | "critical";
  entity_id_optional?: string;
  human_workload_rating: null;
  advisory_only: true;
};

export function buildStewardWorkQueue(institutionId: string): StewardWorkItem[] {
  const ctx = toIntelligenceContext({
    actor_human_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.actor_human_id,
    service_identity_id_optional: null,
    institution_id: institutionId,
    institution_membership_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.active_membership_id,
    initiative_id_optional: null,
    request_id: "steward-queue",
    correlation_id: "steward-queue",
    idempotency_key_optional: null,
    locale: "en",
    timezone: "America/Chicago",
    effective_permissions: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.permissions,
  });

  const items: StewardWorkItem[] = [];
  const health = knowledgeIntelligenceService.getHealth(ctx);

  if (health.review_due_count > 0) {
    items.push({
      work_item_id: `swi-review-due`,
      queue: "reviews_due",
      title: `${health.review_due_count} artifacts need review`,
      priority: "high",
      human_workload_rating: null,
      advisory_only: true,
    });
  }
  if (health.weak_evidence_count > 0) {
    items.push({
      work_item_id: `swi-weak-evidence`,
      queue: "weak_evidence",
      title: `${health.weak_evidence_count} artifacts have weak evidence`,
      priority: "medium",
      human_workload_rating: null,
      advisory_only: true,
    });
  }

  const gaps = knowledgeIntelligenceService.getGaps(ctx);
  for (const g of gaps) {
    items.push({
      work_item_id: `swi-gap-${g.gap_id}`,
      queue: "documentation_gaps",
      title: g.description,
      priority: g.impact === "high" ? "high" : "medium",
      human_workload_rating: null,
      advisory_only: true,
    });
  }

  return items;
}

export function buildStewardPortfolio(institutionId: string) {
  const queue = buildStewardWorkQueue(institutionId);
  return {
    institution_id: institutionId,
    generated_at: nowIso(),
    work_items: queue,
    steward_human_ranking: null,
    punitive_workload_score: null,
    advisory_only: true as const,
  };
}
