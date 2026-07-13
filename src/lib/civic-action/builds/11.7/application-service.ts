/**
 * CAE-11.7-W3/W4 — Communication Application Service
 */
import type { CommunicationCommandEnvelope, CommunicationCommandResult } from "./services/commands";
import { communicationsDomainService } from "./services/communications-engine";
import {
  loadConversation,
  loadDecision,
  loadDocument,
  loadMeeting,
  loadMessage,
  loadThread,
  listMessagesForThread,
  listThreadsForConversation,
  readStoreSlice,
} from "./services/repository";
import { COMMUNICATION_STORE_KEYS } from "./data-model";
import type {
  ActionItemRecord,
  AISummaryRecord,
  AnnouncementRecord,
  ConversationRecord,
  DecisionRecord,
  DocumentRecord,
  KnowledgeRecord,
  MeetingRecord,
  MessageRecord,
  ThreadRecord,
} from "./data-model";

export class CommunicationApplicationService {
  executeCommand(envelope: CommunicationCommandEnvelope, permissions?: string[]): CommunicationCommandResult {
    return communicationsDomainService.execute(envelope, permissions);
  }

  getConversation(conversationId: string) {
    return loadConversation(conversationId);
  }

  listAllConversations(): ConversationRecord[] {
    return readStoreSlice<ConversationRecord>(COMMUNICATION_STORE_KEYS.conversations);
  }

  listConversationsByInitiative(initiativeId: string): ConversationRecord[] {
    return readStoreSlice<ConversationRecord>(COMMUNICATION_STORE_KEYS.conversations).filter(
      (c) => c.initiative_id === initiativeId && c.lifecycle_state !== "archived"
    );
  }

  listConversationsByMission(missionId: string): ConversationRecord[] {
    return readStoreSlice<ConversationRecord>(COMMUNICATION_STORE_KEYS.conversations).filter(
      (c) => c.mission_id_optional === missionId && c.lifecycle_state !== "archived"
    );
  }

  listAllConversationsByInitiative(initiativeId: string): ConversationRecord[] {
    return readStoreSlice<ConversationRecord>(COMMUNICATION_STORE_KEYS.conversations).filter(
      (c) => c.initiative_id === initiativeId
    );
  }

  listDecisionsByConversation(conversationId: string): DecisionRecord[] {
    return readStoreSlice<DecisionRecord>(COMMUNICATION_STORE_KEYS.decisions).filter(
      (d) => d.conversation_id === conversationId
    );
  }

  listMeetingsByInitiative(initiativeId: string): MeetingRecord[] {
    return readStoreSlice<MeetingRecord>(COMMUNICATION_STORE_KEYS.meetings).filter(
      (m) => m.initiative_id === initiativeId && m.lifecycle_state !== "archived"
    );
  }

  listDocumentsByInitiative(initiativeId: string): DocumentRecord[] {
    return readStoreSlice<DocumentRecord>(COMMUNICATION_STORE_KEYS.documents).filter(
      (d) => d.initiative_id === initiativeId && d.lifecycle_state !== "archived"
    );
  }

  listActionItemsForActor(actorHumanId: string): ActionItemRecord[] {
    return readStoreSlice<ActionItemRecord>(COMMUNICATION_STORE_KEYS.action_items).filter(
      (a) =>
        a.assignee_human_id === actorHumanId &&
        a.lifecycle_state !== "completed" &&
        a.lifecycle_state !== "archived"
    );
  }

  listMentionsForActor(actorHumanId: string): MessageRecord[] {
    return readStoreSlice<MessageRecord>(COMMUNICATION_STORE_KEYS.messages).filter((m) =>
      m.mention_human_ids.includes(actorHumanId)
    );
  }

  listKnowledgeByInitiative(initiativeId: string): KnowledgeRecord[] {
    return readStoreSlice<KnowledgeRecord>(COMMUNICATION_STORE_KEYS.knowledge).filter(
      (k) => k.initiative_id === initiativeId && k.lifecycle_state === "active"
    );
  }

  listAnnouncementsByInitiative(initiativeId: string): AnnouncementRecord[] {
    return readStoreSlice<AnnouncementRecord>(COMMUNICATION_STORE_KEYS.announcements).filter(
      (a) => a.initiative_id === initiativeId && a.lifecycle_state === "published"
    );
  }

  getConversationBundle(conversationId: string) {
    const conversation = loadConversation(conversationId);
    if (!conversation) return null;
    const threads = listThreadsForConversation(conversationId);
    const messages = threads.flatMap((t) => listMessagesForThread(t.canonical_id));
    const decisions = this.listDecisionsByConversation(conversationId);
    const actionItems = readStoreSlice<ActionItemRecord>(COMMUNICATION_STORE_KEYS.action_items).filter(
      (a) => a.conversation_id === conversationId
    );
    const aiSummaries = readStoreSlice<AISummaryRecord>(COMMUNICATION_STORE_KEYS.ai_summaries).filter(
      (s) => s.conversation_id === conversationId && s.lifecycle_state === "active"
    );
    return { conversation, threads, messages, decisions, actionItems, aiSummaries };
  }

  getMeeting(meetingId: string) {
    return loadMeeting(meetingId);
  }

  getDecision(decisionId: string) {
    return loadDecision(decisionId);
  }

  getDocument(documentId: string) {
    return loadDocument(documentId);
  }

  getThread(threadId: string) {
    return loadThread(threadId);
  }

  getMessage(messageId: string) {
    return loadMessage(messageId);
  }
}

export const communicationApplicationService = new CommunicationApplicationService();
