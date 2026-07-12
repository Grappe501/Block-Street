import { itlId } from "../utils";
import { loadRequirements, persistRequirements, loadRequirementTraces, persistRequirementTraces } from "./data";
import type { IdentityTrustRequirement, IdentityRequirementTrace } from "./types";

const CORE_REQUIREMENTS: Omit<IdentityTrustRequirement, "id" | "status">[] = [
  { requirement_code: "ITL-W1-INV-002", wave: "W1", domain: "invitation", title: "Invitation-only entry", requirement_text: "No new Human without accepted invitation", constitutional: true, risk_level: "critical", verification_method: "automated" },
  { requirement_code: "ITL-W1-INV-003", wave: "W1", domain: "sponsorship", title: "Sponsor attribution", requirement_text: "Every invitation has one sponsor", constitutional: true, risk_level: "critical", verification_method: "automated" },
  { requirement_code: "ITL-W2-VER-001", wave: "W2", domain: "verification", title: "No self-verification", requirement_text: "Human cannot verify self", constitutional: true, risk_level: "critical", verification_method: "automated" },
  { requirement_code: "ITL-W2-TRU-001", wave: "W2", domain: "trust", title: "Named trust states", requirement_text: "No hidden identity score", constitutional: true, risk_level: "high", verification_method: "automated" },
  { requirement_code: "ITL-W3-GOV-001", wave: "W3", domain: "governance", title: "Governed adverse decisions", requirement_text: "Consequential action requires case", constitutional: true, risk_level: "critical", verification_method: "integration" },
  { requirement_code: "ITL-W3-APL-001", wave: "W3", domain: "appeals", title: "Appeal independence", requirement_text: "Appeals require independent panel", constitutional: true, risk_level: "critical", verification_method: "integration" },
  { requirement_code: "ITL-W4-INV-006", wave: "W4", domain: "federation", title: "Role isolation", requirement_text: "Roles do not transfer across institutions", constitutional: true, risk_level: "critical", verification_method: "integration" },
  { requirement_code: "ITL-W4-INV-007", wave: "W4", domain: "context", title: "Active context", requirement_text: "Every action identifies institution context", constitutional: true, risk_level: "critical", verification_method: "integration" },
  { requirement_code: "ITL-W5-INV-002", wave: "W5", domain: "intelligence", title: "Signal-only authority", requirement_text: "Signals cannot change identity state", constitutional: true, risk_level: "critical", verification_method: "automated" },
  { requirement_code: "ITL-W5-INV-003", wave: "W5", domain: "intelligence", title: "No AI identity decisions", requirement_text: "AI cannot open adverse identity decision", constitutional: true, risk_level: "critical", verification_method: "adversarial" },
  { requirement_code: "ITL-W6-INV-005", wave: "W6", domain: "operations", title: "Advisory signals in ops", requirement_text: "Intelligence signals labeled advisory in operations", constitutional: true, risk_level: "high", verification_method: "manual" },
  { requirement_code: "ITL-W7-ENTRY-001", wave: "W7", domain: "launch", title: "No public registration", requirement_text: "Public signup permanently disabled", constitutional: true, risk_level: "critical", verification_method: "adversarial" },
  { requirement_code: "ITL-W7-AUDIT-001", wave: "W7", domain: "audit", title: "Ledger integrity", requirement_text: "Identity ledger passes integrity check", constitutional: true, risk_level: "critical", verification_method: "automated" },
  { requirement_code: "ITL-W7-MIG-001", wave: "W7", domain: "migration", title: "Zero orphan accounts", requirement_text: "No active accounts without Human or service identity", constitutional: true, risk_level: "critical", verification_method: "automated" },
];

export function ensureRequirementsRegistry(): IdentityTrustRequirement[] {
  const existing = loadRequirements();
  if (existing.length > 0) return existing;

  const reqs = CORE_REQUIREMENTS.map((r) => ({
    ...r,
    id: itlId("itr"),
    status: "implemented" as const,
  }));
  persistRequirements(reqs);

  const traces: IdentityRequirementTrace[] = reqs.map((r) => ({
    id: itlId("irt"),
    requirement_id: r.id,
    policy_reference: `wave${r.wave.replace("W", "")}_policy.json`,
    service_reference: `src/lib/identity-trust/wave${r.wave.replace("W", "")}/`,
    api_reference: null,
    test_reference: `scripts/identity-trust/wave${r.wave.replace("W", "")}-smoke.mjs`,
    audit_event_reference: null,
    certification_result: "pending" as const,
  }));
  persistRequirementTraces(traces);
  return reqs;
}

export function listRequirements(filters?: { wave?: string; domain?: string; constitutional?: boolean }) {
  let reqs = ensureRequirementsRegistry();
  if (filters?.wave) reqs = reqs.filter((r) => r.wave === filters.wave);
  if (filters?.domain) reqs = reqs.filter((r) => r.domain === filters.domain);
  if (filters?.constitutional !== undefined) reqs = reqs.filter((r) => r.constitutional === filters.constitutional);
  return reqs;
}

export function getTraceabilityMatrix() {
  const reqs = ensureRequirementsRegistry();
  const traces = loadRequirementTraces();
  return reqs.map((r) => ({
    requirement: r,
    trace: traces.find((t) => t.requirement_id === r.id) ?? null,
  }));
}

export function updateRequirementStatus(requirementCode: string, status: IdentityTrustRequirement["status"], result: IdentityRequirementTrace["certification_result"]) {
  const reqs = loadRequirements();
  const idx = reqs.findIndex((r) => r.requirement_code === requirementCode);
  if (idx < 0) return null;
  reqs[idx] = { ...reqs[idx], status };
  persistRequirements(reqs);

  const traces = loadRequirementTraces();
  const tidx = traces.findIndex((t) => t.requirement_id === reqs[idx].id);
  if (tidx >= 0) {
    traces[tidx] = { ...traces[tidx], certification_result: result };
    persistRequirementTraces(traces);
  }
  return reqs[idx];
}

export function getRequirementsCoverage() {
  const reqs = ensureRequirementsRegistry();
  const traces = loadRequirementTraces();
  return {
    total: reqs.length,
    constitutional: reqs.filter((r) => r.constitutional).length,
    implemented: reqs.filter((r) => r.status === "implemented" || r.status === "tested" || r.status === "evidence_complete").length,
    tested: traces.filter((t) => t.certification_result === "passed").length,
    failed: traces.filter((t) => t.certification_result === "failed").length,
    pending: traces.filter((t) => t.certification_result === "pending").length,
    uncovered: reqs.filter((r) => r.status === "uncovered").length,
  };
}
