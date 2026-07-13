/**
 * CAE-11.7-W7 — Translation learning
 */
import { nowIso } from "../../../utils";
import { suggestConversationalSpanish } from "../intelligence/translation-intelligence";
import type { CommunicationOptimization } from "./contracts";
import { isOptimizationRejected } from "./feedback-store";

export function analyzeTranslationLearning(
  institutionId: string,
  initiativeId?: string
): CommunicationOptimization[] {
  const recs: CommunicationOptimization[] = [];
  const advisories = suggestConversationalSpanish(institutionId);

  if (advisories.length > 0) {
    const optId = "ci-translation-gaps";
    if (!isOptimizationRejected(optId, institutionId)) {
      recs.push({
        optimization_id: optId,
        category: "translation",
        title: "Improve bilingual communication coverage",
        title_es: "Mejorar cobertura bilingüe",
        what_changed: `${advisories.length} communication gap(s) in Spanish coverage.`,
        why: "Volunteers need consistent bilingual access to mission communications.",
        why_es: "Los voluntarios necesitan acceso bilingüe consistente.",
        confidence: advisories.length >= 3 ? "likely" : "observed",
        evidence: advisories.slice(0, 3).map((g, i) => ({
          signal_id: `gap-${i}`,
          source: "translation_intelligence",
          summary: g.original_excerpt.slice(0, 80),
        })),
        expected_benefit: "Broader volunteer participation and trust.",
        potential_risk: "Translation quality requires human review.",
        who_should_review: "Bilingual mission leads and translators",
        suggested_action: "Review translation gaps and update announcement templates.",
        initiative_id_optional: initiativeId,
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  return recs;
}
