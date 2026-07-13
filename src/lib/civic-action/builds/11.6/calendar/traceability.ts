/**
 * CAE-11.6-W6 — Calendar traceability
 */
import { OPS_CALENDAR_PRINCIPLE } from "./constitution";

export function explainEventInstitutionalContext(input: {
  event_id: string;
  institution_id: string;
  mission_id: string | null;
  calendar_id: string;
}): string {
  const parts = [`Event ${input.event_id}`, `Calendar ${input.calendar_id}`, `Institution ${input.institution_id}`];
  if (input.mission_id) parts.push(`Mission ${input.mission_id}`);
  return parts.join(" → ");
}

export function getCalendarTraceabilityProtocol() {
  return {
    protocol: "11.6-W6",
    principle: OPS_CALENDAR_PRINCIPLE,
    required_fields: ["event_id", "calendar_id", "institution_id"],
  };
}
