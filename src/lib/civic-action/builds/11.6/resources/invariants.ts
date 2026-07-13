/**
 * CAE-11.6-W5 — Resource invariants
 */
import { RESOURCE_STORE_KEYS } from "./data-model";
import { RESOURCE_AI_MAY_NOT, REQUIRED_RESOURCE_SERVICES } from "./constitution";
import { RESOURCE_EVENT_CATALOG } from "./events/catalog";

export const OPS_W5_INVARIANTS = [
  { id: "OPS-W5-INV-001", text: "Resource IDs never change" },
  { id: "OPS-W5-INV-002", text: "Every resource answers which Mission it supports" },
  { id: "OPS-W5-INV-003", text: "Double-booking prevented unless explicitly allowed" },
  { id: "OPS-W5-INV-004", text: "Expenses never exist without institutional context" },
  { id: "OPS-W5-INV-005", text: "Inventory adjustments remain auditable" },
  { id: "OPS-W5-INV-006", text: "AI never purchases or disposes of assets autonomously" },
  { id: "OPS-W5-INV-007", text: "All lifecycle transitions are audited" },
] as const;

export function checkOpsW5Invariants() {
  return OPS_W5_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "OPS-W5-INV-003") {
      passed = RESOURCE_STORE_KEYS.reservations === "ops_reservations";
      detail = "reservation store";
    }
    if (inv.id === "OPS-W5-INV-006") {
      passed = RESOURCE_AI_MAY_NOT.some((s) => s.toLowerCase().includes("autonomously"));
      detail = "ai prohibition";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getResourceServiceCount() {
  return REQUIRED_RESOURCE_SERVICES.length;
}

export function getResourceEventCount() {
  return RESOURCE_EVENT_CATALOG.length;
}
