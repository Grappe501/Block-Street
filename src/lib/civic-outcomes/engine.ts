import { getParticipationHealthSummary, listParticipationEvents } from "@/lib/civic/engine";
import { getLeadershipHealthSummary, listLeadershipProfiles } from "@/lib/leadership/engine";
import { getCommunityHealthProfile } from "@/lib/community-health/engine";
import {
  loadBenchmarks,
  loadEvaluations,
  loadEvidence,
  loadFeatureFlags,
  loadOutcomes,
  loadOutputs,
  loadReports,
  loadTheoryOfChange,
  loadTimeline,
  persistBenchmarks,
  persistEvaluations,
  persistEvidence,
  persistOutcomes,
  persistOutputs,
  persistReports,
  persistTheoryOfChange,
  persistTimeline,
} from "./data";
import { listOutcomeAudit, recordOutcomeAudit } from "./audit";
import type {
  AttributionAnalysis,
  AttributionConfidence,
  AttributionLevel,
  CivicROIEstimate,
  CivicReturnOnParticipation,
  ExecutiveOutcomeDashboard,
  FederationOutcomeAnalytics,
  OutcomeDashboard,
  OutcomeEvidence,
  OutcomeInsight,
  OutcomeRecord,
  OutcomeReport,
  ProgramEvaluation,
  ProgramOutput,
  TheoryOfChange,
  VerificationLevel,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function assertEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.CIVIC_OUTCOMES_ENABLED) throw new Error("Civic Outcomes Engine is not enabled.");
  return flags;
}

function confidenceFromEvidence(count: number, verification: VerificationLevel[]): AttributionConfidence {
  const verified = verification.filter((v) => v !== "self_reported").length;
  if (count >= 5 && verified >= 3) return "very_high";
  if (count >= 3 && verified >= 2) return "high";
  if (count >= 2) return "moderate";
  return "low";
}

function attributionFromConfidence(confidence: AttributionConfidence, hasBaseline: boolean): AttributionLevel {
  if (confidence === "very_high" && hasBaseline) return "direct_attribution";
  if (confidence === "high") return "likely_attribution";
  if (confidence === "moderate") return "contribution";
  return "correlation";
}

export function createOutcomeRecord(input: {
  institution_id: string;
  program_id: string;
  community_id: string;
  outcome_type: OutcomeRecord["outcome_type"];
  category: OutcomeRecord["category"];
  domain: OutcomeRecord["domain"];
  indicator: string;
  baseline: number;
  target_value: number;
  measurement_period: string;
  actor_id: string;
}): OutcomeRecord {
  assertEnabled();
  const record: OutcomeRecord = {
    id: id("out"),
    institution_id: input.institution_id,
    program_id: input.program_id,
    community_id: input.community_id,
    outcome_type: input.outcome_type,
    category: input.category,
    domain: input.domain,
    indicator: input.indicator,
    baseline: input.baseline,
    current_value: input.baseline,
    target_value: input.target_value,
    measurement_period: input.measurement_period,
    confidence_level: "low",
    attribution_level: "correlation",
    evidence_count: 0,
    trend: "stable",
    last_updated: now(),
  };
  const outcomes = loadOutcomes();
  outcomes.push(record);
  persistOutcomes(outcomes);

  const timeline = loadTimeline();
  timeline.push({ period: input.measurement_period, value: input.baseline, milestone: "baseline" });
  persistTimeline(timeline);

  recordOutcomeAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "outcome_created",
    target_type: "outcome",
    target_id: record.id,
    result: "success",
  });
  return record;
}

export function getOutcomeRecord(outcomeId: string) {
  return loadOutcomes().find((o) => o.id === outcomeId) ?? null;
}

export function listOutcomeRecords(filters?: {
  institution_id?: string;
  program_id?: string;
  community_id?: string;
  outcome_type?: string;
}) {
  let outcomes = loadOutcomes();
  if (filters?.institution_id) outcomes = outcomes.filter((o) => o.institution_id === filters.institution_id);
  if (filters?.program_id) outcomes = outcomes.filter((o) => o.program_id === filters.program_id);
  if (filters?.community_id) outcomes = outcomes.filter((o) => o.community_id === filters.community_id);
  if (filters?.outcome_type) outcomes = outcomes.filter((o) => o.outcome_type === filters.outcome_type);
  return outcomes;
}

