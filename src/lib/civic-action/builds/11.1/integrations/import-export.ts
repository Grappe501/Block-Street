/**
 * CAE-11.1-W5 — Import/export foundations
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";

export type InitiativeImportJob = {
  id: string;
  institution_id: string;
  source_type: string;
  source_reference: string;
  requested_by: string;
  status: "uploaded" | "parsed" | "mapped" | "validated" | "needs_review" | "approved_for_draft_creation" | "imported" | "partially_imported" | "failed";
  mapping_version: string;
  created_at: string;
  completed_at: string | null;
  result_summary: Record<string, unknown>;
  preview: {
    proposed_drafts: number;
    reconciliation_candidates: number;
    rejected_authority_rows: number;
    duplicate_candidates: number;
    privacy_flags: string[];
  };
};

export type InitiativeExportManifest = {
  id: string;
  purpose: string;
  requesting_human_id: string;
  institution_id: string;
  initiative_ids: string[];
  fields: string[];
  data_classification: string;
  format: "json" | "csv" | "pdf" | "markdown";
  created_at: string;
  expires_at: string;
  digest: string;
};

const IMPORT_KEY = "initiative_import_jobs";
const EXPORT_KEY = "initiative_export_manifests";

export function createImportPreviewJob(input: {
  institution_id: string;
  source_type: string;
  source_reference: string;
  requested_by: string;
  rows: Record<string, unknown>[];
}) {
  const rejected = input.rows.filter((r) => r.status === "Active" || r.status === "Approved").length;
  const job: InitiativeImportJob = {
    id: caeId("imp"),
    institution_id: input.institution_id,
    source_type: input.source_type,
    source_reference: input.source_reference,
    requested_by: input.requested_by,
    status: rejected > 0 ? "needs_review" : "validated",
    mapping_version: "11.1-w5.1",
    created_at: nowIso(),
    completed_at: null,
    result_summary: {},
    preview: {
      proposed_drafts: input.rows.length,
      reconciliation_candidates: input.rows.filter((r) => r.legacy === true).length,
      rejected_authority_rows: rejected,
      duplicate_candidates: 0,
      privacy_flags: [],
    },
  };
  const jobs = readStoreSlice<InitiativeImportJob>(IMPORT_KEY);
  jobs.push(job);
  writeStoreSlice(IMPORT_KEY, jobs);
  return job;
}

export function createExportManifest(input: Omit<InitiativeExportManifest, "id" | "created_at" | "digest">) {
  const manifest: InitiativeExportManifest = {
    ...input,
    id: caeId("exp"),
    created_at: nowIso(),
    digest: `sha256:${input.initiative_ids.join(",")}:${input.fields.join(",")}`,
  };
  const manifests = readStoreSlice<InitiativeExportManifest>(EXPORT_KEY);
  manifests.push(manifest);
  writeStoreSlice(EXPORT_KEY, manifests);
  return manifest;
}
