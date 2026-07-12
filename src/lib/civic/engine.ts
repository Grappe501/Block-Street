import {
  loadCivicHabits,
  loadEngagementTrends,
  loadFeatureFlags,
  loadHealthSummary,
  loadParticipationCatalog,
  loadParticipationEvents,
  loadParticipationForecasts,
  loadParticipationScores,
  persistCivicHabits,
  persistEngagementTrends,
  persistHealthSummary,
  persistParticipationEvents,
  persistParticipationForecasts,
  persistParticipationScores,
} from "./data";
import { listCivicAudit, recordCivicAudit } from "./audit";
import type {
  CivicHabitRecord,
  CivicParticipationScore,
  EngagementStage,
  EngagementTrend,
  ParticipationEvent,
  ParticipationForecast,
  ParticipationHealthSummary,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function assertCivicEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.CIVIC_PLATFORM_ENABLED) throw new Error("Civic intelligence platform is not enabled.");
  return flags;
}

function stageFromScore(score: number): EngagementStage {
  if (score >= 85) return "champion";
  if (score >= 70) return "committed";
  if (score >= 50) return "active";
  if (score >= 30) return "emerging";
  return "dormant";
}

function computeScoreComponents(events: ParticipationEvent[], habits: CivicHabitRecord[]) {
  const volunteerEvents = events.filter((e) => e.event_type === "volunteer_shift" || e.event_type === "outreach_action");
  const attendanceEvents = events.filter((e) => e.event_type === "event_attendance" || e.event_type === "meeting_attended");
  const missionEvents = events.filter((e) => e.event_type === "mission_completed");
  const membershipEvents = events.filter((e) => e.event_type === "membership_joined");
  const communityEvents = events.filter((e) => e.event_type === "community_action" || e.event_type === "training_completed");

  const volunteerHours = volunteerEvents.reduce((sum, e) => sum + e.duration_minutes, 0) / 60;
  const volunteer_activity = Math.min(100, Math.round(volunteerHours * 4 + volunteerEvents.length * 5));
  const attendance_rate = Math.min(100, attendanceEvents.length * 12);
  const membership_growth = Math.min(100, membershipEvents.length * 20);
  const mission_completion = Math.min(100, missionEvents.length * 15);
  const community_involvement = Math.min(100, communityEvents.length * 10);
  const civic_habits = habits.length
    ? Math.round(habits.reduce((sum, h) => sum + h.consistency_score, 0) / habits.length)
    : 0;

  const catalog = loadParticipationCatalog();
  const weights = Object.fromEntries(catalog.map((m) => [m.key, m.weight]));
  const score = Math.round(
    volunteer_activity * (weights.volunteer_activity ?? 0.2) +
      attendance_rate * (weights.attendance_rate ?? 0.15) +
      membership_growth * (weights.membership_growth ?? 0.15) +
      mission_completion * (weights.mission_completion ?? 0.2) +
      community_involvement * (weights.community_involvement ?? 0.15) +
      civic_habits * (weights.civic_habits ?? 0.15)
  );

  return {
    score,
    volunteer_activity,
    attendance_rate,
    membership_growth,
    mission_completion,
    community_involvement,
    civic_habits,
    explainable_factors: [
      `${volunteerEvents.length} volunteer actions (${volunteerHours.toFixed(1)}h)`,
      `${attendanceEvents.length} attendance events`,
      `${missionEvents.length} missions completed`,
      `${membershipEvents.length} new memberships`,
      `${habits.length} tracked civic habits`,
    ],
  };
}

function refreshHealthSummary() {
  const scores = loadParticipationScores();
  const trends = loadEngagementTrends();
  const events = loadParticipationEvents();
  const thirtyDaysAgo = Date.now() - 30 * 86400000;
  const recentEvents = events.filter((e) => new Date(e.recorded_at).getTime() >= thirtyDaysAgo);
  const volunteerHours = recentEvents
    .filter((e) => e.event_type === "volunteer_shift" || e.event_type === "outreach_action")
    .reduce((sum, e) => sum + e.duration_minutes, 0) / 60;

  const summary: ParticipationHealthSummary = {
    communities_tracked: new Set(scores.map((s) => s.community_id)).size,
    average_participation_score: scores.length
      ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
      : 0,
    active_participants: new Set(recentEvents.map((e) => e.user_id)).size,
    volunteer_hours_month: Math.round(volunteerHours),
    membership_growth_rate: scores.length
      ? Math.round(scores.reduce((sum, s) => sum + s.membership_growth, 0) / scores.length)
      : 0,
    declining_communities: trends.filter((t) => t.direction === "declining").length,
    rising_communities: trends.filter((t) => t.direction === "rising").length,
    updated_at: now(),
  };
  persistHealthSummary(summary);
  return summary;
}

export function getParticipationHealthSummary() {
  return loadHealthSummary();
}

export function listParticipationEvents(institutionId?: string, communityId?: string) {
  let events = loadParticipationEvents();
  if (institutionId) events = events.filter((e) => e.institution_id === institutionId);
  if (communityId) events = events.filter((e) => e.community_id === communityId);
  return events;
}

