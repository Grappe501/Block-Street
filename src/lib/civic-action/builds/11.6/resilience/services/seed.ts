/**
 * CAE-11.6-W11 — Seed resilience defaults
 */
import { nowIso } from "../../../../utils";
import { seedIntelligenceIfEmpty } from "../../intelligence/services/seed";
import { readStoreSlice } from "./repository";
import { RESILIENCE_STORE_KEYS } from "../data-model";
import { saveContinuityPlan } from "./repository";

const NOW = nowIso();
const INSTITUTION = "inst-block-street";

export function seedResilienceIfEmpty() {
  seedIntelligenceIfEmpty();
  if (readStoreSlice(RESILIENCE_STORE_KEYS.continuity_plans).length > 0) return false;

  saveContinuityPlan({
    continuity_plan_id: "cpl-mission-execution",
    institution_id: INSTITUTION,
    critical_function: "mission_execution",
    owner: "usr-001",
    risk_level: "high",
    activation_threshold: "Primary mission coordinator unavailable or facility inaccessible",
    recovery_objective: "Continue volunteer training mission within 4 hours",
    recovery_time_target: "4 hours",
    alternate_resources: ["Block Street Training Center", "Remote video conferencing"],
    alternate_personnel: ["usr-001", "backup-coordinator"],
    communications_plan: "SMS, email, and push notifications via emergency broadcast",
    dependencies: ["opm-volunteer-training-001", "fac-training-center", "ops_workforce"],
    status: "active",
    version: 1,
    created_at: NOW,
    updated_at: NOW,
  });

  saveContinuityPlan({
    continuity_plan_id: "cpl-communications",
    institution_id: INSTITUTION,
    critical_function: "communications",
    owner: "usr-001",
    risk_level: "medium",
    activation_threshold: "Primary communication channels disrupted",
    recovery_objective: "Restore institutional communications within 2 hours",
    recovery_time_target: "2 hours",
    alternate_resources: ["SMS backup", "Email backup", "Printed notices"],
    alternate_personnel: ["usr-001"],
    communications_plan: "Multi-channel emergency communications activation",
    dependencies: ["ops_communications", "ops_calendar"],
    status: "active",
    version: 1,
    created_at: NOW,
    updated_at: NOW,
  });

  return true;
}
