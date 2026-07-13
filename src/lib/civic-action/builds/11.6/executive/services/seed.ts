/**
 * CAE-11.6-W8 — Seed executive defaults
 */
import { nowIso } from "../../../../utils";
import { seedCommunicationsIfEmpty } from "../../communications/services/seed";
import { readStoreSlice } from "./repository";
import { EXECUTIVE_STORE_KEYS } from "../data-model";
import type { ExecutiveAlertRecord, ExecutiveDecisionRecord, ExecutiveTimelineEntry } from "../data-model";
import { saveExecutiveAlert, saveExecutiveDecision, saveExecutiveTimelineEntry } from "./repository";

const NOW = nowIso();
const INSTITUTION = "inst-block-street";
const MISSION = "opm-volunteer-training-001";

export function seedExecutiveIfEmpty() {
  seedCommunicationsIfEmpty();
  if (readStoreSlice(EXECUTIVE_STORE_KEYS.decisions).length > 0) return false;

  const decision: ExecutiveDecisionRecord = {
    decision_id: "exd-training-budget",
    institution_id: INSTITUTION,
    question: "Approve additional training materials budget?",
    context: "Volunteer training mission requires flyer replenishment before kickoff",
    evidence: ["bud-mission-training", "inv-flyers-001"],
    options: ["Approve $500", "Defer to next quarter", "Request grant funding"],
    recommendation: "Approve $500 from mission budget—remaining balance sufficient",
    mission_impact: "Ensures training kickoff materials ready",
    financial_impact: "$500 from mission budget, $13,200 remaining",
    risk_analysis: "Low risk—inventory below reorder threshold",
    status: "awaiting_approval",
    assigned_to: "usr-001",
    approved_by: null,
    created_at: NOW,
  };
  saveExecutiveDecision(decision);

  const alert: ExecutiveAlertRecord = {
    alert_id: "alt-flyer-stock",
    institution_id: INSTITUTION,
    priority: "high",
    title: "Training flyer inventory below reorder threshold",
    what_happened: "Volunteer recruitment flyers at 500 units, threshold is 150",
    why_it_matters: "Training kickoff on August 15 requires adequate materials",
    affected_mission_ids: [MISSION],
    recommended_actions: ["Approve procurement request", "Review inventory forecast"],
    evidence_refs: ["inv-flyers-001", "bud-mission-training"],
    ai_confidence: 0.92,
    resolved: false,
    created_at: NOW,
  };
  saveExecutiveAlert(alert);

  const timeline: ExecutiveTimelineEntry = {
    entry_id: "tl-dec-training-venue",
    institution_id: INSTITUTION,
    entry_type: "decision",
    title: "Training venue confirmed",
    description: "Block Street Training Center selected for volunteer training kickoff",
    occurred_at: NOW,
    reference_id: "dec-training-venue",
  };
  saveExecutiveTimelineEntry(timeline);

  return true;
}
