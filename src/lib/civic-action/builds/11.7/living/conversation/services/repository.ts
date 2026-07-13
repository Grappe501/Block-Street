/**
 * CAE-11.7-W6 — Conversation persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  ActionSuggestionRecord,
  ConsentRecord,
  ConversationCommitmentRecord,
  ConversationDecisionRecord,
  ConversationRecord,
  ConversationSearchRecord,
  DialogueGraphNode,
  MeetingMemoryRecord,
  RecordingRecord,
  SpeakerRecord,
  TranscriptRecord,
  TranslationRecord,
} from "../data-model";
import { CONVERSATION_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

function listByHuman<T extends { human_id: string }>(key: string, humanId: string) {
  return readStoreSlice<T>(key).filter((r) => r.human_id === humanId);
}

function listByInstitution<T extends { institution_id: string }>(key: string, institutionId: string) {
  return readStoreSlice<T>(key).filter((r) => r.institution_id === institutionId);
}

export function listConversations(humanId: string) {
  return listByHuman<ConversationRecord>(CONVERSATION_STORE_KEYS.conversations, humanId);
}

export function getConversation(conversationId: string) {
  return readStoreSlice<ConversationRecord>(CONVERSATION_STORE_KEYS.conversations).find(
    (c) => c.conversation_id === conversationId
  ) ?? null;
}

export function saveConversation(record: ConversationRecord) {
  upsertById(CONVERSATION_STORE_KEYS.conversations, record, "conversation_id");
}

export function saveConsent(record: ConsentRecord) {
  upsertById(CONVERSATION_STORE_KEYS.consents, record, "consent_id");
}

export function getConsent(conversationId: string) {
  return readStoreSlice<ConsentRecord>(CONVERSATION_STORE_KEYS.consents).find(
    (c) => c.conversation_id === conversationId
  ) ?? null;
}

export function saveRecording(record: RecordingRecord) {
  upsertById(CONVERSATION_STORE_KEYS.recordings, record, "recording_id");
}

export function listSpeakers(conversationId: string) {
  return readStoreSlice<SpeakerRecord>(CONVERSATION_STORE_KEYS.speakers).filter(
    (s) => s.conversation_id === conversationId
  );
}

export function saveSpeaker(record: SpeakerRecord) {
  upsertById(CONVERSATION_STORE_KEYS.speakers, record, "speaker_id");
}

export function listTranscripts(conversationId: string) {
  return readStoreSlice<TranscriptRecord>(CONVERSATION_STORE_KEYS.transcripts).filter(
    (t) => t.conversation_id === conversationId
  );
}

export function saveTranscript(record: TranscriptRecord) {
  upsertById(CONVERSATION_STORE_KEYS.transcripts, record, "transcript_id");
}

export function listTranslations(transcriptId: string) {
  return readStoreSlice<TranslationRecord>(CONVERSATION_STORE_KEYS.translations).filter(
    (t) => t.transcript_id === transcriptId
  );
}

export function saveTranslation(record: TranslationRecord) {
  upsertById(CONVERSATION_STORE_KEYS.translations, record, "translation_id");
}

export function listMeetings(humanId: string) {
  return listByHuman<MeetingMemoryRecord>(CONVERSATION_STORE_KEYS.meetings, humanId);
}

export function saveMeeting(record: MeetingMemoryRecord) {
  upsertById(CONVERSATION_STORE_KEYS.meetings, record, "meeting_id");
}

export function listDecisions(institutionId: string) {
  return listByInstitution<ConversationDecisionRecord>(CONVERSATION_STORE_KEYS.decisions, institutionId);
}

export function saveDecision(record: ConversationDecisionRecord) {
  upsertById(CONVERSATION_STORE_KEYS.decisions, record, "decision_id");
}

export function listCommitments(humanId: string) {
  return listByHuman<ConversationCommitmentRecord>(CONVERSATION_STORE_KEYS.commitments, humanId);
}

export function saveCommitment(record: ConversationCommitmentRecord) {
  upsertById(CONVERSATION_STORE_KEYS.commitments, record, "commitment_id");
}

export function listActions(humanId: string) {
  return listByHuman<ActionSuggestionRecord>(CONVERSATION_STORE_KEYS.actions, humanId);
}

export function saveAction(record: ActionSuggestionRecord) {
  upsertById(CONVERSATION_STORE_KEYS.actions, record, "action_id");
}

export function listDialogueNodes(institutionId: string) {
  return listByInstitution<DialogueGraphNode>(CONVERSATION_STORE_KEYS.dialogue, institutionId);
}

export function saveDialogueNode(record: DialogueGraphNode) {
  upsertById(CONVERSATION_STORE_KEYS.dialogue, record, "node_id");
}

export function saveSearch(record: ConversationSearchRecord) {
  upsertById(CONVERSATION_STORE_KEYS.search, record, "search_id");
}

export function listSearchHistory(humanId: string) {
  return listByHuman<ConversationSearchRecord>(CONVERSATION_STORE_KEYS.search, humanId);
}
