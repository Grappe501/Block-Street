/**
 * CAE-11.7-W8 — Prediction Runtime services
 */
import { caeId, nowIso } from "../../../../../utils";
import { localBrainRuntime } from "../../localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { contextIntelligenceRuntime } from "../../context/services/context-intelligence-service";
import { seedContextIfEmpty } from "../../context/services/seed";
import { seedExecutiveIfEmpty } from "../../executive-assistant/services/seed";
import { seedOrganizerIfEmpty } from "../../organizer/services/seed";
import { seedResearchIfEmpty } from "../../research/services/seed";
import { seedConversationIfEmpty } from "../../conversation/services/seed";
import { seedLearningIfEmpty } from "../../learning/services/seed";
import type { PlanningHorizon, ScenarioType } from "../data-model";
import {
  listAssumptions,
  listForecasts,
  listImpactAnalyses,
  listMissionOutcomes,
  listOpportunityForecasts,
  listPlanning,
  listResourceModels,
  listRiskForecasts,
  listScenarios,
  listSimulations,
  listTrends,
  saveAssumption,
  saveForecast,
  saveImpactAnalysis,
  saveMissionOutcome,
  saveOpportunityForecast,
  savePlanning,
  saveResourceModel,
  saveRiskForecast,
  saveScenario,
  saveSimulation,
  saveTrend,
} from "./repository";

export class PredictionError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function ensurePredictionBoot() {
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedExecutiveIfEmpty();
  seedOrganizerIfEmpty();
  seedResearchIfEmpty();
  seedConversationIfEmpty();
  seedLearningIfEmpty();
}

function getBrain(humanId: string) {
  ensurePredictionBoot();
  const brain = localBrainRuntime.localBrain.getByHuman(humanId);
  if (!brain) throw new PredictionError("PREDICTION_CONTEXT_REQUIRED", "LocalBrain required");
  return brain;
}

function baseForecast(input: {
  human_id: string;
  institution_id: string;
  subject: string;
  summary: string;
  time_horizon: PlanningHorizon;
  assumptions?: string[];
  evidence?: string[];
}) {
  const existing = listForecasts(input.human_id);
  return {
    forecast_id: caeId("frc"),
    human_id: input.human_id,
    institution_id: input.institution_id,
    subject: input.subject,
    summary: input.summary,
    evidence: input.evidence ?? ["Mission history", "Research network data", "Organizer workload"],
    model_inputs: ["volunteer_count", "budget", "timeline", "county_readiness"],
    assumptions: input.assumptions ?? ["Current volunteer growth continues", "No major legislative change"],
    confidence: 0.72,
    alternatives: ["Accelerated launch", "Delayed launch with expanded training"],
    time_horizon: input.time_horizon,
    freshness: nowIso(),
    limitations: ["Does not claim certainty", "Sensitive to donor assumptions"],
    certainty_claimed: false as const,
    advisory_only: true as const,
    version: existing.filter((f) => f.subject === input.subject).length + 1,
    generated_at: nowIso(),
  };
}

export const forecastService = {
  list: listForecasts,
  run(input: {
    human_id: string;
    institution_id: string;
    subject: string;
    summary: string;
    time_horizon?: PlanningHorizon;
    assumptions?: string[];
  }) {
    getBrain(input.human_id);
    const record = baseForecast({
      ...input,
      time_horizon: input.time_horizon ?? "90d",
    });
    saveForecast(record);
    return { forecast: record, event: "forecast.generated" as const, certainty_claimed: false };
  },
};

