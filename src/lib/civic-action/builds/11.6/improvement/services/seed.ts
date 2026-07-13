/**
 * CAE-11.6-W13 — Seed improvement defaults
 */
import { nowIso } from "../../../../utils";
import { seedFederationIfEmpty } from "../../federation/services/seed";
import { readStoreSlice } from "./repository";
import { IMPROVEMENT_STORE_KEYS } from "../data-model";
import { saveKPI, saveMeasurement, saveOutcome } from "./repository";

const NOW = nowIso();
const INSTITUTION = "inst-block-street";

export function seedImprovementIfEmpty() {
  seedFederationIfEmpty();
  if (readStoreSlice(IMPROVEMENT_STORE_KEYS.measurements).length > 0) return false;

  saveMeasurement({
    measurement_id: "msr-block-street-001",
    institution_id: INSTITUTION,
    measurement_type: "mission",
    subject: "Community Outreach Missions",
    objective: "Increase community engagement outcomes",
    metric: "citizens_engaged_per_mission",
    baseline: 50,
    target: 100,
    current_value: 72,
    confidence: 0.85,
    review_cycle: "quarterly",
    owner: "usr-001",
    status: "active",
    version: 1,
    created_at: NOW,
    updated_at: NOW,
  });

  saveKPI({
    kpi_id: "kpi-block-street-001",
    institution_id: INSTITUTION,
    definition: "Mission success rate",
    purpose: "Measure proportion of missions achieving stated outcomes",
    formula: "successful_missions / total_missions",
    owner: "usr-001",
    review_frequency: "monthly",
    target: 0.85,
    baseline: 0.7,
    evidence_sources: ["mission_execution", "outcome_records"],
    historical_trend: [
      { period: "2025-10", value: 0.72 },
      { period: "2025-11", value: 0.76 },
      { period: "2025-12", value: 0.8 },
    ],
    version: 1,
    status: "active",
    created_at: NOW,
    updated_at: NOW,
  });

  saveOutcome({
    outcome_id: "out-block-street-001",
    institution_id: INSTITUTION,
    outcome_type: "community_impact",
    subject: "Q4 Community Outreach",
    description: "Reached 12 communities with volunteer training programs",
    measured_value: 85,
    evidence_refs: ["mission-msr-001", "impact-report-q4"],
    impact_score: 0.85,
    recorded_at: NOW,
  });

  return true;
}
