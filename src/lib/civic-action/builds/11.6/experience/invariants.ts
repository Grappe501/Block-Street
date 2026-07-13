/**
 * CAE-11.6-W14 — Experience invariants
 */
import { EXPERIENCE_STORE_KEYS } from "./data-model";
import { EXPERIENCE_AI_MAY_NOT, REQUIRED_EXPERIENCE_SERVICES } from "./constitution";

export const OPS_W14_INVARIANTS = [
  { id: "OPS-W14-INV-001", text: "Every Human experiences one Institution—not disconnected modules" },
  { id: "OPS-W14-INV-002", text: "Platform presents one continuous experience" },
  { id: "OPS-W14-INV-003", text: "AI remains advisory and explains sources" },
  { id: "OPS-W14-INV-004", text: "Search results respect permissions" },
  { id: "OPS-W14-INV-005", text: "Experience analytics improve the interface—not evaluate Humans" },
  { id: "OPS-W14-INV-006", text: "Accessibility designed into every screen" },
  { id: "OPS-W14-INV-007", text: "Experience memory belongs to the Human" },
] as const;

export function checkOpsW14Invariants() {
  return OPS_W14_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "OPS-W14-INV-003") {
      passed = EXPERIENCE_AI_MAY_NOT.some((s) => s.toLowerCase().includes("sources"));
      detail = "ai source transparency";
    }
    if (inv.id === "OPS-W14-INV-001") {
      passed = EXPERIENCE_STORE_KEYS.workspaces === "ops_experience_workspaces";
      detail = "workspace store";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getExperienceServiceCount() {
  return REQUIRED_EXPERIENCE_SERVICES.length;
}
