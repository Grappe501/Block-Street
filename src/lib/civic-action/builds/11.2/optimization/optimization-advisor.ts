/**
 * CAE-11.2-W7 — Optimization advisor (NL queries, advisory only)
 */
import { OPTIMIZATION_PROHIBITED_ACTIONS } from "./contracts";
import { generateContinuousImprovements } from "./continuous-improvement";
import { identifyTrainingNeeds } from "./training-optimization";
import { buildInstitutionalMemory, searchInstitutionalMemory } from "./institutional-memory";
import { measureOrganizationHealth } from "./organization-health";
import { detectOptimizationPatterns } from "./pattern-recognition";
import { getTemplateEvolution } from "./template-evolution";
import { runSimulation } from "./simulation-engine";
import { extractLessons } from "./lesson-engine";
import { objectiveApplicationService } from "../application-service";

export type OptimizationAdvisorResponse = {
  answer: string;
  answer_es: string;
  related_optimizations?: string[];
  evidence?: string[];
  confidence?: string;
  advisory_only: true;
  blocked?: boolean;
  block_reason?: string;
};

const BLOCK_PATTERNS = [
  /approve/i,
  /activate automation/i,
  /delete history/i,
  /rewrite governance/i,
  /reassign authority/i,
  /modify policy/i,
  /spend/i,
  /auto.?implement/i,
];

export function queryOptimizationAdvisor(
  institutionId: string,
  question: string,
  options?: { initiativeId?: string }
): OptimizationAdvisorResponse {
  for (const pattern of BLOCK_PATTERNS) {
    if (pattern.test(question)) {
      return {
        answer: `I cannot perform that action. Optimization is advisory only. Prohibited: ${OPTIMIZATION_PROHIBITED_ACTIONS.join(", ")}.`,
        answer_es: "No puedo realizar esa acción. La optimización es solo consultiva.",
        advisory_only: true,
        blocked: true,
        block_reason: "prohibited_mutation",
      };
    }
  }

  const q = question.toLowerCase();
  const initiativeId = options?.initiativeId;

  if (q.includes("change next time") || q.includes("what should we")) {
    const lessons = extractLessons(institutionId, initiativeId ? { initiativeId } : undefined);
    return {
      answer: lessons.length
        ? `Based on ${lessons.length} lessons: ${lessons[0]!.recommendation}`
        : "Complete Objectives with retrospectives to build change recommendations.",
      answer_es: "Complete objetivos con retrospectivas para recomendaciones.",
      evidence: lessons.slice(0, 2).map((l) => l.evidence),
      confidence: lessons[0]?.confidence ?? "emerging",
      advisory_only: true,
    };
  }

  if (q.includes("template") && q.includes("best")) {
    const templates = getTemplateEvolution(institutionId, initiativeId);
    const best = templates.sort((a, b) => b.version - a.version)[0];
    return {
      answer: best
        ? `Best-performing template: ${best.template_name} v${best.version} (${best.status}).`
        : "Insufficient template evolution data.",
      answer_es: "Plantilla con mejor rendimiento identificada.",
      advisory_only: true,
    };
  }

  if (q.includes("delay") || q.includes("causes")) {
    const patterns = detectOptimizationPatterns(institutionId, initiativeId);
    const delay = patterns.find((p) => p.pattern_id === "pat-repeated-delays");
    return {
      answer: delay
        ? `${delay.description} Evidence: ${delay.evidence}`
        : "No strong delay patterns yet — monitor scheduling lessons.",
      answer_es: "Patrones de retraso analizados.",
      evidence: delay ? [delay.evidence] : [],
      confidence: delay?.confidence ?? "observed",
      advisory_only: true,
    };
  }

  if (q.includes("training") || q.includes("build")) {
    const needs = identifyTrainingNeeds(institutionId, initiativeId);
    return {
      answer: needs.join(" "),
      answer_es: "Necesidades de capacitación identificadas.",
      advisory_only: true,
    };
  }

  if (q.includes("county") || q.includes("consistently succeeds")) {
    const memory = searchInstitutionalMemory(institutionId, "completed");
    return {
      answer: memory.length
        ? `Reference completed Objectives: ${memory.slice(0, 2).map((m) => m.objective_name).join(", ")}.`
        : "Insufficient completed Objectives for regional comparison.",
      answer_es: "Compare con objetivos completados.",
      advisory_only: true,
    };
  }

  if (q.includes("volunteer") && q.includes("retention")) {
    return {
      answer: "Volunteer retention improves when missions have clear review rhythms and documented lessons from prior Objectives.",
      answer_es: "La retención mejora con ritmos de revisión claros.",
      advisory_only: true,
    };
  }

  if (q.includes("last five") || q.includes("compare")) {
    const objectives = objectiveApplicationService
      .listAllObjectives()
      .filter((o) => o.institution_id === institutionId)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .slice(0, 5);
    return {
      answer:
        objectives.length > 0
          ? `Last five Objectives: ${objectives.map((o) => `${o.display_name} (${o.lifecycle_state})`).join("; ")}.`
          : "No Objectives to compare.",
      answer_es: "Últimos cinco objetivos comparados.",
      evidence: objectives.map((o) => o.canonical_id),
      advisory_only: true,
    };
  }

  if (q.includes("health")) {
    const health = measureOrganizationHealth(institutionId, initiativeId);
    const critical = health.filter((h) => h.state === "critical" || h.state === "attention");
    return {
      answer: critical.length
        ? `Attention areas: ${critical.map((h) => `${h.label} (${h.explanation})`).join("; ")}`
        : "Organizational health dimensions are within normal bands.",
      answer_es: "Resumen de salud organizacional.",
      advisory_only: true,
    };
  }

  if (q.includes("simulate") || q.includes("what if")) {
    const sim = runSimulation(
      institutionId,
      { scenario_type: "reduce_approvals", parameters: { steps_removed: 1 } },
      initiativeId
    );
    return {
      answer: sim.outcomes.join(" ") + " " + sim.note,
      answer_es: "Simulación consultiva completada.",
      advisory_only: true,
    };
  }

  if (q.includes("mistake") || q.includes("repeat") || q.includes("learned")) {
    const memory = buildInstitutionalMemory(institutionId, initiativeId ? { initiativeId } : undefined);
    const withLessons = memory.filter((m) => m.lessons).slice(0, 3);
    return {
      answer: withLessons.length
        ? `Institutional memory: ${withLessons.map((l) => l.objective_name).join("; ")}.`
        : "No completed Objective lessons yet — complete Objectives to build memory.",
      answer_es: "Consulte la memoria institucional.",
      advisory_only: true,
    };
  }

  const improvements = generateContinuousImprovements(institutionId, initiativeId ? { initiativeId } : undefined);
  return {
    answer: improvements.length
      ? `Top optimizations: ${improvements.slice(0, 3).map((r) => r.title).join("; ")}. All advisory — Humans must accept.`
      : "No urgent optimizations detected. Continue monitoring Objective completions.",
    answer_es: "Optimizaciones sugeridas — todas consultivas.",
    related_optimizations: improvements.slice(0, 3).map((r) => r.optimization_id),
    advisory_only: true,
  };
}
