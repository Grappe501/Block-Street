import { loadInitiatives } from "./data";
import type { Initiative } from "./types";

export function listInitiatives(filters?: { institution_id?: string; status?: string }) {
  let items = loadInitiatives();
  if (filters?.institution_id) items = items.filter((i) => i.institution_id === filters.institution_id);
  if (filters?.status) items = items.filter((i) => i.status === filters.status);
  return items;
}

export function getInitiative(id: string): Initiative | null {
  return loadInitiatives().find((i) => i.id === id) ?? null;
}

export function getInitiativeOverview(id: string) {
  const initiative = getInitiative(id);
  if (!initiative) return null;

  const { loadObjectives, loadWorkstreams, loadExecutionMissions, loadOperationalRisks, loadOperationalDecisions, loadAdaptations } = require("./data") as typeof import("./data");

  const objectives = loadObjectives().filter((o) => o.initiative_id === id);
  const workstreams = loadWorkstreams().filter((w) => w.initiative_id === id);
  const missions = loadExecutionMissions().filter((m) => m.initiative_id === id);
  const risks = loadOperationalRisks().filter((r) => r.initiative_id === id);
  const decisions = loadOperationalDecisions().filter((d) => d.initiative_id === id);
  const adaptations = loadAdaptations().filter((a) => a.initiative_id === id);

  return {
    initiative,
    objectives,
    workstreams,
    missions,
    mission_stats: {
      total: missions.length,
      completed: missions.filter((m) => m.status === "completed").length,
      blocked: missions.filter((m) => m.status === "blocked").length,
      in_progress: missions.filter((m) => m.status === "in_progress").length,
    },
    risks,
    pending_decisions: decisions.filter((d) => d.status === "pending"),
    adaptations,
  };
}
