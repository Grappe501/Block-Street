/**
 * CAE-11.6-W9 — Workflow traceability
 */
import { OPS_WORKFLOW_PRINCIPLE } from "./constitution";

export function explainWorkflowExecution(input: {
  institution_id: string;
  workflow_id: string;
  execution_id: string;
  evidence_refs: string[];
}): string {
  return [
    `Workflow ${input.workflow_id}`,
    `Execution ${input.execution_id}`,
    `Institution ${input.institution_id}`,
    `Evidence: ${input.evidence_refs.join(", ")}`,
  ].join(" → ");
}

export function getWorkflowTraceabilityProtocol() {
  return {
    protocol: "11.6-W9",
    principle: OPS_WORKFLOW_PRINCIPLE,
    required_fields: ["institution_id", "workflow_id", "execution_id", "evidence_refs"],
  };
}
