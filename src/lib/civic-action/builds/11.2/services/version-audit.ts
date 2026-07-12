/**
 * CAE-11.2-W3 — Version and audit engines
 */
import { caeId, nowIso } from "../../../utils";
import type { ExecutionAuditEntry } from "./commands";
import type { ExecutionVersionRecord } from "../data-model";
import { appendExecutionVersion, readStoreSlice, writeStoreSlice } from "./repository";
import { EXECUTION_AUDIT_KEY } from "./repository";
import { nextVersionNumber } from "../versioning";

export function createExecutionVersion(input: {
  entity_id: string;
  entity_type: string;
  current_version: number;
  changed_by: string;
  reason: string;
  affected_fields: string[];
  snapshot: Record<string, unknown>;
}): ExecutionVersionRecord {
  const version: ExecutionVersionRecord = {
    version_id: caeId("ver"),
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
  appendExecutionVersion(version);
  return version;
}

export function recordExecutionAudit(input: Omit<ExecutionAuditEntry, "audit_id" | "when">): ExecutionAuditEntry {
  const entry: ExecutionAuditEntry = {
    ...input,
    audit_id: caeId("aud"),
    when: nowIso(),
  };
  const items = readStoreSlice<ExecutionAuditEntry>(EXECUTION_AUDIT_KEY);
  items.push(entry);
  writeStoreSlice(EXECUTION_AUDIT_KEY, items);
  return entry;
}

export const ExecutionVersionService = { create: createExecutionVersion };
export const ExecutionAuditService = { record: recordExecutionAudit };
