/**
 * CAE-11.7-W7 — Decision learning outputs
 */
import { caeId } from "../../../utils";
import { COMMUNICATION_STORE_KEYS } from "../data-model";
import { readStoreSlice } from "../services/repository";
import type { DecisionRecord } from "../data-model";
import { analyzeDecisions, listPendingDecisions } from "../intelligence/decision-analysis";
import type { OptimizationConfidence, StructuredLesson } from "./contracts";

export function extractDecisionLessons(
  institutionId: string,
  options?: { initiativeId?: string }
): StructuredLesson[] {
  const lessons: StructuredLesson[] = [];
  let decisions = readStoreSlice<DecisionRecord>(COMMUNICATION_STORE_KEYS.decisions).filter(
    (d) => d.institution_id === institutionId
  );
  if (options?.initiativeId) decisions = decisions.filter((d) => d.initiative_id === options.initiativeId);

  const analysis = analyzeDecisions(institutionId, options?.initiativeId);
  const pending = listPendingDecisions(institutionId, options?.initiativeId);

  for (const decision of decisions.filter((d) => d.lifecycle_state === "approved" || d.lifecycle_state === "historical")) {
    const intel = analysis.find((a) => a.decision_id === decision.canonical_id);
    const daysOpen = intel?.days_since_decision ?? 0;

    if (daysOpen > 14 && intel?.pending_followup) {
      lessons.push({
        lesson_id: caeId("dles"),
        source_type: "decision",
        source_id: decision.canonical_id,
        source_name: decision.display_name,
        initiative_id: decision.initiative_id,
        observation: `Decision remained open ${daysOpen} days before resolution.`,
        root_cause: "Escalation path unclear or reviewers unavailable",
        recommendation: "Define decision SLA and escalation contacts in mission briefing template.",
        evidence: `${daysOpen} days open · ${intel?.related_mission_ids.length ?? 0} related missions`,
        applicability: "Governance decisions affecting multiple missions",
        confidence: daysOpen > 30 ? "strong_pattern" : "likely",
        occurred_at: decision.updated_at,
      });
    }
  }

  if (pending.length >= 3) {
    lessons.push({
      lesson_id: caeId("dles-pending"),
      source_type: "decision",
      source_id: "pending-queue",
      source_name: "Pending decision queue",
      initiative_id: options?.initiativeId ?? "",
      observation: `${pending.length} decisions currently pending review.`,
      root_cause: "Decision throughput below mission cadence",
      recommendation: "Schedule weekly decision review block with executive sponsor.",
      evidence: `${pending.length} pending decisions`,
      applicability: "Institution-wide decision governance",
      confidence: "observed" as OptimizationConfidence,
      occurred_at: new Date().toISOString(),
    });
  }

  return lessons.sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
}
