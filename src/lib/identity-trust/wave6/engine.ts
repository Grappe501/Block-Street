import { isWave5FoundationComplete } from "../wave5/engine";
import { checkWave6Invariants, WAVE6_INVARIANTS } from "./invariants";
import { loadWave6Flags, loadWorkItems, loadSupportRequests } from "./data";
import { syncWorkItemsFromSources } from "./migration";
import { getOperationsOverview } from "./overview";
import type { Wave6Certification } from "./types";
import { nowIso } from "../utils";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const CERT_PATH = join(process.cwd(), "data", "identity-trust", "wave6_certification.json");

export function loadWave6Certification(): Wave6Certification | null {
  try {
    return JSON.parse(readFileSync(CERT_PATH, "utf8")) as Wave6Certification;
  } catch {
    return null;
  }
}

export function persistWave6Certification(cert: Wave6Certification) {
  writeFileSync(CERT_PATH, JSON.stringify(cert, null, 2));
}

export function runWave6Certification(): Wave6Certification {
  const flags = loadWave6Flags();
  syncWorkItemsFromSources();
  const overview = getOperationsOverview();

  const gates = [
    { id: "w6-g1", name: "Individual clarity", passed: Boolean(flags.IDENTITY_HOME_ENABLED), detail: "Identity home enabled" },
    { id: "w6-g2", name: "Sponsor operations", passed: Boolean(flags.SPONSOR_DASHBOARD_ENABLED), detail: "Sponsor dashboard enabled" },
    { id: "w6-g3", name: "Verifier operations", passed: Boolean(flags.VERIFIER_CENTER_ENABLED), detail: "Verifier center enabled" },
    { id: "w6-g4", name: "Queue integrity", passed: Boolean(flags.IDENTITY_WORK_QUEUE_ENABLED), detail: `${loadWorkItems().length} work items` },
    { id: "w6-g5", name: "Administrative boundaries", passed: Boolean(flags.IDENTITY_ROLE_AUTHORITY_REGISTRY_ENABLED), detail: "Role authority registry" },
    { id: "w6-g6", name: "Governance workbenches", passed: Boolean(flags.IDENTITY_GOVERNANCE_WORKBENCH_ENABLED), detail: "Case and appeal work items" },
    { id: "w6-g7", name: "Intelligence review", passed: Boolean(flags.IDENTITY_INTELLIGENCE_REVIEW_ENABLED), detail: "Advisory signal review" },
    { id: "w6-g8", name: "Audit integrity", passed: Boolean(flags.IDENTITY_AUDIT_EXPLORER_ENABLED), detail: "Audit explorer enabled" },
    { id: "w6-g9", name: "Reporting safety", passed: Boolean(flags.IDENTITY_REPORTING_ENABLED), detail: "Aggregate reports only" },
    { id: "w6-g10", name: "Accessibility and mobile", passed: Boolean(flags.IDENTITY_MOBILE_OPERATIONS_ENABLED) && Boolean(flags.IDENTITY_SPANISH_PATH_ENABLED), detail: "Mobile and Spanish paths" },
    { id: "w6-g11", name: "Resilience", passed: Boolean(flags.IDENTITY_BREAK_GLASS_ENABLED), detail: "Break-glass governed" },
    { id: "w6-g12", name: "Operations center", passed: Boolean(flags.IDENTITY_OPERATIONS_CENTER_ENABLED), detail: `Overdue: ${overview.today.overdue_work}` },
    { id: "w6-g13", name: "Support center", passed: Boolean(flags.IDENTITY_SUPPORT_CENTER_ENABLED), detail: `${loadSupportRequests().length} support requests` },
    { id: "w6-g14", name: "Executive oversight", passed: Boolean(flags.EXECUTIVE_IDENTITY_OVERSIGHT_ENABLED), detail: "Aggregate executive views" },
  ];

  for (const inv of checkWave6Invariants()) {
    gates.push({ id: `w6-inv-${inv.id}`, name: inv.id, passed: inv.passed, detail: inv.detail });
  }

  const allPassed = gates.every((g) => g.passed) && isWave5FoundationComplete();
  const cert: Wave6Certification = {
    wave_id: "ITL-W6-001",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    gates,
  };
  if (allPassed) persistWave6Certification(cert);
  return cert;
}

export function getWave6Overview() {
  return {
    wave_id: "ITL-W6-001",
    status: loadWave6Flags().WAVE6_IMPLEMENTATION_STATUS,
    work_items: loadWorkItems().length,
    support_requests: loadSupportRequests().length,
    operations: getOperationsOverview(),
    invariants: checkWave6Invariants(),
    invariant_docs: WAVE6_INVARIANTS,
    flags: loadWave6Flags(),
  };
}

export function isWave6FoundationComplete(): boolean {
  const stored = loadWave6Certification();
  if (stored?.all_passed) return true;
  const live = runWave6Certification();
  return live.all_passed;
}

export function assertWave6Foundation(operation: string) {
  if (!isWave5FoundationComplete()) {
    throw new Error(`ITL-W6-001 blocked. ${operation} requires Wave 5 certification.`);
  }
  if (!isWave6FoundationComplete()) {
    throw new Error(`ITL-W6-001 foundation incomplete. ${operation} requires Wave 6 certification.`);
  }
}

export function getWave6DependencyStatus() {
  const w5 = isWave5FoundationComplete();
  const cert = loadWave6Certification() ?? runWave6Certification();
  return {
    wave5: { complete: w5 },
    wave6: { id: "ITL-W6-001", complete: cert.all_passed, certified_at: cert.certified_at },
    wave7_blocked: !cert.all_passed,
    message: cert.all_passed
      ? "Wave 6 certified. Identity operations operational."
      : w5
        ? "Wave 6 implementation in progress."
        : "Wave 6 blocked until Wave 5 foundation is certified.",
  };
}
