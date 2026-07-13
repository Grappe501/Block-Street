/**
 * CAE-11.12-W7 — Certification evolution (historical integrity preserved)
 */
import { toIntelligenceContext } from "../intelligence/api-context";
import { evaluateCertificationReadiness, forecastCertificationExpirations } from "../intelligence/certification-readiness";
import { DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "../ux/experience-context";
import type { KnowledgeOptimization } from "./contracts";
import { nowIso } from "../../../utils";

export function generateCertificationEvolutionProposals(institutionId: string): KnowledgeOptimization[] {
  const ctx = toIntelligenceContext({
    actor_human_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.actor_human_id,
    service_identity_id_optional: null,
    institution_id: institutionId,
    institution_membership_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.active_membership_id,
    initiative_id_optional: null,
    request_id: "cert-evo",
    correlation_id: "cert-evo",
    idempotency_key_optional: null,
    locale: "en",
    timezone: "America/Chicago",
    effective_permissions: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.permissions,
  });

  const recs: KnowledgeOptimization[] = [];
  const expiring = forecastCertificationExpirations(ctx);

  for (const e of expiring) {
    recs.push({
      optimization_id: `crt-exp-${e.award_id}`,
      category: "certification_revision",
      title: "Certification renewal review",
      what_changed: `Award ${e.award_id} expires ${e.expires_at}`,
      why: "Renewal governance must preserve historical credential integrity.",
      confidence: "high",
      evidence: [{ signal_id: e.award_id, source: "award", summary: e.expires_at ?? "" }],
      expected_benefit: "Timely renewal without invalidating prior awards.",
      potential_risk: "Transition policy required for requirement changes.",
      who_should_review: "Issuing authority",
      suggested_action: e.recommendation,
      domain_command_required: null,
      human_approval_required: true,
      advisory_only: true,
      generated_at: nowIso(),
    });
  }

  return recs;
}

export function certificationChangePolicy() {
  return {
    effective_date_required: true,
    grandfathering_required: true,
    historical_record_preserved: true,
    earned_credential_integrity: "Prior award conditions remain historically valid",
    ai_can_award: false,
  };
}
