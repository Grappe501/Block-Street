/**
 * CAE-11.1-W4 — Initiative UI view models (INI-UX-001)
 */
import type { CanonicalInitiativeStatus, CanonicalInitiativeType } from "../data-model";
import type { InitiativeCommandType } from "../services/commands";

export type InitiativeExperienceRole =
  | "viewer"
  | "participant"
  | "contributor"
  | "operational_owner"
  | "executive_owner"
  | "approver"
  | "administrator"
  | "auditor";

export type InitiativeUiAction = {
  action_key: InitiativeCommandType | string;
  label: string;
  description: string;
  available: boolean;
  blocked_reason_optional?: string;
  requires_confirmation: boolean;
  requires_step_up_authentication: boolean;
  impact_summary?: string;
  endpoint_or_command: string;
  permission_key: string;
  requirement_ids: string[];
};

export type InitiativeNextActionView = {
  label: string;
  description: string;
  href?: string;
  action_key?: string;
  tone: "info" | "none" | "action" | "warning" | "blocked";
};

export type InitiativeAttentionItem = {
  id: string;
  text: string;
  tone: "info" | "action" | "warning";
  href?: string;
};

export type InitiativeCardView = {
  initiative_id: string;
  name: string;
  type: CanonicalInitiativeType;
  type_label: string;
  status: CanonicalInitiativeStatus;
  status_label: string;
  purpose_summary: string;
  operational_owner_label: string;
  executive_owner_label: string | null;
  next_important_date: string | null;
  health_label: string;
  attention_item: string | null;
  viewer_role: InitiativeExperienceRole;
  last_updated: string;
  href: string;
};

export type InitiativePortfolioView = {
  institution_id: string;
  institution_name: string;
  mode: string;
  active_count: number;
  needs_attention_count: number;
  approvals_waiting: number;
  cards: InitiativeCardView[];
  empty_state: { title: string; body: string; action_label?: string; action_href?: string } | null;
};

export type InitiativeWorkspaceShellView = {
  initiative_id: string;
  institution_id: string;
  institution_name: string;
  initiative_name: string;
  initiative_type_label: string;
  lifecycle_state: CanonicalInitiativeStatus;
  lifecycle_label: string;
  viewer_role: InitiativeExperienceRole;
  viewer_role_label: string;
  next_action: InitiativeNextActionView;
  nav_sections: { key: string; label: string; href: string; enabled: boolean; hint?: string }[];
  cross_institution_banner: string | null;
  owner_required_banner: string | null;
  archived_banner: string | null;
};

export type InitiativeOverviewView = {
  shell: InitiativeWorkspaceShellView;
  attention: InitiativeAttentionItem[];
  purpose_summary: string;
  state_summary: string;
  last_lifecycle_change: string | null;
  ownership_summary: string;
  readiness_or_health: string | null;
  integration_cards: { key: string; title: string; body: string; action_label?: string }[];
  activity_feed: { id: string; when: string; text: string }[];
  lifecycle_actions: InitiativeUiAction[];
};

export type CharterSectionView = {
  key: string;
  label: string;
  status: "not_started" | "in_progress" | "ready" | "needs_review" | "approved";
  prompt: string;
};

export type InitiativeCharterWorkbenchView = {
  initiative_id: string;
  charter_version: number | null;
  completion_summary: string;
  sections: CharterSectionView[];
  readiness: { required_before_review: string[]; recommended: string[]; before_activation: string[] };
  next_action: InitiativeNextActionView;
};

export type ReadinessAreaView = {
  key: string;
  label: string;
  status: "complete" | "needs_attention" | "blocked";
  details: string[];
  action_label?: string;
  action_href?: string;
};

export type InitiativeReadinessView = {
  initiative_id: string;
  header: string;
  summary: string;
  ready_to_activate: boolean;
  must_complete: ReadinessAreaView[];
  recommended: ReadinessAreaView[];
  after_activation: ReadinessAreaView[];
  activation_preview: string | null;
};

export type HumanBlockedState = {
  title: string;
  explanation: string;
  items: string[];
  responsible_role?: string;
  next_action?: string;
  support_path: string;
};

export type InitiativeCreationWizardStep = {
  key: string;
  title: string;
  prompt: string;
};
