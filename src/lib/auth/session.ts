import { randomBytes } from "crypto";
import { appendAudit, loadSessions, loadUsers, loadWorkspaceMemberships, loadWorkspaces, persistSessions, persistUsers } from "./data";
import { hashSecret } from "./crypto";
import { signSessionToken, verifySignedSessionToken } from "./signed-session";
import type { AuthAuditEvent, PlatformUser, Session } from "./types";

export const SESSION_COOKIE = "cos_session";
const SESSION_HOURS = Number(process.env.AUTH_SESSION_HOURS ?? 24);

function parseUserAgent(ua: string | undefined) {
  if (!ua) return { browser: null, operating_system: null, device_type: "unknown" };
  const lower = ua.toLowerCase();
  const browser = lower.includes("chrome") ? "Chrome" : lower.includes("firefox") ? "Firefox" : lower.includes("safari") ? "Safari" : "Other";
  const operating_system = lower.includes("windows") ? "Windows" : lower.includes("mac") ? "macOS" : lower.includes("android") ? "Android" : lower.includes("iphone") || lower.includes("ipad") ? "iOS" : "Other";
  const device_type = lower.includes("mobile") || lower.includes("iphone") || lower.includes("android") ? "mobile" : lower.includes("ipad") || lower.includes("tablet") ? "tablet" : "desktop";
  return { browser, operating_system, device_type };
}

function defaultContextForUser(userId: string) {
  const wsMem = loadWorkspaceMemberships().find((m) => m.user_id === userId && m.status === "active");
  if (!wsMem) return { orgId: null, wsId: null };
  const ws = loadWorkspaces().find((w) => w.workspace_id === wsMem.workspace_id);
  return { orgId: ws?.organization_id ?? null, wsId: wsMem.workspace_id };
}

function audit(event: Omit<AuthAuditEvent, "timestamp">) {
  appendAudit({ event_type: event.action, ...event });
}

export function createSessionRecord(user: PlatformUser, meta?: { ip?: string; userAgent?: string; authStrength?: string }): Session {
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_HOURS * 3600000);
  const sessionId = `sess-${randomBytes(16).toString("hex")}`;
  const { browser, operating_system, device_type } = parseUserAgent(meta?.userAgent);
  const ctx = defaultContextForUser(user.user_id);
  return {
    session_id: sessionId,
    user_id: user.user_id,
    session_hash: hashSecret(sessionId),
    created_at: now.toISOString(),
    last_seen_at: now.toISOString(),
    expires_at: expires.toISOString(),
    ip_address: meta?.ip ?? null,
    user_agent: meta?.userAgent ?? null,
    revoked: false,
    revocation_reason: null,
    device_type,
    browser,
    operating_system,
    authentication_strength: meta?.authStrength ?? user.identity_assurance_level,
    active_organization_id: ctx.orgId,
    active_workspace_id: ctx.wsId,
    risk_state: "normal",
  };
}

function sessionFromSignedPayload(payload: ReturnType<typeof verifySignedSessionToken>): Session | null {
  if (!payload) return null;
  const user = loadUsers().find((u) => u.user_id === payload.user_id);
  if (!user || user.account_status === "suspended") return null;
  return {
    session_id: payload.session_id,
    user_id: payload.user_id,
    session_hash: hashSecret(payload.session_id),
    created_at: payload.expires_at,
    last_seen_at: new Date().toISOString(),
    expires_at: payload.expires_at,
    ip_address: null,
    user_agent: null,
    revoked: false,
    revocation_reason: null,
    device_type: "unknown",
    browser: null,
    operating_system: null,
    authentication_strength: payload.authentication_strength,
    active_organization_id: payload.active_organization_id,
    active_workspace_id: payload.active_workspace_id,
    risk_state: payload.risk_state,
  };
}

export function issueSession(user: PlatformUser, meta?: { ip?: string; userAgent?: string; authStrength?: string }): Session {
  const session = createSessionRecord(user, meta);
  try {
    const sessions = loadSessions();
    sessions.push(session);
    persistSessions(sessions);
  } catch {
    // Serverless runtimes may not persist sessions.json; signed cookie remains authoritative.
  }
  try {
    const users = loadUsers();
    const idx = users.findIndex((u) => u.user_id === user.user_id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], last_login_at: session.created_at, last_active_at: session.created_at, updated_at: session.created_at };
      persistUsers(users);
    }
  } catch {
    // Best-effort profile touch; login must still succeed.
  }
  audit({ actor_type: "user", actor_id: user.user_id, action: "login_success", target_type: "session", target_id: session.session_id, result: "success", user_id_optional: user.user_id });
  return session;
}

export function sessionCookieValue(session: Session): string {
  return signSessionToken({
    session_id: session.session_id,
    user_id: session.user_id,
    expires_at: session.expires_at,
    active_organization_id: session.active_organization_id,
    active_workspace_id: session.active_workspace_id,
    authentication_strength: session.authentication_strength,
    risk_state: session.risk_state,
  });
}

export function getSession(sessionToken: string): Session | null {
  const signed = verifySignedSessionToken(sessionToken);
  if (signed) return sessionFromSignedPayload(signed);

  const session = loadSessions().find((s) => s.session_id === sessionToken && !s.revoked);
  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) return null;
  const user = loadUsers().find((u) => u.user_id === session.user_id);
  if (!user || user.account_status === "suspended") return null;
  return session;
}

export function touchSession(sessionId: string): void {
  try {
    const sessions = loadSessions();
    const idx = sessions.findIndex((s) => s.session_id === sessionId && !s.revoked);
    if (idx < 0) return;
    sessions[idx] = { ...sessions[idx], last_seen_at: new Date().toISOString() };
    persistSessions(sessions);
  } catch {
    // Signed cookie sessions do not require durable session store updates.
  }
}

export function logout(sessionId: string): boolean {
  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.session_id === sessionId);
  if (idx < 0) return false;
  sessions[idx] = { ...sessions[idx], revoked: true, revocation_reason: "logout" };
  persistSessions(sessions);
  audit({ actor_type: "user", actor_id: sessions[idx].user_id, action: "logout", target_type: "session", target_id: sessionId, result: "success", user_id_optional: sessions[idx].user_id });
  return true;
}

export function logoutAll(userId: string, exceptSessionId?: string): number {
  const sessions = loadSessions();
  let count = 0;
  for (let i = 0; i < sessions.length; i++) {
    if (sessions[i].user_id === userId && !sessions[i].revoked && sessions[i].session_id !== exceptSessionId) {
      sessions[i] = { ...sessions[i], revoked: true, revocation_reason: "logout_all" };
      count++;
    }
  }
  persistSessions(sessions);
  audit({ actor_type: "user", actor_id: userId, action: "logout_all", target_type: "session", target_id: userId, result: "success", user_id_optional: userId });
  return count;
}

export function listUserSessions(userId: string): Session[] {
  return loadSessions().filter((s) => s.user_id === userId && !s.revoked);
}

export function revokeSession(sessionId: string, actorId: string): boolean {
  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.session_id === sessionId);
  if (idx < 0) return false;
  sessions[idx] = { ...sessions[idx], revoked: true, revocation_reason: "user_revoked" };
  persistSessions(sessions);
  audit({ actor_type: "user", actor_id: actorId, action: "session_revoked", target_type: "session", target_id: sessionId, result: "success", user_id_optional: sessions[idx].user_id });
  return true;
}

export function getSessionFromRequest(cookieHeader: string | null): Session | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;
  const raw = decodeURIComponent(match[1]);
  const session = getSession(raw);
  if (session) touchSession(session.session_id);
  return session;
}
