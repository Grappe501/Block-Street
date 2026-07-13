/**
 * CAE-11.7-W3 — Version and audit engines
 */
import { caeId, nowIso } from "../../../utils";
import type { CommunicationAuditEntry } from "./commands";
import type { CommunicationVersionRecord } from "../data-model";
import { appendCommunicationVersion, readStoreSlice, writeStoreSlice, COMMUNICATION_AUDIT_KEY } from "./repository";
import { nextVersionNumber } from "../versioning";

export function createCommunicationVersion(input: {
  entity_id: string;
  entity_type: string;
  current_version: number;
  changed_by: string;
  reason: string;
  affected_fields: string[];
  snapshot: Record<string, unknown>;
}): CommunicationVersionRecord {
  const version: CommunicationVersionRecord = {
    version_id: caeId("cver"),
    entity_id: input.entity_id,
    entity_type: input.entity_type,
    version_number: nextVersionNumber(input.current_version),
    changed_by: input.changed_by,
    changed_at: nowIso(),
    reason: input.reason,
    affected_fields: input.affected_fields,
    previous_version_id: null,
    snapshot: input.snapshot,
  };
  appendCommunicationVersion(version);
  return version;
}

export function recordCommunicationAudit(input: Omit<CommunicationAuditEntry, "audit_id" | "when">): CommunicationAuditEntry {
  const entry: CommunicationAuditEntry = {
    ...input,
    audit_id: caeId("caud"),
    when: nowIso(),
  };
  const items = readStoreSlice<CommunicationAuditEntry>(COMMUNICATION_AUDIT_KEY);
  items.push(entry);
  writeStoreSlice(COMMUNICATION_AUDIT_KEY, items);
  return entry;
}

export const CommunicationVersionService = { create: createCommunicationVersion };
export const CommunicationAuditService = { record: recordCommunicationAudit };
