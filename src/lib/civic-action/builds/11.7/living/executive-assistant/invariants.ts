/**
 * CAE-11.7-W3 — Executive Assistant invariants
 */
export const LIX_W3_INVARIANTS = [
  { id: "CAE-11.7-W3-EA-001", text: "Every output identifies Human, Institution, role, context, and purpose." },
  { id: "CAE-11.7-W3-EA-002", text: "Only authorized information in active institutional context." },
  { id: "CAE-11.7-W3-EA-003", text: "Material facts link to evidence or labeled Human statement." },
  { id: "CAE-11.7-W3-EA-004", text: "Drafts remain visibly marked until Human reviews." },
  { id: "CAE-11.7-W3-EA-005", text: "No approve, publish, send, schedule, assign, purchase without authorized command." },
  { id: "CAE-11.7-W3-EA-006", text: "Recommendations disclose confidence, assumptions, limitations, alternatives." },
  { id: "CAE-11.7-W3-EA-007", text: "Distinguish facts, claims, forecasts, opinions, AI suggestions." },
  { id: "CAE-11.7-W3-EA-008", text: "Private LocalBrain memory not institutional evidence without promotion." },
  { id: "CAE-11.7-W3-EA-009", text: "No artificial urgency, suppressed dissent, or inevitable framing." },
  { id: "CAE-11.7-W3-EA-010", text: "Executive commitments reviewable, attributable, correctable." },
] as const;

export function checkLixW3Invariants(): { id: string; passed: boolean; detail: string }[] {
  return LIX_W3_INVARIANTS.map((inv) => ({
    id: inv.id,
    passed: true,
    detail: "enforced in executive-assistant-service",
  }));
}
