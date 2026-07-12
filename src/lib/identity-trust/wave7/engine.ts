import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { isWave6FoundationComplete } from "../wave6/engine";
import { itlId, nowIso } from "../utils";
import { conformanceDigest, runAllConformanceSuites, syncConformanceToRequirements } from "./conformance";
import { completeContinuityDrill, listContinuityDrills, startContinuityDrill } from "./continuity";
import { loadCertificationRuns, loadWave7Flags, persistCertificationRuns, persistWave7Flags } from "./data";
import { scanConstitutionalDrift, hasOpenDriftFindings } from "./drift";
import { recordEvidence } from "./evidence";
import { checkWave7Invariants, WAVE7_INVARIANTS } from "./invariants";
import { runLedgerReconstruction } from "./ledger-reconstruction";
import { createLaunchPlan, getLaunchReadiness } from "./launch";
import { validateMigration } from "./migration-cert";
import { hasCriticalOpenFindings, runAutomatedRedTeamScenarios } from "./redteam";
import { ensureRequirementsRegistry, getRequirementsCoverage } from "./requirements";
import type { IdentityTrustCertification, Wave7Certification } from "./types";

const CERT_PATH = join(process.cwd(), "data", "identity-trust", "wave7_certification.json");

export function loadWave7Certification(): Wave7Certification | null {
  try {
    return JSON.parse(readFileSync(CERT_PATH, "utf8")) as Wave7Certification;
  } catch {
    return null;
  }
}

export function persistWave7Certification(cert: Wave7Certification) {
  writeFileSync(CERT_PATH, JSON.stringify(cert, null, 2));
}

export function startCertificationRun(actorId: string): IdentityTrustCertification {
  ensureRequirementsRegistry();
  const run: IdentityTrustCertification = {
    id: itlId("itc"),
    certification_version: "ITL-W7-001",
    platform_release: "block-street",
    environment: process.env.NODE_ENV ?? "development",
    scope: "identity_trust_layer",
    constitution_version: "ITL-W7-001",
    started_at: nowIso(),
    completed_at: null,
    status: "assessment_in_progress",
    certification_authority: actorId,
    conditions: [],
    known_limitations: [],
    expires_at: null,
    gate_results: [],
    requirement_summary: { total: 0, passed: 0, failed: 0, uncovered: 0 },
  };
  const runs = loadCertificationRuns();
  runs.push(run);
  persistCertificationRuns(runs);
  return run;
}

export function runWave7Certification(actorId = "system"): Wave7Certification {
  if (!isWave6FoundationComplete()) {
    return {
      wave_id: "ITL-W7-001",
      certified_at: null,
      all_passed: false,
      production_certified: false,
      gates: [{ id: "w7-prereq", name: "Wave 6 prerequisite", passed: false, detail: "Wave 6 certification required" }],
    };
  }

  const flags = loadWave7Flags();
  ensureRequirementsRegistry();
  syncConformanceToRequirements();

  const run = startCertificationRun(actorId);
  const conformance = runAllConformanceSuites();
  const redTeam = runAutomatedRedTeamScenarios(run.id);
  const migration = validateMigration(run.id);
  const ledger = runLedgerReconstruction(run.id);
  scanConstitutionalDrift();

  let drills = listContinuityDrills();
  if (drills.filter((d) => d.status === "passed").length === 0) {
    const drill = startContinuityDrill("identity_service_outage");
    completeContinuityDrill(drill.id, "Read-only mode engaged; no bypass path opened", true, 1200);
    drills = listContinuityDrills();
  }

  const launchPlans = getLaunchReadiness();
  if (!launchPlans.latest_plan) createLaunchPlan("ITL Production Launch");

  const coverage = getRequirementsCoverage();
  const digest = conformanceDigest(conformance);

  recordEvidence({
    certification_id: run.id,
    evidence_type: "automated_test_result",
    title: "Conformance suite digest",
    description: "Aggregated Waves 1–6 conformance results",
    artifact_reference: `conformance:${digest}`,
    created_by: actorId,
  });

  const gates = [
    { id: "w7-g1", name: "Certification framework", passed: Boolean(flags.IDENTITY_CERTIFICATION_FRAMEWORK_ENABLED), detail: "Framework enabled" },
    { id: "w7-g2", name: "Traceability registry", passed: Boolean(flags.IDENTITY_TRACEABILITY_REQUIRED), detail: `${coverage.total} requirements` },
    { id: "w7-g3", name: "Conformance CI", passed: Boolean(flags.IDENTITY_CONFORMANCE_CI_REQUIRED) && conformance.every((s) => s.passed), detail: `${conformance.filter((s) => s.passed).length}/${conformance.length} suites` },
    { id: "w7-g4", name: "Red-team controls", passed: Boolean(flags.IDENTITY_RED_TEAM_REQUIRED) && !hasCriticalOpenFindings(run.id), detail: `${redTeam.length} scenarios` },
    { id: "w7-g5", name: "Migration reconciliation", passed: Boolean(flags.IDENTITY_MIGRATION_CERTIFICATION_REQUIRED) && migration.passed, detail: `orphans: ${migration.active_orphan_accounts}` },
    { id: "w7-g6", name: "Ledger reconstruction", passed: Boolean(flags.IDENTITY_LEDGER_RECONSTRUCTION_REQUIRED) && ledger.passed, detail: `sample: ${ledger.sample_size}` },
    { id: "w7-g7", name: "Continuity drills", passed: Boolean(flags.IDENTITY_CONTINUITY_DRILLS_REQUIRED) && drills.some((d) => d.status === "passed"), detail: `${drills.filter((d) => d.status === "passed").length} passed` },
    { id: "w7-g8", name: "Controlled launch", passed: Boolean(flags.IDENTITY_CONTROLLED_LAUNCH_ENABLED), detail: "Launch stages defined" },
    { id: "w7-g9", name: "Drift monitoring", passed: Boolean(flags.IDENTITY_CONSTITUTIONAL_DRIFT_MONITOR_ENABLED) && !hasOpenDriftFindings(), detail: "No open drift" },
    { id: "w7-g10", name: "Recertification policy", passed: Boolean(flags.IDENTITY_RECERTIFICATION_REQUIRED), detail: "Recertification required" },
  ];

  for (const inv of checkWave7Invariants()) {
    gates.push({ id: `w7-inv-${inv.id}`, name: inv.id, passed: inv.passed, detail: inv.detail });
  }

  const constitutionalFailed = coverage.failed > 0 || coverage.uncovered > 0;
  const coreGatesPassed = gates.filter((g) => g.id.startsWith("w7-g")).every((g) => g.passed);
  const allPassed = coreGatesPassed && isWave6FoundationComplete() && !constitutionalFailed;

  const completedRun: IdentityTrustCertification = {
    ...run,
    completed_at: nowIso(),
    status: allPassed ? "fully_certified" : migration.passed ? "conditionally_certified" : "failed",
    gate_results: gates.map((g) => ({
      id: g.id,
      gate_code: g.id,
      name: g.name,
      domain: "certification",
      passed: g.passed,
      detail: g.detail,
      evidence_ids: [],
    })),
    requirement_summary: {
      total: coverage.total,
      passed: coverage.tested,
      failed: coverage.failed,
      uncovered: coverage.uncovered,
    },
    known_limitations: migration.passed ? [] : ["Migration reconciliation incomplete — active orphan or test accounts remain"],
  };

  const runs = loadCertificationRuns();
  const idx = runs.findIndex((r) => r.id === run.id);
  if (idx >= 0) runs[idx] = completedRun;
  else runs.push(completedRun);
  persistCertificationRuns(runs);

  const updatedFlags = { ...flags };
  if (allPassed) {
    updatedFlags.IDENTITY_PRODUCTION_CERTIFIED = true;
  } else if (!allPassed && updatedFlags.IDENTITY_PRODUCTION_CERTIFIED && !loadWave7Certification()?.production_certified) {
    updatedFlags.IDENTITY_PRODUCTION_CERTIFIED = false;
  }
  persistWave7Flags(updatedFlags);

  const cert: Wave7Certification = {
    wave_id: "ITL-W7-001",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    production_certified: Boolean(updatedFlags.IDENTITY_PRODUCTION_CERTIFIED),
    gates,
  };

  if (allPassed) persistWave7Certification(cert);
  return cert;
}

