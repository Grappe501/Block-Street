/**
 * CAE-11.7-W4 — Seed organizer defaults
 */
import { seedExecutiveIfEmpty } from "../../executive-assistant/services/seed";
import { organizerRuntime } from "./organizer-service";
import { readStoreSlice } from "./repository";
import { ORGANIZER_STORE_KEYS } from "../data-model";

const HUMAN = "usr-001";
const LOCALBRAIN = "lbr-usr-001";
const INSTITUTION = "inst-block-street";

export function seedOrganizerIfEmpty() {
  seedExecutiveIfEmpty();
  if (readStoreSlice(ORGANIZER_STORE_KEYS.dailyPlans).length > 0) return false;

  organizerRuntime.dailyPlanning.create({
    human_id: HUMAN,
    localbrain_id: LOCALBRAIN,
    institution_id: INSTITUTION,
    plan_type: "morning",
  });

  organizerRuntime.dependency.track({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    dependency_type: "approval",
    blocked_item: "Volunteer briefing finalization",
    blocking_item: "Attendance sheet approval",
    reason: "Treasurer review pending",
  });

  return true;
}
