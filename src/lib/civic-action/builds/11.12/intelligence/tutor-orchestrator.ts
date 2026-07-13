/**
 * CAE-11.12-W6 — Explainable AI Tutor orchestrator
 */
import { caeId } from "../../../utils";
import type { KnowledgeApiContext } from "../api/contracts";
import { runKnowledgeTutorTurn } from "../api/tutor-service";
import type { TutorIntelligenceResponse } from "./contracts";
import type { KnowledgeIntelligenceContext } from "./api-context";
import { scoreToConfidence } from "./utils";

function toApiCtx(ctx: KnowledgeIntelligenceContext): KnowledgeApiContext {
  return {
    actor_human_id: ctx.actor_human_id,
    service_identity_id_optional: null,
    institution_id: ctx.institution_id,
    institution_membership_id: "intel",
    initiative_id_optional: ctx.initiative_id_optional ?? null,
    request_id: ctx.request_id,
    correlation_id: ctx.correlation_id,
    idempotency_key_optional: null,
    locale: ctx.locale,
    timezone: ctx.timezone,
    effective_permissions: ctx.permissions,
  };
}

export function runExplainableTutorTurn(
  ctx: KnowledgeIntelligenceContext,
  input: {
    learner_question: string;
    course_id?: string;
    lesson_id?: string;
    protected_assessment_active?: boolean;
    teaching_strategy?: string;
  }
): TutorIntelligenceResponse {
  const w5 = runKnowledgeTutorTurn(toApiCtx(ctx), {
    learner_question: input.learner_question,
    course_id_optional: input.course_id,
    lesson_id_optional: input.lesson_id,
    protected_assessment_active: input.protected_assessment_active,
  });

  const strategy =
    input.teaching_strategy ??
    (input.learner_question.toLowerCase().includes("example") ? "scenario" : "direct_explanation");

  const responseEs =
    ctx.locale === "es"
      ? w5.answer
      : w5.answer;

  return {
    response: ctx.locale === "es" ? responseEs : w5.answer,
    teaching_strategy: strategy,
    source_references: w5.source_references.map((s) => ({
      signal_id: s.entity_id,
      source_type: s.entity_type,
      entity_id: s.entity_id,
      entity_type: s.entity_type,
      summary: s.title,
    })),
    canonical_versions: w5.source_references.map((s) => ({
      entity_id: s.entity_id,
      version: 1,
    })),
    confidence: scoreToConfidence(w5.confidence === "high" ? 0.85 : w5.confidence === "medium" ? 0.65 : 0.4),
    assumptions: ["Learner has authorized access to cited sources"],
    limitations: w5.limitations,
    practice_option: w5.cannot_answer_reason_optional ? null : "Try a practice quiz on this concept",
    recommended_next_step: w5.suggested_next_step,
    human_support_option: w5.cannot_answer_reason_optional ? "Contact instructor or knowledge steward" : null,
    cannot_answer_reason_optional: w5.cannot_answer_reason_optional,
    advisory_only: true,
    canonical_mutation_allowed: false,
  };
}

export function detectTutorEscalation(input: {
  confidence: string;
  conflicting_sources?: boolean;
  legal_or_safety?: boolean;
}): boolean {
  if (input.legal_or_safety) return true;
  if (input.conflicting_sources) return true;
  if (input.confidence === "speculative" || input.confidence === "low") return true;
  return false;
}
