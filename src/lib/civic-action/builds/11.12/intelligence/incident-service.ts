/**
 * CAE-11.12-W6 — AI incident reporting
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { AIIncidentRecord } from "./contracts";

const KEY = "knowledge_ai_incidents";

export function reportAIIncident(input: {
  institution_id: string;
  request_id: string;
  issue_type: string;
  severity: AIIncidentRecord["severity"];
  output_summary: string;
}): AIIncidentRecord {
  const incident: AIIncidentRecord = {
    incident_id: caeId("inc"),
    institution_id: input.institution_id,
    request_id: input.request_id,
    issue_type: input.issue_type,
    severity: input.severity,
    output_summary: input.output_summary,
    containment: "Output flagged for Human review — no canonical mutation",
    review_status: "open",
    recorded_at: nowIso(),
  };
  const rows = readStoreSlice<AIIncidentRecord>(KEY);
  rows.push(incident);
  writeStoreSlice(KEY, rows);
  return incident;
}

export function listOpenIncidents(institutionId: string): AIIncidentRecord[] {
  return readStoreSlice<AIIncidentRecord>(KEY).filter(
    (i) => i.institution_id === institutionId && i.review_status !== "resolved"
  );
}
