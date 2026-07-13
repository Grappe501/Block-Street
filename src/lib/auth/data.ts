import { readFileSync, writeFileSync, appendFileSync, existsSync } from "fs";
import { join } from "path";
import type {
  AuthenticationIdentity,
  FeatureFlags,
  IdentityInvitation,
  MfaMethod,
  Organization,
  OrganizationMembership,
  PasswordlessToken,
  PlatformUser,
  RecoveryCode,
  Session,
  Workspace,
  WorkspaceMembership,
} from "./types";

export const DATA_DIR = join(process.cwd(), "data", "auth");

const caches = new Map<string, unknown>();

function readJson<T>(filename: string, key: string): T[] {
  const cacheKey = `${filename}:${key}`;
  if (caches.has(cacheKey)) return caches.get(cacheKey) as T[];
  const raw = JSON.parse(readFileSync(join(DATA_DIR, filename), "utf8"));
  const items = raw[key] as T[];
  caches.set(cacheKey, items);
  return items;
}

function writeJson<T>(filename: string, key: string, items: T[]) {
  writeFileSync(join(DATA_DIR, filename), JSON.stringify({ [key]: items }, null, 2));
  caches.set(`${filename}:${key}`, items);
}

export function clearAuthCache() {
  caches.clear();
}

export function loadUsers(): PlatformUser[] {
  return readJson<PlatformUser>("users.json", "users");
}

export function persistUsers(users: PlatformUser[]) {
  writeJson("users.json", "users", users);
}

export function loadSessions(): Session[] {
  return readJson<Session>("sessions.json", "sessions");
}

export function persistSessions(sessions: Session[]) {
  writeJson("sessions.json", "sessions", sessions);
}

export function loadOrganizations(): Organization[] {
  return readJson<Organization>("organizations.json", "organizations");
}

export function loadWorkspaces(): Workspace[] {
  return readJson<Workspace>("workspaces.json", "workspaces");
}

export function loadOrgMemberships(): OrganizationMembership[] {
  return readJson<OrganizationMembership>("organization_memberships.json", "organization_memberships");
}

export function persistOrgMemberships(memberships: OrganizationMembership[]) {
  writeJson("organization_memberships.json", "organization_memberships", memberships);
}

export function loadWorkspaceMemberships(): WorkspaceMembership[] {
  return readJson<WorkspaceMembership>("workspace_memberships.json", "workspace_memberships");
}

export function persistWorkspaceMemberships(memberships: WorkspaceMembership[]) {
  writeJson("workspace_memberships.json", "workspace_memberships", memberships);
}

export function loadIdentities(): AuthenticationIdentity[] {
  return readJson<AuthenticationIdentity>("authentication_identities.json", "identities");
}

export function persistIdentities(identities: AuthenticationIdentity[]) {
  writeJson("authentication_identities.json", "identities", identities);
}

export function loadInvitations(): IdentityInvitation[] {
  return readJson<IdentityInvitation>("invitations.json", "invitations");
}

export function persistInvitations(invitations: IdentityInvitation[]) {
  writeJson("invitations.json", "invitations", invitations);
}

export function loadMfaMethods(): MfaMethod[] {
  return readJson<MfaMethod>("mfa_methods.json", "methods");
}

export function persistMfaMethods(methods: MfaMethod[]) {
  writeJson("mfa_methods.json", "methods", methods);
}

export function loadRecoveryCodes(): RecoveryCode[] {
  return readJson<RecoveryCode>("recovery_codes.json", "codes");
}

export function persistRecoveryCodes(codes: RecoveryCode[]) {
  writeJson("recovery_codes.json", "codes", codes);
}

export function loadPasswordlessTokens(): PasswordlessToken[] {
  return readJson<PasswordlessToken>("passwordless_tokens.json", "tokens");
}

export function persistPasswordlessTokens(tokens: PasswordlessToken[]) {
  writeJson("passwordless_tokens.json", "tokens", tokens);
}

export function loadFeatureFlags(): FeatureFlags {
  const raw = JSON.parse(readFileSync(join(DATA_DIR, "feature_flags.json"), "utf8"));
  return raw.feature_flags as FeatureFlags;
}

export function appendAudit(event: Record<string, unknown>) {
  try {
    appendFileSync(
      join(DATA_DIR, "audit_events.jsonl"),
      JSON.stringify({ ...event, timestamp: new Date().toISOString() }) + "\n"
    );
  } catch {
    // Serverless runtimes may not allow writes; auth flows must still succeed.
  }
}

export function readAuditEvents(limit = 50) {
  const path = join(DATA_DIR, "audit_events.jsonl");
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l))
    .slice(-limit)
    .reverse();
}
