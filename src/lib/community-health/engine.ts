import { getParticipationHealthSummary, listParticipationEvents } from "@/lib/civic/engine";
import { getLeadershipHealthSummary, listLeadershipProfiles } from "@/lib/leadership/engine";
import {
  computeNetworkResilience,
  getCollaborationAnalytics,
  getMentorshipGraph,
  getRelationshipHealthSummary,
  identifyConnectors,
} from "@/lib/community-relationship/engine";
import {
  loadFeatureFlags,
  loadHealthWeights,
  loadProfiles,
  loadProjects,
  loadTrends,
  loadBenchmarks,
  loadReports,
  persistBenchmarks,
  persistGeographicPoints,
  persistOpportunities,
  persistProfiles,
  persistProjects,
  persistReports,
  persistRisks,
  persistTrends,
} from "./data";
import { listCommunityHealthAudit, recordCommunityHealthAudit } from "./audit";
import type {
  CommunityCapacityMetrics,
  CommunityHealthDashboard,
  CommunityHealthInsight,
  CommunityHealthProfile,
  CommunityHealthReport,
  CommunityOpportunity,
  CommunityProject,
  CommunityRisk,
  ExecutiveCommunityDashboard,
  FederationHealthAnalytics,
  GeographicHealthPoint,
  HealthDomainScores,
  HealthTrend,
  OrganizationalEcosystemHealth,
  ResilienceState,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function assertEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.COMMUNITY_HEALTH_ENABLED) throw new Error("Community Health Engine is not enabled.");
  return flags;
}

function resilienceFromScore(score: number): ResilienceState {
  if (score >= 95) return "model_community";
  if (score >= 82) return "highly_resilient";
  if (score >= 68) return "resilient";
  if (score >= 50) return "stable";
  if (score >= 30) return "developing";
  return "fragile";
}

function computeDomainScores(institutionId: string, communityId: string): HealthDomainScores {
  const civic = getParticipationHealthSummary();
  const leadership = getLeadershipHealthSummary();
  const relationships = getRelationshipHealthSummary();
  const collaboration = getCollaborationAnalytics(institutionId);
  const mentorship = getMentorshipGraph(institutionId);
  const resilience = computeNetworkResilience(institutionId);
  const events = listParticipationEvents(institutionId, communityId);
  const profiles = listLeadershipProfiles(institutionId);
  const projects = loadProjects().filter((p) => p.community_id === communityId);

  const mentorAvailable = mentorship.mentor_load
    ? Object.values(mentorship.mentor_load).filter((l) => l < 4).length
    : 0;
  const mentorTotal = Object.keys(mentorship.mentor_load ?? {}).length || 1;

  return {
    participation: Math.min(100, civic.average_participation_score ?? events.length * 6),
    leadership: Math.min(100, leadership.average_leadership_score || profiles.length * 8),
    volunteer_capacity: Math.min(100, (civic.active_participants ?? 0) * 5 + 20),
    relationship_density: Math.min(100, relationships.total_edges * 4 + relationships.average_strength / 2),
    organizational_health: Math.min(100, collaboration.cross_organization_projects * 15 + 30),
    community_collaboration: Math.min(100, collaboration.shared_missions * 10 + collaboration.cross_team_work * 8),
    education: Math.min(100, events.filter((e) => e.category === "training").length * 20),
    mentorship: Math.min(100, Math.round((mentorAvailable / mentorTotal) * 100)),
    community_projects: Math.min(100, projects.filter((p) => p.status === "active" || p.status === "completed").length * 25),
    institutional_stability: Math.min(100, 60 + collaboration.committee_participation * 5),
    resilience: Math.min(100, resilience.redundancy_score),
  };
}

function computeHealthIndex(domains: HealthDomainScores): number {
  const weights = loadHealthWeights().domains;
  let score = 0;
  for (const w of weights) {
    score += ((domains[w.key as keyof HealthDomainScores] ?? 0) as number) * w.weight;
  }
  return Math.round(score);
}

function trendFromHistory(communityId: string, currentScore: number): HealthTrend {
  const history = loadTrends().filter((t) => t.period.startsWith(communityId));
  if (history.length < 2) return currentScore >= 50 ? "growing" : "stable";
  const prev = history[history.length - 1].health_score;
  if (currentScore > prev + 3) return "growing";
  if (currentScore < prev - 3) return "declining";
  return "stable";
}

