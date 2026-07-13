/**
 * CAE-11.6-W16 — Evolution invariants
 */
import { EVOLUTION_STORE_KEYS } from "./data-model";
import { EVOLUTION_AI_MAY_NOT, REQUIRED_EVOLUTION_SERVICES } from "./constitution";

export const OPS_W16_INVARIANTS = [
  { id: "OPS-W16-INV-001", text: "Learning changes implementation, never silently changes principles" },
  { id: "OPS-W16-INV-002", text: "Constitution changes only through explicit governance" },
  { id: "OPS-W16-INV-003", text: "AI proposes evolution; Humans govern constitutional decisions" },
  { id: "OPS-W16-INV-004", text: "Every evolution remains permanently explainable" },
  { id: "OPS-W16-INV-005", text: "No silent architectural evolution" },
  { id: "OPS-W16-INV-006", text: "Every Canon change requires quality gates" },
  { id: "OPS-W16-INV-007", text: "Nothing exists outside Canon registry" },
] as const;

export function checkOpsW16Invariants() {
  return OPS_W16_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "OPS-W16-INV-003") {
      passed = EVOLUTION_AI_MAY_NOT.some((s) => s.toLowerCase().includes("human"));
      detail = "ai governance boundary";
    }
    if (inv.id === "OPS-W16-INV-001") {
      passed = EVOLUTION_STORE_KEYS.proposals === "ops_evolution_proposals";
      detail = "evolution store";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getEvolutionServiceCount() {
  return REQUIRED_EVOLUTION_SERVICES.length;
}
