export const WAVE4_INVARIANTS = [
  { id: "ITL-W4-INV-001", text: "One real Human must use one Global Human ID throughout the platform." },
  { id: "ITL-W4-INV-002", text: "Joining a new institution must not create a second Human when existing Human can be resolved." },
  { id: "ITL-W4-INV-003", text: "Every new institution membership requires an authorized invitation, transfer, or governed process." },
  { id: "ITL-W4-INV-004", text: "Global identity assurance may be recognized without disclosing private verification evidence." },
  { id: "ITL-W4-INV-005", text: "Institution trust does not automatically transfer to another institution." },
  { id: "ITL-W4-INV-006", text: "Roles and permissions never transfer merely because the Global Human is the same." },
  { id: "ITL-W4-INV-007", text: "Every consequential action must identify the active institution context." },
  { id: "ITL-W4-INV-008", text: "No Human may perform an institution-scoped action without active membership." },
  { id: "ITL-W4-INV-009", text: "One institution may not view another institution's private records without explicit authority." },
  { id: "ITL-W4-INV-010", text: "Cross-institution collaboration does not create shared administrative authority." },
  { id: "ITL-W4-INV-011", text: "Ending membership in one institution must not automatically end membership elsewhere." },
  { id: "ITL-W4-INV-012", text: "A local institution cannot retire the Global Human identity." },
  { id: "ITL-W4-INV-013", text: "Global identity restriction affects all institutions only through platform governance." },
  { id: "ITL-W4-INV-014", text: "Every context switch must be explicit, recorded, and reflected in authorization." },
  { id: "ITL-W4-INV-015", text: "Service identities and Human identities must remain distinct." },
  { id: "ITL-W4-INV-016", text: "AI may assist with identity resolution but may not link memberships without authorized Human action." },
];

export function checkWave4Invariants() {
  const { loadWave4Flags } = require("./data") as typeof import("./data");
  const flags = loadWave4Flags();
  return WAVE4_INVARIANTS.map((inv) => ({
    id: inv.id,
    passed: Boolean(flags.FEDERATION_IDENTITY_ENABLED) && Boolean(flags.INSTITUTION_TRUST_ISOLATION_REQUIRED),
    detail: inv.text,
  }));
}
