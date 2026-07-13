/**
 * CAE-11.6-W1 — Operations application facade
 */
import { strategicPlanningService } from "./services/strategic-planning-service";
import { seedStrategicPlanningIfEmpty } from "./services/seed";

export class OperationsApplicationService {
  constructor() {
    seedStrategicPlanningIfEmpty();
  }

  getDashboard(institutionId: string) {
    return strategicPlanningService.dashboard.build(institutionId);
  }

  getVision(institutionId: string) {
    return strategicPlanningService.vision.getActive(institutionId);
  }

  getMission(institutionId: string) {
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
}

export const operationsApplicationService = new OperationsApplicationService();
