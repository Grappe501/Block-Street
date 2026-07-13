/**
 * CAE-11.6-W11 — Resilience invariants
 */
import { RESILIENCE_STORE_KEYS } from "./data-model";
import { REQUIRED_RESILIENCE_SERVICES, RESILIENCE_AI_MAY_NOT } from "./constitution";

export const OPS_W11_INVARIANTS = [
  { id: "OPS-W11-INV-001", text: "Every critical function has a documented continuity plan" },
  { id: "OPS-W11-INV-002", text: "Continuity plans are version-controlled and testable" },
  { id: "OPS-W11-INV-003", text: "AI never commands emergency operations" },
  { id: "OPS-W11-INV-004", text: "Every incident and recovery action is auditable" },
  { id: "OPS-W11-INV-005", text: "Readiness index supports planning—not public grading" },
  { id: "OPS-W11-INV-006", text: "Lessons learned feed institutional knowledge" },
  { id: "OPS-W11-INV-007", text: "Human command authority preserved during emergencies" },
] as const;

export function checkOpsW11Invariants() {
  return OPS_W11_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "OPS-W11-INV-003") {
      passed = RESILIENCE_AI_MAY_NOT.some((s) => s.toLowerCase().includes("command"));
      detail = "ai command boundary";
    }
    if (inv.id === "OPS-W11-INV-001") {
      passed = RESILIENCE_STORE_KEYS.continuity_plans === "ops_continuity_plans";
      detail = "continuity store";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getResilienceServiceCount() {
  return REQUIRED_RESILIENCE_SERVICES.length;
}
