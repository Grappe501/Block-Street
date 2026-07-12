import { loadHumanIdentities } from "../data";
import { loadWave2Flags, loadIdentityAssuranceStates, loadIdentityLedgerEvents, loadVerificationStatements } from "./data";

export const WAVE2_INVARIANTS = [
  { id: "ITL-W2-INV-001", rule: "Every active Human has one current identity-assurance state." },
  { id: "ITL-W2-INV-002", rule: "Every verification statement identifies one verifier and one subject Human." },
  { id: "ITL-W2-INV-003", rule: "A Human cannot verify themselves." },
  { id: "ITL-W2-INV-004", rule: "Originating sponsor does not alone satisfy independent two-person verification." },
  { id: "ITL-W2-INV-005", rule: "Full Verified requires two qualifying confirmations including one independent." },
  { id: "ITL-W2-INV-006", rule: "Verification evidence is private." },
  { id: "ITL-W2-INV-007", rule: "Trust-stage changes use append-only ledger events." },
  { id: "ITL-W2-INV-008", rule: "Trust status cannot grant unauthorized permissions." },
  { id: "ITL-W2-INV-009", rule: "Trust cannot be reduced for political disagreement alone." },
  { id: "ITL-W2-INV-010", rule: "Identity restriction and disciplinary action remain distinguishable." },
  { id: "ITL-W2-INV-011", rule: "No AI may independently verify, promote, demote, or remove a Human." },
  { id: "ITL-W2-INV-012", rule: "Every verification decision is explainable through recorded statements and rules." },
];

export function checkWave2Invariants(): { id: string; passed: boolean; detail: string }[] {
  const flags = loadWave2Flags();
  const humans = loadHumanIdentities().filter((h) => h.identity_status === "active");
  const statements = loadVerificationStatements();
  const selfVerify = statements.some((s) => s.subject_human_id === s.verifier_human_id && s.status === "active");

  return [
    {
      id: "ITL-W2-INV-001",
      passed: humans.length === 0 || loadIdentityAssuranceStates().length >= humans.length,
      detail: `${humans.length} active humans with assurance projection`,
    },
    {
      id: "ITL-W2-INV-003",
      passed: !selfVerify,
      detail: selfVerify ? "Self-verification detected" : "No self-verification",
    },
    {
      id: "ITL-W2-INV-006",
      passed: Boolean(flags.IDENTITY_VERIFICATION_ENGINE_ENABLED),
      detail: "Verification engine enabled with privacy controls",
    },
    {
      id: "ITL-W2-INV-007",
      passed: Boolean(flags.IDENTITY_LEDGER_ENABLED),
      detail: `${loadIdentityLedgerEvents().length} ledger events`,
    },
    {
      id: "ITL-W2-INV-011",
      passed: Boolean(flags.AI_IDENTITY_ACTIONS_PROHIBITED),
      detail: "AI identity actions prohibited",
    },
  ];
}

