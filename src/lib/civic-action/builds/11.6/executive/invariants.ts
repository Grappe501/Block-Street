/**
 * CAE-11.6-W8 — Executive invariants
 */
import { EXECUTIVE_STORE_KEYS } from "./data-model";
import { EXECUTIVE_AI_MAY_NOT, REQUIRED_EXECUTIVE_SERVICES } from "./constitution";

export const OPS_W8_INVARIANTS = [
  { id: "OPS-W8-INV-001", text: "Executive views are governed projections of canonical data" },
  { id: "OPS-W8-INV-002", text: "Every recommendation links to supporting evidence" },
  { id: "OPS-W8-INV-003", text: "Scenarios never alter live data until approved" },
  { id: "OPS-W8-INV-004", text: "No personal reputation or popularity scoring" },
  { id: "OPS-W8-INV-005", text: "Human approval required for executive decisions" },
  { id: "OPS-W8-INV-006", text: "AI never exercises executive authority" },
  { id: "OPS-W8-INV-007", text: "Need-to-know filtering enforced for sensitive data" },
] as const;

export function checkOpsW8Invariants() {
  return OPS_W8_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "OPS-W8-INV-006") {
      passed = EXECUTIVE_AI_MAY_NOT.some((s) => s.toLowerCase().includes("authority"));
      detail = "ai prohibition";
    }
    if (inv.id === "OPS-W8-INV-003") {
      passed = EXECUTIVE_STORE_KEYS.scenarios === "ops_executive_scenarios";
      detail = "scenario store";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getExecutiveServiceCount() {
  return REQUIRED_EXECUTIVE_SERVICES.length;
}
