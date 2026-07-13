/**
 * CAE-11.7-W6 — Communication health scores
 */
import { caeId, nowIso } from "../../../utils";
import { analyzeMeetings } from "./meeting-analysis";
import { analyzeResponseDelays } from "./collaboration-intelligence";
import { detectUnansweredQuestions, analyzeThreadHealth } from "./conversation-analysis";
import { listPendingDecisions } from "./decision-analysis";
import type { CommunicationHealthSnapshot } from "./contracts";

function scoreFromBand(normal: number, elevated: number, high: number, total: number): number {
  if (total === 0) return 85;
  const penalty = elevated * 10 + high * 20;
  return Math.max(0, Math.min(100, 100 - Math.round((penalty / Math.max(total, 1)) * 10) - normal * 2));
}

export function computeCommunicationHealth(
  institutionId: string,
  initiativeId?: string
): CommunicationHealthSnapshot {
  const delays = analyzeResponseDelays(institutionId, initiativeId);
  const responseScore = scoreFromBand(
    delays.filter((d) => d.delay_band === "normal").length,
    delays.filter((d) => d.delay_band === "elevated").length,
    delays.filter((d) => d.delay_band === "high").length,
    delays.length
  );

  const pending = listPendingDecisions(institutionId, initiativeId);
  const decisionLatencyScore = Math.max(0, 100 - pending.length * 15);

  const meetings = analyzeMeetings(institutionId, initiativeId);
  const efficient = meetings.filter((m) => m.efficiency_band === "efficient").length;
  const meetingScore =
    meetings.length > 0 ? Math.round((efficient / meetings.length) * 100) : 80;

  const unanswered = detectUnansweredQuestions(institutionId, initiativeId);
  const threads = analyzeThreadHealth(institutionId, initiativeId);
  const stalled = threads.filter((t) => t.health_band === "stalled").length;

  const avg = Math.round((responseScore + decisionLatencyScore + meetingScore) / 3);
  const overall_health_band: CommunicationHealthSnapshot["overall_health_band"] =
    avg >= 75 ? "healthy" : avg >= 50 ? "watch" : "strained";

  return {
    snapshot_id: caeId("chs"),
    institution_id: institutionId,
    initiative_id_optional: initiativeId,
    generated_at: nowIso(),
    response_time_score: responseScore,
    decision_latency_score: decisionLatencyScore,
    meeting_efficiency_score: meetingScore,
    overall_health_band,
    unanswered_questions: unanswered.length,
    stalled_threads: stalled,
    pending_decisions: pending.length,
    advisory_only: true,
  };
}
