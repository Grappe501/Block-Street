/**
 * CAE-11.12-W1 — Knowledge constitution invariants
 */
import {
  AI_MAY,
  AI_MAY_NOT,
  CONSTITUTIONAL_COMMITMENTS,
  KNOWLEDGE_CATEGORIES,
  KNOWLEDGE_HIERARCHY,
  KNOWLEDGE_LIFECYCLE,
  REQUIRED_CONSTITUTIONAL_SERVICES,
} from "./constitution";

export const KNW_W1_INVARIANTS = [
  { id: "KNW-INV-001", text: "Knowledge hierarchy is fully defined from institution through capability." },
  { id: "KNW-INV-002", text: "Every knowledge category is registered with constitutional meaning." },
  { id: "KNW-INV-003", text: "Knowledge lifecycle states are enumerated and unambiguous." },
  { id: "KNW-INV-004", text: "Constitutional commitments include orphan knowledge prohibition." },
  { id: "KNW-INV-005", text: "AI boundaries prohibit fabricating truth and certifying competency." },
  { id: "KNW-INV-006", text: "Required constitutional services are declared for W3 implementation." },
];

export function checkKnwW1Invariants() {
  return KNW_W1_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = inv.text;

    if (inv.id === "KNW-INV-001") {
      passed = KNOWLEDGE_HIERARCHY.length >= 10;
      detail = `${KNOWLEDGE_HIERARCHY.length} hierarchy levels`;
    }
    if (inv.id === "KNW-INV-002") {
      passed = KNOWLEDGE_CATEGORIES.length >= 17;
      detail = `${KNOWLEDGE_CATEGORIES.length} categories`;
    }
    if (inv.id === "KNW-INV-003") {
      passed = KNOWLEDGE_LIFECYCLE.length === 7;
      detail = KNOWLEDGE_LIFECYCLE.join(" → ");
    }
    if (inv.id === "KNW-INV-004") {
      passed =
        CONSTITUTIONAL_COMMITMENTS.length >= 10 &&
        CONSTITUTIONAL_COMMITMENTS.some((c) => c.toLowerCase().includes("context"));
      detail = `${CONSTITUTIONAL_COMMITMENTS.length} commitments`;
    }
    if (inv.id === "KNW-INV-005") {
      passed =
        AI_MAY.length >= 6 &&
        AI_MAY_NOT.some((p) => p.includes("fabricate")) &&
        AI_MAY_NOT.some((p) => p.includes("certify"));
      detail = `${AI_MAY_NOT.length} AI prohibitions`;
    }
    if (inv.id === "KNW-INV-006") {
      passed = REQUIRED_CONSTITUTIONAL_SERVICES.length === 9;
      detail = REQUIRED_CONSTITUTIONAL_SERVICES.join(", ");
    }

    return { id: inv.id, passed, detail };
  });
}
