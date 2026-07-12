import { loadHumanIdentities } from "../data";
import { assertWave1Foundation } from "../wave1/wave-prerequisite";
import { appendLedgerEvent } from "./ledger";
import {
  loadVerificationRequests,
  loadVerificationStatements,
  loadWave2Flags,
  loadWave2Policy,
  persistVerificationRequests,
  persistVerificationStatements,
} from "./data";
import { checkIndependence, completeVerifierEducation, getVerifierQualification, isVerifierEligible } from "./verifier";
import { evaluateAssuranceAndTrust } from "./trust-lifecycle";
import type { HumanVerificationStatement, VerificationRequest } from "./types";
import { itlId, nowIso } from "../utils";

function assertWave2Enabled() {
  assertWave1Foundation("Verification Engine (Wave 2)");
  const flags = loadWave2Flags();
  if (!flags.IDENTITY_VERIFICATION_ENGINE_ENABLED) {
    throw new Error("Identity verification engine is not enabled.");
  }
  return flags;
}

export function createVerificationRequest(input: {
  subject_human_id: string;
  requested_verifier_human_id: string;
  requested_by_human_id: string;
  institution_id: string;
  verification_method_key?: string;
  request_reason: string;
}): VerificationRequest {
  assertWave2Enabled();
  const flags = loadWave2Flags();
  if (!flags.VERIFICATION_REQUESTS_ENABLED) throw new Error("Verification requests are not enabled.");

  if (input.subject_human_id === input.requested_verifier_human_id) {
    throw new Error("A Human cannot request verification from themselves.");
  }

  const policy = loadWave2Policy();
  const expires = new Date(Date.now() + policy.verification_request_expiry_days * 86400000).toISOString();
  const correlationId = itlId("corr");

  const req: VerificationRequest = {
    id: itlId("vreq"),
    subject_human_id: input.subject_human_id,
    institution_id: input.institution_id,
    requested_verifier_human_id: input.requested_verifier_human_id,
    requested_by_human_id: input.requested_by_human_id,
    verification_method_key: input.verification_method_key ?? "personal_knowledge",
    request_reason: input.request_reason,
    status: "sent",
    created_at: nowIso(),
    sent_at: nowIso(),
    viewed_at: null,
    responded_at: null,
    expires_at: expires,
    cancelled_at: null,
    correlation_id: correlationId,
  };

  const requests = loadVerificationRequests();
  requests.push(req);
  persistVerificationRequests(requests);

  appendLedgerEvent({
    human_id: input.subject_human_id,
    institution_id: input.institution_id,
    event_type: "verification.requested",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: input.requested_by_human_id,
    service_identity_id: null,
    source_system: "ITL-VER-001",
    source_record_type: "verification_request",
    source_record_id: req.id,
    previous_state: null,
    new_state: "sent",
    reason_code: input.request_reason,
    evidence_digest: null,
    correlation_id: correlationId,
  });

  return req;
}

export function submitVerificationStatement(input: {
  subject_human_id: string;
  verifier_human_id: string;
  institution_id: string;
  verification_request_id?: string;
  verification_method_key: string;
  relationship_basis: string;
  identity_name_confirmed: string;
  confidence: HumanVerificationStatement["confidence"];
  responsibility_accepted: boolean;
  live_interaction_at?: string;
  notes_private?: string;
}): HumanVerificationStatement {
  assertWave2Enabled();

  if (input.subject_human_id === input.verifier_human_id) {
    throw new Error("A user cannot verify their own identity.");
  }
  if (!input.responsibility_accepted) {
    throw new Error("Verifier responsibility statement must be accepted.");
  }

  const eligibility = isVerifierEligible(input.verifier_human_id);
  if (!eligibility.eligible) throw new Error(eligibility.reason ?? "Verifier is not eligible.");

  const subject = loadHumanIdentities().find((h) => h.user_id === input.subject_human_id);
  if (!subject) throw new Error("Subject identity not found.");

  const { independent } = checkIndependence(
    input.subject_human_id,
    input.verifier_human_id,
    subject.primary_sponsor_id
  );

  const existing = loadVerificationStatements().find(
    (s) =>
      s.subject_human_id === input.subject_human_id &&
      s.verifier_human_id === input.verifier_human_id &&
      s.status === "active"
  );
  if (existing) throw new Error("An active verification statement already exists from this verifier.");

  const policy = loadWave2Policy();
  const stmt: HumanVerificationStatement = {
    id: itlId("vstmt"),
    subject_human_id: input.subject_human_id,
    verifier_human_id: input.verifier_human_id,
    institution_id: input.institution_id,
    verification_request_id: input.verification_request_id ?? null,
    verification_method_key: input.verification_method_key,
    relationship_basis: input.relationship_basis,
    statement_version: policy.verifier_education_version,
    identity_name_confirmed: input.identity_name_confirmed,
    live_interaction_at: input.live_interaction_at ?? null,
    evidence_reference: input.notes_private ?? null,
    confidence: input.confidence,
    status: "active",
    independent,
    submitted_at: nowIso(),
    withdrawn_at: null,
    withdrawal_reason: null,
    reviewed_by: null,
  };

  const statements = loadVerificationStatements();
  statements.push(stmt);
  persistVerificationStatements(statements);

  if (input.verification_request_id) {
    const requests = loadVerificationRequests();
    const idx = requests.findIndex((r) => r.id === input.verification_request_id);
    if (idx >= 0) {
      requests[idx] = { ...requests[idx], status: "confirmed", responded_at: nowIso() };
      persistVerificationRequests(requests);
    }
  }

  appendLedgerEvent({
    human_id: input.subject_human_id,
    institution_id: input.institution_id,
    event_type: "verification.statement_submitted",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: input.verifier_human_id,
    service_identity_id: null,
    source_system: "ITL-VER-001",
    source_record_type: "verification_statement",
    source_record_id: stmt.id,
    previous_state: null,
    new_state: "active",
    reason_code: input.verification_method_key,
    evidence_digest: null,
    correlation_id: itlId("corr"),
  });

  evaluateAssuranceAndTrust(input.subject_human_id, input.institution_id, stmt.id);
  return stmt;
}

