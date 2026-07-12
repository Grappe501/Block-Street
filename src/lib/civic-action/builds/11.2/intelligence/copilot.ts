/**
 * CAE-11.2-W6 — Objective copilot (keyword router; advisory only)
 */
import { objectiveApplicationService } from "../application-service";
import { generateExecutiveBrief } from "./executive-brief";
import { detectDuplicateObjectives } from "./duplicate-detection";
import { detectExecutionRisks } from "./risk-intelligence";
import { analyzeProgress } from "./progress-intelligence";
import { buildObjectiveGraph } from "./objective-graph";
import type { CopilotQueryResult } from "./contracts";
import { AI_PROHIBITED_ACTIONS } from "./contracts";

const GOVERNANCE_NOTE =
  "This copilot recommends and explains only. It cannot approve, activate, assign, complete, or change Objective state.";

export function runObjectiveCopilotQuery(
  query: string,
  institutionId: string,
  actorHumanId: string,
  options?: { initiativeId?: string; objectiveId?: string }
): CopilotQueryResult {
  const q = query.toLowerCase().trim();

  if (prohibitedIntent(q)) {
    return {
      query,
      intent: "prohibited_action",
      answer: `I cannot perform that action. Prohibited: ${AI_PROHIBITED_ACTIONS.join(", ")}.`,
      answer_es: "No puedo realizar esa acción — requiere decisión humana gobernada.",
      confidence: "very_high",
      evidence: [{ signal_id: "governance", source: "obj_intelligence_constitution", summary: "AI prohibited actions" }],
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("behind") || q.includes("risk") || q.includes("blocked") || q.includes("why is")) {
    const risks = options?.objectiveId
      ? detectExecutionRisks(institutionId).filter((r) => r.objective_id === options.objectiveId)
      : detectExecutionRisks(institutionId, options?.initiativeId);
    return {
      query,
      intent: "risks",
      answer: risks.length
        ? `Found ${risks.length} risk signal(s). Top: ${risks[0].title} — ${risks[0].explanation}`
        : "No elevated risk signals in your scope.",
      answer_es: risks.length ? `Se encontraron ${risks.length} señales de riesgo.` : "No hay señales elevadas de riesgo.",
      confidence: "high",
      evidence: risks.slice(0, 3).map((r) => ({ signal_id: r.risk_id, source: "risk_intelligence", summary: r.title })),
      who_should_review_optional: "Operational owner and executive sponsor",
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("duplicate") || q.includes("overlap") || q.includes("similar")) {
    const dupes = detectDuplicateObjectives(institutionId, options?.initiativeId, 0.55).slice(0, 3);
    return {
      query,
      intent: "duplicates",
      answer: dupes.length
        ? `Possible duplicates: ${dupes.map((d) => `${d.name_a} ↔ ${d.name_b}`).join("; ")}`
        : "No strong duplicate candidates at current thresholds.",
      answer_es: dupes.length ? "Posibles duplicados detectados." : "No se detectaron duplicados fuertes.",
      confidence: dupes.length ? "medium" : "low",
      evidence: dupes.map((d) => ({
        signal_id: `${d.objective_id_a}-${d.objective_id_b}`,
        source: "duplicate_detection",
        summary: d.similarity_label,
      })),
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("brief") || q.includes("executive") || q.includes("summarize") || q.includes("today")) {
    const brief = generateExecutiveBrief(institutionId, actorHumanId, options?.initiativeId);
    return {
      query,
      intent: "executive_brief",
      answer: `At risk: ${brief.objectives_at_risk}. Momentum: ${brief.execution_momentum}. Priorities: ${brief.todays_priorities.length}.`,
      answer_es: `En riesgo: ${brief.objectives_at_risk}. Prioridades: ${brief.todays_priorities.length}.`,
      confidence: "high",
      evidence: [{ signal_id: brief.brief_id, source: "executive_brief", summary: "portfolio scan" }],
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("progress") || q.includes("momentum") || q.includes("forecast")) {
    const progress = options?.objectiveId
      ? analyzeProgress(institutionId).filter((p) => p.objective_id === options.objectiveId)
      : analyzeProgress(institutionId, options?.initiativeId).slice(0, 3);
    const top = progress[0];
    return {
      query,
      intent: "progress",
      answer: top
        ? `Progress ${top.progress_percent}%, trend ${top.trend}. ${top.forecast_label}`
        : "No progress signals in scope.",
      answer_es: top ? `Progreso ${top.progress_percent}%, tendencia ${top.trend}.` : "Sin señales de progreso.",
      confidence: top?.confidence ?? "low",
      evidence: progress.map((p) => ({ signal_id: p.objective_id, source: "progress_intelligence", summary: p.trend })),
      alternative_interpretation_optional: "Low mission count may make percentages unstable.",
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (options?.objectiveId) {
    const graph = buildObjectiveGraph(options.objectiveId);
    const obj = objectiveApplicationService.getObjective(options.objectiveId);
    return {
      query,
      intent: "objective_context",
      answer: graph
        ? `Objective "${obj?.display_name}" has ${graph.node_count} nodes (${graph.edge_count} relationships). Ask about risks, progress, or duplicates.`
        : "Objective not found in scope.",
      answer_es: "Contexto del objetivo disponible. Pregunta por riesgos o progreso.",
      confidence: "medium",
      evidence: [{ signal_id: options.objectiveId, source: "objective_graph", summary: `${graph?.node_count ?? 0} nodes` }],
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  const matches = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId)
    .filter((o) => {
      const text = `${o.display_name} ${o.purpose}`.toLowerCase();
      return q.split(/\s+/).some((w) => w.length > 3 && text.includes(w));
    });

  return {
    query,
    intent: "search",
    answer: matches.length
      ? `Found ${matches.length} Objective(s): ${matches.map((m) => m.display_name).join(", ")}`
      : "Ask about risks, progress, duplicates, or an Objective name.",
    answer_es: matches.length ? `Encontré ${matches.length} objetivo(s).` : "Pregunta por riesgos, progreso o duplicados.",
    confidence: matches.length ? "medium" : "low",
    evidence: matches.slice(0, 5).map((m) => ({
      signal_id: m.canonical_id,
      source: "objective_search",
      summary: m.display_name,
    })),
    advisory_only: true,
    governance_note: GOVERNANCE_NOTE,
  };
}

function prohibitedIntent(q: string): boolean {
  return (
    q.includes("approve") ||
    q.includes("activate") ||
    q.includes("assign") ||
    q.includes("complete") ||
    q.includes("archive") ||
    q.includes("delete") ||
    q.includes("invite")
  );
}

export function explainObjectiveInsight(
  topic: string,
  institutionId: string,
  objectiveId?: string
): CopilotQueryResult {
  return runObjectiveCopilotQuery(`explain ${topic}`, institutionId, "system", { objectiveId });
}

export function recommendObjectiveActions(
  institutionId: string,
  actorHumanId: string,
  initiativeId?: string
): CopilotQueryResult {
  const brief = generateExecutiveBrief(institutionId, actorHumanId, initiativeId);
  return {
    query: "recommend actions",
    intent: "recommend",
    answer: `Top recommendations: ${brief.todays_priorities.map((r) => r.title).join("; ") || "None flagged."}`,
    answer_es: "Recomendaciones principales listadas.",
    confidence: "high",
    evidence: brief.todays_priorities.map((r) => ({
      signal_id: r.recommendation_id,
      source: "recommendation_engine",
      summary: r.title,
    })),
    advisory_only: true,
    governance_note: GOVERNANCE_NOTE,
  };
}
