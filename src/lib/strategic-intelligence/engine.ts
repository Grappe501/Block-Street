import { getParticipationHealthSummary } from "@/lib/civic/engine";
import { getLeadershipHealthSummary } from "@/lib/leadership/engine";
import { getMentorshipGraph, identifyConnectors } from "@/lib/community-relationship/engine";
import { detectCommunityRisks, listCommunityHealthProfiles } from "@/lib/community-health/engine";
import { getOutcomeInsights, listOutcomeRecords } from "@/lib/civic-outcomes/engine";
import {
  loadDecisions,
  loadFeatureFlags,
  loadForecasts,
  loadInsights,
  loadLearningRecords,
  loadRecommendations,
  loadScenarios,
  loadWarnings,
  persistDecisions,
  persistForecasts,
  persistInsights,
  persistLearningRecords,
  persistRecommendations,
  persistScenarios,
  persistWarnings,
} from "./data";
import { listStrategicAudit, recordStrategicAudit } from "./audit";
import type {
  DecisionRecord,
  DecisionSupportPackage,
  EarlyWarning,
  ExecutiveStrategicDashboard,
  FederationIntelligence,
  Forecast,
  InstitutionalLearning,
  Scenario,
  StrategicDashboard,
  StrategicInsight,
  StrategicRecommendation,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function assertEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.STRATEGIC_INTELLIGENCE_ENABLED) throw new Error("Strategic Intelligence Engine is not enabled.");
  return flags;
}

