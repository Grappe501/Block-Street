/**
 * CAE-11.2-W3 — Execution engine service tests
 */
import { caeId, nowIso } from "../../utils";
import { initiativeDomainService } from "../11.1/services/domain-service";
import type { InitiativeCommandEnvelope } from "../11.1/services/commands";
import { executionDomainService, assertExecutionMutationViaService } from "./services/execution-engine";
import type { ExecutionCommandEnvelope } from "./services/commands";
import { assertObjectiveTransition } from "./services/validation-pipeline";
import { isServiceOrAiIdentity } from "./services/policy";
import { detectCircularExecutionDependency } from "./services/dependency-engine";
import { readStoreSlice } from "./services/repository";
import { EXECUTION_STORE_KEYS } from "./data-model";
import { loadObjective } from "./services/repository";
import { EXECUTION_DOMAIN_EVENTS_KEY } from "./services/repository";

function iniEnvelope(
  partial: Partial<InitiativeCommandEnvelope> & { command_type: InitiativeCommandEnvelope["command_type"]; payload?: Record<string, unknown> }
): InitiativeCommandEnvelope {
  return {
    command_id: caeId("cmd"),
    command_type: partial.command_type,
    actor_human_id: partial.actor_human_id ?? "usr-001",
    institution_id: partial.institution_id ?? "inst-block-street",
    active_membership_id: partial.active_membership_id ?? "mem-001",
    initiative_id_optional: partial.initiative_id_optional ?? null,
    expected_version_optional: partial.expected_version_optional ?? null,
    requested_at: nowIso(),
    request_id: caeId("req"),
    correlation_id: caeId("cor"),
    idempotency_key: partial.idempotency_key ?? null,
    reason_optional: partial.reason_optional ?? null,
    payload: partial.payload ?? {},
  };
}

function exeEnvelope(
  partial: Partial<ExecutionCommandEnvelope> & {
    command_type: ExecutionCommandEnvelope["command_type"];
    initiative_id: string;
    payload?: Record<string, unknown>;
  }
): ExecutionCommandEnvelope {
  return {
    command_id: caeId("cmd"),
    command_type: partial.command_type,
    actor_human_id: partial.actor_human_id ?? "usr-001",
    institution_id: partial.institution_id ?? "inst-block-street",
    active_membership_id: partial.active_membership_id ?? "mem-001",
    initiative_id: partial.initiative_id,
    entity_id_optional: partial.entity_id_optional ?? null,
    expected_version_optional: partial.expected_version_optional ?? null,
    requested_at: nowIso(),
    request_id: caeId("req"),
    correlation_id: caeId("cor"),
    idempotency_key: partial.idempotency_key ?? null,
    reason_optional: partial.reason_optional ?? null,
    request_source: partial.request_source ?? "human",
    payload: partial.payload ?? {},
  };
}

export interface W3TestResult {
  name: string;
  passed: boolean;
  detail?: string;
}

