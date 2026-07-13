/**
 * CAE-11.12-W4 — Learning UI view models (KNW-UX-001)
 */
export type LearningExperienceRole =
  | "guest"
  | "learner"
  | "volunteer"
  | "instructor"
  | "knowledge_author"
  | "knowledge_steward"
  | "reviewer"
  | "competency_verifier"
  | "certification_authority"
  | "administrator"
  | "executive";

export type LearningUiAction = {
  action_key: string;
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

export type LearningWorkbenchShellView = {
  institution_name: string;
  viewer_role: LearningExperienceRole;
  viewer_role_label: string;
  nav_sections: { key: string; label: string; href: string }[];
  active_section_key: string;
  context_panel: {
    related_knowledge: { id: string; title: string; href: string }[];
    recent_activity: { id: string; text: string; when: string }[];
    people: { id: string; label: string; role: string }[];
  };
};

export type HomeDashboardView = {
  shell: LearningWorkbenchShellView;
  primary_question: string;
  welcome_message: string;
  current_mission: { id: string; title: string; href: string } | null;
  continue_learning: { course_id: string; display_name: string; progress_percent: number; href: string }[];
  upcoming_events: { id: string; title: string; when: string | null; href: string }[];
  assigned_reviews: { id: string; title: string; href: string }[];
  recent_knowledge: { id: string; title: string; href: string; status_label: string }[];
  ai_briefing: string;
  recommended_next_step: { label: string; href: string; reason: string } | null;
  notifications_count: number;
  progress_snapshot: { label: string; value: string }[];
  competency_note: string;
  certification_note: string;
  ai_advisory_only: true;
};

export type KnowledgeReaderView = {
  shell: LearningWorkbenchShellView;
  artifact_id: string;
  title: string;
  summary: string;
  body_preview: string;
  status_label: string;
  version: number;
  is_historical: boolean;
  historical_banner: string | null;
  effective_date: string | null;
  author_label: string;
  reviewers: string[];
  sources: string[];
  confidence_label: string;
  related_knowledge: { id: string; title: string; href: string }[];
  related_courses: { id: string; title: string; href: string }[];
  related_competencies: { id: string; title: string; href: string }[];
  ai_command_prompts: string[];
  governed_actions: LearningUiAction[];
};

export type LearningWorkspaceView = {
  shell: LearningWorkbenchShellView;
  learning_path: { course_id: string; display_name: string; status: string; href: string }[];
  current_course: { course_id: string; display_name: string; progress_percent: number; href: string } | null;
  lesson_progress: { lesson_id: string; label: string; complete: boolean }[];
  time_remaining_label: string;
  notes_href: string;
  bookmarks_href: string;
  tutor_href: string;
  assessments: { id: string; title: string; href: string }[];
  certificates_in_progress: { id: string; title: string; href: string }[];
  ai_tutor_advisory: true;
};

export type CompetencyWorkspaceView = {
  shell: LearningWorkbenchShellView;
  competencies: {
    id: string;
    title: string;
    expected_behavior: string;
    evidence_summary: string;
    verifier_label: string | null;
    last_reviewed: string | null;
    incomplete_items: string[];
    completion_is_not_competency: true;
    href: string;
  }[];
};

export type CertificationWorkspaceView = {
  shell: LearningWorkbenchShellView;
  held: { id: string; title: string; issued_at: string | null; expires_at: string | null; verify_href: string }[];
  in_progress: { id: string; title: string; remaining: string[]; href: string }[];
  blocked: { id: string; title: string; remaining: string[]; href: string }[];
  renewal_actions: { id: string; label: string; href: string }[];
};

export type UniversalSearchView = {
  shell: LearningWorkbenchShellView;
  query: string;
  results: {
    id: string;
    type: string;
    title: string;
    snippet: string;
    href: string;
    badge: "current" | "historical" | "draft" | "restricted";
  }[];
  placeholder: string;
};

export type AICommandBarView = {
  prompts: string[];
  advisory_only: true;
  canonical_mutation_allowed: false;
};
