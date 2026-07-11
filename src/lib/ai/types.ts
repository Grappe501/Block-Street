export type ActionCategory = "advisory" | "approval_required" | "restricted";

export type ContentType =
  | "fact"
  | "prediction"
  | "recommendation"
  | "assumption";

export interface AIEvidence {
  source: string;
  detail: string;
  type: ContentType;
}

export interface AIResponse {
  id: string;
  answer: string;
  category: ActionCategory;
  confidencePercent: number;
  evidence: AIEvidence[];
  assumptions: string[];
  risks: string[];
  alternatives?: string[];
  toolsUsed: string[];
  requiresApproval: boolean;
  timestamp: string;
}

export interface MemoryEntry {
  id: string;
  key: string;
  value: string;
  scope: string;
  updatedAt: string;
}

export interface AuditEntry {
  timestamp: string;
  userId: string;
  action: string;
  prompt: string;
  dataSources: string[];
  toolsUsed: string[];
  suggestedActions: string[];
  acceptedActions: string[];
  rejectedActions: string[];
  category: ActionCategory;
}

export interface MorningBrief {
  greeting: string;
  campaignHealthPercent: number;
  todaysPriorities: number;
  criticalDeadlines: number;
  travel: string;
  volunteerAlerts: number;
  countyAlerts: number;
  recommendedCalls: number;
  topPriorities: string[];
  evidence: AIEvidence[];
}

export interface EveningBrief {
  completedMissions: number;
  unfinishedWork: number;
  emergingIssues: string[];
  tomorrowPreparation: string[];
}

export interface ChatRequest {
  prompt: string;
  userId?: string;
}

export interface PlanRequest {
  topic: string;
  horizon?: string;
  userId?: string;
}

export interface WriteRequest {
  type: string;
  topic: string;
  tone?: string;
  userId?: string;
}

export interface AIMetrics {
  totalInteractions: number;
  advisoryCount: number;
  approvalRequiredCount: number;
  acceptanceRatePercent: number;
  averageConfidencePercent: number;
  groundingCoveragePercent: number;
}
