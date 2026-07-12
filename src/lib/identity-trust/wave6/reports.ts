import { loadHumanIdentities, loadTrustInvitations } from "../data";
import { loadIdentityCases, loadIdentityAppealRecords } from "../wave3/data";
import { loadFederationMembershipsV4, loadCrossInstitutionInvitations } from "../wave4/data";
import { loadIntelligenceSignals, loadSignalFalsePositives } from "../wave5/data";
import { loadSupportRequests, loadHumanHelpEvents, persistReportRuns, loadReportRuns } from "./data";
import { listWorkItems } from "./queue";
import { itlId, nowIso } from "../utils";
import type { IdentityReportRun } from "./types";

export function getOperationalMetrics() {
  const identities = loadHumanIdentities();
  const invitations = loadTrustInvitations();
  const cases = loadIdentityCases();
  const appeals = loadIdentityAppealRecords();
  const workItems = listWorkItems();
  const support = loadSupportRequests();
  const helpEvents = loadHumanHelpEvents();

  return {
    invitation: {
      created: invitations.length,
      accepted: invitations.filter((i) => i.status === "accepted").length,
      expired: invitations.filter((i) => i.status === "expired").length,
      revoked: invitations.filter((i) => i.status === "revoked").length,
    },
    verification: {
      sponsored: identities.filter((i) => i.trust_label === "sponsored").length,
      verified: identities.filter((i) => i.trust_label === "verified" || i.trust_label === "trusted").length,
      pending: identities.filter((i) => i.trust_label === "sponsored" || i.trust_label === "pending_invitation").length,
    },
    governance: {
      cases_open: cases.filter((c) => !["closed", "archived"].includes(c.status)).length,
      appeals_open: appeals.filter((a) => !["closed", "denied_final"].includes(a.status)).length,
      appeals_reversed: appeals.filter((a) => a.status === "granted" || a.status === "granted_in_part").length,
    },
    operations: {
      work_items_open: workItems.filter((w) => !["resolved", "closed", "cancelled"].includes(w.status)).length,
      support_open: support.filter((s) => !["resolved", "closed"].includes(s.status)).length,
      human_help_events: helpEvents.length,
    },
    federation: {
      memberships: loadFederationMembershipsV4().length,
      cross_invitations: loadCrossInstitutionInvitations().length,
    },
    intelligence: {
      signals: loadIntelligenceSignals().length,
      false_positives: loadSignalFalsePositives().length,
    },
    privacy_note: "Reports are aggregate only — no Human rankings",
    last_updated: nowIso(),
  };
}

export function runReport(reportId: string): IdentityReportRun {
  const metrics = getOperationalMetrics();
  const run: IdentityReportRun = {
    id: itlId("irr"),
    report_id: reportId,
    run_at: nowIso(),
    metrics: metrics as unknown as Record<string, number | string>,
    data_period: "current",
    limitations: ["Aggregate only", "Private verification evidence excluded", "Small groups may be suppressed"],
  };
  const all = loadReportRuns();
  all.push(run);
  persistReportRuns(all);
  return run;
}

export const REPORT_DEFINITIONS = [
  { id: "invitation-report", name: "Invitation Report", audience: "institution_admin" },
  { id: "verification-report", name: "Verification Report", audience: "institution_admin" },
  { id: "governance-report", name: "Governance Report", audience: "identity_reviewer" },
  { id: "federation-report", name: "Federation Report", audience: "federation_admin" },
  { id: "security-integrity-report", name: "Security and Integrity Report", audience: "security_operator" },
];

export function listReports() {
  return REPORT_DEFINITIONS.map((r) => ({
    ...r,
    privacy_rules: ["No Human rankings", "No private verification evidence"],
    version: "1.0",
  }));
}
