import {
  loadCohorts,
  loadCompetencyCatalog,
  loadCompetencyRecords,
  loadDevelopmentPlans,
  loadEvidence,
  loadFeatureFlags,
  loadHealthSummary,
  loadMentorProfiles,
  loadMentorships,
  loadOpportunities,
  loadPrivacySettings,
  loadProfiles,
  loadScoreWeights,
  loadSuccessionPlans,
  persistCohorts,
  persistCompetencyRecords,
  persistDevelopmentPlans,
  persistEvidence,
  persistHealthSummary,
  persistMentorProfiles,
  persistMentorships,
  persistOpportunities,
  persistPrivacySettings,
  persistProfiles,
  persistSuccessionPlans,
} from "./data";
import { listLeadershipAudit, recordLeadershipAudit } from "./audit";
import type {
  CompetencyLevel,
  ExecutiveLeadershipDashboard,
  LeadershipCohort,
  LeadershipDevelopmentPlan,
  LeadershipEvidence,
  LeadershipHealthSummary,
  LeadershipInsight,
  LeadershipOpportunity,
  LeadershipPrivacySettings,
  LeadershipProfile,
  LeadershipStage,
  MentorshipRelationship,
  ReadinessLevel,
  SuccessionPlan,
  SuccessionRisk,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function assertLeadershipEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.LEADERSHIP_PLATFORM_ENABLED) throw new Error("Leadership platform is not enabled.");
  return flags;
}

function stageFromScore(score: number): LeadershipStage {
  if (score >= 92) return "legacy_builder";
  if (score >= 82) return "strategic_leader";
  if (score >= 72) return "mentor";
  if (score >= 62) return "institution_leader";
  if (score >= 52) return "program_leader";
  if (score >= 42) return "team_leader";
  if (score >= 28) return "emerging_leader";
  if (score >= 14) return "reliable_contributor";
  return "participant";
}

function readinessFromScore(score: number): ReadinessLevel {
  if (score >= 80) return "ready_for_advancement";
  if (score >= 65) return "ready";
  if (score >= 50) return "ready_with_mentoring";
  if (score >= 35) return "nearly_ready";
  if (score >= 15) return "developing";
  return "not_ready";
}

function competencyLevelFromCount(count: number): CompetencyLevel {
  if (count >= 8) return "master";
  if (count >= 5) return "mentor";
  if (count >= 3) return "advanced";
  if (count >= 2) return "independent";
  if (count >= 1) return "practicing";
  return "learning";
}

function getOrCreateProfile(userId: string, institutionId: string): LeadershipProfile {
  const profiles = loadProfiles();
  let profile = profiles.find((p) => p.user_id === userId && p.institution_id === institutionId);
  if (profile) return profile;
  profile = {
    id: id("ldr"),
    user_id: userId,
    institution_id: institutionId,
    leadership_stage: "participant",
    leadership_score: 0,
    readiness_level: "not_ready",
    mentor_id: null,
    development_plan_id: null,
    succession_candidates: [],
    strengths: [],
    growth_areas: loadCompetencyCatalog().slice(0, 3),
    score_breakdown: {},
    updated_at: now(),
  };
  profiles.push(profile);
  persistProfiles(profiles);
  return profile;
}

