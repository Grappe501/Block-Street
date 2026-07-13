/**
 * CAE-11.7-W6 — Conversation Intelligence Constitution (LIX-006)
 */
export const LIX_CONVERSATION_PRINCIPLE =
  "The platform remembers conversations so Humans do not have to—but only when the Humans have authorized it to remember.";

export const CONVERSATION_ARCHITECTURE = [
  "identity",
  "localbrain",
  "context_runtime",
  "executive_assistant",
  "organizer",
  "research_network",
  "conversation_runtime",
  "knowledge_review",
  "institutional_memory",
] as const;

export const RECORDING_STATES = [
  "not_recorded",
  "recorded_by_human",
  "recorded_by_institution",
  "imported_recording",
  "public_recording",
  "transcription_only",
  "summary_only",
  "consent_required",
  "consent_denied",
] as const;

export const CONVERSATION_CHANNELS = [
  "in_person",
  "zoom",
  "teams",
  "google_meet",
  "phone",
  "interview",
  "public_hearing",
  "legislative_session",
  "board_meeting",
  "staff_meeting",
  "volunteer_meeting",
  "one_on_one",
  "chat",
  "email",
  "sms",
  "discord",
  "slack",
  "internal_messaging",
] as const;

export const CONVERSATION_MAY = [
  "listen_when_authorized",
  "transcribe",
  "translate",
  "identify_speakers",
  "build_summaries",
  "detect_decisions",
  "detect_commitments",
  "connect_to_missions",
  "recommend_knowledge_promotion",
] as const;

export const CONVERSATION_MAY_NOT = [
  "secretly_record",
  "secretly_transcribe",
  "secretly_summarize",
  "spy_on_conversations",
  "build_behavioral_dossiers",
  "infer_emotions_as_facts",
  "alter_quotations",
  "change_institutional_records_automatically",
  "invent_speaker_identities",
  "profile_personalities",
  "score_participants",
  "infer_protected_characteristics",
  "modify_transcripts_without_version",
] as const;

export const REQUIRED_CONVERSATION_SERVICES = [
  "ConversationService",
  "ConsentService",
  "RecordingService",
  "SpeakerIdentificationService",
  "TranscriptionService",
  "TranslationService",
  "ConversationIntelligenceService",
  "MeetingMemoryService",
  "DecisionDetectionService",
  "CommitmentDetectionService",
  "ActionSuggestionService",
  "DialogueGraphService",
  "ConversationSearchService",
] as const;

export function getConversationConstitution() {
  return {
    protocol_id: "CAE-11.7-W6",
    governing_principle: LIX_CONVERSATION_PRINCIPLE,
    architecture: CONVERSATION_ARCHITECTURE,
    recording_states: RECORDING_STATES,
    channels: CONVERSATION_CHANNELS,
    may: CONVERSATION_MAY,
    may_not: CONVERSATION_MAY_NOT,
    required_services: REQUIRED_CONVERSATION_SERVICES,
  };
}
