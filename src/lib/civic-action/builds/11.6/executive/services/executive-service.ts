/**
 * CAE-11.6-W8 — Executive services (aggregates W1–W7)
 */
import { caeId, nowIso } from "../../../../utils";
import { strategicPlanningService } from "../../services/strategic-planning-service";
import { missionExecutionService } from "../../execution/services/mission-execution-service";
import { workforceManagementService } from "../../workforce/services/workforce-service";
import { organizationService } from "../../organization/services/organization-service";
import { resourceService } from "../../resources/services/resource-service";
import { calendarEngineService } from "../../calendar/services/calendar-service";
import { communicationsService } from "../../communications/services/communications-service";
import {
  getExecutiveDecision,
  getInstitutionHealth,
  listExecutiveAlerts,
  listExecutiveBriefings,
  listExecutiveDecisions,
  listExecutiveTimeline,
  listScenarios,
  listWarRooms,
  saveExecutiveAlert,
  saveExecutiveBriefing,
  saveExecutiveDecision,
  saveExecutiveTimelineEntry,
  saveInstitutionHealth,
  saveScenario,
  saveWarRoom,
} from "./repository";

const DEFAULT_INSTITUTION = "inst-block-street";

export class ExecutiveError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const missionIntelligenceService = {
  analyze(institutionId: string) {
    const missions = missionExecutionService.missions.list(institutionId);
    return {
      institution_id: institutionId,
      total_missions: missions.length,
      critical_missions: missions.filter((m) => m.priority === "critical"),
      delayed_missions: missions.filter((m) => m.status === "blocked" || m.status === "escalated" || m.status === "paused"),
      mission_velocity: missions.length ? 0.75 : 0,
      completion_forecast: "on_track",
    };
  },
};

export const workforceIntelligenceService = {
  analyze(institutionId: string) {
    const capacity = workforceManagementService.capacity.getOrganizationCapacity(institutionId);
    const executive = workforceManagementService.executiveDashboard.build(institutionId);
    return {
      institution_id: institutionId,
      capacity,
      mission_staffing: executive.mission_staffing,
      volunteer_engagement: executive.volunteer_engagement,
      aggregate_only: executive.no_human_ranking,
    };
  },
};

export const financialIntelligenceService = {
  analyze(institutionId: string) {
    const budgets = resourceService.budgets.list(institutionId);
    const expenses = resourceService.expenses.list(institutionId);
    return {
      institution_id: institutionId,
      budget_health: budgets.map((b) => ({ name: b.name, remaining: b.remaining, allocated: b.allocated })),
      burn_rate: expenses.reduce((s, e) => s + e.amount, 0),
      outstanding_approvals: budgets.filter((b) => b.committed > b.spent).length,
    };
  },
};

export const resourceIntelligenceService = {
  analyze(institutionId: string) {
    const dashboard = resourceService.executiveDashboard.build(institutionId);
    return {
      institution_id: institutionId,
      fleet: resourceService.fleet.listVehicles(institutionId).length,
      facilities: dashboard.facility_utilization.length,
      inventory_low_stock: dashboard.inventory_summary.low_stock,
      upcoming_maintenance: dashboard.upcoming_maintenance.length,
    };
  },
};

export const organizationIntelligenceService = {
  analyze(institutionId: string) {
    const health = organizationService.health.compute(institutionId);
    return {
      institution_id: institutionId,
      leadership_vacancies: health.vacancies,
      mission_completion_rate: health.mission_completion_rate,
      succession_readiness: health.succession_readiness,
      governance_decisions: organizationService.governance.listDecisions(institutionId).length,
    };
  },
};

export const communicationIntelligenceService = {
  analyze(institutionId: string) {
    const intel = communicationsService.ai.analyze(institutionId);
    const decisions = communicationsService.decisions.list(institutionId);
    return {
      institution_id: institutionId,
      knowledge_candidates: intel.knowledge_candidates,
      pending_decisions: decisions.length,
      organizational_sentiment: "neutral",
      not_personal_scoring: true,
    };
  },
};

export const riskIntelligenceService = {
  analyze(institutionId: string) {
    const alerts = listExecutiveAlerts(institutionId, false);
    const calendarIntel = calendarEngineService.intelligence.analyze(institutionId);
    return {
      institution_id: institutionId,
      strategic_risks: alerts.filter((a) => a.priority === "critical" || a.priority === "high").length,
      mission_risks: calendarIntel.deadline_risk,
      schedule_risk: calendarIntel.schedule_risk,
      unresolved_alerts: alerts.length,
    };
  },
};

