import {
  loadCivicHabits,
  loadCivicMilestones,
  loadCivicTimeline,
  loadEngagementTrends,
  loadFeatureFlags,
  loadHealthSummary,
  loadMilestoneCatalog,
  loadParticipationCatalog,
  loadParticipationEvents,
  loadParticipationForecasts,
  loadParticipationScores,
  loadParticipationWeights,
  loadPrivacySettings,
  loadUserParticipationScores,
  loadVolunteerRecords,
  persistCivicHabits,
  persistCivicMilestones,
  persistCivicTimeline,
  persistEngagementTrends,
  persistHealthSummary,
  persistParticipationEvents,
  persistParticipationForecasts,
  persistParticipationScores,
  persistPrivacySettings,
  persistUserParticipationScores,
  persistVolunteerRecords,
} from "./data";
import { listCivicAudit, recordCivicAudit } from "./audit";
import type {
  CivicHabitRecord,
  CivicJourneyStage,
  CivicMilestone,
  CivicParticipationScore,
  CivicTimelineEntry,
  CountyParticipationDashboard,
  EngagementIntervention,
  EngagementTrend,
  EventCategory,
  FederationParticipationAnalytics,
  OrganizationParticipationDashboard,
  ParticipationEvent,
  ParticipationEventType,
  ParticipationForecast,
  ParticipationHealthSummary,
  ParticipationInsight,
  ParticipationMomentum,
  ParticipationPrivacySettings,
  UserParticipationDashboard,
  VerificationStatus,
  VolunteerRecord,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

const EVENT_CATEGORY_MAP: Record<ParticipationEventType, EventCategory> = {
  volunteer_shift: "volunteer",
  meeting_attended: "meeting",
  training_completed: "training",
  mission_completed: "mission",
  event_attendance: "event_attendance",
  event_leadership: "event_leadership",
  mentoring: "mentoring",
  membership_joined: "recruitment",
  recruitment: "recruitment",
  content_created: "content",
  research: "research",
  planning: "planning",
  public_comment: "public_comment",
  community_project: "community_project",
  campaign_activity: "campaign_activity",
  coalition_activity: "coalition_activity",
  outreach_action: "volunteer",
  community_action: "community_project",
};

const DEFAULT_IMPACT: Partial<Record<ParticipationEventType, number>> = {
  meeting_attended: 1,
  volunteer_shift: 3,
  event_leadership: 5,
  recruitment: 4,
  membership_joined: 4,
  mentoring: 6,
  community_project: 8,
  mission_completed: 3,
  training_completed: 2,
};

function assertCivicEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.CIVIC_PLATFORM_ENABLED) throw new Error("Civic intelligence platform is not enabled.");
  return flags;
}

function journeyFromScore(score: number): CivicJourneyStage {
  if (score >= 90) return "civic_champion";
  if (score >= 80) return "institution_builder";
  if (score >= 72) return "mentor";
  if (score >= 62) return "community_builder";
  if (score >= 52) return "leader";
  if (score >= 42) return "reliable_volunteer";
  if (score >= 28) return "regular_contributor";
  if (score >= 14) return "participant";
  return "interested";
}

function momentumFromTrend(direction: EngagementTrend["direction"], streakWeeks: number): ParticipationMomentum {
  if (streakWeeks >= 4 && direction === "rising") return "growing";
  if (direction === "declining") return "declining";
  if (streakWeeks === 0) return "dormant";
  if (direction === "rising") return "reactivated";
  return "stable";
}

function normalizeEvent(raw: ParticipationEvent): ParticipationEvent {
  const ts = raw.timestamp ?? raw.recorded_at ?? now();
  return {
    ...raw,
    timestamp: ts,
    recorded_at: ts,
    organization_id: raw.organization_id ?? null,
    county_id: raw.county_id ?? "county-pulaski",
    category: raw.category ?? EVENT_CATEGORY_MAP[raw.event_type] ?? "volunteer",
    source_system: raw.source_system ?? "civic_engine",
    duration_minutes: raw.duration_minutes ?? null,
    location_optional: raw.location_optional ?? null,
    impact_weight: raw.impact_weight ?? DEFAULT_IMPACT[raw.event_type] ?? 1,
    verification_status: raw.verification_status ?? "self_reported",
    evidence_reference: raw.evidence_reference ?? null,
    privacy_level: raw.privacy_level ?? "institution",
  };
}

