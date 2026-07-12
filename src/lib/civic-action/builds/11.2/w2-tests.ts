/**
 * CAE-11.2-W2 — Canonical data model protocol tests
 */
import { CANONICAL_EXECUTION_ENTITIES } from "./entity-registry";
import { EXECUTION_STORE_KEYS } from "./data-model";
import { validateObjectiveRecord, validateTaskRecord } from "./data-validation";
import { childExceedsParent } from "./state-machines";
import { buildTraceabilityChain, explainTaskExistence } from "./traceability";
import { getVersioningRules } from "./versioning";
import { runObjW2Certification } from "./w2";
import type { ObjectiveRecord, TaskRecord } from "./data-model";

export type W2TestResult = { name: string; passed: boolean; detail?: string };

const sampleObjective = (): ObjectiveRecord => ({
  canonical_id: "obj-test-1",
  public_id: "OBJ-001",
  display_name: "Register 5000 voters",
  canonical_slug: "register-5000-voters",
  institution_id: "inst-1",
  initiative_id: "ini-1",
  parent_object_id: "ini-1",
  parent_object_type: "Initiative",
  object_type: "Objective",
  visibility: "institution_internal",
  governance_classification: 3,
  executive_owner_human_id: "human-exec",
  operational_owner_human_id: "human-ops",
  current_responsible_human_id: "human-ops",
  created_by: "human-ops",
  last_modified_by: "human-ops",
  created_at: "2026-07-12T00:00:00Z",
  updated_at: "2026-07-12T00:00:00Z",
  current_version: 1,
  lifecycle_state: "draft",
  tags: [],
  objective_type: "campaign",
  purpose: "Increase youth voter registration",
  desired_future_state: "5000 new registrations",
  current_state: "3200 registrations",
  review_authority_human_id: "human-exec",
  target_start: "2026-01-01",
  target_finish: "2026-12-31",
  review_rhythm: "monthly",
  priority: 1,
  strategic_alignment: "mission-youth",
  success_definition: "5000 net new registrations",
  measurement_strategy: "Secretary of state roll",
  evidence_requirements: "Registration reports",
  parent_initiative_status_at_creation: "active",
});

export function runObjW2ModelTests(): W2TestResult[] {
  const results: W2TestResult[] = [];

  results.push({
    name: "entity_registry",
    passed: CANONICAL_EXECUTION_ENTITIES.length === 14,
    detail: CANONICAL_EXECUTION_ENTITIES.join(", "),
  });

  results.push({
    name: "store_keys",
    passed: Object.keys(EXECUTION_STORE_KEYS).length >= 14,
    detail: `${Object.keys(EXECUTION_STORE_KEYS).length} keys`,
  });

  const objIssues = validateObjectiveRecord(sampleObjective());
  results.push({ name: "objective_validation", passed: objIssues.length === 0 });

  const orphanTask: TaskRecord = {
    ...sampleObjective(),
    object_type: "Task",
    lifecycle_state: "draft",
    canonical_id: "task-orphan",
    mission_id: "",
    description: "Orphan",
    priority: 1,
    estimated_effort_hours: null,
    actual_effort_hours: null,
    assigned_team_ids: [],
    completion_timestamp: null,
  };
  const orphanIssues = validateTaskRecord(orphanTask);
  results.push({
    name: "orphan_task_rejected",
    passed: orphanIssues.some((i) => i.code === "OBJ-V-021"),
  });

  results.push({
    name: "child_exceeds_parent",
    passed: childExceedsParent("active", "draft") === true && childExceedsParent("draft", "active") === false,
  });

  const chain = buildTraceabilityChain({
    task: { entity_type: "Task", entity_id: "t1", display_name: "Call partner" },
    mission: { entity_type: "Mission", entity_id: "m1", display_name: "County launch" },
    workstream: { entity_type: "Workstream", entity_id: "w1", display_name: "Outreach" },
    objective: { entity_type: "Objective", entity_id: "o1", display_name: "Register voters" },
    initiative: { entity_type: "Initiative", entity_id: "i1", display_name: "Youth vote" },
    institution: { entity_type: "Institution", entity_id: "inst", display_name: "Block Street" },
  });
  results.push({
    name: "traceability_chain",
    passed: chain.length === 6 && explainTaskExistence(chain).includes("Register voters"),
  });

  results.push({
    name: "versioning_triggers",
    passed: getVersioningRules().triggers.length >= 7,
  });

  const cert = runObjW2Certification();
  results.push({
    name: "protocol_w2_gates",
    passed: cert.gates.filter((g) => g.id.startsWith("CAE-11.2-W2-G")).every((g) => g.passed),
    detail: `${cert.gates.filter((g) => g.passed).length}/${cert.gates.length}`,
  });

  return results;
}

export function allW2TestsPassed(): boolean {
  return runObjW2ModelTests().every((t) => t.passed);
}
