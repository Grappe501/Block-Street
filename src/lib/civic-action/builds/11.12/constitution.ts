/**
 * CAE-11.12-W1 — Knowledge, Learning & Institutional Intelligence constitution (ADP-001)
 */
export const KNW_GOVERNING_PRINCIPLE =
  "Knowledge exists to improve decisions and execution. Every knowledge artifact should reduce uncertainty—not merely increase information.";

export const INSTITUTIONAL_INTELLIGENCE_DEFINITION =
  "Institutional Intelligence is the combination of verified knowledge, institutional memory, operational evidence, research, Human expertise, historical decisions, and continuous learning.";

export const KNOWLEDGE_HIERARCHY = [
  "institution",
  "knowledge_domain",
  "knowledge_collection",
  "knowledge_article",
  "lesson",
  "course",
  "learning_path",
  "competency",
  "certification",
  "institutional_capability",
] as const;

export const KNOWLEDGE_CATEGORIES = [
  "policy",
  "procedure",
  "playbook",
  "standard_operating_procedure",
  "research",
  "case_study",
  "lesson",
  "course",
  "assessment",
  "certification",
  "faq",
  "best_practice",
  "reference",
  "historical_record",
  "training_guide",
  "field_manual",
  "knowledge_article",
] as const;

export const KNOWLEDGE_LIFECYCLE = [
  "draft",
  "review",
  "validated",
  "published",
  "operational",
  "historical",
  "archived",
] as const;

export const EVIDENCE_SOURCE_TYPES = [
  "operational_evidence",
  "research",
  "legislation",
  "policy",
  "meeting_decision",
  "historical_record",
  "expert_review",
  "approved_institutional_experience",
] as const;

export const COMPETENCY_MEASURES = [
  "knowledge",
  "understanding",
  "application",
  "practice",
  "assessment",
  "observation",
  "evidence",
  "certification",
] as const;

export const CONSTITUTIONAL_COMMITMENTS = [
  "Every knowledge artifact belongs to institutional context",
  "Every institutional fact traces to evidence",
  "Knowledge history is permanent through versioning",
  "Competency requires demonstrated capability",
  "AI cannot create institutional truth",
  "Institutional memory survives personnel changes",
  "Learning improves execution",
  "Knowledge stewardship protects institutional quality",
  "Every published artifact remains attributable",
  "Confidence is always visible",
] as const;

export const AI_MAY = [
  "tutor",
  "summarize",
  "translate",
  "explain",
  "recommend",
  "identify knowledge gaps",
  "generate study plans",
  "connect related knowledge",
] as const;

export const AI_MAY_NOT = [
  "fabricate sources",
  "rewrite institutional history",
  "certify competency",
  "approve policy",
  "create institutional truth",
  "conceal uncertainty",
] as const;

export const REQUIRED_CONSTITUTIONAL_SERVICES = [
  "KnowledgeConstitutionService",
  "KnowledgePolicyService",
  "EvidencePolicyService",
  "LearningPolicyService",
  "CompetencyPolicyService",
  "CertificationPolicyService",
  "KnowledgeIntegrityService",
  "KnowledgeStewardshipService",
  "InstitutionMemoryPolicyService",
] as const;

export const CONTEXTUAL_PARENT_TYPES = [
  "institution",
  "organization",
  "initiative",
  "objective",
  "mission",
  "decision",
  "communication",
  "course",
  "competency",
  "policy",
] as const;

export const SPANISH_LEARNING_EXAMPLES = {
  formal_avoid: "Proceed to instructional module four.",
  conversational_prefer: "You're ready for the next step. Before we move on, let's make sure this concept makes sense.",
} as const;

export function getKnowledgeConstitution() {
  return {
    build: "11.12",
    system_id: "ADP-001",
    governing_principle: KNW_GOVERNING_PRINCIPLE,
    institutional_intelligence: INSTITUTIONAL_INTELLIGENCE_DEFINITION,
    hierarchy: KNOWLEDGE_HIERARCHY,
    categories: KNOWLEDGE_CATEGORIES,
    lifecycle: KNOWLEDGE_LIFECYCLE,
    evidence_sources: EVIDENCE_SOURCE_TYPES,
    competency_measures: COMPETENCY_MEASURES,
    commitments: CONSTITUTIONAL_COMMITMENTS,
    ai_may: AI_MAY,
    ai_may_not: AI_MAY_NOT,
    required_services: REQUIRED_CONSTITUTIONAL_SERVICES,
    contextual_parents: CONTEXTUAL_PARENT_TYPES,
    spanish_examples: SPANISH_LEARNING_EXAMPLES,
  };
}