function userEvents(userId: string, institutionId: string) {
  return loadParticipationEvents()
    .map(normalizeEvent)
    .filter((e) => e.user_id === userId && e.institution_id === institutionId);
}

function computeUserScoreComponents(events: ParticipationEvent[], habits: CivicHabitRecord[]) {
  const meetings = events.filter((e) => e.category === "meeting").length;
  const volunteer = events.filter((e) => e.category === "volunteer");
  const missions = events.filter((e) => e.category === "mission").length;
  const leadership = events.filter((e) => e.category === "event_leadership" || e.category === "planning").length;
  const learning = events.filter((e) => e.category === "training").length;
  const mentoring = events.filter((e) => e.category === "mentoring").length;
  const projects = events.filter((e) => e.category === "community_project").length;
  const volunteerHours = volunteer.reduce((s, e) => s + (e.duration_minutes ?? 0), 0) / 60;
  const weeksActive = new Set(events.map((e) => e.timestamp.slice(0, 10))).size;

  const participation_frequency = Math.min(100, weeksActive * 8 + events.length * 2);
  const volunteer_activity = Math.min(100, Math.round(volunteerHours * 5 + volunteer.length * 6));
  const mission_completion = Math.min(100, missions * 18);
  const leadershipScore = Math.min(100, leadership * 20);
  const learningScore = Math.min(100, learning * 15);
  const mentoringScore = Math.min(100, mentoring * 25);
  const community_projects = Math.min(100, projects * 22);
  const habitBoost = habits.length ? Math.round(habits.reduce((s, h) => s + h.consistency_score, 0) / habits.length / 5) : 0;

  const catalog = loadParticipationCatalog();
  const breakdown: Record<string, number> = {};
  let score = 0;
  const values: Record<string, number> = {
    participation_frequency,
    volunteer_activity,
    mission_completion,
    leadership: leadershipScore,
    learning: learningScore,
    mentoring: mentoringScore,
    community_projects,
  };
  for (const m of catalog) {
    const component = Math.min(100, (values[m.key] ?? 0) + (m.key === "participation_frequency" ? habitBoost : 0));
    breakdown[m.key] = component;
    score += component * m.weight;
  }

  return {
    score: Math.round(score),
    participation_frequency,
    volunteer_activity,
    mission_completion,
    leadership: leadershipScore,
    learning: learningScore,
    mentoring: mentoringScore,
    community_projects,
    attendance_rate: Math.min(100, meetings * 10),
    membership_growth: Math.min(100, events.filter((e) => e.category === "recruitment").length * 25),
    community_involvement: Math.min(100, (learning + projects) / 2),
    civic_habits: habitBoost * 5,
    score_breakdown: breakdown,
    explainable_factors: catalog.map((m) => `${m.name}: ${breakdown[m.key]}% (${Math.round(m.weight * 100)}% weight)`),
    stats: { meetings, missions, volunteerHours, leadership, learning, mentoring, projects },
  };
}

function appendTimeline(entry: Omit<CivicTimelineEntry, "id">) {
  const timeline = loadCivicTimeline();
  timeline.push({ id: id("tl"), ...entry });
  persistCivicTimeline(timeline);
}

