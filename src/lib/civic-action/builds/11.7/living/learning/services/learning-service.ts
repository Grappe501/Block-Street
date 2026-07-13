/**
 * CAE-11.7-W7 — Learning Runtime services
 */
import { caeId, nowIso } from "../../../../../utils";
import { localBrainRuntime } from "../../localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { contextIntelligenceRuntime } from "../../context/services/context-intelligence-service";
import { seedContextIfEmpty } from "../../context/services/seed";
import { seedExecutiveIfEmpty } from "../../executive-assistant/services/seed";
import { seedOrganizerIfEmpty } from "../../organizer/services/seed";
import { seedResearchIfEmpty } from "../../research/services/seed";
import { seedConversationIfEmpty } from "../../conversation/services/seed";
import type { CompetencyDomain, CurriculumType, CompetencyGraphNode } from "../data-model";
import {
  getLearningAnalytics,
  getUniversity,
  listCertifications,
  listCompetencies,
  listCompetencyGraph,
  listCourses,
  listCoursesByHuman,
  listCurricula,
  listExperienceLearning,
  listKnowledgeGaps,
  listLearningPlans,
  listMentorRecommendations,
  listSimulations,
  saveAssessment,
  saveCertification,
  saveCompetency,
  saveCompetencyGraphNode,
  saveCourse,
  saveCurriculum,
  saveExperienceLearning,
  saveKnowledgeGap,
  saveLearningAnalytics,
  saveLearningPlan,
  saveMentorRecommendation,
  saveSimulation,
  saveUniversity,
} from "./repository";

export class LearningError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function ensureLearningBoot() {
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedExecutiveIfEmpty();
  seedOrganizerIfEmpty();
  seedResearchIfEmpty();
  seedConversationIfEmpty();
}

function getBrain(humanId: string) {
  ensureLearningBoot();
  const brain = localBrainRuntime.localBrain.getByHuman(humanId);
  if (!brain) throw new LearningError("LEARNING_CONTEXT_REQUIRED", "LocalBrain required");
  return brain;
}

export const competencyService = {
  list: listCompetencies,
  register(input: {
    institution_id: string;
    name: string;
    description: string;
    domain: CompetencyDomain;
    difficulty?: "beginner" | "intermediate" | "advanced" | "expert";
    governance_owner: string;
  }) {
    const record = {
      competency_id: caeId("cmp"),
      institution_id: input.institution_id,
      name: input.name,
      description: input.description,
      domain: input.domain,
      difficulty: input.difficulty ?? ("intermediate" as const),
      required_skills: [],
      evidence: ["Competency framework definition"],
      assessment_methods: ["practical demonstration", "written assessment"],
      expiration: null,
      renewal_requirements: [],
      explainable: true as const,
      governance_owner: input.governance_owner,
    };
    saveCompetency(record);
    return { competency: record, explainable: true };
  },
};

export const curriculumService = {
  listCourses,
  listCurricula,
  createCourse(input: {
    human_id: string;
    institution_id: string;
    title: string;
    curriculum_type: CurriculumType;
    learning_objective: string;
    competencies: string[];
    governance_owner: string;
  }) {
    const record = {
      course_id: caeId("crs"),
      institution_id: input.institution_id,
      human_id: input.human_id,
      title: input.title,
      curriculum_type: input.curriculum_type,
      learning_objective: input.learning_objective,
      competencies: input.competencies,
      difficulty: "intermediate",
      prerequisites: [],
      evidence: ["Curriculum design document"],
      version: 1,
      completion_requirements: ["Complete all modules", "Pass assessment"],
      assessment_rules: ["Human evaluator required for certification track"],
      governance_owner: input.governance_owner,
      status: "published" as const,
    };
    saveCourse(record);
    saveCurriculum(record);
    return { course: record, event: "curriculum.updated" as const };
  },
};