function computeLeadershipScoreComponents(userId: string, institutionId: string) {
  const evidence = loadEvidence().filter((e) => e.user_id === userId && e.institution_id === institutionId);
  const competencies = loadCompetencyRecords().filter((c) => c.user_id === userId && c.institution_id === institutionId);
  const mentorships = loadMentorships().filter((m) => m.mentor_id === userId && m.status === "active");
  const weights = loadScoreWeights().components;

  const participation = Math.min(100, evidence.length * 8);
  const reliability = Math.min(100, evidence.filter((e) => e.verification_level !== "self_reported").length * 12);
  const competencyScore = competencies.length ? Math.round(competencies.reduce((s, c) => s + c.evidence_count * 10, 0) / competencies.length) : 0;
  const mentoring = Math.min(100, mentorships.length * 25 + evidence.filter((e) => e.activity_type === "mentored_volunteer").length * 15);
  const training = Math.min(100, evidence.filter((e) => e.activity_type === "delivered_training").length * 20);
  const community = Math.min(100, evidence.filter((e) => e.activity_type.includes("community") || e.activity_type.includes("project")).length * 15);
  const collaboration = Math.min(100, evidence.filter((e) => e.competency === "Community Building").length * 18);

  const values: Record<string, number> = {
    participation,
    reliability,
    competencies: Math.min(100, competencyScore),
    mentoring,
    training,
    community_contribution: community,
    collaboration,
  };

  const breakdown: Record<string, number> = {};
  let score = 0;
  for (const w of weights) {
    breakdown[w.key] = values[w.key] ?? 0;
    score += (values[w.key] ?? 0) * w.weight;
  }
  return { score: Math.round(score), breakdown, values };
}

function refreshHealthSummary() {
  const profiles = loadProfiles();
  const succession = loadSuccessionPlans();
  const mentors = loadMentorProfiles();
  const cohorts = loadCohorts().filter((c) => c.status === "active");
  const emerging = profiles.filter((p) => p.leadership_stage === "emerging_leader" || p.readiness_level === "nearly_ready" || p.readiness_level === "ready");
  const mentorCapacity = mentors.length ? Math.round((mentors.filter((m) => m.availability !== "unavailable").length / mentors.length) * 100) : 100;
  const successionReady = succession.length
    ? Math.round((succession.filter((s) => s.risk_level === "healthy" || s.risk_level === "monitor").length / succession.length) * 100)
    : 100;

  const summary: LeadershipHealthSummary = {
    pipeline_depth: profiles.length,
    emerging_leaders: emerging.length,
    mentor_capacity_percent: mentorCapacity,
    succession_ready_percent: successionReady,
    average_leadership_score: profiles.length ? Math.round(profiles.reduce((s, p) => s + p.leadership_score, 0) / profiles.length) : 0,
    high_risk_roles: succession.filter((s) => s.risk_level === "high_risk" || s.risk_level === "critical").length,
    cohorts_active: cohorts.length,
    updated_at: now(),
  };
  persistHealthSummary(summary);
  return summary;
}

export function getLeadershipHealthSummary() {
  return loadHealthSummary();
}

export function getLeadershipProfile(userId: string, institutionId: string) {
  return getOrCreateProfile(userId, institutionId);
}

export function listLeadershipProfiles(institutionId?: string) {
  const profiles = loadProfiles();
  return institutionId ? profiles.filter((p) => p.institution_id === institutionId) : profiles;
}

export function recordLeadershipEvidence(input: {
  user_id: string;
  institution_id: string;
  competency: string;
  activity_type: string;
  evidence_reference?: string;
  verification_level?: LeadershipEvidence["verification_level"];
  impact_score?: number;
  actor_id: string;
}): LeadershipEvidence {
  assertLeadershipEnabled();
  const record: LeadershipEvidence = {
    id: id("lev"),
    user_id: input.user_id,
    institution_id: input.institution_id,
    competency: input.competency,
    activity_type: input.activity_type,
    evidence_reference: input.evidence_reference ?? null,
    verification_level: input.verification_level ?? "self_reported",
    impact_score: input.impact_score ?? 3,
    date: now(),
  };
  const all = loadEvidence();
  all.push(record);
  persistEvidence(all);
  updateCompetencyFromEvidence(input.user_id, input.institution_id, input.competency);
  computeLeadershipScore(input.user_id, input.institution_id, input.actor_id);
  recordLeadershipAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "evidence.recorded",
    target_type: "leadership_evidence",
    target_id: record.id,
    result: "success",
    metadata: { competency: input.competency, verification: record.verification_level },
  });
  return record;
}