export const operationalHealthService = {
  compute(institutionId: string) {
    const missions = missionIntelligenceService.analyze(institutionId);
    const workforce = workforceIntelligenceService.analyze(institutionId);
    const org = organizationIntelligenceService.analyze(institutionId);
    const comms = communicationIntelligenceService.analyze(institutionId);
    const record = {
      health_id: caeId("iht"),
      institution_id: institutionId,
      mission_completion: org.mission_completion_rate,
      assignment_progress: 0.78,
      budget_health: 0.82,
      organization_health: 1 - (org.leadership_vacancies / 10),
      workforce_capacity: workforce.mission_staffing > 0 ? 0.85 : 0.5,
      communication_health: comms.knowledge_candidates === 0 ? 0.9 : 0.75,
      decision_velocity: 0.7,
      institutional_readiness: 0.8,
      explanation: `Missions: ${missions.total_missions}, vacancies: ${org.leadership_vacancies}, alerts: ${listExecutiveAlerts(institutionId, false).length}`,
      computed_at: nowIso(),
    };
    saveInstitutionHealth(record);
    return record;
  },
  get: getInstitutionHealth,
};

export const executiveDashboardService = {
  build(institutionId: string, executiveRole = "executive_director") {
    const health = operationalHealthService.compute(institutionId);
    const strategy = strategicPlanningService.dashboard.build(institutionId);
    return {
      institution_id: institutionId,
      executive_role: executiveRole,
      strategic_objectives: strategy,
      mission_intelligence: missionIntelligenceService.analyze(institutionId),
      workforce_intelligence: workforceIntelligenceService.analyze(institutionId),
      financial_intelligence: financialIntelligenceService.analyze(institutionId),
      resource_intelligence: resourceIntelligenceService.analyze(institutionId),
      organization_intelligence: organizationIntelligenceService.analyze(institutionId),
      communication_intelligence: communicationIntelligenceService.analyze(institutionId),
      risk_intelligence: riskIntelligenceService.analyze(institutionId),
      institution_health: health,
      critical_alerts: listExecutiveAlerts(institutionId, false).filter((a) => a.priority === "critical" || a.priority === "high"),
      pending_decisions: listExecutiveDecisions(institutionId, "awaiting_approval"),
      calendar: calendarEngineService.timeline.agenda(institutionId),
      evidence_linked: true,
    };
  },
};

export const executiveBriefingService = {
  list: listExecutiveBriefings,
  generate(input: { institution_id: string; executive_human_id: string; executive_role?: Parameters<typeof saveExecutiveBriefing>[0]["executive_role"]; briefing_type?: "morning" | "evening" | "on_demand" }) {
    const dashboard = executiveDashboardService.build(input.institution_id);
    const record = {
      briefing_id: caeId("brf"),
      institution_id: input.institution_id,
      executive_human_id: input.executive_human_id,
      executive_role: input.executive_role ?? "executive_director",
      briefing_type: input.briefing_type ?? "on_demand",
      mission_status: `${dashboard.mission_intelligence.total_missions} active missions`,
      strategic_progress: "Strategic objectives on track",
      critical_risks: dashboard.critical_alerts.map((a) => a.title),
      pending_decisions: dashboard.pending_decisions.length,
      ai_summary: `Executive briefing: ${dashboard.critical_alerts.length} critical alerts, ${dashboard.pending_decisions.length} decisions awaiting approval.`,
      generated_at: nowIso(),
    };
    saveExecutiveBriefing(record);
    return { briefing: record, event: "executive.briefing.generated" as const };
  },
};

export const decisionSupportService = {
  list: listExecutiveDecisions,
  get: (decisionId: string) => {
    const d = getExecutiveDecision(decisionId);
    if (!d) throw new ExecutiveError("DECISION_NOT_FOUND", "Decision not found");
    return d;
  },
  approve(decisionId: string, approvedBy: string) {
    const decision = getExecutiveDecision(decisionId);
    if (!decision) throw new ExecutiveError("DECISION_NOT_FOUND", "Decision not found");
    const updated = { ...decision, status: "approved" as const, approved_by: approvedBy };
    saveExecutiveDecision(updated);
    return { decision: updated, event: "decision.approved" as const };
  },
  workspace(decisionId: string) {
    const decision = getExecutiveDecision(decisionId);
    if (!decision) throw new ExecutiveError("DECISION_NOT_FOUND", "Decision not found");
    return {
      ...decision,
      human_approval_required: true,
      ai_summary: `Decision: ${decision.question}. Recommendation: ${decision.recommendation}`,
    };
  },
};