function updateVolunteerRecord(userId: string, institutionId: string, events: ParticipationEvent[]) {
  const volunteerEvents = events.filter((e) => e.category === "volunteer" || e.event_type === "volunteer_shift");
  const hours = volunteerEvents.reduce((s, e) => s + (e.duration_minutes ?? 0), 0) / 60;
  const verified = volunteerEvents
    .filter((e) => e.verification_status === "leader_verified" || e.verification_status === "system_verified")
    .reduce((s, e) => s + (e.duration_minutes ?? 0), 0) / 60;
  const record: VolunteerRecord = {
    user_id: userId,
    institution_id: institutionId,
    total_hours: Math.round(hours * 10) / 10,
    verified_hours: Math.round(verified * 10) / 10,
    projects: [...new Set(volunteerEvents.map((e) => e.title))],
    skills_used: volunteerEvents.length > 3 ? ["organizing", "outreach"] : ["outreach"],
    organizations_served: [institutionId],
    leadership_roles: events.filter((e) => e.category === "event_leadership").length,
    updated_at: now(),
  };
  const records = loadVolunteerRecords();
  const idx = records.findIndex((r) => r.user_id === userId && r.institution_id === institutionId);
  if (idx >= 0) records[idx] = record;
  else records.push(record);
  persistVolunteerRecords(records);
  return record;
}

export function recordParticipationEvent(input: {
  institution_id: string;
  community_id: string;
  user_id: string;
  event_type: ParticipationEventType;
  title: string;
  organization_id?: string;
  county_id?: string;
  duration_minutes?: number;
  participants_count?: number;
  verification_status?: VerificationStatus;
  privacy_level?: ParticipationEvent["privacy_level"];
  source_system?: string;
  evidence_reference?: string;
  actor_id: string;
}): ParticipationEvent {
  assertCivicEnabled();
  const ts = now();
  const event: ParticipationEvent = {
    id: id("part"),
    user_id: input.user_id,
    institution_id: input.institution_id,
    organization_id: input.organization_id ?? null,
    community_id: input.community_id,
    county_id: input.county_id ?? "county-pulaski",
    event_type: input.event_type,
    category: EVENT_CATEGORY_MAP[input.event_type],
    source_system: input.source_system ?? "civic_engine",
    title: input.title,
    timestamp: ts,
    recorded_at: ts,
    duration_minutes: input.duration_minutes ?? null,
    location_optional: null,
    impact_weight: DEFAULT_IMPACT[input.event_type] ?? 1,
    verification_status: input.verification_status ?? "self_reported",
    evidence_reference: input.evidence_reference ?? null,
    privacy_level: input.privacy_level ?? "institution",
    participants_count: input.participants_count ?? 1,
  };
  const events = loadParticipationEvents();
  events.push(event);
  persistParticipationEvents(events);

  appendTimeline({
    user_id: input.user_id,
    institution_id: input.institution_id,
    entry_type: input.event_type,
    title: input.title,
    description: `Participation event: ${input.event_type}`,
    event_id: event.id,
    milestone_id: null,
    timestamp: ts,
    visibility: event.privacy_level,
  });

  const userEv = userEvents(input.user_id, input.institution_id);
  updateVolunteerRecord(input.user_id, input.institution_id, userEv);
  evaluateMilestones(input.user_id, input.institution_id, input.actor_id);
  computeUserParticipationScore(input.user_id, input.institution_id, input.community_id, input.actor_id);
  computeParticipationScore(input.institution_id, input.community_id, input.actor_id);

  recordCivicAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "participation.recorded",
    target_type: "participation_event",
    target_id: event.id,
    result: "success",
    metadata: { event_type: event.event_type, verification: event.verification_status },
  });
  return event;
}

export function verifyParticipationEvent(eventId: string, verifierId: string, level: VerificationStatus = "leader_verified") {
  const events = loadParticipationEvents().map(normalizeEvent);
  const idx = events.findIndex((e) => e.id === eventId);
  if (idx < 0) throw new Error("Participation event not found.");
  events[idx] = { ...events[idx], verification_status: level };
  persistParticipationEvents(events);
  const e = events[idx];
  updateVolunteerRecord(e.user_id, e.institution_id, userEvents(e.user_id, e.institution_id));
  recordCivicAudit({
    institution_id: e.institution_id,
    actor_id: verifierId,
    action: "participation.verified",
    target_type: "participation_event",
    target_id: eventId,
    result: "success",
    metadata: { verification_status: level },
  });
  return events[idx];
}