export const scenarioEngine = {
  list: listScenarios,
  create(input: {
    human_id: string;
    institution_id: string;
    scenario_type: ScenarioType;
    title: string;
    description: string;
    assumptions?: string[];
  }) {
    getBrain(input.human_id);
    const record = {
      scenario_id: caeId("scn"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      scenario_type: input.scenario_type,
      title: input.title,
      description: input.description,
      assumptions: input.assumptions ?? ["Baseline operations continue"],
      outcomes: [
        { label: "Expected", probability: 0.55, impact: "Moderate operational adjustment" },
        { label: "Optimistic", probability: 0.25, impact: "Expanded county reach" },
        { label: "Pessimistic", probability: 0.2, impact: "Timeline delay 30-60 days" },
      ],
      confidence: 0.68,
      reproducible: true as const,
      version: 1,
      created_at: nowIso(),
    };
    saveScenario(record);
    return { scenario: record, event: "scenario.completed" as const, reproducible: true };
  },
};

export const trendAnalysisService = {
  list: listTrends,
  evaluate(institutionId: string, metric: string) {
    const record = {
      trend_id: caeId("trd"),
      institution_id: institutionId,
      metric,
      direction: "up" as const,
      current_value: 42,
      projected_value: 51,
      evidence: ["12-week rolling average", "Mission completion rate"],
      confidence: 0.75,
      updated_at: nowIso(),
    };
    saveTrend(record);
    return { trend: record, event: "trend.updated" as const };
  },
};

export const simulationService = {
  list: listSimulations,
  run(input: {
    human_id: string;
    institution_id: string;
    query: string;
    variables: Record<string, string | number>;
  }) {
    getBrain(input.human_id);
    const impacts: string[] = [];
    if (input.variables.volunteers) impacts.push(`Volunteer capacity shifts by ${input.variables.volunteers}%`);
    if (input.variables.delay_days) impacts.push(`Mission timeline extends ${input.variables.delay_days} days`);
    if (input.variables.budget_cut) impacts.push(`Budget reduction affects ${input.variables.budget_cut} programs`);
    const record = {
      simulation_id: caeId("sim"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      query: input.query,
      variables: input.variables,
      downstream_impacts: impacts.length ? impacts : ["Moderate operational ripple across county immersion"],
      confidence: 0.7,
      completed_at: nowIso(),
      autonomous_decision: false as const,
    };
    saveSimulation(record);
    return {
      simulation: record,
      event: "simulation.completed" as const,
      advisory_only: true,
      autonomous_decision: false,
    };
  },
};

export const riskForecastService = {
  list: listRiskForecasts,
  forecast(input: {
    human_id: string;
    institution_id: string;
    category: string;
    title: string;
    summary: string;
    evidence: string[];
    likelihood?: string;
    impact?: string;
    mitigation?: string[];
  }) {
    if (input.evidence.length === 0) {
      throw new PredictionError("RISK_REQUIRES_EVIDENCE", "Risk forecasts require evidence");
    }
    const record = {
      risk_id: caeId("rsk"),
      institution_id: input.institution_id,
      human_id: input.human_id,
      category: input.category,
      title: input.title,
      summary: input.summary,
      evidence: input.evidence,
      likelihood: input.likelihood ?? "moderate",
      impact: input.impact ?? "moderate",
      mitigation: input.mitigation ?? ["Increase volunteer training", "Diversify funding sources"],
      confidence: 0.74,
      certainty_claimed: false as const,
      forecasted_at: nowIso(),
    };
    saveRiskForecast(record);
    return { risk: record, event: "risk.forecasted" as const, certainty_claimed: false };
  },
};

export const opportunityForecastService = {
  list: listOpportunityForecasts,
  forecast(input: {
    human_id: string;
    institution_id: string;
    title: string;
    domain: string;
    description: string;
    evidence: string[];
    time_window?: string;
  }) {
    const record = {
      opportunity_id: caeId("opp"),
      institution_id: input.institution_id,
      human_id: input.human_id,
      title: input.title,
      domain: input.domain,
      description: input.description,
      evidence: input.evidence,
      time_window: input.time_window ?? "next_quarter",
      confidence: 0.71,
      recommendation_only: true as const,
      forecasted_at: nowIso(),
    };
    saveOpportunityForecast(record);
    return { opportunity: record, event: "opportunity.forecasted" as const, recommendation_only: true };
  },
};

export const resourceModelService = {
  list: listResourceModels,
  model(input: {
    institution_id: string;
    resource_type: string;
    current_capacity: number;
    projected_need: number;
    time_horizon?: PlanningHorizon;
    assumptions?: string[];
  }) {
    const record = {
      model_id: caeId("res"),
      institution_id: input.institution_id,
      resource_type: input.resource_type,
      current_capacity: input.current_capacity,
      projected_need: input.projected_need,
      time_horizon: input.time_horizon ?? "1y",
      assumptions: input.assumptions ?? ["Volunteer growth 15% annually"],
      confidence: 0.69,
      modeled_at: nowIso(),
    };
    saveResourceModel(record);
    return { model: record, connects_to_operations: true };
  },
};

export const missionOutcomeService = {
  list: listMissionOutcomes,
  model(input: {
    institution_id: string;
    mission_id: string;
    success_probability?: number;
    schedule_impact?: string;
    budget_impact?: string;
  }) {
    const record = {
      outcome_id: caeId("out"),
      institution_id: input.institution_id,
      mission_id: input.mission_id,
      success_probability: input.success_probability ?? 0.68,
      schedule_impact: input.schedule_impact ?? "On track with 2-week buffer",
      budget_impact: input.budget_impact ?? "Within 5% of plan",
      volunteer_needs: "12 additional facilitators by Q3",
      blockers: ["County match confirmation pending"],
      training_needs: ["Advanced canvassing module"],
      confidence: 0.73,
      advisory_only: true as const,
      modeled_at: nowIso(),
    };
    saveMissionOutcome(record);
    return { outcome: record, advisory_only: true, mutates_mission: false };
  },
};

export const impactAnalysisService = {
  list: listImpactAnalyses,
  analyze(input: {
    human_id: string;
    institution_id: string;
    decision_subject: string;
  }) {
    const record = {
      impact_id: caeId("imp"),
      institution_id: input.institution_id,
      human_id: input.human_id,
      decision_subject: input.decision_subject,
      operational: ["Organizer workload +15%", "Additional county coordination"],
      financial: ["Budget increase $12K over 90 days"],
      training: ["2 new certification cohorts required"],
      timeline: ["Launch may shift 30 days if staffing delayed"],
      political: ["County board visibility increases"],
      community: ["Expanded volunteer engagement in 3 counties"],
      technology: ["CRM capacity review recommended"],
      resources: ["Need 1 additional vehicle for county travel"],
      confidence: 0.7,
      mutates_canonical: false as const,
      analyzed_at: nowIso(),
    };
    saveImpactAnalysis(record);
    return { impact: record, event: "impact.analyzed" as const, mutates_canonical: false };
  },
};

export const planningService = {
  list: listPlanning,
  create(input: {
    human_id: string;
    institution_id: string;
    horizon: PlanningHorizon;
    vision: string;
    milestones?: string[];
    assumptions?: string[];
  }) {
    const record = {
      plan_id: caeId("pln"),
      institution_id: input.institution_id,
      human_id: input.human_id,
      horizon: input.horizon,
      vision: input.vision,
      milestones: input.milestones ?? ["Q1 county expansion", "Q2 certification cohort", "Q3 statewide pilot"],
      assumptions: input.assumptions ?? ["Stable legislative environment"],
      confidence: 0.65,
      updated_at: nowIso(),
    };
    savePlanning(record);
    return { plan: record, event: "planning.updated" as const, measurable_vision: true };
  },
};

export const assumptionService = {
  list: listAssumptions,
  update(input: {
    human_id: string;
    institution_id: string;
    forecast_id?: string;
    scenario_id?: string;
    label: string;
    value: string;
    sensitivity?: "low" | "medium" | "high";
  }) {
    const existing = listAssumptions(input.institution_id).filter((a) => a.label === input.label);
    const record = {
      assumption_id: caeId("asm"),
      institution_id: input.institution_id,
      human_id: input.human_id,
      forecast_id: input.forecast_id ?? null,
      scenario_id: input.scenario_id ?? null,
      label: input.label,
      value: input.value,
      sensitivity: input.sensitivity ?? ("medium" as const),
      version: existing.length + 1,
      updated_at: nowIso(),
    };
    saveAssumption(record);
    return {
      assumption: record,
      event: "assumption.changed" as const,
      rerun_available: true,
      mutates_canonical: false,
    };
  },
};

export const predictionRuntimeService = {
  dashboard(input: { human_id: string; institution_id: string }) {
    ensurePredictionBoot();
    const context = contextIntelligenceRuntime.assemble({
      human_id: input.human_id,
      institution_id: input.institution_id,
    });
    const forecasts = listForecasts(input.human_id);
    const scenarios = listScenarios(input.human_id);
    const trends = listTrends(input.institution_id);
    const risks = listRiskForecasts(input.institution_id);
    const opportunities = listOpportunityForecasts(input.institution_id);
    const planning = listPlanning(input.institution_id);
    return {
      greeting: "Strategic Dashboard",
      next_question: "If we make this decision today, what is most likely to happen tomorrow?",
      forecasts: forecasts.length,
      scenarios: scenarios.length,
      trends: trends.slice(0, 5),
      risk_forecasts: risks.slice(0, 3),
      opportunity_forecasts: opportunities.slice(0, 3),
      planning_horizons: planning.map((p) => p.horizon),
      confidence: context.confidence,
      certainty_claimed: false,
      autonomous_decisions: false,
      mutates_canonical: false,
    };
  },
  ethics: {
    prohibited: [
      "claim_certainty",
      "predict_human_worth",
      "predict_protected_characteristics",
      "social_credit",
      "hidden_political_scores",
      "autonomous_strategic_decisions",
      "mutate_canonical_records",
    ],
    check(action: string) {
      return { allowed: !this.prohibited.some((p) => action.includes(p)), transparent: true };
    },
  },
};

export const predictionRuntime = {
  prediction: predictionRuntimeService,
  forecasts: forecastService,
  scenarios: scenarioEngine,
  trends: trendAnalysisService,
  simulations: simulationService,
  risks: riskForecastService,
  opportunities: opportunityForecastService,
  resources: resourceModelService,
  missions: missionOutcomeService,
  impacts: impactAnalysisService,
  planning: planningService,
  assumptions: assumptionService,
};
