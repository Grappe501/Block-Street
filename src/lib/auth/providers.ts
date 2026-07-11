import { randomBytes } from "crypto";
import {
  appendAudit,
  loadFeatureFlags,
  loadPasswordlessTokens,
  loadUsers,
  persistPasswordlessTokens,
  persistUsers,
} from "./data";
import { hashPassword, hashSecret } from "./crypto";
import { issueSession } from "./session";
import type { Session } from "./types";

export function requestPasswordlessLink(email: string): { token: string; expires_at: string } | null {
  const flags = loadFeatureFlags();
  if (!flags.AUTH_PASSWORDLESS_ENABLED) return null;

  const user = loadUsers().find((u) => u.primary_email.toLowerCase() === email.toLowerCase());
  const now = new Date();
  const expires = new Date(now.getTime() + 15 * 60000);

  if (!user) {
    return { token: "", expires_at: expires.toISOString() };
  }

  const token = randomBytes(24).toString("hex");
  const tokens = loadPasswordlessTokens();
  tokens.push({
    token_hash: hashSecret(token),
    email: email.toLowerCase(),
    created_at: now.toISOString(),
    expires_at: expires.toISOString(),
    consumed_at: null,
  });
  persistPasswordlessTokens(tokens);
  appendAudit({
    event_type: "passwordless_requested",
    actor_type: "user",
    actor_id: email,
    action: "passwordless_requested",
    target_type: "passwordless_token",
    target_id: email,
    result: "success",
  });
  return { token, expires_at: expires.toISOString() };
}

export function verifyPasswordlessToken(
  token: string,
  meta?: { ip?: string; userAgent?: string }
): Session | null {
  const hash = hashSecret(token);
  const tokens = loadPasswordlessTokens();
  const idx = tokens.findIndex(
    (t) => t.token_hash === hash && !t.consumed_at && new Date(t.expires_at).getTime() > Date.now()
  );
  if (idx < 0) return null;

  tokens[idx] = { ...tokens[idx], consumed_at: new Date().toISOString() };
  persistPasswordlessTokens(tokens);

  const user = loadUsers().find(
    (u) => u.primary_email.toLowerCase() === tokens[idx].email && u.account_status !== "suspended"
  );
  if (!user) return null;

  appendAudit({
    event_type: "passwordless_verified",
    actor_type: "user",
    actor_id: user.user_id,
    action: "passwordless_verified",
    target_type: "session",
    target_id: user.user_id,
    result: "success",
    user_id_optional: user.user_id,
  });

  return issueSession(user, { ...meta, authStrength: "ial2" });
}

export function requestPasswordReset(email: string): boolean {
  const user = loadUsers().find((u) => u.primary_email.toLowerCase() === email.toLowerCase());
  appendAudit({
    event_type: "password_reset_requested",
    actor_type: "user",
    actor_id: email,
    action: "password_reset_requested",
    target_type: "user",
    target_id: user?.user_id ?? email,
    result: "success",
  });
  return true;
}

export function completePasswordReset(email: string, newPassword: string, resetToken: string): boolean {
  if (!resetToken || resetToken.length < 16) return false;
  const users = loadUsers();
  const idx = users.findIndex((u) => u.primary_email.toLowerCase() === email.toLowerCase());
  if (idx < 0) return false;
  users[idx] = {
    ...users[idx],
    password_hash: hashPassword(newPassword),
    updated_at: new Date().toISOString(),
  };
  persistUsers(users);
  appendAudit({
    event_type: "password_reset_completed",
    actor_type: "user",
    actor_id: users[idx].user_id,
    action: "password_reset_completed",
    target_type: "user",
    target_id: users[idx].user_id,
    result: "success",
    user_id_optional: users[idx].user_id,
  });
  return true;
}

export function getProviderStatus() {
  const flags = loadFeatureFlags();
  return {
    email_password: flags.AUTH_PASSWORD_ENABLED,
    passwordless: flags.AUTH_PASSWORDLESS_ENABLED,
    google: flags.AUTH_GOOGLE_ENABLED,
    microsoft: flags.AUTH_MICROSOFT_ENABLED,
    mfa: flags.AUTH_MFA_ENABLED,
  };
}

export function linkProviderScaffold(
  _userId: string,
  provider: "google" | "microsoft"
): { status: "disabled" | "scaffold"; message: string } {
  const flags = loadFeatureFlags();
  const enabled = provider === "google" ? flags.AUTH_GOOGLE_ENABLED : flags.AUTH_MICROSOFT_ENABLED;
  if (!enabled) {
    return {
      status: "disabled",
      message: `${provider} sign-in is not enabled. Configure provider credentials and feature flag.`,
    };
  }
  return {
    status: "scaffold",
    message: `OAuth linking for ${provider} requires provider credentials. Schema and API scaffold ready.`,
  };
}
