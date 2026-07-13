/**
 * CAE-11.12-W6 — Certification readiness intelligence (advisory)
 */
import { knowledgeApplicationService } from "../application-service";
import type { KnowledgeIntelligenceContext } from "./api-context";

export function evaluateCertificationReadiness(
  ctx: KnowledgeIntelligenceContext,
  certificationId: string
) {
  const certification = knowledgeApplicationService
    .listCertifications(ctx.institution_id)
    .find((c) => c.canonical_id === certificationId);
  if (!certification) {
    return {
      current_status: "not_found",
      requirements_satisfied: [] as string[],
      requirements_remaining: ["Certification not found"],
      confidence: "low",
      authority_required: "Authorized certifier via Wave 3 AwardCertification command",
      can_award: false,
      advisory_only: true as const,
    };
  }

  const awards = knowledgeApplicationService.listCertificationAwards(
    ctx.institution_id,
    ctx.actor_human_id
  );
  const existing = awards.find(
    (a) => a.certification_id === certificationId && a.lifecycle_state === "awarded"
  );
  if (existing) {
    return {
      current_status: "already_awarded",
      requirements_satisfied: ["Credential already awarded"],
      requirements_remaining: [] as string[],
      expiring_requirements: existing.expires_at ? [`Expires ${existing.expires_at}`] : [],
      recommended_next_steps: existing.expires_at ? ["Plan renewal review"] : [],
      confidence: "high",
      authority_required: "Renewal requires governed command",
      can_award: false,
      advisory_only: true as const,
    };
  }

  const competencies = knowledgeApplicationService.listCompetencyRecords(
    ctx.institution_id,
    ctx.actor_human_id
  );
  const verified = competencies.filter((c) => c.lifecycle_state === "verified").length;

  return {
    current_status: verified > 0 ? "partially_ready" : "development_needed",
    requirements_satisfied: verified > 0 ? [`${verified} verified competencies`] : [],
    requirements_remaining: [
      "Complete eligibility evaluation via command API",
      "Satisfy all certification requirements through authorized review",
    ],
    recommended_next_steps: [
      "POST /api/v1/certifications/commands EvaluateCertificationEligibility",
      "Complete missing learning and competency verification",
    ],
    estimated_path: "Learning → competency verification → eligibility → Human award",
    confidence: verified > 0 ? "medium" : "low",
    authority_required: "Authorized certifier — AI cannot award",
    can_award: false,
    advisory_only: true as const,
  };
}

export function forecastCertificationExpirations(ctx: KnowledgeIntelligenceContext, daysAhead = 30) {
  const awards = knowledgeApplicationService.listCertificationAwards(ctx.institution_id);
  const cutoff = Date.now() + daysAhead * 24 * 60 * 60 * 1000;
  return awards
    .filter((a) => a.expires_at && new Date(a.expires_at).getTime() <= cutoff)
    .map((a) => ({
      award_id: a.canonical_id,
      human_id: a.human_id,
      expires_at: a.expires_at,
      recommendation: "Create renewal review queue — no direct award mutation",
      advisory_only: true as const,
    }));
}
