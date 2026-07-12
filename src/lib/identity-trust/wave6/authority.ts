import { itlId, nowIso } from "../utils";
import { loadOperationalAuthorities, persistOperationalAuthorities } from "./data";
import type { IdentityOperationalAuthority, OperationalRole } from "./types";

const ROLE_ACTIONS: Record<OperationalRole, string[]> = {
  individual_human: ["view_own_identity", "request_verification", "file_appeal", "manage_directory"],
  sponsor: ["create_invitation", "view_own_invitations", "report_mistaken_invitation"],
  verifier: ["confirm_verification", "decline_verification", "withdraw_statement"],
  identity_support_operator: ["explain_policy", "resend_invitation", "route_case", "escalate_security"],
  institution_identity_administrator: ["view_institution_ops", "assign_reviewers", "temporary_local_controls"],
  identity_reviewer: ["review_case", "enter_findings", "recommend_decision"],
  platform_identity_reviewer: ["review_duplicate", "approve_merge", "review_global_conflict"],
  appeal_reviewer: ["review_appeal", "affirm_reverse_modify"],
  security_identity_operator: ["contain_account", "revoke_sessions", "escalate_takeover"],
  federation_identity_administrator: ["manage_agreements", "view_federation_aggregate"],
  identity_auditor: ["read_audit", "run_integrity_check", "export_audit"],
  executive_oversight: ["view_aggregate", "request_audit", "request_policy_review"],
};

const PROHIBITED_BY_ROLE: Partial<Record<OperationalRole, string[]>> = {
  identity_support_operator: ["verify_human", "merge_identities", "deny_appeal", "change_trust"],
  executive_oversight: ["verify_human", "merge_identities", "decide_case", "deny_appeal"],
  identity_auditor: ["verify_human", "merge_identities", "decide_case", "mutate_records"],
  sponsor: ["view_sponsored_private_activity", "view_verification_evidence", "end_membership"],
};

export function grantOperationalAuthority(input: {
  human_id: string;
  operational_role: OperationalRole;
  institution_id?: string;
  granted_by: string;
  expires_at?: string;
}): IdentityOperationalAuthority {
  const authority: IdentityOperationalAuthority = {
    id: itlId("ioa"),
    human_id: input.human_id,
    institution_id: input.institution_id ?? null,
    federation_id: null,
    operational_role: input.operational_role,
    authorized_actions: ROLE_ACTIONS[input.operational_role] ?? [],
    authorized_case_types: [],
    starts_at: nowIso(),
    expires_at: input.expires_at ?? null,
    granted_by: input.granted_by,
    status: "active",
  };
  const all = loadOperationalAuthorities().filter(
    (a) => !(a.human_id === input.human_id && a.operational_role === input.operational_role && a.status === "active")
  );
  all.push(authority);
  persistOperationalAuthorities(all);
  return authority;
}

export function getAuthoritiesForHuman(humanId: string): IdentityOperationalAuthority[] {
  const now = Date.now();
  return loadOperationalAuthorities().filter((a) => {
    if (a.human_id !== humanId || a.status !== "active") return false;
    if (a.expires_at && new Date(a.expires_at).getTime() < now) return false;
    return true;
  });
}

export function canPerformAction(humanId: string, action: string, role?: OperationalRole): boolean {
  const authorities = getAuthoritiesForHuman(humanId);
  const relevant = role ? authorities.filter((a) => a.operational_role === role) : authorities;
  for (const a of relevant) {
    if (a.authorized_actions.includes(action)) {
      const prohibited = PROHIBITED_BY_ROLE[a.operational_role] ?? [];
      if (!prohibited.includes(action)) return true;
    }
  }
  return false;
}

export function assertOperationalAuthority(humanId: string, action: string, operation: string) {
  if (!canPerformAction(humanId, action)) {
    throw new Error(`ITL-W6-001: ${operation} requires authority '${action}'. Operator ${humanId} lacks scope.`);
  }
}

export function ensureDefaultAuthorities() {
  const existing = loadOperationalAuthorities();
  if (existing.length > 0) return existing;
  const defaults: { human_id: string; role: OperationalRole }[] = [
    { human_id: "usr-001", role: "institution_identity_administrator" },
    { human_id: "usr-002", role: "identity_reviewer" },
    { human_id: "usr-003", role: "identity_support_operator" },
    { human_id: "usr-004", role: "security_identity_operator" },
    { human_id: "usr-005", role: "executive_oversight" },
    { human_id: "usr-006", role: "identity_auditor" },
  ];
  for (const d of defaults) {
    grantOperationalAuthority({ human_id: d.human_id, operational_role: d.role, granted_by: "system", institution_id: "inst-block-street" });
  }
  return loadOperationalAuthorities();
}

export function getProhibitedActionsForRole(role: OperationalRole): string[] {
  return PROHIBITED_BY_ROLE[role] ?? [];
}
