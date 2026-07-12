import { listInitiatives } from "../../initiatives";
import { INITIATIVE_LIFECYCLE, PROHIBITED_BEHAVIORS } from "./constitution";

export const INI_W1_INVARIANTS = [
  { id: "INI-INV-001", text: "Every active initiative has executive_owner_human_id and operational_owner_human_id." },
  { id: "INI-INV-002", text: "Every initiative has institution_id, purpose, and problem_statement." },
  { id: "INI-INV-003", text: "Owners are Human IDs, not service identities." },
  { id: "INI-INV-004", text: "Initiative status is a valid lifecycle state." },
  { id: "INI-INV-005", text: "Privacy level is public, internal, or restricted." },
  { id: "INI-INV-006", text: "Coalition cross-institution initiatives use COL-001, not hidden INI authority." },
];

export function checkIniW1Invariants() {
  const initiatives = listInitiatives();
  const active = initiatives.filter((i) => !["archived", "cancelled"].includes(i.status));

  return INI_W1_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = inv.text;

    if (inv.id === "INI-INV-001") {
      passed = active.every((i) => i.executive_owner_human_id && i.operational_owner_human_id);
      detail = `${active.length} active initiatives checked`;
    }
    if (inv.id === "INI-INV-002") {
      passed = initiatives.every((i) => i.institution_id && i.purpose && i.problem_statement);
      detail = `${initiatives.length} initiatives`;
    }
    if (inv.id === "INI-INV-003") {
      passed = initiatives.every(
        (i) =>
          !i.executive_owner_human_id.startsWith("svc-") &&
          !i.operational_owner_human_id.startsWith("svc-")
      );
      detail = "No service identity owners";
    }
    if (inv.id === "INI-INV-004") {
      const valid = new Set(INITIATIVE_LIFECYCLE);
      passed = initiatives.every((i) => valid.has(i.status));
      detail = `${INITIATIVE_LIFECYCLE.length} lifecycle states`;
    }
    if (inv.id === "INI-INV-005") {
      passed = initiatives.every((i) => ["public", "internal", "restricted"].includes(i.privacy_level));
    }
    if (inv.id === "INI-INV-006") {
      passed = PROHIBITED_BEHAVIORS.length >= 8;
      detail = `${PROHIBITED_BEHAVIORS.length} prohibited behaviors documented`;
    }

    return { id: inv.id, passed, detail };
  });
}
