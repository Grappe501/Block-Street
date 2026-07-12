/**
 * CAE-11.2-W3 — Objective Application Service
 */
import type { ExecutionCommandEnvelope, ExecutionCommandResult } from "./services/commands";
import { executionDomainService } from "./services/execution-engine";
import {
  loadObjective,
  listMissionsForObjective,
  listTasksForMission,
  listKeyResultsForObjective,
} from "./services/repository";
import { readStoreSlice } from "./services/repository";
import { EXECUTION_STORE_KEYS } from "./data-model";
import type { ObjectiveRecord, WorkstreamRecord } from "./data-model";

export class ObjectiveApplicationService {
  executeCommand(envelope: ExecutionCommandEnvelope, permissions?: string[]): ExecutionCommandResult {
    return executionDomainService.execute(envelope, permissions);
  }

  getObjective(objectiveId: string) {
    return loadObjective(objectiveId);
  }

  listObjectivesByInitiative(initiativeId: string): ObjectiveRecord[] {
    return readStoreSlice<ObjectiveRecord>(EXECUTION_STORE_KEYS.objectives).filter(
      (o) => o.initiative_id === initiativeId && o.lifecycle_state !== "archived"
    );
  }

  listAllObjectivesByInitiative(initiativeId: string): ObjectiveRecord[] {
    return readStoreSlice<ObjectiveRecord>(EXECUTION_STORE_KEYS.objectives).filter(
      (o) => o.initiative_id === initiativeId
    );
  }

  listAllObjectives(): ObjectiveRecord[] {
    return readStoreSlice<ObjectiveRecord>(EXECUTION_STORE_KEYS.objectives);
  }

  listWorkstreams(objectiveId: string): WorkstreamRecord[] {
    return readStoreSlice<WorkstreamRecord>(EXECUTION_STORE_KEYS.workstreams).filter(
      (w) => w.objective_id === objectiveId
    );
  }

  getObjectiveBundle(objectiveId: string) {
    const objective = loadObjective(objectiveId);
    if (!objective) return null;
    return {
      objective,
      workstreams: this.listWorkstreams(objectiveId),
      key_results: listKeyResultsForObjective(objectiveId),
      missions: listMissionsForObjective(objectiveId),
      tasks: listMissionsForObjective(objectiveId).flatMap((m) => listTasksForMission(m.canonical_id)),
    };
  }
}

export const objectiveApplicationService = new ObjectiveApplicationService();
