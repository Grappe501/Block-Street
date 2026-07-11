import {
  loadAlerts,
  loadBusinessMetrics,
  loadDashboards,
  loadDependencies,
  loadDeploymentMarkers,
  loadFeatureFlags,
  loadHealthStatuses,
  loadMetricDefinitions,
  loadMetricValues,
  loadRecentEvents,
  loadRecommendations,
  loadTraces,
  persistAlerts,
  persistDeploymentMarkers,
  persistRecommendations,
  appendMonitoringEvent,
} from "./data";
import type {
  DashboardSummary,
  HealthState,
  MonitoringAlert,
  MonitoringOverview,
  OperationalRecommendation,
} from "./types";

function computePlatformHealthScore(statuses: { state: HealthState; score: number }[]): number {
  if (!statuses.length) return 100;
  const total = statuses.reduce((sum, s) => sum + s.score, 0);
  return Math.round(total / statuses.length);
}

function stateFromScore(score: number): HealthState {
  if (score >= 95) return "healthy";
  if (score >= 85) return "degraded";
  if (score >= 70) return "warning";
  return "unavailable";
}

export function getMonitoringOverview(): MonitoringOverview {
  const health = loadHealthStatuses();
  const platform = health.find((h) => h.level === "platform");
  const alerts = loadAlerts().filter((a) => !["resolved", "closed"].includes(a.status));
  const critical = alerts.filter((a) => a.severity === "critical" || a.severity === "high");
  const services = health.filter((h) => h.level === "service");
  const markers = loadDeploymentMarkers();
  const latest = markers[markers.length - 1];
  const errorMetric = loadMetricValues().find((m) => m.metric_key === "api.error_rate");
  const latencyMetric = loadMetricValues().find((m) => m.metric_key === "api.p95_latency_ms");
  const dau = loadBusinessMetrics().find((m) => m.id === "biz-dau");
  const missions = loadBusinessMetrics().find((m) => m.id === "biz-missions-completed");

  const score = platform?.score ?? computePlatformHealthScore(health);
  return {
    platform_health_score: score,
    platform_state: platform?.state ?? stateFromScore(score),
    active_alerts: alerts.length,
    critical_alerts: critical.length,
    open_incidents: alerts.filter((a) => a.incident_id).length,
    services_healthy: services.filter((s) => s.state === "healthy").length,
    services_total: services.length,
    error_rate_percent: errorMetric?.value ?? 0.4,
    p95_latency_ms: latencyMetric?.value ?? 142,
    active_users_today: dau?.value ?? 0,
    missions_completed_today: missions?.value ?? 0,
    deployment_version: latest?.release_version ?? "unknown",
    last_deployment_at: latest?.deployed_at,
  };
}

export function getPlatformHealth() {
  const overview = getMonitoringOverview();
  const statuses = loadHealthStatuses();
  const dependencies = loadDependencies();
  return {
    score: overview.platform_health_score,
    state: overview.platform_state,
    statuses,
    dependencies,
    updated_at: new Date().toISOString(),
  };
}

export function listServices() {
  return {
    services: loadHealthStatuses().filter((h) => h.level === "service"),
    dependencies: loadDependencies(),
  };
}

export function listAlerts(filters?: { status?: string; severity?: string }) {
  let alerts = loadAlerts();
  if (filters?.status) alerts = alerts.filter((a) => a.status === filters.status);
  if (filters?.severity) alerts = alerts.filter((a) => a.severity === filters.severity);
  return alerts.sort((a, b) => b.started_at.localeCompare(a.started_at));
}

export function listMetrics() {
  return {
    definitions: loadMetricDefinitions(),
    recent_values: loadMetricValues().slice(-50),
  };
}

export function listReleases() {
  return {
    deployment_markers: loadDeploymentMarkers(),
    related_alerts: loadAlerts().filter((a) => a.type.includes("deployment")),
  };
}

export function getDashboards(): DashboardSummary[] {
  const overview = getMonitoringOverview();
  const dashboards = loadDashboards() as unknown as DashboardSummary[];
  if (dashboards.length) return dashboards;

  return [
    {
      id: "dash-executive",
      name: "Executive",
      audience: "leadership",
      widgets: [
        { label: "Platform Health", value: `${overview.platform_health_score}%`, status: overview.platform_state },
        { label: "Active Users", value: overview.active_users_today },
        { label: "Open Alerts", value: overview.active_alerts, status: overview.critical_alerts ? "warning" : "healthy" },
        { label: "Missions Today", value: overview.missions_completed_today },
      ],
    },
    {
      id: "dash-engineering",
      name: "Engineering",
      audience: "engineering",
      widgets: [
        { label: "Error Rate", value: `${overview.error_rate_percent}%` },
        { label: "P95 Latency", value: `${overview.p95_latency_ms} ms` },
        { label: "Services Healthy", value: `${overview.services_healthy}/${overview.services_total}` },
        { label: "Release", value: overview.deployment_version },
      ],
    },
  ];
}

export function getTraces(correlationId?: string) {
  const spans = loadTraces();
  if (correlationId) return spans.filter((s) => s.correlation_id === correlationId);
  return spans.slice(-20);
}

