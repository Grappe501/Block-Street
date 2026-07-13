/**
 * CAE-11.6-W1 — Strategic planning services
 */
import { caeId, nowIso } from "../../../utils";
import { OPS_GOVERNING_PRINCIPLE } from "../constitution";
import {
  getActiveMission,
  getActivePurpose,
  getActiveVision,
  listGoals,
  listKeyResults,
  listPillars,
  listPrograms,
  listProjects,
  listReviews,
  listStrategicObjectives,
  saveGoal,
  saveKeyResult,
  saveReview,
  saveStrategicObjective,
} from "./repository";
import type {
  StrategicGoalRecord,
  StrategicKeyResultRecord,
  StrategicObjectiveRecord,
  StrategicReviewRecord,
} from "../data-model";
import { explainWhyWeAreDoingThis } from "../traceability";

const DEFAULT_INSTITUTION = "inst-block-street";

function baseFields(institutionId: string, displayName: string) {
  const now = nowIso();
  return {
    canonical_id: caeId("str"),
    public_id: caeId("pub"),
    institution_id: institutionId,
    display_name: displayName,
    lifecycle_state: "active" as const,
    planning_horizon: "1_year" as const,
    priority: "high" as const,
    created_by: "system",
    created_at: now,
    updated_at: now,
    version: 1,
  };
}

export const visionService = {
  getActive: (institutionId = DEFAULT_INSTITUTION) => getActiveVision(institutionId),
};

export const missionService = {
  getActive: (institutionId = DEFAULT_INSTITUTION) => getActiveMission(institutionId),
};

export const goalService = {
  list: (institutionId = DEFAULT_INSTITUTION, pillarId?: string) => listGoals(institutionId, pillarId),
  create(input: { institution_id: string; pillar_id: string; title: string; description: string; owner_human_id: string }) {
    const record: StrategicGoalRecord = {
      ...baseFields(input.institution_id, input.title),
      object_type: "StrategicGoal",
      pillar_id: input.pillar_id,
      title: input.title,
      description: input.description,
      start_date: nowIso(),
      target_date: nowIso(),
      owner_human_id: input.owner_human_id,
    };
    saveGoal(record);
    return record;
  },
};

export const objectiveService = {
  list: (institutionId = DEFAULT_INSTITUTION, goalId?: string) => listStrategicObjectives(institutionId, goalId),
  create(input: {
    institution_id: string;
    goal_id: string;
    title: string;
    description: string;
    measurement_type: string;
    owner_human_id: string;
  }) {
    const record: StrategicObjectiveRecord = {
      ...baseFields(input.institution_id, input.title),
      object_type: "StrategicObjective",
      goal_id: input.goal_id,
      title: input.title,
      description: input.description,
      measurement_type: input.measurement_type,
      owner_human_id: input.owner_human_id,
    };
    saveStrategicObjective(record);
    return record;
  },
};

export const keyResultService = {
  list: (institutionId = DEFAULT_INSTITUTION, objectiveId?: string) => listKeyResults(institutionId, objectiveId),
  create(input: {
    institution_id: string;
    objective_id: string;
    metric: string;
    baseline: number;
    target: number;
    current_value?: number;
  }) {
    if (!input.objective_id) throw new Error("Key Results require a parent Strategic Objective");
    const record: StrategicKeyResultRecord = {
      ...baseFields(input.institution_id, input.metric),
      object_type: "StrategicKeyResult",
      objective_id: input.objective_id,
      metric: input.metric,
      baseline: input.baseline,
      target: input.target,
      current_value: input.current_value ?? input.baseline,
      confidence: 0.7,
    };
    saveKeyResult(record);
    return record;
  },
};

export const reviewService = {
  list: (institutionId = DEFAULT_INSTITUTION) => listReviews(institutionId),
  complete(input: {
    institution_id: string;
    review_cycle: StrategicReviewRecord["review_cycle"];
    what_changed: string;
    lessons_learned: string[];
    recommendations: string[];
  }) {
    const record: StrategicReviewRecord = {
      ...baseFields(input.institution_id, `${input.review_cycle} strategic review`),
      object_type: "StrategicReview",
      review_cycle: input.review_cycle,
      what_changed: input.what_changed,
      new_risks: [],
      completed_objectives: [],
      missed_objectives: [],
      lessons_learned: input.lessons_learned,
      recommendations: input.recommendations,
      completed_at: nowIso(),
    };
    saveReview(record);
    return record;
  },
};

export const executiveDashboardService = {
  build(institutionId = DEFAULT_INSTITUTION) {
    const purpose = getActivePurpose(institutionId);
    const vision = getActiveVision(institutionId);
    const mission = getActiveMission(institutionId);
    const pillars = listPillars(institutionId);
    const goals = listGoals(institutionId);
    const objectives = listStrategicObjectives(institutionId);
    const keyResults = listKeyResults(institutionId);
    const programs = listPrograms(institutionId);
    const projects = listProjects(institutionId);
    const reviews = listReviews(institutionId);

    const krProgress =
      keyResults.length > 0
        ? Math.round(
            keyResults.reduce((sum, kr) => {
              const range = kr.target - kr.baseline || 1;
              return sum + Math.min(1, Math.max(0, (kr.current_value - kr.baseline) / range));
            }, 0) / keyResults.length * 100
          )
        : 0;

    return {
      governing_question: OPS_GOVERNING_PRINCIPLE,
      mission_health: mission ? "defined" : "undefined",
      purpose,
      vision,
      mission,
      pillar_count: pillars.length,
      goal_count: goals.length,
      objective_count: objectives.length,
      key_result_progress_pct: krProgress,
      program_count: programs.length,
      project_count: projects.length,
      upcoming_reviews: reviews.slice(-3),
      critical_risks: [],
      ai_executive_summary:
        "Strategic planning hierarchy is active. Review goal progress and key results before the next quarterly review.",
      generated_at: nowIso(),
    };
  },
};

export const aiStrategyAdvisor = {
  explainContribution(trace: {
    vision_id: string | null;
    mission_id: string | null;
    pillar_id: string | null;
    goal_id: string | null;
    objective_id: string | null;
    key_result_id: string | null;
  }) {
    return {
      explanation: explainWhyWeAreDoingThis(trace),
      advisory_only: true,
      confidence: 0.85,
      sources: ["strategic_hierarchy"],
      limitations: ["AI does not approve or change strategic plans"],
    };
  },
};

export const strategicPlanningService = {
  vision: visionService,
  mission: missionService,
  goals: goalService,
  objectives: objectiveService,
  keyResults: keyResultService,
  reviews: reviewService,
  dashboard: executiveDashboardService,
  ai: aiStrategyAdvisor,
};
