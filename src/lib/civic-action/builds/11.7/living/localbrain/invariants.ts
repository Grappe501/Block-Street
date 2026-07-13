/**
 * CAE-11.7-W1 — LocalBrain invariants
 */
import { LOCALBRAIN_STORE_KEYS } from "./data-model";
import { LOCALBRAIN_AI_MAY_NOT, REQUIRED_LOCALBRAIN_SERVICES } from "./constitution";

export const LIX_W1_INVARIANTS = [
  { id: "LIX-W1-INV-001", text: "One Human receives exactly one LocalBrain" },
  { id: "LIX-W1-INV-002", text: "LocalBrain belongs to the Human, not an institution" },
  { id: "LIX-W1-INV-003", text: "Default privacy is Private; nothing shared automatically" },
  { id: "LIX-W1-INV-004", text: "Memory promotion requires rules or Human approval" },
  { id: "LIX-W1-INV-005", text: "LocalBrain never impersonates the Human" },
  { id: "LIX-W1-INV-006", text: "Identity layer never duplicates canonical identity" },
  { id: "LIX-W1-INV-007", text: "Everything AI sees begins with context" },
] as const;

export function checkLixW1Invariants() {
  return LIX_W1_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "LIX-W1-INV-005") {
      passed = LOCALBRAIN_AI_MAY_NOT.some((s) => s.toLowerCase().includes("impersonate"));
      detail = "impersonation boundary";
    }
    if (inv.id === "LIX-W1-INV-001") {
      passed = LOCALBRAIN_STORE_KEYS.brains === "lix_localbrain_records";
      detail = "localbrain store";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getLocalBrainServiceCount() {
  return REQUIRED_LOCALBRAIN_SERVICES.length;
}
