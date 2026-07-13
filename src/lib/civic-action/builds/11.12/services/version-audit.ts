/**
 * CAE-11.12-W3 — Knowledge version and audit engines
 */
import { caeId, nowIso } from "../../../utils";
import type { KnowledgeAuditEntry } from "./commands";
import type { KnowledgeVersionRecord } from "../data-model";
import { appendKnowledgeVersion, readStoreSlice, writeStoreSlice, KNOWLEDGE_AUDIT_KEY } from "./repository";
import { nextVersionNumber } from "../versioning";

export function createKnowledgeVersion(input: {
  entity_id: string;
  current_version: number;
  changed_by: string;
  reason: string;
  affected_fields: string[];
  snapshot: Record<string, unknown>;
}): KnowledgeVersionRecord {
  const version: KnowledgeVersionRecord = {
    version_id: caeId("kver"),
    artifact_id: input.entity_id,
    version_number: nextVersionNumber(input.current_version),
    changed_by: input.changed_by,
    changed_at: nowIso(),
    reason: input.reason,
    affected_fields: input.affected_fields,
    previous_version_id: null,
    snapshot: input.snapshot,
    immutable: true,
  };
  appendKnowledgeVersion(version);
  return version;
}

export function recordKnowledgeAudit(input: Omit<KnowledgeAuditEntry, "audit_id" | "when">): KnowledgeAuditEntry {
  const entry: KnowledgeAuditEntry = {
    ...input,
    audit_id: caeId("kaud"),
    when: nowIso(),
  };
  const items = readStoreSlice<KnowledgeAuditEntry>(KNOWLEDGE_AUDIT_KEY);
  items.push(entry);
  writeStoreSlice(KNOWLEDGE_AUDIT_KEY, items);
  return entry;
}

export const KnowledgeVersionService = { create: createKnowledgeVersion };
export const KnowledgeAuditService = { record: recordKnowledgeAudit };
