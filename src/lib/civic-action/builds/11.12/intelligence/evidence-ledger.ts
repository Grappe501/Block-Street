/**
 * CAE-11.12-W6 — Evidence ledger (provenance for intelligence outputs)
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { IntelligenceEvidenceReference, IntelligenceRequest, IntelligenceResult } from "./contracts";

const KEY = "knowledge_intelligence_evidence_ledger";

export type EvidenceLedgerEntry = {
  ledger_id: string;
  intelligence_result_id: string;
  request: IntelligenceRequest;
  evidence_references: IntelligenceEvidenceReference[];
  canonical_versions: { entity_id: string; entity_type: string; version: number }[];
  policy_version: string;
  model_reference_optional?: string;
  recorded_at: string;
};

export function recordEvidenceLedger(
  result: IntelligenceResult,
  request: IntelligenceRequest,
  policyVersion = "11.12-w6.1"
): EvidenceLedgerEntry {
  const entry: EvidenceLedgerEntry = {
    ledger_id: caeId("kel"),
    intelligence_result_id: result.intelligence_result_id,
    request,
    evidence_references: result.evidence_references,
    canonical_versions: result.canonical_versions_used,
    policy_version: policyVersion,
    model_reference_optional: result.model_reference_optional,
    recorded_at: nowIso(),
  };
  const rows = readStoreSlice<EvidenceLedgerEntry>(KEY);
  rows.push(entry);
  writeStoreSlice(KEY, rows);
  return entry;
}

export function getLedgerEntry(resultId: string): EvidenceLedgerEntry | null {
  return readStoreSlice<EvidenceLedgerEntry>(KEY).find((e) => e.intelligence_result_id === resultId) ?? null;
}
