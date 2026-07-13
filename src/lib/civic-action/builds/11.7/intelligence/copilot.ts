/**
 * CAE-11.7-W6 — Communication copilot (keyword router; advisory only)
 */
import { communicationApplicationService } from "../application-service";
import { generateExecutiveCommunicationBrief } from "./executive-brief";
import { detectDuplicateConversations } from "./duplicate-detection";
import { computeCommunicationHealth } from "./communication-health";
import { buildKnowledgeGraph } from "./relationship-discovery";
import { parseNaturalLanguageQuery } from "./search-intelligence";
import type { CopilotResponse } from "./contracts";
import { AI_PROHIBITED_ACTIONS } from "./contracts";

const GOVERNANCE_NOTE =
  "This copilot recommends and explains only. It cannot approve, send, decide, archive, or change Communication state.";

export function runCommunicationCopilotQuery(
  query: string,
  institutionId: string,
  actorHumanId: string,
  options?: { initiativeId?: string; conversationId?: string }
): CopilotResponse {
  const q = query.toLowerCase().trim();

  if (prohibitedIntent(q)) {
    return {
      query,
      intent: "prohibited_action",
      answer: `I cannot perform that action. Prohibited: ${AI_PROHIBITED_ACTIONS.join(", ")}.`,
      answer_es: "No puedo realizar esa acción — requiere decisión humana gobernada.",
      confidence: "very_high",
      evidence: [{ signal_id: "governance", source: "com_intelligence_constitution", summary: "AI prohibited actions" }],
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("health") || q.includes("strained") || q.includes("stalled")) {
    const health = computeCommunicationHealth(institutionId, options?.initiativeId);
    return {
      query,
      intent: "health",
      answer: `Communication health: ${health.overall_health_band}. Response ${health.response_time_score}, decisions ${health.decision_latency_score}, meetings ${health.meeting_efficiency_score}.`,
      answer_es: `Salud de comunicación: ${health.overall_health_band}.`,
      confidence: "high",
      evidence: [{ signal_id: health.snapshot_id, source: "communication_health", summary: health.overall_health_band }],
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("duplicate") || q.includes("overlap") || q.includes("similar")) {
    const dupes = detectDuplicateConversations(institutionId, options?.initiativeId, 0.55).slice(0, 3);
    return {
      query,
      intent: "duplicates",
      answer: dupes.length
        ? `Possible duplicates: ${dupes.map((d) => `${d.name_a} ↔ ${d.name_b}`).join("; ")}`
        : "No strong duplicate candidates at current thresholds.",
      answer_es: dupes.length ? "Posibles duplicados detectados." : "No se detectaron duplicados fuertes.",
      confidence: dupes.length ? "medium" : "low",
      evidence: dupes.map((d) => ({
        signal_id: `${d.conversation_id_a}-${d.conversation_id_b}`,
        source: "duplicate_detection",
        summary: d.similarity_label,
      })),
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (q.includes("brief") || q.includes("executive") || q.includes("summarize") || q.includes("today")) {
    const brief = generateExecutiveCommunicationBrief(institutionId, actorHumanId, options?.initiativeId);
    return {
      query,
      intent: "executive_brief",
      answer: `At risk: ${brief.conversations_at_risk}. Momentum: ${brief.communication_momentum}. Priorities: ${brief.todays_priorities.length}.`,
      answer_es: `En riesgo: ${brief.conversations_at_risk}. Prioridades: ${brief.todays_priorities.length}.`,
      confidence: "high",
      evidence: [{ signal_id: brief.brief_id, source: "executive_brief", summary: "portfolio scan" }],
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  if (options?.conversationId) {
    const graph = buildKnowledgeGraph(options.conversationId, "conversation", institutionId);
    const conv = communicationApplicationService.getConversation(options.conversationId);
    return {
      query,
      intent: "conversation_context",
      answer: graph
        ? `Conversation "${conv?.display_name}" has ${graph.node_count} nodes (${graph.edge_count} relationships). Ask about health, duplicates, or decisions.`
        : "Conversation not found in scope.",
      answer_es: "Contexto de conversación disponible. Pregunta por salud o duplicados.",
      confidence: "medium",
      evidence: [{ signal_id: options.conversationId, source: "knowledge_graph", summary: `${graph?.node_count ?? 0} nodes` }],
      advisory_only: true,
      governance_note: GOVERNANCE_NOTE,
    };
  }

  const parsed = parseNaturalLanguageQuery(query, { initiativeId: options?.initiativeId });
  const matches = communicationApplicationService
    .listAllConversations()
    .filter((c) => c.institution_id === institutionId)
    .filter((c) => {
      const text = `${c.display_name} ${c.purpose}`.toLowerCase();
      return parsed.keywords.some((w) => w.length > 3 && text.includes(w));
    });

  return {
    query,
    intent: parsed.intent,
    answer: matches.length
      ? `Found ${matches.length} conversation(s): ${matches.map((m) => m.display_name).join(", ")}`
      : "Ask about health, duplicates, decisions, or a conversation name.",
    answer_es: matches.length ? `Encontré ${matches.length} conversación(es).` : "Pregunta por salud, duplicados o decisiones.",
    confidence: matches.length ? "medium" : "low",
    evidence: matches.slice(0, 5).map((m) => ({
      signal_id: m.canonical_id,
      source: "conversation_search",
      summary: m.display_name,
    })),
    advisory_only: true,
    governance_note: GOVERNANCE_NOTE,
  };
}

function prohibitedIntent(q: string): boolean {
  return (
    q.includes("approve") ||
    q.includes("send") ||
    q.includes("post message") ||
    q.includes("decide") ||
    q.includes("record decision") ||
    q.includes("archive") ||
    q.includes("delete") ||
    q.includes("invite") ||
    q.includes("publish")
  );
}

export function explainCommunicationInsight(
  topic: string,
  institutionId: string,
  conversationId?: string
): CopilotResponse {
  return runCommunicationCopilotQuery(`explain ${topic}`, institutionId, "system", { conversationId });
}
