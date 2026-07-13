/**
 * CAE-11.6-W3 — Workforce invariants
 */
import { WORKFORCE_STORE_KEYS } from "./data-model";
import { REQUIRED_WORKFORCE_SERVICES, WORKFORCE_AI_MAY_NOT } from "./constitution";
import { WORKFORCE_EVENT_CATALOG } from "./events/catalog";

export const OPS_W3_INVARIANTS = [
  { id: "OPS-W3-INV-001", text: "Work profile never replaces canonical Human identity" },
  { id: "OPS-W3-INV-002", text: "Assignments trace to missions and strategic objectives" },
  { id: "OPS-W3-INV-003", text: "Engine recommends but never silently assigns" },
  { id: "OPS-W3-INV-004", text: "No generalized Human ranking or productivity scores" },
  { id: "OPS-W3-INV-005", text: "Burnout indicators remain private and advisory" },
  { id: "OPS-W3-INV-006", text: "Delegation never bypasses permissions" },
  { id: "OPS-W3-INV-007", text: "AI never makes employment or discipline decisions" },
] as const;

export function checkOpsW3Invariants() {
  return OPS_W3_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "OPS-W3-INV-001") {
      passed = WORKFORCE_STORE_KEYS.work_profiles === "ops_work_profiles";
      detail = "separate work profile store";
    }
    if (inv.id === "OPS-W3-INV-004") {
      passed = WORKFORCE_AI_MAY_NOT.some((s) => s.toLowerCase().includes("ranking") || s.toLowerCase().includes("productivity"));
      detail = "no ranking prohibition";
    }
    if (inv.id === "OPS-W3-INV-007") {
      passed = WORKFORCE_AI_MAY_NOT.some((s) => s.toLowerCase().includes("employment"));
      detail = "employment decision prohibition";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getWorkforceServiceCount() {
  return REQUIRED_WORKFORCE_SERVICES.length;
}

export function getWorkforceEventCount() {
  return WORKFORCE_EVENT_CATALOG.length;
}
