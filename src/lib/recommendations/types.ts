export type RecommendationCategory =
  | "daily"
  | "contact"
  | "county"
  | "organization"
  | "event"
  | "communication"
  | "leadership"
  | "volunteer"
  | "mission"
  | "geographic";

export type RecommendationPriority = "immediate" | "high" | "medium" | "low";

export type RecommendationStatus = "active" | "accepted" | "dismissed" | "deferred";

export type ScoreBreakdown = {
  campaignPriority: number;
  impactEstimate: number;
  urgency: number;
  relationshipStrength: number;
  geographicEfficiency: number;
  historicalSuccess: number;
  userPreferences: number;
  total: number;
};

export type Recommendation = {
  id: string;
  category: RecommendationCategory;
  title: string;
  subtitle?: string;
  confidence: number;
  evidence: string[];
  priority: RecommendationPriority;
  impactEstimate?: number;
  effortEstimate?: string;
  durationEstimate?: string;
  deadline?: string;
  campaignGoal?: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  status: RecommendationStatus;
  actionLabel?: string;
  targetEntityType?: string;
  targetEntityId?: string;
  county?: string;
  created_at: string;
};

export type FeedbackAction =
  | "accept"
  | "dismiss"
  | "not_relevant"
  | "already_done"
  | "remind_later"
  | "wrong_recommendation";

export type RecommendationFeedback = {
  id: string;
  recommendationId: string;
  action: FeedbackAction;
  userId: string;
  recorded_at: string;
  notes?: string;
};

export type DailyBriefing = {
  greeting: string;
  campaignHealthPercent: number;
  immediateActions: number;
  highPriority: number;
  priorities: Recommendation[];
};