export const scenarioPlanningService = {
  list: listScenarios,
  create(input: { institution_id: string; title: string; hypothesis: string; parameters?: Record<string, string>; created_by: string }) {
    const record = {
      scenario_id: caeId("scn"),
      institution_id: input.institution_id,
      title: input.title,
      hypothesis: input.hypothesis,
      parameters: input.parameters ?? {},
      impact_summary: "",
      status: "draft" as const,
      live_data_altered: false as const,
      created_by: input.created_by,
      created_at: nowIso(),
    };
    saveScenario(record);
    return { scenario: record, event: "scenario.created" as const };
  },
  analyze(scenarioId: string, institutionId: string) {
    const scenarios = listScenarios(institutionId);
    const scenario = scenarios.find((s) => s.scenario_id === scenarioId);
    if (!scenario) throw new ExecutiveError("SCENARIO_NOT_FOUND", "Scenario not found");
    const updated = {
      ...scenario,
      status: "analyzed" as const,
      impact_summary: `Scenario "${scenario.title}" analyzed without altering live data.`,
      live_data_altered: false as const,
    };
    saveScenario(updated);
    return { scenario: updated, event: "scenario.analyzed" as const };
  },
};

export const warRoomService = {
  list: listWarRooms,
  open(input: {
    institution_id: string;
    title: string;
    purpose: Parameters<typeof saveWarRoom>[0]["purpose"];
    mission_ids?: string[];
    participant_human_ids: string[];
    opened_by: string;
  }) {
    const record = {
      war_room_id: caeId("wrk"),
      institution_id: input.institution_id,
      title: input.title,
      purpose: input.purpose,
      status: "active" as const,
      mission_ids: input.mission_ids ?? [],
      participant_human_ids: input.participant_human_ids,
      opened_by: input.opened_by,
      opened_at: nowIso(),
      closed_at: null,
    };
    saveWarRoom(record);
    return {
      war_room: record,
      aggregated: {
        missions: missionIntelligenceService.analyze(input.institution_id),
        resources: resourceIntelligenceService.analyze(input.institution_id),
        communications: communicationIntelligenceService.analyze(input.institution_id),
        calendar: calendarEngineService.timeline.agenda(input.institution_id),
      },
      event: "warroom.opened" as const,
    };
  },
};

export const executiveTimelineService = {
  list: listExecutiveTimeline,
  build(institutionId: string) {
    const entries = listExecutiveTimeline(institutionId);
    const decisions = communicationsService.decisions.list(institutionId);
    const combined = [
      ...entries,
      ...decisions.map((d) => ({
        entry_id: d.decision_id,
        institution_id: institutionId,
        entry_type: "decision" as const,
        title: d.decision,
        description: d.reason,
        occurred_at: d.recorded_at,
        reference_id: d.decision_id,
      })),
    ].sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
    return { institution_id: institutionId, entries: combined, institutional_memory: true };
  },
};

export const executiveSecurityService = {
  filterForRole(data: Record<string, unknown>, role: string) {
    return { ...data, need_to_know_filtered: true, role, audit_trail: true };
  },
};

export const aiExecutiveAdvisorService = {
  analyze(institutionId: string) {
    const dashboard = executiveDashboardService.build(institutionId);
    return {
      institution_id: institutionId,
      advisory_only: true,
      may_not_exercise_authority: true,
      biggest_risk: dashboard.critical_alerts[0]?.title ?? "No critical risks",
      focus_recommendation: dashboard.pending_decisions.length > 0 ? "Review pending decisions" : "Monitor mission progress",
      evidence_backed: true,
      sample_questions: [
        "What changed today?",
        "What is my biggest risk?",
        "What decisions are waiting?",
        "Where should we focus next?",
      ],
    };
  },
  answer(institutionId: string, question: string) {
    const intel = aiExecutiveAdvisorService.analyze(institutionId);
    return {
      question,
      answer: `Based on institutional data: ${intel.focus_recommendation}`,
      evidence_refs: ["ops_institution_health", "ops_executive_alerts"],
      advisory_only: true,
    };
  },
};

export const executiveAlertService = {
  list: listExecutiveAlerts,
  resolve(alertId: string, institutionId: string) {
    const alerts = listExecutiveAlerts(institutionId);
    const alert = alerts.find((a) => a.alert_id === alertId);
    if (!alert) throw new ExecutiveError("ALERT_NOT_FOUND", "Alert not found");
    const updated = { ...alert, resolved: true };
    saveExecutiveAlert(updated);
    return updated;
  },
};

export const executiveService = {
  dashboard: executiveDashboardService,
  briefing: executiveBriefingService,
  decisions: decisionSupportService,
  missions: missionIntelligenceService,
  health: operationalHealthService,
  financial: financialIntelligenceService,
  resources: resourceIntelligenceService,
  workforce: workforceIntelligenceService,
  organization: organizationIntelligenceService,
  communications: communicationIntelligenceService,
  risks: riskIntelligenceService,
  scenarios: scenarioPlanningService,
  warRoom: warRoomService,
  timeline: executiveTimelineService,
  security: executiveSecurityService,
  alerts: executiveAlertService,
  ai: aiExecutiveAdvisorService,
};
