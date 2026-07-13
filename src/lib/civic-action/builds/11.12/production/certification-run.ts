/**
 * CAE-11.12-W8 — Certification run orchestration
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import { buildKnowledgeReleaseIdentity } from "./release-identity";
import { runKnowledgeCertificationGates } from "./certification-registry";
import { runKnowledgeTraceabilityCertification } from "./traceability-certification";
import type { CertificationRunRecord, CertificationRunStatus, LaunchRecommendation } from "./contracts";

const RUNS_KEY = "knowledge_certification_runs";
const BUNDLES_KEY = "knowledge_certification_evidence_bundles";

export function createCertificationRun(input: {
  environment: string;
  started_by_human_id: string;
  certification_scope?: string;
}): CertificationRunRecord {
  const release = buildKnowledgeReleaseIdentity(input.environment);
  const run: CertificationRunRecord = {
    certification_run_id: caeId("crun"),
    release_id: release.release_id,
    environment: input.environment,
    certification_scope: input.certification_scope ?? "full_engine",
    started_by_human_id: input.started_by_human_id,
    started_at: nowIso(),
    completed_at_optional: null,
    status: "not_started",
    gate_results: [],
    evidence_bundle_id: null,
    launch_recommendation: null,
    approved_by_human_ids: [],
  };
  const rows = readStoreSlice<CertificationRunRecord>(RUNS_KEY);
  rows.push(run);
  writeStoreSlice(RUNS_KEY, rows);
  return run;
}

export function startCertificationRun(runId: string): CertificationRunRecord | null {
  const rows = readStoreSlice<CertificationRunRecord>(RUNS_KEY);
  const idx = rows.findIndex((r) => r.certification_run_id === runId);
  if (idx < 0) return null;
  rows[idx] = { ...rows[idx], status: "running", started_at: nowIso() };
  writeStoreSlice(RUNS_KEY, rows);
  return rows[idx];
}

export function recordCertificationGateResults(runId: string): CertificationRunRecord | null {
  const rows = readStoreSlice<CertificationRunRecord>(RUNS_KEY);
  const idx = rows.findIndex((r) => r.certification_run_id === runId);
  if (idx < 0) return null;
  rows[idx] = { ...rows[idx], gate_results: runKnowledgeCertificationGates() };
  writeStoreSlice(RUNS_KEY, rows);
  return rows[idx];
}

export function completeCertificationRun(runId: string): CertificationRunRecord | null {
  const rows = readStoreSlice<CertificationRunRecord>(RUNS_KEY);
  const idx = rows.findIndex((r) => r.certification_run_id === runId);
  if (idx < 0) return null;

  const gate_results = rows[idx].gate_results.length ? rows[idx].gate_results : runKnowledgeCertificationGates();
  const blockingFailed = gate_results.some((g) => g.blocking && g.status === "fail");
  const anyFailed = gate_results.some((g) => g.status === "fail");
  const trace = runKnowledgeTraceabilityCertification();

  let status: CertificationRunStatus = "passed";
  let launch_recommendation: LaunchRecommendation = "go_limited_production";

  if (blockingFailed) {
    status = "failed";
    launch_recommendation = "no_go_critical_risk";
  } else if (anyFailed) {
    status = "passed_with_approved_exceptions";
    launch_recommendation = "conditional_go";
  } else if (trace.failed_requirements > 0) {
    status = "blocked";
    launch_recommendation = "no_go_remediation";
  }

  const bundle_id = caeId("evb");
  const bundles = readStoreSlice<{ evidence_bundle_id: string; run_id: string; created_at: string; gate_results: typeof gate_results; trace: typeof trace }>(BUNDLES_KEY);
  bundles.push({
    evidence_bundle_id: bundle_id,
    run_id: runId,
    created_at: nowIso(),
    gate_results,
    trace,
  });
  writeStoreSlice(BUNDLES_KEY, bundles);

  rows[idx] = {
    ...rows[idx],
    gate_results,
    status,
    launch_recommendation,
    evidence_bundle_id: bundle_id,
    completed_at_optional: nowIso(),
  };
  writeStoreSlice(RUNS_KEY, rows);
  return rows[idx];
}

export function listCertificationRuns(limit = 20): CertificationRunRecord[] {
  return readStoreSlice<CertificationRunRecord>(RUNS_KEY).slice(-limit);
}

export function getCertificationRun(runId: string): CertificationRunRecord | null {
  return readStoreSlice<CertificationRunRecord>(RUNS_KEY).find((r) => r.certification_run_id === runId) ?? null;
}

export function getEvidenceBundle(bundleId: string) {
  return readStoreSlice<{ evidence_bundle_id: string; run_id: string; created_at: string; gate_results: unknown; trace: unknown }>(BUNDLES_KEY).find(
    (b) => b.evidence_bundle_id === bundleId
  ) ?? null;
}

export function getCertificationStatus() {
  const release = buildKnowledgeReleaseIdentity();
  const gates = runKnowledgeCertificationGates();
  const trace = runKnowledgeTraceabilityCertification();
  const runs = listCertificationRuns(1);
  const latest = runs[runs.length - 1];

  return {
    release_identity: release,
    gate_results: gates,
    traceability: trace,
    latest_run: latest ?? null,
    critical_gates_passed: gates.filter((g) => g.severity === "critical").every((g) => g.status === "pass"),
    generated_at: nowIso(),
  };
}