function evaluateMilestones(userId: string, institutionId: string, actorId: string) {
  const events = userEvents(userId, institutionId);
  const volunteer = loadVolunteerRecords().find((r) => r.user_id === userId && r.institution_id === institutionId);
  const stats = {
    volunteer_hours: volunteer?.total_hours ?? 0,
    meetings: events.filter((e) => e.category === "meeting").length,
    event_leadership: events.filter((e) => e.category === "event_leadership").length,
    mentoring: events.filter((e) => e.category === "mentoring").length,
    community_project: events.filter((e) => e.category === "community_project").length,
    training: events.filter((e) => e.category === "training").length,
    missions: events.filter((e) => e.category === "mission").length,
  };
  const existing = loadCivicMilestones().filter((m) => m.user_id === userId && m.institution_id === institutionId);
  const awarded: CivicMilestone[] = [];
  for (const def of loadMilestoneCatalog()) {
    if (existing.some((m) => m.milestone_key === def.key)) continue;
    const [field, op, val] = def.trigger.match(/^(\w+)(>=)(\d+)$/)?.slice(1) ?? [];
    const current = stats[field as keyof typeof stats] as number | undefined;
    if (field && current !== undefined && op === ">=" && current >= Number(val)) {
      const milestone: CivicMilestone = {
        id: id("ms"),
        user_id: userId,
        institution_id: institutionId,
        milestone_key: def.key,
        title: def.title,
        description: def.description,
        awarded_at: now(),
        visibility: "institution",
      };
      awarded.push(milestone);
      appendTimeline({
        user_id: userId,
        institution_id: institutionId,
        entry_type: "milestone",
        title: def.title,
        description: def.description,
        event_id: null,
        milestone_id: milestone.id,
        timestamp: now(),
        visibility: "institution",
      });
    }
  }
  if (awarded.length) {
    const all = loadCivicMilestones();
    persistCivicMilestones([...all, ...awarded]);
    for (const m of awarded) {
      recordCivicAudit({
        institution_id: institutionId,
        actor_id: actorId,
        action: "milestone.awarded",
        target_type: "civic_milestone",
        target_id: m.id,
        result: "success",
        metadata: { milestone_key: m.milestone_key },
      });
    }
  }
  return awarded;
}

export function computeUserParticipationScore(
  userId: string,
  institutionId: string,
  communityId: string,
  actorId: string
): CivicParticipationScore {
  const events = userEvents(userId, institutionId);
  const habits = loadCivicHabits().filter((h) => h.user_id === userId && h.institution_id === institutionId);
  const components = computeUserScoreComponents(events, habits);
  const trend = loadEngagementTrends().find((t) => t.institution_id === institutionId && t.community_id === communityId);
  const maxStreak = habits.reduce((m, h) => Math.max(m, h.streak_weeks), 0);

  const score: CivicParticipationScore = {
    institution_id: institutionId,
    community_id: communityId,
    user_id: userId,
    score: components.score,
    participation_frequency: components.participation_frequency,
    volunteer_activity: components.volunteer_activity,
    mission_completion: components.mission_completion,
    leadership: components.leadership,
    learning: components.learning,
    mentoring: components.mentoring,
    community_projects: components.community_projects,
    attendance_rate: components.attendance_rate,
    membership_growth: components.membership_growth,
    community_involvement: components.community_involvement,
    civic_habits: components.civic_habits,
    stage: journeyFromScore(components.score),
    momentum: momentumFromTrend(trend?.direction ?? "stable", maxStreak),
    explainable_factors: components.explainable_factors,
    score_breakdown: components.score_breakdown,
    updated_at: now(),
  };

  const scores = loadUserParticipationScores();
  const idx = scores.findIndex((s) => s.user_id === userId && s.institution_id === institutionId);
  if (idx >= 0) scores[idx] = score;
  else scores.push(score);
  persistUserParticipationScores(scores);

  recordCivicAudit({
    institution_id: institutionId,
    actor_id: actorId,
    action: "participation.score_computed",
    target_type: "user_participation_score",
    target_id: userId,
    result: "success",
    metadata: { score: score.score, stage: score.stage, breakdown: score.score_breakdown },
  });
  return score;
}

