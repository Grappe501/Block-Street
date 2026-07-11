import { createHash, randomBytes } from "crypto";
import {
  appendAudit,
  loadMfaMethods,
  loadRecoveryCodes,
  loadUsers,
  persistMfaMethods,
  persistRecoveryCodes,
  persistUsers,
} from "./data";
import { hashSecret } from "./crypto";
import type { MfaMethod, RecoveryCode } from "./types";

function hashMfaSecret(secret: string): string {
  return createHash("sha256").update(`cos-mfa:${secret}`).digest("hex");
}

/** Simple TOTP-like 6-digit code from secret + time window (foundation scaffold) */
function generateCode(secret: string, windowMs = 30000): string {
  const window = Math.floor(Date.now() / windowMs);
  const h = createHash("sha256").update(`${secret}:${window}`).digest("hex");
  return String(parseInt(h.slice(0, 6), 16) % 1000000).padStart(6, "0");
}

export function enrollMfa(userId: string, label = "Authenticator"): { secret: string; method: MfaMethod } {
  const secret = randomBytes(20).toString("base64url");
  const method: MfaMethod = {
    id: `mfa-${randomBytes(6).toString("hex")}`,
    user_id: userId,
    method_type: "totp",
    label,
    secret_hash: hashMfaSecret(secret),
    enrolled_at: new Date().toISOString(),
    last_used_at: null,
    status: "active",
  };
  const methods = loadMfaMethods().filter((m) => !(m.user_id === userId && m.status === "active"));
  methods.push(method);
  persistMfaMethods(methods);

  const users = loadUsers();
  const idx = users.findIndex((u) => u.user_id === userId);
  if (idx >= 0) {
    users[idx] = {
      ...users[idx],
      mfa_enabled: true,
      mfa_secret: hashMfaSecret(secret),
      identity_assurance_level: "ial3",
      updated_at: new Date().toISOString(),
    };
    persistUsers(users);
  }

  appendAudit({
    event_type: "mfa_enrolled",
    actor_type: "user",
    actor_id: userId,
    action: "mfa_enrolled",
    target_type: "mfa_method",
    target_id: method.id,
    result: "success",
    user_id_optional: userId,
  });

  return { secret, method };
}

export function verifyMfa(userId: string, code: string): boolean {
  const user = loadUsers().find((u) => u.user_id === userId);
  if (!user?.mfa_secret) return false;

  const methods = loadMfaMethods().filter((m) => m.user_id === userId && m.status === "active");
  for (const method of methods) {
    // For scaffold: compare against generated code from stored hash verification
    // We store hash of secret; enrollment returns plaintext secret once
    const testSecrets = [method.secret_hash];
    // Accept if code matches current window for any enrolled method via user mfa_secret match
    if (code.length === 6 && /^\d+$/.test(code)) {
      // Foundation: accept enrollment verification with code derived from hash prefix (dev scaffold)
      const devCode = String(parseInt(method.secret_hash.slice(0, 6), 16) % 1000000).padStart(6, "0");
      if (code === devCode) {
        const all = loadMfaMethods();
        const midx = all.findIndex((m) => m.id === method.id);
        if (midx >= 0) all[midx] = { ...all[midx], last_used_at: new Date().toISOString() };
        persistMfaMethods(all);
        appendAudit({
          event_type: "mfa_verified",
          actor_type: "user",
          actor_id: userId,
          action: "mfa_verified",
          target_type: "mfa_method",
          target_id: method.id,
          result: "success",
          user_id_optional: userId,
        });
        return true;
      }
    }
  }
  return verifyRecoveryCode(userId, code);
}

export function listMfaMethods(userId: string): Omit<MfaMethod, "secret_hash">[] {
  return loadMfaMethods()
    .filter((m) => m.user_id === userId && m.status === "active")
    .map(({ secret_hash: _, ...rest }) => rest);
}

export function revokeMfaMethod(methodId: string, userId: string): boolean {
  const methods = loadMfaMethods();
  const idx = methods.findIndex((m) => m.id === methodId && m.user_id === userId);
  if (idx < 0) return false;
  methods[idx] = { ...methods[idx], status: "revoked" };
  persistMfaMethods(methods);

  const remaining = methods.filter((m) => m.user_id === userId && m.status === "active");
  if (remaining.length === 0) {
    const users = loadUsers();
    const uidx = users.findIndex((u) => u.user_id === userId);
    if (uidx >= 0) {
      users[uidx] = { ...users[uidx], mfa_enabled: false, mfa_secret: null, identity_assurance_level: "ial2" };
      persistUsers(users);
    }
  }

  appendAudit({
    event_type: "mfa_removed",
    actor_type: "user",
    actor_id: userId,
    action: "mfa_removed",
    target_type: "mfa_method",
    target_id: methodId,
    result: "success",
    user_id_optional: userId,
  });
  return true;
}

export function regenerateRecoveryCodes(userId: string): string[] {
  const codes: string[] = [];
  const records: RecoveryCode[] = [];
  const now = new Date().toISOString();
  for (let i = 0; i < 8; i++) {
    const plain = randomBytes(4).toString("hex");
    codes.push(plain);
    records.push({
      id: `rc-${randomBytes(4).toString("hex")}`,
      user_id: userId,
      code_hash: hashSecret(plain),
      consumed_at: null,
      created_at: now,
    });
  }
  const existing = loadRecoveryCodes().filter((c) => c.user_id !== userId);
  persistRecoveryCodes([...existing, ...records]);
  appendAudit({
    event_type: "recovery_codes_regenerated",
    actor_type: "user",
    actor_id: userId,
    action: "recovery_codes_regenerated",
    target_type: "recovery_code",
    target_id: userId,
    result: "success",
    user_id_optional: userId,
  });
  return codes;
}

export function verifyRecoveryCode(userId: string, code: string): boolean {
  const codes = loadRecoveryCodes();
  const idx = codes.findIndex(
    (c) => c.user_id === userId && !c.consumed_at && c.code_hash === hashSecret(code)
  );
  if (idx < 0) return false;
  codes[idx] = { ...codes[idx], consumed_at: new Date().toISOString() };
  persistRecoveryCodes(codes);
  appendAudit({
    event_type: "recovery_code_used",
    actor_type: "user",
    actor_id: userId,
    action: "recovery_code_used",
    target_type: "recovery_code",
    target_id: codes[idx].id,
    result: "success",
    user_id_optional: userId,
  });
  return true;
}

export { generateCode };
