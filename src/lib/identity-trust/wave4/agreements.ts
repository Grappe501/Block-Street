import { itlId, nowIso } from "../utils";
import { loadIdentityAgreements, persistIdentityAgreements } from "./data";
import type { InterinstitutionalAgreement } from "./types";

export function createIdentityAgreement(input: {
  agreement_type: string;
  institution_a_id: string;
  institution_b_id?: string;
  name: string;
  purpose: string;
  recognized_claims?: string[];
  data_sharing_scope?: string[];
}): InterinstitutionalAgreement {
  const agreement: InterinstitutionalAgreement = {
    id: itlId("iagr"),
    agreement_type: input.agreement_type,
    institution_a_id: input.institution_a_id,
    institution_b_id: input.institution_b_id ?? null,
    name: input.name,
    purpose: input.purpose,
    recognized_claims: input.recognized_claims ?? ["identity_verified"],
    data_sharing_scope: input.data_sharing_scope ?? [],
    status: "draft",
    version: "1.0",
    starts_at: nowIso(),
    expires_at: null,
  };
  const all = loadIdentityAgreements();
  all.push(agreement);
  persistIdentityAgreements(all);
  return agreement;
}

export function approveIdentityAgreement(agreementId: string, institutionId: string): InterinstitutionalAgreement {
  const agreements = loadIdentityAgreements();
  const idx = agreements.findIndex((a) => a.id === agreementId);
  if (idx < 0) throw new Error("Agreement not found");
  const agr = agreements[idx];
  if (agr.institution_a_id !== institutionId && agr.institution_b_id !== institutionId) {
    throw new Error("Institution not party to agreement");
  }
  agreements[idx] = { ...agr, status: "active" };
  persistIdentityAgreements(agreements);
  return agreements[idx];
}

export function listIdentityAgreements(institutionId?: string) {
  const all = loadIdentityAgreements();
  return institutionId
    ? all.filter((a) => a.institution_a_id === institutionId || a.institution_b_id === institutionId)
    : all;
}

export function suspendIdentityAgreement(agreementId: string): InterinstitutionalAgreement {
  const agreements = loadIdentityAgreements();
  const idx = agreements.findIndex((a) => a.id === agreementId);
  if (idx < 0) throw new Error("Agreement not found");
  agreements[idx] = { ...agreements[idx], status: "suspended" };
  persistIdentityAgreements(agreements);
  return agreements[idx];
}
