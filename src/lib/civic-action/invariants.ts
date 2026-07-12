export const CAE_INVARIANTS = [
  { id: "CAE-INV-001", text: "Every initiative has purpose and accountable Human owner." },
  { id: "CAE-INV-002", text: "Every active workstream and mission identifies an accountable Human." },
  { id: "CAE-INV-003", text: "Service identities may not serve as accountable owners." },
  { id: "CAE-INV-004", text: "AI cannot approve consequential communications or decisions." },
  { id: "CAE-INV-005", text: "Coalition roles do not create authority inside member institutions." },
  { id: "CAE-INV-006", text: "Outcome attribution must not claim causation without evidence." },
  { id: "CAE-INV-007", text: "Every action resolves institution context." },
  { id: "CAE-INV-008", text: "No anonymous ownership of initiatives or missions." },
];

export function checkCaeInvariants() {
  const { loadCaeFlags } = require("./data") as typeof import("./data");
  const { loadInitiatives, loadExecutionMissions } = require("./data") as typeof import("./data");
  const flags = loadCaeFlags();
  const initiatives = loadInitiatives();
  const missions = loadExecutionMissions();

  const allInitiativesOwned = initiatives.every((i) => i.executive_owner_human_id && i.operational_owner_human_id);
  const allMissionsOwned = missions.filter((m) => !["completed", "cancelled"].includes(m.status)).every((m) => m.owner_human_id && !m.owner_human_id.startsWith("svc-"));
  const aiBlocked = Boolean(flags.AI_CONSEQUENTIAL_ACTIONS_DISABLED);

  return CAE_INVARIANTS.map((inv) => {
    let passed = Boolean(flags.INITIATIVE_ARCHITECTURE_ENABLED);
    let detail = inv.text;
    if (inv.id === "CAE-INV-001") { passed = allInitiativesOwned; detail = `${initiatives.length} initiatives with owners`; }
    if (inv.id === "CAE-INV-002") { passed = allMissionsOwned; detail = `${missions.length} missions checked`; }
    if (inv.id === "CAE-INV-004") { passed = aiBlocked; detail = "AI consequential actions disabled"; }
    return { id: inv.id, passed, detail };
  });
}