export function computeParticipationScore(institutionId: string, communityId: string, actorId: string): CivicParticipationScore {
  assertCivicEnabled();
  const events = loadParticipationEvents().map(normalizeEvent).filter((e) => e.institution_id === institutionId && e.community_id === communityId);
  const habits = loadCivicHabits().filter((h) => h.institution_id === institutionId);
  const components = computeUserScoreComponents(events, habits);

  const score: CivicParticipationScore = {
    institution_id: institutionId,
    community_id: communityId,
    score: components.score,
    participation_frequency: components.participation_frequency,
    volunteer_activity: components.volunteer_activity,
    mission_completion: components.mission_completion,
    leadership: components.leadership,
    learning: components.learning,
    mentoring: components.mentoring,
    community_projects: components.community_projects,
    attendance_rate: components.attendance_rate,
    membership_growth: components.membership_growth,
    community_involvement: components.community_involvement,
    civic_habits: components.civic_habits,
    stage: journeyFromScore(components.score),
    momentum: "stable",
    explainable_factors: components.explainable_factors,
    score_breakdown: components.score_breakdown,
    updated_at: now(),
  };

  const scores = loadParticipationScores();
  const idx = scores.findIndex((s) => s.institution_id === institutionId && s.community_id === communityId);
  if (idx >= 0) scores[idx] = score;
  else scores.push(score);
  persistParticipationScores(scores);

  updateEngagementTrend(institutionId, communityId, score.score, events, actorId);
  refreshHealthSummary();

  recordCivicAudit({
    institution_id: institutionId,
    actor_id: actorId,
    action: "community.score_computed",
    target_type: "participation_score",
    target_id: communityId,
    result: "success",
    metadata: { score: score.score },
  });
  return score;
}

function updateEngagementTrend(institutionId: string, communityId: string, currentScore: number, events: ParticipationEvent[], actorId: string) {
  const trends = loadEngagementTrends();
  const existing = trends.find((t) => t.institution_id === institutionId && t.community_id === communityId);
  const previousIndex = existing?.participation_index ?? currentScore - 5;
  const direction: EngagementTrend["direction"] =
    currentScore > previousIndex + 3 ? "rising" : currentScore < previousIndex - 3 ? "declining" : "stable";
  const volunteerHours = events.filter((e) => e.category === "volunteer").reduce((s, e) => s + (e.duration_minutes ?? 0), 0) / 60;

  const trend: EngagementTrend = {
    institution_id: institutionId,
    community_id: communityId,
    period: "30d",
    participation_index: currentScore,
    volunteer_hours: Math.round(volunteerHours),
    active_participants: new Set(events.map((e) => e.user_id)).size,
    retention_rate: Math.min(100, 60 + Math.round(currentScore * 0.3)),
    direction,
    updated_at: now(),
  };
  const idx = trends.findIndex((t) => t.institution_id === institutionId && t.community_id === communityId);
  if (idx >= 0) trends[idx] = trend;
  else trends.push(trend);
  persistEngagementTrends(trends);
  recordCivicAudit({ institution_id: institutionId, actor_id: actorId, action: "engagement.trend_updated", target_type: "engagement_trend", target_id: communityId, result: "success", metadata: { direction } });
}

function refreshHealthSummary() {
  const scores = loadParticipationScores();
  const trends = loadEngagementTrends();
  const events = loadParticipationEvents().map(normalizeEvent);
  const thirtyDaysAgo = Date.now() - 30 * 86400000;
  const recent = events.filter((e) => new Date(e.timestamp).getTime() >= thirtyDaysAgo);
  const volunteerHours = recent.filter((e) => e.category === "volunteer").reduce((s, e) => s + (e.duration_minutes ?? 0), 0) / 60;

  const summary: ParticipationHealthSummary = {
    communities_tracked: new Set(scores.map((s) => s.community_id)).size,
    average_participation_score: scores.length ? Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length) : 0,
    active_participants: new Set(recent.map((e) => e.user_id)).size,
    volunteer_hours_month: Math.round(volunteerHours),
    membership_growth_rate: scores.length ? Math.round(scores.reduce((s, x) => s + x.membership_growth, 0) / scores.length) : 0,
    declining_communities: trends.filter((t) => t.direction === "declining").length,
    rising_communities: trends.filter((t) => t.direction === "rising").length,
    counties_tracked: new Set(events.map((e) => e.county_id).filter(Boolean)).size,
    updated_at: now(),
  };
  persistHealthSummary(summary);
  return summary;
}

