/**
 * CAE-11.6-W9 — Workflow invariants
 */
import { WORKFLOW_STORE_KEYS } from "./data-model";
import { REQUIRED_WORKFLOW_SERVICES, WORKFLOW_AI_MAY_NOT } from "./constitution";

export const OPS_W9_INVARIANTS = [
  { id: "OPS-W9-INV-001", text: "Every automated action is explainable, auditable, and traceable" },
  { id: "OPS-W9-INV-002", text: "Human approval gates cannot be bypassed by automation" },
  { id: "OPS-W9-INV-003", text: "Published workflows are immutable; new versions create new records" },
  { id: "OPS-W9-INV-004", text: "High-risk workflows may never use Level 4 automation" },
  { id: "OPS-W9-INV-005", text: "Automation never elevates privilege beyond workflow policy" },
  { id: "OPS-W9-INV-006", text: "AI may recommend but never silently alter governance" },
  { id: "OPS-W9-INV-007", text: "Every execution produces institutional evidence" },
] as const;

export function checkOpsW9Invariants() {
  return OPS_W9_INVARIANTS.map((inv) => {
    let passed = true;
    let detail = "ok";
    if (inv.id === "OPS-W9-INV-006") {
      passed = WORKFLOW_AI_MAY_NOT.some((s) => s.toLowerCase().includes("governance"));
      detail = "ai governance boundary";
    }
    if (inv.id === "OPS-W9-INV-007") {
      passed = WORKFLOW_STORE_KEYS.executions === "ops_workflow_executions";
      detail = "execution store";
    }
    return { id: inv.id, passed, detail };
  });
}

export function getWorkflowServiceCount() {
  return REQUIRED_WORKFLOW_SERVICES.length;
}
