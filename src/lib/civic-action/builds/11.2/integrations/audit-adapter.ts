/**
 * CAE-11.2-W5 — Audit adapter
 */
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { ExecutionEventOutboxRecord } from "../services/events";
import { nowIso } from "../../../utils";

export type ObjectiveAuditProjection = {
  audit_id: string;
  event_id: string;
  entity_id: string;
  initiative_id: string;
  institution_id: string;
  event_type: string;
  occurred_at: string;
  recorded_at: string;
  payload_summary: Record<string, unknown>;
};

const AUDIT_KEY = "objective_audit_projections";

export function writeObjectiveAuditProjection(record: ExecutionEventOutboxRecord) {
  const entry: ObjectiveAuditProjection = {
    audit_id: `aud_${record.event_id}`,
    event_id: record.event_id,
    entity_id: record.entity_id,
    initiative_id: (record.payload.initiative_id as string) ?? "",
    institution_id: (record.payload.institution_id as string) ?? "",
    event_type: record.event_type,
    occurred_at: record.occurred_at,
    recorded_at: nowIso(),
    payload_summary: record.payload,
  };
  const rows = readStoreSlice<ObjectiveAuditProjection>(AUDIT_KEY);
  if (rows.some((r) => r.event_id === record.event_id)) return entry;
  rows.push(entry);
  writeStoreSlice(AUDIT_KEY, rows);
  return entry;
}
