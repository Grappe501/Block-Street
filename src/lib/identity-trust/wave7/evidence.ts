import { createHash } from "crypto";
import { itlId, nowIso } from "../utils";
import { loadCertificationEvidence, persistCertificationEvidence } from "./data";
import type { IdentityCertificationEvidence } from "./types";

export function recordEvidence(input: {
  certification_id: string;
  requirement_id?: string | null;
  evidence_type: string;
  title: string;
  description: string;
  artifact_reference: string;
  created_by: string;
  environment?: string;
}): IdentityCertificationEvidence {
  const payload = JSON.stringify({
    title: input.title,
    artifact: input.artifact_reference,
    at: nowIso(),
  });
  const evidence: IdentityCertificationEvidence = {
    id: itlId("ice"),
    certification_id: input.certification_id,
    requirement_id: input.requirement_id ?? null,
    evidence_type: input.evidence_type,
    title: input.title,
    description: input.description,
    artifact_reference: input.artifact_reference,
    created_by: input.created_by,
    created_at: nowIso(),
    environment: input.environment ?? "staging",
    integrity_digest: createHash("sha256").update(payload).digest("hex").slice(0, 16),
    review_status: "pending",
  };
  const all = loadCertificationEvidence();
  all.push(evidence);
  persistCertificationEvidence(all);
  return evidence;
}

export function listEvidence(certificationId?: string) {
  let items = loadCertificationEvidence();
  if (certificationId) items = items.filter((e) => e.certification_id === certificationId);
  return items;
}

export function reviewEvidence(evidenceId: string, reviewStatus: IdentityCertificationEvidence["review_status"]) {
  const items = loadCertificationEvidence();
  const idx = items.findIndex((e) => e.id === evidenceId);
  if (idx < 0) throw new Error("Evidence not found");
  items[idx] = { ...items[idx], review_status: reviewStatus };
  persistCertificationEvidence(items);
  return items[idx];
}
