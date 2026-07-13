/**
 * CAE-11.12-W8 — Executive sign-off records
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { ExecutiveSignOffRecord } from "./contracts";

const KEY = "knowledge_production_sign_offs";

export function recordKnowledgeExecutiveSignOff(input: {
  sign_off_type: ExecutiveSignOffRecord["sign_off_type"];
  actor_human_id: string;
  institution_id: string;
  decision: ExecutiveSignOffRecord["decision"];
  notes_optional?: string;
}): ExecutiveSignOffRecord {
  const entry: ExecutiveSignOffRecord = {
    sign_off_id: caeId("sig"),
    sign_off_type: input.sign_off_type,
    actor_human_id: input.actor_human_id,
    institution_id: input.institution_id,
    decision: input.decision,
    recorded_at: nowIso(),
    notes_optional: input.notes_optional,
  };
  const rows = readStoreSlice<ExecutiveSignOffRecord>(KEY);
  rows.push(entry);
  writeStoreSlice(KEY, rows);
  return entry;
}

export function listKnowledgeExecutiveSignOffs(institutionId: string, limit = 50): ExecutiveSignOffRecord[] {
  return readStoreSlice<ExecutiveSignOffRecord>(KEY)
    .filter((s) => s.institution_id === institutionId)
    .slice(-limit);
}

export function hasKnowledgeApprovedSignOff(
  institutionId: string,
  type: ExecutiveSignOffRecord["sign_off_type"]
): boolean {
  return readStoreSlice<ExecutiveSignOffRecord>(KEY).some(
    (s) => s.institution_id === institutionId && s.sign_off_type === type && s.decision === "approved"
  );
}
