import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  Mission,
  MissionAnalytics,
  MissionDashboard,
  MissionTemplate,
  PriorityLabel,
  PrioritySignals,
} from "./types";

const DATA = join(process.cwd(), "data", "missions");
const MISSIONS_PATH = join(DATA, "missions.json");

let cache: Mission[] | null = null;

type WeightConfig = {
  campaignImpact: number;
  urgency: number;
  deadline: number;
  dependencies: number;
  countyNeed: number;
  leadershipPriority: number;
  resourceAvailability: number;
};

function loadWeights(): WeightConfig {
  const raw = JSON.parse(readFileSync(join(DATA, "scoring_weights.json"), "utf8"));
  return raw.weights;
}

function computePriority(signals: PrioritySignals): number {
  const w = loadWeights();
  const score =
    signals.campaignImpact * w.campaignImpact +
    signals.urgency * w.urgency +
    signals.deadline * w.deadline +
    signals.dependencies * w.dependencies +
    signals.countyNeed * w.countyNeed +
    signals.leadershipPriority * w.leadershipPriority +
    signals.resourceAvailability * w.resourceAvailability;
  return Math.round(score * 1000) / 1000;
}

function priorityLabel(score: number): PriorityLabel {
  if (score >= 0.85) return "Critical";
  if (score >= 0.7) return "High";
  if (score >= 0.5) return "Medium";
  return "Low";
}

function enrichMission(raw: Omit<Mission, "priority"> & { priority?: number }): Mission {
  const priority = computePriority(raw.prioritySignals);
  return { ...raw, priority, priorityLabel: priorityLabel(priority) };
}

function loadRawMissions(): Mission[] {
  const data = JSON.parse(readFileSync(MISSIONS_PATH, "utf8"));
  return (data.missions as Omit<Mission, "priority">[]).map(enrichMission);
}

function persistMissions(missions: Mission[]) {
  writeFileSync(MISSIONS_PATH, JSON.stringify({ missions }, null, 2));
  cache = missions;
}

function getMissions(): Mission[] {
  if (!cache) cache = loadRawMissions();
  return cache.map(enrichMission);
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date("2026-07-10T21:00:00Z");
  return d.toDateString() === now.toDateString();
}

function isDueSoon(iso: string, days = 3): boolean {
  const d = new Date(iso).getTime();
  const now = new Date("2026-07-10T21:00:00Z").getTime();
  return d > now && d - now <= days * 86400000;
}

export function listMissions(filters?: {
  scope?: string;
  status?: string;
  county?: string;
  limit?: number;
}): Mission[] {
  let results = getMissions().sort((a, b) => b.priority - a.priority);
  if (filters?.scope) results = results.filter((m) => m.scope === filters.scope);
  if (filters?.status) results = results.filter((m) => m.status === filters.status);
  if (filters?.county) results = results.filter((m) => m.county === filters.county);
  if (filters?.limit) results = results.slice(0, filters.limit);
  return results;
}

export function getMission(id: string): Mission | null {
  return getMissions().find((m) => m.id === id) ?? null;
}

export function getTodaysMissions(): Mission[] {
  return getMissions().filter(
    (m) =>
      m.status !== "completed" &&
      m.status !== "archived" &&
      (isToday(m.dueAt) || m.status === "in_progress" || m.status === "assigned")
  );
}

export function getAssignedMissions(owner?: string): Mission[] {
  const missions = getMissions().filter(
    (m) => m.status === "assigned" || m.status === "accepted" || m.status === "in_progress"
  );
  if (owner) return missions.filter((m) => m.owner === owner);
  return missions;
}

export function getRecommendedMissions(): Mission[] {
  return getMissions()
    .filter((m) => m.source === "recommendation" || m.source === "analytics" || m.source === "ai")
    .filter((m) => m.status !== "completed" && m.status !== "archived")
    .sort((a, b) => b.priority - a.priority);
}

export function getDashboard(): MissionDashboard {
  const missions = getMissions();
  const active = missions.filter((m) => m.status !== "completed" && m.status !== "archived");
  const avgHealth = Math.round(active.reduce((s, m) => s + m.healthPercent, 0) / (active.length || 1));
  return {
    todaysMissions: getTodaysMissions().length,
    highPriority: active.filter((m) => m.priorityLabel === "High" || m.priorityLabel === "Critical").length,
    waiting: missions.filter((m) => m.status === "waiting" || m.status === "blocked").length,
    completedToday: missions.filter((m) => m.status === "completed" && isToday(m.updatedAt)).length,
    upcomingDeadlines: active.filter((m) => isDueSoon(m.dueAt)).length,
    missionHealthPercent: avgHealth,
  };
}

