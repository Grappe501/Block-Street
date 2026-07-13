/**
 * CAE-11.7-W1 — LocalBrain data model
 */
import type {
  CONTEXT_OBJECTS,
  MEMORY_CATEGORIES,
  MEMORY_TIERS,
  PRIVACY_DOMAINS,
} from "./constitution";

export type MemoryCategory = (typeof MEMORY_CATEGORIES)[number];
export type MemoryTier = (typeof MEMORY_TIERS)[number];
export type PrivacyDomain = (typeof PRIVACY_DOMAINS)[number];
export type ContextObjectType = (typeof CONTEXT_OBJECTS)[number];

export interface LocalBrainRecord {
  localbrain_id: string;
  human_id: string;
  brain_version: string;
  status: "active" | "suspended" | "migrating";
  primary_language: string;
  secondary_languages: string[];
  timezone: string;
  preferred_voice: string;
  assistant_personality: "professional" | "warm" | "concise";
  privacy_level: "strict" | "balanced" | "open";
  memory_policy: "human_promotion_required" | "auto_working_expiry";
  sync_policy: "encrypted_cloud" | "offline_first";
  created_at: string;
  updated_at: string;
}

export interface MemoryRecord {
  memory_id: string;
  localbrain_id: string;
  human_id: string;
  tier: MemoryTier;
  category: MemoryCategory;
  title: string;
  content: string;
  privacy_domain: PrivacyDomain;
  institution_id: string | null;
  reference: string | null;
  expires_at: string | null;
  promoted_from: string | null;
  searchable: true;
  created_at: string;
  updated_at: string;
}

export interface WorkingMemorySnapshot {
  snapshot_id: string;
  localbrain_id: string;
  human_id: string;
  current_mission_id: string | null;
  current_meeting_id: string | null;
  current_task_id: string | null;
  current_document_id: string | null;
  current_conversation_id: string | null;
  current_calendar_block_id: string | null;
  current_research_id: string | null;
  current_goal_id: string | null;
  updated_at: string;
}

export interface ContextRuntimeRecord {
  context_id: string;
  localbrain_id: string;
  human_id: string;
  institution_id: string | null;
  mission_id: string | null;
  calendar_event_id: string | null;
  organization_id: string | null;
  conversation_id: string | null;
  learning_session_id: string | null;
  executive_priority: string | null;
  device: string;
  timezone: string;
  priorities: string[];
  deadlines: string[];
  updated_at: string;
}

export interface TimelineEntryRecord {
  entry_id: string;
  localbrain_id: string;
  human_id: string;
  period: "today" | "this_week" | "this_month" | "history";
  category: MemoryCategory;
  title: string;
  occurred_at: string;
  institution_id: string | null;
}

export interface KnowledgeGraphNodeRecord {
  node_id: string;
  localbrain_id: string;
  human_id: string;
  node_type: "relationship" | "organization" | "topic" | "project" | "document" | "meeting" | "idea" | "skill" | "community";
  label: string;
  links: string[];
  created_at: string;
}

export interface InstitutionConnectionRecord {
  connection_id: string;
  localbrain_id: string;
  human_id: string;
  institution_id: string;
  institution_type: "campaign" | "county" | "state" | "coalition" | "business" | "school" | "volunteer" | "research";
  roles: string[];
  trust_level: "verified" | "pending";
  connected_at: string;
}

export interface WorkspaceMemoryRecord {
  workspace_memory_id: string;
  localbrain_id: string;
  human_id: string;
  favorite_dashboards: string[];
  pinned_missions: string[];
  preferred_reports: string[];
  frequent_searches: string[];
  workspace_layout: Record<string, unknown>;
  recent_organizations: string[];
  updated_at: string;
}

export interface RelationshipMemoryRecord {
  relationship_id: string;
  localbrain_id: string;
  human_id: string;
  contact_human_id: string;
  relationship_type: "colleague" | "mentor" | "team" | "committee" | "organization";
  interaction_count: number;
  last_interaction_at: string;
}

export interface CalendarMemoryRecord {
  calendar_memory_id: string;
  localbrain_id: string;
  human_id: string;
  working_hours: { start: string; end: string };
  meeting_preferences: string[];
  travel_patterns: string[];
  preparation_buffer_minutes: number;
  recovery_time_minutes: number;
  updated_at: string;
}

export interface LearningMemoryRecord {
  learning_memory_id: string;
  localbrain_id: string;
  human_id: string;
  completed_courses: string[];
  competencies: string[];
  certifications: string[];
  preferred_style: "visual" | "reading" | "hands_on";
  knowledge_gaps: string[];
  future_goals: string[];
  updated_at: string;
}

export interface LocalBrainPreferencesRecord {
  preferences_id: string;
  localbrain_id: string;
  human_id: string;
  notifications: Record<string, boolean>;
  accessibility: Record<string, unknown>;
  language: string;
  updated_at: string;
}

export interface LocalBrainAnalyticsRecord {
  analytics_id: string;
  localbrain_id: string;
  human_id: string;
  memory_count: number;
  context_updates: number;
  institution_connections: number;
  knowledge_nodes: number;
  computed_at: string;
}

export const LOCALBRAIN_STORE_KEYS = {
  brains: "lix_localbrain_records",
  memories: "lix_localbrain_memories",
  working: "lix_localbrain_working",
  context: "lix_localbrain_context",
  timeline: "lix_localbrain_timeline",
  knowledge: "lix_localbrain_knowledge",
  connections: "lix_localbrain_connections",
  workspace: "lix_localbrain_workspace",
  relationships: "lix_localbrain_relationships",
  calendar: "lix_localbrain_calendar",
  learning: "lix_localbrain_learning",
  preferences: "lix_localbrain_preferences",
  analytics: "lix_localbrain_analytics",
} as const;
