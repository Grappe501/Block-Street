import { appendLedgerEvent } from "../wave2/ledger";
import { recoverIdentity } from "../wave2/trust-lifecycle";
import { loadIdentityRestorationRequests, loadWave3Flags, persistIdentityRestorationRequests } from "./data";
import { openIdentityCase } from "./cases";
import type { IdentityRestorationRequest } from "./types";
import { itlId, nowIso } from "../utils";

export function submitRestorationRequest(input: {
  human_id: string;
  institution_id?: string;
  prior_case_id?: string;
  restoration_basis: string;
  new_evidence: string;
}): IdentityRestorationRequest {
  const flags = loadWave3Flags();
  if (!flags.IDENTITY_RESTORATION_ENABLED) throw new Error("Identity restoration is not enabled.");

  const req: IdentityRestorationRequest = {
    id: itlId("irestore"),
    human_id: input.human_id,
    institution_id: input.institution_id ?? "inst-block-street",
    prior_case_id: input.prior_case_id ?? null,
    restoration_basis: input.restoration_basis,
    new_evidence: input.new_evidence,
    status: "submitted",
    submitted_at: nowIso(),
    decided_at: null,
    decision_case_id: null,
  };

  const all = loadIdentityRestorationRequests();
  all.push(req);
  persistIdentityRestorationRequests(all);

  const caseRecord = openIdentityCase({
    case_type: "membership_restoration",
    subject_human_id: input.human_id,
    institution_id: input.institution_id,
    scope: "institution_membership",
    summary: `Restoration request: ${input.restoration_basis}`,
    severity: "IG-2",
  });

  req.decision_case_id = caseRecord.id;
  const updated = loadIdentityRestorationRequests();
  const idx = updated.findIndex((r) => r.id === req.id);
  updated[idx] = req;
  persistIdentityRestorationRequests(updated);

  return req;
}

export function approveRestoration(requestId: string, reviewerId: string, provisional = false) {
  const requests = loadIdentityRestorationRequests();
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx < 0) throw new Error("Restoration request not found.");

  const req = requests[idx];
  recoverIdentity(req.human_id, req.institution_id ?? "inst-block-street", req.new_evidence, reviewerId);

  requests[idx] = {
    ...req,
    status: provisional ? "restored_provisionally" : "restored",
    decided_at: nowIso(),
  };
  persistIdentityRestorationRequests(requests);

  appendLedgerEvent({
    human_id: req.human_id,
    institution_id: req.institution_id,
    event_type: "identity.membership_restored",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: reviewerId,
    service_identity_id: null,
    source_system: "ITL-GOV-001",
    source_record_type: "restoration",
    source_record_id: requestId,
    previous_state: "restricted",
    new_state: provisional ? "restored_provisionally" : "restored",
    reason_code: req.restoration_basis,
    evidence_digest: null,
    correlation_id: itlId("corr"),
  });

  return requests[idx];
}

export function listRestorationRequestsForHuman(humanId: string) {
  return loadIdentityRestorationRequests().filter((r) => r.human_id === humanId);
}