export function recordDeploymentMarker(input: {
  release_version: string;
  commit_sha: string;
  risk_level: string;
  services: string[];
}) {
  const flags = loadFeatureFlags();
  if (!flags.DEPLOYMENT_MARKERS_ENABLED) return null;

  const marker = {
    id: `dep-marker-${Date.now()}`,
    release_version: input.release_version,
    commit_sha: input.commit_sha,
    deployed_at: new Date().toISOString(),
    risk_level: input.risk_level,
    services: input.services,
  };
  const markers = loadDeploymentMarkers();
  markers.push(marker);
  persistDeploymentMarkers(markers);

  appendMonitoringEvent({
    event_type: "deployment.detected",
    release_version: input.release_version,
    commit_sha: input.commit_sha,
    correlation_id: marker.id,
  });

  return marker;
}

export function createAlert(input: {
  type: string;
  severity: MonitoringAlert["severity"];
  service: string;
  recommended_action: string;
  correlation_id?: string;
}): MonitoringAlert {
  const flags = loadFeatureFlags();
  if (!flags.MONITORING_ENABLED) throw new Error("Monitoring is not enabled.");

  const existing = loadAlerts().find(
    (a) =>
      a.type === input.type &&
      a.service === input.service &&
      !["resolved", "closed"].includes(a.status)
  );

  if (existing) {
    existing.grouped_count = (existing.grouped_count ?? 1) + 1;
    existing.status = "grouped";
    persistAlerts(loadAlerts().map((a) => (a.id === existing.id ? existing : a)));
    appendMonitoringEvent({ event_type: "alert.grouped", alert_id: existing.id, correlation_id: input.correlation_id });
    return existing;
  }

  const alert: MonitoringAlert = {
    id: `alert-${Date.now()}`,
    type: input.type,
    severity: input.severity,
    status: "detected",
    service: input.service,
    started_at: new Date().toISOString(),
    correlation_id: input.correlation_id,
    recommended_action: input.recommended_action,
    grouped_count: 1,
  };

  const alerts = loadAlerts();
  alerts.push(alert);
  persistAlerts(alerts);

  appendMonitoringEvent({ event_type: "alert.created", alert_id: alert.id, severity: input.severity });

  if (input.severity === "critical") {
    alert.incident_id = `inc-mon-${Date.now()}`;
    alert.status = "assigned";
    persistAlerts(alerts.map((a) => (a.id === alert.id ? alert : a)));
    appendMonitoringEvent({ event_type: "incident.opened", incident_id: alert.incident_id, alert_id: alert.id });
  }

  return alert;
}

export function resolveAlert(alertId: string, actorId: string) {
  const alerts = loadAlerts();
  const alert = alerts.find((a) => a.id === alertId);
  if (!alert) throw new Error("Alert not found.");
  alert.status = "resolved";
  alert.resolved_at = new Date().toISOString();
  alert.owner = actorId;
  persistAlerts(alerts);

  appendMonitoringEvent({ event_type: "alert.resolved", alert_id: alertId, actor_id: actorId });
  if (alert.incident_id) {
    appendMonitoringEvent({ event_type: "incident.closed", incident_id: alert.incident_id });
  }
  return alert;
}

export function runSelfDiagnosis(): OperationalRecommendation[] {
  const flags = loadFeatureFlags();
  if (!flags.SELF_DIAGNOSIS_ENABLED) return [];

  const overview = getMonitoringOverview();
  const markers = loadDeploymentMarkers();
  const latestRelease = markers[markers.length - 1];
  const recommendations: OperationalRecommendation[] = [];

  if (overview.error_rate_percent > 1 && latestRelease) {
    recommendations.push({
      id: `rec-${Date.now()}`,
      title: "Error rate elevated after deployment",
      summary: `Error rate is ${overview.error_rate_percent}% following release ${latestRelease.release_version}. Most failures may correlate with recent deployment changes.`,
      confidence: 0.82,
      related_alerts: loadAlerts().filter((a) => !["resolved", "closed"].includes(a.status)).map((a) => a.id),
      related_release: latestRelease.release_version,
      recommended_action: "Review notification queue and deployment changes. Check dependency health for email and search providers.",
      created_at: new Date().toISOString(),
    });
  }

  const blockedQueue = loadDependencies().find((d) => d.name === "notification_queue" && d.state !== "healthy");
  if (blockedQueue) {
    recommendations.push({
      id: `rec-queue-${Date.now()}`,
      title: "Notification queue degraded",
      summary: "Notification delays rose. Queue depth may be blocking delivery.",
      confidence: 0.76,
      related_alerts: [],
      recommended_action: "Inspect notification queue, provider health, and quiet-hour backlog.",
      created_at: new Date().toISOString(),
    });
  }

  if (recommendations.length) {
    persistRecommendations([...loadRecommendations(), ...recommendations]);
  }
  return recommendations;
}

export function getOperationalIntelligence() {
  const recommendations = runSelfDiagnosis();
  const events = loadRecentEvents(30);
  return {
    overview: getMonitoringOverview(),
    recommendations: recommendations.length ? recommendations : loadRecommendations().slice(-5),
    recent_events: events,
    business_metrics: loadBusinessMetrics(),
  };
}
