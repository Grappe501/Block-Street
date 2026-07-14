import { appendFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import {
  clearDurableMemory,
  hydrateNamespace,
  readDurableText,
  writeDurableText,
} from "@/lib/persist/durable-json";
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
const NS = "auth";

const AUTH_BLOB_KEYS = [
  "users.json",
  "sessions.json",
  "organizations.json",
  "workspaces.json",
  "organization_memberships.json",
  "workspace_memberships.json",
  "authentication_identities.json",
  "invitations.json",
  "mfa_methods.json",
  "recovery_codes.json",
  "passwordless_tokens.json",
  "home_places.json",
  "feature_flags.json",
];

export async function hydrateAuthStore(): Promise<void> {
  await hydrateNamespace(NS, AUTH_BLOB_KEYS, (key) => join(DATA_DIR, key));
}

function readJson<T>(filename: string, key: string): T[] {
  const raw = JSON.parse(readDurableText(NS, filename, join(DATA_DIR, filename)));
  return (raw[key] as T[]) ?? [];
}

function writeJson<T>(filename: string, key: string, items: T[]) {
  writeDurableText(NS, filename, JSON.stringify({ [key]: items }, null, 2), join(DATA_DIR, filename));
}

export function clearAuthCache() {
  clearDurableMemory(NS);
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
  const raw = JSON.parse(readDurableText(NS, "feature_flags.json", join(DATA_DIR, "feature_flags.json")));
  return raw.feature_flags as FeatureFlags;
}

export type HomePlace = {
  user_id: string;
  kind: "county" | "school" | "high-school" | "private-school";
  slug: string;
  name: string;
  county_slug?: string;
  committed_at: string;
};

export function loadHomePlaces(): HomePlace[] {
  try {
    return readJson<HomePlace>("home_places.json", "places");
  } catch {
    return [];
  }
}

export function persistHomePlaces(places: HomePlace[]) {
  writeJson("home_places.json", "places", places);
}

export function getHomePlaceForUser(userId: string): HomePlace | null {
  return loadHomePlaces().find((p) => p.user_id === userId) ?? null;
}

export function setHomePlaceForUser(place: HomePlace) {
  const all = loadHomePlaces().filter((p) => p.user_id !== place.user_id);
  all.push(place);
  persistHomePlaces(all);
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
