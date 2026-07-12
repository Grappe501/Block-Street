import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  IdentityCertificationEvidence,
  IdentityConstitutionalAcceptance,
  IdentityConstitutionalDriftFinding,
  IdentityContinuityDrill,
  IdentityLaunchPlan,
  IdentityLedgerReconstructionRun,
  IdentityMigrationCertification,
  IdentityRedTeamFinding,
  IdentityRequirementTrace,
  IdentityTrustCertification,
  IdentityTrustRequirement,
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

export function loadWave7Flags() {
  return readJson<Record<string, boolean | string>>("wave7_flags.json");
}

export function persistWave7Flags(flags: Record<string, boolean | string>) {
  writeFileSync(join(ITL_DATA, "wave7_flags.json"), JSON.stringify(flags, null, 2));
  cache.delete("json:wave7_flags.json");
}

function getKey<T>(key: string): T[] {
  return (readStore()[key] as T[]) ?? [];
}

function setKey(key: string, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadRequirements = () => getKey<IdentityTrustRequirement>("identity_trust_requirements");
export const persistRequirements = (items: IdentityTrustRequirement[]) => setKey("identity_trust_requirements", items);

export const loadRequirementTraces = () => getKey<IdentityRequirementTrace>("identity_requirement_traces");
export const persistRequirementTraces = (items: IdentityRequirementTrace[]) => setKey("identity_requirement_traces", items);

export const loadCertificationRuns = () => getKey<IdentityTrustCertification>("identity_trust_certifications");
export const persistCertificationRuns = (items: IdentityTrustCertification[]) => setKey("identity_trust_certifications", items);

export const loadCertificationEvidence = () => getKey<IdentityCertificationEvidence>("identity_certification_evidence");
export const persistCertificationEvidence = (items: IdentityCertificationEvidence[]) =>
  setKey("identity_certification_evidence", items);

export const loadRedTeamFindings = () => getKey<IdentityRedTeamFinding>("identity_red_team_findings");
export const persistRedTeamFindings = (items: IdentityRedTeamFinding[]) => setKey("identity_red_team_findings", items);

export const loadMigrationCertifications = () => getKey<IdentityMigrationCertification>("identity_migration_certifications");
export const persistMigrationCertifications = (items: IdentityMigrationCertification[]) =>
  setKey("identity_migration_certifications", items);

export const loadLedgerReconstructionRuns = () => getKey<IdentityLedgerReconstructionRun>("identity_ledger_reconstruction_runs");
export const persistLedgerReconstructionRuns = (items: IdentityLedgerReconstructionRun[]) =>
  setKey("identity_ledger_reconstruction_runs", items);

export const loadContinuityDrills = () => getKey<IdentityContinuityDrill>("identity_continuity_drills");
export const persistContinuityDrills = (items: IdentityContinuityDrill[]) => setKey("identity_continuity_drills", items);

export const loadLaunchPlans = () => getKey<IdentityLaunchPlan>("identity_launch_plans");
export const persistLaunchPlans = (items: IdentityLaunchPlan[]) => setKey("identity_launch_plans", items);

export const loadDriftFindings = () => getKey<IdentityConstitutionalDriftFinding>("identity_constitutional_drift_findings");
export const persistDriftFindings = (items: IdentityConstitutionalDriftFinding[]) =>
  setKey("identity_constitutional_drift_findings", items);

export const loadConstitutionalAcceptance = () => getKey<IdentityConstitutionalAcceptance>("identity_constitutional_acceptance");
export const persistConstitutionalAcceptance = (items: IdentityConstitutionalAcceptance[]) =>
  setKey("identity_constitutional_acceptance", items);