export function attachEvidence(input: {
  outcome_record_id: string;
  evidence_type: OutcomeEvidence["evidence_type"];
  source: string;
  verification_level: VerificationLevel;
  submitted_by: string;
  notes?: string;
  actor_id: string;
  new_value?: number;
}): { evidence: OutcomeEvidence; outcome: OutcomeRecord } {
  assertEnabled();
  const outcomes = loadOutcomes();
  const outcome = outcomes.find((o) => o.id === input.outcome_record_id);
  if (!outcome) throw new Error("Outcome record not found");

  const evidence: OutcomeEvidence = {
    id: id("oev"),
    outcome_record_id: input.outcome_record_id,
    evidence_type: input.evidence_type,
    source: input.source,
    verification_level: input.verification_level,
    submitted_by: input.submitted_by,
    date: now(),
    notes: input.notes,
  };
  const allEvidence = loadEvidence();
  allEvidence.push(evidence);
  persistEvidence(allEvidence);

  if (input.new_value !== undefined) {
    outcome.current_value = input.new_value;
    outcome.trend =
      input.new_value > outcome.baseline ? "positive" : input.new_value < outcome.baseline ? "negative" : "stable";
  }

  const recordEvidence = allEvidence.filter((e) => e.outcome_record_id === outcome.id);
  outcome.evidence_count = recordEvidence.length;
  outcome.confidence_level = confidenceFromEvidence(
    recordEvidence.length,
    recordEvidence.map((e) => e.verification_level)
  );
  outcome.attribution_level = attributionFromConfidence(outcome.confidence_level, outcome.baseline > 0);
  outcome.last_updated = now();

  const idx = outcomes.findIndex((o) => o.id === outcome.id);
  outcomes[idx] = outcome;
  persistOutcomes(outcomes);

  const timeline = loadTimeline();
  timeline.push({ period: now().slice(0, 7), value: outcome.current_value });
  persistTimeline(timeline);

  recordOutcomeAudit({
    institution_id: outcome.institution_id,
    actor_id: input.actor_id,
    action: "evidence_attached",
    target_type: "evidence",
    target_id: evidence.id,
    result: "success",
    metadata: { outcome_id: outcome.id, confidence: outcome.confidence_level },
  });
  return { evidence, outcome };
}

export function recordProgramOutput(input: {
  program_id: string;
  institution_id: string;
  output_type: string;
  description: string;
  quantity: number;
  period: string;
  actor_id: string;
}): ProgramOutput {
  assertEnabled();
  const output: ProgramOutput = {
    id: id("pout"),
    program_id: input.program_id,
    institution_id: input.institution_id,
    output_type: input.output_type,
    description: input.description,
    quantity: input.quantity,
    period: input.period,
    recorded_at: now(),
  };
  const outputs = loadOutputs();
  outputs.push(output);
  persistOutputs(outputs);
  recordOutcomeAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "output_recorded",
    target_type: "output",
    target_id: output.id,
    result: "success",
  });
  return output;
}

export function defineTheoryOfChange(input: {
  program_id: string;
  institution_id: string;
  resources: string[];
  activities: string[];
  outputs: string[];
  outcomes: string[];
  long_term_impact: string[];
  actor_id: string;
}): TheoryOfChange {
  assertEnabled();
  const toc: TheoryOfChange = {
    id: id("toc"),
    program_id: input.program_id,
    institution_id: input.institution_id,
    resources: input.resources,
    activities: input.activities,
    outputs: input.outputs,
    outcomes: input.outcomes,
    long_term_impact: input.long_term_impact,
    updated_at: now(),
  };
  const items = loadTheoryOfChange();
  const idx = items.findIndex((t) => t.program_id === input.program_id);
  if (idx >= 0) items[idx] = toc;
  else items.push(toc);
  persistTheoryOfChange(items);
  recordOutcomeAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "theory_of_change_defined",
    target_type: "theory_of_change",
    target_id: toc.id,
    result: "success",
  });
  return toc;
}

