/**
 * CAE-11.2-W2 — Canonical model validation (no business logic)
 */
import type { MissionRecord, ObjectiveRecord, TaskRecord } from "./data-model";
import { childExceedsParent, isMissionTransitionAllowed, isObjectiveTransitionAllowed, isTaskTransitionAllowed } from "./state-machines";
import type { CanonicalMissionStatus, CanonicalObjectiveStatus, CanonicalTaskStatus } from "./data-model";

export interface ValidationIssue {
  code: string;
  field?: string;
  message: string;
}

export function validateObjectiveRecord(record: ObjectiveRecord): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!record.canonical_id) issues.push({ code: "OBJ-V-001", field: "canonical_id", message: "Permanent canonical ID required" });
  if (!record.initiative_id) issues.push({ code: "OBJ-V-002", field: "initiative_id", message: "Every Objective belongs to one Initiative" });
  if (!record.institution_id) issues.push({ code: "OBJ-V-003", field: "institution_id", message: "Institution ID required" });
  if (!record.executive_owner_human_id) issues.push({ code: "OBJ-V-004", message: "Executive owner required" });
  if (!record.operational_owner_human_id) issues.push({ code: "OBJ-V-005", message: "Operational owner required" });
  if (!record.purpose?.trim()) issues.push({ code: "OBJ-V-006", field: "purpose", message: "Purpose required" });
  if (!record.desired_future_state?.trim()) issues.push({ code: "OBJ-V-007", field: "desired_future_state", message: "Desired future state required" });
  if (record.executive_owner_human_id.startsWith("svc-")) {
    issues.push({ code: "OBJ-V-008", message: "Service identity cannot own Objectives" });
  }
  return issues;
}

export function validateTaskRecord(task: TaskRecord, mission?: MissionRecord | null): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!task.canonical_id) issues.push({ code: "OBJ-V-020", message: "Task canonical ID required" });
  if (!task.mission_id) issues.push({ code: "OBJ-V-021", field: "mission_id", message: "Orphan task prohibited — Task requires Mission" });
  if (!task.initiative_id) issues.push({ code: "OBJ-V-022", message: "Task must trace to Initiative" });
  if (mission && task.mission_id !== mission.canonical_id) {
    issues.push({ code: "OBJ-V-023", message: "Task mission_id mismatch" });
  }
  if (mission && childExceedsParent(task.lifecycle_state, mission.lifecycle_state)) {
    issues.push({ code: "OBJ-V-024", message: `Task state ${task.lifecycle_state} exceeds Mission state ${mission.lifecycle_state}` });
  }
  return issues;
}

export function validateObjectiveTransition(from: CanonicalObjectiveStatus, to: CanonicalObjectiveStatus): ValidationIssue[] {
  if (!isObjectiveTransitionAllowed(from, to)) {
    return [{ code: "OBJ-V-030", message: `Illegal Objective transition ${from} → ${to}` }];
  }
  return [];
}

export function validateMissionTransition(from: CanonicalMissionStatus, to: CanonicalMissionStatus): ValidationIssue[] {
  if (!isMissionTransitionAllowed(from, to)) {
    return [{ code: "OBJ-V-031", message: `Illegal Mission transition ${from} → ${to}` }];
  }
  return [];
}

export function validateTaskTransition(from: CanonicalTaskStatus, to: CanonicalTaskStatus): ValidationIssue[] {
  if (!isTaskTransitionAllowed(from, to)) {
    return [{ code: "OBJ-V-032", message: `Illegal Task transition ${from} → ${to}` }];
  }
  return [];
}

export function getValidationRules() {
  return {
    protocol: "11.2-W2",
    deletion: "soft_archive_only",
    orphan_work: "prohibited",
    id_recycling: "prohibited",
    reverse_inheritance: "prohibited",
  };
}