export function generateStrategicInsights(institutionId: string, countyId?: string): StrategicInsight[] {
  assertEnabled();
  const civic = getParticipationHealthSummary();
  const leadership = getLeadershipHealthSummary();
  const mentorship = getMentorshipGraph(institutionId);
  const healthProfiles = listCommunityHealthProfiles(countyId);
  const outcomes = listOutcomeRecords({ institution_id: institutionId });
  const communityRisks = countyId
    ? healthProfiles.flatMap((p) => detectCommunityRisks(p.community_id, institutionId))
    : [];

  const insights: StrategicInsight[] = [];
  const mentorLoad = Object.values(mentorship.mentor_load ?? {});
  const overloaded = mentorLoad.filter((l) => l >= 4).length;
  const mentorTotal = mentorLoad.length || 1;

  if (overloaded > 0 || mentorTotal < 2) {
    insights.push({
      id: id("sins"),
      institution_id: institutionId,
      community_id: countyId ? `community-${countyId}-central` : null,
      county_id: countyId ?? null,
      category: "risk",
      priority: overloaded >= 2 ? "high" : "medium",
      confidence: "high",
      summary: "Declining mentorship capacity detected",
      supporting_evidence: [
        `${overloaded} mentors at or above recommended load`,
        `${mentorTotal} active mentors in network`,
        leadership.mentor_capacity_percent !== undefined
          ? `Mentor capacity at ${leadership.mentor_capacity_percent}%`
          : "Mentor capacity below target",
      ],
      recommended_actions: [
        "Launch mentor development cohort",
        "Redistribute experienced mentors across organizations",
        "Recruit additional mentor volunteers",
      ],
      explainable_reasoning:
        "Mentor load analysis shows capacity strain. When mentors exceed 4 active mentees, burnout risk increases and mentorship quality declines.",
      alternatives: ["Pause new mentee assignments", "Partner with regional mentor network"],
      generated_at: now(),
      status: "active",
    });
  }

  if (leadership.emerging_leaders >= 2) {
    insights.push({
      id: id("sins"),
      institution_id: institutionId,
      community_id: null,
      county_id: countyId ?? null,
      category: "opportunity",
      priority: "medium",
      confidence: "moderate",
      summary: `${leadership.emerging_leaders} emerging leaders ready for expanded roles`,
      supporting_evidence: [
        `${leadership.emerging_leaders} emerging leaders identified`,
        `Pipeline depth: ${leadership.pipeline_depth}`,
      ],
      recommended_actions: ["Launch leadership cohort", "Assign mentors to emerging leaders"],
      explainable_reasoning: "Leadership pipeline shows emerging talent with verified participation evidence.",
      alternatives: ["Extend observation period", "Focus on volunteer depth first"],
      generated_at: now(),
      status: "active",
    });
  }

  if (civic.declining_communities && civic.declining_communities > 0) {
    insights.push({
      id: id("sins"),
      institution_id: institutionId,
      community_id: null,
      county_id: countyId ?? null,
      category: "trend",
      priority: "high",
      confidence: "moderate",
      summary: `Participation declining in ${civic.declining_communities} communit${civic.declining_communities === 1 ? "y" : "ies"}`,
      supporting_evidence: [`${civic.declining_communities} communities with declining engagement trends`],
      recommended_actions: ["Volunteer recruitment in underserved areas", "Community outreach initiative"],
      explainable_reasoning: "Engagement trend analysis from civic participation engine shows downward trajectory.",
      alternatives: ["Investigate root causes via community listening sessions"],
      generated_at: now(),
      status: "active",
    });
  }

  for (const risk of communityRisks.filter((r) => r.risk_type === "mentor_shortage").slice(0, 1)) {
    insights.push({
      id: id("sins"),
      institution_id: institutionId,
      community_id: risk.community_id ?? null,
      county_id: countyId ?? null,
      category: "risk",
      priority: "high",
      confidence: "high",
      summary: risk.title,
      supporting_evidence: [risk.message],
      recommended_actions: [risk.suggested_action],
      explainable_reasoning: "Community health engine detected mentorship availability below healthy threshold.",
      alternatives: ["Cross-county mentor sharing program"],
      generated_at: now(),
      status: "active",
    });
  }

  const connectors = identifyConnectors(institutionId);
  if (connectors.length >= 2) {
    insights.push({
      id: id("sins"),
      institution_id: institutionId,
      community_id: null,
      county_id: countyId ?? null,
      category: "partnership",
      priority: "medium",
      confidence: "moderate",
      summary: "Strong partnership foundation via community connectors",
      supporting_evidence: connectors.slice(0, 3).map((c) => `${c.label} bridges ${c.organizations_connected} organizations`),
      recommended_actions: ["Facilitate cross-organization coalition project", "Document connector playbook"],
      explainable_reasoning: "Relationship intelligence identifies natural bridge-builders enabling partnership expansion.",
      alternatives: ["Focus on deepening existing partnerships before expanding"],
      generated_at: now(),
      status: "active",
    });
  }

  if (outcomes.filter((o) => o.trend === "positive").length > outcomes.length / 2 && outcomes.length > 0) {
    insights.push({
      id: id("sins"),
      institution_id: institutionId,
      community_id: null,
      county_id: countyId ?? null,
      category: "trend",
      priority: "low",
      confidence: "high",
      summary: "Majority of measured outcomes trending positive",
      supporting_evidence: outcomes.filter((o) => o.trend === "positive").map((o) => `${o.indicator}: ${o.baseline} → ${o.current_value}`),
      recommended_actions: ["Document successful interventions", "Share best practices with federation"],
      explainable_reasoning: "Outcomes engine shows sustained improvement across key indicators.",
      alternatives: ["Maintain current strategy with monitoring"],
      generated_at: now(),
      status: "active",
    });
  }

  const existing = loadInsights().filter((i) => i.institution_id !== institutionId);
  persistInsights([...existing, ...insights]);
  recordStrategicAudit({
    institution_id: institutionId,
    actor_id: "system",
    action: "insights_generated",
    target_type: "insights",
    target_id: institutionId,
    result: "success",
    metadata: { count: insights.length },
  });
  return insights;
}

export function listStrategicInsights(institutionId?: string, filters?: { category?: string; status?: string }) {
  let insights = loadInsights();
  if (institutionId) insights = insights.filter((i) => i.institution_id === institutionId);
  if (filters?.category) insights = insights.filter((i) => i.category === filters.category);
  if (filters?.status) insights = insights.filter((i) => i.status === filters.status);
  return insights;
}

