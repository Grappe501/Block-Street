"use client";

import { useEffect, useState } from "react";
import caip from "../../../data/registry/campaign-analytics-intelligence-platform.json";
import type {
  AnalyticsAlert,
  CountyAnalytics,
  ExecutiveDashboard,
  Forecast,
  KpiDefinition,
  MissionAnalytics,
} from "@/lib/analytics/types";

export function AdminCampaignAnalyticsIntelligence() {
  const [dashboard, setDashboard] = useState<ExecutiveDashboard | null>(null);
  const [counties, setCounties] = useState<CountyAnalytics[]>([]);
  const [kpis, setKpis] = useState<KpiDefinition[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [alerts, setAlerts] = useState<AnalyticsAlert[]>([]);
  const [missions, setMissions] = useState<MissionAnalytics | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/analytics/dashboard").then((r) => r.json()),
      fetch("/api/analytics/counties").then((r) => r.json()),
      fetch("/api/analytics/kpis").then((r) => r.json()),
      fetch("/api/analytics/forecast").then((r) => r.json()),
      fetch("/api/analytics/alerts").then((r) => r.json()),
      fetch("/api/analytics/reports").then((r) => r.json()),
    ]).then(([dash, countyData, kpiData, forecastData, alertData, reportData]) => {
      setDashboard(dash.dashboard);
      setCounties(countyData.counties || []);
      setKpis(kpiData.kpis || []);
      setForecasts(forecastData.forecasts || []);
      setAlerts(alertData.alerts || []);
      setMissions(reportData.missions || null);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="card border-amber-400 bg-amber-100">
        <p className="text-xs font-semibold uppercase text-amber-900">BUILD 7.3 · Campaign Analytics & Intelligence Platform</p>
        <h2 className="mt-1 text-xl font-bold text-amber-950">{caip.productName}</h2>
        <p className="mt-2 text-sm text-amber-900">{caip.guidingPrinciple}</p>
        <p className="mt-2 text-xs font-semibold text-amber-800">
          {caip.requirementId} · {caip.acceptanceCriteria}
        </p>
      </div>

      {dashboard && (
        <div className="card border-amber-200 bg-amber-50/50">
          <h2 className="text-lg font-bold text-amber-950">Executive Dashboard</h2>
          <p className="mt-2 text-3xl font-bold text-amber-700">{dashboard.campaignHealthPercent}%</p>
          <p className="text-xs text-amber-800">Campaign Health</p>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 text-xs">
            <div><span className="font-bold text-amber-950">+{dashboard.volunteerGrowthPercent}%</span><p className="text-amber-700">Volunteer Growth</p></div>
            <div><span className="font-bold text-amber-950">{dashboard.countyCoverage.active}/{dashboard.countyCoverage.total}</span><p className="text-amber-700">County Coverage</p></div>
            <div><span className="font-bold text-amber-950">{dashboard.organizations}</span><p className="text-amber-700">Organizations</p></div>
            <div><span className="font-bold text-amber-950">{dashboard.leaders}</span><p className="text-amber-700">Leaders</p></div>
            <div><span className="font-bold text-amber-950">{dashboard.upcomingEvents}</span><p className="text-amber-700">Upcoming Events</p></div>
            <div><span className="font-bold text-amber-950">{dashboard.missionCompletionPercent}%</span><p className="text-amber-700">Mission Completion</p></div>
            <div><span className="font-bold text-amber-950">{dashboard.registrationGoalPercent}%</span><p className="text-amber-700">Registration Goal</p></div>
            <div><span className="font-bold text-amber-950">{dashboard.petitionProgressPercent}%</span><p className="text-amber-700">Petition Progress</p></div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-amber-900">Health Components (visible, no mystery score)</p>
            <div className="mt-2 grid gap-1 md:grid-cols-2">
              {dashboard.healthComponents.map((c) => (
                <div key={c.id} className="flex justify-between rounded bg-white px-2 py-1 text-xs text-amber-800">
                  <span>{c.name}</span>
                  <span className="font-bold">{c.score}% · {c.trend}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {missions && (
        <div className="card border-amber-200 bg-white">
          <h2 className="text-sm font-bold text-amber-950">Mission Analytics</h2>
          <div className="mt-2 grid grid-cols-5 gap-2 text-center text-xs">
            <div><p className="font-bold text-amber-950">{missions.completed}</p><p>Completed</p></div>
            <div><p className="font-bold text-amber-950">{missions.inProgress}</p><p>In Progress</p></div>
            <div><p className="font-bold text-amber-950">{missions.overdue}</p><p>Overdue</p></div>
            <div><p className="font-bold text-amber-950">{missions.successRatePercent}%</p><p>Success Rate</p></div>
            <div><p className="font-bold text-amber-950">{missions.averageCompletionDays}d</p><p>Avg Completion</p></div>
          </div>
        </div>
      )}

      <div className="card border-amber-200 bg-white">
        <h2 className="text-sm font-bold text-amber-950">County Analytics</h2>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          {counties.map((c) => (
            <div key={c.slug} className="rounded-lg border border-amber-100 p-2 text-xs text-amber-900">
              <p className="font-bold text-amber-950">{c.name}</p>
              <p>Health {c.healthPercent}% · Growth +{c.growthPercent}% · {c.leadership}</p>
              <p>Volunteers {c.volunteers} · Orgs {c.organizations} · Registration {c.registrationPercent}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-amber-200 bg-amber-50/50">
        <h2 className="text-sm font-bold text-amber-950">Predictive Forecasts</h2>
        <div className="mt-2 space-y-2">
          {forecasts.map((f) => (
            <div key={f.id} className="rounded-lg border border-amber-100 bg-white p-2 text-xs">
              <p className="font-bold text-amber-950">{f.name}</p>
              <p>{f.current.toLocaleString()} / {f.target.toLocaleString()} ({f.progressPercent}%) · Forecast {f.forecastDate}</p>
              <p className="text-amber-700">Confidence {f.confidencePercent}%</p>
              <ul className="mt-1 list-inside list-disc text-amber-600">
                {f.contributingFactors.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-amber-200 bg-white">
        <h2 className="text-sm font-bold text-amber-950">Alert Engine → RIE / Mission Board</h2>
        <ul className="mt-2 space-y-1 text-xs text-amber-900">
          {alerts.map((a) => (
            <li key={a.id} className={`rounded px-2 py-1 ${a.severity === "critical" ? "bg-red-100" : a.severity === "warning" ? "bg-amber-100" : "bg-slate-100"}`}>
              <span className="font-bold">{a.title}</span> — {a.message}
              {a.feedsRecommendation && <span className="ml-1 text-amber-600">→ feeds recommendations</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="card border-amber-200 bg-white">
        <h2 className="text-sm font-bold text-amber-950">KPI Library</h2>
        <div className="mt-2 space-y-2">
          {kpis.map((k) => (
            <div key={k.id} className="rounded border border-amber-100 p-2 text-xs">
              <p className="font-bold text-amber-950">{k.name}</p>
              <p className="text-amber-800">{k.definition}</p>
              <p className="font-mono text-amber-600">{k.formula}</p>
              <p>Owner: {k.owner} · Refresh: {k.refreshRate} · Current: {String(k.currentValue)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
