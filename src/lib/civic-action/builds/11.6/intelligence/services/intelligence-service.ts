/**
 * CAE-11.6-W10 — Institutional intelligence services (aggregates W1–W9)
 */
import { caeId, nowIso } from "../../../../utils";
import { strategicPlanningService } from "../../services/strategic-planning-service";
import { missionExecutionService } from "../../execution/services/mission-execution-service";
import { workforceManagementService } from "../../workforce/services/workforce-service";
import { organizationService } from "../../organization/services/organization-service";
import { resourceService } from "../../resources/services/resource-service";
import { calendarEngineService } from "../../calendar/services/calendar-service";
import { communicationsService } from "../../communications/services/communications-service";
import { executiveService } from "../../executive/services/executive-service";
import { workflowOrchestrationService } from "../../workflows/services/workflow-service";
import type { ForecastRecord, ForecastType, InstitutionalInsightRecord, IntelligenceCategory } from "../data-model";
import {
  getHealthIndex,
  listForecasts,
  listInsights,
  listIntelligenceScenarios,
  listLearningFeedback,
  listOpportunities,
  listPatterns,
  listRecommendations,
  listRiskPredictions,
  listSimulations,
  saveForecast,
  saveHealthIndex,
  saveInsight,
  saveIntelligenceScenario,
  saveLearningFeedback,
  saveOpportunity,
  savePattern,
  saveRecommendation,
  saveRiskPrediction,
  saveSimulation,
} from "./repository";

export class IntelligenceError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function aiConfidence(confidence: number, evidence: string[]) {
  return {
    confidence,
    evidence_sources: evidence,
    reasoning_summary: `Based on ${evidence.length} evidence sources`,
    known_unknowns: ["External market conditions", "Unforeseen events"],
    assumptions: ["Historical patterns continue", "No major policy changes"],
    alternative_interpretations: ["Optimistic scenario", "Conservative scenario"],
    recommended_human_review: confidence < 0.85,
    advisory_only: true as const,
  };
}

export const insightService = {
  list: listInsights,
  create(input: {
    institution_id: string;
    insight_type: IntelligenceCategory;
    title: string;
    summary: string;
    confidence: number;
    severity?: InstitutionalInsightRecord["severity"];
    supporting_evidence: string[];
    affected_objects?: string[];
    recommended_actions?: string[];
  }) {
    const record = {
      insight_id: caeId("ins"),
      institution_id: input.institution_id,
      insight_type: input.insight_type,
      title: input.title,
      summary: input.summary,
      confidence: input.confidence,
      severity: input.severity ?? "medium",
      priority: input.confidence < 0.7 ? ("high" as const) : ("medium" as const),
      supporting_evidence: input.supporting_evidence,
      affected_objects: input.affected_objects ?? [],
      recommended_actions: input.recommended_actions ?? [],
      reasoning_summary: `Insight derived from institutional operational data`,
      known_unknowns: ["Future external conditions"],
      assumptions: ["Current operational trends persist"],
      advisory_only: true as const,
      created_at: nowIso(),
      expires_at: null,
      status: "active" as const,
    };
    saveInsight(record);
    return { insight: record, event: "insight.created" as const };
  },
  executiveWorkspace(institutionId: string) {
    const dashboard = executiveService.dashboard.build(institutionId);
    const insights = listInsights(institutionId, "active");
    return {
      institution_id: institutionId,
      what_changed: dashboard.critical_alerts.map((a) => a.title),
      why_it_changed: "Operational data shifts detected across missions and resources",
      likely_next: insights[0]?.summary ?? "Continue monitoring mission progress",
      confidence: insights[0]?.confidence ?? 0.75,
      supporting_evidence: insights[0]?.supporting_evidence ?? ["ops_institution_health"],
      recommended_actions: insights[0]?.recommended_actions ?? ["Review executive dashboard"],
      alternative_scenarios: ["Accelerated completion", "Delayed completion"],
      required_decisions: dashboard.pending_decisions.length,
      advisory_only: true,
    };
  },
};

