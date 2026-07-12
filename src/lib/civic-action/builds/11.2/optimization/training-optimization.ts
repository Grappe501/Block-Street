/**
 * CAE-11.2-W7 — Training optimization
 */
import { objectiveApplicationService } from "../application-service";
import { detectExecutionRisks } from "../intelligence/risk-intelligence";
import { extractLessons } from "./lesson-engine";

export function identifyTrainingNeeds(institutionId: string, initiativeId?: string): string[] {
  const needs: string[] = [];
  const lessons = extractLessons(institutionId, initiativeId ? { initiativeId } : undefined);

  const trainingLessons = lessons.filter((l) => /train|skill|onboard|procedure/i.test(l.observation + l.root_cause));
  if (trainingLessons.length > 0) {
    needs.push(
      `Training gap detected in ${trainingLessons.length} lesson(s) — consider onboarding refresh for mission owners.`
    );
  }

  const evidenceLessons = lessons.filter((l) => /evidence|document|record/i.test(l.observation));
  if (evidenceLessons.length >= 2) {
    needs.push("Evidence quality training recommended — repeated documentation gaps in lessons.");
  }

  const risks = detectExecutionRisks(institutionId, initiativeId);
  const capacityRisks = risks.filter((r) => r.risk_type === "capacity");
  if (capacityRisks.length > 0) {
    needs.push("Leadership delegation training — capacity risks detected across Objectives.");
  }

  let objectives = objectiveApplicationService
    .listAllObjectives()
    .filter((o) => o.institution_id === institutionId);
  if (initiativeId) objectives = objectives.filter((o) => o.initiative_id === initiativeId);

  const withoutRhythm = objectives.filter((o) => !o.review_rhythm && o.lifecycle_state === "active").length;
  if (withoutRhythm >= 2) {
    needs.push("Review procedure training — active Objectives missing review rhythm.");
  }

  if (needs.length === 0) {
    needs.push("No urgent training signals — continue monitoring completed Objective lessons.");
  }

  return needs;
}