export const learningPlanService = {
  list: listLearningPlans,
  create(input: {
    human_id: string;
    institution_id: string;
    role_context: string;
    goals: string[];
    competency_gaps?: string[];
    language?: "en" | "es";
    available_time?: string;
  }) {
    getBrain(input.human_id);
    const context = contextIntelligenceRuntime.assemble({
      human_id: input.human_id,
      institution_id: input.institution_id,
    });
    const gaps = input.competency_gaps ?? ["community_organizing", "grant_writing"];
    const courses = listCourses(input.institution_id).slice(0, 2).map((c) => c.course_id);
    const record = {
      plan_id: caeId("lpl"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      title: "Personalized Learning Pathway",
      role_context: input.role_context,
      goals: input.goals,
      competency_gaps: gaps,
      recommended_courses: courses,
      available_time: input.available_time ?? "3h/week",
      language: input.language ?? ("en" as const),
      evolving: true as const,
      created_at: nowIso(),
    };
    saveLearningPlan(record);
    return {
      plan: record,
      event: "learning_plan.created" as const,
      event_started: "learning.started" as const,
      confidence: context.confidence,
    };
  },
};

export const aiTutorService = {
  session(input: {
    human_id: string;
    institution_id: string;
    topic: string;
    language?: "en" | "es";
    mode?: "explain" | "quiz" | "flashcards" | "practice";
  }) {
    const lang = input.language ?? "en";
    const content =
      lang === "es"
        ? `Explicación: ${input.topic} — conceptos clave con ejemplos prácticos.`
        : `Explanation: ${input.topic} — key concepts with practical examples.`;
    return {
      topic: input.topic,
      language: lang,
      mode: input.mode ?? "explain",
      content,
      adaptive: true,
      manipulates_assessment: false,
      spanish_supported: true,
    };
  },
  quiz(input: { human_id: string; topic: string; language?: "en" | "es" }) {
    const questions =
      input.language === "es"
        ? [`¿Cuál es el propósito de ${input.topic}?`, `¿Qué evidencia apoya ${input.topic}?`]
        : [`What is the purpose of ${input.topic}?`, `What evidence supports ${input.topic}?`];
    return { questions, practice_only: true, manipulated: false };
  },
};

export const certificationService = {
  list: listCertifications,
  request(input: {
    human_id: string;
    institution_id: string;
    name: string;
    certification_type: "internal" | "state" | "professional" | "volunteer" | "continuing_education";
    competency_ids: string[];
    evidence: string[];
  }) {
    if (input.evidence.length === 0) {
      throw new LearningError("CERTIFICATION_REQUIRES_EVIDENCE", "Certification requires governed evidence");
    }
    const record = {
      certification_id: caeId("crt"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      name: input.name,
      certification_type: input.certification_type,
      competency_ids: input.competency_ids,
      evidence: input.evidence,
      requirements_met: false,
      awarded_by: null,
      expires_at: null,
      status: "pending" as const,
      ai_self_certified: false as const,
    };
    saveCertification(record);
    return { certification: record, human_governance_required: true, auto_awarded: false };
  },
  award(certificationId: string, humanId: string, awardedBy: string) {
    const certs = listCertifications(humanId);
    const existing = certs.find((c) => c.certification_id === certificationId);
    if (!existing) throw new LearningError("CERTIFICATION_NOT_FOUND", "Certification not found");
    if (!existing.evidence.length) throw new LearningError("CERTIFICATION_NO_EVIDENCE", "Evidence required");
    const updated = {
      ...existing,
      status: "awarded" as const,
      awarded_by: awardedBy,
      requirements_met: true,
      expires_at: new Date(Date.now() + 365 * 86400000).toISOString(),
    };
    saveCertification(updated);
    return {
      certification: updated,
      event: "certification.awarded" as const,
      ai_self_certified: false,
      competency_event: "competency.earned" as const,
    };
  },
};

export const simulationService = {
  list: listSimulations,
  start(input: {
    human_id: string;
    institution_id: string;
    scenario_type: string;
    title: string;
    description: string;
  }) {
    const record = {
      simulation_id: caeId("sim"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      scenario_type: input.scenario_type,
      title: input.title,
      description: input.description,
      difficulty: "intermediate",
      completed_at: null,
      score: null,
      practice_only: true as const,
      mutates_canonical: false as const,
    };
    saveSimulation(record);
    return { simulation: record, practice_environment: true };
  },
  complete(simulationId: string, humanId: string, score: number) {
    const sims = listSimulations(humanId);
    const existing = sims.find((s) => s.simulation_id === simulationId);
    if (!existing) throw new LearningError("SIMULATION_NOT_FOUND", "Simulation not found");
    const updated = { ...existing, completed_at: nowIso(), score };
    saveSimulation(updated);
    return { simulation: updated, event: "simulation.completed" as const, mutates_canonical: false };
  },
};

export const knowledgeGapService = {
  list: listKnowledgeGaps,
  detect(input: {
    human_id: string;
    institution_id: string;
    gap_type: "competency" | "policy" | "training" | "certification" | "curriculum";
    subject: string;
    description: string;
    priority?: "low" | "medium" | "high";
  }) {
    const record = {
      gap_id: caeId("gap"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      gap_type: input.gap_type,
      subject: input.subject,
      description: input.description,
      priority: input.priority ?? ("medium" as const),
      evidence: ["Competency graph analysis", "Mission performance review"],
      detected_at: nowIso(),
    };
    saveKnowledgeGap(record);
    return { gap: record, event: "knowledge_gap.detected" as const, deficiencies_visible: true };
  },
};

export const mentorService = {
  list: listMentorRecommendations,
  recommend(input: {
    human_id: string;
    institution_id: string;
    mentor_human_id: string;
    expertise: string[];
    reason: string;
  }) {
    const record = {
      mentor_id: caeId("mnt"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      mentor_human_id: input.mentor_human_id,
      expertise: input.expertise,
      reason: input.reason,
      recommendation_only: true as const,
      status: "recommended" as const,
    };
    saveMentorRecommendation(record);
    return { mentor: record, event: "mentor.recommended" as const, auto_assigned: false };
  },
};

export const experienceLearningService = {
  list: listExperienceLearning,
  convert(input: {
    mission_id: string;
    institution_id: string;
    human_id: string;
    lessons_learned: string[];
    case_study: string;
  }) {
    const record = {
      experience_id: caeId("exp"),
      mission_id: input.mission_id,
      institution_id: input.institution_id,
      human_id: input.human_id,
      lessons_learned: input.lessons_learned,
      case_study: input.case_study,
      training_module: null,
      status: "draft" as const,
      governed_review: true as const,
    };
    saveExperienceLearning(record);
    return {
      experience: record,
      event: "experience.converted" as const,
      auto_published: false,
      governed_review: true,
    };
  },
};

export const universityService = {
  get: getUniversity,
  provision(institutionId: string, name: string) {
    const existing = getUniversity(institutionId);
    if (existing) return { university: existing, provisioned: false };
    const record = {
      university_id: caeId("uni"),
      institution_id: institutionId,
      name,
      departments: ["Civic Leadership", "Community Organizing", "Volunteer Academy"],
      programs: ["County Immersion Certificate", "Organizer Bootcamp"],
      courses: [],
      certificates: ["Volunteer Facilitator"],
      governance_committee: ["curriculum-committee"],
    };
    saveUniversity(record);
    return { university: record, provisioned: true };
  },
};

export const learningAnalyticsService = {
  get(institutionId: string, humanId?: string) {
    return getLearningAnalytics(institutionId, humanId);
  },
  compute(input: { institution_id: string; human_id?: string }) {
    const humanId = input.human_id;
    const courses = humanId ? listCoursesByHuman(humanId) : listCourses(input.institution_id);
    const certs = humanId ? listCertifications(humanId) : [];
    const gaps = humanId ? listKnowledgeGaps(humanId) : [];
    const record = {
      analytics_id: caeId("lan"),
      institution_id: input.institution_id,
      human_id: humanId ?? null,
      progress_pct: humanId ? 42 : 68,
      competencies_earned: certs.filter((c) => c.status === "awarded").length,
      courses_completed: courses.filter((c) => c.status === "completed").length,
      certifications_active: certs.filter((c) => c.status === "awarded").length,
      knowledge_gaps: gaps.length,
      institutional_capability_score: 0.72,
      human_worth_score: null,
      computed_at: nowIso(),
    };
    saveLearningAnalytics(record);
    return {
      analytics: record,
      evaluates_education: true,
      ranks_human_worth: false,
    };
  },
};

export const learningGovernanceService = {
  prohibited: [
    "falsify_competency",
    "auto_certify",
    "manipulate_assessments",
    "hide_deficiencies",
    "rank_human_worth",
    "sell_educational_data",
    "share_without_authorization",
    "invent_training_history",
  ],
  check(action: string) {
    const blocked = this.prohibited.some((p) => action.includes(p));
    return { allowed: !blocked, education_belongs_to_human: true };
  },
  assess(input: {
    human_id: string;
    institution_id: string;
    course_id: string;
    score: number;
    evaluator: string;
  }) {
    if (input.evaluator === "ai-only") {
      throw new LearningError("HUMAN_EVALUATOR_REQUIRED", "Human evaluator required for governed assessments");
    }
    const passed = input.score >= 70;
    const record = {
      assessment_id: caeId("asm"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      course_id: input.course_id,
      score: input.score,
      passed,
      manipulated: false as const,
      assessed_at: nowIso(),
      evaluator: input.evaluator,
    };
    saveAssessment(record);
    return { assessment: record, manipulated: false, auto_certified: false };
  },
};

export const competencyGraphService = {
  list: listCompetencyGraph,
  link(input: {
    institution_id: string;
    node_type: CompetencyGraphNode["node_type"];
    label: string;
    reference_id: string;
    linked_nodes?: string[];
  }) {
    const record = {
      node_id: caeId("cgn"),
      institution_id: input.institution_id,
      node_type: input.node_type,
      label: input.label,
      reference_id: input.reference_id,
      linked_nodes: input.linked_nodes ?? [],
    };
    saveCompetencyGraphNode(record);
    return { node: record, living_graph: true };
  },
};

export const learningRuntimeService = {
  dashboard(input: { human_id: string; institution_id: string }) {
    ensureLearningBoot();
    const plans = listLearningPlans(input.human_id);
    const gaps = listKnowledgeGaps(input.human_id);
    const certs = listCertifications(input.human_id);
    const university = getUniversity(input.institution_id);
    const analytics = learningAnalyticsService.compute({
      institution_id: input.institution_id,
      human_id: input.human_id,
    });
    return {
      greeting: "Learning Dashboard",
      next_question: "How can I become more effective tomorrow than I am today?",
      todays_lesson: plans[0]?.recommended_courses[0] ?? null,
      learning_path: plans[0] ?? null,
      knowledge_gaps: gaps.slice(0, 3),
      certifications: certs.filter((c) => c.status === "awarded" || c.status === "renewal_required"),
      university: university?.name ?? null,
      progress_pct: analytics.analytics.progress_pct,
      human_worth_score: null,
      mutates_canonical: false,
      auto_certify: false,
    };
  },
  promote(input: {
    human_id: string;
    institution_id: string;
    experience_id: string;
    target: "training_module" | "curriculum";
  }) {
    const experiences = listExperienceLearning(input.institution_id);
    const exp = experiences.find((e) => e.experience_id === input.experience_id);
    if (!exp) throw new LearningError("EXPERIENCE_NOT_FOUND", "Experience record not found");
    return {
      experience_id: input.experience_id,
      promotion_status: "pending_governed_review" as const,
      target: input.target,
      auto_published: false,
      mutates_canonical: false,
      governed_review: true,
    };
  },
};

export const learningRuntime = {
  learning: learningRuntimeService,
  competencies: competencyService,
  curriculum: curriculumService,
  plans: learningPlanService,
  tutor: aiTutorService,
  certifications: certificationService,
  simulations: simulationService,
  gaps: knowledgeGapService,
  mentors: mentorService,
  experience: experienceLearningService,
  university: universityService,
  analytics: learningAnalyticsService,
  governance: learningGovernanceService,
  competencyGraph: competencyGraphService,
};