export function runObjW3ServiceTests(): W3TestResult[] {
  const results: W3TestResult[] = [];
  const assert = (name: string, condition: boolean, detail?: string) => {
    results.push({ name, passed: condition, detail });
  };

  // Lifecycle: draft→approved rejected without proposed
  try {
    assertObjectiveTransition("draft", "approved", "test");
    assert("draft→approved rejected", false);
  } catch {
    assert("draft→approved rejected", true);
  }

  assert("service identity detected", isServiceOrAiIdentity("svc-bot-001"));

  try {
    assertExecutionMutationViaService();
    assert("direct mutation forbidden", false);
  } catch {
    assert("direct mutation forbidden", true);
  }

  const cycle = detectCircularExecutionDependency("m1", "m2", [
    {
      dependency_id: "d1",
      institution_id: "inst",
      initiative_id: "ini",
      source_entity_id: "m2",
      source_entity_type: "Mission",
      target_entity_id: "m1",
      target_entity_type: "Mission",
      dependency_type: "requires",
      created_at: nowIso(),
    },
  ]);
  assert("circular dependency detected", cycle);

  const draftIni = initiativeDomainService.execute(
    iniEnvelope({
      command_type: "CreateInitiativeDraftCommand",
      payload: {
        governing_institution_id: "inst-block-street",
        initiative_name: `W3 Exec Test ${Date.now()}`,
        initiative_type: "program",
        initial_problem_or_opportunity: "Test execution engine",
        proposed_operational_owner_optional: "usr-002",
        visibility: "institution_internal",
      },
    })
  );
  assert("initiative draft for tests", draftIni.success);
  const iniId = draftIni.initiative_id!;

  const created = executionDomainService.execute(
    exeEnvelope({
      command_type: "CreateObjective",
      initiative_id: iniId,
      payload: {
        initiative_id: iniId,
        display_name: "Register 500 voters",
        objective_type: "campaign",
        purpose: "Increase voter registration",
        desired_future_state: "500 new registrations",
        current_state: "0 registrations",
        executive_owner_human_id: "usr-001",
        operational_owner_human_id: "usr-002",
        review_authority_human_id: "usr-001",
        success_definition: "500 net new registrations",
        measurement_strategy: "Roll comparison",
        evidence_requirements: "Registration reports",
      },
    })
  );
  assert("create objective", created.success && created.new_status_optional === "draft");
  const objId = created.entity_id!;

  const approveFromDraft = executionDomainService.execute(
    exeEnvelope({
      command_type: "ApproveObjective",
      initiative_id: iniId,
      entity_id_optional: objId,
    })
  );
  assert("approve from draft blocked", !approveFromDraft.success);

  executionDomainService.execute(
    exeEnvelope({ command_type: "ProposeObjective", initiative_id: iniId, entity_id_optional: objId })
  );
  const approved = executionDomainService.execute(
    exeEnvelope({ command_type: "ApproveObjective", initiative_id: iniId, entity_id_optional: objId })
  );
  assert("propose then approve", approved.success && approved.new_status_optional === "approved");

  const objective = loadObjective(objId)!;
  const workstream = readStoreSlice<import("./data-model").WorkstreamRecord>(EXECUTION_STORE_KEYS.workstreams).find(
    (w) => w.objective_id === objId
  )!;
  const missionCreated = executionDomainService.execute(
    exeEnvelope({
      command_type: "CreateMission",
      initiative_id: iniId,
      payload: {
        objective_id: objId,
        workstream_id: workstream.canonical_id,
        display_name: "County canvass",
        summary: "Door-to-door registration",
        purpose: "Register voters in target county",
        operational_lead_human_id: "usr-002",
      },
    })
  );
  assert("create mission", missionCreated.success);
  const missionId = missionCreated.entity_id!;

  const startBlocked = executionDomainService.execute(
    exeEnvelope({
      command_type: "StartMission",
      initiative_id: iniId,
      entity_id_optional: missionId,
    })
  );
  assert("mission start blocked on non-active objective", !startBlocked.success);

  const taskCreated = executionDomainService.execute(
    exeEnvelope({
      command_type: "CreateTask",
      initiative_id: iniId,
      payload: { mission_id: missionId, description: "Print flyers" },
    })
  );
  assert("create task", taskCreated.success);

  const versions = readStoreSlice<import("./data-model").ExecutionVersionRecord>(EXECUTION_STORE_KEYS.versions);
  assert("version records created", versions.length >= 2, `${versions.length} versions`);

  const events = readStoreSlice<{ event_id: string }>(EXECUTION_DOMAIN_EVENTS_KEY);
  assert("events published", events.length >= 3, `${events.length} events`);

  const svcCmd = executionDomainService.execute(
    exeEnvelope({
      command_type: "CreateObjective",
      initiative_id: iniId,
      actor_human_id: "svc-bot-001",
      payload: {
        initiative_id: iniId,
        display_name: "AI objective",
        objective_type: "campaign",
        purpose: "x",
        desired_future_state: "y",
        current_state: "z",
        executive_owner_human_id: "usr-001",
        operational_owner_human_id: "usr-002",
        review_authority_human_id: "usr-001",
        success_definition: "s",
        measurement_strategy: "m",
        evidence_requirements: "e",
      },
    })
  );
  assert("service identity command rejected", !svcCmd.success);

  return results;
}

export function allW3TestsPassed(): boolean {
  return runObjW3ServiceTests().every((t) => t.passed);
}