export function generateEarlyWarnings(institutionId: string, countyId?: string): EarlyWarning[] {
  assertEnabled();
  const insights = listStrategicInsights(institutionId).filter((i) => i.category === "risk");
  const mentorship = getMentorshipGraph(institutionId);
  const warnings: EarlyWarning[] = [];

  for (const insight of insights.filter((i) => i.summary.includes("mentorship") || i.summary.includes("Mentor"))) {
    warnings.push({
      id: id("warn"),
      institution_id: institutionId,
      community_id: insight.community_id,
      warning_level: insight.priority === "high" ? "concern" : "watch",
      warning_type: "mentor_shortage",
      title: insight.summary,
      message: insight.explainable_reasoning,
      supporting_evidence: insight.supporting_evidence,
      explainable_reason: `Generated from strategic insight ${insight.id} with ${insight.confidence} confidence`,
      detected_at: now(),
      resolved_at: null,
    });
  }

  const mentorLoad = Object.values(mentorship.mentor_load ?? {});
  if (mentorLoad.some((l) => l >= 5)) {
    warnings.push({
      id: id("warn"),
      institution_id: institutionId,
      community_id: null,
      warning_level: "high_risk",
      warning_type: "mentor_overload",
      title: "Mentor overload detected",
      message: "One or more mentors exceed sustainable mentee load",
      supporting_evidence: mentorLoad.map((l, i) => `Mentor slot ${i + 1}: ${l} mentees`),
      explainable_reason: "Mentor load above 5 increases burnout risk per platform guidance",
      detected_at: now(),
      resolved_at: null,
    });
  }

  const civic = getParticipationHealthSummary();
  if (civic.declining_communities && civic.declining_communities >= 2) {
    warnings.push({
      id: id("warn"),
      institution_id: institutionId,
      community_id: null,
      warning_level: "concern",
      warning_type: "participation_decline",
      title: "Rapid participation decline across communities",
      message: `${civic.declining_communities} communities showing declining engagement`,
      supporting_evidence: [`Active participants: ${civic.active_participants}`, `Rising: ${civic.rising_communities}, Declining: ${civic.declining_communities}`],
      explainable_reason: "Civic participation trend analysis triggered early warning threshold",
      detected_at: now(),
      resolved_at: null,
    });
  }

  const existingWarnings = loadWarnings().filter((w) => w.institution_id !== institutionId);
  persistWarnings([...existingWarnings, ...warnings]);
  return warnings;
}

export function generateRecommendations(institutionId: string): StrategicRecommendation[] {
  assertEnabled();
  const insights = listStrategicInsights(institutionId, { status: "active" });
  const recs: StrategicRecommendation[] = [];

  for (const insight of insights) {
    if (insight.category === "risk" && insight.summary.includes("mentorship")) {
      recs.push({
        id: id("srec"),
        insight_id: insight.id,
        institution_id: institutionId,
        recommendation_type: "mentor_development",
        summary: "Launch mentor development cohort and redistribute experienced mentors",
        expected_benefit: "Improved mentorship capacity and reduced burnout risk",
        estimated_effort: "medium",
        confidence: insight.confidence,
        tradeoffs: ["Requires staff time for cohort facilitation", "Temporary mentor reassignment disruption"],
        status: "pending",
        advisory_only: true,
        generated_at: now(),
      });
    }
    if (insight.category === "opportunity" && insight.summary.includes("emerging leader")) {
      recs.push({
        id: id("srec"),
        insight_id: insight.id,
        institution_id: institutionId,
        recommendation_type: "leadership_cohort",
        summary: "Launch leadership cohort for emerging leaders",
        expected_benefit: "Accelerated leadership pipeline development",
        estimated_effort: "high",
        confidence: insight.confidence,
        tradeoffs: ["Significant curriculum investment", "Mentor time commitment"],
        status: "pending",
        advisory_only: true,
        generated_at: now(),
      });
    }
    if (insight.category === "trend" && insight.summary.includes("declining")) {
      recs.push({
        id: id("srec"),
        insight_id: insight.id,
        institution_id: institutionId,
        recommendation_type: "volunteer_recruitment",
        summary: "Recruit volunteers in underserved communities",
        expected_benefit: "Reverse participation decline trend",
        estimated_effort: "medium",
        confidence: insight.confidence,
        tradeoffs: ["Outreach costs", "Onboarding capacity needed"],
        status: "pending",
        advisory_only: true,
        generated_at: now(),
      });
    }
    if (insight.category === "partnership") {
      recs.push({
        id: id("srec"),
        insight_id: insight.id,
        institution_id: institutionId,
        recommendation_type: "partnership",
        summary: "Facilitate cross-organization coalition project",
        expected_benefit: "Strengthened community collaboration and resilience",
        estimated_effort: "medium",
        confidence: insight.confidence,
        tradeoffs: ["Coordination overhead", "Alignment time across organizations"],
        status: "pending",
        advisory_only: true,
        generated_at: now(),
      });
    }
  }

  const existingRecs = loadRecommendations().filter((r) => r.institution_id !== institutionId);
  persistRecommendations([...existingRecs, ...recs]);
  return recs;
}

