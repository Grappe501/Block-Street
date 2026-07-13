/**
 * CAE-11.6 — Operations application facade
 */
import { strategicPlanningService } from "./services/strategic-planning-service";
import { seedStrategicPlanningIfEmpty } from "./services/seed";
import { missionExecutionService } from "./execution/services/mission-execution-service";
import { seedOperationalMissionsIfEmpty } from "./execution/services/seed";
import { workforceManagementService } from "./workforce/services/workforce-service";
import { seedWorkforceIfEmpty } from "./workforce/services/seed";

import { organizationService } from "./organization/services/organization-service";
import { seedOrganizationIfEmpty } from "./organization/services/seed";

let opsDataSeeded = false;

function ensureOpsDataSeeded() {
  if (opsDataSeeded) return;
  seedStrategicPlanningIfEmpty();
  seedOperationalMissionsIfEmpty();
  seedWorkforceIfEmpty();
  seedOrganizationIfEmpty();
  opsDataSeeded = true;
}

export class OperationsApplicationService {
  private boot() {
    ensureOpsDataSeeded();
  }

  getDashboard(institutionId: string) {
    this.boot();
    return strategicPlanningService.dashboard.build(institutionId);
  }

  getVision(institutionId: string) {
    this.boot();
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

  getWorkforceDashboard(institutionId: string) {
    return {
      personal: workforceManagementService.workforce.getPersonalWorkCenter("usr-001", institutionId),
      executive: workforceManagementService.executiveDashboard.build(institutionId),
      team: workforceManagementService.teamDashboard.build("Field Operations", institutionId),
    };
  }

  getWorkforceCapacity(institutionId: string) {
    return workforceManagementService.capacity.getOrganizationCapacity(institutionId);
  }

  listWorkforceAssignments(institutionId: string, humanId?: string) {
    return workforceManagementService.assignments.list(institutionId, humanId);
  }

  getTeamWorkCenter(team: string, institutionId: string) {
    return workforceManagementService.teamDashboard.build(team, institutionId);
  }

  listAvailability(institutionId: string, humanId?: string) {
    return workforceManagementService.availability.list(institutionId, humanId);
  }

  createAssignment(input: Parameters<typeof workforceManagementService.assignments.assign>[0]) {
    return workforceManagementService.assignments.assign(input);
  }

  delegateAssignment(input: Parameters<typeof workforceManagementService.delegation.delegate>[0]) {
    return workforceManagementService.delegation.delegate(input);
  }

  updateAvailability(input: Parameters<typeof workforceManagementService.availability.update>[0]) {
    return workforceManagementService.availability.update(input);
  }

  recordRecognition(input: Parameters<typeof workforceManagementService.recognition.award>[0]) {
    this.boot();
    return workforceManagementService.recognition.award(input);
  }

  listOpsInstitutions(federationId?: string) {
    this.boot();
    return organizationService.institutions.list(federationId);
  }

  getOpsInstitution(institutionId: string) {
    this.boot();
    return organizationService.institutions.get(institutionId);
  }

  createOpsInstitution(input: Parameters<typeof organizationService.institutions.create>[0]) {
    this.boot();
    return organizationService.institutions.create(input);
  }

  listOrganizationUnits(institutionId: string) {
    this.boot();
    return organizationService.units.list(institutionId);
  }

  getOrganizationTree(institutionId: string) {
    this.boot();
    return organizationService.units.tree(institutionId);
  }

  createOrganizationUnit(input: Parameters<typeof organizationService.units.create>[0]) {
    this.boot();
    return organizationService.units.create(input);
  }

  listGovernanceDecisions(institutionId: string) {
    this.boot();
    return organizationService.governance.listDecisions(institutionId);
  }

  recordGovernanceDecision(input: Parameters<typeof organizationService.governance.recordDecision>[0]) {
    this.boot();
    return organizationService.governance.recordDecision(input);
  }

  listOrgMemberships(institutionId: string, humanId?: string) {
    this.boot();
    return organizationService.membership.list(institutionId, humanId);
  }

  joinFederation(input: Parameters<typeof organizationService.federation.join>[0]) {
    this.boot();
    return organizationService.federation.join(input);
  }

  getFederationDashboard(federationId: string) {
    this.boot();
    return organizationService.federationDashboard.build(federationId);
  }
}

export const operationsApplicationService = new OperationsApplicationService();
