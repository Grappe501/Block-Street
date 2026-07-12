export const WAVE6_INVARIANTS = [
  { id: "ITL-W6-INV-001", text: "Every administrative action must resolve Human, institution context, role, and scope." },
  { id: "ITL-W6-INV-002", text: "No interface may expose records beyond operator jurisdiction." },
  { id: "ITL-W6-INV-003", text: "Every work item must identify why it exists and which event created it." },
  { id: "ITL-W6-INV-004", text: "AI-generated signals must be visibly labeled advisory." },
  { id: "ITL-W6-INV-005", text: "An intelligence signal cannot execute an adverse identity action." },
  { id: "ITL-W6-INV-006", text: "High-impact actions must display approval requirements before submission." },
  { id: "ITL-W6-INV-008", text: "Every completed action must produce an audit event." },
  { id: "ITL-W6-INV-009", text: "Private verification evidence must not appear in general dashboards." },
  { id: "ITL-W6-INV-010", text: "Operational statistics must not become public Human rankings." },
  { id: "ITL-W6-INV-011", text: "Sponsors may not inspect sponsored Humans private activity or cases." },
  { id: "ITL-W6-INV-012", text: "Executive dashboards are aggregate without case-level authority." },
  { id: "ITL-W6-INV-014", text: "Overdue work must escalate without silently changing identity state." },
  { id: "ITL-W6-INV-015", text: "Exports must be purpose-bound, permission-checked, and audited." },
];

export function checkWave6Invariants() {
  const { loadWave6Flags } = require("./data") as typeof import("./data");
  const flags = loadWave6Flags();
  return WAVE6_INVARIANTS.map((inv) => ({
    id: inv.id,
    passed: Boolean(flags.IDENTITY_OPERATIONS_CENTER_ENABLED) && Boolean(flags.AI_IDENTITY_AUTOMATIC_ACTIONS_DISABLED),
    detail: inv.text,
  }));
}
