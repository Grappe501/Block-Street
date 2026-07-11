export type RelationshipHealth =
  | "healthy"
  | "growing"
  | "stable"
  | "needs_attention"
  | "dormant"
  | "inactive";

export type RelationshipType =
  | "personal"
  | "professional"
  | "volunteer"
  | "leadership"
  | "mentorship"
  | "donor"
  | "media"
  | "government"
  | "faith_community"
  | "education"
  | "business"
  | "healthcare"
  | "nonprofit"
  | "coalition"
  | "organization"
  | "cross_county"
  | "strategic_partner";

export interface StrengthSignals {
  meetingFrequency: number;
  sharedEvents: number;
  missionCollaboration: number;
  volunteerWork: number;
  communication: number;
  introductions: number;
  jointOrganizations: number;
  relationshipLength: number;
  recentActivity: number;
  consistency: number;
}

export interface TimelineEvent {
  event: string;
  at: string;
}

export interface RelationshipProfile {
  id: string;
  participants: string[];
  organizations: string[];
  type: RelationshipType | string;
  strengthPercent: number;
  trustPercent: number;
  influencePercent: number;
  health: RelationshipHealth;
  lastInteraction: string;
  daysSinceInteraction: number;
  sharedMissions: number;
  sharedOrganizations: number;
  sharedEvents: number;
  county: string;
  tags: string[];
  strengthSignals: StrengthSignals;
  timeline: TimelineEvent[];
  feedsRecommendation: boolean;
  connectorRole?: string;
  connectedCommunities?: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: "person" | "organization";
  county: string;
  role?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  strength: number;
}

export interface RelationshipAlert {
  id: string;
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  relationshipId: string | null;
  category: string;
  detectedAt: string;
  feedsRecommendation: boolean;
  feedsMissionBoard: boolean;
}

export interface IntroductionSuggestion {
  id: string;
  fromLabel: string;
  toLabel: string;
  reason: string;
  evidence: string[];
  confidencePercent: number;
  mutualConnections: number;
  status: string;
}

export interface Connector {
  id: string;
  label: string;
  role: string;
  influencePercent: number;
  connectorRole: string;
  connectedCommunities: string[];
  county: string;
}

export interface RelationshipDashboard {
  relationshipHealthPercent: number;
  strongRelationships: number;
  growing: number;
  dormant: number;
  introductionsSuggested: number;
  bridgeBuilders: number;
  highInfluenceLeaders: number;
}

export interface NetworkAnalysis {
  centralConnectors: string[];
  isolatedNodes: string[];
  bridgeOrganizations: string[];
  coalitionOverlap: string[];
  regionalCollaboration: { county: string; connectionCount: number }[];
}