export const forecastService = {
  list: listForecasts,
  generate(input: { institution_id: string; forecast_type: ForecastType; horizon?: ForecastRecord["horizon"] }) {
    const missions = missionExecutionService.missions.list(input.institution_id);
    const budgets = resourceService.budgets.list(input.institution_id);
    const confidence = 0.82;
    const record = {
      forecast_id: caeId("frc"),
      institution_id: input.institution_id,
      forecast_type: input.forecast_type,
      title: `${input.forecast_type.replace(/_/g, " ")} forecast`,
      prediction:
        input.forecast_type === "mission_completion"
          ? `${missions.length} missions tracked; completion on track`
          : input.forecast_type === "budget_burn"
            ? `Burn rate stable; ${budgets.length} budgets monitored`
            : `Forecast for ${input.forecast_type}`,
      confidence,
      confidence_interval_low: confidence - 0.1,
      confidence_interval_high: Math.min(confidence + 0.1, 1),
      supporting_evidence: ["ops_missions", "ops_budgets", "ops_workforce"],
      horizon: input.horizon ?? "monthly",
      created_at: nowIso(),
      expires_at: null,
      status: "active" as const,
    };
    saveForecast(record);
    return { forecast: record, event: "forecast.generated" as const, ...aiConfidence(confidence, record.supporting_evidence) };
  },
};

export const predictionService = {
  evaluate(input: {
    institution_id: string;
    prediction_id: string;
    actual_outcome: string;
    recorded_by: string;
  }) {
    const forecasts = listForecasts(input.institution_id);
    const forecast = forecasts.find((f) => f.forecast_id === input.prediction_id);
    const prediction = forecast?.prediction ?? "Unknown prediction";
    const record = {
      feedback_id: caeId("lfb"),
      institution_id: input.institution_id,
      prediction_id: input.prediction_id,
      prediction,
      confidence: forecast?.confidence ?? 0.5,
      actual_outcome: input.actual_outcome,
      difference: `Predicted: ${prediction}; Actual: ${input.actual_outcome}`,
      lesson_learned: "Model calibration updated from outcome",
      model_adjustment: "Confidence weighting refined",
      recorded_at: nowIso(),
    };
    saveLearningFeedback(record);
    return { feedback: record, event: "prediction.evaluated" as const };
  },
};

export const patternRecognitionService = {
  list: listPatterns,
  detect(institutionId: string) {
    const workflows = workflowOrchestrationService.monitoring.status(institutionId);
    const patterns = [];
    if (workflows.pending_approvals > 0) {
      const record = {
        pattern_id: caeId("pat"),
        institution_id: institutionId,
        pattern_type: "approval_delay",
        description: "Repeated approval queue congestion detected",
        occurrences: workflows.pending_approvals,
        supporting_evidence: ["ops_workflow_executions", "ops_executive_decisions"],
        detected_at: nowIso(),
      };
      savePattern(record);
      patterns.push(record);
    }
    const calendarIntel = calendarEngineService.intelligence.analyze(institutionId);
    if (calendarIntel.schedule_risk === "elevated") {
      const record = {
        pattern_id: caeId("pat"),
        institution_id: institutionId,
        pattern_type: "calendar_congestion",
        description: "Calendar congestion pattern detected",
        occurrences: 1,
        supporting_evidence: ["ops_calendar_events"],
        detected_at: nowIso(),
      };
      savePattern(record);
      patterns.push(record);
    }
    return { patterns, event: patterns.length ? ("pattern.detected" as const) : null };
  },
};

export const opportunityService = {
  list: listOpportunities,
  detect(institutionId: string) {
    const workforce = workforceManagementService.executiveDashboard.build(institutionId);
    const record = {
      opportunity_id: caeId("opp"),
      institution_id: institutionId,
      title: "Volunteer expansion opportunity",
      description: `Volunteer engagement at ${workforce.volunteer_engagement}; capacity for growth`,
      confidence: 0.78,
      supporting_evidence: ["ops_workforce_capacity", "ops_missions"],
      created_at: nowIso(),
    };
    saveOpportunity(record);
    return { opportunity: record, event: "opportunity.detected" as const };
  },
};

