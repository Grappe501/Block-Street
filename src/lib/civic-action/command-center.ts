import {
  loadAdaptations,
  loadExecutionMissions,
  loadInitiatives,
  loadObjectives,
  loadOperationalDecisions,
  loadOperationalEvents,
  loadOperationalIncidents,
  loadWorkstreams,
} from "./data";
import type { CommandCenterView } from "./types";

const NOW = new Date("2026-07-14T12:00:00Z");

function isToday(iso: string) {
  return new Date(iso).toDateString() === NOW.toDateString();
}

function isOverdue(iso: string) {
  return new Date(iso) < NOW;
}

export function getCommandCenterView(institutionId?: string): CommandCenterView {
  let initiatives = loadInitiatives().filter((i) => i.status === "active" || i.status === "at_risk");
  let missions = loadExecutionMissions();
  let events = loadOperationalEvents();
  let decisions = loadOperationalDecisions();
  let workstreams = loadWorkstreams();

  if (institutionId) {
    initiatives = initiatives.filter((i) => i.institution_id === institutionId);
    const initIds = new Set(initiatives.map((i) => i.id));
    missions = missions.filter((m) => initIds.has(m.initiative_id));
    events = events.filter((e) => e.institution_id === institutionId);
    decisions = decisions.filter((d) => d.institution_id === institutionId);
    workstreams = workstreams.filter((w) => initIds.has(w.initiative_id));
  }

  const blocked = missions.filter((m) => m.status === "blocked");
  const overdueDecisions = decisions.filter((d) => d.status === "pending" && isOverdue(d.due_at));
  const atRiskInitiatives = initiatives.filter((i) => i.status === "at_risk");
  const objectives = loadObjectives();

  return {
    today: {
      active_initiatives: initiatives.length,
      current_missions: missions.filter((m) => ["assigned", "accepted", "in_progress"].includes(m.status)).length,
      events_today: events.filter((e) => isToday(e.start_at)).length,
      pending_approvals: decisions.filter((d) => d.status === "pending").length,
      open_incidents: loadOperationalIncidents().filter((i) => i.status !== "resolved").length,
      blocked_missions: blocked.length,
    },
    at_risk: {
      blocked_missions: blocked,
      overdue_decisions: overdueDecisions,
      at_risk_initiatives: atRiskInitiatives,
      under_resourced: workstreams.filter((w) => w.status === "at_risk"),
    },
    outcomes: {
      objectives,
      on_track: objectives.filter((o) => o.status === "on_track" || o.status === "completed").length,
      at_risk: objectives.filter((o) => o.status === "at_risk" || o.status === "off_track").length,
    },
  };
}

export function getOperationsOverview(institutionId = "inst-block-street") {
  const cc = getCommandCenterView(institutionId);
  const adaptations = loadAdaptations();
  return {
    wave_id: "CAE-001",
    command_center: cc,
    recent_adaptations: adaptations.slice(-5),
    governing_principle: "Every action should have a clear purpose, an accountable Human, an authorized institution, a defined timeline, and a measurable result.",
  };
}
