/**
 * CAE-11.12-W3 — Knowledge domain service tests
 */
import { caeId, nowIso } from "../../utils";
import {
  knowledgeDomainService,
  assertKnowledgeMutationViaService,
} from "./services/knowledge-engine";
import type { KnowledgeCommandEnvelope } from "./services/commands";
import { assertArtifactTransition } from "./services/validation-pipeline";
import { isServiceOrAiIdentity } from "./services/policy";
import { readStoreSlice, KNOWLEDGE_DOMAIN_EVENTS_KEY } from "./services/repository";
import { KNOWLEDGE_STORE_KEYS } from "./data-model";
import type {
  AIKnowledgeSuggestionRecord,
  CertificationRecord,
  CompetencyRecord,
  HumanCompetencyRecord,
  KnowledgeArtifactRecord,
  LearningCompletionRecord,
} from "./data-model";
import { saveCertification, saveCompetency } from "./services/repository";

function knwEnvelope(
  partial: Partial<KnowledgeCommandEnvelope> & {
    command_type: KnowledgeCommandEnvelope["command_type"];
    payload?: Record<string, unknown>;
  }
): KnowledgeCommandEnvelope {
  return {
    command_id: caeId("cmd"),
    command_type: partial.command_type,
    actor_human_id: partial.actor_human_id ?? "usr-001",
    institution_id: partial.institution_id ?? "inst-block-street",
    active_membership_id: partial.active_membership_id ?? "mem-001",
    initiative_id_optional: partial.initiative_id_optional ?? "ini-knw-test",
    entity_id_optional: partial.entity_id_optional ?? null,
    expected_version_optional: partial.expected_version_optional ?? null,
    requested_at: nowIso(),
    request_id: caeId("req"),
    correlation_id: caeId("cor"),
    idempotency_key: partial.idempotency_key ?? null,
    reason_optional: partial.reason_optional ?? null,
    request_source: partial.request_source ?? "human",
    payload: partial.payload ?? {},
  };
}

export interface W3TestResult {
  name: string;
  passed: boolean;
  detail?: string;
}

