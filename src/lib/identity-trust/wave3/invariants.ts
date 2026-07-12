import { loadIdentityCases, loadIdentityCaseDecisions, loadWave3Flags } from "./data";

export const WAVE3_INVARIANTS = [
  { id: "ITL-W3-INV-001", rule: "Every consequential identity decision must belong to a governed identity case." },
  { id: "ITL-W3-INV-002", rule: "Every identity case must identify institution, scope, issue type, subject, and authority." },
  { id: "ITL-W3-INV-003", rule: "No reviewer may decide a case with a disqualifying conflict." },
  { id: "ITL-W3-INV-004", rule: "No identity case may erase or overwrite prior ledger history." },
  { id: "ITL-W3-INV-005", rule: "Temporary containment must be distinguishable from a final decision." },
  { id: "ITL-W3-INV-006", rule: "A report is evidence of concern, not proof." },
  { id: "ITL-W3-INV-007", rule: "Subject must ordinarily receive notice and opportunity to respond." },
  { id: "ITL-W3-INV-008", rule: "Final adverse decisions must include an appeal path." },
  { id: "ITL-W3-INV-009", rule: "Identity cases may not resolve unrelated political or performance disputes." },
  { id: "ITL-W3-INV-010", rule: "Permanent duplicate merges require two qualified reviewers." },
  { id: "ITL-W3-INV-011", rule: "AI output may inform review but not serve as sole adverse evidence." },
  { id: "ITL-W3-INV-012", rule: "Institutional membership termination must not delete Global Human ID." },
  { id: "ITL-W3-INV-013", rule: "Appeals reviewed by panel not solely responsible for original decision." },
  { id: "ITL-W3-INV-014", rule: "All decisions append identity-ledger events." },
];

export function checkWave3Invariants(): { id: string; passed: boolean; detail: string }[] {
  const flags = loadWave3Flags();
  const cases = loadIdentityCases();
  const decisions = loadIdentityCaseDecisions();
  const orphanDecisions = decisions.filter((d) => !cases.find((c) => c.id === d.case_id));

  return [
    {
      id: "ITL-W3-INV-001",
      passed: orphanDecisions.length === 0,
      detail: `${decisions.length} decisions, ${orphanDecisions.length} without case`,
    },
    {
      id: "ITL-W3-INV-006",
      passed: Boolean(flags.IDENTITY_NOTICE_AND_RESPONSE_REQUIRED),
      detail: "Notice and response required",
    },
    {
      id: "ITL-W3-INV-008",
      passed: decisions.every((d) => Boolean(d.appeal_deadline)),
      detail: "Appeal deadlines on decisions",
    },
    {
      id: "ITL-W3-INV-011",
      passed: Boolean(flags.AI_IDENTITY_DECISION_PROHIBITED),
      detail: "AI decisions prohibited",
    },
    {
      id: "ITL-W3-INV-010",
      passed: Boolean(flags.IDENTITY_DUPLICATE_MERGE_GOVERNANCE_ENABLED),
      detail: "Duplicate merge governance enabled",
    },
  ];
}