export function refreshCommunityHealthProfile(input: {
  community_id: string;
  county_id: string;
  region_id?: string;
  institution_id: string;
  actor_id: string;
}): CommunityHealthProfile {
  assertEnabled();
  const domains = computeDomainScores(input.institution_id, input.community_id);
  const healthScore = computeHealthIndex(domains);
  const resilienceScore = Math.round(
    (domains.resilience + domains.leadership + domains.volunteer_capacity + domains.organizational_health) / 4
  );
  const profiles = loadProfiles();
  const existing = profiles.find((p) => p.community_id === input.community_id);
  const trend = trendFromHistory(input.community_id, healthScore);

  const profile: CommunityHealthProfile = {
    id: existing?.id ?? id("chp"),
    community_id: input.community_id,
    county_id: input.county_id,
    region_id: input.region_id ?? null,
    institution_count: listParticipationEvents(input.institution_id).length > 0 ? 3 : 1,
    active_population: getParticipationHealthSummary().active_participants ?? 0,
    health_score: healthScore,
    resilience_score: resilienceScore,
    health_breakdown: domains,
    resilience_state: resilienceFromScore(resilienceScore),
    trend,
    last_updated: now(),
  };

  if (existing) {
    const idx = profiles.findIndex((p) => p.community_id === input.community_id);
    profiles[idx] = profile;
  } else {
    profiles.push(profile);
  }
  persistProfiles(profiles);

  const trends = loadTrends();
  trends.push({
    period: `${input.community_id}-${now().slice(0, 7)}`,
    health_score: healthScore,
    resilience_score: resilienceScore,
    participation_score: domains.participation,
    leadership_score: domains.leadership,
  });
  persistTrends(trends.slice(-120));

  recordCommunityHealthAudit({
    community_id: input.community_id,
    county_id: input.county_id,
    actor_id: input.actor_id,
    action: "health_profile_refreshed",
    target_type: "profile",
    target_id: profile.id,
    result: "success",
    metadata: { health_score: healthScore, resilience_score: resilienceScore },
  });

  detectCommunityRisks(input.community_id, input.institution_id, domains);
  return profile;
}

export function getCommunityHealthProfile(communityId: string) {
  return loadProfiles().find((p) => p.community_id === communityId) ?? null;
}

export function listCommunityHealthProfiles(countyId?: string) {
  const profiles = loadProfiles();
  return countyId ? profiles.filter((p) => p.county_id === countyId) : profiles;
}

export function getCommunityCapacity(communityId: string, institutionId: string): CommunityCapacityMetrics {
  const civic = getParticipationHealthSummary();
  const leadership = getLeadershipHealthSummary();
  const mentorship = getMentorshipGraph(institutionId);
  const collaboration = getCollaborationAnalytics(institutionId);

  const mentorSlots = Object.values(mentorship.mentor_load ?? {}).filter((l) => l < 4).length;
  const mentorTotal = Math.max(1, Object.keys(mentorship.mentor_load ?? {}).length);

  return {
    community_id: communityId,
    active_volunteers: civic.active_participants ?? 0,
    available_leaders: leadership.emerging_leaders + leadership.pipeline_depth,
    mentor_availability_percent: Math.round((mentorSlots / mentorTotal) * 100),
    organizational_readiness: Math.min(100, collaboration.cross_organization_projects * 20 + 40),
    collaboration_index: Math.min(100, collaboration.shared_missions * 8 + collaboration.volunteer_collaboration * 5),
    training_completion_percent: Math.min(100, listParticipationEvents(institutionId, communityId).filter((e) => e.category === "training").length * 15),
    capacity_score: 0,
    updated_at: now(),
  };
}

export function getOrganizationalEcosystem(communityId: string, institutionId: string): OrganizationalEcosystemHealth {
  const collaboration = getCollaborationAnalytics(institutionId);
  const connectors = identifyConnectors(institutionId);
  const orgNodes = collaboration.cross_organization_projects + 3;

  return {
    community_id: communityId,
    organization_count: orgNodes,
    healthy_organizations: Math.max(1, orgNodes - 1),
    shared_volunteer_overlap: collaboration.volunteer_collaboration,
    shared_leader_overlap: connectors.length,
    collaboration_density: Math.min(100, collaboration.cross_team_work * 10),
    partnership_strength: Math.min(100, collaboration.cross_organization_projects * 15 + 20),
  };
}

