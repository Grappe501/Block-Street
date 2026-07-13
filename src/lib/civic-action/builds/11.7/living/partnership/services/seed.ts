/**
 * CAE-11.7-W10 — Seed partnership defaults
 */
import { seedAgentsIfEmpty } from "../../agents/services/seed";
import { readStoreSlice } from "./repository";
import { PARTNERSHIP_STORE_KEYS } from "../data-model";
import { partnershipRuntime } from "./partnership-service";

const HUMAN = "usr-001";
const INSTITUTION = "inst-block-street";

export function seedPartnershipIfEmpty() {
  seedAgentsIfEmpty();
  if (readStoreSlice(PARTNERSHIP_STORE_KEYS.recommendations).length > 0) return false;

  const rec = partnershipRuntime.recommendations.create({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    subject: "County immersion expansion",
    recommendation: "Proceed with phased expansion to two additional counties after legal review.",
    evidence: ["Research network county monitoring", "Organizer capacity report", "Prediction forecast"],
  });

  partnershipRuntime.trust.calibrate({
    recommendation_id: rec.recommendation.recommendation_id,
    institution_id: INSTITUTION,
  });

  partnershipRuntime.selfEvaluation.evaluate({
    recommendation_id: rec.recommendation.recommendation_id,
    institution_id: INSTITUTION,
    evidence_sufficient: true,
    confidence_appropriate: true,
  });

  partnershipRuntime.wisdom.accumulate({
    institution_id: INSTITUTION,
    title: "County readiness validation",
    lesson: "Always validate county partner capacity before announcing expansion.",
    best_practice: true,
  });

  partnershipRuntime.health.measure(INSTITUTION);

  partnershipRuntime.collaboration.activate({
    institution_id: INSTITUTION,
    human_id: HUMAN,
    pattern: "executive_support",
    context: "County expansion decision preparation",
  });

  partnershipRuntime.transparency.recordGovernanceChange({
    institution_id: INSTITUTION,
    change_type: "approval_workflow",
    title: "Multi-county expansion approval",
    summary: "Require executive and legal sign-off before county expansion announcements.",
    approved_by: HUMAN,
  });

  return true;
}
