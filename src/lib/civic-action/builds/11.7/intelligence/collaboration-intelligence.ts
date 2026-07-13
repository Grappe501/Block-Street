/**
 * CAE-11.7-W6 — Collaboration intelligence (response delays, flow patterns)
 */
import { communicationApplicationService } from "../application-service";

export type ResponseDelayInsight = {
  conversation_id: string;
  display_name: string;
  avg_response_hours: number;
  delay_band: "normal" | "elevated" | "high";
  explanation: string;
};

export type FlowPattern = {
  pattern_id: string;
  description: string;
  evidence: string;
};

function hoursBetween(a: string, b: string): number {
  return Math.abs(new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60);
}

export function analyzeResponseDelays(institutionId: string, initiativeId?: string): ResponseDelayInsight[] {
  let conversations = communicationApplicationService
    .listAllConversations()
    .filter((c) => c.institution_id === institutionId && c.lifecycle_state !== "archived");
  if (initiativeId) conversations = conversations.filter((c) => c.initiative_id === initiativeId);

  return conversations.map((conv) => {
    const bundle = communicationApplicationService.getConversationBundle(conv.canonical_id);
    if (!bundle || bundle.messages.length < 2) {
      return {
        conversation_id: conv.canonical_id,
        display_name: conv.display_name,
        avg_response_hours: 0,
        delay_band: "normal" as const,
        explanation: "Insufficient message history for delay analysis.",
      };
    }
    const sorted = [...bundle.messages].sort((a, b) => a.created_at.localeCompare(b.created_at));
    let totalHours = 0;
    let gaps = 0;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].author_human_id !== sorted[i - 1].author_human_id) {
        totalHours += hoursBetween(sorted[i - 1].created_at, sorted[i].created_at);
        gaps++;
      }
    }
    const avg = gaps > 0 ? totalHours / gaps : 0;
    const delay_band: ResponseDelayInsight["delay_band"] =
      avg >= 72 ? "high" : avg >= 24 ? "elevated" : "normal";
    return {
      conversation_id: conv.canonical_id,
      display_name: conv.display_name,
      avg_response_hours: Math.round(avg),
      delay_band,
      explanation:
        delay_band === "high"
          ? "Average cross-participant response exceeds 72 hours."
          : delay_band === "elevated"
            ? "Response times are slower than typical collaboration flow."
            : "Response times are within normal collaboration range.",
    };
  });
}

export function detectCollaborationFlowPatterns(institutionId: string, initiativeId?: string): FlowPattern[] {
  const delays = analyzeResponseDelays(institutionId, initiativeId);
  const elevated = delays.filter((d) => d.delay_band !== "normal").length;
  const patterns: FlowPattern[] = [];
  if (elevated > 0) {
    patterns.push({
      pattern_id: "flow-delay",
      description: `${elevated} conversation(s) show elevated response delays.`,
      evidence: "Derived from message timestamp gaps between different authors.",
    });
  }
  const unresolved = communicationApplicationService
    .listAllConversations()
    .filter((c) => c.institution_id === institutionId && c.lifecycle_state === "active").length;
  if (unresolved > 3) {
    patterns.push({
      pattern_id: "flow-active-load",
      description: "Multiple active conversations may dilute response attention.",
      evidence: `${unresolved} active conversations in scope.`,
    });
  }
  return patterns;
}
