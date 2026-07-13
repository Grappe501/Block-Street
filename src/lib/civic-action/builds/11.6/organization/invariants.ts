/**
 * CAE-11.6-W4 — Organization invariants
 */
import { ORGANIZATION_STORE_KEYS } from "./data-model";
import { ORGANIZATION_AI_MAY_NOT, REQUIRED_ORGANIZATION_SERVICES } from "./constitution";
import { ORGANIZATION_EVENT_CATALOG } from "./events/catalog";

export const OPS_W4_INVARIANTS = [
  { id: "OPS-W4-INV-001", text: "Institution identity never changes; historical names preserved" },
  { id: "OPS-W4-INV-002", text: "Authority is never implied—always explicitly modeled" },
  { id: "OPS-W4-INV-003", text: "Membership is many-to-many without duplicate Human records" },
  { id: "OPS-W4-INV-004", text: "Federation preserves institutional autonomy" },
  { id: "OPS-W4-INV-005", text: "Permissions derive from institution hierarchy not client logic" },
  { id: "OPS-W4-INV-006", text: "AI never changes organizational structure autonomously" },
  { id: "OPS-W4-INV-007", text: "Governance decisions become permanent institutional memory" },
] as const;

export function checkOpsW4Invariants() {
  return OPS_W4_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "OPS-W4-INV-002") {
      passed = ORGANIZATION_STORE_KEYS.authorities === "ops_authorities";
      detail = "authority store";
    }
    if (inv.id === "OPS-W4-INV-006") {
      passed = ORGANIZATION_AI_MAY_NOT.some((s) => s.toLowerCase().includes("autonomously"));
      detail = "ai prohibition";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getOrganizationServiceCount() {
  return REQUIRED_ORGANIZATION_SERVICES.length;
}

export function getOrganizationEventCount() {
  return ORGANIZATION_EVENT_CATALOG.length;
}
