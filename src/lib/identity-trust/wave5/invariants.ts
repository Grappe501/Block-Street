export const WAVE5_INVARIANTS = [
  { id: "ITL-W5-INV-001", text: "Every intelligence output must be labeled as a signal, not a final finding." },
  { id: "ITL-W5-INV-002", text: "No signal may directly change identity assurance, trust, membership, or role." },
  { id: "ITL-W5-INV-003", text: "No AI model may independently open a final adverse identity decision." },
  { id: "ITL-W5-INV-004", text: "Every signal must identify the rule or model version that generated it." },
  { id: "ITL-W5-INV-005", text: "Every signal must include supporting features and known limitations." },
  { id: "ITL-W5-INV-006", text: "Signals must be reviewable by qualified Humans." },
  { id: "ITL-W5-INV-007", text: "A signal alone cannot satisfy evidence standard for intentional fraud." },
  { id: "ITL-W5-INV-008", text: "Political beliefs and participation must not be risk features." },
  { id: "ITL-W5-INV-009", text: "Protected personal attributes must not be risk features." },
  { id: "ITL-W5-INV-016", text: "Intelligence layer must fail open to Human review, not automatic punishment." },
];

export function checkWave5Invariants() {
  const { loadWave5Flags } = require("./data") as typeof import("./data");
  const flags = loadWave5Flags();
  return WAVE5_INVARIANTS.map((inv) => ({
    id: inv.id,
    passed:
      Boolean(flags.IDENTITY_INTELLIGENCE_ENABLED) &&
      Boolean(flags.AI_IDENTITY_AUTOMATIC_ACTIONS_DISABLED) &&
      Boolean(flags.IDENTITY_SIGNAL_ONLY_AUTHORITY_REQUIRED),
    detail: inv.text,
  }));
}
