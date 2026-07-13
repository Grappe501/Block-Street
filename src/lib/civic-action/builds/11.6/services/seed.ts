/**
 * CAE-11.6-W1 — Seed strategic planning defaults
 */
import { caeId, nowIso } from "../../../utils";
import {
  saveGoal,
  saveKeyResult,
  saveMissionStatement,
  savePurpose,
  saveStrategicObjective,
  saveVision,
  writeStoreSlice,
} from "./repository";
import { STRATEGY_STORE_KEYS } from "../data-model";
import type {
  CoreValueRecord,
  StrategicGoalRecord,
  StrategicKeyResultRecord,
  StrategicObjectiveRecord,
  StrategicPillarRecord,
  MissionStatementRecord,
  PurposeRecord,
  VisionRecord,
} from "../data-model";
import { readStoreSlice } from "./repository";

const INSTITUTION = "inst-block-street";
const NOW = nowIso();

function base(idSuffix: string, name: string) {
  return {
    canonical_id: `str-${idSuffix}`,
    public_id: `pub-${idSuffix}`,
    institution_id: INSTITUTION,
    display_name: name,
    lifecycle_state: "active" as const,
    planning_horizon: "5_years" as const,
    priority: "high" as const,
    created_by: "usr-001",
    created_at: NOW,
    updated_at: NOW,
    version: 1,
  };
}

export function seedStrategicPlanningIfEmpty() {
  if (readStoreSlice(STRATEGY_STORE_KEYS.purposes).length > 0) return false;

  const purpose: PurposeRecord = {
    ...base("purpose-001", "Institutional Purpose"),
    object_type: "Purpose",
    title: "Why we exist",
    statement: "Strengthen civic participation through governed institutional action.",
    approved_version: 1,
    effective_date: NOW,
    approved_by: "usr-001",
  };
  savePurpose(purpose);

  const vision: VisionRecord = {
    ...base("vision-001", "Five-Year Vision"),
    object_type: "Vision",
    statement: "A community where every citizen can participate effectively in public life.",
    effective_date: NOW,
  };
  saveVision(vision);

  const mission: MissionStatementRecord = {
    ...base("mission-001", "Institutional Mission"),
    object_type: "MissionStatement",
    statement: "Equip institutions and volunteers with governed tools for learning, mission execution, and accountability.",
    institution_scope: "primary",
    effective_date: NOW,
  };
  saveMissionStatement(mission);

  const pillars: StrategicPillarRecord[] = [
    { ...base("pillar-edu", "Education"), object_type: "StrategicPillar", title: "Education", description: "Learning and competency development", owner_human_id: "usr-001" },
    { ...base("pillar-ops", "Operations"), object_type: "StrategicPillar", title: "Operations", description: "Mission execution excellence", owner_human_id: "usr-001" },
  ];
  writeStoreSlice(STRATEGY_STORE_KEYS.pillars, pillars);

  const goal: StrategicGoalRecord = {
    ...base("goal-001", "Improve Volunteer Training"),
    object_type: "StrategicGoal",
    pillar_id: pillars[0].canonical_id,
    title: "Improve Volunteer Training",
    description: "Increase certified volunteer readiness across programs.",
    start_date: NOW,
    target_date: NOW,
    owner_human_id: "usr-001",
  };
  saveGoal(goal);

  const objective: StrategicObjectiveRecord = {
    ...base("obj-001", "Launch Learning Academy"),
    object_type: "StrategicObjective",
    goal_id: goal.canonical_id,
    title: "Launch Learning Academy",
    description: "Deploy governed learning paths tied to mission competencies.",
    measurement_type: "completion_rate",
    owner_human_id: "usr-001",
  };
  saveStrategicObjective(objective);

  const kr: StrategicKeyResultRecord = {
    ...base("kr-001", "Learners certified"),
    object_type: "StrategicKeyResult",
    objective_id: objective.canonical_id,
    metric: "Certified learners",
    baseline: 0,
    target: 100,
    current_value: 12,
    confidence: 0.75,
  };
  saveKeyResult(kr);

  const values: CoreValueRecord[] = [
    {
      ...base("val-integrity", "Integrity"),
      object_type: "CoreValue",
      title: "Integrity",
      description: "Act with honesty and evidence.",
      behavior_examples: ["Cite sources", "Document decisions"],
      sort_order: 1,
    },
  ];
  writeStoreSlice(STRATEGY_STORE_KEYS.core_values, values);

  return true;
}