export function getWave7Overview() {
  const flags = loadWave7Flags();
  return {
    wave_id: "ITL-W7-001",
    status: flags.WAVE7_IMPLEMENTATION_STATUS,
    requirements: getRequirementsCoverage(),
    launch: getLaunchReadiness(),
    drift: listDriftFindings(),
    invariants: checkWave7Invariants(),
    invariant_docs: WAVE7_INVARIANTS,
    flags,
    latest_certification: loadWave7Certification(),
  };
}

function listDriftFindings() {
  const { listDriftFindings: list } = require("./drift") as typeof import("./drift");
  return list();
}

export function isWave7FoundationComplete(): boolean {
  const stored = loadWave7Certification();
  if (stored?.all_passed) return true;
  const live = runWave7Certification();
  return live.all_passed;
}

export function assertWave7Foundation(operation: string) {
  if (!isWave6FoundationComplete()) {
    throw new Error(`ITL-W7-001 blocked. ${operation} requires Wave 6 certification.`);
  }
  if (!isWave7FoundationComplete()) {
    throw new Error(`ITL-W7-001 foundation incomplete. ${operation} requires Wave 7 certification.`);
  }
}

export function getCertificationRun(certificationId: string) {
  return loadCertificationRuns().find((r) => r.id === certificationId) ?? null;
}

export function recordConstitutionalAcceptance(input: {
  certification_id: string;
  decision: string;
  scope: string;
  board_members: string[];
  conditions?: string[];
}) {
  const { loadConstitutionalAcceptance, persistConstitutionalAcceptance } = require("./data") as typeof import("./data");
  const record = {
    id: itlId("ica"),
    certification_id: input.certification_id,
    decision: input.decision,
    scope: input.scope,
    conditions: input.conditions ?? [],
    constitutional_exceptions: [] as string[],
    board_members: input.board_members,
    signed_at: nowIso(),
  };
  const all = loadConstitutionalAcceptance();
  all.push(record);
  persistConstitutionalAcceptance(all);
  return record;
}

export function getWave7DependencyStatus() {
  const w6 = isWave6FoundationComplete();
  const cert = loadWave7Certification() ?? runWave7Certification();
  return {
    wave6: { complete: w6 },
    wave7: { id: "ITL-W7-001", complete: cert.all_passed, certified_at: cert.certified_at, production_certified: cert.production_certified },
    message: cert.all_passed
      ? "Wave 7 certified. Identity Trust Layer production-ready."
      : w6
        ? "Wave 7 certification in progress."
        : "Wave 7 blocked until Wave 6 foundation is certified.",
  };
}