export function recordParticipationEvent(input: {
  institution_id: string;
  community_id: string;
  user_id: string;
  event_type: ParticipationEvent["event_type"];
  title: string;
  duration_minutes?: number;
  participants_count?: number;
  actor_id: string;
}): ParticipationEvent {
  assertCivicEnabled();
  const event: ParticipationEvent = {
    id: id("part"),
    institution_id: input.institution_id,
    community_id: input.community_id,
    user_id: input.user_id,
    event_type: input.event_type,
    title: input.title,
    duration_minutes: input.duration_minutes ?? 60,
    participants_count: input.participants_count ?? 1,
    recorded_at: now(),
  };
  const events = loadParticipationEvents();
  events.push(event);
  persistParticipationEvents(events);
  recordCivicAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "participation.recorded",
    target_type: "participation_event",
    target_id: event.id,
    result: "success",
    metadata: { event_type: event.event_type, community_id: input.community_id },
  });
  computeParticipationScore(input.institution_id, input.community_id, input.actor_id);
  return event;
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
  const habit: CivicHabitRecord = existing
    ? {
        ...existing,
        streak_weeks: input.streak_weeks,
        last_action_at: now(),
        consistency_score: Math.min(100, input.streak_weeks * 8),
      }
    : {
        id: id("habit"),
        institution_id: input.institution_id,
        user_id: input.user_id,
        habit_type: input.habit_type,
        streak_weeks: input.streak_weeks,
        last_action_at: now(),
        consistency_score: Math.min(100, input.streak_weeks * 8),
      };
  if (existing) {
    const idx = habits.findIndex((h) => h.id === existing.id);
    habits[idx] = habit;
  } else {
    habits.push(habit);
  }
  persistCivicHabits(habits);
  recordCivicAudit({
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "civic_habit.recorded",
    target_type: "civic_habit",
    target_id: habit.id,
    result: "success",
  });
  return habit;
}

export function computeParticipationScore(institutionId: string, communityId: string, actorId: string): CivicParticipationScore {
  assertCivicEnabled();
  const events = loadParticipationEvents().filter((e) => e.institution_id === institutionId && e.community_id === communityId);
  const habits = loadCivicHabits().filter((h) => h.institution_id === institutionId);
  const components = computeScoreComponents(events, habits);

  const score: CivicParticipationScore = {
    institution_id: institutionId,
    community_id: communityId,
    score: components.score,
    volunteer_activity: components.volunteer_activity,
    attendance_rate: components.attendance_rate,
    membership_growth: components.membership_growth,
    mission_completion: components.mission_completion,
    community_involvement: components.community_involvement,
    civic_habits: components.civic_habits,
    stage: stageFromScore(components.score),
    explainable_factors: components.explainable_factors,
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
    action: "participation.score_computed",
    target_type: "participation_score",
    target_id: communityId,
    result: "success",
    metadata: { score: score.score, stage: score.stage },
  });
  return score;
}

function updateEngagementTrend(
  institutionId: string,
  communityId: string,
  currentScore: number,
  events: ParticipationEvent[],
  actorId: string
) {
  const trends = loadEngagementTrends();
  const existing = trends.find((t) => t.institution_id === institutionId && t.community_id === communityId);
  const previousIndex = existing?.participation_index ?? currentScore - 5;
  const direction: EngagementTrend["direction"] =
    currentScore > previousIndex + 3 ? "rising" : currentScore < previousIndex - 3 ? "declining" : "stable";

  const volunteerHours = events
    .filter((e) => e.event_type === "volunteer_shift")
    .reduce((sum, e) => sum + e.duration_minutes, 0) / 60;

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

  recordCivicAudit({
    institution_id: institutionId,
    actor_id: actorId,
    action: "engagement.trend_updated",
    target_type: "engagement_trend",
    target_id: communityId,
    result: "success",
    metadata: { direction },
  });
}

export function getEngagementTrends(institutionId?: string) {
  const trends = loadEngagementTrends();
  return institutionId ? trends.filter((t) => t.institution_id === institutionId) : trends;
}

export function forecastParticipation(institutionId: string, communityId: string, actorId: string): ParticipationForecast {
  assertCivicEnabled();
  const score = loadParticipationScores().find((s) => s.institution_id === institutionId && s.community_id === communityId);
  const trend = loadEngagementTrends().find((t) => t.institution_id === institutionId && t.community_id === communityId);
  const baseParticipants = trend?.active_participants ?? 10;
  const growthMultiplier = trend?.direction === "rising" ? 1.15 : trend?.direction === "declining" ? 0.9 : 1.05;

  const forecast: ParticipationForecast = {
    institution_id: institutionId,
    community_id: communityId,
    horizon_days: 90,
    projected_participants: Math.round(baseParticipants * growthMultiplier),
    projected_volunteer_hours: Math.round((trend?.volunteer_hours ?? 20) * growthMultiplier * 3),
    confidence: score ? Math.min(95, 55 + score.score * 0.4) : 55,
    risk_factors:
      trend?.direction === "declining"
        ? ["Participation decline detected", "Volunteer retention below target"]
        : ["Seasonal participation variance"],
    opportunities:
      trend?.direction === "rising"
        ? ["Expand volunteer recruitment", "Launch mentorship for emerging leaders"]
        : ["Re-engage dormant participants", "Host community welcome events"],
    generated_at: now(),
  };

  const forecasts = loadParticipationForecasts();
  const idx = forecasts.findIndex((f) => f.institution_id === institutionId && f.community_id === communityId);
  if (idx >= 0) forecasts[idx] = forecast;
  else forecasts.push(forecast);
  persistParticipationForecasts(forecasts);

  recordCivicAudit({
    institution_id: institutionId,
    actor_id: actorId,
    action: "participation.forecast_generated",
    target_type: "participation_forecast",
    target_id: communityId,
    result: "success",
  });
  return forecast;
}

export function listParticipationScores(institutionId?: string) {
  const scores = loadParticipationScores();
  return institutionId ? scores.filter((s) => s.institution_id === institutionId) : scores;
}

export { listCivicAudit };
