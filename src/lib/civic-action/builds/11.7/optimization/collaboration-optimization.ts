/**
 * CAE-11.7-W7 — Collaboration optimization
 */
import { nowIso } from "../../../utils";
import { analyzeResponseDelays } from "../intelligence/collaboration-intelligence";
import { detectUnansweredQuestions } from "../intelligence/conversation-analysis";
import type { CommunicationOptimization } from "./contracts";
import { isOptimizationRejected } from "./feedback-store";

export function analyzeCollaborationOptimization(
  institutionId: string,
  initiativeId?: string
): CommunicationOptimization[] {
  const recs: CommunicationOptimization[] = [];
  const delays = analyzeResponseDelays(institutionId, initiativeId);
  const highDelays = delays.filter((d) => d.delay_band === "high");
  const unanswered = detectUnansweredQuestions(institutionId, initiativeId);

  if (highDelays.length > 0) {
    const optId = "ci-collab-response";
    if (!isOptimizationRejected(optId, institutionId)) {
      recs.push({
        optimization_id: optId,
        category: "collaboration",
        title: "Reduce response time gaps",
        title_es: "Reducir brechas de tiempo de respuesta",
        what_changed: `${highDelays.length} thread(s) with elevated response delays.`,
        why: "Slow responses stall mission coordination and volunteer engagement.",
        why_es: "Respuestas lentas frenan la coordinación de misión.",
        confidence: highDelays.length >= 3 ? "strong_pattern" : "likely",
        evidence: highDelays.slice(0, 3).map((d) => ({
          signal_id: d.conversation_id,
          source: "response_delay",
          summary: `${d.delay_band} delay on ${d.display_name}`,
        })),
        expected_benefit: "Improved thread velocity and volunteer confidence.",
        potential_risk: "Pressure for speed may reduce deliberation quality.",
        who_should_review: "Mission leads and thread owners",
        suggested_action: "Establish response SLA and mention escalation paths.",
        initiative_id_optional: initiativeId,
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  if (unanswered.length >= 2) {
    const optId = "ci-collab-unanswered";
    if (!isOptimizationRejected(optId, institutionId)) {
      recs.push({
        optimization_id: optId,
        category: "collaboration",
        title: "Address unanswered questions in threads",
        title_es: "Responder preguntas sin contestar",
        what_changed: `${unanswered.length} question(s) detected without follow-up.`,
        why: "Unanswered questions signal coordination breakdown.",
        why_es: "Preguntas sin respuesta indican fallas de coordinación.",
        confidence: "observed",
        evidence: unanswered.slice(0, 3).map((q) => ({
          signal_id: q.thread_id,
          source: "unanswered_question",
          summary: q.excerpt.slice(0, 80),
        })),
        expected_benefit: "Clearer mission direction and fewer repeated questions.",
        potential_risk: "May require reassigning thread ownership.",
        who_should_review: "Thread moderators",
        suggested_action: "Assign owners to unanswered questions within 48 hours.",
        initiative_id_optional: initiativeId,
        advisory_only: true,
        generated_at: nowIso(),
      });
    }
  }

  return recs;
}
