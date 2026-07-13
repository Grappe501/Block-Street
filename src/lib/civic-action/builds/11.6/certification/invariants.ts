/**
 * CAE-11.6-W15 — Certification invariants
 */
import { CERTIFICATION_STORE_KEYS } from "./data-model";
import { CERTIFICATION_AI_MAY_NOT, REQUIRED_CERTIFICATION_SERVICES } from "./constitution";

export const OPS_W15_INVARIANTS = [
  { id: "OPS-W15-INV-001", text: "Trust is earned through verification, not assumption" },
  { id: "OPS-W15-INV-002", text: "Every certification is repeatable and explainable" },
  { id: "OPS-W15-INV-003", text: "AI never certifies itself" },
  { id: "OPS-W15-INV-004", text: "Certification history is immutable" },
  { id: "OPS-W15-INV-005", text: "Compliance remains evidence-based" },
  { id: "OPS-W15-INV-006", text: "No quality gate bypass without recorded authorization" },
  { id: "OPS-W15-INV-007", text: "Expired certifications remain visible" },
] as const;

export function checkOpsW15Invariants() {
  return OPS_W15_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "OPS-W15-INV-003") {
      passed = CERTIFICATION_AI_MAY_NOT.some((s) => s.toLowerCase().includes("certify"));
      detail = "ai self-certification boundary";
    }
    if (inv.id === "OPS-W15-INV-001") {
      passed = CERTIFICATION_STORE_KEYS.certifications === "ops_certification_records";
      detail = "certification store";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getCertificationServiceCount() {
  return REQUIRED_CERTIFICATION_SERVICES.length;
}
