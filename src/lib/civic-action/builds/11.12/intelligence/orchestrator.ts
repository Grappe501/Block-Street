/**
 * CAE-11.12-W6 — Knowledge Intelligence Orchestrator
 */
import { caeId, nowIso } from "../../../utils";
import type { IntelligenceRequest, IntelligenceResult, IntelligenceResultState } from "./contracts";
import type { KnowledgeIntelligenceContext } from "./api-context";
import { buildIntelligenceRequest } from "./api-context";
import { recordEvidenceLedger } from "./evidence-ledger";
import { recordAIProvenance } from "./provenance";
import { shouldRouteToHumanReview, enqueueIntelligenceReview } from "./human-review-routing";
import { validatePrivacyContext, filterSensitiveTraitsFromOutput } from "./privacy-controls";
import { semanticKnowledgeQuery } from "./semantic-retrieval";
import { computeKnowledgeHealth } from "./quality-intelligence";
import { detectKnowledgeGaps } from "./gap-detection";
import { analyzeKnowledgeImpact, buildKnowledgeGraph } from "./graph-intelligence";
import { generateLearningRecommendations } from "./learning-recommendations";
import { recommendAdaptiveNextStep } from "./adaptive-learning";
import { computeCapabilityCoverage, evaluateRoleReadiness } from "./competency-intelligence";
import { evaluateCertificationReadiness } from "./certification-readiness";
import { synthesizeResearchEvidence } from "./research-intelligence";
import { queryInstitutionalMemory } from "./institutional-memory";
import { runExplainableTutorTurn } from "./tutor-orchestrator";
import { generateExecutiveKnowledgeBrief } from "./executive-brief";
import { runKnowledgeCopilotQuery } from "./copilot";
import { scoreToConfidence } from "./utils";

function baseResult(
  request: IntelligenceRequest,
  partial: Partial<IntelligenceResult> & Pick<IntelligenceResult, "answer_or_recommendation" | "result_state">
): IntelligenceResult {
  return {
    intelligence_result_id: caeId("int"),
    request_type: request.request_type,
    result_state: partial.result_state,
    answer_or_recommendation: partial.answer_or_recommendation,
    reasoning_summary: partial.reasoning_summary ?? "Derived from permission-filtered projections",
    evidence_references: partial.evidence_references ?? [],
    canonical_versions_used: partial.canonical_versions_used ?? [],
    confidence: partial.confidence ?? "medium",
    assumptions: partial.assumptions ?? ["Institution context verified server-side"],
    limitations: partial.limitations ?? ["Advisory intelligence — not canonical authority"],
    conflicting_evidence: partial.conflicting_evidence ?? [],
    freshness_status: partial.freshness_status ?? "current",
    human_review_required: partial.human_review_required ?? false,
    permitted_next_actions: partial.permitted_next_actions ?? ["Dismiss", "Request Human review", "Submit governed command"],
    generated_at: nowIso(),
    model_reference_optional: "deterministic-rules-v1",
    request_id: request.request_id,
    correlation_id: request.correlation_id,
    advisory_only: true,
    canonical_mutation_allowed: false,
    ai_generated: true,
  };
}