export function createScenario(input: {
  institution_id: string;
  name: string;
  assumptions: string[];
  inputs: Record<string, number | string>;
  expected_outcomes: string[];
  actor_id: string;
}): Scenario {
  assertEnabled();
  const scenario: Scenario = {
    id: id("scen"),
    institution_id: input.institution_id,
    name: input.name,
    assumptions: input.assumptions,
    inputs: input.inputs,
    expected_outcomes: input.expected_outcomes,
    confidence: "moderate",
    advisory_only: true,
    generated_at: now(),
  };
  const scenarios = loadScenarios();
  scenarios.push(scenario);
  persistScenarios(scenarios);
  recordStrategicAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "scenario_created",
    target_type: "scenario",
    target_id: scenario.id,
    result: "success",
  });
  return scenario;
}

export function compareScenarios(institutionId: string, scenarioIds: string[]) {
  const scenarios = loadScenarios().filter((s) => s.institution_id === institutionId && scenarioIds.includes(s.id));
  return {
    comparison: scenarios.map((s) => ({
      id: s.id,
      name: s.name,
      assumptions: s.assumptions,
      expected_outcomes: s.expected_outcomes,
      confidence: s.confidence,
    })),
    advisory_only: true as const,
    note: "Scenario comparisons support strategic conversations—not predictions of fact.",
  };
}

export function generateForecasts(institutionId: string, communityId?: string): Forecast[] {
  assertEnabled();
  const civic = getParticipationHealthSummary();
  const leadership = getLeadershipHealthSummary();
  const health = communityId ? listCommunityHealthProfiles().find((p) => p.community_id === communityId) : null;

  const forecasts: Forecast[] = [
    {
      id: id("fcst"),
      institution_id: institutionId,
      community_id: communityId ?? null,
      forecast_type: "leadership_capacity",
      horizon: "annual",
      current_value: leadership.average_leadership_score,
      projected_value: Math.min(100, leadership.average_leadership_score + leadership.emerging_leaders * 3),
      probability_percent: 65,
      assumptions: ["Current mentorship programs continue", "No major leadership departures"],
      advisory_only: true,
      generated_at: now(),
    },
    {
      id: id("fcst"),
      institution_id: institutionId,
      community_id: communityId ?? null,
      forecast_type: "volunteer_growth",
      horizon: "annual",
      current_value: civic.active_participants ?? 0,
      projected_value: Math.round((civic.active_participants ?? 0) * 1.15),
      probability_percent: 55,
      assumptions: ["Volunteer recruitment initiatives launched", "Retention programs maintained"],
      advisory_only: true,
      generated_at: now(),
    },
    {
      id: id("fcst"),
      institution_id: institutionId,
      community_id: communityId ?? null,
      forecast_type: "community_resilience",
      horizon: "multi_year",
      current_value: health?.resilience_score ?? 50,
      projected_value: Math.min(100, (health?.resilience_score ?? 50) + 12),
      probability_percent: 50,
      assumptions: ["Cross-org collaboration increases", "Leadership redundancy improves"],
      advisory_only: true,
      generated_at: now(),
    },
  ];

  const existingForecasts = loadForecasts().filter((f) => f.institution_id !== institutionId);
  persistForecasts([...existingForecasts, ...forecasts]);
  return forecasts;
}

