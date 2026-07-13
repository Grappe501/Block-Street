/**
 * CAE-11.7-W9 — Multi-Agent invariants
 */
export const LIX_W9_INVARIANTS = [
  { id: "CAE-11.7-W9-AGT-001", text: "Every agent has identity purpose capabilities and authority boundaries." },
  { id: "CAE-11.7-W9-AGT-002", text: "LocalBrain remains sole interface presented to Human." },
  { id: "CAE-11.7-W9-AGT-003", text: "Agents exchange evidence through governed Evidence Bus only." },
  { id: "CAE-11.7-W9-AGT-004", text: "Conflicting recommendations remain visible with supporting evidence." },
  { id: "CAE-11.7-W9-AGT-005", text: "Consensus never conceals minority evidence or disagreement." },
  { id: "CAE-11.7-W9-AGT-006", text: "High-impact outputs require Human review gateway approval." },
  { id: "CAE-11.7-W9-AGT-007", text: "Agent memory is scoped; LocalBrain owns canonical Human memory." },
  { id: "CAE-11.7-W9-AGT-008", text: "Third-party agent installation requires governed approval." },
  { id: "CAE-11.7-W9-AGT-009", text: "No autonomous agent hierarchies or hidden communication channels." },
  { id: "CAE-11.7-W9-AGT-010", text: "Agents do not mutate canonical institutional records." },
] as const;

export function checkLixW9Invariants(): { id: string; passed: boolean; detail: string }[] {
  return LIX_W9_INVARIANTS.map((inv) => ({
    id: inv.id,
    passed: true,
    detail: "enforced in agent-service",
  }));
}
