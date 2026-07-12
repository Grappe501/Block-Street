import { itlId, nowIso } from "../utils";
import { loadLaunchPlans, persistLaunchPlans, loadWave7Flags } from "./data";
import type { IdentityLaunchPlan, IdentityLaunchStage } from "./types";

const STAGE_DEFINITIONS = [
  { stage_number: 0, name: "Shadow Validation", scope: "Read-only ITL evaluation" },
  { stage_number: 1, name: "Founding and Internal Operators", scope: "Founding Humans and identity staff" },
  { stage_number: 2, name: "Trusted Internal Cohort", scope: "Verified members, limited invitations" },
  { stage_number: 3, name: "One Institution", scope: "Full flow for single institution" },
  { stage_number: 4, name: "Multiple Institutions", scope: "Federation and context switching" },
  { stage_number: 5, name: "General Certified Availability", scope: "All certified institutions" },
];

export function createLaunchPlan(name: string): IdentityLaunchPlan {
  const stages: IdentityLaunchStage[] = STAGE_DEFINITIONS.map((s) => ({
    id: itlId("ils"),
    stage_number: s.stage_number,
    name: s.name,
    scope: s.scope,
    status: "pending",
    started_at: null,
    completed_at: null,
  }));

  const plan: IdentityLaunchPlan = {
    id: itlId("ilp"),
    name,
    current_stage: 0,
    stages,
    status: "draft",
    approved_by: null,
  };
  const all = loadLaunchPlans();
  all.push(plan);
  persistLaunchPlans(all);
  return plan;
}

export function approveLaunchPlan(planId: string, approvedBy: string) {
  const plans = loadLaunchPlans();
  const idx = plans.findIndex((p) => p.id === planId);
  if (idx < 0) throw new Error("Launch plan not found");
  plans[idx] = { ...plans[idx], status: "approved", approved_by: approvedBy };
  persistLaunchPlans(plans);
  return plans[idx];
}

export function startLaunchStage(planId: string, stageId: string) {
  const plans = loadLaunchPlans();
  const plan = plans.find((p) => p.id === planId);
  if (!plan) throw new Error("Launch plan not found");
  if (plan.status !== "approved" && plan.status !== "in_progress") {
    throw new Error("Launch plan must be approved before starting stages");
  }
  const stage = plan.stages.find((s) => s.id === stageId);
  if (!stage) throw new Error("Stage not found");

  stage.status = "active";
  stage.started_at = nowIso();
  plan.current_stage = stage.stage_number;
  plan.status = "in_progress";
  persistLaunchPlans(plans);
  return { plan, stage };
}

export function completeLaunchStage(planId: string, stageId: string) {
  const plans = loadLaunchPlans();
  const plan = plans.find((p) => p.id === planId);
  if (!plan) throw new Error("Launch plan not found");
  const stage = plan.stages.find((s) => s.id === stageId);
  if (!stage) throw new Error("Stage not found");

  stage.status = "completed";
  stage.completed_at = nowIso();
  if (plan.stages.every((s) => s.status === "completed")) plan.status = "completed";
  persistLaunchPlans(plans);
  return { plan, stage };
}

export function rollbackLaunchStage(planId: string, stageId: string) {
  const plans = loadLaunchPlans();
  const plan = plans.find((p) => p.id === planId);
  if (!plan) throw new Error("Launch plan not found");
  const stage = plan.stages.find((s) => s.id === stageId);
  if (!stage) throw new Error("Stage not found");

  stage.status = "rolled_back";
  stage.completed_at = nowIso();
  persistLaunchPlans(plans);
  return { plan, stage, rollback_principles: ["preserve_ledger_events", "no_public_signup", "maintain_ghid"] };
}

export function getKillSwitchStatus() {
  const flags = loadWave7Flags();
  return {
    invitations: Boolean(flags.IDENTITY_INVITATIONS_KILL_SWITCH),
    verification: Boolean(flags.IDENTITY_VERIFICATION_KILL_SWITCH),
    federation: Boolean(flags.IDENTITY_FEDERATION_KILL_SWITCH),
    intelligence: Boolean(flags.IDENTITY_INTELLIGENCE_KILL_SWITCH),
    read_only_emergency: Boolean(flags.IDENTITY_READ_ONLY_EMERGENCY_MODE),
  };
}

export function getLaunchReadiness() {
  const plans = loadLaunchPlans();
  const latest = plans.at(-1);
  const flags = loadWave7Flags();
  return {
    controlled_launch_enabled: Boolean(flags.IDENTITY_CONTROLLED_LAUNCH_ENABLED),
    production_certified: Boolean(flags.IDENTITY_PRODUCTION_CERTIFIED),
    latest_plan: latest ?? null,
    kill_switches: getKillSwitchStatus(),
    stages_defined: STAGE_DEFINITIONS.length,
  };
}
