/**
 * CAE-11.6-W5 — Resource traceability
 */
import { OPS_RESOURCE_PRINCIPLE } from "./constitution";

export function explainResourceMissionAlignment(input: {
  resource_id: string;
  institution_id: string;
  mission_id: string | null;
  category: string;
}): string {
  const parts = [`Resource ${input.resource_id}`, `Category ${input.category}`, `Institution ${input.institution_id}`];
  if (input.mission_id) parts.push(`Mission ${input.mission_id}`);
  else parts.push("Mission alignment pending");
  return parts.join(" → ");
}

export function getResourceTraceabilityProtocol() {
  return {
    protocol: "11.6-W5",
    principle: OPS_RESOURCE_PRINCIPLE,
    required_fields: ["resource_id", "institution_id", "mission_id"],
  };
}
