import { itlId, nowIso } from "../utils";
import { loadContinuityDrills, persistContinuityDrills } from "./data";
import type { IdentityContinuityDrill } from "./types";

const DRILL_SCENARIOS = [
  "identity_service_outage",
  "invitation_service_failure",
  "verification_projection_failure",
  "database_restore",
  "global_account_compromise",
  "institution_isolation_failure",
  "malicious_operator",
  "notification_failure",
];

export function startContinuityDrill(scenario: string, environment = "staging"): IdentityContinuityDrill {
  const drill: IdentityContinuityDrill = {
    id: itlId("icd"),
    scenario,
    environment,
    started_at: nowIso(),
    completed_at: null,
    expected_controls: getExpectedControls(scenario),
    observed_result: "pending",
    recovery_time_ms: null,
    status: "in_progress",
  };
  const all = loadContinuityDrills();
  all.push(drill);
  persistContinuityDrills(all);
  return drill;
}

function getExpectedControls(scenario: string): string[] {
  const map: Record<string, string[]> = {
    identity_service_outage: ["read_only_mode", "no_bypass_path", "queued_recovery"],
    global_account_compromise: ["session_revocation", "minimum_notice", "single_global_recovery"],
    invitation_service_failure: ["token_security", "idempotent_resend"],
    database_restore: ["gap_detection", "post_restore_reconciliation"],
  };
  return map[scenario] ?? ["audit_preserved", "no_identity_bypass"];
}

export function completeContinuityDrill(drillId: string, observedResult: string, passed: boolean, recoveryTimeMs?: number) {
  const drills = loadContinuityDrills();
  const idx = drills.findIndex((d) => d.id === drillId);
  if (idx < 0) throw new Error("Drill not found");
  drills[idx] = {
    ...drills[idx],
    completed_at: nowIso(),
    observed_result: observedResult,
    recovery_time_ms: recoveryTimeMs ?? null,
    status: passed ? "passed" : "failed",
  };
  persistContinuityDrills(drills);
  return drills[idx];
}

export function listContinuityDrills() {
  return loadContinuityDrills();
}

export function listRequiredDrillScenarios() {
  return DRILL_SCENARIOS;
}
