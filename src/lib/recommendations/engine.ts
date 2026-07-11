import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import type {
  DailyBriefing,
  FeedbackAction,
  Recommendation,
  RecommendationCategory,
  RecommendationFeedback,
  ScoreBreakdown,
} from "./types";

const DATA = join(process.cwd(), "data");
const FEEDBACK_PATH = join(DATA, "recommendations", "feedback.json");

let cache: Recommendation[] | null = null;
let feedbackCache: RecommendationFeedback[] | null = null;

type WeightConfig = {
  campaignPriority: number;
  impactEstimate: number;
  urgency: number;
  relationshipStrength: number;
  geographicEfficiency: number;
  historicalSuccess: number;
  userPreferences: number;
};

function loadWeights(): WeightConfig {
  const raw = JSON.parse(readFileSync(join(DATA, "recommendations", "scoring_weights.json"), "utf8"));
  return raw.weights;
}

function computeScore(signals: Omit<ScoreBreakdown, "total">): ScoreBreakdown {
  const w = loadWeights();
  const breakdown: ScoreBreakdown = {
    campaignPriority: signals.campaignPriority,
    impactEstimate: signals.impactEstimate,
    urgency: signals.urgency,
    relationshipStrength: signals.relationshipStrength,
    geographicEfficiency: signals.geographicEfficiency,
    historicalSuccess: signals.historicalSuccess,
    userPreferences: signals.userPreferences,
    total: 0,
  };
  breakdown.total =
    breakdown.campaignPriority * w.campaignPriority +
    breakdown.impactEstimate * w.impactEstimate +
    breakdown.urgency * w.urgency +
    breakdown.relationshipStrength * w.relationshipStrength +
    breakdown.geographicEfficiency * w.geographicEfficiency +
    breakdown.historicalSuccess * w.historicalSuccess +
    breakdown.userPreferences * w.userPreferences;
  breakdown.total = Math.round(breakdown.total * 1000) / 1000;
  return breakdown;
}

function rec(
  partial: Omit<Recommendation, "score" | "scoreBreakdown" | "status" | "created_at"> & {
    signals: Omit<ScoreBreakdown, "total">;
  }
): Recommendation {
  const scoreBreakdown = computeScore(partial.signals);
  const { signals: _, ...rest } = partial;
  return {
    ...rest,
    score: scoreBreakdown.total,
    scoreBreakdown,
    status: "active",
    created_at: "2026-07-10T12:00:00Z",
  };
}

