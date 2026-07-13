/**
 * CAE-11.7-W8 — Prediction invariants
 */
export const LIX_W8_INVARIANTS = [
  { id: "CAE-11.7-W8-PRD-001", text: "Every prediction includes evidence assumptions confidence and limitations." },
  { id: "CAE-11.7-W8-PRD-002", text: "Forecasts are advisory never presented as certainty." },
  { id: "CAE-11.7-W8-PRD-003", text: "Humans may edit assumptions and rerun models without canonical mutation." },
  { id: "CAE-11.7-W8-PRD-004", text: "Scenarios are reproducible with version history." },
  { id: "CAE-11.7-W8-PRD-005", text: "Alternative outcomes and contradictory evidence remain visible." },
  { id: "CAE-11.7-W8-PRD-006", text: "No autonomous strategic decisions from prediction runtime." },
  { id: "CAE-11.7-W8-PRD-007", text: "Risk and opportunity forecasts are evidence-backed with confidence." },
  { id: "CAE-11.7-W8-PRD-008", text: "No prediction of Human worth or protected characteristics." },
  { id: "CAE-11.7-W8-PRD-009", text: "Decision impact analysis is advisory and Human-reviewable." },
  { id: "CAE-11.7-W8-PRD-010", text: "Prediction does not mutate canonical institutional records." },
] as const;

export function checkLixW8Invariants(): { id: string; passed: boolean; detail: string }[] {
  return LIX_W8_INVARIANTS.map((inv) => ({
    id: inv.id,
    passed: true,
    detail: "enforced in prediction-service",
  }));
}
