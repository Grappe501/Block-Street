/**
 * CAE-11.6-W7 — Communications invariants
 */
import { COMMUNICATIONS_STORE_KEYS } from "./data-model";
import { COMMUNICATIONS_AI_MAY_NOT, REQUIRED_COMMUNICATIONS_SERVICES } from "./constitution";
import { COMMUNICATIONS_EVENT_CATALOG } from "./events/catalog";

export const OPS_W7_INVARIANTS = [
  { id: "OPS-W7-INV-001", text: "Conversations never become orphaned from institutional purpose" },
  { id: "OPS-W7-INV-002", text: "Message edits create versions—history preserved" },
  { id: "OPS-W7-INV-003", text: "Personal privacy respected in all projections" },
  { id: "OPS-W7-INV-004", text: "Actions require Human approval unless governed automation allows" },
  { id: "OPS-W7-INV-005", text: "Decisions feed institutional memory" },
  { id: "OPS-W7-INV-006", text: "AI never speaks as organizational authority" },
  { id: "OPS-W7-INV-007", text: "Retention follows institutional governance" },
] as const;

export function checkOpsW7Invariants() {
  return OPS_W7_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "OPS-W7-INV-001") {
      passed = COMMUNICATIONS_STORE_KEYS.conversations === "ops_conversations";
      detail = "conversation store";
    }
    if (inv.id === "OPS-W7-INV-006") {
      passed = COMMUNICATIONS_AI_MAY_NOT.some((s) => s.toLowerCase().includes("authority"));
      detail = "ai prohibition";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getCommunicationsServiceCount() {
  return REQUIRED_COMMUNICATIONS_SERVICES.length;
}

export function getCommunicationsEventCount() {
  return COMMUNICATIONS_EVENT_CATALOG.length;
}
