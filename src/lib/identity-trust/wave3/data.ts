import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  DuplicateIdentityCase,
  HumanAliasGovernance,
  IdentityAppealRecord,
  IdentityCase,
  IdentityCaseDecision,
  IdentityCaseEvidence,
  IdentityCaseResponse,
  IdentityContainmentAction,
  IdentityRestorationRequest,
  IdentityReviewNotice,
  IdentityReviewerConflict,
  IdentityReviewerQualification,
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

export function loadWave3Flags() {
  return readJson<Record<string, boolean | string>>("wave3_flags.json");
}

export function loadWave3Policy() {
  return readJson<{
    wave_id: string;
    default_response_days_routine: number;
    default_response_days_serious: number;
    default_appeal_deadline_days: number;
    default_containment_days: number;
    duplicate_merge_required_approvals: number;
    fraud_decision_standard: string;
    ordinary_decision_standard: string;
    invariants: string[];
    boards: import("./types").IdentityReviewBoard[];
  }>("wave3_policy.json");
}

function getKey(key: string): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey(key: string, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadIdentityCases = () => getKey("identity_cases") as IdentityCase[];
export const persistIdentityCases = (items: IdentityCase[]) => setKey("identity_cases", items);
export const loadIdentityCaseEvidence = () => getKey("identity_case_evidence") as IdentityCaseEvidence[];
export const persistIdentityCaseEvidence = (items: IdentityCaseEvidence[]) => setKey("identity_case_evidence", items);
export const loadIdentityReviewNotices = () => getKey("identity_review_notices") as IdentityReviewNotice[];
export const persistIdentityReviewNotices = (items: IdentityReviewNotice[]) => setKey("identity_review_notices", items);
export const loadIdentityCaseResponses = () => getKey("identity_case_responses") as IdentityCaseResponse[];
export const persistIdentityCaseResponses = (items: IdentityCaseResponse[]) => setKey("identity_case_responses", items);
export const loadIdentityContainmentActions = () => getKey("identity_containment_actions") as IdentityContainmentAction[];
export const persistIdentityContainmentActions = (items: IdentityContainmentAction[]) =>
  setKey("identity_containment_actions", items);
export const loadIdentityCaseDecisions = () => getKey("identity_case_decisions") as IdentityCaseDecision[];
export const persistIdentityCaseDecisions = (items: IdentityCaseDecision[]) => setKey("identity_case_decisions", items);
export const loadIdentityReviewerQualifications = () =>
  getKey("identity_reviewer_qualifications") as IdentityReviewerQualification[];
export const persistIdentityReviewerQualifications = (items: IdentityReviewerQualification[]) =>
  setKey("identity_reviewer_qualifications", items);
export const loadIdentityReviewerConflicts = () => getKey("identity_reviewer_conflicts") as IdentityReviewerConflict[];
export const persistIdentityReviewerConflicts = (items: IdentityReviewerConflict[]) =>
  setKey("identity_reviewer_conflicts", items);
export const loadDuplicateIdentityCases = () => getKey("duplicate_identity_cases") as DuplicateIdentityCase[];
export const persistDuplicateIdentityCases = (items: DuplicateIdentityCase[]) => setKey("duplicate_identity_cases", items);
export const loadHumanAliasGovernance = () => getKey("human_alias_governance") as HumanAliasGovernance[];
export const persistHumanAliasGovernance = (items: HumanAliasGovernance[]) => setKey("human_alias_governance", items);
export const loadIdentityAppealRecords = () => getKey("identity_appeal_records") as IdentityAppealRecord[];
export const persistIdentityAppealRecords = (items: IdentityAppealRecord[]) => setKey("identity_appeal_records", items);
export const loadIdentityRestorationRequests = () => getKey("identity_restoration_requests") as IdentityRestorationRequest[];
export const persistIdentityRestorationRequests = (items: IdentityRestorationRequest[]) =>
  setKey("identity_restoration_requests", items);
