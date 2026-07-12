/**
 * CAE-11.1-W6 — Initiative copilot (keyword router; advisory only)
 */
import { initiativeApplicationService } from "../services/application-service";
import { generateExecutiveBrief } from "./executive-brief";
import { detectDuplicateCandidates } from "./duplicate-detection";
import { detectOperationalRisks } from "./risk-intelligence";
import { buildInstitutionGraph } from "./institution-graph";
import type { CopilotQueryResult } from "./contracts";
import { AI_PROHIBITED_ACTIONS } from "./contracts";

const GOVERNANCE_NOTE =
  "This copilot recommends and explains only. It cannot approve, activate, assign ownership, or change Initiative state.";

export function runInitiativeCopilotQuery(
  query: string,
  institutionId: string,
  actorHumanId: string
): CopilotQueryResult {
  const q = query.toLowerCase().trim();

  if (prohibitedIntent(q)) {
    return {
      query,
      intent: "prohibited_action",
      answer: `I cannot perform that action. Prohibited: ${AI_PROHIBITED_ACTIONS.join(", ")}.`,
      answer_es: "No puedo realizar esa acción — requiere decisión humana gobernada.",
      confidence: "very_high",
      evidence: [{ signal_id: "governance", source: "ini_intelligence_constitution", summary: "AI prohibited actions" }],
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("risk") || q.includes("blocked") || q.includes("why is")) {
    const risks = detectOperationalRisks(institutionId);
    return {
      query,
      intent: "risks",
      answer: risks.length
        ? `Found ${risks.length} risk signal(s). Top: ${risks[0].title} — ${risks[0].explanation}`
        : "No elevated risk signals in your institution scope.",
      answer_es: risks.length ? `Se encontraron ${risks.length} señales de riesgo.` : "No hay señales elevadas de riesgo.",
      confidence: "high",
      evidence: risks.slice(0, 3).map((r) => ({
        signal_id: r.risk_id,
        source: "risk_intelligence",
        summary: r.title,
      })),
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("duplicate") || q.includes("overlap") || q.includes("similar")) {
    const dupes = detectDuplicateCandidates(institutionId, 0.55).slice(0, 3);
    return {
      query,
      intent: "duplicates",
      answer: dupes.length
        ? `Possible duplicates: ${dupes.map((d) => `${d.name_a} ↔ ${d.name_b} (${d.similarity_label})`).join("; ")}`
        : "No strong duplicate candidates detected at current thresholds.",
      answer_es: dupes.length ? "Posibles duplicados detectados — revisa antes de fusionar." : "No se detectaron duplicados fuertes.",
      confidence: dupes.length ? "medium" : "low",
      evidence: dupes.map((d) => ({
        signal_id: `${d.initiative_id_a}-${d.initiative_id_b}`,
        source: "duplicate_detection",
        summary: d.similarity_label,
      })),
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("approval") || q.includes("brief") || q.includes("today") || q.includes("executive")) {
    const brief = generateExecutiveBrief(institutionId, actorHumanId);
    return {
      query,
      intent: "executive_brief",
      answer: `Approvals waiting: ${brief.approvals_waiting}. At risk: ${brief.initiatives_at_risk}. Priorities: ${brief.todays_priorities.length}.`,
      answer_es: `Aprobaciones pendientes: ${brief.approvals_waiting}. En riesgo: ${brief.initiatives_at_risk}.`,
      confidence: "high",
      evidence: [{ signal_id: brief.brief_id, source: "executive_brief", summary: "portfolio scan" }],
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("county") || q.includes("benton") || q.includes("pulaski") || q.includes("involving")) {
    const matches = initiativeApplicationService
      .listInitiativeIds()
      .map((id) => initiativeApplicationService.getAggregate(id))
      .filter((agg) => {
        if (!agg || agg.initiative.institution_id !== institutionId) return false;
        const text = `${agg.initiative.initiative_name} ${agg.charter?.purpose ?? ""} ${agg.scope?.geographic_scope ?? ""}`.toLowerCase();
        return q.split(/\s+/).some((w) => w.length > 3 && text.includes(w));
      });
    return {
      query,
      intent: "search",
      answer: matches.length
        ? `Found ${matches.length} Initiative(s): ${matches.map((m) => m!.initiative.initiative_name).join(", ")}`
        : "No Initiatives matched those terms in your institution scope.",
      answer_es: matches.length ? `Encontré ${matches.length} iniciativa(s).` : "No hay coincidencias en tu institución.",
      confidence: matches.length ? "medium" : "low",
      evidence: matches.slice(0, 5).map((m) => ({
        signal_id: m!.initiative.initiative_id,
        source: "initiative_search",
        summary: m!.initiative.initiative_name,
      })),
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  const graph = buildInstitutionGraph(institutionId);
  return {
    query,
    intent: "general",
    answer: `Institution graph: ${graph.node_count} nodes, ${graph.edge_count} edges. Ask about risks, duplicates, approvals, or a county name.`,
    answer_es: "Grafo institucional disponible. Pregunta por riesgos, duplicados o aprobaciones.",
    confidence: "low",
    evidence: [{ signal_id: "graph", source: "institution_graph", summary: `${graph.node_count} nodes` }],
    advisory_only: true,
    governance_note: GOVERNANCE_NOTE,
  };
}

function prohibitedIntent(q: string): boolean {
  return (
    q.includes("approve") ||
    q.includes("activate") ||
    q.includes("assign owner") ||
    q.includes("delete") ||
    q.includes("archive this") ||
    q.includes("invite ")
  );
}
