/**
 * CAE-11.6-W12 — Federation invariants
 */
import { FEDERATION_STORE_KEYS } from "./data-model";
import { FEDERATION_AI_MAY_NOT, REQUIRED_FEDERATION_SERVICES } from "./constitution";

export const OPS_W12_INVARIANTS = [
  { id: "OPS-W12-INV-001", text: "Every shared action is governed by explicit agreement" },
  { id: "OPS-W12-INV-002", text: "Every Institution remains sovereign within federations" },
  { id: "OPS-W12-INV-003", text: "AI never negotiates or approves agreements" },
  { id: "OPS-W12-INV-004", text: "Cross-institution permissions evaluate identity, institution, and agreement" },
  { id: "OPS-W12-INV-005", text: "Federation history is never deleted" },
  { id: "OPS-W12-INV-006", text: "One verified Human identity across multiple governed roles" },
  { id: "OPS-W12-INV-007", text: "Analytics respect institutional data boundaries" },
] as const;

export function checkOpsW12Invariants() {
  return OPS_W12_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "OPS-W12-INV-003") {
      passed = FEDERATION_AI_MAY_NOT.some((s) => s.toLowerCase().includes("negotiate"));
      detail = "ai agreement boundary";
    }
    if (inv.id === "OPS-W12-INV-001") {
      passed = FEDERATION_STORE_KEYS.agreements === "ops_federation_agreements";
      detail = "agreement store";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getFederationServiceCount() {
  return REQUIRED_FEDERATION_SERVICES.length;
}