export function detectCommunityRisks(
  communityId: string,
  institutionId: string,
  domains?: HealthDomainScores
): CommunityRisk[] {
  const d = domains ?? computeDomainScores(institutionId, communityId);
  const risks: CommunityRisk[] = [];

  if (d.mentorship < 40) {
    risks.push({
      id: id("risk"),
      community_id: communityId,
      severity: "warning",
      risk_type: "mentor_shortage",
      title: "Mentorship availability declining",
      message: "Mentor availability has dropped below healthy threshold",
      suggested_action: "Expand mentor recruitment and reduce mentor load",
      detected_at: now(),
    });
  }
  if (d.leadership < 35) {
    risks.push({
      id: id("risk"),
      community_id: communityId,
      severity: "critical",
      risk_type: "leadership_shortage",
      title: "Leadership pipeline shallow",
      message: "Insufficient emerging leaders for community sustainability",
      suggested_action: "Invest in leadership development cohorts",
      detected_at: now(),
    });
  }
  if (d.participation < 30) {
    risks.push({
      id: id("risk"),
      community_id: communityId,
      severity: "warning",
      risk_type: "declining_participation",
      title: "Participation trending low",
      message: "Community participation below sustainable levels",
      suggested_action: "Launch volunteer recruitment and community projects",
      detected_at: now(),
    });
  }
  if (d.community_collaboration < 25) {
    risks.push({
      id: id("risk"),
      community_id: communityId,
      severity: "warning",
      risk_type: "weak_collaboration",
      title: "Weak cross-organization collaboration",
      message: "Organizations operating in isolation",
      suggested_action: "Facilitate coalition projects and partnerships",
      detected_at: now(),
    });
  }
  if (d.volunteer_capacity < 30) {
    risks.push({
      id: id("risk"),
      community_id: communityId,
      severity: "warning",
      risk_type: "volunteer_burnout",
      title: "Volunteer capacity strained",
      message: "Limited volunteer redundancy increases burnout risk",
      suggested_action: "Distribute workload and recruit new volunteers",
      detected_at: now(),
    });
  }

  persistRisks(risks);
  return risks;
}

export function mapCommunityOpportunities(communityId: string, institutionId: string): CommunityOpportunity[] {
  assertEnabled();
  const domains = computeDomainScores(institutionId, communityId);
  const leadership = getLeadershipHealthSummary();
  const opps: CommunityOpportunity[] = [];

  if (domains.mentorship < 50) {
    opps.push({
      id: id("opp"),
      community_id: communityId,
      opportunity_type: "organizational_support",
      title: "Expand mentor recruitment",
      reason: "Mentorship availability below community health target",
      confidence_percent: 82,
      advisory_only: true,
      generated_at: now(),
    });
  }
  if (domains.community_collaboration < 60) {
    opps.push({
      id: id("opp"),
      community_id: communityId,
      opportunity_type: "partnership",
      title: "Cross-organization coalition project",
      reason: "Collaboration density can strengthen civic resilience",
      confidence_percent: 70,
      advisory_only: true,
      generated_at: now(),
    });
  }
  if (leadership.emerging_leaders > 0) {
    opps.push({
      id: id("opp"),
      community_id: communityId,
      opportunity_type: "emerging_leader",
      title: "Develop emerging leaders into program roles",
      reason: `${leadership.emerging_leaders} emerging leaders identified`,
      confidence_percent: 75,
      advisory_only: true,
      generated_at: now(),
    });
  }
  if (domains.participation > 50 && domains.volunteer_capacity < 60) {
    opps.push({
      id: id("opp"),
      community_id: communityId,
      opportunity_type: "volunteer_growth",
      title: "Convert participants into sustained volunteers",
      reason: "Strong participation with room for volunteer depth",
      confidence_percent: 68,
      advisory_only: true,
      generated_at: now(),
    });
  }

  persistOpportunities(opps);
  return opps;
}

export function recordCommunityProject(input: {
  community_id: string;
  county_id: string;
  title: string;
  category: CommunityProject["category"];
  organizations_involved: string[];
  actor_id: string;
  institution_id: string;
}): CommunityProject {
  assertEnabled();
  const project: CommunityProject = {
    id: id("cproj"),
    community_id: input.community_id,
    county_id: input.county_id,
    title: input.title,
    category: input.category,
    organizations_involved: input.organizations_involved,
    status: "active",
    started_at: now(),
    completed_at: null,
  };
  const projects = loadProjects();
  projects.push(project);
  persistProjects(projects);

  refreshCommunityHealthProfile({
    community_id: input.community_id,
    county_id: input.county_id,
    institution_id: input.institution_id,
    actor_id: input.actor_id,
  });

  recordCommunityHealthAudit({
    community_id: input.community_id,
    county_id: input.county_id,
    actor_id: input.actor_id,
    action: "project_recorded",
    target_type: "project",
    target_id: project.id,
    result: "success",
  });
  return project;
}

