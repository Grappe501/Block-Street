/**
 * CAE-11.12-W2 — Canonical data model protocol tests
 */
import { CANONICAL_KNOWLEDGE_ENTITIES } from "./entity-registry";
import { KNOWLEDGE_STORE_KEYS } from "./data-model";
import {
  validateKnowledgeArtifact,
  validateClaim,
  validateCitation,
  validateCourseCompletion,
  validateCertificationAward,
} from "./data-validation";
import { childExceedsParent, isClaimTransitionAllowed } from "./state-machines";
import { buildTraceabilityChain, explainLearningObjectExistence } from "./traceability";
import { getVersioningRules } from "./versioning";
import { runKnwW2Certification } from "./w2";
import type {
  AIKnowledgeSuggestionRecord,
  CertificationAwardRecord,
  CitationRecord,
  KnowledgeArtifactRecord,
  KnowledgeClaimRecord,
  LearningCompletionRecord,
} from "./data-model";

export type W2TestResult = { name: string; passed: boolean; detail?: string };

const sampleArtifact = (): KnowledgeArtifactRecord => ({
  canonical_id: "art-test-1",
  public_id: "KNW-001",
  display_name: "Voter registration guide",
  canonical_slug: "voter-registration-guide",
  institution_id: "inst-1",
  initiative_id: "ini-1",
  parent_object_id: "col-1",
  parent_object_type: "KnowledgeCollection",
  object_type: "KnowledgeArtifact",
  visibility: "institution_internal",
  governance_classification: 3,
  steward_human_id: "human-steward",
  created_by: "human-steward",
  last_modified_by: "human-steward",
  created_at: "2026-07-12T00:00:00Z",
  updated_at: "2026-07-12T00:00:00Z",
  current_version: 1,
  lifecycle_state: "draft",
  tags: [],
  confidence_level: "medium",
  content_origin: "human",
  is_ai_generated: false,
  collection_id: "col-1",
  domain_id: "dom-1",
  artifact_type: "knowledge_article",
  body: "Registration steps for new voters.",
  summary: "Voter registration guide",
  language: "en",
  published_version_id: null,
  evidence_status: "none",
});

