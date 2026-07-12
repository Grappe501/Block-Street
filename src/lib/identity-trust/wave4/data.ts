import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  ActiveInstitutionContext,
  CrossInstitutionInvitation,
  FederationInstitutionMembership,
  HumanDirectoryPreference,
  InstitutionAssuranceReceipt,
  InstitutionContextSession,
  InterinstitutionalAgreement,
  MembershipTransfer,
  PortableIdentityAssurance,
} from "./types";

const ITL_DATA = join(process.cwd(), "data", "identity-trust");
const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(ITL_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(ITL_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJson<T>(file: string): T {
  const k = `json:${file}`;
  if (cache.has(k)) return cache.get(k) as T;
  const raw = JSON.parse(readFileSync(join(ITL_DATA, file), "utf8"));
  cache.set(k, raw);
  return raw;
}

export function loadWave4Flags() {
  return readJson<Record<string, boolean | string>>("wave4_flags.json");
}

function getKey<T>(key: string): T[] {
  return (readStore()[key] as T[]) ?? [];
}

function setKey(key: string, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadFederationMembershipsV4 = () =>
  getKey<FederationInstitutionMembership>("federation_memberships_v4");
export const persistFederationMembershipsV4 = (items: FederationInstitutionMembership[]) =>
  setKey("federation_memberships_v4", items);

export const loadActiveContexts = () => getKey<ActiveInstitutionContext>("active_institution_contexts");
export const persistActiveContexts = (items: ActiveInstitutionContext[]) =>
  setKey("active_institution_contexts", items);

export const loadContextSessions = () => getKey<InstitutionContextSession>("institution_context_sessions");
export const persistContextSessions = (items: InstitutionContextSession[]) =>
  setKey("institution_context_sessions", items);

export const loadPortableAssurances = () => getKey<PortableIdentityAssurance>("portable_identity_assurances");
export const persistPortableAssurances = (items: PortableIdentityAssurance[]) =>
  setKey("portable_identity_assurances", items);

export const loadAssuranceReceipts = () => getKey<InstitutionAssuranceReceipt>("institution_assurance_receipts");
export const persistAssuranceReceipts = (items: InstitutionAssuranceReceipt[]) =>
  setKey("institution_assurance_receipts", items);

export const loadCrossInstitutionInvitations = () =>
  getKey<CrossInstitutionInvitation>("cross_institution_invitations");
export const persistCrossInstitutionInvitations = (items: CrossInstitutionInvitation[]) =>
  setKey("cross_institution_invitations", items);

export const loadIdentityAgreements = () => getKey<InterinstitutionalAgreement>("identity_agreements");
export const persistIdentityAgreements = (items: InterinstitutionalAgreement[]) =>
  setKey("identity_agreements", items);

export const loadDirectoryPreferences = () => getKey<HumanDirectoryPreference>("human_directory_preferences");
export const persistDirectoryPreferences = (items: HumanDirectoryPreference[]) =>
  setKey("human_directory_preferences", items);

export const loadMembershipTransfers = () => getKey<MembershipTransfer>("membership_transfers");
export const persistMembershipTransfers = (items: MembershipTransfer[]) => setKey("membership_transfers", items);

export const loadFederationAuditEvents = () => getKey<Record<string, unknown>>("federation_identity_audit_events");
export const persistFederationAuditEvents = (items: Record<string, unknown>[]) =>
  setKey("federation_identity_audit_events", items);
