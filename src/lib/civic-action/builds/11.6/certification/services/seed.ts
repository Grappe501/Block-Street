/**
 * CAE-11.6-W15 — Seed certification defaults
 */
import { nowIso } from "../../../../utils";
import { seedExperienceIfEmpty } from "../../experience/services/seed";
import { readStoreSlice } from "./repository";
import { CERTIFICATION_STORE_KEYS } from "../data-model";
import { saveCertification, saveCompliance, saveEvidence } from "./repository";

const NOW = nowIso();
const INSTITUTION = "inst-block-street";

export function seedCertificationIfEmpty() {
  seedExperienceIfEmpty();
  if (readStoreSlice(CERTIFICATION_STORE_KEYS.certifications).length > 0) return false;

  const certId = "crt-block-street-001";
  saveCertification({
    certification_id: certId,
    institution_id: INSTITUTION,
    certification_type: "operations",
    subject: "Institutional Operations Certification",
    standard: "CAE-11.6-W15 Operations Readiness Standard v1",
    status: "issued",
    owner: "usr-001",
    review_cycle: "annual",
    evidence: ["evd-block-street-001"],
    expiration_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    renewal_required: true,
    version: 1,
    issued_at: NOW,
    created_at: NOW,
    updated_at: NOW,
  });

  saveEvidence({
    evidence_id: "evd-block-street-001",
    institution_id: INSTITUTION,
    certification_id: certId,
    evidence_type: "system_test",
    title: "W1-W14 Integration Test Results",
    reference: "test-report-w14-2026",
    recorded_by: "usr-001",
    recorded_at: NOW,
  });

  saveCompliance({
    compliance_id: "cmp-block-street-001",
    institution_id: INSTITUTION,
    policy: "Institutional Operations Policy",
    standard: "CAE-11.6-W15",
    status: "compliant",
    evidence_refs: ["evd-block-street-001"],
    last_verified_at: NOW,
  });

  return true;
}
