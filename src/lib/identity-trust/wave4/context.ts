import { createHash } from "crypto";
import { loadHumanIdentities } from "../data";
import { itlId, nowIso } from "../utils";
import {
  loadActiveContexts,
  loadContextSessions,
  loadFederationMembershipsV4,
  persistActiveContexts,
  persistContextSessions,
  persistFederationAuditEvents,
  loadFederationAuditEvents,
} from "./data";
import type { ActiveInstitutionContext, FederationInstitutionMembership, InstitutionContextSession } from "./types";
import { assertWave4OperationsEnabled } from "./wave-prerequisite";

function audit(event: Record<string, unknown>) {
  const events = loadFederationAuditEvents();
  events.push({ id: itlId("fed-audit"), ...event, timestamp: nowIso() });
  persistFederationAuditEvents(events);
}

export function getActiveMemberships(humanId: string): FederationInstitutionMembership[] {
  return loadFederationMembershipsV4().filter(
    (m) => m.human_id === humanId && ["active", "provisional", "restricted"].includes(m.membership_status)
  );
}

export function getActiveContext(humanId: string): ActiveInstitutionContext | null {
  return loadActiveContexts().find((c) => c.human_id === humanId) ?? null;
}

export function switchInstitutionContext(input: {
  human_id: string;
  institution_id: string;
  session_id: string;
  workspace_id?: string;
}): ActiveInstitutionContext {
  assertWave4OperationsEnabled("Context switch");
  const membership = loadFederationMembershipsV4().find(
    (m) =>
      m.human_id === input.human_id &&
      m.institution_id === input.institution_id &&
      ["active", "provisional", "restricted"].includes(m.membership_status)
  );
  if (!membership) {
    audit({
      event_type: "federation.context_switch_denied",
      human_id: input.human_id,
      institution_id: input.institution_id,
      reason: "no_active_membership",
    });
    throw new Error("No active membership for institution");
  }

  const identity = loadHumanIdentities().find((h) => h.user_id === input.human_id);
  const context: ActiveInstitutionContext = {
    human_id: input.human_id,
    institution_id: input.institution_id,
    membership_id: membership.id,
    organization_unit_id: membership.primary_unit_id,
    workspace_id: input.workspace_id ?? null,
    role_assignment_ids: [membership.role],
    identity_assurance_state: identity?.trust_label ?? "unknown",
    institution_trust_state: membership.institution_trust_state,
    selected_at: nowIso(),
    expires_at: null,
  };

  const contexts = loadActiveContexts().filter((c) => c.human_id !== input.human_id);
  contexts.push(context);
  persistActiveContexts(contexts);

  const session: InstitutionContextSession = {
    id: itlId("ctxsess"),
    session_id: input.session_id,
    human_id: input.human_id,
    institution_id: input.institution_id,
    membership_id: membership.id,
    entered_at: nowIso(),
    last_activity_at: nowIso(),
    exited_at: null,
    step_up_verified_at: null,
    status: "active",
  };
  const sessions = loadContextSessions();
  sessions.push(session);
  persistContextSessions(sessions);

  audit({
    event_type: "federation.context_entered",
    human_id: input.human_id,
    institution_id: input.institution_id,
    membership_id: membership.id,
  });

  return context;
}

export function validateInstitutionContext(input: {
  human_id: string;
  institution_id: string;
  resource_institution_id: string;
}): { valid: boolean; reason?: string } {
  const context = getActiveContext(input.human_id);
  if (!context) return { valid: false, reason: "no_active_context" };
  if (context.institution_id !== input.institution_id) {
    audit({
      event_type: "federation.context_switch_denied",
      human_id: input.human_id,
      expected: context.institution_id,
      received: input.institution_id,
      reason: "context_mismatch",
    });
    return { valid: false, reason: "context_mismatch" };
  }
  if (input.resource_institution_id !== input.institution_id) {
    audit({
      event_type: "federation.context_switch_denied",
      human_id: input.human_id,
      resource_institution_id: input.resource_institution_id,
      active_institution_id: input.institution_id,
      reason: "resource_institution_mismatch",
    });
    return { valid: false, reason: "resource_institution_mismatch" };
  }
  return { valid: true };
}

export function buildContextToken(context: ActiveInstitutionContext): string {
  const payload = `${context.human_id}:${context.institution_id}:${context.membership_id}:${context.selected_at}`;
  return createHash("sha256").update(payload).digest("hex").slice(0, 32);
}

export function listContextHistory(humanId: string): InstitutionContextSession[] {
  return loadContextSessions()
    .filter((s) => s.human_id === humanId)
    .sort((a, b) => b.entered_at.localeCompare(a.entered_at));
}
