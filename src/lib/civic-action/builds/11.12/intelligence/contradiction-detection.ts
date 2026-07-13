/**
 * CAE-11.12-W6 — Contradiction detection (advisory)
 */
import { caeId } from "../../../utils";
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeIntelligenceContext } from "./api-context";
import { filterArtifactsByPermission } from "./semantic-retrieval";

export function detectKnowledgeContradictions(ctx: KnowledgeIntelligenceContext) {
  const artifacts = filterArtifactsByPermission(ctx);
  const conflicts: {
    conflict_id: string;
    artifact_ids: string[];
    reason: string;
    confidence: string;
    human_review_required: true;
    advisory_only: true;
  }[] = [];

  const byDomain = new Map<string, typeof artifacts>();
  for (const a of artifacts) {
    const full = knowledgeApplicationService.getArtifact(a.id);
    if (!full) continue;
    const key = full.domain_id;
    const list = byDomain.get(key) ?? [];
    list.push(a);
    byDomain.set(key, list);
  }

  for (const [, group] of byDomain) {
    const published = group.filter((g) => g.lifecycle_state === "published" || g.lifecycle_state === "operational");
    if (published.length >= 2) {
      conflicts.push({
        conflict_id: caeId("kcf"),
        artifact_ids: published.map((p) => p.id),
        reason: "Multiple current artifacts in same domain — potential conflicting guidance",
        confidence: "medium",
        human_review_required: true,
        advisory_only: true,
      });
    }
  }

  return conflicts;
}
