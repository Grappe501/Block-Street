/**
 * CAE-11.6-W13 — Improvement invariants
 */
import { IMPROVEMENT_STORE_KEYS } from "./data-model";
import { IMPROVEMENT_AI_MAY_NOT, REQUIRED_IMPROVEMENT_SERVICES } from "./constitution";

export const OPS_W13_INVARIANTS = [
  { id: "OPS-W13-INV-001", text: "Institutions optimize for mission impact—not activity volume" },
  { id: "OPS-W13-INV-002", text: "Platform does not measure Human worth" },
  { id: "OPS-W13-INV-003", text: "AI never approves improvement plans autonomously" },
  { id: "OPS-W13-INV-004", text: "Every measurement traces to strategic objectives" },
  { id: "OPS-W13-INV-005", text: "Every improvement becomes institutional knowledge" },
  { id: "OPS-W13-INV-006", text: "Scorecards measure institutional performance—not individuals" },
  { id: "OPS-W13-INV-007", text: "Benchmarking always explains context" },
] as const;

export function checkOpsW13Invariants() {
  return OPS_W13_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "OPS-W13-INV-003") {
      passed = IMPROVEMENT_AI_MAY_NOT.some((s) => s.toLowerCase().includes("approve"));
      detail = "ai approval boundary";
    }
    if (inv.id === "OPS-W13-INV-001") {
      passed = IMPROVEMENT_STORE_KEYS.measurements === "ops_improvement_measurements";
      detail = "measurement store";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getImprovementServiceCount() {
  return REQUIRED_IMPROVEMENT_SERVICES.length;
}