export function respondUnableToConfirm(requestId: string, verifierId: string, reason?: string) {
  assertWave2Enabled();
  const requests = loadVerificationRequests();
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx < 0) throw new Error("Verification request not found.");
  const req = requests[idx];
  if (req.requested_verifier_human_id !== verifierId) {
    throw new Error("Only the requested verifier may respond.");
  }

  requests[idx] = { ...req, status: "unable_to_confirm", responded_at: nowIso() };
  persistVerificationRequests(requests);

  appendLedgerEvent({
    human_id: req.subject_human_id,
    institution_id: req.institution_id,
    event_type: "verification.unable_to_confirm",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: verifierId,
    service_identity_id: null,
    source_system: "ITL-VER-001",
    source_record_type: "verification_request",
    source_record_id: requestId,
    previous_state: "sent",
    new_state: "unable_to_confirm",
    reason_code: reason ?? "unable_to_confirm",
    evidence_digest: null,
    correlation_id: req.correlation_id,
  });

  return requests[idx];
}

export function withdrawVerificationStatement(statementId: string, verifierId: string, reason: string) {
  assertWave2Enabled();
  const statements = loadVerificationStatements();
  const idx = statements.findIndex((s) => s.id === statementId);
  if (idx < 0) throw new Error("Verification statement not found.");
  const stmt = statements[idx];
  if (stmt.verifier_human_id !== verifierId) throw new Error("Only the verifier may withdraw.");

  statements[idx] = {
    ...stmt,
    status: "withdrawn",
    withdrawn_at: nowIso(),
    withdrawal_reason: reason,
  };
  persistVerificationStatements(statements);

  appendLedgerEvent({
    human_id: stmt.subject_human_id,
    institution_id: stmt.institution_id,
    event_type: "verification.withdrawn",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: verifierId,
    service_identity_id: null,
    source_system: "ITL-VER-001",
    source_record_type: "verification_statement",
    source_record_id: statementId,
    previous_state: "active",
    new_state: "withdrawn",
    reason_code: reason,
    evidence_digest: null,
    correlation_id: itlId("corr"),
  });

  evaluateAssuranceAndTrust(stmt.subject_human_id, stmt.institution_id, statementId);
  return statements[idx];
}

export function listVerificationRequestsForHuman(humanId: string, role: "subject" | "verifier") {
  const all = loadVerificationRequests();
  if (role === "subject") return all.filter((r) => r.subject_human_id === humanId);
  return all.filter((r) => r.requested_verifier_human_id === humanId);
}

export function listStatementsForSubject(subjectId: string, requesterId: string) {
  const isSelf = subjectId === requesterId;
  const requester = loadHumanIdentities().find((h) => h.user_id === requesterId);
  if (!isSelf && !requester?.institution_leader) {
    throw new Error("Verification records are private.");
  }
  return loadVerificationStatements()
    .filter((s) => s.subject_human_id === subjectId)
    .map((s) => ({
      ...s,
      verifier_human_id: isSelf || requester?.institution_leader ? s.verifier_human_id : "[restricted]",
      relationship_basis: "[restricted]",
      evidence_reference: null,
    }));
}

export function addVerificationLegacy(input: {
  subject_user_id: string;
  verifier_user_id: string;
  relationship: string;
  verification_method: string;
  confidence: "low" | "medium" | "high";
  notes_private?: string;
}) {
  if (!getVerifierQualification(input.verifier_user_id)) {
    completeVerifierEducation(input.verifier_user_id);
  }

  const confidenceMap: Record<string, HumanVerificationStatement["confidence"]> = {
    high: "certain",
    medium: "strong",
    low: "limited",
  };

  const subject = loadHumanIdentities().find((h) => h.user_id === input.subject_user_id);
  return submitVerificationStatement({
    subject_human_id: input.subject_user_id,
    verifier_human_id: input.verifier_user_id,
    institution_id: subject?.institution_id ?? "inst-block-street",
    verification_method_key: mapLegacyMethod(input.verification_method),
    relationship_basis: input.relationship,
    identity_name_confirmed: subject?.public_name ?? "",
    confidence: confidenceMap[input.confidence] ?? "strong",
    responsibility_accepted: true,
    notes_private: input.notes_private,
  });
}

function mapLegacyMethod(method: string): string {
  const map: Record<string, string> = {
    known_personally: "personal_knowledge",
    worked_together: "personal_knowledge",
    organization_leader: "institutional_knowledge",
    government_id: "document_assisted",
    institution_verification: "institutional_knowledge",
    video_verification: "live_human_confirmation",
    community_verification: "personal_knowledge",
    leader_verification: "institutional_knowledge",
  };
  return map[method] ?? "personal_knowledge";
}