export function getDecisionSupport(recommendationId: string): DecisionSupportPackage {
  const rec = loadRecommendations().find((r) => r.id === recommendationId);
  if (!rec) throw new Error("Recommendation not found");
  const insight = loadInsights().find((i) => i.id === rec.insight_id);

  return {
    recommendation_id: recommendationId,
    evidence_summary: insight?.supporting_evidence ?? [],
    confidence: rec.confidence,
    supporting_trends: insight ? [insight.explainable_reasoning] : [],
    alternative_options: insight?.alternatives ?? [],
    risks: rec.tradeoffs,
    expected_outcomes: [rec.expected_benefit],
    human_authority_required: true,
  };
}

export function recordDecision(input: {
  institution_id: string;
  recommendation_id: string;
  reviewer_id: string;
  decision: DecisionRecord["decision"];
  rationale: string;
  evidence_reviewed: string[];
  actor_id: string;
}): DecisionRecord {
  assertEnabled();
  const record: DecisionRecord = {
    id: id("dec"),
    institution_id: input.institution_id,
    recommendation_id: input.recommendation_id,
    reviewer_id: input.reviewer_id,
    decision: input.decision,
    evidence_reviewed: input.evidence_reviewed,
    rationale: input.rationale,
    decided_at: now(),
    outcome_notes: null,
    lessons_learned: null,
  };
  const decisions = loadDecisions();
  decisions.push(record);
  persistDecisions(decisions);

  const recs = loadRecommendations();
  const idx = recs.findIndex((r) => r.id === input.recommendation_id);
  if (idx >= 0) {
    recs[idx] = {
      ...recs[idx],
      status: input.decision === "approved" ? "approved" : input.decision === "rejected" ? "rejected" : "under_review",
    };
    persistRecommendations(recs);
  }

  recordStrategicAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "decision_recorded",
    target_type: "decision",
    target_id: record.id,
    result: "success",
    metadata: { decision: input.decision, recommendation_id: input.recommendation_id },
  });
  return record;
}

export function recordInterventionOutcome(input: {
  institution_id: string;
  recommendation_id: string;
  decision_id: string;
  success: boolean;
  outcome_notes: string;
  lessons_learned: string;
  actor_id: string;
}) {
  assertEnabled();
  const decisions = loadDecisions();
  const idx = decisions.findIndex((d) => d.id === input.decision_id);
  if (idx >= 0) {
    decisions[idx] = {
      ...decisions[idx],
      outcome_notes: input.outcome_notes,
      lessons_learned: input.lessons_learned,
    };
    persistDecisions(decisions);
  }

  const recs = loadRecommendations();
  const ridx = recs.findIndex((r) => r.id === input.recommendation_id);
  if (ridx >= 0) {
    recs[ridx] = { ...recs[ridx], status: input.success ? "resolved" : "implemented" };
    persistRecommendations(recs);
  }

  const warnings = loadWarnings();
  for (const w of warnings.filter((w) => w.institution_id === input.institution_id && !w.resolved_at)) {
    w.resolved_at = input.success ? now() : null;
  }
  persistWarnings(warnings);

  const learning: InstitutionalLearning = {
    id: id("learn"),
    institution_id: input.institution_id,
    intervention_type: recs[ridx]?.recommendation_type ?? "general",
    success: input.success,
    summary: input.outcome_notes,
    evidence: [input.lessons_learned],
    reusable: input.success,
    recorded_at: now(),
  };
  const records = loadLearningRecords();
  records.push(learning);
  persistLearningRecords(records);

  recordStrategicAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "intervention_outcome_recorded",
    target_type: "learning",
    target_id: learning.id,
    result: "success",
    metadata: { success: input.success },
  });
  return { learning, warnings_resolved: input.success };
}

