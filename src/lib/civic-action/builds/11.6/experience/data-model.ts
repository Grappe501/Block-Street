/**
 * CAE-11.6-W14 — Human experience & workspace data model
 */
import type { DEVICE_TYPES, NOTIFICATION_GROUPS, SUPPORTED_LANGUAGES, WORKSPACE_TYPES } from "./constitution";

export type WorkspaceType = (typeof WORKSPACE_TYPES)[number];
export type NotificationGroup = (typeof NOTIFICATION_GROUPS)[number];
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export type DeviceType = (typeof DEVICE_TYPES)[number];

export interface WorkspaceRecord {
  workspace_id: string;
  human_id: string;
  institution_id: string;
  workspace_type: WorkspaceType;
  role: string;
  current_mission_id: string | null;
  device: DeviceType;
  language: SupportedLanguage;
  pinned_cards: string[];
  preferences: Record<string, unknown>;
  status: "active" | "switched" | "offline";
  created_at: string;
  updated_at: string;
}

export interface ContextRecord {
  context_id: string;
  human_id: string;
  institution_id: string;
  current_mission: string | null;
  current_meeting: string | null;
  current_team: string | null;
  current_calendar_event: string | null;
  current_objective: string | null;
  workload_level: "low" | "moderate" | "high";
  location: string | null;
  device: DeviceType;
  updated_at: string;
}

export interface DashboardCardRecord {
  card_id: string;
  human_id: string;
  institution_id: string;
  card_type: "todays_work" | "upcoming_meeting" | "mission_status" | "training_progress" | "budget_status" | "knowledge_updates" | "emergency_alerts";
  title: string;
  content: string;
  priority: number;
  pinned: boolean;
  visible: boolean;
  updated_at: string;
}

export interface ExperienceNotificationRecord {
  notification_id: string;
  human_id: string;
  institution_id: string;
  group: NotificationGroup;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

export interface ExperienceMemoryRecord {
  memory_id: string;
  human_id: string;
  institution_id: string;
  open_items: string[];
  favorite_tools: string[];
  recent_missions: string[];
  pinned_knowledge: string[];
  recent_searches: string[];
  preferred_views: string[];
  updated_at: string;
}

export interface PersonalizationRecord {
  personalization_id: string;
  institution_id: string;
  brand_name: string;
  logo_url: string;
  primary_color: string;
  terminology: Record<string, string>;
  theme: "light" | "dark" | "high_contrast";
  home_layout: string;
  updated_at: string;
}

export interface OfflineQueueRecord {
  queue_id: string;
  human_id: string;
  institution_id: string;
  action_type: string;
  payload: Record<string, unknown>;
  status: "pending" | "synced";
  created_at: string;
}

export interface ExperienceAnalyticsRecord {
  analytics_id: string;
  institution_id: string;
  navigation_success_rate: number;
  search_success_rate: number;
  task_completion_rate: number;
  mobile_usage_rate: number;
  accessibility_usage_rate: number;
  ai_usefulness_score: number;
  improves_interface_not_humans: true;
  computed_at: string;
}

export interface SearchLogRecord {
  search_id: string;
  human_id: string;
  institution_id: string;
  query: string;
  result_count: number;
  domains_searched: string[];
  permissions_respected: true;
  searched_at: string;
}

export const EXPERIENCE_STORE_KEYS = {
  workspaces: "ops_experience_workspaces",
  context: "ops_experience_context",
  dashboard_cards: "ops_experience_dashboard_cards",
  notifications: "ops_experience_notifications",
  memory: "ops_experience_memory",
  personalization: "ops_experience_personalization",
  offline_queue: "ops_experience_offline_queue",
  analytics: "ops_experience_analytics",
  search_log: "ops_experience_search_log",
} as const;
