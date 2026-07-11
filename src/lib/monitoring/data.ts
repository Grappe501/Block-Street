import { readFileSync, writeFileSync, appendFileSync } from "fs";
import { join } from "path";
import type {
  BusinessMetric,
  DependencyHealth,
  DeploymentMarker,
  HealthStatus,
  MetricDefinition,
  MetricValue,
  MonitoringAlert,
  MonitoringFeatureFlags,
  OperationalRecommendation,
  TraceSpan,
} from "./types";

export const MON_DATA = join(process.cwd(), "data", "monitoring");

const cache = new Map<string, unknown>();

function readJson<T>(file: string, key: string): T[] {
  const ck = `${file}:${key}`;
  if (cache.has(ck)) return cache.get(ck) as T[];
  const raw = JSON.parse(readFileSync(join(MON_DATA, file), "utf8"));
  const items = raw[key] as T[];
  cache.set(ck, items);
  return items;
}

function readObject<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(MON_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

function writeJson<T>(file: string, key: string, items: T[]) {
  writeFileSync(join(MON_DATA, file), JSON.stringify({ [key]: items }, null, 2));
  cache.clear();
}

export function loadMetricDefinitions(): MetricDefinition[] {
  return readJson<MetricDefinition>("metric_definitions.json", "definitions");
}

export function loadMetricValues(): MetricValue[] {
  return readJson<MetricValue>("metric_values.json", "values");
}

export function loadHealthStatuses(): HealthStatus[] {
  return readJson<HealthStatus>("health_status.json", "statuses");
}

export function loadAlerts(): MonitoringAlert[] {
  return readJson<MonitoringAlert>("alerts.json", "alerts");
}

export function persistAlerts(items: MonitoringAlert[]) {
  writeJson("alerts.json", "alerts", items);
}

export function loadDependencies(): DependencyHealth[] {
  return readJson<DependencyHealth>("dependencies.json", "dependencies");
}

export function loadDeploymentMarkers(): DeploymentMarker[] {
  return readJson<DeploymentMarker>("deployment_markers.json", "markers");
}

export function persistDeploymentMarkers(items: DeploymentMarker[]) {
  writeJson("deployment_markers.json", "markers", items);
}

export function loadBusinessMetrics(): BusinessMetric[] {
  return readJson<BusinessMetric>("business_metrics.json", "metrics");
}

export function loadRecommendations(): OperationalRecommendation[] {
  return readJson<OperationalRecommendation>("recommendations.json", "recommendations");
}

export function persistRecommendations(items: OperationalRecommendation[]) {
  writeJson("recommendations.json", "recommendations", items);
}

export function loadTraces(): TraceSpan[] {
  return readJson<TraceSpan>("traces.json", "spans");
}

export function loadDashboards() {
  return readObject<{ dashboards: Record<string, unknown>[] }>("dashboards.json").dashboards;
}

export function loadFeatureFlags(): MonitoringFeatureFlags {
  return readObject<MonitoringFeatureFlags>("feature_flags.json");
}

export function appendMonitoringEvent(event: Record<string, unknown>) {
  appendFileSync(join(MON_DATA, "events.jsonl"), `${JSON.stringify({ ...event, timestamp: new Date().toISOString() })}\n`);
}

export function loadRecentEvents(limit = 50): Record<string, unknown>[] {
  try {
    const lines = readFileSync(join(MON_DATA, "events.jsonl"), "utf8").trim().split("\n");
    return lines.slice(-limit).map((l) => JSON.parse(l) as Record<string, unknown>).reverse();
  } catch {
    return [];
  }
}