export function computeAttribution(outcomeId: string): AttributionAnalysis {
  const outcome = getOutcomeRecord(outcomeId);
  if (!outcome) throw new Error("Outcome not found");
  const evidence = loadEvidence().filter((e) => e.outcome_record_id === outcomeId);
  const verified = evidence.filter((e) => e.verification_level !== "self_reported");
  const gaps: string[] = [];
  if (!evidence.some((e) => e.evidence_type === "survey")) gaps.push("Survey data would strengthen attribution");
  if (!evidence.some((e) => e.verification_level === "external_verified"))
    gaps.push("External verification not yet obtained");
  if (outcome.category === "leadership" && !evidence.some((e) => e.evidence_type === "assessment"))
    gaps.push("Leadership assessments recommended");

  const confidence = outcome.confidence_level;
  const level = outcome.attribution_level;

  return {
    outcome_record_id: outcomeId,
    attribution_level: level,
    confidence,
    factors: [
      `${evidence.length} evidence records`,
      `${verified.length} verified sources`,
      outcome.baseline > 0 ? "Baseline documented" : "No baseline",
      `Change: ${outcome.current_value - outcome.baseline} from baseline`,
    ],
    evidence_gaps: gaps,
    explainable_summary: `Based on ${evidence.length} evidence items (${verified.length} verified), this outcome represents ${level.replace(/_/g, " ")} with ${confidence} confidence.`,
    calculated_at: now(),
  };
}

export function evaluateProgram(input: {
  program_id: string;
  institution_id: string;
  did_it_work: boolean;
  why_summary: string;
  for_whom: string;
  conditions: string;
  recommendations: string[];
  actor_id: string;
}): ProgramEvaluation {
  assertEnabled();
  const evaluation: ProgramEvaluation = {
    id: id("peval"),
    program_id: input.program_id,
    institution_id: input.institution_id,
    did_it_work: input.did_it_work,
    why_summary: input.why_summary,
    for_whom: input.for_whom,
    conditions: input.conditions,
    recommendations: input.recommendations,
    evaluated_at: now(),
  };
  const evals = loadEvaluations();
  evals.push(evaluation);
  persistEvaluations(evals);
  recordOutcomeAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "program_evaluated",
    target_type: "evaluation",
    target_id: evaluation.id,
    result: "success",
  });
  return evaluation;
}

export function getOutcomeTimeline(outcomeId: string) {
  const outcome = getOutcomeRecord(outcomeId);
  if (!outcome) return [];
  return [
    { period: "baseline", value: outcome.baseline, milestone: "baseline" },
    ...loadTimeline().filter((t) => t.period !== "baseline"),
    { period: "current", value: outcome.current_value, milestone: "current" },
  ];
}

export function getOutcomeBenchmark(outcomeId: string) {
  const outcome = getOutcomeRecord(outcomeId);
  if (!outcome) throw new Error("Outcome not found");
  const peerAverage = Math.round((outcome.baseline + outcome.target_value) / 2);
  const benchmark = {
    outcome_record_id: outcomeId,
    historical_baseline: outcome.baseline,
    current_value: outcome.current_value,
    peer_average: peerAverage,
    percentile: Math.min(99, Math.max(1, Math.round((outcome.current_value / Math.max(peerAverage, 1)) * 75))),
    anonymous: true as const,
    compared_at: now(),
  };
  const benchmarks = loadBenchmarks();
  benchmarks.push(benchmark);
  persistBenchmarks(benchmarks.slice(-50));
  return benchmark;
}

export function computeCivicReturnOnParticipation(programId: string, institutionId: string): CivicReturnOnParticipation {
  const events = listParticipationEvents(institutionId);
  const outputs = loadOutputs().filter((o) => o.program_id === programId);
  const outcomes = loadOutcomes().filter((o) => o.program_id === programId && o.outcome_type === "outcome");
  const impacts = loadOutcomes().filter((o) => o.program_id === programId && o.outcome_type === "impact");
  const hours = events.reduce((s, e) => s + (e.duration_minutes ?? 0), 0) / 60;

  return {
    program_id: programId,
    volunteer_hours: Math.round(hours),
    projects_completed: outputs.filter((o) => o.output_type.includes("project")).reduce((s, o) => s + o.quantity, 0),
    outcomes_achieved: outcomes.filter((o) => o.trend === "positive").length,
    long_term_impact_indicators: impacts.length,
    crop_score: Math.min(100, Math.round(outcomes.length * 15 + impacts.length * 25)),
    advisory_only: true,
  };
}

