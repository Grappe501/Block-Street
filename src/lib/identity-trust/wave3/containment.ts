import { appendLedgerEvent } from "../wave2/ledger";
import {
  loadIdentityContainmentActions,
  loadWave3Flags,
  loadWave3Policy,
  persistIdentityContainmentActions,
  loadIdentityCases,
  persistIdentityCases,
} from "./data";
import { assertWave3Enabled, getIdentityCase } from "./cases";
import type { IdentityContainmentAction } from "./types";
import { itlId, nowIso } from "../utils";

export function applyContainment(input: {
  case_id: string;
  subject_human_id: string;
  action_type: string;
  scope: string;
  reason: string;
  authorized_by: string;
  days?: number;
}): IdentityContainmentAction {
  assertWave3Enabled();
  const flags = loadWave3Flags();
  if (!flags.IDENTITY_TEMPORARY_CONTAINMENT_ENABLED) {
    throw new Error("Temporary containment is not enabled.");
  }

  const policy = loadWave3Policy();
  const days = input.days ?? policy.default_containment_days;
  const expires = new Date(Date.now() + days * 86400000).toISOString();
  const reviewDue = new Date(Date.now() + Math.min(days, 7) * 86400000).toISOString();

  const action: IdentityContainmentAction = {
    id: itlId("icontain"),
    case_id: input.case_id,
    subject_human_id: input.subject_human_id,
    action_type: input.action_type,
    scope: input.scope,
    reason: input.reason,
    authorized_by: input.authorized_by,
    started_at: nowIso(),
    expires_at: expires,
    review_due_at: reviewDue,
    status: "active",
    lifted_at: null,
  };

  const actions = loadIdentityContainmentActions();
  actions.push(action);
  persistIdentityContainmentActions(actions);

  const cases = loadIdentityCases();
  const idx = cases.findIndex((c) => c.id === input.case_id);
  if (idx >= 0) {
    cases[idx] = { ...cases[idx], status: "evidence_review" };
    persistIdentityCases(cases);
  }

  const c = getIdentityCase(input.case_id);
  appendLedgerEvent({
    human_id: input.subject_human_id,
    institution_id: c?.institution_id ?? null,
    event_type: "identity.containment_started",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: input.authorized_by,
    service_identity_id: null,
    source_system: "ITL-REV-001",
    source_record_type: "containment",
    source_record_id: action.id,
    previous_state: null,
    new_state: "active",
    reason_code: input.action_type,
    evidence_digest: null,
    correlation_id: c?.correlation_id ?? itlId("corr"),
  });

  return action;
}

export function liftContainment(containmentId: string, actorId: string) {
  const actions = loadIdentityContainmentActions();
  const idx = actions.findIndex((a) => a.id === containmentId);
  if (idx < 0) throw new Error("Containment action not found.");

  actions[idx] = { ...actions[idx], status: "lifted", lifted_at: nowIso() };
  persistIdentityContainmentActions(actions);

  const a = actions[idx];
  const c = getIdentityCase(a.case_id);
  appendLedgerEvent({
    human_id: a.subject_human_id,
    institution_id: c?.institution_id ?? null,
    event_type: "identity.containment_lifted",
    occurred_at: nowIso(),
    actor_type: "human",
    actor_human_id: actorId,
    service_identity_id: null,
    source_system: "ITL-REV-001",
    source_record_type: "containment",
    source_record_id: containmentId,
    previous_state: "active",
    new_state: "lifted",
    reason_code: "lifted",
    evidence_digest: null,
    correlation_id: c?.correlation_id ?? itlId("corr"),
  });

  return actions[idx];
}

export function getActiveContainment(humanId: string) {
  const now = Date.now();
  return loadIdentityContainmentActions().filter(
    (a) => a.subject_human_id === humanId && a.status === "active" && new Date(a.expires_at).getTime() > now
  );
}
