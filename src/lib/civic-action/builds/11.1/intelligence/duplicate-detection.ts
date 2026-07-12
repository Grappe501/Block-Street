/**
 * CAE-11.1-W6 — Duplicate initiative detection (advisory)
 */
import { initiativeApplicationService } from "../services/application-service";
import type { DuplicateCandidate, IntelligenceConfidence } from "./contracts";
import { jaccardSimilarity, scoreToConfidence, similarityLabel, tokenize } from "./utils";

function initiativeText(initiativeId: string): { name: string; tokens: Set<string>; institution_id: string } | null {
  const agg = initiativeApplicationService.getAggregate(initiativeId);
  if (!agg) return null;
  const purpose = agg.charter?.purpose || agg.charter?.problem_statement || "";
  const scope = agg.scope?.functional_scope || "";
  const text = `${agg.initiative.initiative_name} ${purpose} ${scope}`;
  return {
    name: agg.initiative.initiative_name,
    tokens: tokenize(text),
    institution_id: agg.initiative.institution_id,
  };
}

export function detectDuplicateCandidates(institutionId: string, minScore = 0.55): DuplicateCandidate[] {
  const ids = initiativeApplicationService
    .listInitiativeIds()
    .filter((id) => {
      const agg = initiativeApplicationService.getAggregate(id);
      return agg && agg.initiative.institution_id === institutionId && agg.initiative.status !== "archived";
    });

  const candidates: DuplicateCandidate[] = [];

  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = initiativeText(ids[i]);
      const b = initiativeText(ids[j]);
      if (!a || !b) continue;

      const nameSim = jaccardSimilarity(tokenize(a.name), tokenize(b.name));
      const textSim = jaccardSimilarity(a.tokens, b.tokens);
      const score = nameSim * 0.4 + textSim * 0.6;
      if (score < minScore) continue;

      const confidence: IntelligenceConfidence = scoreToConfidence(score);
      const shared: string[] = [];
      if (nameSim > 0.5) shared.push("similar_name");
      if (textSim > 0.5) shared.push("similar_purpose_or_scope");

      candidates.push({
        initiative_id_a: ids[i],
        initiative_id_b: ids[j],
        name_a: a.name,
        name_b: b.name,
        similarity_score: Math.round(score * 100) / 100,
        similarity_label: similarityLabel(score),
        shared_signals: shared,
        confidence,
        compare_href: `/initiatives/${ids[i]}?compare=${ids[j]}`,
      });
    }
  }

  return candidates.sort((x, y) => y.similarity_score - x.similarity_score);
}

export function duplicatesForInitiative(initiativeId: string, institutionId: string): DuplicateCandidate[] {
  return detectDuplicateCandidates(institutionId).filter(
    (d) => d.initiative_id_a === initiativeId || d.initiative_id_b === initiativeId
  );
}

export function formatDuplicateMessage(candidate: DuplicateCandidate): string {
  return `These two Initiatives appear ${candidate.similarity_label}. Would you like to compare them?`;
}

export function formatDuplicateMessageEs(candidate: DuplicateCandidate): string {
  const pct = Math.round(candidate.similarity_score * 100);
  return `Estas dos iniciativas parecen ${pct}% similares. ¿Quieres compararlas?`;
}
