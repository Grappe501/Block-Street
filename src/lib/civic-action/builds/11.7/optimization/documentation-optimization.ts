/**
 * CAE-11.7-W7 — Documentation optimization
 */
import { nowIso } from "../../../utils";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "../services/repository";
import type { DocumentRecord } from "../data-model";
import type { CommunicationOptimization } from "./contracts";
import { isOptimizationRejected } from "./feedback-store";

export function analyzeDocumentationOptimization(
  institutionId: string,
  initiativeId?: string
): CommunicationOptimization[] {
  const recs: CommunicationOptimization[] = [];
  let documents = readStoreSlice<DocumentRecord>(COMMUNICATION_STORE_KEYS.documents).filter(
    (d) => d.institution_id === institutionId && d.lifecycle_state === "published"
  );
  if (initiativeId) documents = documents.filter((d) => d.initiative_id === initiativeId);

  const stale = documents.filter((d) => {
    const ageMs = Date.now() - new Date(d.updated_at).getTime();
    return ageMs > 90 * 24 * 60 * 60 * 1000;
  });

  if (stale.length > 0) {
    const optId = "ci-doc-stale";
    if (!isOptimizationRejected(optId, institutionId)) {
      recs.push({
        optimization_id: optId,
        category: "documentation",
        title: "Review stale mission documents",
        title_es: "Revisar documentos de misión obsoletos",
        what_changed: `${stale.length} active document(s) not updated in 90+ days.`,
        why: "Outdated documents mislead volunteers and mission leads.",
        why_es: "Documentos desactualizados confunden a los voluntarios.",
        confidence: stale.length >= 3 ? "likely" : "observed",
        evidence: stale.slice(0, 3).map((d) => ({
          signal_id: d.canonical_id,
          source: "document_age",
          summary: `${d.display_name} last updated ${d.updated_at}`,
        })),
        expected_benefit: "Accurate reference materials for current missions.",
        potential_risk: "Review workload may delay other priorities.",
        who_should_review: "Document owners and operational leads",
        suggested_action: "Schedule document review sprint with version audit.",
        initiative_id_optional: initiativeId,
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  return recs;
}
