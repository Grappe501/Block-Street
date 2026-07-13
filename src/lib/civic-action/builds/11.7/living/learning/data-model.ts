/**
 * CAE-11.7-W7 — Learning data model
 */
import type { COMPETENCY_DOMAINS, CURRICULUM_TYPES } from "./constitution";

export type CompetencyDomain = (typeof COMPETENCY_DOMAINS)[number];
export type CurriculumType = (typeof CURRICULUM_TYPES)[number];

export const LEARNING_STORE_KEYS = {
  competencies: "lix_learning_competencies",
  courses: "lix_learning_courses",
  curricula: "lix_learning_curricula",
  plans: "lix_learning_plans",
  certifications: "lix_learning_certifications",
  simulations: "lix_learning_simulations",
  gaps: "lix_learning_gaps",
  mentors: "lix_learning_mentors",
  experience: "lix_learning_experience",
  university: "lix_learning_university",
  competencyGraph: "lix_competency_graph",
  analytics: "lix_learning_analytics",
  assessments: "lix_learning_assessments",
} as const;

export interface CompetencyRecord {
  competency_id: string;
  institution_id: string;
  name: string;
  description: string;
  domain: CompetencyDomain;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  required_skills: string[];
  evidence: string[];
  assessment_methods: string[];
  expiration: string | null;
  renewal_requirements: string[];
  explainable: true;
  governance_owner: string;
}

export interface CourseRecord {
  course_id: string;
  institution_id: string;
  human_id: string;
  title: string;
  curriculum_type: CurriculumType;
  learning_objective: string;
  competencies: string[];
  difficulty: string;
  prerequisites: string[];
  evidence: string[];
  version: number;
  completion_requirements: string[];
  assessment_rules: string[];
  governance_owner: string;
  status: "draft" | "published" | "completed";
}

export interface LearningPlanRecord {
  plan_id: string;
  human_id: string;
  institution_id: string;
  title: string;
  role_context: string;
  goals: string[];
  competency_gaps: string[];
  recommended_courses: string[];
  available_time: string;
  language: "en" | "es";
  evolving: true;
  created_at: string;
}

export interface CertificationRecord {
  certification_id: string;
  human_id: string;
  institution_id: string;
  name: string;
  certification_type: "internal" | "state" | "professional" | "volunteer" | "continuing_education";
  competency_ids: string[];
  evidence: string[];
  requirements_met: boolean;
  awarded_by: string | null;
  expires_at: string | null;
  status: "pending" | "awarded" | "expired" | "renewal_required";
  ai_self_certified: false;
}

export interface SimulationRecord {
  simulation_id: string;
  human_id: string;
  institution_id: string;
  scenario_type: string;
  title: string;
  description: string;
  difficulty: string;
  completed_at: string | null;
  score: number | null;
  practice_only: true;
  mutates_canonical: false;
}

export interface KnowledgeGapRecord {
  gap_id: string;
  human_id: string;
  institution_id: string;
  gap_type: "competency" | "policy" | "training" | "certification" | "curriculum";
  subject: string;
  description: string;
  priority: "low" | "medium" | "high";
  evidence: string[];
  detected_at: string;
}

export interface MentorRecommendationRecord {
  mentor_id: string;
  human_id: string;
  institution_id: string;
  mentor_human_id: string;
  expertise: string[];
  reason: string;
  recommendation_only: true;
  status: "recommended" | "connected" | "dismissed";
}

export interface ExperienceLearningRecord {
  experience_id: string;
  mission_id: string;
  institution_id: string;
  human_id: string;
  lessons_learned: string[];
  case_study: string;
  training_module: string | null;
  status: "draft" | "reviewed" | "published";
  governed_review: true;
}

export interface UniversityRecord {
  university_id: string;
  institution_id: string;
  name: string;
  departments: string[];
  programs: string[];
  courses: string[];
  certificates: string[];
  governance_committee: string[];
}

export interface CompetencyGraphNode {
  node_id: string;
  institution_id: string;
  node_type: "person" | "course" | "research" | "mission" | "organization" | "policy" | "project" | "experience" | "certification" | "mentor" | "competency";
  label: string;
  reference_id: string;
  linked_nodes: string[];
}

export interface LearningAnalyticsRecord {
  analytics_id: string;
  institution_id: string;
  human_id: string | null;
  progress_pct: number;
  competencies_earned: number;
  courses_completed: number;
  certifications_active: number;
  knowledge_gaps: number;
  institutional_capability_score: number;
  human_worth_score: null;
  computed_at: string;
}

export interface AssessmentRecord {
  assessment_id: string;
  human_id: string;
  institution_id: string;
  course_id: string;
  score: number;
  passed: boolean;
  manipulated: false;
  assessed_at: string;
  evaluator: string;
}
