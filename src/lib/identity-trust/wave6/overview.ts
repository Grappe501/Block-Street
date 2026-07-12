import { loadHumanIdentities } from "../data";
import { loadIdentityCases } from "../wave3/data";
import { loadIdentityAppealRecords } from "../wave3/data";
import { loadFederationMembershipsV4 } from "../wave4/data";
import { loadIntelligenceSignals } from "../wave5/data";
import { getIntelligenceQualityMetrics } from "../wave5/detection";
import { verifyLedgerIntegrity } from "../wave2/ledger";
import { listWorkItems, processOverdueEscalations } from "./queue";
import { listSupportRequests } from "./support";
import { loadWave6Flags } from "./data";

export function getOperationsOverview() {
  const flags = loadWave6Flags();
  processOverdueEscalations();

  const workItems = listWorkItems();
  const openWork = workItems.filter((w) => !["resolved", "closed", "cancelled"].includes(w.status));
  const overdue = listWorkItems({ overdue: true });
  const cases = loadIdentityCases().filter((c) => !["closed", "archived"].includes(c.status));
  const appeals = loadIdentityAppealRecords().filter((a) => !["closed", "denied", "withdrawn"].includes(a.status));
  const signals = loadIntelligenceSignals().filter((s) => !["closed", "benign", "false_positive", "expired"].includes(s.status));
  const ledger = verifyLedgerIntegrity();

  return {
    today: {
      critical_alerts: signals.filter((s) => s.severity === "SI-5" || s.severity === "SI-4").length,
      due_cases: cases.filter((c) => c.response_due_at && c.response_due_at < new Date().toISOString()).length,
      overdue_work: overdue.length,
      pending_approvals: workItems.filter((w) => w.status === "waiting_for_approval").length,
      ledger_integrity: ledger.valid ? "healthy" : "degraded",
    },
    queues: {
      unassigned: openWork.filter((w) => w.status === "unassigned" || w.status === "new").length,
      assigned: openWork.filter((w) => w.status === "assigned" || w.status === "in_progress").length,
      escalated: openWork.filter((w) => w.status === "escalated").length,
      waiting_for_human: openWork.filter((w) => w.status === "waiting_for_human").length,
      recently_resolved: workItems.filter((w) => w.status === "resolved").length,
    },
    system_health: {
      invitation_service: "operational",
      verification_service: "operational",
      trust_projector: "operational",
      identity_ledger: ledger.valid ? "operational" : "degraded",
      context_resolver: flags.FEDERATION_IDENTITY_CONSOLE_ENABLED ? "operational" : "disabled",
      intelligence_pipeline: flags.IDENTITY_INTELLIGENCE_REVIEW_ENABLED ? "operational" : "disabled",
      queue_processing: flags.IDENTITY_WORK_QUEUE_ENABLED ? "operational" : "disabled",
    },
    human_impact: {
      restricted_identities: loadHumanIdentities().filter((h) => h.identity_status === "restricted").length,
      awaiting_verification: loadHumanIdentities().filter((h) => h.trust_label === "sponsored").length,
      open_appeals: appeals.length,
      open_support: listSupportRequests({ status: "new" }).length + listSupportRequests({ status: "assigned" }).length,
    },
    last_updated: new Date().toISOString(),
  };
}

export function getSystemHealth() {
  const ledger = verifyLedgerIntegrity();
  return {
    services: getOperationsOverview().system_health,
    ledger: ledger,
    intelligence: getIntelligenceQualityMetrics(),
  };
}

export function getDeadlines() {
  const work = listWorkItems().filter((w) => w.due_at && !["resolved", "closed", "cancelled"].includes(w.status));
  const cases = loadIdentityCases()
    .filter((c) => c.response_due_at && !["closed", "archived"].includes(c.status))
    .map((c) => ({
      type: "identity_case",
      id: c.id,
      subject_human_id: c.subject_human_id,
      due_at: c.response_due_at,
      summary: c.summary,
    }));
  return {
    work_items: work.map((w) => ({ id: w.id, type: w.work_type, due_at: w.due_at, summary: w.summary })),
    cases,
  };
}

export function getHumanImpactSummary() {
  return getOperationsOverview().human_impact;
}

export function getOperationalAlerts() {
  const overdue = listWorkItems({ overdue: true });
  const signals = loadIntelligenceSignals().filter((s) => s.severity === "SI-5" && s.status === "generated");
  return [
    ...overdue.map((w) => ({
      id: w.id,
      type: "overdue_work",
      severity: "high",
      summary: `Overdue: ${w.summary}`,
      advisory: false,
    })),
    ...signals.map((s) => ({
      id: s.id,
      type: "intelligence_signal",
      severity: "critical",
      summary: s.summary,
      advisory: true,
      prohibited_actions: s.prohibited_automatic_actions,
    })),
  ];
}

export function getFederationOpsSummary() {
  const memberships = loadFederationMembershipsV4();
  const multiInst = new Map<string, number>();
  for (const m of memberships) {
    if (m.membership_status === "ended" || m.membership_status === "archived") continue;
    multiInst.set(m.human_id, (multiInst.get(m.human_id) ?? 0) + 1);
  }
  const multiCount = [...multiInst.values()].filter((n) => n > 1).length;
  return {
    unique_humans: multiInst.size,
    multi_institution_humans: multiCount,
    active_memberships: memberships.filter((m) => m.membership_status === "active").length,
    aggregate_only: true,
  };
}
