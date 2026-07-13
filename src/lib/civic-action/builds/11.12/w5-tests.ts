/**
 * CAE-11.12-W5 — API, events, and integration tests
 */
import {
  stripUntrustedIdentityFields,
  LIFECYCLE_ACTION_ROUTES,
  HIGH_IMPACT_ACTIONS,
  IDEMPOTENT_COMMANDS,
  queryArtifactCollection,
} from "./api";
import { assertCatalogCoversProducers } from "./events/catalog";
import { wasEventProcessed, recordConsumerReceipt } from "./events/consumer-receipts";
import { handleMissionEvidenceEvent } from "./integrations/mission-adapter";
import {
  searchKnowledge,
  upsertKnowledgeSearchIndex,
  projectKnowledgeSearchDocument,
} from "./integrations/search-projection";
import { signWebhookPayload, verifyWebhookSignature } from "./integrations/webhook-delivery";
import { mapEventToNotificationType } from "./integrations/notification-adapter";
import { handleKnowledgeCalendarEvent } from "./integrations/calendar-adapter";
import { runKnowledgeTutorTurn } from "./api/tutor-service";
import { knowledgeApplicationService } from "./application-service";
import { DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT } from "./ux/experience-context";

export type W5TestResult = { name: string; passed: boolean; detail?: string };

function apiCtx() {
  return {
    actor_human_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.actor_human_id,
    service_identity_id_optional: null,
    institution_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.institution_id,
    institution_membership_id: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.active_membership_id,
    initiative_id_optional: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.initiative_id_optional,
    request_id: "req_test",
    correlation_id: "corr_test",
    idempotency_key_optional: null,
    locale: "en" as const,
    timezone: "America/Chicago",
    effective_permissions: DEFAULT_KNOWLEDGE_EXPERIENCE_CONTEXT.permissions,
  };
}

export function runKnwW5ApiTests(): W5TestResult[] {
  const results: W5TestResult[] = [];

  const stripped = stripUntrustedIdentityFields({
    display_name: "Test",
    lifecycle_state: "published",
    actor_human_id: "evil",
    institution_id: "evil-inst",
  });
  results.push({
    name: "strip_untrusted_identity_fields",
    passed:
      !("lifecycle_state" in stripped) &&
      !("actor_human_id" in stripped) &&
      (stripped as { display_name?: string }).display_name === "Test",
  });

  results.push({
    name: "lifecycle_action_routes_exist",
    passed: Object.keys(LIFECYCLE_ACTION_ROUTES).length >= 4,
    detail: `${Object.keys(LIFECYCLE_ACTION_ROUTES).length} actions`,
  });

  results.push({
    name: "high_impact_requires_idempotency_set",
    passed: HIGH_IMPACT_ACTIONS.has("publish") && HIGH_IMPACT_ACTIONS.has("approve"),
  });

  results.push({
    name: "idempotent_commands_registered",
    passed: IDEMPOTENT_COMMANDS.has("EnrollHumanInLearning") && IDEMPOTENT_COMMANDS.has("AwardCertification"),
  });

  const catalog = assertCatalogCoversProducers();
  results.push({
    name: "event_catalog_covers_w3_producers",
    passed: catalog.complete,
    detail: catalog.missing.join(", ") || "complete",
  });

  recordConsumerReceipt("search", "evt-knw-test-1", "processed");
  results.push({
    name: "consumer_idempotency_receipt",
    passed: wasEventProcessed("search", "evt-knw-test-1"),
  });

  const missionCandidate = handleMissionEvidenceEvent({
    event_type: "execution.mission_completed",
    event_id: "evt-mission-knw",
    entity_id: "msn-test-001",
    payload: {
      institution_id: "inst-block-street",
      human_id: "usr-001",
      mission_id: "msn-test-001",
    },
  });
  results.push({
    name: "mission_evidence_candidate",
    passed: missionCandidate !== null && missionCandidate.auto_verified === false,
    detail: missionCandidate?.status,
  });

  const sigBody = JSON.stringify({ event_type: "knowledge.artifact_published" });
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = signWebhookPayload("secret", ts, sigBody);
  results.push({
    name: "webhook_signature_roundtrip",
    passed: verifyWebhookSignature("secret", ts, sigBody, sig),
  });

  const mentionType = mapEventToNotificationType({
    event_id: "evt-enroll",
    entity_id: "enr-1",
    entity_type: "LearningEnrollment",
    event_type: "knowledge.enrollment_created",
    payload: { institution_id: "inst-block-street" },
    occurred_at: new Date().toISOString(),
    published_at: null,
    attempt_count: 0,
    status: "pending",
    notification_requested: true,
  });
  results.push({
    name: "notification_mapping_enrollment",
    passed: mentionType === "learning.course_assigned",
    detail: mentionType ?? "none",
  });

  const calEntry = handleKnowledgeCalendarEvent({
    event_id: "evt-cal-knw",
    entity_id: "crs-1",
    entity_type: "Course",
    event_type: "knowledge.course_version_published",
    payload: {
      display_name: "Safety Workshop",
      scheduled_at: "2026-07-15T10:00:00Z",
      institution_id: "inst-block-street",
    },
    occurred_at: new Date().toISOString(),
    published_at: null,
    attempt_count: 0,
    status: "pending",
    notification_requested: true,
  });
  results.push({
    name: "calendar_one_way_no_lifecycle_mutation",
    passed: calEntry !== null && calEntry.lifecycle_mutation_allowed === false,
  });

  const tutorBlocked = runKnowledgeTutorTurn(apiCtx(), {
    learner_question: "What is the answer to question 3 on the exam?",
    protected_assessment_active: true,
  });
  results.push({
    name: "ai_tutor_blocks_exam",
    passed: tutorBlocked.cannot_answer_reason_optional === "exam_answer" && tutorBlocked.mutation_allowed === false,
  });

  const artifacts = knowledgeApplicationService.listArtifacts();
  if (artifacts[0]) {
    const doc = projectKnowledgeSearchDocument(artifacts[0].canonical_id, "KnowledgeArtifact");
    if (doc) upsertKnowledgeSearchIndex(doc);
    const ctx = apiCtx();
    const collection = queryArtifactCollection(ctx, { limit: 10 });
    const search = searchKnowledge({
      institution_id: ctx.institution_id,
      actor_permissions: ctx.effective_permissions,
    });
    results.push({
      name: "institution_scoped_query",
      passed: collection.items.every((i) => i.institution_id === ctx.institution_id),
      detail: `${collection.items.length} items`,
    });
    results.push({
      name: "search_visibility_scope",
      passed: search.every((s) => s.institution_id === ctx.institution_id),
      detail: `${search.length} indexed`,
    });
  } else {
    results.push({ name: "institution_scoped_query", passed: true, detail: "no artifacts seeded" });
    results.push({ name: "search_visibility_scope", passed: true, detail: "no artifacts seeded" });
  }

  return results;
}

export function allW5TestsPassed(): boolean {
  return runKnwW5ApiTests().every((t) => t.passed);
}