export function getGeographicHealthMap(countyId?: string): GeographicHealthPoint[] {
  const profiles = listCommunityHealthProfiles(countyId);
  const points: GeographicHealthPoint[] = profiles.map((p) => ({
    geo_id: p.community_id,
    geo_type: "city" as const,
    label: p.community_id.replace(/-/g, " "),
    health_score: p.health_score,
    resilience_score: p.resilience_score,
    participation_score: p.health_breakdown.participation,
    leadership_score: p.health_breakdown.leadership,
    capacity_score: Math.round((p.health_breakdown.volunteer_capacity + p.health_breakdown.leadership) / 2),
    trend: p.trend,
  }));

  if (countyId && profiles.length) {
    const avgHealth = Math.round(profiles.reduce((s, p) => s + p.health_score, 0) / profiles.length);
    points.push({
      geo_id: countyId,
      geo_type: "county",
      label: countyId.replace(/-/g, " "),
      health_score: avgHealth,
      resilience_score: Math.round(profiles.reduce((s, p) => s + p.resilience_score, 0) / profiles.length),
      participation_score: Math.round(profiles.reduce((s, p) => s + p.health_breakdown.participation, 0) / profiles.length),
      leadership_score: Math.round(profiles.reduce((s, p) => s + p.health_breakdown.leadership, 0) / profiles.length),
      capacity_score: Math.round(profiles.reduce((s, p) => s + p.health_breakdown.volunteer_capacity, 0) / profiles.length),
      trend: profiles.filter((p) => p.trend === "growing").length > profiles.length / 2 ? "growing" : "stable",
    });
  }

  persistGeographicPoints(points);
  return points;
}

export function getLongitudinalTrends(communityId: string) {
  return loadTrends().filter((t) => t.period.startsWith(communityId));
}

export function getCommunityBenchmark(communityId: string): import("./types").CommunityBenchmark {
  const profile = getCommunityHealthProfile(communityId);
  const score = profile?.health_score ?? 50;
  const peerAverage = 62;
  const percentile = Math.min(99, Math.max(1, Math.round((score / 100) * 85)));

  const benchmark = {
    community_id: communityId,
    peer_group: "similar_sized_communities",
    community_health_score: score,
    peer_average_score: peerAverage,
    percentile,
    anonymous: true as const,
    compared_at: now(),
  };
  const benchmarks = loadBenchmarks();
  benchmarks.push(benchmark);
  persistBenchmarks(benchmarks.slice(-50));
  return benchmark;
}

export function getCommunityDashboard(communityId: string, institutionId: string): CommunityHealthDashboard {
  const profile = getCommunityHealthProfile(communityId);
  const mentorship = getMentorshipGraph(institutionId);
  const mentorHealth =
    Object.values(mentorship.mentor_load ?? {}).some((l) => l >= 4)
      ? "at_risk"
      : mentorship.edges.length
        ? "healthy"
        : "monitor";

  return {
    community_id: communityId,
    community_health_percent: profile?.health_score ?? 0,
    leadership_capacity_percent: profile?.health_breakdown.leadership ?? 0,
    volunteer_capacity_percent: profile?.health_breakdown.volunteer_capacity ?? 0,
    organizations: profile?.institution_count ?? 0,
    mentorship_status: mentorHealth,
    community_trend: profile?.trend ?? "stable",
    resilience_label: profile?.resilience_state ?? "developing",
  };
}

export function getExecutiveCommunityDashboard(countyId: string): ExecutiveCommunityDashboard {
  const profiles = listCommunityHealthProfiles(countyId);
  const risks = detectCommunityRisks(profiles[0]?.community_id ?? countyId, "inst-block-street");
  const opps = mapCommunityOpportunities(profiles[0]?.community_id ?? countyId, "inst-block-street");

  return {
    county_id: countyId,
    county_health_percent: profiles.length
      ? Math.round(profiles.reduce((s, p) => s + p.health_score, 0) / profiles.length)
      : 0,
    communities_tracked: profiles.length,
    leadership_shortages: risks.filter((r) => r.risk_type === "leadership_shortage").length,
    volunteer_trend: profiles.some((p) => p.trend === "growing") ? "growing" : "stable",
    opportunities_count: opps.length,
    resilience_map_summary: `${profiles.filter((p) => p.resilience_state === "resilient" || p.resilience_state === "highly_resilient").length} resilient communities`,
    at_risk_communities: profiles.filter((p) => p.resilience_state === "fragile" || p.resilience_state === "developing").length,
  };
}

