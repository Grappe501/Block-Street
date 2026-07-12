import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { checkCaeInvariants, CAE_INVARIANTS } from "./invariants";
import { seedCivicActionStore } from "./seed";
import { getOperationsOverview } from "./command-center";
import { listInitiatives } from "./initiatives";
import { listMissions } from "./missions";
import { listInitiativeAudit } from "./audit";
import { loadCaeFlags, isStoreSeeded } from "./data";
import type { CaeCertification } from "./types";
import { nowIso } from "./utils";

const CERT_PATH = join(process.cwd(), "data", "civic-action", "cae_certification.json");

export function ensureCaeStore() {
  if (!isStoreSeeded()) return seedCivicActionStore();
  return { seeded: false };
}

export function loadCaeCertification(): CaeCertification | null {
  try {
    return JSON.parse(readFileSync(CERT_PATH, "utf8")) as CaeCertification;
  } catch {
    return null;
  }
}

export function persistCaeCertification(cert: CaeCertification) {
  writeFileSync(CERT_PATH, JSON.stringify(cert, null, 2));
}

export function runCaeCertification(): CaeCertification {
  ensureCaeStore();
  const flags = loadCaeFlags();
  const overview = getOperationsOverview();
  const initiatives = listInitiatives();
  const missions = listMissions();
  const audit = listInitiativeAudit(undefined, 10);

  const gates = [
    { id: "cae-g1", name: "Initiative integrity", passed: Boolean(flags.INITIATIVE_ARCHITECTURE_ENABLED) && initiatives.every((i) => i.purpose && i.executive_owner_human_id), detail: `${initiatives.length} initiatives` },
    { id: "cae-g2", name: "Strategic objectives", passed: Boolean(flags.STRATEGIC_OBJECTIVES_ENABLED), detail: `${overview.command_center.outcomes.objectives.length} objectives` },
    { id: "cae-g3", name: "Mission execution", passed: Boolean(flags.MISSION_EXECUTION_ENABLED) && missions.length > 0, detail: `${missions.length} missions` },
    { id: "cae-g4", name: "Responsibility coordination", passed: Boolean(flags.RESPONSIBILITY_COORDINATION_ENABLED), detail: "Accountability matrix active" },
    { id: "cae-g5", name: "Operational calendar", passed: Boolean(flags.OPERATIONAL_CALENDAR_ENABLED), detail: `${overview.command_center.today.events_today} events today` },
    { id: "cae-g6", name: "Resource capacity", passed: Boolean(flags.RESOURCE_CAPACITY_ENABLED), detail: "Resource tracking enabled" },
    { id: "cae-g7", name: "Communications ops", passed: Boolean(flags.COMMUNICATIONS_OPERATIONS_ENABLED), detail: "Human approval required" },
    { id: "cae-g8", name: "Field operations", passed: Boolean(flags.FIELD_OPERATIONS_ENABLED), detail: "Geographic execution enabled" },
    { id: "cae-g9", name: "Coalition boundaries", passed: Boolean(flags.COALITION_COORDINATION_ENABLED), detail: "Institution autonomy preserved" },
    { id: "cae-g10", name: "Decision system", passed: Boolean(flags.DECISION_APPROVAL_ENABLED), detail: `${overview.command_center.today.pending_approvals} pending` },
    { id: "cae-g11", name: "Command center", passed: Boolean(flags.OPERATIONS_COMMAND_CENTER_ENABLED), detail: "Live operations view" },
    { id: "cae-g12", name: "Adaptive execution", passed: Boolean(flags.ADAPTIVE_EXECUTION_ENABLED), detail: "Human-approved adaptations" },
    { id: "cae-g13", name: "Action evidence", passed: Boolean(flags.ACTION_EVIDENCE_ENABLED), detail: "Evidence linked to outcomes" },
    { id: "cae-g14", name: "Playbooks", passed: Boolean(flags.PLAYBOOK_REPLICATION_ENABLED), detail: "Replication enabled" },
    { id: "cae-g15", name: "Operational safety", passed: Boolean(flags.OPERATIONAL_SAFETY_ENABLED), detail: "Safety gates active" },
    { id: "cae-g16", name: "Audit trail", passed: audit.length > 0, detail: `${audit.length} audit events` },
  ];

  for (const inv of checkCaeInvariants()) {
    gates.push({ id: `cae-inv-${inv.id}`, name: inv.id, passed: inv.passed, detail: inv.detail });
  }

  const allPassed = gates.every((g) => g.passed);
  const cert: CaeCertification = {
    wave_id: "CAE-001",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    gates,
  };
  if (allPassed) persistCaeCertification(cert);
  return cert;
}

export function getCaeOverview() {
  ensureCaeStore();
  return {
    wave_id: "CAE-001",
    phase: 11,
    status: loadCaeFlags().CAE_IMPLEMENTATION_STATUS,
    operations: getOperationsOverview(),
    initiatives: listInitiatives(),
    invariants: checkCaeInvariants(),
    invariant_docs: CAE_INVARIANTS,
    flags: loadCaeFlags(),
    certification: loadCaeCertification(),
  };
}

export function isCaeFoundationComplete(): boolean {
  const stored = loadCaeCertification();
  if (stored?.all_passed) return true;
  return runCaeCertification().all_passed;
}