export function getParticipationHealthSummary() {
  return loadHealthSummary();
}

export function listParticipationEvents(institutionId?: string, communityId?: string, userId?: string) {
  let events = loadParticipationEvents().map(normalizeEvent);
  if (institutionId) events = events.filter((e) => e.institution_id === institutionId);
  if (communityId) events = events.filter((e) => e.community_id === communityId);
  if (userId) events = events.filter((e) => e.user_id === userId);
  return events;
}

export function getUserTimeline(userId: string, institutionId: string) {
  return loadCivicTimeline().filter((t) => t.user_id === userId && t.institution_id === institutionId);
}

export function getUserMilestones(userId: string, institutionId: string) {
  const privacy = getPrivacySettings(userId, institutionId);
  return loadCivicMilestones()
    .filter((m) => m.user_id === userId && m.institution_id === institutionId)
    .map((m) => (privacy.milestone_badges_only ? { ...m, description: "Milestone achieved" } : m));
}

export function getVolunteerRecord(userId: string, institutionId: string) {
  return loadVolunteerRecords().find((r) => r.user_id === userId && r.institution_id === institutionId) ?? null;
}

export function recordCivicHabit(input: {
  institution_id: string;
  user_id: string;
  habit_type: string;
  streak_weeks: number;
  actor_id: string;
}): CivicHabitRecord {
  assertCivicEnabled();
  const habits = loadCivicHabits();
  const existing = habits.find((h) => h.institution_id === input.institution_id && h.user_id === input.user_id && h.habit_type === input.habit_type);
  const habit: CivicHabitRecord = {
    id: existing?.id ?? id("habit"),
    institution_id: input.institution_id,
    user_id: input.user_id,
    habit_type: input.habit_type,
    streak_weeks: input.streak_weeks,
    last_action_at: now(),
    consistency_score: Math.min(100, input.streak_weeks * 8),
    return_rate: Math.min(100, 50 + input.streak_weeks * 5),
    recovery_after_absence: input.streak_weeks > 0,
  };
  if (existing) {
    habits[habits.findIndex((h) => h.id === existing.id)] = habit;
  } else {
    habits.push(habit);
  }
  persistCivicHabits(habits);
  recordCivicAudit({ institution_id: input.institution_id, actor_id: input.actor_id, action: "civic_habit.recorded", target_type: "civic_habit", target_id: habit.id, result: "success", metadata: { streak_weeks: habit.streak_weeks } });
  return habit;
}

export function getPrivacySettings(userId: string, institutionId: string): ParticipationPrivacySettings {
  const existing = loadPrivacySettings().find((p) => p.user_id === userId && p.institution_id === institutionId);
  if (existing) return existing;
  return {
    user_id: userId,
    institution_id: institutionId,
    public_achievements: false,
    volunteer_history_visible: false,
    leaderboards_enabled: false,
    community_profile_visibility: "institution",
    milestone_badges_only: false,
    updated_at: now(),
  };
}

export function updatePrivacySettings(input: {
  user_id: string;
  institution_id: string;
  milestone_badges_only?: boolean;
  public_achievements?: boolean;
  volunteer_history_visible?: boolean;
  community_profile_visibility?: ParticipationPrivacySettings["community_profile_visibility"];
  actor_id: string;
}) {
  const settings = getPrivacySettings(input.user_id, input.institution_id);
  const updated: ParticipationPrivacySettings = {
    ...settings,
    milestone_badges_only: input.milestone_badges_only ?? settings.milestone_badges_only,
    public_achievements: input.public_achievements ?? settings.public_achievements,
    volunteer_history_visible: input.volunteer_history_visible ?? settings.volunteer_history_visible,
    community_profile_visibility: input.community_profile_visibility ?? settings.community_profile_visibility,
    updated_at: now(),
  };
  const all = loadPrivacySettings().filter((p) => !(p.user_id === input.user_id && p.institution_id === input.institution_id));
  all.push(updated);
  persistPrivacySettings(all);
  recordCivicAudit({ institution_id: input.institution_id, actor_id: input.actor_id, action: "privacy.updated", target_type: "privacy_settings", target_id: input.user_id, result: "success", metadata: { milestone_badges_only: updated.milestone_badges_only } });
  return updated;
}