function updateCompetencyFromEvidence(userId: string, institutionId: string, competency: string) {
  const records = loadCompetencyRecords();
  const evidence = loadEvidence().filter((e) => e.user_id === userId && e.institution_id === institutionId && e.competency === competency);
  const count = evidence.length;
  const idx = records.findIndex((r) => r.user_id === userId && r.institution_id === institutionId && r.competency === competency);
  const record = {
    id: idx >= 0 ? records[idx].id : id("comp"),
    user_id: userId,
    institution_id: institutionId,
    competency,
    level: competencyLevelFromCount(count),
    evidence_count: count,
    updated_at: now(),
  };
  if (idx >= 0) records[idx] = record;
  else records.push(record);
  persistCompetencyRecords(records);
  return record;
}

export function identifyEmergingLeaders(institutionId: string, actorId: string) {
  assertLeadershipEnabled();
  const profiles = loadProfiles().filter((p) => p.institution_id === institutionId);
  const candidates: LeadershipProfile[] = [];
  for (const p of profiles) {
    const evidence = loadEvidence().filter((e) => e.user_id === p.user_id && e.institution_id === institutionId);
    const verified = evidence.filter((e) => e.verification_level === "leader_verified" || e.verification_level === "system_verified");
    const mentoring = evidence.filter((e) => e.activity_type === "mentored_volunteer");
    if (verified.length >= 2 && (p.leadership_score >= 25 || mentoring.length >= 1)) {
      const updated = { ...p, leadership_stage: "emerging_leader" as LeadershipStage, updated_at: now() };
      const idx = profiles.findIndex((x) => x.id === p.id);
      if (idx >= 0) {
        const all = loadProfiles();
        all[all.findIndex((x) => x.id === p.id)] = updated;
        persistProfiles(all);
      }
      candidates.push(updated);
      recordLeadershipAudit({
        institution_id: institutionId,
        actor_id: actorId,
        action: "emerging_leader.identified",
        target_type: "leadership_profile",
        target_id: p.user_id,
        result: "success",
        metadata: { advisory: true, auto_promote: false },
      });
    }
  }
  refreshHealthSummary();
  return candidates;
}

export function assignMentor(input: {
  mentor_id: string;
  mentee_id: string;
  institution_id: string;
  actor_id: string;
}): MentorshipRelationship {
  assertLeadershipEnabled();
  const relationship: MentorshipRelationship = {
    id: id("mentor"),
    mentor_id: input.mentor_id,
    mentee_id: input.mentee_id,
    institution_id: input.institution_id,
    relationship_type: "one_on_one",
    status: "active",
    started_at: now(),
  };
  const all = loadMentorships();
  all.push(relationship);
  persistMentorships(all);

  let mentors = loadMentorProfiles();
  let mentor = mentors.find((m) => m.user_id === input.mentor_id && m.institution_id === input.institution_id);
  if (!mentor) {
    mentor = {
      id: id("mprof"),
      user_id: input.mentor_id,
      institution_id: input.institution_id,
      experience_years: 5,
      competencies: ["Coaching", "Communication", "Community Building"],
      expertise_areas: ["volunteer_coordination", "community_organizing"],
      availability: "available",
      active_mentees: [input.mentee_id],
      mentorship_history_count: 1,
    };
    mentors.push(mentor);
  } else {
    mentor = { ...mentor, active_mentees: [...new Set([...mentor.active_mentees, input.mentee_id])] };
    mentors[mentors.findIndex((m) => m.id === mentor!.id)] = mentor;
  }
  persistMentorProfiles(mentors);

  const profiles = loadProfiles();
  const idx = profiles.findIndex((p) => p.user_id === input.mentee_id && p.institution_id === input.institution_id);
  if (idx >= 0) {
    profiles[idx] = { ...profiles[idx], mentor_id: input.mentor_id, updated_at: now() };
    persistProfiles(profiles);
  }

  recordLeadershipAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "mentorship.assigned",
    target_type: "mentorship",
    target_id: relationship.id,
    result: "success",
  });
  return relationship;
}

