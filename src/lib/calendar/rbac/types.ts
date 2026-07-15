/** CAL-P1.2 — RBAC type contracts */

export type CalendarRbacMode = "disabled" | "audit_only" | "enforced";

export type CalendarRoleKey =
  | "campaign_manager"
  | "assistant_campaign_manager"
  | "volunteer_manager"
  | "event_board_member"
  | "candidate_scheduler"
  | "college_command_lead"
  | "college_leader"
  | "county_volunteer_manager"
  | "county_leader"
  | "city_leader"
  | "team_lead"
  | "event_owner"
  | "shift_lead"
  | "volunteer"
  | "viewer"
  | "system_operator"
  | (string & {});

export type CalendarPermissionKey = string;

export type CalendarActor = {
  userId: string | null;
  authenticated: boolean;
  systemRoleKeys: CalendarRoleKey[];
  teamIds: string[];
  collegeSlugs: string[];
  countySlugs: string[];
  citySlugs: string[];
  positionIds: string[];
  campaignWide: boolean;
  candidateScheduleAccess: boolean;
  publicationAccess: boolean;
  auditAccess: boolean;
  accountStatus: "active" | "inactive" | "suspended" | "pending";
};

export type CalendarAuthorityScope = {
  type:
    | "campaign"
    | "candidate"
    | "volunteer"
    | "college"
    | "county"
    | "city"
    | "team"
    | "position"
    | "event"
    | "public"
    | "internal";
  key: string;
};

export type CalendarEventRelationship =
  | "creator"
  | "owner"
  | "primary_contact"
  | "assigned_reviewer"
  | "assigned_event_board_member"
  | "assigned_team_lead"
  | "assigned_shift_lead"
  | "confirmed_volunteer"
  | "interested_volunteer"
  | "none";

export type CalendarPolicyResource = {
  eventId?: string;
  ownerUserId?: string | null;
  operationalStatus?: string;
  approvalStatus?: string;
  publicationStatus?: string;
  candidateAttendanceStatus?: string;
  collegeSlugs?: string[];
  countySlugs?: string[];
  citySlugs?: string[];
  teamIds?: string[];
  positionIds?: string[];
  visibility?: string;
  containsCandidatePrivateData?: boolean;
  campaignWide?: boolean;
};

export type CalendarPolicyContext = {
  requestId: string;
  route: string;
  method: string;
  source: "ui" | "api" | "server_action" | "job" | "migration";
  isMutation: boolean;
  isPublicProjection: boolean;
  now: string;
  relationship?: CalendarEventRelationship;
  selfConfirm?: boolean;
  actorIsOwner?: boolean;
  separationOfDuties?: boolean;
  countyReviewRequired?: boolean;
  overrideReason?: string;
};

export type CalendarPolicyReasonCode =
  | "allowed"
  | "unauthenticated"
  | "account_inactive"
  | "unknown_permission"
  | "role_lacks_permission"
  | "explicit_deny"
  | "scope_mismatch"
  | "candidate_privacy"
  | "publication_not_ready"
  | "self_approval"
  | "self_confirm"
  | "state_forbidden"
  | "mode_disabled"
  | "missing_publication_access";

export type CalendarPolicyDecision = {
  allowed: boolean;
  mode: CalendarRbacMode;
  reasonCode: CalendarPolicyReasonCode;
  reason: string;
  matchedRoles: CalendarRoleKey[];
  matchedScopes: CalendarAuthorityScope[];
  missingPermissions: CalendarPermissionKey[];
  auditRequired: boolean;
  sensitiveFieldsAllowed: string[];
  /** Only true when mode===enforced AND Gate A CLOSED AND !allowed */
  should_block: boolean;
  enforcement_active: boolean;
};

export type CalendarPolicyRequest = {
  actor: CalendarActor;
  permission: CalendarPermissionKey;
  resource: CalendarPolicyResource;
  context: CalendarPolicyContext;
};

export type AuditOnlyMismatchType =
  | "policy_allowed_actual_denied"
  | "policy_denied_actual_allowed"
  | "scope_mismatch"
  | "missing_actor_context"
  | "missing_resource_scope"
  | "candidate_privacy_risk"
  | "publication_bypass_risk"
  | "self_approval_risk";

export type PolicyDecisionRecord = {
  policy_decision_id: string;
  request_id: string;
  actor_user_id: string | null;
  permission: string;
  resource_event_id?: string;
  decision: "allow" | "deny";
  reason_code: string;
  matched_roles: string[];
  matched_scopes: CalendarAuthorityScope[];
  actual_behavior?: "allowed" | "denied" | "unknown";
  mismatch_type?: AuditOnlyMismatchType | null;
  mode: CalendarRbacMode;
  created_at: string;
};

export function emptyActor(partial: Partial<CalendarActor> = {}): CalendarActor {
  return {
    userId: null,
    authenticated: false,
    systemRoleKeys: ["viewer"],
    teamIds: [],
    collegeSlugs: [],
    countySlugs: [],
    citySlugs: [],
    positionIds: [],
    campaignWide: false,
    candidateScheduleAccess: false,
    publicationAccess: false,
    auditAccess: false,
    accountStatus: "active",
    ...partial,
  };
}

export function defaultPolicyContext(partial: Partial<CalendarPolicyContext> = {}): CalendarPolicyContext {
  return {
    requestId: `req-${Date.now()}`,
    route: "/calendar",
    method: "GET",
    source: "server_action",
    isMutation: false,
    isPublicProjection: false,
    now: new Date().toISOString(),
    relationship: "none",
    ...partial,
  };
}