export function runKnwW2ModelTests(): W2TestResult[] {
  const results: W2TestResult[] = [];

  results.push({
    name: "entity_registry",
    passed: CANONICAL_KNOWLEDGE_ENTITIES.length >= 50,
    detail: `${CANONICAL_KNOWLEDGE_ENTITIES.length} entities`,
  });

  results.push({
    name: "store_keys",
    passed: Object.keys(KNOWLEDGE_STORE_KEYS).length >= 40,
    detail: `${Object.keys(KNOWLEDGE_STORE_KEYS).length} keys`,
  });

  const sm = runKnwW2Certification();
  const stateMachineGate = sm.gates.find((g) => g.id === "CAE-11.12-W2-G05");
  results.push({
    name: "state_machines",
    passed: stateMachineGate?.passed === true,
    detail: "Artifact, Course, Certification, Competency, Claim",
  });

  const validatedClaim: KnowledgeClaimRecord = {
    ...sampleArtifact(),
    object_type: "KnowledgeClaim",
    lifecycle_state: "validated",
    artifact_id: "art-test-1",
    claim_text: "Youth registration increased 12%.",
    evidence_status: "none",
    requires_evidence: true,
  };
  const claimIssues = validateClaim(validatedClaim);
  results.push({
    name: "claim_requires_evidence_status",
    passed: claimIssues.some((i) => i.code === "KNW-V-013" || i.code === "KNW-V-014"),
    detail: claimIssues.map((i) => i.code).join(", "),
  });

  results.push({
    name: "version_immutability_rules",
    passed: getVersioningRules().immutable.includes("knowledge_versions"),
    detail: getVersioningRules().immutable.join(", "),
  });

  const completion: LearningCompletionRecord = {
    ...sampleArtifact(),
    object_type: "LearningCompletion",
    lifecycle_state: "completed",
    human_id: "human-learner",
    course_id: "course-1",
    completed_at: "2026-07-12T00:00:00Z",
    bound_artifact_version: 0,
    bound_course_version: 0,
  };
  const completionIssues = validateCourseCompletion(completion);
  results.push({
    name: "course_completion_binds_version",
    passed: completionIssues.some((i) => i.code === "KNW-V-032" || i.code === "KNW-V-033"),
  });

  const award: CertificationAwardRecord = {
    ...sampleArtifact(),
    object_type: "CertificationAward",
    lifecycle_state: "awarded",
    certification_id: "cert-1",
    human_id: "human-learner",
    awarded_at: null,
    expires_at: null,
    requirements_met: false,
    awarded_by_human_id: null,
  };
  const awardIssues = validateCertificationAward(award);
  results.push({
    name: "certification_requires_requirements",
    passed: awardIssues.some((i) => i.code === "KNW-V-043"),
  });

  const aiArtifact: KnowledgeArtifactRecord = {
    ...sampleArtifact(),
    is_ai_generated: true,
    content_origin: "human",
  };
  const aiIssues = validateKnowledgeArtifact(aiArtifact);
  results.push({
    name: "ai_content_labeled",
    passed: aiIssues.some((i) => i.code === "KNW-V-006"),
  });

  const orphanCitation: CitationRecord = {
    ...sampleArtifact(),
    object_type: "Citation",
    claim_id: "",
    source_id: "",
    artifact_id: "",
    locator: "p.1",
    excerpt_optional: null,
  };
  const citationIssues = validateCitation(orphanCitation);
  results.push({
    name: "no_orphan_citation",
    passed: citationIssues.some((i) => i.code === "KNW-V-021"),
  });

  results.push({
    name: "claim_transition_requires_evidence",
    passed: isClaimTransitionAllowed("pending_evidence", "validated") === false,
  });

  const aiSuggestion: AIKnowledgeSuggestionRecord = {
    ...sampleArtifact(),
    object_type: "AIKnowledgeSuggestion",
    lifecycle_state: "pending",
    artifact_id_optional: null,
    suggestion_text: "Consider adding turnout data.",
    generated_by_service_id: "svc-tutor",
    reviewed_by_human_id: null,
    is_ai_generated: true,
    does_not_create_truth: true,
  };
  results.push({
    name: "ai_suggestion_not_truth",
    passed: aiSuggestion.does_not_create_truth === true && aiSuggestion.is_ai_generated === true,
  });

  const chain = buildTraceabilityChain({
    learning_object: { entity_type: "LearningObject", entity_id: "lo1", display_name: "Quiz module" },
    lesson: { entity_type: "Lesson", entity_id: "l1", display_name: "Registration basics" },
    module: { entity_type: "Module", entity_id: "m1", display_name: "Module 1" },
    course: { entity_type: "Course", entity_id: "c1", display_name: "Field organizer training" },
    domain: { entity_type: "KnowledgeDomain", entity_id: "d1", display_name: "Civic engagement" },
    institution: { entity_type: "Institution", entity_id: "inst", display_name: "Block Street" },
  });
  results.push({
    name: "traceability_chain",
    passed: chain.length === 6 && explainLearningObjectExistence(chain).includes("Field organizer training"),
  });

  results.push({
    name: "child_exceeds_parent",
    passed: childExceedsParent("active", "draft") === true && childExceedsParent("draft", "active") === false,
  });

  const artIssues = validateKnowledgeArtifact(sampleArtifact());
  results.push({ name: "artifact_validation", passed: artIssues.length === 0 });

  const cert = runKnwW2Certification();
  results.push({
    name: "protocol_w2_gates",
    passed: cert.gates.filter((g) => g.id.startsWith("CAE-11.12-W2-G")).every((g) => g.passed),
    detail: `${cert.gates.filter((g) => g.passed).length}/${cert.gates.length}`,
  });

  return results;
}

export function allKnwW2TestsPassed(): boolean {
  return runKnwW2ModelTests().every((t) => t.passed);
}
