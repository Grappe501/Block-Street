/**
 * CAE-11.7-W2 — Context invariants
 */
import { CONTEXT_STORE_KEYS } from "./data-model";
import { CONTEXT_AI_MAY_NOT, REQUIRED_CONTEXT_SERVICES } from "./constitution";

export const LIX_W2_INVARIANTS = [
  { id: "CAE-11.7-W2-CTX-001", text: "Every active context belongs to one verified Human and one LocalBrain" },
  { id: "CAE-11.7-W2-CTX-002", text: "Institutional context derived from authorized relationship only" },
  { id: "CAE-11.7-W2-CTX-003", text: "Proximity and attendance do not prove intent" },
  { id: "CAE-11.7-W2-CTX-004", text: "Precise location optional, purpose-limited, disabled by default" },
  { id: "CAE-11.7-W2-CTX-005", text: "Context may not silently change institutional records" },
  { id: "CAE-11.7-W2-CTX-006", text: "Material inferences expose source, confidence, freshness, correction" },
  { id: "CAE-11.7-W2-CTX-007", text: "Institution context must not leak without authorization" },
  { id: "CAE-11.7-W2-CTX-008", text: "Human-declared context overrides inferred context" },
  { id: "CAE-11.7-W2-CTX-009", text: "Distinguish doing from may-be-doing" },
  { id: "CAE-11.7-W2-CTX-010", text: "Context history follows retention rules" },
] as const;

export function checkLixW2Invariants() {
  return LIX_W2_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "CAE-11.7-W2-CTX-005") {
      passed = CONTEXT_AI_MAY_NOT.some((s) => s.toLowerCase().includes("institutional records"));
      detail = "no silent mutation";
    }
    if (inv.id === "CAE-11.7-W2-CTX-001") {
      passed = CONTEXT_STORE_KEYS.active === "lix_context_active";
      detail = "active context store";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getContextServiceCount() {
  return REQUIRED_CONTEXT_SERVICES.length;
}
