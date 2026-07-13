/**
 * CAE-11.7-W3 — Seed executive assistant defaults
 */
import { seedContextIfEmpty } from "../../context/services/seed";
import { executiveAssistantRuntime } from "./executive-assistant-service";
import { readStoreSlice } from "./repository";
import { EXECUTIVE_STORE_KEYS } from "../data-model";

const HUMAN = "usr-001";
const LOCALBRAIN = "lbr-usr-001";
const INSTITUTION = "inst-block-street";

export function seedExecutiveIfEmpty() {
  seedContextIfEmpty();
  executiveAssistantRuntime.capabilities.initialize();
  if (readStoreSlice(EXECUTIVE_STORE_KEYS.roleContext).length > 0) return false;

  executiveAssistantRuntime.role.resolve({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    localbrain_id: LOCALBRAIN,
    role_id: "role-executive",
  });

  executiveAssistantRuntime.commitment.suggest({
    human_id: HUMAN,
    localbrain_id: LOCALBRAIN,
    institution_id: INSTITUTION,
    commitment_text: "Send revised volunteer briefing outline",
    source_type: "meeting_notes",
    source_id: "notes-partner-meeting",
    due_at: new Date(Date.now() + 24 * 3600000).toISOString(),
  });

  return true;
}
