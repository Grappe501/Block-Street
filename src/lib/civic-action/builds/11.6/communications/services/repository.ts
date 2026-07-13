/**
 * CAE-11.6-W7 — Communications persistence
 */
export { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import type {
  ActionItemRecord,
  AnnouncementRecord,
  BroadcastRecord,
  CommunicationAnalyticsRecord,
  ConversationRecord,
  DecisionLedgerRecord,
  MeetingWorkspaceRecord,
  MessageRecord,
  ThreadRecord,
} from "../data-model";
import { COMMUNICATIONS_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

export function listConversations(institutionId: string, filters?: { missionId?: string; type?: ConversationRecord["conversation_type"] }) {
  return readStoreSlice<ConversationRecord>(COMMUNICATIONS_STORE_KEYS.conversations).filter(
    (c) => c.institution_id === institutionId && (!filters?.missionId || c.mission_id === filters.missionId) && (!filters?.type || c.conversation_type === filters.type)
  );
}

export function getConversation(conversationId: string) {
  return readStoreSlice<ConversationRecord>(COMMUNICATIONS_STORE_KEYS.conversations).find((c) => c.conversation_id === conversationId) ?? null;
}

export function saveConversation(record: ConversationRecord) {
  upsertById(COMMUNICATIONS_STORE_KEYS.conversations, record, "conversation_id");
}

export function listThreads(institutionId: string, conversationId?: string) {
  return readStoreSlice<ThreadRecord>(COMMUNICATIONS_STORE_KEYS.threads).filter(
    (t) => t.institution_id === institutionId && (!conversationId || t.conversation_id === conversationId)
  );
}

export function saveThread(record: ThreadRecord) {
  upsertById(COMMUNICATIONS_STORE_KEYS.threads, record, "thread_id");
}

export function listMessages(institutionId: string, filters?: { threadId?: string; conversationId?: string }) {
  return readStoreSlice<MessageRecord>(COMMUNICATIONS_STORE_KEYS.messages).filter(
    (m) => m.institution_id === institutionId && (!filters?.threadId || m.thread_id === filters.threadId) && (!filters?.conversationId || m.conversation_id === filters.conversationId)
  );
}

export function getMessage(messageId: string) {
  return readStoreSlice<MessageRecord>(COMMUNICATIONS_STORE_KEYS.messages).find((m) => m.message_id === messageId) ?? null;
}

export function saveMessage(record: MessageRecord) {
  upsertById(COMMUNICATIONS_STORE_KEYS.messages, record, "message_id");
}

export function listAnnouncements(institutionId: string) {
  return readStoreSlice<AnnouncementRecord>(COMMUNICATIONS_STORE_KEYS.announcements).filter((a) => a.institution_id === institutionId);
}

export function saveAnnouncement(record: AnnouncementRecord) {
  upsertById(COMMUNICATIONS_STORE_KEYS.announcements, record, "announcement_id");
}

export function listBroadcasts(institutionId: string) {
  return readStoreSlice<BroadcastRecord>(COMMUNICATIONS_STORE_KEYS.broadcasts).filter((b) => b.institution_id === institutionId);
}

export function saveBroadcast(record: BroadcastRecord) {
  upsertById(COMMUNICATIONS_STORE_KEYS.broadcasts, record, "broadcast_id");
}

export function listMeetingWorkspaces(institutionId: string) {
  return readStoreSlice<MeetingWorkspaceRecord>(COMMUNICATIONS_STORE_KEYS.meetings).filter((m) => m.institution_id === institutionId);
}

export function saveMeetingWorkspace(record: MeetingWorkspaceRecord) {
  upsertById(COMMUNICATIONS_STORE_KEYS.meetings, record, "meeting_id");
}

export function listDecisionLedger(institutionId: string, missionId?: string) {
  return readStoreSlice<DecisionLedgerRecord>(COMMUNICATIONS_STORE_KEYS.decisions).filter(
    (d) => d.institution_id === institutionId && (!missionId || d.affected_mission_ids.includes(missionId))
  );
}

export function saveDecision(record: DecisionLedgerRecord) {
  upsertById(COMMUNICATIONS_STORE_KEYS.decisions, record, "decision_id");
}

export function listActionItems(institutionId: string, conversationId?: string) {
  return readStoreSlice<ActionItemRecord>(COMMUNICATIONS_STORE_KEYS.action_items).filter(
    (a) => a.institution_id === institutionId && (!conversationId || a.conversation_id === conversationId)
  );
}

export function saveActionItem(record: ActionItemRecord) {
  upsertById(COMMUNICATIONS_STORE_KEYS.action_items, record, "action_id");
}

export function getCommunicationAnalytics(institutionId: string) {
  return readStoreSlice<CommunicationAnalyticsRecord>(COMMUNICATIONS_STORE_KEYS.analytics).find((a) => a.institution_id === institutionId) ?? null;
}

export function saveCommunicationAnalytics(record: CommunicationAnalyticsRecord) {
  upsertById(COMMUNICATIONS_STORE_KEYS.analytics, record, "analytics_id");
}
