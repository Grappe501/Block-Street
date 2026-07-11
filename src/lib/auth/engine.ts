import { randomBytes } from "crypto";
import {
  appendAudit,
  loadFeatureFlags,
  loadIdentities,
  loadOrganizations,
  loadSessions,
  loadUsers,
  loadWorkspaceMemberships,
  loadWorkspaces,
  persistSessions,
  persistUsers,
  persistWorkspaceMemberships,
  readAuditEvents,
} from "./data";
import { hashPassword } from "./crypto";
import {
  SESSION_COOKIE,
  getSession,
  getSessionFromRequest,
  issueSession,
  listUserSessions,
  logout,
  logoutAll,
  revokeSession,
} from "./session";
import type {
  ActiveContext,
  AuthAuditEvent,
  AuthenticationIdentity,
  Membership,
  PlatformUser,
  Session,
  UserProfile,
} from "./types";

export { hashPassword } from "./crypto";

const BOOTSTRAP_PASSWORD = process.env.AUTH_BOOTSTRAP_PASSWORD ?? "blockstreet-dev";

function audit(event: Omit<AuthAuditEvent, "timestamp">) {
  appendAudit({ event_type: event.action, ...event });
}

function verifyPassword(user: PlatformUser, password: string): boolean {
  const hash = hashPassword(password);
  if (user.password_hash) return user.password_hash === hash;
  return hash === hashPassword(BOOTSTRAP_PASSWORD);
}

export function login(email: string, password: string, meta?: { ip?: string; userAgent?: string }): Session | null {
  const flags = loadFeatureFlags();
  if (!flags.AUTH_PASSWORD_ENABLED) return null;

  const user = loadUsers().find(
    (u) => u.primary_email === email && (u.account_status === "active" || u.account_status === "restricted")
  );
  if (!user || !verifyPassword(user, password)) {
    audit({
      actor_type: "user",
      actor_id: email,
      action: "login_failed",
      target_type: "session",
      target_id: email,
      result: "failure",
      reason: "Invalid credentials",
    });
    return null;
  }
  if (user.account_status === "suspended") return null;
  return issueSession(user, { ...meta, authStrength: "ial2" });
}

export function register(
  input: { email: string; password: string; display_name: string },
  meta?: { ip?: string; userAgent?: string }
): { user: PlatformUser; session: Session } | { error: string } {
  const flags = loadFeatureFlags();
  if (!flags.AUTH_SELF_REGISTRATION_ENABLED) return { error: "Self-registration is not enabled" };
  if (flags.AUTH_INVITATION_ONLY_MODE) return { error: "Registration requires an invitation" };
  if (!flags.AUTH_PASSWORD_ENABLED) return { error: "Password registration is not enabled" };

  const existing = loadUsers().find((u) => u.primary_email === input.email);
  if (existing) return { error: "An account with this email already exists" };

  const now = new Date().toISOString();
  const userId = `usr-${randomBytes(8).toString("hex")}`;
  const user: PlatformUser = {
    user_id: userId,
    public_id: `pub-${userId}`,
    primary_email: input.email,
    verified_emails: [input.email],
    display_name: input.display_name,
    preferred_name: input.display_name.split(" ")[0] ?? input.display_name,
    legal_name_optional: null,
    avatar: null,
    avatar_url: null,
    phone_optional: null,
    locale: "en-US",
    timezone: "America/Chicago",
    authentication_methods: ["email_password"],
    account_status: "pending_verification",
    password_hash: hashPassword(input.password),
    mfa_enabled: false,
    mfa_secret: null,
    identity_assurance_level: "ial1",
    security_state: "normal",
    onboarding_status: "not_started",
    terms_accepted_at: null,
    privacy_policy_accepted_at: null,
    created_at: now,
    updated_at: now,
    last_login_at: null,
    last_active_at: null,
    deleted_at: null,
  };

  const users = loadUsers();
  users.push(user);
  persistUsers(users);
  audit({ actor_type: "user", actor_id: userId, action: "register", target_type: "user", target_id: userId, result: "success", user_id_optional: userId });
  return { user, session: issueSession(user, { ...meta, authStrength: "ial1" }) };
}

export { getSession, getSessionFromRequest, logout, logoutAll, listUserSessions, revokeSession };

export function getUserById(userId: string): PlatformUser | null {
  return loadUsers().find((u) => u.user_id === userId) ?? null;
}

export function resolveMemberships(userId: string): Membership[] {
  const orgs = loadOrganizations();
  const workspaces = loadWorkspaces();
  return loadWorkspaceMemberships()
    .filter((m) => m.user_id === userId && m.status === "active")
    .map((m) => {
      const ws = workspaces.find((w) => w.workspace_id === m.workspace_id);
      const org = orgs.find((o) => o.organization_id === ws?.organization_id);
      return {
        id: m.id,
        user_id: m.user_id,
        organization_id: org?.organization_id ?? "",
        organization_name: org?.name ?? "",
        workspace_id: m.workspace_id,
        workspace_name: ws?.name ?? "",
        roles: m.roles,
        permissions: m.permissions,
        status: m.status,
      };
    });
}