export function getStrategicDashboard(institutionId: string): StrategicDashboard {
  const insights = listStrategicInsights(institutionId, { status: "active" });
  const recs = loadRecommendations().filter((r) => r.institution_id === institutionId);
  const warnings = loadWarnings().filter((w) => w.institution_id === institutionId && !w.resolved_at);
  const civic = getParticipationHealthSummary();

  return {
    institution_id: institutionId,
    strategic_opportunities: insights.filter((i) => i.category === "opportunity" || i.category === "partnership").length,
    high_risks: insights.filter((i) => i.category === "risk" && (i.priority === "high" || i.priority === "critical")).length,
    leadership_forecast: insights.some((i) => i.category === "opportunity" && i.summary.includes("leader")) ? "positive" : "stable",
    volunteer_trend: civic.rising_communities && civic.rising_communities > (civic.declining_communities ?? 0) ? "growing" : civic.declining_communities ? "declining" : "stable",
    community_capacity: insights.some((i) => i.category === "trend" && i.summary.includes("positive")) ? "growing" : "stable",
    top_recommendation: recs.find((r) => r.status === "pending")?.summary ?? null,
    active_warnings: warnings.length,
  };
}

export function getExecutiveStrategicDashboard(institutionId: string): ExecutiveStrategicDashboard {
  const insights = listStrategicInsights(institutionId, { status: "active" });
  const recs = loadRecommendations().filter((r) => r.institution_id === institutionId);
  const forecasts = loadForecasts().filter((f) => f.institution_id === institutionId);

  return {
    institution_id: institutionId,
    top_opportunities: insights.filter((i) => i.category === "opportunity").slice(0, 3),
    top_risks: insights.filter((i) => i.category === "risk").slice(0, 3),
    forecasts: forecasts.slice(0, 5),
    strategic_priorities: recs.filter((r) => r.status === "pending").map((r) => r.summary).slice(0, 5),
    resource_recommendations: recs
      .filter((r) => r.recommendation_type === "mentor_development" || r.recommendation_type === "leadership_cohort")
      .map((r) => r.summary),
    pending_decisions: recs.filter((r) => r.status === "pending" || r.status === "under_review").length,
  };
}

export function getFederationIntelligence(): FederationIntelligence {
  const learning = loadLearningRecords().filter((l) => l.reusable && l.success);
  const insights = loadInsights();

  return {
    successful_models: learning.map((l) => `${l.intervention_type}: ${l.summary.slice(0, 80)}`),
    shared_risks: [...new Set(insights.filter((i) => i.category === "risk").map((i) => i.summary))].slice(0, 5),
    common_opportunities: [...new Set(insights.filter((i) => i.category === "opportunity").map((i) => i.summary))].slice(0, 5),
    emerging_best_practices: learning.filter((l) => l.reusable).map((l) => l.intervention_type),
    privacy_note: "Federation intelligence uses aggregated, authorized data only—no institution-specific confidential information.",
  };
}

export function getStrategicAdvisorInsights(institutionId: string, communityId?: string): { question: string; answer: string; advisory_only: true }[] {
  const dashboard = getStrategicDashboard(institutionId);
  const outcomeInsights = getOutcomeInsights(institutionId);
  const answers: { question: string; answer: string; advisory_only: true }[] = [
    {
      question: "What should we focus on next?",
      answer: dashboard.top_recommendation ?? "Continue monitoring participation and leadership trends.",
      advisory_only: true,
    },
    {
      question: "Where is leadership weakest?",
      answer: dashboard.high_risks > 0 ? `${dashboard.high_risks} high-priority risks identified—review mentorship and succession planning.` : "No critical leadership gaps detected currently.",
      advisory_only: true,
    },
    {
      question: "What should we prepare for?",
      answer: `Volunteer trend: ${dashboard.volunteer_trend}. Community capacity: ${dashboard.community_capacity}. ${dashboard.active_warnings} active warnings.`,
      advisory_only: true,
    },
  ];
  if (outcomeInsights.length) {
    answers.push({
      question: "Which evidence gaps should we address?",
      answer: outcomeInsights[0].message,
      advisory_only: true,
    });
  }
  return answers;
}

export function runIntelligenceCycle(input: {
  institution_id: string;
  county_id?: string;
  actor_id: string;
}) {
  const insights = generateStrategicInsights(input.institution_id, input.county_id);
  const warnings = generateEarlyWarnings(input.institution_id, input.county_id);
  const recommendations = generateRecommendations(input.institution_id);
  const forecasts = generateForecasts(input.institution_id, input.county_id ? `community-${input.county_id}-central` : undefined);
  return { insights, warnings, recommendations, forecasts };
}

export { listStrategicAudit };
