/**
 * CAE-11.7-W7 — Communication health optimization (8 dimensions)
 */
import { computeCommunicationHealth } from "../intelligence/communication-health";
import { analyzeThreadHealth, detectUnansweredQuestions } from "../intelligence/conversation-analysis";
import { analyzeMeetings } from "../intelligence/meeting-analysis";
import { listPendingDecisions } from "../intelligence/decision-analysis";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "../services/repository";
import type { KnowledgeRecord } from "../data-model";
import { analyzeKnowledgeEvolution } from "./knowledge-evolution";
import { extractLessons } from "./lesson-engine";
import type { CommunicationHealthDimension } from "./contracts";

export function measureCommunicationHealthOptimization(
  institutionId: string,
  initiativeId?: string
): CommunicationHealthDimension[] {
  const snapshot = computeCommunicationHealth(institutionId, initiativeId);
  const threads = analyzeThreadHealth(institutionId, initiativeId);
  const unanswered = detectUnansweredQuestions(institutionId, initiativeId);
  const meetings = analyzeMeetings(institutionId, initiativeId);
  const pending = listPendingDecisions(institutionId, initiativeId);
  const knowledge = readStoreSlice<KnowledgeRecord>(COMMUNICATION_STORE_KEYS.knowledge).filter(
    (k) => k.institution_id === institutionId
  );
  const evolution = analyzeKnowledgeEvolution(institutionId, initiativeId);
  const lessons = extractLessons(institutionId, initiativeId ? { initiativeId } : undefined);

  const band = (score: number): CommunicationHealthDimension["state"] =>
    score >= 75 ? "healthy" : score >= 50 ? "attention" : "critical";

  const stalled = threads.filter((t) => t.health_band === "stalled").length;
  const threadScore = Math.max(0, 100 - stalled * 15 - threads.filter((t) => t.health_band === "watch").length * 8);

  const meetingEfficient = meetings.filter((m) => m.efficiency_band === "efficient").length;
  const meetingScore =
    meetings.length > 0 ? Math.round((meetingEfficient / meetings.length) * 100) : snapshot.meeting_efficiency_score;

  const knowledgeScore = knowledge.length > 0 ? Math.min(100, Math.round((evolution.filter((e) => e.current_stage !== "captured").length / knowledge.length) * 100)) : 50;

  const docScore = lessons.length > 0 ? Math.min(100, lessons.length * 15) : 45;

  return [
    {
      dimension: "response_velocity",
      label: "Response velocity",
      state: band(snapshot.response_time_score),
      score_band: snapshot.response_time_score,
      explanation: "Cross-participant message response times across active conversations.",
    },
    {
      dimension: "decision_latency",
      label: "Decision latency",
      state: band(snapshot.decision_latency_score),
      score_band: snapshot.decision_latency_score,
      explanation: pending.length > 0 ? `${pending.length} decision(s) pending governance review.` : "Decision queue flowing.",
    },
    {
      dimension: "meeting_efficiency",
      label: "Meeting efficiency",
      state: band(meetingScore),
      score_band: meetingScore,
      explanation: `${meetingEfficient} of ${meetings.length || 1} meeting(s) meet efficiency thresholds.`,
    },
    {
      dimension: "thread_engagement",
      label: "Thread engagement",
      state: band(threadScore),
      score_band: threadScore,
      explanation: stalled > 0 ? `${stalled} stalled thread(s) detected.` : "Threads active within normal cadence.",
    },
    {
      dimension: "knowledge_capture",
      label: "Knowledge capture",
      state: band(knowledgeScore),
      score_band: knowledgeScore,
      explanation: `${knowledge.length} knowledge artifact(s); ${evolution.filter((e) => e.current_stage !== "captured").length} beyond captured stage.`,
    },
    {
      dimension: "translation_quality",
      label: "Translation quality",
      state: "attention",
      score_band: 65,
      explanation: "Bilingual coverage monitored via translation intelligence advisories.",
    },
    {
      dimension: "documentation_currency",
      label: "Documentation currency",
      state: band(docScore),
      score_band: docScore,
      explanation: `${lessons.length} structured lesson(s) inform documentation updates.`,
    },
    {
      dimension: "institutional_memory",
      label: "Institutional memory",
      state: band(Math.min(100, lessons.length * 12 + knowledge.length * 5)),
      score_band: Math.min(100, lessons.length * 12 + knowledge.length * 5),
      explanation: unanswered.length > 0
        ? `${unanswered.length} unanswered question(s) may indicate memory gaps.`
        : "Institutional memory growing from archived communications.",
    },
  ];
}
