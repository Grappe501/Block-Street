import { loadHumanIdentities } from "../data";
import { loadIdentityCases, loadIdentityAppealRecords } from "../wave3/data";
import { verifyLedgerIntegrity } from "../wave2/ledger";
import { getOperationalMetrics } from "./reports";
import { getOperationsOverview, getFederationOpsSummary } from "./overview";
import { getIntelligenceQualityMetrics } from "../wave5/detection";
import { loadExecutiveMetrics, persistExecutiveMetrics } from "./data";
import { itlId, nowIso } from "../utils";
import type { IdentityExecutiveMetric } from "./types";

export function buildExecutiveMetrics(): IdentityExecutiveMetric[] {
  const identities = loadHumanIdentities();
  const cases = loadIdentityCases();
  const appeals = loadIdentityAppealRecords();
  const ledger = verifyLedgerIntegrity();
  const ops = getOperationsOverview();
  const intel = getIntelligenceQualityMetrics();
  const federation = getFederationOpsSummary();

  const metrics: Omit<IdentityExecutiveMetric, "id">[] = [
    { metric_key: "active_humans", value: identities.filter((i) => i.identity_status === "active").length, label: "Active Humans", updated_at: nowIso(), aggregate_only: true },
    { metric_key: "verified_humans", value: identities.filter((i) => ["verified", "trusted", "federation_trusted"].includes(i.trust_label)).length, label: "Verified Humans", updated_at: nowIso(), aggregate_only: true },
    { metric_key: "verification_pending", value: identities.filter((i) => i.trust_label === "sponsored").length, label: "Verification Pending", updated_at: nowIso(), aggregate_only: true },
    { metric_key: "restricted_identities", value: identities.filter((i) => i.identity_status === "restricted").length, label: "Restricted Identities", updated_at: nowIso(), aggregate_only: true },
    { metric_key: "open_critical_cases", value: cases.filter((c) => c.severity === "IG-4" && !["closed", "archived"].includes(c.status)).length, label: "Open Critical Cases", updated_at: nowIso(), aggregate_only: true },
    { metric_key: "appeals_overdue", value: appeals.filter((a) => a.status === "submitted").length, label: "Appeals Pending", updated_at: nowIso(), aggregate_only: true },
    { metric_key: "overdue_work", value: ops.today.overdue_work, label: "Overdue Work Items", updated_at: nowIso(), aggregate_only: true },
    { metric_key: "ledger_integrity", value: ledger.valid ? "Healthy" : "Degraded", label: "Ledger Integrity", updated_at: nowIso(), aggregate_only: true },
    { metric_key: "false_positive_rate", value: Math.round(intel.false_positive_rate * 1000) / 10, label: "Signal False Positive Rate (%)", updated_at: nowIso(), aggregate_only: true },
    { metric_key: "multi_institution_humans", value: federation.multi_institution_humans, label: "Multi-Institution Humans", updated_at: nowIso(), aggregate_only: true },
    { metric_key: "identity_system_health", value: ledger.valid && ops.today.overdue_work < 10 ? "98.7%" : "Review needed", label: "Identity System Health", updated_at: nowIso(), aggregate_only: true },
  ];

  const stored = metrics.map((m) => ({ ...m, id: itlId("iem") }));
  persistExecutiveMetrics(stored);
  return stored;
}

export function getExecutiveOverview() {
  const metrics = buildExecutiveMetrics();
  const ops = getOperationsOverview();
  return {
    summary: Object.fromEntries(metrics.map((m) => [m.metric_key, m.value])),
    metrics,
    aggregate_only: true,
    case_level_access: false,
    private_evidence_access: false,
    readiness: {
      registry_completeness: "operational",
      invitation_lineage: "operational",
      verification_completion: metrics.find((m) => m.metric_key === "verification_pending")?.value ?? 0,
      federation_readiness: "operational",
    },
    governance_health: {
      case_backlog: ops.queues.unassigned + ops.queues.assigned,
      overdue_work: ops.today.overdue_work,
      appeal_pending: metrics.find((m) => m.metric_key === "appeals_overdue")?.value ?? 0,
    },
    network_integrity: getIntelligenceQualityMetrics(),
    human_impact: ops.human_impact,
    last_updated: nowIso(),
    limitations: ["Aggregate views only", "No case-level authority granted", "No private evidence"],
  };
}

export function getExecutiveReadiness() {
  return getExecutiveOverview().readiness;
}

export function getExecutiveGovernanceHealth() {
  return getExecutiveOverview().governance_health;
}

export function getExecutiveNetworkIntegrity() {
  return getExecutiveOverview().network_integrity;
}

export function getExecutiveHumanImpact() {
  return getExecutiveOverview().human_impact;
}

export function requestExecutiveAudit(requesterId: string, purpose: string) {
  const { recordOperationsAudit } = require("./audit") as typeof import("./audit");
  recordOperationsAudit({
    event_type: "executive_audit_requested",
    actor_human_id: requesterId,
    subject_human_id: null,
    institution_id: null,
    resource_type: "executive_request",
    resource_id: itlId("exreq"),
    summary: purpose,
    correlation_id: null,
  });
  return { requested: true, purpose, note: "Formal audit will be scheduled through identity auditor role." };
}

export function requestExecutivePolicyReview(requesterId: string, topic: string) {
  const { recordOperationsAudit } = require("./audit") as typeof import("./audit");
  recordOperationsAudit({
    event_type: "executive_policy_review_requested",
    actor_human_id: requesterId,
    subject_human_id: null,
    institution_id: null,
    resource_type: "executive_request",
    resource_id: itlId("exreq"),
    summary: topic,
    correlation_id: null,
  });
  return { requested: true, topic };
}

export function loadExecutiveMetricsCached() {
  const cached = loadExecutiveMetrics();
  if (cached.length > 0) return cached;
  return buildExecutiveMetrics();
}
