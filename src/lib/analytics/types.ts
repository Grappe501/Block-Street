export type HealthComponent = {
  id: string;
  name: string;
  score: number;
  trend: string;
  weight: number;
};

export type ExecutiveDashboard = {
  campaignHealthPercent: number;
  healthComponents: HealthComponent[];
  volunteerGrowthPercent: number;
  countyCoverage: { active: number; total: number };
  organizations: number;
  leaders: number;
  upcomingEvents: number;
  missionCompletionPercent: number;
  registrationGoalPercent: number;
  petitionProgressPercent: number;
  newContacts: number;
  calculatedAt: string;
};

export type CountyAnalytics = {
  slug: string;
  name: string;
  healthPercent: number;
  growthPercent: number;
  leadership: string;
  volunteerTrend: string;
  organizationGrowthPercent: number;
  registrationPercent: number;
  petitionPercent: number;
  volunteers: number;
  organizations: number;
  eventsHeld: number;
  missionCompletionPercent: number;
};

export type KpiDefinition = {
  id: string;
  name: string;
  definition: string;
  formula: string;
  owner: string;
  refreshRate: string;
  thresholds: { critical: number; warning: number; healthy: number };
  visualization: string;
  relatedGoals: string[];
  currentValue?: number;
};

export type Forecast = {
  id: string;
  name: string;
  target: number;
  current: number;
  progressPercent: number;
  forecastDate: string;
  confidencePercent: number;
  contributingFactors: string[];
};

export type AnalyticsAlert = {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  message: string;
  county?: string;
  category: string;
  detectedAt: string;
  feedsRecommendation: boolean;
};

export type MissionAnalytics = {
  completed: number;
  inProgress: number;
  overdue: number;
  successRatePercent: number;
  averageCompletionDays: number;
};

export type WarehouseEvent = {
  event_id: string;
  event_type: string;
  source: string;
  county?: string;
  entity_id?: string;
  timestamp: string;
  payload?: Record<string, unknown>;
};

export type DrillDownNode = {
  id: string;
  label: string;
  value: string | number;
  children?: DrillDownNode[];
};
