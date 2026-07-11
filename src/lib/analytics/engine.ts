import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type {
  AnalyticsAlert,
  CountyAnalytics,
  DrillDownNode,
  ExecutiveDashboard,
  Forecast,
  KpiDefinition,
  MissionAnalytics,
  WarehouseEvent,
} from "./types";

const DATA = join(process.cwd(), "data", "analytics");

let countyCache: CountyAnalytics[] | null = null;
let eventsCache: WarehouseEvent[] | null = null;

function loadCounties(): CountyAnalytics[] {
  if (countyCache) return countyCache;
  countyCache = JSON.parse(readFileSync(join(DATA, "county_snapshots.json"), "utf8")) as CountyAnalytics[];
  return countyCache;
}

function loadKpis(): KpiDefinition[] {
  const raw = JSON.parse(readFileSync(join(DATA, "kpi_library.json"), "utf8"));
  const dashboard = getExecutiveDashboard();
  const values: Record<string, number> = {
    "kpi-campaign-health": dashboard.campaignHealthPercent,
    "kpi-volunteer-retention": 0.72,
    "kpi-county-coverage": dashboard.countyCoverage.active,
    "kpi-mission-completion": dashboard.missionCompletionPercent / 100,
    "kpi-registration-goal": dashboard.registrationGoalPercent / 100,
    "kpi-petition-progress": dashboard.petitionProgressPercent / 100,
  };
  return (raw.kpis as KpiDefinition[]).map((k) => ({
    ...k,
    currentValue: values[k.id] ?? 0,
  }));
}

function loadEvents(): WarehouseEvent[] {
  if (eventsCache) return eventsCache;
  const path = join(DATA, "warehouse_events.jsonl");
  if (!existsSync(path)) return [];
  eventsCache = readFileSync(path, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => JSON.parse(l) as WarehouseEvent);
  return eventsCache ?? [];
}

export function getExecutiveDashboard(): ExecutiveDashboard {
  const counties = loadCounties();
  const avgHealth = Math.round(counties.reduce((s, c) => s + c.healthPercent, 0) / counties.length);
  const components = [
    { id: "volunteer", name: "Volunteer Health", score: 88, trend: "+14%", weight: 0.15 },
    { id: "leadership", name: "Leadership Health", score: 84, trend: "+6%", weight: 0.12 },
    { id: "county", name: "County Health", score: avgHealth, trend: "+8%", weight: 0.15 },
    { id: "organization", name: "Organization Growth", score: 86, trend: "+18%", weight: 0.12 },
    { id: "mission", name: "Mission Completion", score: 91, trend: "+3%", weight: 0.13 },
    { id: "communications", name: "Communications", score: 79, trend: "+5%", weight: 0.1 },
    { id: "financial", name: "Financial Stability", score: 82, trend: "stable", weight: 0.13 },
    { id: "momentum", name: "Momentum", score: 87, trend: "up", weight: 0.1 },
  ];
  const weighted = components.reduce((s, c) => s + c.score * c.weight, 0);
  return {
    campaignHealthPercent: Math.round(weighted),
    healthComponents: components,
    volunteerGrowthPercent: 14,
    countyCoverage: { active: 68, total: 75 },
    organizations: 1384,
    leaders: 542,
    upcomingEvents: 84,
    missionCompletionPercent: 91,
    registrationGoalPercent: 74,
    petitionProgressPercent: 81,
    newContacts: 2814,
    calculatedAt: new Date().toISOString(),
  };
}

export function listCounties(): CountyAnalytics[] {
  return loadCounties();
}

export function getCounty(slug: string): CountyAnalytics | null {
  return loadCounties().find((c) => c.slug === slug) ?? null;
}

export function listKpis(): KpiDefinition[] {
  return loadKpis();
}

export function getForecasts(): Forecast[] {
  return [
    {
      id: "forecast-volunteers",
      name: "Volunteer Goal",
      target: 10000,
      current: 7814,
      progressPercent: 78,
      forecastDate: "2026-10-12",
      confidencePercent: 88,
      contributingFactors: ["Washington +14% growth", "Benton recruitment mission", "Orientation completions up"],
    },
    {
      id: "forecast-petition",
      name: "Petition Completion",
      target: 100000,
      current: 81000,
      progressPercent: 81,
      forecastDate: "2026-09-28",
      confidencePercent: 85,
      contributingFactors: ["Pulaski strong signature rate", "Weekend canvass events", "College campus drives"],
    },
    {
      id: "forecast-county-ready",
      name: "County Readiness",
      target: 75,
      current: 68,
      progressPercent: 91,
      forecastDate: "2026-08-15",
      confidencePercent: 82,
      contributingFactors: ["Craighead needs support", "4 counties below threshold", "Leadership training pipeline"],
    },
  ];
}

export function getAlerts(): AnalyticsAlert[] {
  return [
    {
      id: "alert-craighead-inactive",
      severity: "warning",
      title: "Craighead County inactivity",
      message: "Volunteer growth flat 30 days · leadership needs support",
      county: "Craighead County",
      category: "county",
      detectedAt: "2026-07-10T12:00:00Z",
      feedsRecommendation: true,
    },
    {
      id: "alert-mission-overdue",
      severity: "warning",
      title: "12 missions overdue",
      message: "Mission completion rate still 94% but overdue count rising",
      category: "mission",
      detectedAt: "2026-07-10T11:00:00Z",
      feedsRecommendation: true,
    },
    {
      id: "alert-leadership-vacancy",
      severity: "info",
      title: "Three county chairs missed check-in",
      message: "Washington, Garland, Jefferson — 7+ days",
      category: "leadership",
      detectedAt: "2026-07-10T10:00:00Z",
      feedsRecommendation: true,
    },
  ];
}

export function getMissionAnalytics(): MissionAnalytics {
  return {
    completed: 184,
    inProgress: 31,
    overdue: 12,
    successRatePercent: 94,
    averageCompletionDays: 2.6,
  };
}

export function getDrillDown(): DrillDownNode {
  const dashboard = getExecutiveDashboard();
  return {
    id: "campaign-health",
    label: "Campaign Health",
    value: `${dashboard.campaignHealthPercent}%`,
    children: [
      {
        id: "volunteer-growth",
        label: "Volunteer Growth",
        value: `+${dashboard.volunteerGrowthPercent}%`,
        children: [
          {
            id: "washington",
            label: "Washington County",
            value: "91% health",
            children: [{ id: "leaders", label: "Volunteer Leaders", value: "24 active" }],
          },
        ],
      },
    ],
  };
}

export function getWarehouseStats() {
  const events = loadEvents();
  const byType: Record<string, number> = {};
  for (const e of events) {
    byType[e.event_type] = (byType[e.event_type] || 0) + 1;
  }
  return {
    eventCount: events.length,
    eventsByType: byType,
    appendOnly: true,
    lastEventAt: events[events.length - 1]?.timestamp ?? null,
  };
}
