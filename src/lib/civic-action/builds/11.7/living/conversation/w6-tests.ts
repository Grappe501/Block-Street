/**
 * CAE-11.7-W6 — Conversation tests
 */
import { conversationRuntime } from "./services/conversation-service";
import { seedConversationIfEmpty } from "./services/seed";
import { contextIntelligenceRuntime } from "../context/services/context-intelligence-service";
import { getConversationConstitution, LIX_CONVERSATION_PRINCIPLE, REQUIRED_CONVERSATION_SERVICES } from "./constitution";
import { checkLixW6Invariants } from "./invariants";
import { explainConversationAction } from "./traceability";
import { CONVERSATION_EVENT_CATALOG } from "./events/catalog";

export type LixW6TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW6CertificationTests(): LixW6TestResult[] {
  seedConversationIfEmpty();
  const results: LixW6TestResult[] = [];
  const humanId = "usr-001";
  const institutionId = "inst-block-street";

  contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: "lbr-usr-001",
    institution_id: institutionId,
    role_id: "role-executive",
  });

  const constitution = getConversationConstitution();
  results.push({ name: "conversation_principle", passed: constitution.governing_principle === LIX_CONVERSATION_PRINCIPLE });

  results.push({
    name: "required_conversation_services",
    passed: REQUIRED_CONVERSATION_SERVICES.length === 13,
    detail: `${REQUIRED_CONVERSATION_SERVICES.length} services`,
  });

  results.push({ name: "w6_invariants", passed: checkLixW6Invariants().every((i) => i.passed) });

  results.push({
    name: "conversation_event_catalog",
    passed: CONVERSATION_EVENT_CATALOG.length >= 8,
    detail: `${CONVERSATION_EVENT_CATALOG.length} events`,
  });

  const dashboard = conversationRuntime.conversation.dashboard({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "conversation_dashboard",
    passed: dashboard.secretly_recorded === false && dashboard.mutates_canonical === false,
    detail: dashboard.greeting,
  });

  const conversations = conversationRuntime.conversations.list(humanId);
  results.push({
    name: "conversation_import",
    passed: conversations.length >= 1 && conversations.every((c) => c.anonymous === false),
    detail: `${conversations.length} conversations`,
  });

  const conv = conversations[0];

  let consentBlocked = false;
  try {
    conversationRuntime.recording.capture({
      conversation_id: "cnv-no-consent",
      human_id: humanId,
      institution_id: institutionId,
      recording_state: "recorded_by_human",
      authorized_by: humanId,
    });
  } catch {
    consentBlocked = true;
  }
  results.push({ name: "consent_required", passed: consentBlocked, detail: "recording blocked without consent" });

  const speakers = conversationRuntime.speakers.list(conv.conversation_id);
  results.push({
    name: "speaker_identification",
    passed: speakers.some((s) => s.invented === false) && speakers.some((s) => s.identity_id === null),
    detail: `${speakers.length} speakers`,
  });

  const transcript = conversationRuntime.transcription.generate({
    conversation_id: conv.conversation_id,
    human_id: humanId,
    institution_id: institutionId,
    content: "[00:01] Test: Quotation preserved verbatim.",
    transcript_type: "verbatim",
  });
  results.push({
    name: "transcription_versioned",
    passed: transcript.transcript.original_preserved && transcript.transcript.version >= 1,
    detail: `v${transcript.transcript.version}`,
  });

  const translation = conversationRuntime.translation.translate({
    transcript_id: transcript.transcript.transcript_id,
    conversation_id: conv.conversation_id,
    original_language: "en",
    translated_language: "es",
    content: "Confirmación del requisito de contrapartida del condado.",
  });
  results.push({
    name: "translation_spanish",
    passed: translation.spanish_supported && translation.translation.parallel_content.length > 0,
    detail: translation.translation.translated_language,
  });

  const intelligence = conversationRuntime.intelligence.analyze(conv.conversation_id);
  results.push({
    name: "conversation_intelligence",
    passed: intelligence.reviewable && intelligence.emotions_inferred === false,
    detail: `${intelligence.topics.length} topics`,
  });

  const meetings = conversationRuntime.meetings.list(humanId);
  results.push({
    name: "meeting_memory",
    passed: meetings.length >= 1 && meetings[0].searchable === true,
    detail: meetings[0]?.title,
  });

  const decision = conversationRuntime.decisions.detect({
    conversation_id: conv.conversation_id,
    human_id: humanId,
    institution_id: institutionId,
    summary: "Approve volunteer briefing outline pending legal review.",
    decision_type: "pending_approval",
  });
  results.push({
    name: "decision_detection",
    passed: decision.human_confirmation_required && decision.decision.canonical === false,
    detail: decision.decision.decision_id,
  });

  const commitment = conversationRuntime.commitments.detect({
    conversation_id: conv.conversation_id,
    human_id: humanId,
    institution_id: institutionId,
    commitment_text: "Kelly will send updated attendance sheet by Tuesday",
    assignee_id: "usr-003",
    deadline: "2026-07-15",
  });
  results.push({
    name: "commitment_detection",
    passed: commitment.human_confirmation_required && commitment.commitment.canonical === false,
    detail: commitment.commitment.commitment_id,
  });

  const confirmed = conversationRuntime.commitments.confirm(commitment.commitment.commitment_id, humanId);
  results.push({
    name: "commitment_confirmation",
    passed: confirmed.commitment.human_confirmed && confirmed.canonical === false,
    detail: "confirmed not canonical",
  });

  const action = conversationRuntime.actions.suggest({
    conversation_id: conv.conversation_id,
    human_id: humanId,
    institution_id: institutionId,
    action_type: "task",
    title: "Schedule county clerk follow-up",
    description: "Coordinate with partner on county match confirmation.",
  });
  results.push({
    name: "action_suggestion",
    passed: action.auto_executed === false && action.organizer_integration === true,
    detail: action.action.action_id,
  });

  const dialogue = conversationRuntime.dialogue.list(institutionId);
  results.push({
    name: "dialogue_graph",
    passed: dialogue.length >= 2,
    detail: `${dialogue.length} nodes`,
  });

  const search = conversationRuntime.search.search({
    human_id: humanId,
    institution_id: institutionId,
    query: "county match",
  });
  results.push({
    name: "conversation_search",
    passed: search.evidence_included && search.search.results.length > 0,
    detail: `${search.search.results.length} results`,
  });

  const summary = conversationRuntime.conversation.summarize(conv.conversation_id, humanId);
  results.push({
    name: "conversation_summarize",
    passed: summary.human_review_required && summary.auto_promoted === false,
    detail: "review required",
  });

  const promotion = conversationRuntime.conversation.promote({
    conversation_id: conv.conversation_id,
    human_id: humanId,
    institution_id: institutionId,
    target: "working_knowledge",
  });
  results.push({
    name: "knowledge_promotion",
    passed: promotion.human_review_required && promotion.mutates_canonical === false,
    detail: promotion.promotion_status,
  });

  const privacy = conversationRuntime.conversation.privacy.check("secret_recording");
  results.push({ name: "privacy_controls", passed: privacy.allowed === false, detail: "secret recording blocked" });

  const trace = explainConversationAction({
    human_id: humanId,
    action_type: "import",
    conversation_id: conv.conversation_id,
    consent_status: "granted",
  });
  results.push({
    name: "conversation_traceability",
    passed: trace.includes("Humans authorize memory"),
    detail: "explainable",
  });

  return results;
}

export function allLixW6TestsPassed(): boolean {
  return runLixW6CertificationTests().every((t) => t.passed);
}
