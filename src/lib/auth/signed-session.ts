import { createHmac, timingSafeEqual } from "crypto";
import type { Session } from "./types";

const SESSION_SECRET = (() => {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SESSION_SECRET must be set in production");
  }
  return process.env.AUTH_BOOTSTRAP_PASSWORD ?? "Forevermost-dev-session-key";
})();

export type SignedSessionPayload = Pick<
  Session,
  | "session_id"
  | "user_id"
  | "expires_at"
  | "active_organization_id"
  | "active_workspace_id"
  | "authentication_strength"
  | "risk_state"
>;

export function signSessionToken(payload: SignedSessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifySignedSessionToken(token: string): SignedSessionPayload | null {
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", SESSION_SECRET).update(data).digest("base64url");
  try {
    if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as SignedSessionPayload;
    if (!payload.session_id || !payload.user_id || !payload.expires_at) return null;
    if (new Date(payload.expires_at).getTime() < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