export function runKnowledgeIntelligence(
  ctx: KnowledgeIntelligenceContext,
  input: {
    request_type: IntelligenceRequest["request_type"];
    purpose: string;
    query?: string;
    target_entity_type?: string;
    target_entity_id?: string;
    course_id?: string;
    lesson_id?: string;
    competency_id?: string;
    role_id?: string;
    certification_id?: string;
    protected_assessment_active?: boolean;
  }
): IntelligenceResult {
  const privacy = validatePrivacyContext(ctx, input.purpose);
  if (!privacy.allowed) {
    return baseResult(
      buildIntelligenceRequest(ctx, { request_type: input.request_type, purpose: input.purpose, query: input.query }),
      {
        result_state: "permission_restricted",
        answer_or_recommendation: "Request blocked by privacy policy.",
        limitations: privacy.violations,
        human_review_required: true,
        confidence: "very_high",
      }
    );
  }

  const request = buildIntelligenceRequest(ctx, {
    request_type: input.request_type,
    purpose: input.purpose,
    query: input.query,
    target_entity_type: input.target_entity_type,
    target_entity_id: input.target_entity_id,
    course_id: input.course_id,
    lesson_id: input.lesson_id,
    competency_id: input.competency_id,
  });

  let result: IntelligenceResult;

  switch (input.request_type) {
    case "knowledge_query": {
      const search = semanticKnowledgeQuery(ctx, input.query ?? "", { include_historical: false });
      result = baseResult(request, {
        result_state: search.hits.length ? "complete" : "insufficient_evidence",
        answer_or_recommendation: search.hits.length
          ? `Found ${search.current_count} current authorized results.`
          : "No authorized knowledge matched.",
        evidence_references: search.evidence,
        canonical_versions_used: search.evidence
          .filter((e) => e.canonical_version != null)
          .map((e) => ({ entity_id: e.entity_id, entity_type: e.entity_type, version: e.canonical_version! })),
        freshness_status: search.historical_count > 0 ? "mixed" : search.current_count > 0 ? "current" : "unknown",
        confidence: scoreToConfidence(search.hits.length > 0 ? 0.7 : 0.2),
        limitations: ["Permission filtering applied before retrieval"],
      });
      break;
    }
    case "knowledge_health": {
      const health = computeKnowledgeHealth(ctx);
      result = baseResult(request, {
        result_state: "complete",
        answer_or_recommendation: `Knowledge health band: ${health.overall_band}`,
        evidence_references: [
          { signal_id: health.snapshot_id, source_type: "health_snapshot", entity_id: health.snapshot_id, entity_type: "KnowledgeHealth", summary: health.overall_band },
        ],
        confidence: "high",
      });
      break;
    }
    case "knowledge_gaps": {
      const gaps = detectKnowledgeGaps(ctx);
      result = baseResult(request, {
        result_state: gaps.length ? "human_review_required" : "complete",
        answer_or_recommendation: gaps.length ? `${gaps.length} documentation gaps detected` : "No major gaps detected",
        human_review_required: gaps.length > 0,
        limitations: ["Gap candidates are noncanonical until steward acceptance"],
      });
      break;
    }
    case "knowledge_impact": {
      const impact = analyzeKnowledgeImpact(
        input.target_entity_id ?? "",
        input.target_entity_type ?? "KnowledgeArtifact",
        ctx
      );
      result = baseResult(request, {
        result_state: "complete_with_limitations",
        answer_or_recommendation: `Impact analysis: ${impact.affected_courses.length} courses, ${impact.affected_assessments.length} assessments affected`,
        human_review_required: true,
        limitations: impact.review_recommendations,
      });
      break;
    }
    case "learning_recommendations": {
      const recs = generateLearningRecommendations(ctx);
      result = baseResult(request, {
        result_state: recs.length ? "complete" : "insufficient_evidence",
        answer_or_recommendation: recs.map((r) => r.recommendation).join("; ") || "No recommendations",
        evidence_references: recs.flatMap((r) => r.evidence_references),
        confidence: recs[0]?.confidence ?? "low",
      });
      break;
    }
    case "learning_next_step": {
      const step = recommendAdaptiveNextStep(ctx, { course_id: input.course_id, goal: input.query });
      result = baseResult(request, {
        result_state: "complete",
        answer_or_recommendation: step.sequence_recommendations.join(" "),
        limitations: ["Standards unchanged — completion ≠ competency"],
        human_review_required: false,
      });
      break;
    }
    case "capability_coverage": {
      const coverage = filterSensitiveTraitsFromOutput(computeCapabilityCoverage(ctx));
      result = baseResult(request, {
        result_state: "complete",
        answer_or_recommendation: `Competency coverage across ${coverage.competency_coverage.length} competencies`,
        limitations: ["No Human leaderboard or trust scores"],
      });
      break;
    }
    case "role_readiness": {
      const readiness = evaluateRoleReadiness(ctx, { role_id: input.role_id ?? "role-default" });
      result = baseResult(request, {
        result_state: readiness.readiness === "ready" ? "complete" : "human_review_required",
        answer_or_recommendation: `Role readiness: ${readiness.readiness}`,
        human_review_required: readiness.readiness !== "ready",
        limitations: readiness.missing_requirements,
      });
      break;
    }
    case "certification_readiness": {
      const readiness = evaluateCertificationReadiness(ctx, input.certification_id ?? "");
      result = baseResult(request, {
        result_state: "complete_with_limitations",
        answer_or_recommendation: `Certification status: ${readiness.current_status}. AI cannot award.`,
        limitations: [...readiness.requirements_remaining, readiness.authority_required],
        human_review_required: true,
      });
      break;
    }
    case "research_synthesize": {
      const syn = synthesizeResearchEvidence(ctx, input.query ?? "");
      result = baseResult(request, {
        result_state: syn.confidence === "speculative" ? "insufficient_evidence" : "complete_with_limitations",
        answer_or_recommendation: `Research synthesis — confidence ${syn.confidence}`,
        evidence_references: syn.source_references,
        conflicting_evidence: syn.contradictory_findings,
        human_review_required: true,
        confidence: syn.confidence as IntelligenceResult["confidence"],
      });
      break;
    }
    case "memory_query": {
      const mem = queryInstitutionalMemory(ctx, input.query ?? "");
      result = baseResult(request, {
        result_state: mem.similar_situations.length ? "complete_with_limitations" : "insufficient_evidence",
        answer_or_recommendation: `Found ${mem.similar_situations.length} historical situations`,
        freshness_status: "historical",
        limitations: ["Historical guidance labeled — may differ from current"],
      });
      break;
    }
    case "tutor_turn": {
      const tutor = runExplainableTutorTurn(ctx, {
        learner_question: input.query ?? "",
        course_id: input.course_id,
        lesson_id: input.lesson_id,
        protected_assessment_active: input.protected_assessment_active,
      });
      result = baseResult(request, {
        result_state: tutor.cannot_answer_reason_optional ? "permission_restricted" : "complete",
        answer_or_recommendation: tutor.response,
        evidence_references: tutor.source_references,
        canonical_versions_used: tutor.canonical_versions.map((v) => ({
          entity_id: v.entity_id,
          entity_type: "KnowledgeArtifact",
          version: v.version,
        })),
        limitations: tutor.limitations,
        confidence: tutor.confidence,
      });
      break;
    }
    case "executive_brief": {
      const brief = generateExecutiveKnowledgeBrief(ctx);
      result = baseResult(request, {
        result_state: "complete",
        answer_or_recommendation: `Executive brief: ${brief.critical_documentation_gaps.length} gaps, ${brief.expiring_credentials} expiring credentials`,
        human_review_required: brief.knowledge_at_risk.length > 0,
      });
      break;
    }
    case "copilot_query": {
      const copilot = runKnowledgeCopilotQuery(input.query ?? "", ctx);
      result = baseResult(request, {
        result_state: copilot.intent === "prohibited_action" ? "permission_restricted" : "complete",
        answer_or_recommendation: copilot.answer,
        evidence_references: copilot.evidence.map((e) => ({
          signal_id: e.signal_id,
          source_type: e.source,
          entity_id: e.signal_id,
          entity_type: "Signal",
          summary: e.summary,
        })),
        confidence: copilot.confidence as IntelligenceResult["confidence"],
      });
      break;
    }
    default: {
      const graph = input.target_entity_id
        ? buildKnowledgeGraph(input.target_entity_id, input.target_entity_type ?? "KnowledgeArtifact", ctx)
        : null;
      result = baseResult(request, {
        result_state: graph ? "complete" : "unavailable",
        answer_or_recommendation: graph ? `Graph: ${graph.nodes.length} nodes` : "No graph available",
      });
    }
  }

  if (shouldRouteToHumanReview({
    confidence: result.confidence,
    conflicting_evidence: result.conflicting_evidence,
    legal_or_safety: input.purpose.includes("safety") || input.purpose.includes("legal"),
  })) {
    result.human_review_required = true;
    if (result.result_state === "complete") result.result_state = "human_review_required";
    enqueueIntelligenceReview(result, "Policy threshold or conflicting evidence");
  }

  recordEvidenceLedger(result, request);
  recordAIProvenance({
    intelligence_result_id: result.intelligence_result_id,
    model_or_rule_version: result.model_reference_optional ?? "deterministic-rules-v1",
    retrieval_query: input.query,
    canonical_versions: result.canonical_versions_used.map((v) => ({
      entity_id: v.entity_id,
      version: v.version,
    })),
  });

  return result;
}
