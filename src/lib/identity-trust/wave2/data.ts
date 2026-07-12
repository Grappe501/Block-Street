import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  HumanTrustStateRecord,
  HumanVerificationStatement,
  IdentityAssuranceRecord,
  IdentityChallenge,
  IdentityLedgerEvent,
  ProvisionalIdentityPeriod,
  VerificationRequest,
  VerifierQualification,
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

export function loadWave2Flags() {
  return readJson<Record<string, boolean | string>>("wave2_flags.json");
}

export function loadWave2Policy() {
  return readJson<{
    wave_id: string;
    default_provisional_days: number;
    provisional_reminder_days: number[];
    verification_request_expiry_days: number;
    required_independent_confirmations: number;
    required_total_confirmations: number;
    verifier_education_version: string;
    verifier_responsibility_statement: string;
    verification_methods: import("./types").VerificationMethodRecord[];
    capability_matrix: Record<string, Record<string, boolean | string>>;
    invariants: string[];
  }>("wave2_policy.json");
}

function getKey(key: string): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey(key: string, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadVerificationRequests = () => getKey("verification_requests") as VerificationRequest[];
export const persistVerificationRequests = (items: VerificationRequest[]) => setKey("verification_requests", items);
export const loadVerificationStatements = () => getKey("verification_statements") as HumanVerificationStatement[];
export const persistVerificationStatements = (items: HumanVerificationStatement[]) =>
  setKey("verification_statements", items);
export const loadVerifierQualifications = () => getKey("verifier_qualifications") as VerifierQualification[];
export const persistVerifierQualifications = (items: VerifierQualification[]) =>
  setKey("verifier_qualifications", items);
export const loadIdentityAssuranceStates = () => getKey("identity_assurance_states") as IdentityAssuranceRecord[];
export const persistIdentityAssuranceStates = (items: IdentityAssuranceRecord[]) =>
  setKey("identity_assurance_states", items);
export const loadHumanTrustStates = () => getKey("human_trust_states") as HumanTrustStateRecord[];
export const persistHumanTrustStates = (items: HumanTrustStateRecord[]) => setKey("human_trust_states", items);
export const loadProvisionalPeriods = () => getKey("provisional_periods") as ProvisionalIdentityPeriod[];
export const persistProvisionalPeriods = (items: ProvisionalIdentityPeriod[]) => setKey("provisional_periods", items);
export const loadIdentityChallenges = () => getKey("identity_challenges") as IdentityChallenge[];
export const persistIdentityChallenges = (items: IdentityChallenge[]) => setKey("identity_challenges", items);
export const loadIdentityLedgerEvents = () => getKey("identity_ledger_events") as IdentityLedgerEvent[];
export const persistIdentityLedgerEvents = (items: IdentityLedgerEvent[]) => setKey("identity_ledger_events", items);
