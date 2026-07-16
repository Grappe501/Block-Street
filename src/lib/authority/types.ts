/** CPOS-DURABLE-AUTHORITY-1.0 — scope-aware authorization types */

export type ScopeKind =
  | "campaign"
  | "functional_lane"
  | "cluster"
  | "county"
  | "institution"
  | "committee"
  | "team"
  | "self";

export type AppointmentStatus = "active" | "inactive" | "suspended";

export type AuthorizationReasonCode =
  | "allowed_by_role"
  | "allowed_by_scope"
  | "platform_admin"
  | "missing_permission"
  | "outside_scope"
  | "inactive_appointment"
  | "resource_not_found";

export type AuthorizationDecision = {
  allowed: boolean;
  permission: string;
  actorId: string;
  resourceType: string;
  resourceId?: string;
  authorizedScopeIds: string[];
  matchedRoleIds: string[];
  reasonCode: AuthorizationReasonCode;
};

export type LeadershipAppointment = {
  id: string;
  user_id: string;
  role_key: string;
  status: AppointmentStatus;
  scope_kind: ScopeKind;
  scope_id: string;
  functional_lane?: string | null;
  starts_at: string;
  expires_at: string | null;
};

export type ProtectedRoute = {
  routePattern: string;
  methods: string[];
  requiredPermissions: string[];
  scopeResolver: string;
  csrfRequired: boolean;
  validationSchema: string | null;
  auditRequired: boolean;
};

export type MutationClassification =
  | "protected"
  | "base_gated_only"
  | "authenticated_only"
  | "unprotected"
  | "public_by_design"
  | "legacy_unused"
  | "needs_investigation";

export type MutationInventoryEntry = {
  id: string;
  kind: "api_route" | "server_action";
  routePattern: string | null;
  method: string;
  sourceFile: string;
  classification: MutationClassification;
  gateway: string;
  ownership: string;
};

export type PermissionDefinition = {
  key: string;
  resource: string;
  action: string;
  description: string;
  workbench: string;
  risk: string;
};

export type AuthorizationRequest = {
  actorId: string;
  permission: string;
  resourceType: string;
  resourceId?: string;
  /** Scope tokens e.g. county:clark, institution:henderson-state, self:usr-001 */
  requestedScopeIds: string[];
  correlationId?: string;
  route?: string;
  method?: string;
};

export type DenialAuditEvent = {
  id: string;
  actor_id: string;
  route: string | null;
  method: string | null;
  permission_requested: string;
  scope_requested: string[];
  resource_type: string;
  resource_id: string | null;
  reason_code: AuthorizationReasonCode;
  correlation_id: string | null;
  timestamp: string;
};

export function scopeToken(kind: ScopeKind, id: string): string {
  return `${kind}:${id}`;
}

export function parseScopeToken(token: string): { kind: ScopeKind; id: string } | null {
  const idx = token.indexOf(":");
  if (idx <= 0) return null;
  return { kind: token.slice(0, idx) as ScopeKind, id: token.slice(idx + 1) };
}