export function getUserDashboard(userId: string, institutionId: string): UserParticipationDashboard {
  const events = userEvents(userId, institutionId);
  const volunteer = getVolunteerRecord(userId, institutionId);
  const score = loadUserParticipationScores().find((s) => s.user_id === userId && s.institution_id === institutionId);
  const habits = loadCivicHabits().filter((h) => h.user_id === userId);
  return {
    user_id: userId,
    volunteer_hours: volunteer?.total_hours ?? 0,
    meetings: events.filter((e) => e.category === "meeting").length,
    missions: events.filter((e) => e.category === "mission").length,
    training_completed: events.filter((e) => e.category === "training").length,
    leadership_roles: volunteer?.leadership_roles ?? 0,
    current_streak_weeks: habits.reduce((m, h) => Math.max(m, h.streak_weeks), 0),
    participation_trend: score?.momentum ?? "stable",
    journey_stage: score?.stage ?? "interested",
    score: score?.score ?? 0,
    score_breakdown: score?.score_breakdown ?? {},
  };
}

export function getOrganizationDashboard(institutionId: string): OrganizationParticipationDashboard {
  const scores = loadParticipationScores().filter((s) => s.institution_id === institutionId);
  const trends = loadEngagementTrends().filter((t) => t.institution_id === institutionId);
  const avg = scores.length ? Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length) : 0;
  return {
    institution_id: institutionId,
    participation_trend: trends.some((t) => t.direction === "rising") ? "growing" : trends.some((t) => t.direction === "declining") ? "declining" : "stable",
    volunteer_growth_percent: trends.reduce((s, t) => s + t.volunteer_hours, 0),
    leadership_pipeline: loadVolunteerRecords().filter((r) => r.institution_id === institutionId && r.leadership_roles > 0).length,
    mission_completion_rate: avg,
    new_member_activation: scores.reduce((s, x) => s + x.membership_growth, 0),
    retention_rate: trends.length ? Math.round(trends.reduce((s, t) => s + t.retention_rate, 0) / trends.length) : 0,
    active_members: trends.reduce((s, t) => s + t.active_participants, 0),
  };
}

export function getCountyDashboard(countyId: string): CountyParticipationDashboard {
  const events = loadParticipationEvents().map(normalizeEvent).filter((e) => e.county_id === countyId);
  const institutions = new Set(events.map((e) => e.institution_id));
  const hours = events.filter((e) => e.category === "volunteer").reduce((s, e) => s + (e.duration_minutes ?? 0), 0) / 60;
  const scores = loadParticipationScores();
  const avg = scores.length ? Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length) : 0;
  return {
    county_id: countyId,
    active_organizations: institutions.size,
    volunteer_hours: Math.round(hours),
    civic_participation_index: avg,
    community_events: events.filter((e) => e.category === "event_attendance").length,
    leadership_development: loadVolunteerRecords().filter((r) => r.leadership_roles > 0).length,
    engagement_index: avg,
  };
}

export function getFederationParticipationAnalytics(): FederationParticipationAnalytics {
  const scores = loadParticipationScores();
  const trends = loadEngagementTrends();
  const avg = scores.length ? Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length) : 0;
  return {
    aggregate_participation_index: avg,
    anonymous_trend: trends.filter((t) => t.direction === "rising").length >= trends.filter((t) => t.direction === "declining").length ? "growing" : "stable",
    community_growth_percent: trends.filter((t) => t.direction === "rising").length * 5,
    institutions_contributing: new Set(scores.map((s) => s.institution_id)).size,
    privacy_preserved: true,
  };
}

