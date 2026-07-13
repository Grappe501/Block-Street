/**
 * CAE-11.6-W4 — Organization traceability
 */
import { OPS_ORGANIZATION_PRINCIPLE } from "./constitution";

export function explainHumanPlaceInInstitution(input: {
  human_id: string;
  institution_id: string;
  organization_unit_id: string;
  federation_id?: string | null;
}): string {
  const parts = [`Human ${input.human_id}`, `Unit ${input.organization_unit_id}`, `Institution ${input.institution_id}`];
  if (input.federation_id) parts.push(`Federation ${input.federation_id}`);
  return parts.join(" → ");
}

export function getOrganizationTraceabilityProtocol() {
  return {
    protocol: "11.6-W4",
    principle: OPS_ORGANIZATION_PRINCIPLE,
    required_fields: ["human_id", "institution_id", "organization_unit_id"],
  };
}
