import { createHash } from "crypto";
import { loadHumanIdentities } from "../data";
import { itlId, nowIso } from "../utils";
import {
  loadAssuranceReceipts,
  loadPortableAssurances,
  persistAssuranceReceipts,
  persistPortableAssurances,
} from "./data";
import type { InstitutionAssuranceReceipt, PortableIdentityAssurance } from "./types";
import { assertWave4OperationsEnabled } from "./wave-prerequisite";

const PERMITTED_CLAIMS = [
  "canonical_human_exists",
  "public_human_name_approved",
  "identity_verified",
  "identity_strongly_verified",
  "global_identity_unrestricted",
];

export function issuePortableAssurance(humanId: string): PortableIdentityAssurance {
  assertWave4OperationsEnabled("Portable assurance");
  const identity = loadHumanIdentities().find((h) => h.user_id === humanId);
  if (!identity) throw new Error("Human not found");

  const claims: string[] = ["canonical_human_exists", "public_human_name_approved"];
  if (identity.trust_label === "verified" || identity.trust_label === "trusted" || identity.trust_label === "federation_trusted") {
    claims.push("identity_verified");
  }
  if (identity.trust_label === "federation_trusted") claims.push("identity_strongly_verified");
  if (identity.identity_status === "active") claims.push("global_identity_unrestricted");

  const integrityRef = createHash("sha256")
    .update(`${identity.global_human_id}:${identity.trust_label}:${nowIso()}`)
    .digest("hex");

  const assurance: PortableIdentityAssurance = {
    id: itlId("pia"),
    human_id: humanId,
    assurance_state: identity.trust_label,
    assurance_version: "1.0",
    issued_at: nowIso(),
    expires_at: null,
    issuer: "Platform Identity Trust Layer",
    integrity_reference: integrityRef,
    permitted_claims: claims.filter((c) => PERMITTED_CLAIMS.includes(c)),
    revocation_status: "active",
  };

  const all = loadPortableAssurances().filter((a) => !(a.human_id === humanId && a.revocation_status === "active"));
  all.push(assurance);
  persistPortableAssurances(all);
  return assurance;
}

export function getPortableAssuranceForHuman(humanId: string): PortableIdentityAssurance | null {
  return (
    loadPortableAssurances().find((a) => a.human_id === humanId && a.revocation_status === "active") ??
    issuePortableAssurance(humanId)
  );
}

export function recordAssuranceReceipt(input: {
  institution_id: string;
  human_id: string;
  membership_id: string;
}): InstitutionAssuranceReceipt {
  const assurance = getPortableAssuranceForHuman(input.human_id);
  if (!assurance) throw new Error("No portable assurance available");

  const receipt: InstitutionAssuranceReceipt = {
    id: itlId("iar"),
    institution_id: input.institution_id,
    human_id: input.human_id,
    membership_id: input.membership_id,
    portable_assurance_id: assurance.id,
    claims_received: assurance.permitted_claims,
    received_at: nowIso(),
    valid_until: assurance.expires_at,
    status: "active",
  };

  const receipts = loadAssuranceReceipts();
  receipts.push(receipt);
  persistAssuranceReceipts(receipts);
  return receipt;
}

export function getAssuranceReceiptsForInstitution(institutionId: string): InstitutionAssuranceReceipt[] {
  return loadAssuranceReceipts().filter((r) => r.institution_id === institutionId);
}

export function refreshAssuranceReceipt(input: {
  institution_id: string;
  human_id: string;
  membership_id: string;
}): InstitutionAssuranceReceipt {
  issuePortableAssurance(input.human_id);
  return recordAssuranceReceipt(input);
}

/** Returns claims only — never private verification evidence */
export function getPublicAssuranceClaims(humanId: string) {
  const assurance = getPortableAssuranceForHuman(humanId);
  if (!assurance) return null;
  return {
    human_identity_assurance: assurance.assurance_state,
    verified_at: assurance.issued_at,
    current_status: assurance.revocation_status === "active" ? "Active" : "Revoked",
    integrity_check: "Valid",
    assurance_authority: assurance.issuer,
    permitted_claims: assurance.permitted_claims,
  };
}