export function getParticipationInsights(userId: string, institutionId: string): ParticipationInsight[] {
  const score = loadUserParticipationScores().find((s) => s.user_id === userId && s.institution_id === institutionId);
  const insights: ParticipationInsight[] = [];
  if (score && score.score >= 50 && score.leadership < 40) {
    insights.push({
      user_id: userId,
      insight_type: "opportunity",
      title: "Leadership workshop recommended",
      message: "Based on consistent participation, a leadership development workshop may be a good next step. Advisory only—never assigns civic worth.",
      advisory_only: true,
      generated_at: now(),
    });
  }
  if (score && score.momentum === "declining") {
    insights.push({
      user_id: userId,
      insight_type: "intervention",
      title: "Re-engagement opportunity",
      message: "Consider a personal invitation to a nearby event or a smaller commitment to rebuild momentum.",
      advisory_only: true,
      generated_at: now(),
    });
  }
  return insights;
}

export function suggestEngagementInterventions(userId: string, institutionId: string): EngagementIntervention | null {
  const score = loadUserParticipationScores().find((s) => s.user_id === userId && s.institution_id === institutionId);
  if (!score || score.momentum !== "declining") return null;
  return {
    user_id: userId,
    institution_id: institutionId,
    reason: "Participation momentum declining",
    suggestions: [
      "Reach out personally",
      "Invite to a nearby event",
      "Recommend introductory training",
      "Offer mentoring connection",
      "Suggest a smaller weekly commitment",
    ],
    tone: "supportive",
    generated_at: now(),
  };
}

export function getEngagementTrends(institutionId?: string) {
  const trends = loadEngagementTrends();
  return institutionId ? trends.filter((t) => t.institution_id === institutionId) : trends;
}

export function forecastParticipation(institutionId: string, communityId: string, actorId: string): ParticipationForecast {
  assertCivicEnabled();
  const score = loadParticipationScores().find((s) => s.institution_id === institutionId && s.community_id === communityId);
  const trend = loadEngagementTrends().find((t) => t.institution_id === institutionId && t.community_id === communityId);
  const base = trend?.active_participants ?? 10;
  const mult = trend?.direction === "rising" ? 1.15 : trend?.direction === "declining" ? 0.9 : 1.05;
  const forecast: ParticipationForecast = {
    institution_id: institutionId,
    community_id: communityId,
    horizon_days: 90,
    projected_participants: Math.round(base * mult),
    projected_volunteer_hours: Math.round((trend?.volunteer_hours ?? 20) * mult * 3),
    confidence: score ? Math.min(95, 55 + score.score * 0.4) : 55,
    risk_factors: trend?.direction === "declining" ? ["Participation decline", "Volunteer burnout risk"] : ["Seasonal variance"],
    opportunities: score && score.score >= 45 ? ["Leadership pipeline growth", "Expand mentorship"] : ["Re-engage dormant participants"],
    burnout_risk: trend?.direction === "declining" ? "elevated" : "low",
    leadership_readiness: (score?.leadership ?? 0) >= 40,
    generated_at: now(),
  };
  const forecasts = loadParticipationForecasts();
  const idx = forecasts.findIndex((f) => f.institution_id === institutionId && f.community_id === communityId);
  if (idx >= 0) forecasts[idx] = forecast;
  else forecasts.push(forecast);
  persistParticipationForecasts(forecasts);
  recordCivicAudit({ institution_id: institutionId, actor_id: actorId, action: "participation.forecast_generated", target_type: "participation_forecast", target_id: communityId, result: "success" });
  return forecast;
}

export function listParticipationScores(institutionId?: string) {
  const scores = loadParticipationScores();
  return institutionId ? scores.filter((s) => s.institution_id === institutionId) : scores;
}

export function listUserParticipationScores(institutionId?: string) {
  const scores = loadUserParticipationScores();
  return institutionId ? scores.filter((s) => s.institution_id === institutionId) : scores;
}

export { listCivicAudit };