export function createDevelopmentPlan(input: {
  user_id: string;
  institution_id: string;
  mentor_id?: string;
  target_stage?: LeadershipStage;
  actor_id: string;
}): LeadershipDevelopmentPlan {
  assertLeadershipEnabled();
  const catalog = loadCompetencyCatalog();
  const profile = getOrCreateProfile(input.user_id, input.institution_id);
  const plan: LeadershipDevelopmentPlan = {
    id: id("plan"),
    user_id: input.user_id,
    institution_id: input.institution_id,
    mentor_id: input.mentor_id ?? profile.mentor_id,
    target_stage: input.target_stage ?? "team_leader",
    competencies: catalog.slice(0, 5),
    recommended_training: ["Leadership fundamentals", "Conflict resolution workshop", "Community organizing 101"],
    recommended_missions: ["Lead a community meeting", "Mentor two new volunteers", "Coordinate neighborhood event"],
    target_date: null,
    status: "active",
    created_at: now(),
  };
  const plans = loadDevelopmentPlans();
  plans.push(plan);
  persistDevelopmentPlans(plans);

  const profiles = loadProfiles();
  const idx = profiles.findIndex((p) => p.user_id === input.user_id && p.institution_id === input.institution_id);
  if (idx >= 0) {
    profiles[idx] = { ...profiles[idx], development_plan_id: plan.id, growth_areas: plan.competencies.slice(2), strengths: plan.competencies.slice(0, 2), updated_at: now() };
    persistProfiles(profiles);
  }

  recordLeadershipAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "development_plan.created",
    target_type: "development_plan",
    target_id: plan.id,
    result: "success",
  });
  return plan;
}

export function joinLeadershipCohort(input: {
  cohort_id: string;
  user_id: string;
  institution_id: string;
  actor_id: string;
}): LeadershipCohort {
  const cohorts = loadCohorts();
  const idx = cohorts.findIndex((c) => c.id === input.cohort_id);
  if (idx < 0) throw new Error("Cohort not found.");
  const cohort = cohorts[idx];
  if (!cohort.member_ids.includes(input.user_id)) {
    cohort.member_ids.push(input.user_id);
    cohorts[idx] = { ...cohort, status: "active" };
    persistCohorts(cohorts);
  }
  recordLeadershipAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "cohort.joined",
    target_type: "leadership_cohort",
    target_id: input.cohort_id,
    result: "success",
  });
  return cohorts[idx];
}

export function createLeadershipCohort(input: {
  institution_id: string;
  name: string;
  cohort_type: LeadershipCohort["cohort_type"];
  mentor_ids: string[];
  actor_id: string;
}): LeadershipCohort {
  assertLeadershipEnabled();
  const cohort: LeadershipCohort = {
    id: id("cohort"),
    institution_id: input.institution_id,
    name: input.name,
    cohort_type: input.cohort_type,
    curriculum: ["Leadership foundations", "Community organizing", "Mentorship practice", "Reflection sessions"],
    mentor_ids: input.mentor_ids,
    member_ids: [],
    status: "forming",
    created_at: now(),
  };
  const cohorts = loadCohorts();
  cohorts.push(cohort);
  persistCohorts(cohorts);
  recordLeadershipAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "cohort.created",
    target_type: "leadership_cohort",
    target_id: cohort.id,
    result: "success",
  });
  refreshHealthSummary();
  return cohort;
}

