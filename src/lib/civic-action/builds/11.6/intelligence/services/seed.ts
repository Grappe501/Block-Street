/**
 * CAE-11.6-W10 — Seed intelligence defaults
 */
import { nowIso } from "../../../../utils";
import { seedWorkflowsIfEmpty } from "../../workflows/services/seed";
import { readStoreSlice } from "./repository";
import { INTELLIGENCE_STORE_KEYS } from "../data-model";
import { saveForecast, saveInsight, saveRiskPrediction } from "./repository";

const NOW = nowIso();
const INSTITUTION = "inst-block-street";

export function seedIntelligenceIfEmpty() {
  seedWorkflowsIfEmpty();
  if (readStoreSlice(INTELLIGENCE_STORE_KEYS.insights).length > 0) return false;

  saveInsight({
    insight_id: "ins-training-readiness",
    institution_id: INSTITUTION,
    insight_type: "mission",
    title: "Training mission on track with volunteer capacity risk",
    summary: "Volunteer training mission progressing; monitor flyer inventory and orientation scheduling",
    confidence: 0.84,
    severity: "medium",
    priority: "medium",
    supporting_evidence: ["opm-volunteer-training-001", "ops_workforce_capacity", "inv-flyers-001"],
    affected_objects: ["opm-volunteer-training-001"],
    recommended_actions: ["Approve training materials budget", "Schedule orientation sessions"],
    reasoning_summary: "Mission health stable; resource constraint identified",
    known_unknowns: ["Volunteer registration rate"],
    assumptions: ["Current volunteer engagement continues"],
    advisory_only: true,
    created_at: NOW,
    expires_at: null,
    status: "active",
  });

  saveForecast({
    forecast_id: "frc-mission-completion",
    institution_id: INSTITUTION,
    forecast_type: "mission_completion",
    title: "Mission completion forecast",
    prediction: "Volunteer training mission likely to complete on schedule",
    confidence: 0.81,
    confidence_interval_low: 0.71,
    confidence_interval_high: 0.91,
    supporting_evidence: ["opm-volunteer-training-001", "ops_missions"],
    horizon: "monthly",
    created_at: NOW,
    expires_at: null,
    status: "active",
  });

  saveRiskPrediction({
    risk_id: "rsk-flyer-stock",
    institution_id: INSTITUTION,
    title: "Training flyer inventory below reorder threshold",
    likelihood: 0.75,
    impact: 0.6,
    earliest_warning: NOW,
    suggested_mitigation: "Approve procurement for flyer replenishment",
    confidence: 0.92,
    supporting_evidence: ["inv-flyers-001", "alt-flyer-stock"],
    created_at: NOW,
  });

  return true;
}
