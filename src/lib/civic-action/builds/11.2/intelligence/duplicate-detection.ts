/**
 * CAE-11.2-W6 — Duplicate objective detection (advisory)
 */
import { objectiveApplicationService } from "../application-service";
import type { DuplicateObjectiveCandidate, IntelligenceConfidence } from "./contracts";
import { jaccardSimilarity, scoreToConfidence, similarityLabel, tokenize } from "./utils";

function objectiveText(objectiveId: string) {
  const o = objectiveApplicationService.getObjective(objectiveId);
  if (!o) return null;
  const text = `${o.display_name} ${o.purpose} ${o.desired_future_state}`;
  return { name: o.display_name, tokens: tokenize(text), institution_id: o.institution_id, initiative_id: o.initiative_id };
}

export function detectDuplicateObjectives(
  institutionId: string,
  initiativeId?: string,
  minScore = 0.55
): DuplicateObjectiveCandidate[] {
  let ids = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId && o.lifecycle_state !== "archived")
    .map((o) => o.canonical_id);
  if (initiativeId) {
    ids = ids.filter((id) => objectiveApplicationService.getObjective(id)?.initiative_id === initiativeId);
  }

  const candidates: DuplicateObjectiveCandidate[] = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = objectiveText(ids[i]);
      const b = objectiveText(ids[j]);
      if (!a || !b) continue;

      const nameSim = jaccardSimilarity(tokenize(a.name), tokenize(b.name));
      const textSim = jaccardSimilarity(a.tokens, b.tokens);
      const score = nameSim * 0.4 + textSim * 0.6;
      if (score < minScore) continue;

      const confidence: IntelligenceConfidence = scoreToConfidence(score);
      const shared: string[] = [];
      if (nameSim > 0.5) shared.push("similar_name");
      if (textSim > 0.5) shared.push("similar_purpose");

      candidates.push({
        objective_id_a: ids[i],
        objective_id_b: ids[j],
        name_a: a.name,
        name_b: b.name,
        similarity_score: Math.round(score * 100) / 100,
        similarity_label: similarityLabel(score),
        shared_signals: shared,
        confidence,
        compare_href: `/initiatives/${a.initiative_id}/objectives/${ids[i]}?compare=${ids[j]}`,
      });
    }
  }
  return candidates.sort((x, y) => y.similarity_score - x.similarity_score);
}

export function duplicatesForObjective(objectiveId: string, institutionId: string) {
  const o = objectiveApplicationService.getObjective(objectiveId);
  if (!o) return [];
  return detectDuplicateObjectives(institutionId, o.initiative_id, 0.5).filter(
    (d) => d.objective_id_a === objectiveId || d.objective_id_b === objectiveId
  );
}