export function computeLeadershipScore(userId: string, institutionId: string, actorId: string): LeadershipProfile {
  assertLeadershipEnabled();
  const { score, breakdown } = computeLeadershipScoreComponents(userId, institutionId);
  const profiles = loadProfiles();
  const idx = profiles.findIndex((p) => p.user_id === userId && p.institution_id === institutionId);
  const base = idx >= 0 ? profiles[idx] : getOrCreateProfile(userId, institutionId);
  const competencies = loadCompetencyRecords().filter((c) => c.user_id === userId);
  const updated: LeadershipProfile = {
    ...base,
    leadership_score: score,
    leadership_stage: stageFromScore(score),
    readiness_level: readinessFromScore(score),
    strengths: competencies.filter((c) => c.level === "advanced" || c.level === "mentor" || c.level === "master").map((c) => c.competency).slice(0, 4),
    growth_areas: competencies.filter((c) => c.level === "learning" || c.level === "practicing").map((c) => c.competency).slice(0, 4),
    score_breakdown: breakdown,
    updated_at: now(),
  };
  if (idx >= 0) profiles[idx] = updated;
  else profiles.push(updated);
  persistProfiles(profiles);
  refreshHealthSummary();
  recordLeadershipAudit({
    institution_id: institutionId,
    actor_id: actorId,
    action: "leadership.score_computed",
    target_type: "leadership_profile",
    target_id: userId,
    result: "success",
    metadata: { score, breakdown },
  });
  return updated;
}

export function getTeamLeaderOpportunities(userId: string, institutionId: string): LeadershipOpportunity[] {
  const profile = getOrCreateProfile(userId, institutionId);
  const eligible = profile.readiness_level === "ready" || profile.readiness_level === "ready_for_advancement" || profile.leadership_stage === "emerging_leader";
  if (!eligible) return [];
  const opp: LeadershipOpportunity = {
    id: id("opp"),
    institution_id: institutionId,
    title: "Team Leader — Community Workshop",
    opportunity_type: "team_leader",
    target_stage: "team_leader",
    recommended_for_user_id: userId,
    status: "recommended",
  };
  const opps = loadOpportunities();
  if (!opps.some((o) => o.recommended_for_user_id === userId && o.opportunity_type === "team_leader")) {
    opps.push(opp);
    persistOpportunities(opps);
  }
  return opps.filter((o) => o.recommended_for_user_id === userId);
}

export function getExecutiveDashboard(institutionId: string): ExecutiveLeadershipDashboard {
  const health = refreshHealthSummary();
  const succession = loadSuccessionPlans().filter((s) => s.institution_id === institutionId);
  const worstRisk = succession.reduce<SuccessionRisk>((worst, s) => {
    const order: SuccessionRisk[] = ["healthy", "monitor", "needs_development", "high_risk", "critical"];
    return order.indexOf(s.risk_level) > order.indexOf(worst) ? s.risk_level : worst;
  }, "healthy");
  const cohorts = loadCohorts().filter((c) => c.institution_id === institutionId && c.status === "active");
  const mentors = loadMentorProfiles().filter((m) => m.institution_id === institutionId);
  return {
    institution_id: institutionId,
    pipeline_health: health.emerging_leaders >= 2 ? "healthy" : health.emerging_leaders >= 1 ? "monitor" : "at_risk",
    emerging_leaders: health.emerging_leaders,
    succession_health: worstRisk,
    cohort_progress_percent: cohorts.length ? Math.round((cohorts.reduce((s, c) => s + c.member_ids.length, 0) / (cohorts.length * 10)) * 100) : 0,
    mentor_availability: mentors.filter((m) => m.availability === "available").length,
    leadership_gaps: health.high_risk_roles > 0 ? ["County coordinator succession", "Mentor capacity"] : [],
  };
}