export function resolveActiveContext(session: Session): ActiveContext | null {
  if (!session.active_organization_id || !session.active_workspace_id) return null;
  const org = loadOrganizations().find((o) => o.organization_id === session.active_organization_id);
  const ws = loadWorkspaces().find((w) => w.workspace_id === session.active_workspace_id);
  const mem = loadWorkspaceMemberships().find(
    (m) => m.user_id === session.user_id && m.workspace_id === session.active_workspace_id && m.status === "active"
  );
  if (!org || !ws || !mem) return null;
  return {
    organization_id: org.organization_id,
    organization_name: org.name,
    workspace_id: ws.workspace_id,
    workspace_name: ws.name,
    role_id: mem.role_id,
    roles: mem.roles,
    permissions: mem.permissions,
  };
}

export function getUserProfile(userId: string, session?: Session | null): UserProfile | null {
  const user = getUserById(userId);
  if (!user) return null;
  const { password_hash: _, mfa_secret: __, ...profile } = user;
  return {
    ...profile,
    memberships: resolveMemberships(userId),
    active_context: session ? resolveActiveContext(session) : null,
    linked_providers: loadIdentities().filter((i) => i.user_id === userId && i.status === "active"),
  };
}

export function setActiveContext(sessionId: string, organizationId: string, workspaceId: string): ActiveContext | null {
  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.session_id === sessionId && !s.revoked);
  if (idx < 0) return null;

  const mem = loadWorkspaceMemberships().find(
    (m) => m.user_id === sessions[idx].user_id && m.workspace_id === workspaceId && m.status === "active"
  );
  if (!mem) return null;

  const ws = loadWorkspaces().find((w) => w.workspace_id === workspaceId && w.organization_id === organizationId);
  const org = loadOrganizations().find((o) => o.organization_id === organizationId);
  if (!ws || !org) return null;

  sessions[idx] = {
    ...sessions[idx],
    active_organization_id: organizationId,
    active_workspace_id: workspaceId,
    last_seen_at: new Date().toISOString(),
  };
  persistSessions(sessions);
  audit({
    actor_type: "user",
    actor_id: sessions[idx].user_id,
    action: "context_switch",
    target_type: "workspace",
    target_id: workspaceId,
    result: "success",
    user_id_optional: sessions[idx].user_id,
    organization_id_optional: organizationId,
    workspace_id_optional: workspaceId,
  });
  return resolveActiveContext(sessions[idx]);
}

export function updateUserProfile(
  userId: string,
  patch: Partial<
    Pick<
      PlatformUser,
      | "display_name"
      | "preferred_name"
      | "locale"
      | "timezone"
      | "onboarding_status"
      | "terms_accepted_at"
      | "privacy_policy_accepted_at"
    >
  >
): PlatformUser | null {
  const users = loadUsers();
  const idx = users.findIndex((u) => u.user_id === userId);
  if (idx < 0) return null;
  users[idx] = { ...users[idx], ...patch, updated_at: new Date().toISOString() };
  persistUsers(users);
  audit({ actor_type: "user", actor_id: userId, action: "profile_updated", target_type: "user", target_id: userId, result: "success", user_id_optional: userId });
  return users[idx];
}

export function suspendMembership(userId: string, workspaceId: string, actorId: string): boolean {
  const memberships = loadWorkspaceMemberships();
  const idx = memberships.findIndex((m) => m.user_id === userId && m.workspace_id === workspaceId);
  if (idx < 0) return false;
  memberships[idx] = { ...memberships[idx], status: "suspended" };
  persistWorkspaceMemberships(memberships);
  logoutAll(userId);
  audit({ actor_type: "admin", actor_id: actorId, action: "membership_suspended", target_type: "workspace_membership", target_id: memberships[idx].id, result: "success", user_id_optional: userId, workspace_id_optional: workspaceId });
  return true;
}

export function restoreMembership(userId: string, workspaceId: string, actorId: string): boolean {
  const memberships = loadWorkspaceMemberships();
  const idx = memberships.findIndex((m) => m.user_id === userId && m.workspace_id === workspaceId);
  if (idx < 0) return false;
  memberships[idx] = { ...memberships[idx], status: "active" };
  persistWorkspaceMemberships(memberships);
  audit({ actor_type: "admin", actor_id: actorId, action: "membership_restored", target_type: "workspace_membership", target_id: memberships[idx].id, result: "success", user_id_optional: userId, workspace_id_optional: workspaceId });
  return true;
}

export function assertAuthenticated(cookieHeader: string | null): Session {
  const session = getSessionFromRequest(cookieHeader);
  if (!session) throw new AuthError("Authentication required", 401);
  return session;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getAuditEvents(limit = 50): AuthAuditEvent[] {
  return readAuditEvents(limit) as AuthAuditEvent[];
}

export function getLinkedProviders(userId: string): AuthenticationIdentity[] {
  return loadIdentities().filter((i) => i.user_id === userId && i.status === "active");
}

export { loadFeatureFlags };
export { SESSION_COOKIE } from "./session";

export { createInvitation, getInvitationByToken, acceptInvitation, revokeInvitation, listInvitations } from "./invitations";
export { enrollMfa, verifyMfa, listMfaMethods, revokeMfaMethod, regenerateRecoveryCodes, verifyRecoveryCode } from "./mfa";
export { requestPasswordlessLink, verifyPasswordlessToken, requestPasswordReset, completePasswordReset, getProviderStatus, linkProviderScaffold } from "./providers";
