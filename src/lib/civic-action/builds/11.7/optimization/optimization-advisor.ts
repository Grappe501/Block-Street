/**
 * CAE-11.7-W7 — Optimization advisor (blocks auto-implement/approve)
 */
import { OPTIMIZATION_PROHIBITED_ACTIONS } from "./contracts";
import { generateContinuousImprovements } from "./continuous-improvement";
import { extractLessons } from "./lesson-engine";
import { getTemplateEvolution } from "./template-evolution";
import { getPlaybookEvolution } from "./playbook-evolution";
import { measureCommunicationHealthOptimization } from "./communication-health-optimization";
import { detectOptimizationPatterns } from "./pattern-recognition";
import { runSimulation } from "./simulation-engine";
import { generateKnowledgeStewardshipRecommendations } from "./knowledge-stewardship";
import { identifyTrainingNeeds } from "./organizational-learning";
import { communicationApplicationService } from "../application-service";

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
  /send/i,
  /publish/i,
  /delete history/i,
  /modify governance/i,
  /auto.?implement/i,
  /auto.?approve/i,
  /archive conversation/i,
  /merge conversation/i,
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
        : "Archive conversations with retrospectives to build change recommendations.",
      answer_es: "Archive conversaciones con retrospectivas para recomendaciones.",
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

  if (q.includes("playbook")) {
    const playbooks = getPlaybookEvolution(institutionId, initiativeId);
    return {
      answer: playbooks.length
        ? `Playbooks: ${playbooks.map((p) => `${p.playbook_name} v${p.version}`).join("; ")}.`
        : "No playbook evolution data yet.",
      answer_es: "Evolución de playbooks consultada.",
      advisory_only: true,
    };
  }

  if (q.includes("health")) {
    const health = measureCommunicationHealthOptimization(institutionId, initiativeId);
    const critical = health.filter((h) => h.state === "critical" || h.state === "attention");
    return {
      answer: critical.length
        ? `Attention areas: ${critical.map((h) => `${h.label} (${h.explanation})`).join("; ")}`
        : "Communication health dimensions are within normal bands.",
      answer_es: "Resumen de salud de comunicaciones.",
      advisory_only: true,
    };
  }

  if (q.includes("steward") || q.includes("duplicate") || q.includes("outdated")) {
    const stewardship = generateKnowledgeStewardshipRecommendations(institutionId, initiativeId);
    return {
      answer: stewardship.length
        ? `${stewardship.length} stewardship recommendation(s) — all require human approval.`
        : "No urgent knowledge stewardship signals.",
      answer_es: "Recomendaciones de custodia de conocimiento.",
      advisory_only: true,
    };
  }

  if (q.includes("training")) {
    return {
      answer: identifyTrainingNeeds(institutionId, initiativeId).join(" "),
      answer_es: "Necesidades de capacitación identificadas.",
      advisory_only: true,
    };
  }

  if (q.includes("simulate") || q.includes("what if")) {
    const sim = runSimulation(
      institutionId,
      { scenario_type: "communication_plan", parameters: { channels: 2 } },
      initiativeId
    );
    return {
      answer: sim.outcomes.join(" ") + " " + sim.note,
      answer_es: "Simulación consultiva completada.",
      advisory_only: true,
    };
  }

  if (q.includes("delay") || q.includes("causes")) {
    const patterns = detectOptimizationPatterns(institutionId, initiativeId);
    const delay = patterns.find((p) => p.pattern_type === "collaboration_flow");
    return {
      answer: delay ? `${delay.description} Evidence: ${delay.evidence}` : "No strong delay patterns yet.",
      answer_es: "Patrones de retraso analizados.",
      evidence: delay ? [delay.evidence] : [],
      confidence: delay?.confidence ?? "observed",
      advisory_only: true,
    };
  }

  if (q.includes("last five") || q.includes("compare")) {
    const conversations = communicationApplicationService
      .listAllConversations()
      .filter((c) => c.institution_id === institutionId)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .slice(0, 5);
    return {
      answer:
        conversations.length > 0
          ? `Last five conversations: ${conversations.map((c) => `${c.display_name} (${c.lifecycle_state})`).join("; ")}.`
          : "No conversations to compare.",
      answer_es: "Últimas cinco conversaciones comparadas.",
      evidence: conversations.map((c) => c.canonical_id),
      advisory_only: true,
    };
  }

  const improvements = generateContinuousImprovements(institutionId, initiativeId ? { initiativeId } : undefined);
  return {
    answer: improvements.length
      ? `Top optimizations: ${improvements.slice(0, 3).map((r) => r.title).join("; ")}. All advisory — Humans must accept.`
      : "No urgent optimizations detected. Continue monitoring archived communications.",
    answer_es: "Optimizaciones sugeridas — todas consultivas.",
    related_optimizations: improvements.slice(0, 3).map((r) => r.optimization_id),
    advisory_only: true,
  };
}