export function listTemplates(): MissionTemplate[] {
  const raw = JSON.parse(readFileSync(join(DATA, "templates.json"), "utf8"));
  return raw.templates;
}

export function createMission(partial: {
  title: string;
  type: Mission["type"];
  scope: Mission["scope"];
  purpose: string;
  owner: string;
  county?: string;
  templateId?: string;
  source?: Mission["source"];
}): Mission {
  const templates = listTemplates();
  const template = partial.templateId ? templates.find((t) => t.id === partial.templateId) : null;
  const now = new Date().toISOString();
  const id = `mbd-${Date.now()}`;
  const mission = enrichMission({
    id,
    title: partial.title,
    type: partial.type,
    scope: partial.scope,
    purpose: partial.purpose,
    successCriteria: "Define success criteria",
    priorityLabel: "Medium",
    impact: "Medium",
    impactStars: 3,
    owner: partial.owner,
    contributors: [],
    county: partial.county ?? null,
    organization: null,
    estimatedHours: template?.estimatedHours ?? 2,
    dueAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    progressPercent: 0,
    status: "created",
    source: partial.source ?? "manual",
    healthPercent: 100,
    risk: "Low",
    checklist: (template?.checklist ?? []).map((label, i) => ({
      id: `c${i + 1}`,
      label,
      done: false,
    })),
    dependencies: [],
    prioritySignals: {
      campaignImpact: 0.5,
      urgency: 0.5,
      deadline: 0.5,
      dependencies: 1.0,
      countyNeed: 0.5,
      leadershipPriority: 0.5,
      resourceAvailability: 1.0,
    },
    timeline: [{ event: "Created", at: now }],
    createdAt: now,
    updatedAt: now,
  });
  const missions = getMissions();
  missions.push(mission);
  persistMissions(missions);
  return mission;
}

export function updateMission(
  id: string,
  patch: Partial<Pick<Mission, "status" | "progressPercent" | "owner" | "healthPercent">>
): Mission | null {
  const missions = getMissions();
  const idx = missions.findIndex((m) => m.id === id);
  if (idx < 0) return null;
  const now = new Date().toISOString();
  const updated = enrichMission({
    ...missions[idx],
    ...patch,
    updatedAt: now,
    timeline: [...missions[idx].timeline, { event: `Updated — ${Object.keys(patch).join(", ")}`, at: now }],
  });
  missions[idx] = updated;
  persistMissions(missions);
  return updated;
}

export function assignMission(id: string, owner: string): Mission | null {
  const missions = getMissions();
  const idx = missions.findIndex((m) => m.id === id);
  if (idx < 0) return null;
  const now = new Date().toISOString();
  const updated = enrichMission({
    ...missions[idx],
    owner,
    status: "assigned",
    updatedAt: now,
    timeline: [...missions[idx].timeline, { event: `Assigned to ${owner}`, at: now }],
  });
  missions[idx] = updated;
  persistMissions(missions);
  return updated;
}

export function completeMission(id: string): Mission | null {
  const missions = getMissions();
  const idx = missions.findIndex((m) => m.id === id);
  if (idx < 0) return null;
  const now = new Date().toISOString();
  const updated = enrichMission({
    ...missions[idx],
    status: "completed",
    progressPercent: 100,
    healthPercent: 100,
    updatedAt: now,
    timeline: [...missions[idx].timeline, { event: "Completed", at: now }],
  });
  missions[idx] = updated;
  persistMissions(missions);
  return updated;
}

export function getMissionTimeline(id: string) {
  const mission = getMission(id);
  if (!mission) return null;
  return { missionId: id, title: mission.title, timeline: mission.timeline };
}

export function getMissionAnalytics(id?: string): MissionAnalytics {
  const missions = id ? [getMission(id)].filter(Boolean) as Mission[] : getMissions();
  const completed = missions.filter((m) => m.status === "completed");
  const inProgress = missions.filter((m) => m.status === "in_progress");
  const blocked = missions.filter((m) => m.status === "blocked" || m.status === "waiting");
  const overdue = missions.filter(
    (m) =>
      m.status !== "completed" &&
      m.status !== "archived" &&
      new Date(m.dueAt).getTime() < new Date("2026-07-10T21:00:00Z").getTime()
  );
  return {
    completionRatePercent: Math.round((completed.length / (missions.length || 1)) * 100),
    averageDurationDays: 2.6,
    blockedCount: blocked.length,
    inProgressCount: inProgress.length,
    overdueCount: overdue.length,
    templateEffectiveness: {
      "Volunteer Recruitment Drive": 0.94,
      "Town Hall": 0.88,
      Canvass: 0.91,
    },
  };
}
