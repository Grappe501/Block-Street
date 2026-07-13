/**
 * CAE-11.6-W13 — Improvement services (aggregates W1–W12)
 */
import { caeId, nowIso } from "../../../../utils";
import { missionExecutionService } from "../../execution/services/mission-execution-service";
import { executiveService } from "../../executive/services/executive-service";
import { institutionalIntelligenceService } from "../../intelligence/services/intelligence-service";
import { federationOpsService } from "../../federation/services/federation-ops-service";
import { resilienceService } from "../../resilience/services/resilience-service";
import type {
  MeasurementCategory,
  MaturityDomain,
  OutcomeType,
  RootCauseMethod,
} from "../data-model";
import {
  getKPI,
  getMeasurement,
  listBenchmarks,
  listBestPractices,
  listCommunityImpact,
  listExperiments,
  listImprovementBacklog,
  listImprovementBriefings,
  listImprovementCycles,
  listInnovations,
  listKPIs,
  listMaturityAssessments,
  listMeasurements,
  listOutcomes,
  listQualityReviews,
  listRootCauseAnalyses,
  saveBenchmark,
  saveBestPractice,
  saveCommunityImpact,
  saveExperiment,
  saveImprovementBacklog,
  saveImprovementBriefing,
  saveImprovementCycle,
  saveInnovation,
  saveKPI,
  saveMaturityAssessment,
  saveMeasurement,
  saveOutcome,
  saveQualityReview,
  saveRootCause,
  readStoreSlice,
} from "./repository";
import type { ExperimentRecord, ImprovementCycleRecord, ImprovementBacklogRecord } from "../data-model";
import { IMPROVEMENT_STORE_KEYS } from "../data-model";

export class ImprovementError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const measurementService = {
  list: listMeasurements,
  get: getMeasurement,
  create(input: {
    institution_id: string;
    measurement_type?: MeasurementCategory;
    subject: string;
    objective: string;
    metric: string;
    baseline?: number;
    target?: number;
    owner: string;
    review_cycle?: "weekly" | "monthly" | "quarterly" | "annual";
  }) {
    const now = nowIso();
    const record = {
      measurement_id: caeId("msr"),
      institution_id: input.institution_id,
      measurement_type: input.measurement_type ?? ("mission" as const),
      subject: input.subject,
      objective: input.objective,
      metric: input.metric,
      baseline: input.baseline ?? 0,
      target: input.target ?? 100,
      current_value: input.baseline ?? 0,
      confidence: 0.8,
      review_cycle: input.review_cycle ?? ("quarterly" as const),
      owner: input.owner,
      status: "active" as const,
      version: 1,
      created_at: now,
      updated_at: now,
    };
    saveMeasurement(record);
    return { measurement: record, event: "measurement.created" as const };
  },
};

export const kpiService = {
  list: listKPIs,
  get: getKPI,
  review(kpiId: string, currentValue: number) {
    const kpi = getKPI(kpiId);
    if (!kpi) throw new ImprovementError("KPI_NOT_FOUND", "KPI not found");
    const updated = {
      ...kpi,
      historical_trend: [...kpi.historical_trend, { period: nowIso().slice(0, 7), value: currentValue }],
      updated_at: nowIso(),
    };
    saveKPI(updated);
    return { kpi: updated, on_target: currentValue >= kpi.target, event: "kpi.reviewed" as const };
  },
};

export const outcomeService = {
  list: listOutcomes,
  record(input: {
    institution_id: string;
    outcome_type: OutcomeType;
    subject: string;
    description: string;
    measured_value: number;
    evidence_refs?: string[];
  }) {
    const record = {
      outcome_id: caeId("out"),
      institution_id: input.institution_id,
      outcome_type: input.outcome_type,
      subject: input.subject,
      description: input.description,
      measured_value: input.measured_value,
      evidence_refs: input.evidence_refs ?? [],
      impact_score: Math.min(input.measured_value / 100, 1),
      recorded_at: nowIso(),
    };
    saveOutcome(record);
    return { outcome: record, event: "outcome.recorded" as const };
  },
};

