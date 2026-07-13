/**
 * CAE-11.6 — Operations application facade
 */
import { strategicPlanningService } from "./services/strategic-planning-service";
import { seedStrategicPlanningIfEmpty } from "./services/seed";
import { missionExecutionService } from "./execution/services/mission-execution-service";
import { seedOperationalMissionsIfEmpty } from "./execution/services/seed";

export class OperationsApplicationService {
  constructor() {
    seedStrategicPlanningIfEmpty();
    seedOperationalMissionsIfEmpty();
  }

  getDashboard(institutionId: string) {
    return strategicPlanningService.dashboard.build(institutionId);
  }

  getVision(institutionId: string) {
    return strategicPlanningService.vision.getActive(institutionId);
  }

  getMissionStatement(institutionId: string) {
    return strategicPlanningService.mission.getActive(institutionId);
  }

  listGoals(institutionId: string, pillarId?: string) {
    return strategicPlanningService.goals.list(institutionId, pillarId);
  }

  listObjectives(institutionId: string, goalId?: string) {
    return strategicPlanningService.objectives.list(institutionId, goalId);
  }

  listKeyResults(institutionId: string, objectiveId?: string) {
    return strategicPlanningService.keyResults.list(institutionId, objectiveId);
  }

  createGoal(input: Parameters<typeof strategicPlanningService.goals.create>[0]) {
    return strategicPlanningService.goals.create(input);
  }

  createObjective(input: Parameters<typeof strategicPlanningService.objectives.create>[0]) {
    return strategicPlanningService.objectives.create(input);
  }

  createKeyResult(input: Parameters<typeof strategicPlanningService.keyResults.create>[0]) {
    return strategicPlanningService.keyResults.create(input);
  }

  completeReview(input: Parameters<typeof strategicPlanningService.reviews.complete>[0]) {
    return strategicPlanningService.reviews.complete(input);
  }

  explainWork(trace: Parameters<typeof strategicPlanningService.ai.explainContribution>[0]) {
    return strategicPlanningService.ai.explainContribution(trace);
  }

  listMissions(institutionId: string) {
    return missionExecutionService.missions.list(institutionId);
  }

  getOperationalMission(missionId: string) {
    return missionExecutionService.missions.get(missionId);
  }

  createMission(input: Parameters<typeof missionExecutionService.missions.create>[0]) {
    return missionExecutionService.missions.create(input);
  }

  updateMission(missionId: string, fields: Parameters<typeof missionExecutionService.missions.update>[1]) {
    return missionExecutionService.missions.update(missionId, fields);
  }

  getMissionHealth(missionId: string) {
    return missionExecutionService.health.buildDashboard(missionId);
  }

  getMissionTimeline(missionId: string) {
    return missionExecutionService.calendar.timeline(missionId);
  }

  getMissionCommunications(missionId: string) {
    return missionExecutionService.communications.list(missionId);
  }

  createMissionTask(input: Parameters<typeof missionExecutionService.tasks.create>[0]) {
    return missionExecutionService.tasks.create(input);
  }

  recordMissionEvidence(input: Parameters<typeof missionExecutionService.evidence.record>[0]) {
    return missionExecutionService.evidence.record(input);
  }

  completeMission(missionId: string, actorId: string) {
    return missionExecutionService.lifecycle.complete(missionId, actorId);
  }

  getMissionIntelligence(missionId: string) {
    return missionExecutionService.intelligence.analyze(missionId);
  }
}

export const operationsApplicationService = new OperationsApplicationService();
