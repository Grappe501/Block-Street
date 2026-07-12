import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  Appeal,
  HumanIdentityRecord,
  IdentityHistoryEntry,
  IdentityIntelligenceAlert,
  IdentityReview,
  IdentityTrustAuditEvent,
  InstitutionMembership,
  SponsorRelationship,
  TrustDemotion,
  TrustInvitationRecord,
  TrustPromotion,
  VerificationRecord,
} from "./types";

export const ITL_DATA = join(process.cwd(), "data", "identity-trust");

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

function readJsonFile<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(ITL_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readJsonFile<Record<string, boolean>>("feature_flags.json");
}

export function loadTrustPolicy() {
  return readJsonFile<{
    core_principle: string;
    sponsor_responsibility: string;
    sponsor_agreement_text: string;
    real_name_policy: string;
    verification_for_trusted: number;
    review_period_days: number;
    dormancy_days: number;
    invite_limits: Record<string, number>;
    constitutional_principles: string[];
  }>("trust_policy.json");
}

function getKey(key: string): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey(key: string, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadHumanIdentities = () => getKey("human_identities") as HumanIdentityRecord[];
export const persistHumanIdentities = (items: HumanIdentityRecord[]) => setKey("human_identities", items);
export const loadTrustInvitations = () => getKey("trust_invitations") as TrustInvitationRecord[];
export const persistTrustInvitations = (items: TrustInvitationRecord[]) => setKey("trust_invitations", items);
export const loadVerifications = () => getKey("verifications") as VerificationRecord[];
export const persistVerifications = (items: VerificationRecord[]) => setKey("verifications", items);
export const loadIdentityReviews = () => getKey("identity_reviews") as IdentityReview[];
export const persistIdentityReviews = (items: IdentityReview[]) => setKey("identity_reviews", items);
export const loadAppeals = () => getKey("appeals") as Appeal[];
export const persistAppeals = (items: Appeal[]) => setKey("appeals", items);
export const loadSponsorFlags = () => getKey("sponsor_flags") as { sponsor_id: string; reason: string; invite_privileges_paused: boolean }[];
export const persistSponsorFlags = (items: { sponsor_id: string; reason: string; invite_privileges_paused: boolean }[]) =>
  setKey("sponsor_flags", items);
export const loadSponsorRelationships = () => getKey("sponsor_relationships") as SponsorRelationship[];
export const persistSponsorRelationships = (items: SponsorRelationship[]) => setKey("sponsor_relationships", items);
export const loadIdentityHistory = () => getKey("identity_history") as IdentityHistoryEntry[];
export const persistIdentityHistory = (items: IdentityHistoryEntry[]) => setKey("identity_history", items);
export const loadTrustPromotions = () => getKey("trust_promotions") as TrustPromotion[];
export const persistTrustPromotions = (items: TrustPromotion[]) => setKey("trust_promotions", items);
export const loadTrustDemotions = () => getKey("trust_demotions") as TrustDemotion[];
export const persistTrustDemotions = (items: TrustDemotion[]) => setKey("trust_demotions", items);
export const loadFederationMemberships = () => getKey("federation_memberships") as InstitutionMembership[];
export const persistFederationMemberships = (items: InstitutionMembership[]) => setKey("federation_memberships", items);
export const loadIntelligenceAlerts = () => getKey("intelligence_alerts") as IdentityIntelligenceAlert[];
export const persistIntelligenceAlerts = (items: IdentityIntelligenceAlert[]) => setKey("intelligence_alerts", items);
export const loadAuditEvents = () => getKey("audit_events") as IdentityTrustAuditEvent[];
export const persistAuditEvents = (items: IdentityTrustAuditEvent[]) => setKey("audit_events", items);
