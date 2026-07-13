/**
 * CAE-11.12-W7 — Institutional learning maturity (systems only — not Human scoring)
 */
import { listImprovementCandidates, listImprovementProposals, listImprovementPilots } from "./improvement-governance";
import { listImprovementOutcomes } from "./outcome-measurement";
import { listWisdomArtifacts } from "./institutional-wisdom";
import type { KnowledgeMaturityLevel } from "./contracts";

export function measureKnowledgeMaturity(institutionId: string) {
  const candidates = listImprovementCandidates(institutionId).length;
  const proposals = listImprovementProposals(institutionId).length;
  const pilots = listImprovementPilots(institutionId).length;
  const outcomes = listImprovementOutcomes(institutionId).length;
  const wisdom = listWisdomArtifacts(institutionId).length;

  let level: KnowledgeMaturityLevel = "fragmented";
  let score = 20;
  if (candidates > 0) {
    level = "documented";
    score = 35;
  }
  if (proposals > 0) {
    level = "governed";
    score = 50;
  }
  if (pilots > 0) {
    level = "connected";
    score = 65;
  }
  if (outcomes > 0) {
    level = "evidence_driven";
    score = 80;
  }
  if (wisdom > 0 && outcomes > 0) {
    level = "institutionally_wise";
    score = 90;
  }

  return {
    institution_id: institutionId,
    level,
    score,
    dimensions: {
      evidence: outcomes > 0,
      stewardship: candidates > 0,
      pilots: pilots > 0,
      wisdom: wisdom > 0,
      continuous_improvement: proposals > 0,
    },
    human_ranking: null,
    individual_scores: null,
    advisory_only: true as const,
  };
}

export function measureInstitutionalLearningHealth(institutionId: string) {
  const maturity = measureKnowledgeMaturity(institutionId);
  const outcomes = listImprovementOutcomes(institutionId);
  const improved = outcomes.filter((o) => o.outcome_category === "improved").length;
  const rolledBack = outcomes.filter((o) => o.outcome_category === "rolled_back").length;

  return {
    institution_id: institutionId,
    maturity_level: maturity.level,
    improvement_success_rate: outcomes.length ? improved / outcomes.length : 0,
    rollback_count: rolledBack,
    lesson_adoption_signals: listWisdomArtifacts(institutionId).length,
    human_performance_scores: null,
    advisory_only: true as const,
  };
}
