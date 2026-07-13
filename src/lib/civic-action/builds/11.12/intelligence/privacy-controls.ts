/**
 * CAE-11.12-W6 — Intelligence privacy controls
 */
import type { KnowledgeIntelligenceContext } from "./api-context";

const PROHIBITED_INFERENCES = [
  "political_belief",
  "health_condition",
  "loyalty_score",
  "trust_score",
  "psychological_profile",
  "social_credit",
] as const;

export function validatePrivacyContext(ctx: KnowledgeIntelligenceContext, purpose: string) {
  const violations: string[] = [];
  const p = purpose.toLowerCase();
  for (const inf of PROHIBITED_INFERENCES) {
    if (p.includes(inf.replace(/_/g, " "))) violations.push(`Prohibited inference: ${inf}`);
  }
  return {
    allowed: violations.length === 0,
    violations,
    purpose_limitation: "Minimum necessary data for stated purpose only",
    cross_institution_blocked: true,
    institution_id: ctx.institution_id,
    advisory_only: true as const,
  };
}

export function filterSensitiveTraitsFromOutput<T extends Record<string, unknown>>(output: T): T {
  const blocked = ["trust_score", "loyalty_score", "human_ranking", "leaderboard", "social_credit"];
  const copy = { ...output };
  for (const key of blocked) {
    if (key in copy) delete copy[key];
  }
  return copy;
}
