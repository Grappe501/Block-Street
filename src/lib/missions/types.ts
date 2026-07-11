export type MissionType = "personal" | "team" | "county" | "organization" | "campaign" | "executive";
export type MissionScope = "my" | "team" | "county" | "organization" | "campaign" | "statewide";
export type MissionStatus =
  | "created"
  | "assigned"
  | "accepted"
  | "in_progress"
  | "blocked"
  | "review"
  | "completed"
  | "archived"
  | "waiting";
export type MissionSource =
  | "recommendation"
  | "analytics"
  | "calendar"
  | "manual"
  | "executive"
  | "volunteer"
  | "county"
  | "organization"
  | "ai"
  | "automation";
export type PriorityLabel = "Low" | "Medium" | "High" | "Critical";
export type ImpactLevel = "Low" | "Medium" | "High" | "Very High";
export type RiskLevel = "Low" | "Medium" | "High";

export interface PrioritySignals {
  campaignImpact: number;
  urgency: number;
  deadline: number;
  dependencies: number;
  countyNeed: number;
  leadershipPriority: number;
  resourceAvailability: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface MissionDependency {
  missionId: string;
  title: string;
  satisfied: boolean;
}

export interface TimelineEvent {
  event: string;
  at: string;
}

export interface Mission {
  id: string;
  title: string;
  type: MissionType;
  scope: MissionScope;
  purpose: string;
  successCriteria: string;
  priority: number;
  priorityLabel: PriorityLabel;
  impact: ImpactLevel;
  impactStars: number;
  owner: string;
  contributors: string[];
  county: string | null;
  organization: string | null;
  estimatedHours: number;
  dueAt: string;
  progressPercent: number;
  status: MissionStatus;
  source: MissionSource;
  healthPercent: number;
  risk: RiskLevel;
  checklist: ChecklistItem[];
  dependencies: MissionDependency[];
  prioritySignals: PrioritySignals;
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface MissionTemplate {
  id: string;
  name: string;
  type: MissionType;
  estimatedHours: number;
  checklist: string[];
}

export interface MissionDashboard {
  todaysMissions: number;
  highPriority: number;
  waiting: number;
  completedToday: number;
  upcomingDeadlines: number;
  missionHealthPercent: number;
}

export interface MissionAnalytics {
  completionRatePercent: number;
  averageDurationDays: number;
  blockedCount: number;
  inProgressCount: number;
  overdueCount: number;
  templateEffectiveness: Record<string, number>;
}
