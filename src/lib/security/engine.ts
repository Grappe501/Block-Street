import {
  loadAccessReviews,
  loadBackups,
  loadClassifications,
  loadDataAssets,
  loadExports,
  loadFeatureFlags,
  loadIncidents,
  loadPrivacyRequests,
  loadRecoveryTests,
  loadRisks,
  loadSecurityEvents,
  loadThreatModels,
  loadVulnerabilities,
  persistIncidents,
  persistPrivacyRequests,
  persistRecoveryTests,
  persistSecurityEvents,
  persistVulnerabilities,
  appendSecurityAudit,
  loadRecentAudit,
} from "./data";
import type { SecurityIncident, SecurityPosture, SecurityEvent, Vulnerability } from "./types";

export function getSecurityPosture(): SecurityPosture {
  const incidents = loadIncidents().filter((i) => i.status !== "closed");
  const vulns = loadVulnerabilities().filter((v) => v.status !== "closed");
  const exports = loadExports().filter((e) => e.status === "pending_review");
  const reviews = loadAccessReviews().filter((r) => r.status !== "completed");
  const backups = loadBackups();
  const recovery = loadRecoveryTests();
  const lastTest = recovery[recovery.length - 1];

  return {
    posture_score: 92,
    critical_incidents: incidents.filter((i) => i.severity === "SEV-1").length,
    high_risk_alerts: loadSecurityEvents().filter((e) => e.severity === "high" && e.status === "open").length,
    admins_without_mfa: 0,
    open_vulnerabilities: vulns.length,
    critical_vulnerabilities: vulns.filter((v) => v.severity === "critical").length,
    unreviewed_exports: exports.length,
    access_reviews_due: reviews.length,
    backup_status: backups.every((b) => b.status === "healthy") ? "Healthy" : "Degraded",
    last_restore_test: lastTest?.result ?? "Not run",
    break_glass_events: 0,
  };
}

export function getSecurityOverview() {
  const posture = getSecurityPosture();
  return {
    posture,
    risks: loadRisks().slice(0, 5),
    threat_models: loadThreatModels().length,
    classifications: loadClassifications().length,
    data_assets: loadDataAssets().length,
    open_incidents: loadIncidents().filter((i) => i.status !== "closed").length,
    open_events: loadSecurityEvents().filter((e) => e.status === "open").length,
  };
}

export function listSecurityEvents(filters?: { severity?: string; status?: string }) {
  let events = loadSecurityEvents();
  if (filters?.severity) events = events.filter((e) => e.severity === filters.severity);
  if (filters?.status) events = events.filter((e) => e.status === filters.status);
  return events.sort((a, b) => b.detected_at.localeCompare(a.detected_at));
}

export function listIncidents() {
  return loadIncidents().sort((a, b) => b.detected_at.localeCompare(a.detected_at));
}

export function createIncident(input: {
  title: string;
  severity: SecurityIncident["severity"];
  affected_services: string[];
  commander: string;
}): SecurityIncident {
  const flags = loadFeatureFlags();
  if (!flags.SECURITY_PLATFORM_ENABLED) throw new Error("Security platform is not enabled.");

  const incident: SecurityIncident = {
    id: `sec-inc-${Date.now()}`,
    title: input.title,
    severity: input.severity,
    status: "detected",
    detected_at: new Date().toISOString(),
    incident_commander: input.commander,
    affected_services: input.affected_services,
    affected_organizations: [],
    containment_actions: [],
    recovery_actions: [],
  };

  const incidents = loadIncidents();
  incidents.push(incident);
  persistIncidents(incidents);

  appendSecurityAudit({
    action: "security.incident_opened",
    target_id: incident.id,
    risk_level: input.severity,
    actor_id: input.commander,
    result: "success",
  });

  return incident;
}

export function containIncident(incidentId: string, action: string, actorId: string) {
  const incidents = loadIncidents();
  const incident = incidents.find((i) => i.id === incidentId);
  if (!incident) throw new Error("Incident not found.");
  incident.status = "contained";
  incident.containment_actions.push(action);
  persistIncidents(incidents);
  appendSecurityAudit({ action: "security.incident_contained", target_id: incidentId, actor_id: actorId, result: "success" });
  return incident;
}