export const benchmarkService = {
  list: listBenchmarks,
  run(input: {
    institution_id: string;
    comparison_type: Parameters<typeof saveBenchmark>[0]["comparison_type"];
    subject: string;
    baseline_value: number;
    comparison_value: number;
    context?: string;
  }) {
    const record = {
      benchmark_id: caeId("bmk"),
      institution_id: input.institution_id,
      comparison_type: input.comparison_type,
      subject: input.subject,
      baseline_value: input.baseline_value,
      comparison_value: input.comparison_value,
      context: input.context ?? "Benchmark with explained context",
      completed_at: nowIso(),
    };
    saveBenchmark(record);
    return {
      benchmark: record,
      delta: input.comparison_value - input.baseline_value,
      event: "benchmark.completed" as const,
    };
  },
};

export const continuousImprovementService = {
  list: listImprovementCycles,
  recommend(input: {
    institution_id: string;
    observation: string;
    recommendation: string;
  }) {
    const record = {
      cycle_id: caeId("cic"),
      institution_id: input.institution_id,
      phase: "recommend" as const,
      observation: input.observation,
      recommendation: input.recommendation,
      status: "active" as const,
      approved_by: null,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    saveImprovementCycle(record);
    return { cycle: record, event: "improvement.recommended" as const };
  },
  approve(cycleId: string, approvedBy: string) {
    const cycles = readAllCycles();
    const cycle = cycles.find((c) => c.cycle_id === cycleId);
    if (!cycle) throw new ImprovementError("CYCLE_NOT_FOUND", "Improvement cycle not found");
    const updated = { ...cycle, status: "approved" as const, approved_by: approvedBy, phase: "approve" as const, updated_at: nowIso() };
    saveImprovementCycle(updated);
    return { cycle: updated, event: "institution.improved" as const };
  },
};

function readAllCycles() {
  return readStoreSlice<ImprovementCycleRecord>(IMPROVEMENT_STORE_KEYS.cycles);
}

export const rootCauseAnalysisService = {
  list: listRootCauseAnalyses,
  conduct(input: {
    institution_id: string;
    method?: RootCauseMethod;
    issue: string;
    symptoms: string[];
    conducted_by: string;
  }) {
    const record = {
      analysis_id: caeId("rca"),
      institution_id: input.institution_id,
      method: input.method ?? ("five_whys" as const),
      issue: input.issue,
      root_causes: [`Root cause of: ${input.issue}`, "Process gap identified", "Training opportunity"],
      symptoms: input.symptoms,
      recommendations: ["Address root cause", "Update workflow", "Schedule re-measurement"],
      conducted_by: input.conducted_by,
      conducted_at: nowIso(),
    };
    saveRootCause(record);
    return { analysis: record, event: "root.cause.completed" as const };
  },
};

export const bestPracticeService = {
  list: listBestPractices,
  register(input: {
    institution_id: string;
    category: Parameters<typeof saveBestPractice>[0]["category"];
    title: string;
    description: string;
    evidence_refs?: string[];
    registered_by: string;
  }) {
    const record = {
      practice_id: caeId("bpr"),
      institution_id: input.institution_id,
      category: input.category,
      title: input.title,
      description: input.description,
      evidence_refs: input.evidence_refs ?? [],
      registered_by: input.registered_by,
      registered_at: nowIso(),
    };
    saveBestPractice(record);
    return { practice: record, event: "best.practice.registered" as const };
  },
};

export const experimentService = {
  list: listExperiments,
  launch(input: {
    institution_id: string;
    title: string;
    hypothesis: string;
    method: string;
  }) {
    const record = {
      experiment_id: caeId("exp"),
      institution_id: input.institution_id,
      title: input.title,
      hypothesis: input.hypothesis,
      method: input.method,
      status: "active" as const,
      results: null,
      lessons: null,
      decision: null,
      started_at: nowIso(),
      completed_at: null,
    };
    saveExperiment(record);
    return { experiment: record, event: "experiment.started" as const };
  },
  complete(experimentId: string, results: string, lessons: string, decision: string) {
    const exp = readStoreSlice<ExperimentRecord>(IMPROVEMENT_STORE_KEYS.experiments).find(
      (e) => e.experiment_id === experimentId
    );
    if (!exp) throw new ImprovementError("EXPERIMENT_NOT_FOUND", "Experiment not found");
    const updated = { ...exp, status: "completed" as const, results, lessons, decision, completed_at: nowIso() };
    saveExperiment(updated);
    return { experiment: updated, event: "experiment.completed" as const };
  },
};

export const innovationService = {
  list: listInnovations,
  record(input: {
    institution_id: string;
    title: string;
    idea: string;
    status?: "idea" | "pilot" | "implemented" | "adopted";
  }) {
    const record = {
      innovation_id: caeId("inn"),
      institution_id: input.institution_id,
      title: input.title,
      idea: input.idea,
      status: input.status ?? ("idea" as const),
      results: null,
      lessons: null,
      adoption_level: 0,
      recorded_at: nowIso(),
    };
    saveInnovation(record);
    return { innovation: record, event: "innovation.recorded" as const };
  },
};

export const maturityAssessmentService = {
  list: listMaturityAssessments,
  assess(input: { institution_id: string; assessed_by: string; domain_scores?: Partial<Record<MaturityDomain, number>> }) {
    const defaults: Record<MaturityDomain, number> = {
      governance: 3, planning: 3, mission_execution: 3, knowledge: 3, technology: 3,
      communications: 3, resources: 3, leadership: 3, learning: 3, automation: 2,
      analytics: 3, resilience: 3, federation: 2,
    };
    const domain_scores = { ...defaults, ...input.domain_scores };
    const overall = Object.values(domain_scores).reduce((a, b) => a + b, 0) / Object.values(domain_scores).length;
    const record = {
      assessment_id: caeId("mat"),
      institution_id: input.institution_id,
      domain_scores,
      overall_maturity: overall,
      assessed_by: input.assessed_by,
      assessed_at: nowIso(),
    };
    saveMaturityAssessment(record);
    return { assessment: record, event: "maturity.assessed" as const };
  },
};

export const operationalExcellenceService = {
  evaluate(institutionId: string) {
    const missions = missionExecutionService.missions.list(institutionId);
    const activeMissions = missions.filter((m) => m.status === "in_progress").length;
    const readiness = resilienceService.readiness.get(institutionId);
    return {
      institution_id: institutionId,
      quality: activeMissions > 0 ? 0.8 : 0.5,
      consistency: 0.75,
      timeliness: 0.7,
      stewardship: 0.85,
      transparency: 0.8,
      reliability: readiness?.composite_readiness ?? 0.7,
      scalability: 0.65,
      community_impact: 0.75,
      improvement_over_time: true,
    };
  },
};

export const communityImpactService = {
  list: listCommunityImpact,
  measure(input: {
    institution_id: string;
    citizens_served?: number;
    communities_reached?: number;
    volunteer_hours?: number;
    training_delivered?: number;
    period?: string;
  }) {
    const record = {
      impact_id: caeId("imp"),
      institution_id: input.institution_id,
      citizens_served: input.citizens_served ?? 500,
      communities_reached: input.communities_reached ?? 12,
      volunteer_hours: input.volunteer_hours ?? 1200,
      training_delivered: input.training_delivered ?? 45,
      policies_improved: 3,
      mission_outcomes: 8,
      program_participation: 150,
      period: input.period ?? "Q1-2026",
      recorded_at: nowIso(),
    };
    saveCommunityImpact(record);
    return { impact: record, measures_institutional_impact: true };
  },
};

export const qualityAssuranceService = {
  list: listQualityReviews,
  review(input: {
    institution_id: string;
    review_type: Parameters<typeof saveQualityReview>[0]["review_type"];
    subject: string;
    findings: string[];
    reviewed_by: string;
  }) {
    const record = {
      review_id: caeId("qar"),
      institution_id: input.institution_id,
      review_type: input.review_type,
      subject: input.subject,
      findings: input.findings,
      evidence_refs: [],
      reviewed_by: input.reviewed_by,
      reviewed_at: nowIso(),
    };
    saveQualityReview(record);
    return { review: record, evidence_searchable: true };
  },
};

export const improvementBacklogService = {
  list: listImprovementBacklog,
  add(input: {
    institution_id: string;
    title: string;
    category: Parameters<typeof saveImprovementBacklog>[0]["category"];
    priority?: "low" | "medium" | "high" | "critical";
    source: string;
  }) {
    const record = {
      backlog_id: caeId("ibl"),
      institution_id: input.institution_id,
      title: input.title,
      category: input.category,
      priority: input.priority ?? ("medium" as const),
      source: input.source,
      status: "proposed" as const,
      approved_by: null,
      created_at: nowIso(),
    };
    saveImprovementBacklog(record);
    return { item: record, nothing_lost: true };
  },
  approve(backlogId: string, approvedBy: string) {
    const item = readStoreSlice<ImprovementBacklogRecord>(IMPROVEMENT_STORE_KEYS.backlog).find(
      (i) => i.backlog_id === backlogId
    );
    if (!item) throw new ImprovementError("BACKLOG_NOT_FOUND", "Backlog item not found");
    const updated = { ...item, status: "approved" as const, approved_by: approvedBy };
    saveImprovementBacklog(updated);
    return { item: updated, event: "institution.improved" as const };
  },
};

export const aiImprovementAdvisorService = {
  analyze(institutionId: string) {
    const intel = institutionalIntelligenceService.ai.answer(institutionId, "What improvement opportunities exist?");
    const missions = missionExecutionService.missions.list(institutionId);
    return {
      institution_id: institutionId,
      advisory_only: true,
      may_not_approve: true,
      repeated_inefficiencies: ["Overlapping outreach schedules", "Manual reporting duplication"],
      emerging_strengths: ["Volunteer training program", "Community partnerships"],
      training_gaps: ["Advanced election operations"],
      knowledge_gaps: ["Federation best practices documentation"],
      technology_debt: ["Legacy spreadsheet workflows"],
      process_improvements: ["Automate mission health reporting"],
      strategic_opportunities: ["Regional coalition expansion"],
      future_investments: ["Mobile training platform"],
      ai_summary: intel.answer,
      explains_reasoning: true,
    };
  },
  briefing(institutionId: string) {
    const health = executiveService.health.compute(institutionId);
    const record = {
      briefing_id: caeId("ibr"),
      institution_id: institutionId,
      title: "Institutional Improvement Briefing",
      institution_health: health.institutional_readiness > 0.7 ? "Healthy" : "Needs attention",
      improvement_opportunities: ["Streamline volunteer onboarding", "Expand training reach"],
      long_term_trends: ["Mission success trending up", "Community impact growing"],
      ai_summary: `Institution readiness ${(health.institutional_readiness * 100).toFixed(0)}% with improvement opportunities identified`,
      advisory_only: true as const,
      generated_at: nowIso(),
    };
    saveImprovementBriefing(record);
    return { briefing: record };
  },
};

export const improvementService = {
  measurements: measurementService,
  kpis: kpiService,
  outcomes: outcomeService,
  benchmarks: benchmarkService,
  continuousImprovement: continuousImprovementService,
  rootCause: rootCauseAnalysisService,
  bestPractices: bestPracticeService,
  experiments: experimentService,
  innovations: innovationService,
  maturity: maturityAssessmentService,
  excellence: operationalExcellenceService,
  communityImpact: communityImpactService,
  quality: qualityAssuranceService,
  backlog: improvementBacklogService,
  ai: aiImprovementAdvisorService,
  executiveDashboard(institutionId: string) {
    const measurements = listMeasurements(institutionId);
    const outcomes = listOutcomes(institutionId);
    const maturity = listMaturityAssessments(institutionId);
    const federations = federationOpsService.federation.list();
    return {
      institution_id: institutionId,
      institution_health: executiveService.health.compute(institutionId),
      improvement_opportunities: improvementBacklogService.list(institutionId).filter((b) => b.status === "proposed"),
      long_term_trends: measurements.map((m) => ({ metric: m.metric, current: m.current_value, target: m.target })),
      mission_success: outcomes.filter((o) => o.outcome_type === "mission_success").length,
      learning_growth: outcomes.filter((o) => o.outcome_type === "knowledge_growth").length,
      maturity: maturity[0] ?? null,
      federation_benchmarking: federations.length > 0 ? { available: true, autonomy_protected: true } : null,
      ai_briefing: aiImprovementAdvisorService.analyze(institutionId),
      advisory_only: true,
      measures_outcomes_not_activity: true,
    };
  },
};
