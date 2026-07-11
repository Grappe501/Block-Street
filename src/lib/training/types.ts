export type AssignmentStatus =
  | "assigned"
  | "not_started"
  | "in_progress"
  | "practice_required"
  | "assessment_pending"
  | "evaluation_pending"
  | "completed"
  | "overdue"
  | "waived"
  | "cancelled";

export type CertificationStatus =
  | "pending"
  | "active"
  | "expiring_soon"
  | "grace_period"
  | "expired"
  | "suspended"
  | "revoked"
  | "superseded";

export type AssessmentAttemptStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "auto_graded"
  | "evaluation_required"
  | "passed"
  | "failed"
  | "incomplete"
  | "invalidated";

export type RemediationStatus = "assigned" | "in_progress" | "ready_for_reassessment" | "completed" | "overdue" | "escalated";

export interface LearningPath {
  id: string;
  institution_id: string;
  name: string;
  description: string;
  target_role_key: string | null;
  target_permission_key: string | null;
  certification_definition_id: string | null;
  required: boolean;
  version: number;
  status: "draft" | "published" | "archived";
  estimated_duration_hours: number;
  renewal_period_days: number | null;
}

export interface Course {
  id: string;
  learning_path_id: string;
  title: string;
  sequence: number;
  required: boolean;
}

export interface TrainingLesson {
  id: string;
  course_id: string;
  lesson_type: string;
  title: string;
  sequence: number;
  duration_minutes: number;
  required: boolean;
}

export interface Competency {
  id: string;
  key: string;
  name: string;
  domain: string;
  required_level: string;
}

export interface TrainingAssignment {
  id: string;
  user_id: string;
  learning_path_id: string;
  institution_id: string;
  unit_id: string | null;
  assigned_by: string;
  assignment_reason: string;
  assigned_at: string;
  due_at: string | null;
  status: AssignmentStatus;
  completed_at: string | null;
}

export interface LearnerRecord {
  id: string;
  user_id: string;
  institution_id: string;
  learning_path_id: string;
  assignment_id: string;
  status: AssignmentStatus;
  progress_percent: number;
  current_step: string;
  lessons_completed: number;
  lessons_total: number;
  human_help_count: number;
  started_at: string | null;
  completed_at: string | null;
  last_activity_at: string;
}

export interface LessonCompletion {
  id: string;
  learner_record_id: string;
  lesson_id: string;
  completed_at: string;
  version: number;
}

export interface TrainingWorkspace {
  id: string;
  institution_id: string;
  user_id: string;
  learning_path_id: string;
  workspace_type: "practice";
  synthetic_data_profile: string;
  reset_policy: string;
  status: "active" | "reset" | "archived";
  created_at: string;
}

export interface TrainingScenario {
  id: string;
  key: string;
  title: string;
  description: string;
  competencies: string[];
  difficulty: string;
  guided: boolean;
}

export interface ScenarioAttempt {
  id: string;
  scenario_id: string;
  user_id: string;
  practice_workspace_id: string;
  mode: "guided" | "independent";
  actions_taken: string[];
  errors: number;
  hints_used: number;
  human_help_count: number;
  status: "in_progress" | "completed" | "failed";
  started_at: string;
  completed_at: string | null;
}

export interface Assessment {
  id: string;
  learning_path_id: string;
  title: string;
  assessment_type: string;
  passing_score: number;
  attempt_limit: number;
  requires_human_evaluation: boolean;
}

export interface AssessmentAttempt {
  id: string;
  assessment_id: string;
  user_id: string;
  started_at: string;
  submitted_at: string | null;
  score: number | null;
  status: AssessmentAttemptStatus;
  evaluator_id: string | null;
  evaluation_result: string | null;
  evidence_reference: string;
}

export interface CertificationDefinition {
  id: string;
  key: string;
  name: string;
  description: string;
  learning_path_id: string;
  eligible_role_key: string | null;
  eligible_permission_key: string | null;
  renewal_period_days: number;
  grace_period_days: number;
  status: "active" | "archived";
}

export interface CertificationAward {
  id: string;
  certification_definition_id: string;
  user_id: string;
  institution_id: string;
  issued_at: string;
  expires_at: string;
  issued_by: string;
  evidence_reference: string;
  status: CertificationStatus;
  revoked_at: string | null;
  revocation_reason: string | null;
}

export interface EvaluatorQualification {
  id: string;
  user_id: string;
  competency_domain: string;
  qualification_level: string;
  institution_id: string;
  status: "active" | "expired";
  expires_at: string | null;
}

export interface RemediationPlan {
  id: string;
  user_id: string;
  assessment_attempt_id: string | null;
  reason: string;
  required_actions: string[];
  assigned_by: string;
  due_at: string | null;
  status: RemediationStatus;
}

export interface TrainingAuditEvent {
  id: string;
  institution_id: string;
  actor_id: string;
  user_id: string | null;
  action: string;
  target_type: string;
  target_id: string;
  previous_state: string;
  new_state: string;
  reason: string | null;
  timestamp: string;
  correlation_id: string;
  result: "success" | "failure";
}

export interface TrainingHealth {
  assigned_learners: number;
  in_progress: number;
  completed: number;
  overdue: number;
  assessment_pass_rate: number;
  active_certifications: number;
  expiring_in_60_days: number;
  human_help_per_learner: number;
}