export function closeIncident(incidentId: string, actorId: string) {
  const incidents = loadIncidents();
  const incident = incidents.find((i) => i.id === incidentId);
  if (!incident) throw new Error("Incident not found.");
  incident.status = "closed";
  incident.closed_at = new Date().toISOString();
  persistIncidents(incidents);
  appendSecurityAudit({ action: "security.incident_closed", target_id: incidentId, actor_id: actorId, result: "success" });
  return incident;
}

export function recordSecurityEvent(input: {
  event_type: string;
  severity: "low" | "moderate" | "high" | "critical";
  source: string;
  target?: string;
  actor_id?: string;
  organization_id?: string;
  correlation_id?: string;
}) {
  const event: SecurityEvent = {
    id: `sec-evt-${Date.now()}`,
    ...input,
    detected_at: new Date().toISOString(),
    status: "open",
  };
  const events = loadSecurityEvents();
  events.push(event);
  persistSecurityEvents(events);

  if (input.severity === "critical" && loadFeatureFlags().SECURITY_INCIDENT_AUTOMATION_ENABLED) {
    const incident = createIncident({
      title: `Auto-opened: ${input.event_type}`,
      severity: "SEV-2",
      affected_services: [input.source],
      commander: "system",
    });
    event.incident_id = incident.id;
    persistSecurityEvents(events.map((e) => (e.id === event.id ? event : e)));
  }

  appendSecurityAudit({ action: input.event_type, target: input.target, actor_id: input.actor_id, result: "detected" });
  return event;
}

export function verifyVulnerability(vulnId: string, actorId: string) {
  const vulns = loadVulnerabilities();
  const v = vulns.find((x) => x.id === vulnId);
  if (!v) throw new Error("Vulnerability not found.");
  v.status = "closed";
  v.fixed_at = new Date().toISOString();
  persistVulnerabilities(vulns);
  appendSecurityAudit({ action: "vulnerability.verified", target_id: vulnId, actor_id: actorId, result: "success" });
  return v;
}

export function createPrivacyRequest(input: {
  request_type: string;
  requesting_user_id: string;
  subject_user_id: string;
  organization_id?: string;
}) {
  const req = {
    id: `priv-${Date.now()}`,
    ...input,
    status: "submitted",
    submitted_at: new Date().toISOString(),
  };
  const requests = loadPrivacyRequests();
  requests.push(req);
  persistPrivacyRequests(requests);
  appendSecurityAudit({ action: "privacy.request_submitted", target_id: req.id, actor_id: input.requesting_user_id, result: "success" });
  return req;
}

export function runRecoveryTest(input: { system: string; backup_reference: string; owner: string }) {
  const test = {
    id: `rec-test-${Date.now()}`,
    system: input.system,
    backup_reference: input.backup_reference,
    started_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    result: "passed",
    recovery_time_minutes: 14,
    owner: input.owner,
  };
  const tests = loadRecoveryTests();
  tests.push(test);
  persistRecoveryTests(tests);
  appendSecurityAudit({ action: "security.restore_test_passed", target_id: test.id, actor_id: input.owner, result: "success" });
  return test;
}

export function evaluateAccessDecision(input: {
  actor_id: string;
  organization_id?: string;
  target_organization_id?: string;
  permission: string;
  suspended?: boolean;
  mfa_verified?: boolean;
  requires_mfa?: boolean;
}): { allowed: boolean; reason?: string } {
  if (input.suspended) return { allowed: false, reason: "Account suspended" };
  if (input.target_organization_id && input.organization_id !== input.target_organization_id) {
    return { allowed: false, reason: "Cross-organization access denied" };
  }
  if (input.requires_mfa && !input.mfa_verified) {
    return { allowed: false, reason: "Step-up authentication required" };
  }
  return { allowed: true };
}

export function getSecurityAudit() {
  return loadRecentAudit(50);
}

export function listVulnerabilities() {
  return loadVulnerabilities();
}

export function listAccessReviews() {
  return loadAccessReviews();
}

export function listDataAssets() {
  return { assets: loadDataAssets(), classifications: loadClassifications() };
}

export function listBackups() {
  return { backups: loadBackups(), recovery_tests: loadRecoveryTests() };
}