export function estimateCivicROI(programId: string): CivicROIEstimate {
  return {
    program_id: programId,
    resources_invested_description: "Staff time, training materials, volunteer coordination",
    community_benefit_description: "Increased volunteer retention, leadership pipeline, community projects",
    estimated_ratio: null,
    advisory_only: true,
    disclaimer: "CROI estimates are advisory only. Never represent speculative numbers as fact.",
  };
}

export function getOutcomeDashboard(institutionId: string): OutcomeDashboard {
  const outcomes = listOutcomeRecords({ institution_id: institutionId });
  const programs = new Set(outcomes.map((o) => o.program_id)).size;
  const retention = outcomes.find((o) => o.indicator === "volunteer_retention");
  const leadership = outcomes.find((o) => o.indicator === "leadership_growth");

  return {
    institution_id: institutionId,
    programs,
    measured_outcomes: outcomes.length,
    positive_trends: outcomes.filter((o) => o.trend === "positive").length,
    needs_attention: outcomes.filter((o) => o.trend === "negative" || o.confidence_level === "low").length,
    leadership_growth_percent: leadership ? leadership.current_value - leadership.baseline : 0,
    volunteer_retention_percent: retention ? retention.current_value - retention.baseline : 0,
  };
}

export function getExecutiveOutcomeDashboard(institutionId: string): ExecutiveOutcomeDashboard {
  const outcomes = listOutcomeRecords({ institution_id: institutionId });
  const orgOutcomes = outcomes.filter((o) => o.domain === "organizational_development").length;
  const commOutcomes = outcomes.filter((o) => o.domain !== "organizational_development").length;
  const avgConfidence = outcomes.length
    ? outcomes.filter((o) => o.confidence_level === "high" || o.confidence_level === "very_high").length / outcomes.length
    : 0;

  return {
    institution_id: institutionId,
    organizational_outcomes: orgOutcomes,
    community_outcomes: commOutcomes,
    impact_confidence: avgConfidence >= 0.5 ? "high" : avgConfidence >= 0.25 ? "moderate" : "low",
    long_term_trend: outcomes.filter((o) => o.trend === "positive").length > outcomes.length / 2 ? "improving" : "stable",
    program_effectiveness_percent: outcomes.length
      ? Math.round((outcomes.filter((o) => o.trend === "positive").length / outcomes.length) * 100)
      : 0,
    investment_effectiveness_note: "Advisory CROI available — speculative estimates never presented as fact.",
  };
}

export function generateOutcomeReport(input: {
  report_type: OutcomeReport["report_type"];
  institution_id: string;
  community_id?: string;
  actor_id: string;
}): OutcomeReport {
  assertEnabled();
  const outcomes = listOutcomeRecords({
    institution_id: input.institution_id,
    community_id: input.community_id,
  });
  const outputs = loadOutputs().filter((o) => o.institution_id === input.institution_id);

  const report: OutcomeReport = {
    id: id("orep"),
    report_type: input.report_type,
    institution_id: input.institution_id,
    community_id: input.community_id ?? null,
    title:
      input.report_type === "annual_impact"
        ? "Annual Community Impact Report"
        : `${input.report_type.replace(/_/g, " ")} Report`,
    period_start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    period_end: now(),
    summary: `Impact report covering ${outcomes.length} measured outcomes and ${outputs.length} program outputs. Individual data aggregated.`,
    aggregated_only: true,
    sections: [
      {
        heading: "Outputs vs Outcomes vs Impact",
        content: `Outputs: ${outputs.length} · Outcomes: ${outcomes.filter((o) => o.outcome_type === "outcome").length} · Impact: ${outcomes.filter((o) => o.outcome_type === "impact").length}`,
      },
      {
        heading: "Positive Trends",
        content: `${outcomes.filter((o) => o.trend === "positive").length} indicators showing improvement from baseline.`,
      },
      {
        heading: "Attribution Summary",
        content: outcomes.length
          ? `Average confidence: ${outcomes.filter((o) => o.confidence_level !== "low").length}/${outcomes.length} outcomes with moderate+ confidence.`
          : "Baseline establishment in progress.",
      },
    ],
    generated_at: now(),
  };

  const reports = loadReports();
  reports.push(report);
  persistReports(reports);

  recordOutcomeAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "report_generated",
    target_type: "report",
    target_id: report.id,
    result: "success",
  });
  return report;
}

