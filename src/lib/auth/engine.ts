import { createHash, randomBytes } from "crypto";
import { readFileSync, writeFileSync, appendFileSync, existsSync } from "fs";
import { join } from "path";
import type { AuthAuditEvent, Membership, Session, User, UserProfile } from "./types";

const DATA = join(process.cwd(), "data", "auth");
const SESSION_COOKIE = "cos_session";
const SESSION_HOURS = 24;

let userCache: User[] | null = null;
let sessionCache: Session[] | null = null;

/** Bootstrap dev credential — override via AUTH_BOOTSTRAP_PASSWORD env in production setup */
const BOOTSTRAP_PASSWORD = process.env.AUTH_BOOTSTRAP_PASSWORD ?? "blockstreet-dev";

export function hashPassword(password: string): string {
  return createHash("sha256").update(`cos-v1:${password}`).digest("hex");
}

function loadUsers(): User[] {
  if (userCache) return userCache;
  const raw = JSON.parse(readFileSync(join(DATA, "users.json"), "utf8"));
  userCache = raw.users as User[];
  return userCache;
}

function loadSessions(): Session[] {
  if (sessionCache) return sessionCache;
  const raw = JSON.parse(readFileSync(join(DATA, "sessions.json"), "utf8"));
  sessionCache = raw.sessions as Session[];
  return sessionCache;
}

function persistSessions(sessions: Session[]) {
  writeFileSync(join(DATA, "sessions.json"), JSON.stringify({ sessions }, null, 2));
  sessionCache = sessions;
}

function loadMemberships(userId: string): Membership[] {
  const raw = JSON.parse(readFileSync(join(DATA, "memberships.json"), "utf8"));
  return (raw.memberships as Membership[]).filter((m) => m.user_id === userId && m.status === "active");
}

function appendAudit(event: Omit<AuthAuditEvent, "timestamp">) {
  appendFileSync(
    join(DATA, "audit_events.jsonl"),
    JSON.stringify({ ...event, timestamp: new Date().toISOString() }) + "\n"
  );
}

function verifyPassword(user: User, password: string): boolean {
  const hash = hashPassword(password);
  if (user.password_hash) return user.password_hash === hash;
  return hash === hashPassword(BOOTSTRAP_PASSWORD);
}

export function login(email: string, password: string, meta?: { ip?: string; userAgent?: string }): Session | null {
  const user = loadUsers().find((u) => u.primary_email === email && u.account_status === "active");
  if (!user || !verifyPassword(user, password)) {
    appendAudit({
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
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_HOURS * 3600000);
  const session: Session = {
    session_id: `sess-${randomBytes(16).toString("hex")}`,
    user_id: user.user_id,
    created_at: now.toISOString(),
    expires_at: expires.toISOString(),
    ip_address: meta?.ip ?? null,
    user_agent: meta?.userAgent ?? null,
    revoked: false,
  };
  const sessions = loadSessions().filter((s) => !(s.user_id === user.user_id && s.revoked));
  sessions.push(session);
  persistSessions(sessions);
  appendAudit({
    actor_type: "user",
    actor_id: user.user_id,
    action: "login_success",
    target_type: "session",
    target_id: session.session_id,
    result: "success",
  });
  return session;
}

export function getSession(sessionId: string): Session | null {
  const session = loadSessions().find((s) => s.session_id === sessionId && !s.revoked);
  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) return null;
  return session;
}

export function getUserById(userId: string): User | null {
  return loadUsers().find((u) => u.user_id === userId) ?? null;
}

export function getUserProfile(userId: string): UserProfile | null {
  const user = getUserById(userId);
  if (!user) return null;
  const { password_hash: _, mfa_secret: __, ...profile } = user;
  return { ...profile, memberships: loadMemberships(userId) };
}

export function logout(sessionId: string): boolean {
  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.session_id === sessionId);
  if (idx < 0) return false;
  sessions[idx] = { ...sessions[idx], revoked: true };
  persistSessions(sessions);
  appendAudit({
    actor_type: "user",
    actor_id: sessions[idx].user_id,
    action: "logout",
    target_type: "session",
    target_id: sessionId,
    result: "success",
  });
  return true;
}

export function listUserSessions(userId: string): Session[] {
  return loadSessions().filter((s) => s.user_id === userId && !s.revoked);
}

export function revokeSession(sessionId: string, actorId: string): boolean {
  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.session_id === sessionId);
  if (idx < 0) return false;
  sessions[idx] = { ...sessions[idx], revoked: true };
  persistSessions(sessions);
  appendAudit({
    actor_type: "user",
    actor_id: actorId,
    action: "session_revoked",
    target_type: "session",
    target_id: sessionId,
    result: "success",
  });
  return true;
}

export function getSessionFromRequest(cookieHeader: string | null): Session | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;
  return getSession(match[1]);
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
  const path = join(DATA, "audit_events.jsonl");
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l) as AuthAuditEvent)
    .slice(-limit)
    .reverse();
}

export { SESSION_COOKIE };
