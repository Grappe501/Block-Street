/**
 * CAE-11.7-W8 — Seed prediction defaults
 */
import { seedLearningIfEmpty } from "../../learning/services/seed";
import { readStoreSlice } from "./repository";
import { PREDICTION_STORE_KEYS } from "../data-model";
import { predictionRuntime } from "./prediction-service";

const HUMAN = "usr-001";
const INSTITUTION = "inst-block-street";

export function seedPredictionIfEmpty() {
  seedLearningIfEmpty();
  if (readStoreSlice(PREDICTION_STORE_KEYS.forecasts).length > 0) return false;

  predictionRuntime.forecasts.run({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    subject: "County immersion launch",
    summary: "Expected case: launch proceeds with 2-week buffer if county match confirmed.",
    time_horizon: "90d",
    assumptions: ["County match confirmed by August", "Volunteer growth 10% monthly"],
  });

  predictionRuntime.scenarios.create({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    scenario_type: "expected_case",
    title: "County Immersion — Expected Case",
    description: "Baseline scenario with current volunteer and funding trajectory.",
  });

  predictionRuntime.trends.evaluate(INSTITUTION, "volunteer_growth");
  predictionRuntime.trends.evaluate(INSTITUTION, "mission_completion");

  predictionRuntime.risks.forecast({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    category: "operational",
    title: "Volunteer capacity shortfall",
    summary: "Projected facilitator gap in Q3 without additional recruitment.",
    evidence: ["Organizer workload report", "Mission volunteer roster trend"],
    likelihood: "moderate",
    impact: "high",
  });

  predictionRuntime.opportunities.forecast({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    title: "Regional nonprofit partnership window",
    domain: "partnerships",
    description: "Three counties showing increased partner engagement signals.",
    evidence: ["Research network county monitoring", "Conversation intelligence partner mentions"],
    time_window: "Q3 2026",
  });

  predictionRuntime.resources.model({
    institution_id: INSTITUTION,
    resource_type: "volunteers",
    current_capacity: 45,
    projected_need: 62,
    time_horizon: "1y",
  });

  predictionRuntime.missions.model({
    institution_id: INSTITUTION,
    mission_id: "msn-block-street-001",
    success_probability: 0.72,
  });

  predictionRuntime.planning.create({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    horizon: "3y",
    vision: "Expand civic university model to 12 counties with certified volunteer network.",
  });

  return true;
}
