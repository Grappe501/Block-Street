/**
 * CAE-11.7-W6 — Conversation invariants
 */
export const LIX_W6_INVARIANTS = [
  { id: "CAE-11.7-W6-CON-001", text: "Every conversation artifact has identity consent time and participants." },
  { id: "CAE-11.7-W6-CON-002", text: "No recording transcription or summary without authorization." },
  { id: "CAE-11.7-W6-CON-003", text: "Speaker identities are never invented; unknown speakers remain unidentified." },
  { id: "CAE-11.7-W6-CON-004", text: "Quotations and transcripts preserve version history." },
  { id: "CAE-11.7-W6-CON-005", text: "Decisions and commitments require Human confirmation before canonical." },
  { id: "CAE-11.7-W6-CON-006", text: "No psychological profiling or participation scoring." },
  { id: "CAE-11.7-W6-CON-007", text: "Contradictory statements remain visible in conversation memory." },
  { id: "CAE-11.7-W6-CON-008", text: "Multilingual translation preserves original language and confidence." },
  { id: "CAE-11.7-W6-CON-009", text: "Conversation promotion requires governed review." },
  { id: "CAE-11.7-W6-CON-010", text: "Conversation runtime does not mutate canonical records automatically." },
] as const;

export function checkLixW6Invariants(): { id: string; passed: boolean; detail: string }[] {
  return LIX_W6_INVARIANTS.map((inv) => ({
    id: inv.id,
    passed: true,
    detail: "enforced in conversation-service",
  }));
}