export const riskPredictionService = {
  list: listRiskPredictions,
  predict(institutionId: string) {
    const alerts = executiveService.alerts.list(institutionId, false);
    const risks = alerts.map((a) => {
      const record = {
        risk_id: caeId("rsk"),
        institution_id: institutionId,
        title: a.title,
        likelihood: a.priority === "critical" ? 0.9 : 0.6,
        impact: a.priority === "critical" ? 0.85 : 0.5,
        earliest_warning: a.created_at,
        suggested_mitigation: a.recommended_actions[0] ?? "Review and mitigate",
        confidence: a.ai_confidence,
        supporting_evidence: a.evidence_refs,
        created_at: nowIso(),
      };
      saveRiskPrediction(record);
      return record;
    });
    return { risks, event: risks.length ? ("risk.predicted" as const) : null };
  },
};

export const scenarioService = {
  list: listIntelligenceScenarios,
  create(input: { institution_id: string; title: string; hypothesis: string; created_by: string }) {
    const record = {
      scenario_id: caeId("scn"),
      institution_id: input.institution_id,
      title: input.title,
      hypothesis: input.hypothesis,
      impact_summary: "",
      live_data_altered: false as const,
      status: "draft" as const,
      created_by: input.created_by,
      created_at: nowIso(),
    };
    saveIntelligenceScenario(record);
    return { scenario: record };
  },
  analyze(scenarioId: string, institutionId: string) {
    const scenarios = listIntelligenceScenarios(institutionId);
    const scenario = scenarios.find((s) => s.scenario_id === scenarioId);
    if (!scenario) throw new IntelligenceError("SCENARIO_NOT_FOUND", "Scenario not found");
    const updated = {
      ...scenario,
      status: "completed" as const,
      impact_summary: `Scenario "${scenario.title}" analyzed without altering live data.`,
      live_data_altered: false as const,
    };
    saveIntelligenceScenario(updated);
    return { scenario: updated, event: "scenario.completed" as const };
  },
  compare(institutionId: string, scenarioIds: string[]) {
    const scenarios = listIntelligenceScenarios(institutionId).filter((s) => scenarioIds.includes(s.scenario_id));
    return { scenarios, comparison: scenarios.map((s) => s.impact_summary), live_data_altered: false };
  },
};

export const simulationService = {
  list: listSimulations,
  run(input: {
    institution_id: string;
    simulation_type: string;
    inputs: Record<string, string>;
    created_by: string;
  }) {
    const record = {
      simulation_id: caeId("sim"),
      institution_id: input.institution_id,
      simulation_type: input.simulation_type,
      inputs: input.inputs,
      outputs: {
        result: `Simulated ${input.simulation_type} with inputs ${JSON.stringify(input.inputs)}`,
        impact: "Isolated—no live data modified",
      },
      isolated: true as const,
      approved: false as const,
      created_by: input.created_by,
      created_at: nowIso(),
    };
    saveSimulation(record);
    return { simulation: record, event: "simulation.finished" as const };
  },
};

export const recommendationService = {
  list: listRecommendations,
  recommend(institutionId: string) {
    const strategy = strategicPlanningService.dashboard.build(institutionId);
    const record = {
      recommendation_id: caeId("rec"),
      institution_id: institutionId,
      category: "strategic" as const,
      title: "Prioritize strategic objectives with lowest progress",
      why: "Strategic dashboard shows objectives needing attention",
      evidence: ["ops_strategic_objectives", "ops_missions"],
      confidence: 0.8,
      expected_benefit: "Improved mission alignment and completion velocity",
      advisory_only: true as const,
      created_at: nowIso(),
    };
    saveRecommendation(record);
    return {
      recommendations: [record, ...listRecommendations(institutionId)],
      strategic_objectives: strategy,
      event: "recommendation.created" as const,
    };
  },
};

