export type HealthState = "healthy" | "degraded" | "warning" | "maintenance" | "unavailable" | "recovering" | "unknown";
export type AlertSeverity = "info" | "warning" | "high" | "critical";
export type AlertStatus = "detected" | "validated" | "grouped" | "assigned" | "acknowledged" | "investigating" | "resolved" | "closed";

export interface MetricDefinition {
  id: string;
  metric_key: string;
  name: string;
  description: string;
  owner: string;
  category: string;
  unit: string;
  aggregation: string;
  retention: string;
  alert_policy?: string;
  dashboard_group: string;
}

export interface MetricValue {
  metric_key: string;
  value: number;
  recorded_at: string;
  labels?: Record<string, string>;
}

export interface HealthStatus {
  id: string;
  level: "platform" | "application" | "service" | "module" | "dependency";
  name: string;
  state: HealthState;
  score: number;
  message?: string;
  updated_at: string;
}

export interface MonitoringAlert {
  id: string;
  type: string;
  severity: AlertSeverity;
  status: AlertStatus;
  owner?: string;
  service: string;
  started_at: string;
  resolved_at?: string;
  correlation_id?: string;
  recommended_action: string;
  incident_id?: string;
  grouped_count?: number;
}

export interface DependencyHealth {
  id: string;
  name: string;
  provider: string;
  state: HealthState;
  latency_ms?: number;
  last_checked_at: string;
}

export interface DeploymentMarker {
  id: string;
  release_version: string;
  commit_sha: string;
  deployed_at: string;
  risk_level: string;
  services: string[];
}

export interface BusinessMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  period: string;
}

export interface OperationalRecommendation {
  id: string;
  title: string;
  summary: string;
  confidence: number;
  related_alerts: string[];
  related_release?: string;
  recommended_action: string;
  created_at: string;
}

export interface DashboardSummary {
  id: string;
  name: string;
  audience: string;
  widgets: { label: string; value: string | number; status?: HealthState }[];
}

export interface TraceSpan {
  trace_id: string;
  span_id: string;
  parent_span_id?: string;
  service: string;
  operation: string;
  duration_ms: number;
  status: "ok" | "error";
  correlation_id: string;
  started_at: string;
}

export interface MonitoringOverview {
  platform_health_score: number;
  platform_state: HealthState;
  active_alerts: number;
  critical_alerts: number;
  open_incidents: number;
  services_healthy: number;
  services_total: number;
  error_rate_percent: number;
  p95_latency_ms: number;
  active_users_today: number;
  missions_completed_today: number;
  deployment_version: string;
  last_deployment_at?: string;
}

export interface MonitoringFeatureFlags {
  MONITORING_ENABLED: boolean;
  TRACING_ENABLED: boolean;
  STRUCTURED_LOGGING_ENABLED: boolean;
  AI_MONITORING_ENABLED: boolean;
  DEPLOYMENT_MARKERS_ENABLED: boolean;
  BUSINESS_METRICS_ENABLED: boolean;
  SELF_DIAGNOSIS_ENABLED: boolean;
}
