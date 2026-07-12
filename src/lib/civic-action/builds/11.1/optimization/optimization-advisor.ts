/**
 * CAE-11.1-W7 — Optimization advisor (NL queries, advisory only)
 */
import { OPTIMIZATION_PROHIBITED_ACTIONS } from "./contracts";
import { analyzeProcessOptimization } from "./process-optimization";
import { identifyTrainingNeeds } from "./training-intelligence";
import { generateContinuousImprovements } from "./continuous-improvement";
import { buildInstitutionalMemory, searchInstitutionalMemory } from "./institutional-memory";
import { measureOrganizationHealth } from "./organization-health";
import { gatherCommunityIntelligence } from "./community-intelligence";
import { runSimulation } from "./simulation-engine";

export type OptimizationAdvisorResponse = {
  answer: string;
  answer_es: string;
  related_optimizations?: string[];
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
];

export function queryOptimizationAdvisor(
  institutionId: string,
  question: string
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

  if (q.includes("approval") && (q.includes("delay") || q.includes("reduce"))) {
    const procs = analyzeProcessOptimization(institutionId);
    const approval = procs.find((p) => p.process_id === "initiative-approval");
    return {
      answer: `Approval delays: current ~${approval?.current_avg_days ?? 21} days, ${approval?.current_steps ?? 9} steps. Suggested: ${approval?.suggested_avg_days ?? 10} days, ${approval?.suggested_steps ?? 6} steps. Schedule batch governance review.`,
      answer_es: "Retrasos de aprobación detectados — revise gobernanza en lote.",
      related_optimizations: ["gov-approval-bottleneck", "auto-approval-reminders"],
      advisory_only: true,
    };
  }

  if (q.includes("waste") || q.includes("inefficient") || q.includes("process")) {
    const procs = analyzeProcessOptimization(institutionId);
    const worst = procs.sort((a, b) => b.current_avg_days - a.current_avg_days)[0];
    return {
      answer: `Most time-intensive process: ${worst?.process_name} (~${worst?.current_avg_days} days, ${worst?.current_steps} steps). Suggested reduction to ${worst?.suggested_steps} steps / ${worst?.suggested_avg_days} days.`,
      answer_es: `Proceso más lento: ${worst?.process_name}.`,
      advisory_only: true,
    };
  }

  if (q.includes("mistake") || q.includes("repeat")) {
    const memory = buildInstitutionalMemory(institutionId);
    const lessons = memory.filter((m) => m.lessons).slice(0, 3);
    return {
      answer: lessons.length
        ? `Repeated patterns from memory: ${lessons.map((l) => l.initiative_name).join("; ")}. Review lessons before new charters.`
        : "No completed Initiative lessons yet — complete closeouts to build institutional memory.",
      answer_es: "Consulte la memoria institucional para evitar errores repetidos.",
      advisory_only: true,
    };
  }

  if (q.includes("training") || q.includes("train")) {
    const needs = identifyTrainingNeeds(institutionId);
    return {
      answer: needs.join(" "),
      answer_es: "Necesidades de capacitación identificadas.",
      advisory_only: true,
    };
  }

  if (q.includes("volunteer") && q.includes("workflow")) {
    return {
      answer: "Recommended volunteer workflow: Listening session → Recruitment → Training → Community meeting → Media → Launch → Follow-up.",
      answer_es: "Flujo recomendado para voluntarios disponible.",
      advisory_only: true,
    };
  }

  if (q.includes("scale") || q.includes("statewide")) {
    const sim = runSimulation(institutionId, { scenario_type: "statewide_launch", parameters: {} });
    return {
      answer: sim.outcomes.join(" ") + " " + sim.note,
      answer_es: "Simulación de expansión estatal — solo consultiva.",
      advisory_only: true,
    };
  }

  if (q.includes("trust") || q.includes("community")) {
    const insights = gatherCommunityIntelligence(institutionId);
    return {
      answer: insights.map((i) => `${i.title}: ${i.summary}`).join(" "),
      answer_es: "Inteligencia comunitaria resumida.",
      advisory_only: true,
    };
  }

  if (q.includes("health")) {
    const health = measureOrganizationHealth(institutionId);
    const critical = health.filter((h) => h.state === "critical" || h.state === "attention");
    return {
      answer: critical.length
        ? `Attention areas: ${critical.map((h) => `${h.label} (${h.explanation})`).join("; ")}`
        : "Organizational health dimensions are within normal bands.",
      answer_es: "Resumen de salud organizacional.",
      advisory_only: true,
    };
  }

  if (q.includes("best") && q.includes("perform")) {
    const hits = searchInstitutionalMemory(institutionId, "completed");
    return {
      answer: hits.length
        ? `Reference completed Initiatives: ${hits.slice(0, 2).map((h) => h.initiative_name).join(", ")}.`
        : "Insufficient completed Initiatives for performance comparison.",
      answer_es: "Compare con iniciativas completadas.",
      advisory_only: true,
    };
  }

  const improvements = generateContinuousImprovements(institutionId);
  return {
    answer: improvements.length
      ? `Top optimizations: ${improvements.slice(0, 3).map((r) => r.title).join("; ")}. All advisory — Humans must accept.`
      : "No urgent optimizations detected. Continue monitoring Initiative completions.",
    answer_es: "Optimizaciones sugeridas — todas consultivas.",
    related_optimizations: improvements.slice(0, 3).map((r) => r.optimization_id),
    advisory_only: true,
  };
}