export function createSuccessionPlan(input: {
  institution_id: string;
  role: string;
  current_leader_id: string;
  candidate_user_ids: string[];
  actor_id: string;
}): SuccessionPlan {
  assertLeadershipEnabled();
  const candidates = input.candidate_user_ids.map((uid) => {
    const profile = getOrCreateProfile(uid, input.institution_id);
    return { user_id: uid, readiness_level: profile.readiness_level };
  });
  const risk: SuccessionRisk = candidates.some((c) => c.readiness_level === "ready" || c.readiness_level === "ready_for_advancement")
    ? "monitor"
    : candidates.some((c) => c.readiness_level === "nearly_ready")
      ? "needs_development"
      : "high_risk";

  const plan: SuccessionPlan = {
    id: id("succ"),
    institution_id: input.institution_id,
    role: input.role,
    current_leader_id: input.current_leader_id,
    candidate_list: candidates,
    risk_level: risk,
    development_actions: ["Assign mentor", "Complete leadership cohort", "Shadow current leader"],
    review_date: now(),
    updated_at: now(),
  };
  const plans = loadSuccessionPlans();
  plans.push(plan);
  persistSuccessionPlans(plans);
  recordLeadershipAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "succession.created",
    target_type: "succession_plan",
    target_id: plan.id,
    result: "success",
    metadata: { risk_level: risk, candidates: candidates.length },
  });
  refreshHealthSummary();
  return plan;
}

export function getLeadershipInsights(userId: string, institutionId: string): LeadershipInsight[] {
  const profile = getOrCreateProfile(userId, institutionId);
  const insights: LeadershipInsight[] = [];
  if (profile.leadership_score >= 45) {
    insights.push({
      user_id: userId,
      insight_type: "training",
      title: "Advanced leadership training recommended",
      message: "Based on consistent participation and verified evidence, advanced leadership training may accelerate readiness. Advisory only—no appointment decisions.",
      advisory_only: true,
      generated_at: now(),
    });
  }
  if (profile.growth_areas.length > 0) {
    insights.push({
      user_id: userId,
      insight_type: "coaching",
      title: `Develop ${profile.growth_areas[0]}`,
      message: `Your development plan suggests focusing on ${profile.growth_areas[0]} through practice opportunities and mentorship.`,
      advisory_only: true,
      generated_at: now(),
    });
  }
  return insights;
}

export function updateLeadershipPrivacy(input: {
  user_id: string;
  institution_id: string;
  public_leadership_profile?: boolean;
  achievement_sharing?: boolean;
  evaluations_private?: boolean;
  actor_id: string;
}) {
  const all = loadPrivacySettings().filter((p) => !(p.user_id === input.user_id && p.institution_id === input.institution_id));
  const existing = loadPrivacySettings().find((p) => p.user_id === input.user_id && p.institution_id === input.institution_id);
  const updated: LeadershipPrivacySettings = {
    user_id: input.user_id,
    institution_id: input.institution_id,
    public_leadership_profile: input.public_leadership_profile ?? existing?.public_leadership_profile ?? false,
    mentoring_visibility: existing?.mentoring_visibility ?? false,
    achievement_sharing: input.achievement_sharing ?? existing?.achievement_sharing ?? false,
    evaluations_private: input.evaluations_private ?? true,
    updated_at: now(),
  };
  all.push(updated);
  persistPrivacySettings(all);
  recordLeadershipAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "privacy.updated",
    target_type: "leadership_privacy",
    target_id: input.user_id,
    result: "success",
  });
  return updated;
}

export function listCompetencyRecords(userId: string, institutionId: string) {
  return loadCompetencyRecords().filter((c) => c.user_id === userId && c.institution_id === institutionId);
}

export function listEvidence(userId?: string, institutionId?: string) {
  let items = loadEvidence();
  if (userId) items = items.filter((e) => e.user_id === userId);
  if (institutionId) items = items.filter((e) => e.institution_id === institutionId);
  return items;
}

export function listCohorts(institutionId?: string) {
  const cohorts = loadCohorts();
  return institutionId ? cohorts.filter((c) => c.institution_id === institutionId) : cohorts;
}

export function listSuccessionPlans(institutionId?: string) {
  const plans = loadSuccessionPlans();
  return institutionId ? plans.filter((p) => p.institution_id === institutionId) : plans;
}

export { listLeadershipAudit };