export function getFederationOutcomeAnalytics(): FederationOutcomeAnalytics {
  const outcomes = loadOutcomes();
  const positive = outcomes.filter((o) => o.trend === "positive").length;
  return {
    aggregate_impact_index: outcomes.length ? Math.round((positive / outcomes.length) * 100) : 0,
    shared_learning_count: loadEvaluations().length,
    successful_models: outcomes.filter((o) => o.outcome_type === "impact" && o.trend === "positive").length,
    long_term_civic_trend: positive > outcomes.length / 2 ? "improving" : "stable",
    privacy_note: "Federation receives aggregated impact trends only — institution-specific data governed separately.",
  };
}

export function getOutcomeInsights(institutionId: string, programId?: string): OutcomeInsight[] {
  const outcomes = listOutcomeRecords({ institution_id: institutionId, program_id: programId });
  const insights: OutcomeInsight[] = [];

  for (const o of outcomes.filter((o) => o.confidence_level === "low")) {
    const attr = computeAttribution(o.id);
    if (attr.evidence_gaps.length) {
      insights.push({
        insight_type: "evidence_gap",
        title: `Additional evidence needed: ${o.indicator}`,
        message: attr.evidence_gaps[0],
        advisory_only: true,
        generated_at: now(),
      });
    }
  }

  const mentorshipOutcome = outcomes.find((o) => o.category === "leadership");
  if (mentorshipOutcome && mentorshipOutcome.confidence_level !== "very_high") {
    insights.push({
      insight_type: "improvement",
      title: "Collect mentorship evidence",
      message: "Additional mentorship assessments would improve attribution confidence for leadership outcomes.",
      advisory_only: true,
      generated_at: now(),
    });
  }

  return insights;
}

export function syncOutcomesFromPlatformSignals(input: {
  institution_id: string;
  program_id: string;
  community_id: string;
  actor_id: string;
}) {
  const leadership = getLeadershipHealthSummary();
  const health = getCommunityHealthProfile(input.community_id);

  const retention = listOutcomeRecords({ program_id: input.program_id }).filter(
    (o) => o.indicator === "volunteer_retention"
  );
  if (!retention.length) {
    createOutcomeRecord({
      institution_id: input.institution_id,
      program_id: input.program_id,
      community_id: input.community_id,
      outcome_type: "outcome",
      category: "volunteer_growth",
      domain: "volunteer_capacity",
      indicator: "volunteer_retention",
      baseline: 41,
      target_value: 75,
      measurement_period: "annual",
      actor_id: input.actor_id,
    });
  }

  const leadershipOutcomes = listOutcomeRecords({ program_id: input.program_id }).filter(
    (o) => o.indicator === "leadership_growth"
  );
  if (!leadershipOutcomes.length) {
    createOutcomeRecord({
      institution_id: input.institution_id,
      program_id: input.program_id,
      community_id: input.community_id,
      outcome_type: "outcome",
      category: "leadership",
      domain: "leadership",
      indicator: "leadership_growth",
      baseline: leadership.average_leadership_score || 20,
      target_value: 80,
      measurement_period: "annual",
      actor_id: input.actor_id,
    });
  }

  if (health) {
    const impact = listOutcomeRecords({ program_id: input.program_id, outcome_type: "impact" });
    if (!impact.length) {
      createOutcomeRecord({
        institution_id: input.institution_id,
        program_id: input.program_id,
        community_id: input.community_id,
        outcome_type: "impact",
        category: "community_capacity",
        domain: "community_resilience",
        indicator: "community_leadership_capacity",
        baseline: health.health_score - 10,
        target_value: health.health_score + 15,
        measurement_period: "multi_year",
        actor_id: input.actor_id,
      });
    }
  }

  return listOutcomeRecords({ institution_id: input.institution_id, program_id: input.program_id });
}

export { listOutcomeAudit };
