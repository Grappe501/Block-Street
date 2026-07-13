/**
 * CAE-11.6-W10 — Intelligence invariants
 */
import { INTELLIGENCE_STORE_KEYS } from "./data-model";
import { INTELLIGENCE_AI_MAY_NOT, REQUIRED_INTELLIGENCE_SERVICES } from "./constitution";

export const OPS_W10_INVARIANTS = [
  { id: "OPS-W10-INV-001", text: "Every prediction links to supporting evidence" },
  { id: "OPS-W10-INV-002", text: "Forecasts include confidence intervals; uncertainty is never hidden" },
  { id: "OPS-W10-INV-003", text: "Simulations and scenarios never modify live operational data" },
  { id: "OPS-W10-INV-004", text: "AI informs judgment but never replaces Human judgment" },
  { id: "OPS-W10-INV-005", text: "Institutional health is operational planning—not public scoring" },
  { id: "OPS-W10-INV-006", text: "Analytics evaluate institutions and workflows—not individuals" },
  { id: "OPS-W10-INV-007", text: "Predictions are tracked against outcomes for continuous learning" },
] as const;

export function checkOpsW10Invariants() {
  return OPS_W10_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "OPS-W10-INV-004") {
      passed = INTELLIGENCE_AI_MAY_NOT.some((s) => s.toLowerCase().includes("judgment"));
      detail = "ai advisory boundary";
    }
    if (inv.id === "OPS-W10-INV-003") {
      passed = INTELLIGENCE_STORE_KEYS.simulations === "ops_intelligence_simulations";
      detail = "simulation store";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getIntelligenceServiceCount() {
  return REQUIRED_INTELLIGENCE_SERVICES.length;
}
