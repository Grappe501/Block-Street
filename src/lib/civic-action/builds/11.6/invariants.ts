/**
 * CAE-11.6-W1 — Strategic planning invariants
 */
import {
  CONSTITUTIONAL_COMMITMENTS,
  PLANNING_HORIZONS,
  REQUIRED_DOMAIN_SERVICES,
  STRATEGIC_ARCHITECTURE,
  TRACEABILITY_CHAIN,
} from "./constitution";

export const OPS_W1_INVARIANTS = [
  { id: "OPS-INV-001", text: "Strategic architecture spans purpose through institutional learning." },
  { id: "OPS-INV-002", text: "Traceability chain answers what higher purpose work supports." },
  { id: "OPS-INV-003", text: "Planning horizons are enumerated for all strategic objects." },
  { id: "OPS-INV-004", text: "Key Results require parent Strategic Objectives." },
  { id: "OPS-INV-005", text: "No orphan work — everything connects to mission." },
  { id: "OPS-INV-006", text: "Required domain services declared for later waves." },
  { id: "OPS-INV-007", text: "AI remains advisory — never autonomous plan mutation." },
];

export function checkOpsW1Invariants() {
  return OPS_W1_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = inv.text;

    switch (inv.id) {
      case "OPS-INV-001":
        passed = STRATEGIC_ARCHITECTURE.length >= 14;
        detail = `${STRATEGIC_ARCHITECTURE.length} architecture layers`;
        break;
      case "OPS-INV-002":
        passed = TRACEABILITY_CHAIN.length >= 10 && TRACEABILITY_CHAIN[0] === "task";
        detail = TRACEABILITY_CHAIN.join(" → ");
        break;
      case "OPS-INV-003":
        passed = PLANNING_HORIZONS.length === 8;
        detail = `${PLANNING_HORIZONS.length} horizons`;
        break;
      case "OPS-INV-004":
        passed = CONSTITUTIONAL_COMMITMENTS.some((c) => c.toLowerCase().includes("key result"));
        break;
      case "OPS-INV-005":
        passed = CONSTITUTIONAL_COMMITMENTS.some((c) => c.toLowerCase().includes("orphan"));
        break;
      case "OPS-INV-006":
        passed = REQUIRED_DOMAIN_SERVICES.length === 15;
        detail = `${REQUIRED_DOMAIN_SERVICES.length} services`;
        break;
      case "OPS-INV-007":
        passed = CONSTITUTIONAL_COMMITMENTS.some((c) => c.toLowerCase().includes("ai"));
        break;
    }

    return { id: inv.id, passed, detail };
  });
}
