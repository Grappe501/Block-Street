/**
 * CAE-11.2-W4 — Objective UI view models (OBJ-UX-001)
 */
import type { CanonicalObjectiveStatus, ObjectiveType } from "../data-model";
import type { ExecutionCommandType } from "../services/commands";

export type ObjectiveExperienceRole =
  | "viewer"
  | "contributor"
  | "volunteer"
  | "operational_owner"
  | "executive_owner"
  | "administrator";

export type ObjectiveUiAction = {
  action_key: ExecutionCommandType | string;
  label: string;
  description: string;
  available: boolean;
  blocked_reason_optional?: string;
  requires_confirmation: boolean;
  endpoint_or_command: string;
  permission_key: string;
};

export type HumanBlockedState = {
  title: string;
  explanation: string;
  items: string[];
  responsible_role?: string;
  next_action?: string;
  support_path?: string;
};

export type ObjectiveCardView = {
  objective_id: string;
  display_name: string;
  objective_type: ObjectiveType;
  type_label: string;
  lifecycle_state: CanonicalObjectiveStatus;
  status_label: string;
  health_label: string;
  purpose_summary: string;
  progress_percent: number | null;
  viewer_role: ObjectiveExperienceRole;
  href: string;
};

export type ObjectivePortfolioView = {
  initiative_id: string;
  institution_name: string;
  active_count: number;
  needs_attention_count: number;
  cards: ObjectiveCardView[];
  empty_state: { title: string; body: string; action_label: string; action_href: string } | null;
};

export type ObjectiveWorkspaceShellView = {
  objective_id: string;
  initiative_id: string;
  institution_name: string;
  display_name: string;
  lifecycle_state: CanonicalObjectiveStatus;
  lifecycle_label: string;
  health_label: string;
  viewer_role: ObjectiveExperienceRole;
  viewer_role_label: string;
  purpose_line: string;
  nav_sections: { key: string; label: string; href: string }[];
  archived_banner: string | null;
};

export type DashboardCardView = {
  key: string;
  title: string;
  body: string;
  tone?: "default" | "success" | "warning" | "info";
  href?: string;
};

export type KeyResultCardView = {
  key_result_id: string;
  title: string;
  current: number | null;
  target: number;
  unit: string;
  progress_percent: number;
  trend_label: string;
  confidence_label: string;
};

export type WorkstreamColumnView = {
  column: string;
  label: string;
  cards: {
    workstream_id: string;
    title: string;
    purpose: string;
    owner_label: string;
    mission_count: number;
    blocker_summary: string | null;
    progress_label: string;
  }[];
};

export type TodaysWorkItemView = {
  id: string;
  title: string;
  why: string;
  entity_type: "Task" | "Mission" | "Review";
  href: string;
  priority: "high" | "normal" | "low";
};

export type ObjectiveDashboardView = {
  shell: ObjectiveWorkspaceShellView;
  six_questions: { question: string; answer: string }[];
  cards: DashboardCardView[];
  key_results: KeyResultCardView[];
  todays_priorities: TodaysWorkItemView[];
  lifecycle_actions: ObjectiveUiAction[];
  role_focus: string[];
  recent_activity: { id: string; when: string; text: string }[];
  ai_suggestions: string[];
};

export type MissionWorkspaceView = {
  mission_id: string;
  display_name: string;
  workstream_name: string;
  objective_name: string;
  operational_lead_label: string;
  status_label: string;
  due_date: string | null;
  sections: { key: string; label: string; summary: string }[];
  tasks: { id: string; description: string; status_label: string; owner_label: string }[];
};

export type ObjectiveBuilderStepView = {
  key: string;
  title: string;
  prompt: string;
  field: string;
};

export type ObjectiveBuilderView = {
  initiative_id: string;
  steps: ObjectiveBuilderStepView[];
};
