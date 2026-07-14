import { join } from "path";
import { readDurableText, writeDurableText, clearDurableMemory } from "@/lib/persist/durable-json";
import type {
  AliasRequest,
  FoundingIdentityRecord,
  HumanPublicIdentity,
  IdentityDuplicateCandidate,
  InvitationAcceptanceAttempt,
  SponsorAttestation,
  SponsorPrivilege,
  Wave1AuditEvent,
  Wave1InstitutionMembership,
  Wave1Invitation,
} from "./types";

const ITL_DATA = join(process.cwd(), "data", "identity-trust");
const NS = "identity-trust";
const STORE_KEY = "store.json";
const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readDurableText(NS, STORE_KEY, join(ITL_DATA, STORE_KEY)));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeDurableText(NS, STORE_KEY, JSON.stringify(store, null, 2), join(ITL_DATA, STORE_KEY));
  cache.clear();
}

function readJson<T>(file: string): T {
  const k = `json:${file}`;
  if (cache.has(k)) return cache.get(k) as T;
  const raw = JSON.parse(readDurableText(NS, file, join(ITL_DATA, file)));
  cache.set(k, raw);
  return raw;
}

export function clearWave1Cache() {
  cache.clear();
  clearDurableMemory(NS);
}

export function loadWave1Flags() {
  return readJson<Record<string, boolean | string>>("wave1_flags.json");
}

export function loadWave1Policy() {
  return readJson<{
    wave_id: string;
    default_invitation_expiry_hours: number;
    sponsor_attestation_version: string;
    sponsor_attestation_primary: string;
    sponsor_attestation_secondary: string;
    invite_limits: Record<string, number>;
    elevated_roles_require_approval: string[];
    invariants: string[];
  }>("wave1_policy.json");
}

function getKey(key: string): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey(key: string, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadFoundingRecord = (): FoundingIdentityRecord | null => {
  const raw = readStore().founding_identity_record;
  if (!raw) return null;
  if (Array.isArray(raw)) return (raw[0] as FoundingIdentityRecord) ?? null;
  return raw as FoundingIdentityRecord;
};
export const persistFoundingRecord = (r: FoundingIdentityRecord) => {
  const store = readStore();
  store.founding_identity_record = r;
  writeStore(store);
};
export const loadHumanPublicIdentities = () => getKey("human_public_identities") as HumanPublicIdentity[];
export const persistHumanPublicIdentities = (items: HumanPublicIdentity[]) => setKey("human_public_identities", items);
export const loadWave1Invitations = () => getKey("wave1_invitations") as Wave1Invitation[];
export const persistWave1Invitations = (items: Wave1Invitation[]) => setKey("wave1_invitations", items);
export const loadSponsorAttestations = () => getKey("sponsor_attestations") as SponsorAttestation[];
export const persistSponsorAttestations = (items: SponsorAttestation[]) => setKey("sponsor_attestations", items);
export const loadSponsorPrivileges = () => getKey("sponsor_privileges") as SponsorPrivilege[];
export const persistSponsorPrivileges = (items: SponsorPrivilege[]) => setKey("sponsor_privileges", items);
export const loadAliasRequests = () => getKey("alias_requests") as AliasRequest[];
export const persistAliasRequests = (items: AliasRequest[]) => setKey("alias_requests", items);
export const loadDuplicateCandidates = () => getKey("duplicate_candidates") as IdentityDuplicateCandidate[];
export const persistDuplicateCandidates = (items: IdentityDuplicateCandidate[]) => setKey("duplicate_candidates", items);
export const loadWave1Memberships = () => getKey("wave1_memberships") as Wave1InstitutionMembership[];
export const persistWave1Memberships = (items: Wave1InstitutionMembership[]) => setKey("wave1_memberships", items);
export const loadAcceptanceAttempts = () => getKey("invitation_acceptance_attempts") as InvitationAcceptanceAttempt[];
export const persistAcceptanceAttempts = (items: InvitationAcceptanceAttempt[]) => setKey("invitation_acceptance_attempts", items);
export const loadWave1Audit = () => getKey("wave1_audit_events") as Wave1AuditEvent[];
export const persistWave1Audit = (items: Wave1AuditEvent[]) => setKey("wave1_audit_events", items);
