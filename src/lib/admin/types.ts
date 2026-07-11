export type ScopeType = "platform" | "organization" | "workspace" | "service" | "data_domain" | "incident";

export type RiskLevel = "low" | "moderate" | "high" | "critical";

export interface AdminRole {
  id: string;
  name: string;
  display_name: string;
  description: string;
  role_type: "system" | "custom";
  organization_id_optional: string | null;
  workspace_id_optional: string | null;
  status: string;
  is_system_role: boolean;
  is_assignable: boolean;
  risk_level: RiskLevel | string;
  created_at: string;
}

export interface Permission {
  id: string;
  key: string;
  resource: string;
  action: string;
  description: string;
  risk_level: RiskLevel | string;
  requires_mfa: boolean;
  requires_approval: boolean;
  is_system_permission: boolean;
}

export interface UserRoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  scope_type: ScopeType | string;
  scope_id: string;
  assigned_by: string;
  approved_by_optional?: string | null;
  reason: string;
  starts_at: string;
  expires_at: string | null;
  status: string;
  created_at: string;
  revoked_at?: string | null;
}

export interface AccessPolicy {
  id: string;
  name: string;
  description: string;
  policy_type: string;
  scope_type: string;
  scope_id: string;
  effect: string;
  priority: number;
  status: string;
  effective_at: string;
  version: number;
}

export interface AdministrativeApproval {
  id: string;
  action_type: string;
  requested_by: string;
  scope_type: string;
  scope_id: string;
  target_type: string;
  target_id: string;
  reason: string;
  risk_level: string;
  status: "draft" | "pending" | "approved" | "rejected" | "expired" | "executed" | "failed";
  required_approvals: number;
  approved_by: string[];
  rejected_by: string | null;
  created_at: string;
  expires_at: string;
  executed_at: string | null;
}

export interface AdminFeatureFlags {
  ADMIN_CENTER_ENABLED: boolean;
  ADMIN_ROLE_MANAGEMENT_ENABLED: boolean;
  ADMIN_CUSTOM_ROLES_ENABLED: boolean;
  ADMIN_POLICY_ENGINE_ENABLED: boolean;
  ADMIN_APPROVALS_ENABLED: boolean;
  ADMIN_SUPPORT_SESSIONS_ENABLED: boolean;
  ADMIN_EMERGENCY_ACCESS_ENABLED: boolean;
  ADMIN_DATA_OPERATIONS_ENABLED: boolean;
  ADMIN_FEATURE_FLAGS_ENABLED: boolean;
  ADMIN_INTEGRATION_MANAGEMENT_ENABLED: boolean;
  ADMIN_AUDIT_EXPLORER_ENABLED: boolean;
  ADMIN_LEGACY_WORKBENCH_READ_ONLY: boolean;
}

export interface AdministrativeContext {
  user_id: string;
  session_id: string;
  organization_id: string | null;
  workspace_id: string | null;
  administrative_role_ids: string[];
  administrative_role_names: string[];
  effective_permissions: string[];
  authentication_strength: string;
  elevation_state: "normal" | "elevated";
  elevation_expires_at: string | null;
  scopes: { type: string; id: string }[];
}

export interface AdminAuditEvent {
  timestamp: string;
  event_type: string;
  actor_user_id: string;
  action_type: string;
  scope_type: string;
  scope_id: string;
  target_type: string;
  target_id: string;
  reason?: string;
  risk_level?: string;
  result: string;
  correlation_id?: string;
}

export interface AttentionItem {
  id: string;
  issue: string;
  severity: string;
  owner: string;
  scope_type: string;
  scope_id: string;
  created_at: string;
  deadline: string | null;
  required_action: string;
  status: string;
  count: number;
}

export interface AdminOverview {
  users_active: number;
  pending_invitations: number;
  organizations: number;
  workspaces: number;
  security_alerts: number;
  failed_jobs: number;
  pending_approvals: number;
  integration_failures: number;
  platform_health: string;
}

export interface RoleSimulation {
  role_id: string;
  role_name: string;
  allowed_permissions: string[];
  denied_permissions: string[];
  visible_routes: string[];
  requires_mfa_actions: string[];
  requires_approval_actions: string[];
}
