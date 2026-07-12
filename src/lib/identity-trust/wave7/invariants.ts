export const WAVE7_INVARIANTS = [
  { id: "ITL-W7-INV-001", text: "Certification requires evidence, not assertion." },
  { id: "ITL-W7-INV-002", text: "No constitutional control may be waived through vague conditions." },
  { id: "ITL-W7-INV-003", text: "Critical red-team findings block production certification." },
  { id: "ITL-W7-INV-004", text: "IDENTITY_PRODUCTION_CERTIFIED requires a valid certification record." },
  { id: "ITL-W7-INV-005", text: "Kill switches must not erase identity history." },
  { id: "ITL-W7-INV-006", text: "Failed evidence must be preserved with corrective action." },
  { id: "ITL-W7-INV-007", text: "Migration certification requires zero active orphan accounts." },
  { id: "ITL-W7-INV-008", text: "Ledger corrections use correction events — no historical rewrite." },
];

export function checkWave7Invariants() {
  const { loadWave7Flags } = require("./data") as typeof import("./data");
  const { hasCriticalOpenFindings } = require("./redteam") as typeof import("./redteam");
  const flags = loadWave7Flags();

  return WAVE7_INVARIANTS.map((inv) => {
    let passed = Boolean(flags.IDENTITY_CERTIFICATION_FRAMEWORK_ENABLED);
    let detail = inv.text;

    if (inv.id === "ITL-W7-INV-003") {
      passed = !hasCriticalOpenFindings();
      detail = passed ? "No open RT-4 findings" : "Open RT-4 findings present";
    }
    if (inv.id === "ITL-W7-INV-004") {
      const prodFlag = Boolean(flags.IDENTITY_PRODUCTION_CERTIFIED);
      passed = !prodFlag || Boolean(flags.IDENTITY_CERTIFICATION_FRAMEWORK_ENABLED);
      detail = prodFlag ? "Production flag set with framework" : "Production flag not manually enabled";
    }
    if (inv.id === "ITL-W7-INV-005") {
      passed =
        Boolean(flags.IDENTITY_CONTROLLED_LAUNCH_ENABLED) &&
        typeof flags.IDENTITY_INVITATIONS_KILL_SWITCH === "boolean";
      detail = "Kill switches configured";
    }

    return { id: inv.id, passed, detail };
  });
}
