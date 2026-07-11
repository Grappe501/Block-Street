export type AccountStatus =
  | "invited"
  | "pending_verification"
  | "active"
  | "restricted"
  | "suspended"
  | "archived"
  | "deletion_pending"
  | "deleted"
  | "anonymized";

export type OnboardingStatus = "not_started" | "in_progress" | "complete";

export type IdentityAssuranceLevel = "ial0" | "ial1" | "ial2" | "ial3" | "ial4";

export type ProviderType =
  | "email_password"
  | "passwordless"
  | "google"
  | "microsoft"
  | "passkey"
  | "recovery_code";

export interface PlatformUser {
  user_id: string;
  public_id: string;
  primary_email: string;
  verified_emails: string[];
  display_name: string;
  preferred_name: string;
  legal_name_optional: string | null;
  avatar: string | null;
  avatar_url: string | null;
  phone_optional: string | null;
  locale: string;
  timezone: string;
  authentication_methods: string[];
  account_status: AccountStatus;
  password_hash: string | null;
  mfa_enabled: boolean;
  mfa_secret: string | null;
  identity_assurance_level: IdentityAssuranceLevel | string;
  security_state: string;
  onboarding_status: OnboardingStatus | string;
  terms_accepted_at: string | null;
  privacy_policy_accepted_at: string | null;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  last_active_at: string | null;
  deleted_at: string | null;
}

/** @deprecated Use PlatformUser — alias for backward compatibility */
export type User = PlatformUser;

export interface AuthenticationIdentity {
  id: string;
  user_id: string;
  provider_type: ProviderType | string;
  provider_subject: string;
  provider_email: string;
  provider_email_verified: boolean;
  provider_tenant_id: string | null;
  linked_at: string;
  last_used_at: string | null;
  status: "active" | "revoked";
  metadata_reference: string | null;
}

export interface Organization {
  organization_id: string;
  name: string;
  slug: string;
  status: string;
  created_at: string;
}

export interface Workspace {
  workspace_id: string;
  organization_id: string;
  name: string;
  slug: string;
  status: string;
  created_at: string;
}

export interface OrganizationMembership {
  id: string;
  organization_id: string;
  user_id: string;
  membership_status: string;
  membership_type: string;
  joined_at: string | null;
  invited_at: string | null;
  invited_by: string | null;
  approved_at: string | null;
  approved_by: string | null;
  primary_role_id: string | null;
  title_optional: string | null;
  department_optional: string | null;
}

export interface WorkspaceMembership {
  id: string;
  workspace_id: string;
  user_id: string;
  organization_membership_id: string;
  status: string;
  role_id: string;
  roles: string[];
  permissions: string[];
  joined_at: string;
  ended_at: string | null;
  access_expiration: string | null;
}

/** Resolved membership view for API responses */
export interface Membership {
  id: string;
  user_id: string;
  organization_id: string;
  organization_name: string;
  workspace_id: string;
  workspace_name: string;
  roles: string[];
  permissions: string[];
  status: string;
}

export interface Session {
  session_id: string;
  user_id: string;
  session_hash: string;
  created_at: string;
  last_seen_at: string;
  expires_at: string;
  ip_address: string | null;
  user_agent: string | null;
  revoked: boolean;
  revocation_reason: string | null;
  device_type: string | null;
  browser: string | null;
  operating_system: string | null;
  authentication_strength: string;
  active_organization_id: string | null;
  active_workspace_id: string | null;
  risk_state: "normal" | "elevated" | "blocked";
}

export interface IdentityInvitation {
  id: string;
  email: string;
  organization_id: string;
  workspace_id: string | null;
  role_id: string | null;
  invited_by: string;
  invitation_token_hash: string;
  created_at: string;
  expires_at: string;
  accepted_at: string | null;
  revoked_at: string | null;
  status: "created" | "sent" | "opened" | "accepted" | "expired" | "revoked" | "declined";
  message_optional: string | null;
}

export interface MfaMethod {
  id: string;
  user_id: string;
  method_type: "totp" | "passkey" | "email";
  label: string;
  secret_hash: string;
  enrolled_at: string;
  last_used_at: string | null;
  status: "active" | "revoked";
}

export interface RecoveryCode {
  id: string;
  user_id: string;
  code_hash: string;
  consumed_at: string | null;
  created_at: string;
}

export interface ActiveContext {
  organization_id: string;
  organization_name: string;
  workspace_id: string;
  workspace_name: string;
  role_id: string;
  roles: string[];
  permissions: string[];
}

export type UserProfile = Omit<PlatformUser, "password_hash" | "mfa_secret"> & {
  memberships: Membership[];
  active_context: ActiveContext | null;
  linked_providers: AuthenticationIdentity[];
};

export interface AuthAuditEvent {
  timestamp: string;
  event_type?: string;
  actor_type: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  result: string;
  reason?: string;
  user_id_optional?: string;
  organization_id_optional?: string;
  workspace_id_optional?: string;
  correlation_id?: string;
}

export interface FeatureFlags {
  AUTH_REQUIRED_FOR_PROTECTED_ROUTES: boolean;
  AUTH_GOOGLE_ENABLED: boolean;
  AUTH_MICROSOFT_ENABLED: boolean;
  AUTH_PASSWORD_ENABLED: boolean;
  AUTH_PASSWORDLESS_ENABLED: boolean;
  AUTH_MFA_ENABLED: boolean;
  AUTH_MFA_REQUIRED_FOR_ADMINS: boolean;
  AUTH_SESSION_DEVICE_VIEW_ENABLED: boolean;
  AUTH_SELF_REGISTRATION_ENABLED: boolean;
  AUTH_INVITATION_ONLY_MODE: boolean;
  AUTH_HONOR_SYSTEM_DISABLED: boolean;
}

export interface PasswordlessToken {
  token_hash: string;
  email: string;
  created_at: string;
  expires_at: string;
  consumed_at: string | null;
}