function bootstrapRecommendations(): Recommendation[] {
  return [
    rec({
      id: "rie-daily-001",
      category: "daily",
      title: "Benton County volunteer recruitment below goal",
      subtitle: "Daily priority #1",
      confidence: 92,
      evidence: ["12 volunteers vs 20 goal", "Registration drive in 14 days", "Similar counties recovered with outreach blitz"],
      priority: "immediate",
      campaignGoal: "Grow volunteer base",
      actionLabel: "Review county dashboard",
      county: "Benton County",
      signals: { campaignPriority: 0.95, impactEstimate: 0.9, urgency: 0.85, relationshipStrength: 0.5, geographicEfficiency: 0.7, historicalSuccess: 0.8, userPreferences: 0.6 },
    }),
    rec({
      id: "rie-daily-002",
      category: "daily",
      title: "Three county chairs have not checked in for seven days",
      subtitle: "Daily priority #2",
      confidence: 88,
      evidence: ["Washington, Garland, Jefferson chairs inactive", "Weekly check-in SLA is 3 days"],
      priority: "high",
      campaignGoal: "Develop leaders",
      actionLabel: "Send check-in calls",
      signals: { campaignPriority: 0.85, impactEstimate: 0.8, urgency: 0.9, relationshipStrength: 0.7, geographicEfficiency: 0.5, historicalSuccess: 0.75, userPreferences: 0.5 },
    }),
    rec({
      id: "rie-contact-001",
      category: "contact",
      title: "Sarah Johnson",
      subtitle: "Recommended contact · 94% confidence",
      confidence: 94,
      evidence: ["Attended three recent events", "Recruited four volunteers", "Responds quickly", "Lives near planned outreach area"],
      priority: "high",
      campaignGoal: "Grow volunteer base",
      actionLabel: "Call Sarah",
      targetEntityType: "Person",
      targetEntityId: "person-sarah-johnson",
      county: "Benton County",
      signals: { campaignPriority: 0.8, impactEstimate: 0.85, urgency: 0.7, relationshipStrength: 0.95, geographicEfficiency: 0.9, historicalSuccess: 0.85, userPreferences: 0.7 },
    }),
    rec({
      id: "rie-county-001",
      category: "county",
      title: "Increase volunteer recruitment — Craighead County",
      subtitle: "County health score: 68%",
      confidence: 86,
      evidence: ["Volunteer growth flat 30 days", "Leadership depth below threshold", "Peer county Conway recovered with registration event"],
      priority: "high",
      campaignGoal: "Expand county coverage",
      actionLabel: "Launch registration event",
      county: "Craighead County",
      signals: { campaignPriority: 0.9, impactEstimate: 0.85, urgency: 0.75, relationshipStrength: 0.4, geographicEfficiency: 0.6, historicalSuccess: 0.7, userPreferences: 0.5 },
    }),
    rec({
      id: "rie-org-001",
      category: "organization",
      title: "Northwest Arkansas Food Coalition",
      subtitle: "Recommended partner · 89% confidence",
      confidence: 89,
      evidence: ["Similar mission", "Five shared volunteers", "Active in target county", "Existing relationship with county chair"],
      priority: "medium",
      campaignGoal: "Strengthen partnerships",
      actionLabel: "Schedule introduction",
      targetEntityType: "Organization",
      targetEntityId: "org-nwa-food-coalition",
      county: "Washington County",
      signals: { campaignPriority: 0.75, impactEstimate: 0.8, urgency: 0.5, relationshipStrength: 0.85, geographicEfficiency: 0.7, historicalSuccess: 0.8, userPreferences: 0.6 },
    }),
    rec({
      id: "rie-event-001",
      category: "event",
      title: "Jonesboro Listening Session — venue change",
      subtitle: "Expected attendance exceeds seating",
      confidence: 91,
      evidence: ["142 RSVPs vs 80 capacity", "Weather forecast favorable", "Media interest registered"],
      priority: "immediate",
      campaignGoal: "Improve communications",
      actionLabel: "Move to larger venue",
      targetEntityType: "Event",
      targetEntityId: "event-jonesboro-listening",
      county: "Craighead County",
      durationEstimate: "45 minutes",
      signals: { campaignPriority: 0.7, impactEstimate: 0.9, urgency: 0.95, relationshipStrength: 0.5, geographicEfficiency: 0.8, historicalSuccess: 0.75, userPreferences: 0.5 },
    }),
    rec({
      id: "rie-comm-001",
      category: "communication",
      title: "Thank-you email to weekend canvass team",
      subtitle: "Six volunteers completed orientation",
      confidence: 85,
      evidence: ["Six new orientations completed Saturday", "Recognition increases retention 23%", "Draft prepared — not sent"],
      priority: "medium",
      campaignGoal: "Improve communications",
      actionLabel: "Review draft email",
      signals: { campaignPriority: 0.6, impactEstimate: 0.7, urgency: 0.6, relationshipStrength: 0.8, geographicEfficiency: 0.5, historicalSuccess: 0.85, userPreferences: 0.7 },
    }),
    rec({
      id: "rie-lead-001",
      category: "leadership",
      title: "Invite Marcus Lee to leadership training",
      subtitle: "Emerging leader signal",
      confidence: 87,
      evidence: ["Consistent attendance 8 weeks", "Recruited 3 volunteers", "Positive peer feedback", "Training module completed"],
      priority: "high",
      campaignGoal: "Develop leaders",
      actionLabel: "Send invitation",
      targetEntityType: "Person",
      targetEntityId: "person-marcus-lee",
      county: "Pulaski County",
      signals: { campaignPriority: 0.85, impactEstimate: 0.8, urgency: 0.55, relationshipStrength: 0.9, geographicEfficiency: 0.6, historicalSuccess: 0.8, userPreferences: 0.65 },
    }),
    rec({
      id: "rie-vol-001",
      category: "volunteer",
      title: "Personal check-in — Alex Rivera",
      subtitle: "Missed four consecutive events",
      confidence: 83,
      evidence: ["Previously high engagement", "Last active 28 days ago", "Burnout pattern detected in similar profiles"],
      priority: "high",
      campaignGoal: "Grow volunteer base",
      actionLabel: "Schedule check-in call",
      targetEntityType: "Person",
      targetEntityId: "person-alex-rivera",
      county: "Saline County",
      signals: { campaignPriority: 0.7, impactEstimate: 0.75, urgency: 0.8, relationshipStrength: 0.85, geographicEfficiency: 0.5, historicalSuccess: 0.7, userPreferences: 0.6 },
    }),
    rec({
      id: "rie-mission-001",
      category: "mission",
      title: "Recruit 5 volunteers — Benton County",
      subtitle: "★★★★☆ Impact · 35 minutes",
      confidence: 90,
      evidence: ["County 8 volunteers below goal", "Registration deadline approaching", "Mission Board candidate"],
      priority: "immediate",
      impactEstimate: 0.9,
      effortEstimate: "medium",
      durationEstimate: "35 minutes",
      deadline: "2026-07-17",
      campaignGoal: "Grow volunteer base",
      actionLabel: "Start mission",
      county: "Benton County",
      signals: { campaignPriority: 0.95, impactEstimate: 0.9, urgency: 0.85, relationshipStrength: 0.5, geographicEfficiency: 0.75, historicalSuccess: 0.8, userPreferences: 0.6 },
    }),
    rec({
      id: "rie-geo-001",
      category: "geographic",
      title: "Nearby visits while in Conway tomorrow",
      subtitle: "Travel optimization",
      confidence: 88,
      evidence: ["Calendar shows Conway meeting 2pm", "Four high-value contacts within 15 minutes", "Clustered outreach saves 2 hours"],
      priority: "medium",
      campaignGoal: "Expand county coverage",
      actionLabel: "View suggested route",
      county: "Faulkner County",
      signals: { campaignPriority: 0.65, impactEstimate: 0.7, urgency: 0.6, relationshipStrength: 0.6, geographicEfficiency: 0.95, historicalSuccess: 0.75, userPreferences: 0.8 },
    }),
  ];
}

