/**
 * CAE-11.7-W7 — Organizational learning (FAQs, repeated decisions, training)
 */
import { nowIso } from "../../../utils";
import { detectEmergingFaqs } from "../intelligence/knowledge-intelligence";
import { detectCommunicationPatterns } from "../intelligence/pattern-engine";
import type { CommunicationOptimization } from "./contracts";
import { isOptimizationRejected } from "./feedback-store";

export function generateOrganizationalLearning(
  institutionId: string,
  initiativeId?: string
): CommunicationOptimization[] {
  const recs: CommunicationOptimization[] = [];
  const faqs = detectEmergingFaqs(institutionId, initiativeId);
  const patterns = detectCommunicationPatterns(institutionId, initiativeId);
  const repeatedDecisions = patterns.filter((p) => p.pattern_type === "repeated_question");

  if (faqs.length >= 2) {
    const optId = "ci-org-faqs";
    if (!isOptimizationRejected(optId, institutionId)) {
      recs.push({
        optimization_id: optId,
        category: "knowledge",
        title: "Publish emerging FAQs to knowledge base",
        title_es: "Publicar preguntas frecuentes emergentes",
        what_changed: `${faqs.length} recurring question pattern(s) detected.`,
        why: "Repeated questions consume coordinator time unnecessarily.",
        why_es: "Preguntas repetidas consumen tiempo del coordinador.",
        confidence: faqs.length >= 4 ? "strong_pattern" : "likely",
        evidence: faqs.slice(0, 3).map((f) => ({
          signal_id: f.faq_id,
          source: "emerging_faq",
          summary: f.question_theme,
        })),
        expected_benefit: "Self-service answers reduce coordination load.",
        potential_risk: "FAQs may become outdated without stewardship.",
        who_should_review: "Knowledge stewards and mission leads",
        suggested_action: "Draft FAQ entries for top recurring questions.",
        initiative_id_optional: initiativeId,
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  if (repeatedDecisions.length > 0) {
    const optId = "ci-org-repeated-decisions";
    if (!isOptimizationRejected(optId, institutionId)) {
      recs.push({
        optimization_id: optId,
        category: "decision",
        title: "Standardize repeated decision patterns",
        title_es: "Estandarizar decisiones repetidas",
        what_changed: `${repeatedDecisions.length} repeated decision pattern(s) identified.`,
        why: "Re-litigating the same decisions slows mission velocity.",
        why_es: "Re-debatir decisiones ralentiza la misión.",
        confidence: "likely",
        evidence: repeatedDecisions.slice(0, 2).map((p) => ({
          signal_id: p.pattern_id,
          source: "pattern_engine",
          summary: p.description,
        })),
        expected_benefit: "Faster decisions via documented precedents.",
        potential_risk: "Over-standardization may miss contextual nuance.",
        who_should_review: "Executive sponsor and governance lead",
        suggested_action: "Create decision record template for recurring topics.",
        initiative_id_optional: initiativeId,
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  const trainingNeeds: string[] = [];
  if (faqs.length >= 3) trainingNeeds.push("FAQ authoring and knowledge capture");
  if (repeatedDecisions.length > 0) trainingNeeds.push("Decision recording and escalation");

  if (trainingNeeds.length > 0) {
    const optId = "ci-org-training";
    if (!isOptimizationRejected(optId, institutionId)) {
      recs.push({
        optimization_id: optId,
        category: "lesson",
        title: "Address identified training needs",
        title_es: "Atender necesidades de capacitación",
        what_changed: `Training gaps: ${trainingNeeds.join(", ")}.`,
        why: "Pattern signals indicate coordination skill gaps.",
        why_es: "Señales de patrón indican brechas de coordinación.",
        confidence: "emerging",
        evidence: [{ signal_id: "training-needs", source: "organizational_learning", summary: trainingNeeds.join("; ") }],
        expected_benefit: "Higher quality communications with less rework.",
        potential_risk: "Training scheduling may delay short-term execution.",
        who_should_review: "Operational owners and volunteer coordinators",
        suggested_action: "Schedule micro-training sessions for identified gaps.",
        initiative_id_optional: initiativeId,
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  return recs;
}

export function identifyTrainingNeeds(institutionId: string, initiativeId?: string): string[] {
  const faqs = detectEmergingFaqs(institutionId, initiativeId);
  const needs: string[] = [];
  if (faqs.length >= 3) needs.push("FAQ authoring and knowledge capture workshop");
  if (detectCommunicationPatterns(institutionId, initiativeId).some((p) => p.pattern_type === "repeated_question")) {
    needs.push("Decision recording and escalation training");
  }
  return needs.length ? needs : ["No urgent training signals — continue monitoring."];
}