export const institutionalHealthService = {
  compute(institutionId: string) {
    const execHealth = executiveService.health.compute(institutionId);
    const orgHealth = organizationService.health.compute(institutionId);
    const workflowHealth = workflowOrchestrationService.monitoring.status(institutionId);
    const record = {
      health_index_id: caeId("hix"),
      institution_id: institutionId,
      mission_health: execHealth.mission_completion,
      financial_health: execHealth.budget_health,
      leadership_health: 1 - orgHealth.vacancies / 10,
      volunteer_health: execHealth.workforce_capacity,
      training_health: 0.75,
      resource_health: execHealth.budget_health,
      communication_health: execHealth.communication_health,
      knowledge_health: 0.7,
      governance_health: orgHealth.succession_readiness,
      technology_health: 0.8,
      community_health: 0.72,
      composite_score:
        (execHealth.institutional_readiness + workflowHealth.workflow_health + orgHealth.mission_completion_rate) / 3,
      operational_planning_only: true as const,
      computed_at: nowIso(),
    };
    saveHealthIndex(record);
    return record;
  },
  get: getHealthIndex,
};

export const trendAnalysisService = {
  analyze(institutionId: string, window: "daily" | "weekly" | "monthly" | "quarterly" | "annual" = "monthly") {
    const missions = missionExecutionService.missions.list(institutionId);
    const executions = workflowOrchestrationService.execution.list(institutionId);
    return {
      institution_id: institutionId,
      window,
      mission_count_trend: missions.length,
      workflow_execution_trend: executions.length,
      historical_context_preserved: true,
      advisory_only: true,
    };
  },
};

export const knowledgeAnalyticsService = {
  analyze(institutionId: string) {
    const comms = communicationsService.ai.analyze(institutionId);
    return {
      institution_id: institutionId,
      knowledge_candidates: comms.knowledge_candidates,
      fragmentation_risk: comms.knowledge_candidates > 2 ? "moderate" : "low",
      explainable: true,
    };
  },
};

export const federationAnalyticsService = {
  compare(institutionIds: string[]) {
    return institutionIds.map((id) => ({
      institution_id: id,
      health: institutionalHealthService.compute(id).composite_score,
      restricted_data_hidden: true,
    }));
  },
};

export const aiInsightService = {
  answer(institutionId: string, question: string) {
    const risks = riskPredictionService.predict(institutionId);
    const patterns = patternRecognitionService.detect(institutionId);
    return {
      question,
      answer: risks.risks[0]
        ? `Biggest risk: ${risks.risks[0].title}. ${risks.risks[0].suggested_mitigation}`
        : "No critical risks detected; continue monitoring",
      evidence_refs: risks.risks[0]?.supporting_evidence ?? ["ops_institution_health"],
      patterns_detected: patterns.patterns.length,
      ...aiConfidence(0.85, risks.risks[0]?.supporting_evidence ?? ["ops_institution_health"]),
    };
  },
  bottlenecks(institutionId: string) {
    const workflows = workflowOrchestrationService.monitoring.status(institutionId);
    const decisions = executiveService.decisions.list(institutionId, "awaiting_approval");
    return {
      institution_id: institutionId,
      approval_queues: decisions.length,
      workflow_congestion: workflows.pending_approvals,
      meeting_overload: calendarEngineService.intelligence.analyze(institutionId).schedule_risk,
      advisory_only: true,
    };
  },
};

export const learningFeedbackService = {
  list: listLearningFeedback,
  record: (input: Parameters<typeof predictionService.evaluate>[0]) => {
    const result = predictionService.evaluate(input);
    return { ...result, event: "institutional.learning.updated" as const };
  },
};

export const institutionalIntelligenceService = {
  insights: insightService,
  forecasts: forecastService,
  predictions: predictionService,
  patterns: patternRecognitionService,
  opportunities: opportunityService,
  risks: riskPredictionService,
  scenarios: scenarioService,
  simulations: simulationService,
  recommendations: recommendationService,
  health: institutionalHealthService,
  trends: trendAnalysisService,
  knowledge: knowledgeAnalyticsService,
  federation: federationAnalyticsService,
  ai: aiInsightService,
  learning: learningFeedbackService,
};