export function loadRecommendations(): Recommendation[] {
  if (cache) return cache;
  cache = bootstrapRecommendations();
  return cache;
}

function loadFeedback(): RecommendationFeedback[] {
  if (feedbackCache) return feedbackCache;
  if (!existsSync(FEEDBACK_PATH)) return [];
  const raw = JSON.parse(readFileSync(FEEDBACK_PATH, "utf8"));
  feedbackCache = raw.feedback || [];
  return feedbackCache!;
}

function saveFeedback(items: RecommendationFeedback[]) {
  feedbackCache = items;
  writeFileSync(FEEDBACK_PATH, JSON.stringify({ version: "1.0.0", feedback: items }, null, 2) + "\n", "utf8");
}

function applyFeedback(recs: Recommendation[]): Recommendation[] {
  const feedback = loadFeedback();
  const byRec = new Map<string, RecommendationFeedback>();
  for (const f of feedback) {
    byRec.set(f.recommendationId, f);
  }
  return recs.map((r) => {
    const f = byRec.get(r.id);
    if (!f) return r;
    if (f.action === "accept") return { ...r, status: "accepted" };
    if (f.action === "dismiss" || f.action === "not_relevant" || f.action === "wrong_recommendation")
      return { ...r, status: "dismissed" };
    if (f.action === "remind_later" || f.action === "already_done") return { ...r, status: "deferred" };
    return r;
  });
}

export function listRecommendations(options: {
  category?: RecommendationCategory | string;
  status?: string;
  county?: string;
  limit?: number;
  includeDismissed?: boolean;
} = {}): Recommendation[] {
  let recs = applyFeedback(loadRecommendations());
  if (!options.includeDismissed) {
    recs = recs.filter((r) => r.status === "active" || r.status === "accepted");
  }
  if (options.category) recs = recs.filter((r) => r.category === options.category);
  if (options.status) recs = recs.filter((r) => r.status === options.status);
  if (options.county) recs = recs.filter((r) => r.county === options.county);
  recs.sort((a, b) => b.score - a.score);
  return recs.slice(0, options.limit ?? 50);
}

export function getDailyBriefing(userName = "Steve"): DailyBriefing {
  const priorities = listRecommendations({ category: "daily", limit: 5 });
  const all = listRecommendations({ limit: 100 });
  return {
    greeting: `Good Morning ${userName}`,
    campaignHealthPercent: 92,
    immediateActions: all.filter((r) => r.priority === "immediate").length,
    highPriority: all.filter((r) => r.priority === "high" || r.priority === "immediate").length,
    priorities,
  };
}

export function getExplanation(id: string): Recommendation | null {
  return applyFeedback(loadRecommendations()).find((r) => r.id === id) ?? null;
}

export function recordFeedback(
  recommendationId: string,
  action: FeedbackAction,
  userId = "admin",
  notes?: string
): RecommendationFeedback {
  const entry: RecommendationFeedback = {
    id: `fb-${Date.now()}`,
    recommendationId,
    action,
    userId,
    recorded_at: new Date().toISOString(),
    notes,
  };
  const items = [...loadFeedback(), entry];
  saveFeedback(items);
  return entry;
}

export function getTelemetry() {
  const recs = loadRecommendations();
  const feedback = loadFeedback();
  const accepted = feedback.filter((f) => f.action === "accept").length;
  const dismissed = feedback.filter((f) => f.action === "dismiss" || f.action === "wrong_recommendation").length;
  const avgConfidence = recs.reduce((s, r) => s + r.confidence, 0) / recs.length;
  return {
    recommendationsGenerated: recs.length,
    feedbackRecorded: feedback.length,
    accepted,
    dismissed,
    averageConfidence: Math.round(avgConfidence),
    categories: [...new Set(recs.map((r) => r.category))],
  };
}
