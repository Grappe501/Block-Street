/**
 * CAE-11.1-W5 — Audit adapter
 */
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { InitiativeEventOutboxRecord } from "../services/events";
import { nowIso } from "../../../utils";

export type InitiativeAuditProjection = {
  audit_id: string;
  event_id: string;
  initiative_id: string;
  institution_id: string;
  event_type: string;
  occurred_at: string;
  recorded_at: string;
  payload_summary: Record<string, unknown>;
};

const AUDIT_KEY = "initiative_audit_projections";

export function writeInitiativeAuditProjection(record: InitiativeEventOutboxRecord) {
  const entry: InitiativeAuditProjection = {
    audit_id: `aud_${record.event_id}`,
    event_id: record.event_id,
    initiative_id: record.initiative_id,
    institution_id: (record.payload.institution_id as string) ?? "",
    event_type: record.event_type,
    occurred_at: record.occurred_at,
    recorded_at: nowIso(),
    payload_summary: record.payload,
  };
  const rows = readStoreSlice<InitiativeAuditProjection>(AUDIT_KEY);
  if (rows.some((r) => r.event_id === record.event_id)) return entry;
  rows.push(entry);
  writeStoreSlice(AUDIT_KEY, rows);
  return entry;
}
