/**
 * CAE-11.12-W6 — AI provenance tracking
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";

const KEY = "knowledge_ai_provenance";

export type AIProvenanceRecord = {
  provenance_id: string;
  intelligence_result_id: string;
  model_or_rule_version: string;
  policy_version: string;
  retrieval_query_optional?: string;
  canonical_versions: { entity_id: string; version: number }[];
  generated_at: string;
};

export function recordAIProvenance(input: {
  intelligence_result_id: string;
  model_or_rule_version: string;
  policy_version?: string;
  retrieval_query?: string;
  canonical_versions?: { entity_id: string; version: number }[];
}): AIProvenanceRecord {
  const record: AIProvenanceRecord = {
    provenance_id: caeId("prv"),
    intelligence_result_id: input.intelligence_result_id,
    model_or_rule_version: input.model_or_rule_version,
    policy_version: input.policy_version ?? "11.12-w6.1",
    retrieval_query_optional: input.retrieval_query,
    canonical_versions: input.canonical_versions ?? [],
    generated_at: nowIso(),
  };
  const rows = readStoreSlice<AIProvenanceRecord>(KEY);
  rows.push(record);
  writeStoreSlice(KEY, rows);
  return record;
}