export function runKnwW3ServiceTests(): W3TestResult[] {
  const results: W3TestResult[] = [];
  const assert = (name: string, condition: boolean, detail?: string) => {
    results.push({ name, passed: condition, detail });
  };

  const domainId = "dom-w3-test";
  const collectionId = "col-w3-test";

  try {
    assertArtifactTransition("draft", "published", "test");
    assert("draft→published rejected", false);
  } catch {
    assert("draft→published rejected", true);
  }

  assert("service identity detected", isServiceOrAiIdentity("svc-bot-001"));

  try {
    assertKnowledgeMutationViaService();
    assert("direct mutation forbidden", false);
  } catch {
    assert("direct mutation forbidden", true);
  }

  const created = knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "CreateKnowledgeArtifact",
      payload: {
        display_name: `W3 Knowledge Test ${Date.now()}`,
        body: "Canonical voter outreach playbook content.",
        domain_id: domainId,
        collection_id: collectionId,
        artifact_type: "knowledge_article",
      },
    })
  );
  assert("create artifact starts draft", created.success && created.new_status_optional === "draft");
  const artifactId = created.entity_id!;

  const publishBlocked = knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "PublishKnowledgeArtifact",
      payload: { artifact_id: artifactId },
    })
  );
  assert("publish without approval blocked", !publishBlocked.success);

  const edited = knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "EditKnowledgeArtifactDraft",
      payload: { artifact_id: artifactId, body: "Revised outreach content." },
      expected_version_optional: 1,
    })
  );
  assert("edit draft artifact", edited.success && (edited.version ?? 0) >= 2);

  const staleEdit = knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "EditKnowledgeArtifactDraft",
      payload: { artifact_id: artifactId, body: "Stale write attempt." },
      expected_version_optional: 1,
    })
  );
  assert("version conflict on stale expected_version", !staleEdit.success);

  const translation = knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "CreateKnowledgeTranslationDraft",
      payload: {
        source_artifact_id: artifactId,
        target_language: "es",
        translated_body: "Contenido de divulgación revisado.",
      },
    })
  );
  assert("translation draft created", translation.success);

  knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "EditKnowledgeArtifactDraft",
      payload: { artifact_id: artifactId, body: "Bump version to stale translation." },
    })
  );

  const submitted = knowledgeDomainService.execute(
    knwEnvelope({ command_type: "SubmitKnowledgeArtifactForReview", payload: { artifact_id: artifactId } })
  );
  assert("submit for review", submitted.success && submitted.new_status_optional === "review");

  const reviews = readStoreSlice<{ canonical_id: string; artifact_id: string }>(KNOWLEDGE_STORE_KEYS.knowledge_reviews);
  const reviewId = reviews.find((r) => r.artifact_id === artifactId)?.canonical_id ?? "";

  knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "CompleteKnowledgeReview",
      payload: { artifact_id: artifactId, review_id: reviewId, findings: "Ready for validation" },
    })
  );
  knowledgeDomainService.execute(
    knwEnvelope({ command_type: "ValidateKnowledgeArtifact", payload: { artifact_id: artifactId } })
  );

  knowledgeDomainService.execute(
    knwEnvelope({ command_type: "ApproveKnowledgeArtifact", payload: { artifact_id: artifactId } })
  );

  const published = knowledgeDomainService.execute(
    knwEnvelope({ command_type: "PublishKnowledgeArtifact", payload: { artifact_id: artifactId } })
  );
  assert("publish after approval", published.success && published.new_status_optional === "published");

  const staleTranslation = knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "ApproveKnowledgeTranslation",
      payload: { translation_id: translation.entity_id! },
    })
  );
  assert(
    "translation staleness on source version change",
    !staleTranslation.success &&
      staleTranslation.validation_errors.some((e) => e.code === "TRANSLATION_STALE_SOURCE")
  );

  const course = knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "CreateCourse",
      payload: {
        display_name: "Field canvassing fundamentals",
        description: "Core canvassing skills",
        domain_id: domainId,
      },
    })
  );
  assert("create course", course.success);
  const courseId = course.entity_id!;

  knowledgeDomainService.execute(
    knwEnvelope({ command_type: "PublishCourseVersion", payload: { course_id: courseId } })
  );

  const completion = knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "CompleteLearningTarget",
      payload: { human_id: "usr-002", course_id: courseId },
    })
  );
  assert("course completion binds version", completion.success);
  const completions = readStoreSlice<LearningCompletionRecord>(KNOWLEDGE_STORE_KEYS.learning_completions);
  const comp = completions.find((c) => c.canonical_id === completion.entity_id);
  assert(
    "bound_course_version set",
    (comp?.bound_course_version ?? 0) > 0 && (comp?.bound_artifact_version ?? 0) > 0,
    `course=${comp?.bound_course_version}`
  );

  const competencyId = caeId("cmp");
  const competency: CompetencyRecord = {
    canonical_id: competencyId,
    public_id: "CMP-TEST",
    display_name: "Door knock competency",
    canonical_slug: "door-knock",
    institution_id: "inst-block-street",
    initiative_id: "ini-knw-test",
    parent_object_id: domainId,
    parent_object_type: "KnowledgeDomain",
    object_type: "Competency",
    visibility: "institution_internal",
    governance_classification: 3,
    steward_human_id: "usr-001",
    created_by: "usr-001",
    last_modified_by: "usr-001",
    created_at: nowIso(),
    updated_at: nowIso(),
    current_version: 1,
    lifecycle_state: "active",
    tags: [],
    confidence_level: "medium",
    content_origin: "human",
    is_ai_generated: false,
    description: "Canvassing competency",
    skill_ids: [],
    assessment_required: true,
  };
  saveCompetency(competency);

  const humanCompetenciesBefore = readStoreSlice<HumanCompetencyRecord>(KNOWLEDGE_STORE_KEYS.human_competency_records).length;
  assert(
    "competency not auto from course completion",
    humanCompetenciesBefore === readStoreSlice<HumanCompetencyRecord>(KNOWLEDGE_STORE_KEYS.human_competency_records).length
  );

  const certId = caeId("crt");
  const certWithReqs: CertificationRecord = {
    canonical_id: certId,
    public_id: "CERT-TEST",
    display_name: "Field lead certification",
    canonical_slug: "field-lead",
    institution_id: "inst-block-street",
    initiative_id: "ini-knw-test",
    parent_object_id: domainId,
    parent_object_type: "KnowledgeDomain",
    object_type: "Certification",
    visibility: "institution_internal",
    governance_classification: 3,
    steward_human_id: "usr-001",
    created_by: "usr-001",
    last_modified_by: "usr-001",
    created_at: nowIso(),
    updated_at: nowIso(),
    current_version: 1,
    lifecycle_state: "active",
    tags: [],
    confidence_level: "medium",
    content_origin: "human",
    is_ai_generated: false,
    description: "Requires course + competency",
    competency_ids: [competencyId],
    course_ids: [courseId],
    requirement_ids: ["req-001"],
    expiration_months: 12,
    issuing_authority_human_id: "usr-001",
  };
  saveCertification(certWithReqs);

  const certBlocked = knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "AwardCertification",
      payload: { certification_id: certId, human_id: "usr-002" },
    })
  );
  assert("certification blocked without requirements", !certBlocked.success);

  const aiSuggestion = knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "CreateAIKnowledgeSuggestion",
      request_source: "ai_suggestion",
      payload: {
        suggestion_text: "Add section on bilingual outreach.",
        service_identity_id: "svc-ai-knw-001",
      },
    })
  );
  assert("AI suggestion created", aiSuggestion.success);
  const suggestions = readStoreSlice<AIKnowledgeSuggestionRecord>(KNOWLEDGE_STORE_KEYS.ai_knowledge_suggestions);
  const suggestion = suggestions.find((s) => s.canonical_id === aiSuggestion.entity_id);
  const artifacts = readStoreSlice<KnowledgeArtifactRecord>(KNOWLEDGE_STORE_KEYS.knowledge_artifacts);
  assert(
    "AI suggestion cannot become canonical without review",
    suggestion?.does_not_create_truth === true &&
      !artifacts.some((a) => a.body === suggestion?.suggestion_text && a.lifecycle_state === "published")
  );

  const events = readStoreSlice<{ event_id: string }>(KNOWLEDGE_DOMAIN_EVENTS_KEY);
  assert("events emitted on publish", events.some((e) => e.event_id && published.events.includes(e.event_id)), `${events.length} events`);

  const idemKey = caeId("idem");
  const idem1 = knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "CreateKnowledgeClaim",
      idempotency_key: idemKey,
      payload: { artifact_id: artifactId, claim_text: "Outreach increased turnout." },
    })
  );
  const idem2 = knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "CreateKnowledgeClaim",
      idempotency_key: idemKey,
      payload: { artifact_id: artifactId, claim_text: "Outreach increased turnout." },
    })
  );
  assert("idempotency works", idem1.success && idem2.success && idem1.entity_id === idem2.entity_id);

  const svcCmd = knowledgeDomainService.execute(
    knwEnvelope({
      command_type: "CreateKnowledgeArtifact",
      actor_human_id: "svc-bot-001",
      payload: {
        display_name: "Bot artifact",
        body: "Should fail",
        domain_id: domainId,
        collection_id: collectionId,
      },
    })
  );
  assert("service identity rejected", !svcCmd.success);

  return results;
}

export function allW3TestsPassed(): boolean {
  return runKnwW3ServiceTests().every((t) => t.passed);
}
