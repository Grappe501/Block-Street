/**
 * CAE-11.12-W6 — Knowledge intelligence copilot (keyword router; advisory only)
 */
import { knowledgeApplicationService } from "../application-service";
import { computeKnowledgeHealth } from "./quality-intelligence";
import { detectDuplicateKnowledge } from "./duplicate-detection";
import { detectKnowledgeContradictions } from "./contradiction-detection";
import { detectKnowledgeGaps } from "./gap-detection";
import { semanticKnowledgeQuery } from "./semantic-retrieval";
import { generateExecutiveKnowledgeBrief } from "./executive-brief";
import { evaluateCertificationReadiness } from "./certification-readiness";
import { AI_PROHIBITED_ACTIONS } from "./contracts";
import type { KnowledgeIntelligenceContext } from "./api-context";

const GOVERNANCE_NOTE =
  "This copilot recommends and explains only. It cannot publish, verify competency, award credentials, or mutate canonical records.";

export type CopilotResponse = {
  query: string;
  intent: string;
  answer: string;
  answer_es: string;
  confidence: string;
  evidence: { signal_id: string; source: string; summary: string }[];
  advisory_only: true;
  canonical_mutation_allowed: false;
  governance_note: string;
};

function prohibitedIntent(q: string): boolean {
  return AI_PROHIBITED_ACTIONS.some((action) => q.includes(action.replace(/_/g, " ")) || q.includes(action));
}

export function runKnowledgeCopilotQuery(
  query: string,
  ctx: KnowledgeIntelligenceContext
): CopilotResponse {
  const q = query.toLowerCase().trim();

  if (
    prohibitedIntent(q) ||
    q.includes("publish") ||
    q.includes("certify me") ||
    q.includes("verify my competency") ||
    q.includes("award certification")
  ) {
    return {
      query,
      intent: "prohibited_action",
      answer: `I cannot perform that action. Intelligence may influence attention but not replace Human authority.`,
      answer_es: "No puedo realizar esa acción — requiere decisión humana autorizada.",
      confidence: "very_high",
      evidence: [{ signal_id: "governance", source: "knw_intelligence_constitution", summary: "AI prohibited actions" }],
      advisory_only: true,
      canonical_mutation_allowed: false,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("health") || q.includes("freshness") || q.includes("stale")) {
    const health = computeKnowledgeHealth(ctx);
    return {
      query,
      intent: "knowledge_health",
      answer: `Knowledge health: ${health.overall_band}. Healthy: ${health.healthy_count}, review due: ${health.review_due_count}, weak evidence: ${health.weak_evidence_count}.`,
      answer_es: `Salud del conocimiento: ${health.overall_band}.`,
      confidence: "high",
      evidence: [{ signal_id: health.snapshot_id, source: "knowledge_health", summary: health.overall_band }],
      advisory_only: true,
      canonical_mutation_allowed: false,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("duplicate") || q.includes("overlap")) {
    const dupes = detectDuplicateKnowledge(ctx, 0.5).slice(0, 3);
    return {
      query,
      intent: "duplicates",
      answer: dupes.length
        ? `Possible duplicates: ${dupes.map((d) => `${d.name_a} ↔ ${d.name_b}`).join("; ")}`
        : "No strong duplicate candidates at current thresholds.",
      answer_es: dupes.length ? "Posibles duplicados detectados." : "No se detectaron duplicados fuertes.",
      confidence: dupes.length ? "medium" : "low",
      evidence: dupes.map((d) => ({
        signal_id: `${d.artifact_id_a}-${d.artifact_id_b}`,
        source: "duplicate_detection",
        summary: d.similarity_label,
      })),
      advisory_only: true,
      canonical_mutation_allowed: false,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("gap") || q.includes("missing documentation")) {
    const gaps = detectKnowledgeGaps(ctx).slice(0, 3);
    return {
      query,
      intent: "knowledge_gaps",
      answer: gaps.length ? `Gaps: ${gaps.map((g) => g.description).join("; ")}` : "No major gaps detected.",
      answer_es: gaps.length ? "Brechas de documentación detectadas." : "No se detectaron brechas mayores.",
      confidence: "medium",
      evidence: gaps.map((g) => ({ signal_id: g.gap_id, source: "gap_detection", summary: g.gap_type })),
      advisory_only: true,
      canonical_mutation_allowed: false,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("certification") || q.includes("credential") || q.includes("qualify")) {
    const certs = knowledgeApplicationService.listCertifications(ctx.institution_id);
    const first = certs[0];
    const readiness = first
      ? evaluateCertificationReadiness(ctx, first.canonical_id)
      : { current_status: "none", requirements_remaining: ["No certifications defined"] };
    return {
      query,
      intent: "certification_readiness",
      answer: `Certification readiness: ${readiness.current_status}. AI cannot award credentials.`,
      answer_es: "Preparación para certificación — la IA no puede otorgar credenciales.",
      confidence: "high",
      evidence: [{ signal_id: "cert-readiness", source: "certification_intelligence", summary: readiness.current_status }],
      advisory_only: true,
      canonical_mutation_allowed: false,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("brief") || q.includes("executive") || q.includes("leadership")) {
    const brief = generateExecutiveKnowledgeBrief(ctx);
    return {
      query,
      intent: "executive_brief",
      answer: `Knowledge brief: ${brief.critical_documentation_gaps.length} gaps, ${brief.expiring_credentials} expiring credentials. No individual rankings.`,
      answer_es: `Resumen ejecutivo: ${brief.critical_documentation_gaps.length} brechas.`,
      confidence: "high",
      evidence: [{ signal_id: brief.brief_id, source: "executive_brief", summary: "institution scan" }],
      advisory_only: true,
      canonical_mutation_allowed: false,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  const search = semanticKnowledgeQuery(ctx, query);
  return {
    query,
    intent: "knowledge_search",
    answer: search.hits.length
      ? `Found ${search.current_count} current and ${search.historical_count} historical authorized results.`
      : "No authorized knowledge matched your query.",
    answer_es: search.hits.length ? "Resultados autorizados encontrados." : "No hay conocimiento autorizado.",
    confidence: search.hits.length ? "medium" : "low",
    evidence: search.evidence.slice(0, 3).map((e) => ({
      signal_id: e.entity_id,
      source: e.source_type,
      summary: e.summary,
    })),
    advisory_only: true,
    canonical_mutation_allowed: false,
    governance_note: GOVERNANCE_NOTE,
  };
}