export function generateCommunityReport(input: {
  report_type: CommunityHealthReport["report_type"];
  community_id?: string;
  county_id?: string;
  actor_id: string;
}): CommunityHealthReport {
  assertEnabled();
  const profiles = input.community_id
    ? [getCommunityHealthProfile(input.community_id)].filter(Boolean)
    : listCommunityHealthProfiles(input.county_id);

  const report: CommunityHealthReport = {
    id: id("crep"),
    report_type: input.report_type,
    community_id: input.community_id ?? null,
    county_id: input.county_id ?? profiles[0]?.county_id ?? null,
    title:
      input.report_type === "annual"
        ? "Annual Community Health Report"
        : input.report_type === "county"
          ? "County Civic Health Report"
          : input.report_type === "regional"
            ? "Regional Resilience Report"
            : `${input.report_type} Report`,
    period_start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    period_end: now(),
    summary: `Aggregated community health analysis for ${profiles.length} communit${profiles.length === 1 ? "y" : "ies"}. Individual participation data excluded.`,
    aggregated_only: true,
    generated_at: now(),
    sections: [
      {
        heading: "Community Health Index",
        content: profiles.length
          ? `Average health score: ${Math.round(profiles.reduce((s, p) => s + (p?.health_score ?? 0), 0) / profiles.length)}%`
          : "Insufficient data",
      },
      {
        heading: "Resilience",
        content: profiles.length
          ? `${profiles.filter((p) => p && (p.resilience_state === "resilient" || p.resilience_state === "highly_resilient")).length} communities rated resilient or above`
          : "Baseline assessment pending",
      },
      {
        heading: "Capacity",
        content: "Volunteer, leadership, and organizational capacity measured through aggregated platform signals.",
      },
    ],
  };

  const reports = loadReports();
  reports.push(report);
  persistReports(reports);

  recordCommunityHealthAudit({
    community_id: input.community_id ?? null,
    county_id: input.county_id ?? null,
    actor_id: input.actor_id,
    action: "report_generated",
    target_type: "report",
    target_id: report.id,
    result: "success",
  });
  return report;
}

export function getFederationHealthAnalytics(): FederationHealthAnalytics {
  const profiles = loadProfiles();
  const avgHealth = profiles.length
    ? Math.round(profiles.reduce((s, p) => s + p.health_score, 0) / profiles.length)
    : 0;
  const leadership = getLeadershipHealthSummary();
  const relationships = getRelationshipHealthSummary();

  return {
    aggregate_health_index: avgHealth,
    growth_trend: profiles.filter((p) => p.trend === "growing").length > profiles.length / 2 ? "growing" : "stable",
    organizational_diversity_index: Math.min(100, relationships.total_nodes * 3),
    leadership_development_index: Math.min(100, leadership.average_leadership_score),
    civic_resilience_index: profiles.length
      ? Math.round(profiles.reduce((s, p) => s + p.resilience_score, 0) / profiles.length)
      : 0,
    privacy_note: "Federation receives aggregated health metrics only — institution-specific data governed separately.",
  };
}

export function getCommunityHealthInsights(communityId: string, institutionId: string): CommunityHealthInsight[] {
  const domains = computeDomainScores(institutionId, communityId);
  const insights: CommunityHealthInsight[] = [];

  if (domains.mentorship < 50) {
    insights.push({
      insight_type: "mentorship",
      title: "Mentor recruitment recommended",
      message: "Expanding mentor availability would strengthen community health.",
      advisory_only: true,
      generated_at: now(),
    });
  }
  if (domains.community_collaboration < 50) {
    insights.push({
      insight_type: "partnership",
      title: "Partnership opportunity",
      message: "Cross-organization projects can improve collaboration and resilience scores.",
      advisory_only: true,
      generated_at: now(),
    });
  }
  if (domains.resilience < 50) {
    insights.push({
      insight_type: "resilience",
      title: "Build leadership redundancy",
      message: "Develop additional leaders to reduce single-point dependencies.",
      advisory_only: true,
      generated_at: now(),
    });
  }
  return insights;
}

export { listCommunityHealthAudit };
