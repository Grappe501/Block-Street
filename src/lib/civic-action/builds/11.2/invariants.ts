import {
  CONSTITUTIONAL_COMMITMENTS,
  EXECUTION_HIERARCHY,
  OBJECTIVE_LIFECYCLE,
  OBJECTIVE_TYPES,
  PROHIBITED_BEHAVIORS,
  REQUIRED_DOMAIN_SERVICES,
  TRACEABILITY_CHAIN,
} from "./constitution";

export const OBJ_W1_INVARIANTS = [
  { id: "OBJ-INV-001", text: "Execution hierarchy is fully defined from institution through lessons learned." },
  { id: "OBJ-INV-002", text: "Every Objective type is registered with a canonical definition." },
  { id: "OBJ-INV-003", text: "Objective lifecycle states are enumerated and unambiguous." },
  { id: "OBJ-INV-004", text: "Traceability chain answers why any Task exists." },
  { id: "OBJ-INV-005", text: "No orphan work — execution requires Objective context." },
  { id: "OBJ-INV-006", text: "Required domain services are declared for W3 implementation." },
];

export function checkObjW1Invariants() {
  return OBJ_W1_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = inv.text;

    if (inv.id === "OBJ-INV-001") {
      passed = EXECUTION_HIERARCHY.length >= 12;
      detail = `${EXECUTION_HIERARCHY.length} hierarchy levels`;
    }
    if (inv.id === "OBJ-INV-002") {
      passed = OBJECTIVE_TYPES.length === 13;
      detail = `${OBJECTIVE_TYPES.length} objective types`;
    }
    if (inv.id === "OBJ-INV-003") {
      passed = OBJECTIVE_LIFECYCLE.length === 12;
      detail = `${OBJECTIVE_LIFECYCLE.length} lifecycle states`;
    }
    if (inv.id === "OBJ-INV-004") {
      passed =
        TRACEABILITY_CHAIN.length === 6 &&
        TRACEABILITY_CHAIN[0] === "task" &&
        TRACEABILITY_CHAIN[TRACEABILITY_CHAIN.length - 1] === "institution";
      detail = TRACEABILITY_CHAIN.join(" → ");
    }
    if (inv.id === "OBJ-INV-005") {
      passed = CONSTITUTIONAL_COMMITMENTS.some((c) => c.toLowerCase().includes("orphan"));
      detail = `${PROHIBITED_BEHAVIORS.length} prohibited behaviors`;
    }
    if (inv.id === "OBJ-INV-006") {
      passed = REQUIRED_DOMAIN_SERVICES.length === 10;
      detail = REQUIRED_DOMAIN_SERVICES.join(", ");
    }

    return { id: inv.id, passed, detail };
  });
}
