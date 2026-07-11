export type AccountStatus =
  | "invited"
  | "pending_verification"
  | "active"
  | "restricted"
  | "suspended"
  | "archived";

export interface User {
  user_id: string;
  primary_email: string;
  verified_emails: string[];
  display_name: string;
  preferred_name: string;
  avatar: string | null;
  authentication_methods: string[];
  account_status: AccountStatus;
  password_hash: string | null;
  mfa_enabled: boolean;
  mfa_secret: string | null;
  identity_assurance_level: string;
  security_state: string;
  created_at: string;
  last_login_at: string | null;
}

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
  created_at: string;
  expires_at: string;
  ip_address: string | null;
  user_agent: string | null;
  revoked: boolean;
}

export type UserProfile = Omit<User, "password_hash" | "mfa_secret"> & {
  memberships: Membership[];
};

export interface AuthAuditEvent {
  timestamp: string;
  actor_type: string;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  result: string;
  reason?: string;
}
