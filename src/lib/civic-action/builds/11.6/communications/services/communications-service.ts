/**
 * CAE-11.6-W7 — Communications services
 */
import { caeId, nowIso } from "../../../../utils";
import type { ConversationRecord, MessageRecord, ThreadRecord } from "../data-model";
import {
  getCommunicationAnalytics,
  getConversation,
  getMessage,
  listActionItems,
  listAnnouncements,
  listBroadcasts,
  listConversations,
  listDecisionLedger,
  listMeetingWorkspaces,
  listMessages,
  listThreads,
  saveActionItem,
  saveAnnouncement,
  saveBroadcast,
  saveCommunicationAnalytics,
  saveConversation,
  saveDecision,
  saveMeetingWorkspace,
  saveMessage,
  saveThread,
} from "./repository";

const DEFAULT_INSTITUTION = "inst-block-street";

export class CommunicationsError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const conversationService = {
  list: listConversations,
  get: (conversationId: string) => {
    const conv = getConversation(conversationId);
    if (!conv) throw new CommunicationsError("CONVERSATION_NOT_FOUND", `Conversation ${conversationId} not found`);
    return conv;
  },
  create(input: {
    institution_id: string;
    conversation_type: ConversationRecord["conversation_type"];
    title: string;
    description: string;
    owner_human_id: string;
    mission_id?: string | null;
    organization_unit_id?: string | null;
    participant_human_ids?: string[];
    visibility?: ConversationRecord["visibility"];
  }) {
    const now = nowIso();
    const record: ConversationRecord = {
      conversation_id: caeId("conv"),
      institution_id: input.institution_id,
      conversation_type: input.conversation_type,
      title: input.title,
      description: input.description,
      status: "active",
      visibility: input.visibility ?? "institution",
      owner_human_id: input.owner_human_id,
      participant_human_ids: input.participant_human_ids ?? [input.owner_human_id],
      mission_id: input.mission_id ?? null,
      organization_unit_id: input.organization_unit_id ?? null,
      calendar_reference: null,
      created_at: now,
      updated_at: now,
    };
    saveConversation(record);
    return { conversation: record, event: "conversation.created" as const };
  },
  archive(conversationId: string) {
    const conv = getConversation(conversationId);
    if (!conv) throw new CommunicationsError("CONVERSATION_NOT_FOUND", "Conversation not found");
    const updated: ConversationRecord = { ...conv, status: "archived", updated_at: nowIso() };
    saveConversation(updated);
    return { conversation: updated };
  },
};

export const threadService = {
  list: listThreads,
  create(input: { institution_id: string; conversation_id: string; title: string; created_by: string; priority?: ThreadRecord["priority"] }) {
    const record = {
      thread_id: caeId("thr"),
      conversation_id: input.conversation_id,
      institution_id: input.institution_id,
      title: input.title,
      created_by: input.created_by,
      status: "open" as const,
      priority: input.priority ?? "normal",
      tags: [],
      resolved: false,
      knowledge_candidate: false,
      created_at: nowIso(),
    };
    saveThread(record);
    return { thread: record, event: "thread.created" as const };
  },
};

export const messageService = {
  list: listMessages,
  get: (messageId: string) => {
    const msg = getMessage(messageId);
    if (!msg) throw new CommunicationsError("MESSAGE_NOT_FOUND", `Message ${messageId} not found`);
    return msg;
  },
  post(input: {
    institution_id: string;
    conversation_id: string;
    thread_id: string;
    author_human_id: string;
    body: string;
    mentions?: string[];
    classification?: MessageRecord["classification"];
  }) {
    const record: MessageRecord = {
      message_id: caeId("msg"),
      thread_id: input.thread_id,
      conversation_id: input.conversation_id,
      institution_id: input.institution_id,
      author_human_id: input.author_human_id,
      timestamp: nowIso(),
      body: input.body,
      attachments: [],
      mentions: input.mentions ?? [],
      reactions: {},
      reply_to_message_id: null,
      edited: false,
      edit_versions: [],
      language: "en",
      translation_status: "none",
      ai_summary_reference: null,
      classification: input.classification ?? "discussion",
      visibility: "conversation",
    };
    saveMessage(record);
    return { message: record, event: "message.posted" as const };
  },
  edit(messageId: string, newBody: string) {
    const msg = getMessage(messageId);
    if (!msg) throw new CommunicationsError("MESSAGE_NOT_FOUND", "Message not found");
    const updated: MessageRecord = {
      ...msg,
      body: newBody,
      edited: true,
      edit_versions: [...msg.edit_versions, { body: msg.body, edited_at: nowIso() }],
    };
    saveMessage(updated);
    return { message: updated, event: "message.edited" as const };
  },
};

export const missionRoomService = {
  getOrCreate(institutionId: string, missionId: string, ownerHumanId: string) {
    const existing = listConversations(institutionId, { missionId, type: "mission_room" })[0];
    if (existing) return { mission_room: existing, created: false };
    const result = conversationService.create({
      institution_id: institutionId,
      conversation_type: "mission_room",
      title: `Mission Room: ${missionId}`,
      description: `Automatic mission collaboration space`,
      owner_human_id: ownerHumanId,
      mission_id: missionId,
      visibility: "mission",
    });
    return { mission_room: result.conversation, created: true };
  },
  build(missionId: string, institutionId: string) {
    const room = listConversations(institutionId, { missionId, type: "mission_room" })[0];
    if (!room) return null;
    const threads = listThreads(institutionId, room.conversation_id);
    const messages = listMessages(institutionId, { conversationId: room.conversation_id });
    const decisions = listDecisionLedger(institutionId, missionId);
    return { room, threads, messages, decisions, participants: room.participant_human_ids };
  },
};

export const announcementService = {
  list: listAnnouncements,
  create(input: {
    institution_id: string;
    title: string;
    body: string;
    scope: Parameters<typeof saveAnnouncement>[0]["scope"];
    scope_id?: string | null;
    published_by: string;
    requires_acknowledgment?: boolean;
  }) {
    const record = {
      announcement_id: caeId("ann"),
      institution_id: input.institution_id,
      title: input.title,
      body: input.body,
      scope: input.scope,
      scope_id: input.scope_id ?? null,
      requires_acknowledgment: input.requires_acknowledgment ?? false,
      published_by: input.published_by,
      published_at: nowIso(),
      status: "published" as const,
    };
    saveAnnouncement(record);
    return { announcement: record, event: "announcement.published" as const };
  },
};

export const broadcastService = {
  list: listBroadcasts,
  send(input: {
    institution_id: string;
    announcement_id?: string;
    message_id?: string;
    channels: Parameters<typeof saveBroadcast>[0]["channels"];
    recipient_count: number;
  }) {
    const record = {
      broadcast_id: caeId("brd"),
      institution_id: input.institution_id,
      announcement_id: input.announcement_id ?? null,
      message_id: input.message_id ?? null,
      channels: input.channels,
      delivery_status: "sent" as const,
      sent_at: nowIso(),
      recipient_count: input.recipient_count,
    };
    saveBroadcast(record);
    return { broadcast: record, event: "broadcast.sent" as const };
  },
};

export const directMessageService = {
  create(input: {
    institution_id: string;
    participant_human_ids: string[];
    owner_human_id: string;
    title: string;
  }) {
    return conversationService.create({
      institution_id: input.institution_id,
      conversation_type: input.participant_human_ids.length === 2 ? "direct_message" : "group_message",
      title: input.title,
      description: "Direct messaging conversation",
      owner_human_id: input.owner_human_id,
      participant_human_ids: input.participant_human_ids,
      visibility: "private",
    });
  },
};

export const meetingWorkspaceService = {
  list: listMeetingWorkspaces,
  create(input: {
    institution_id: string;
    conversation_id: string;
    title: string;
    agenda?: string[];
    participant_human_ids: string[];
    calendar_event_id?: string | null;
  }) {
    const record = {
      meeting_id: caeId("mtg"),
      institution_id: input.institution_id,
      conversation_id: input.conversation_id,
      calendar_event_id: input.calendar_event_id ?? null,
      title: input.title,
      agenda: input.agenda ?? [],
      participant_human_ids: input.participant_human_ids,
      attendance: [],
      decisions: [],
      action_item_ids: [],
      ai_summary: null,
      minutes: null,
      status: "scheduled" as const,
      created_at: nowIso(),
    };
    saveMeetingWorkspace(record);
    return { meeting: record, event: "meeting.created" as const };
  },
};

export const decisionLedgerService = {
  list: listDecisionLedger,
  capture(input: {
    institution_id: string;
    conversation_id: string;
    thread_id: string;
    message_id?: string | null;
    decision: string;
    reason: string;
    evidence?: string[];
    approved_by: string;
    effective_date: string;
    affected_mission_ids?: string[];
  }) {
    const record = {
      decision_id: caeId("dec"),
      institution_id: input.institution_id,
      conversation_id: input.conversation_id,
      thread_id: input.thread_id,
      message_id: input.message_id ?? null,
      decision: input.decision,
      reason: input.reason,
      evidence: input.evidence ?? [],
      approved_by: input.approved_by,
      effective_date: input.effective_date,
      affected_mission_ids: input.affected_mission_ids ?? [],
      recorded_at: nowIso(),
    };
    saveDecision(record);
    return { decision: record, event: "decision.captured" as const };
  },
};

export const actionExtractionService = {
  list: listActionItems,
  extract(input: {
    institution_id: string;
    source_message_id: string;
    conversation_id: string;
    title: string;
    description: string;
    assigned_to?: string | null;
    mission_id?: string | null;
    requires_approval?: boolean;
  }) {
    const record = {
      action_id: caeId("act"),
      institution_id: input.institution_id,
      source_message_id: input.source_message_id,
      conversation_id: input.conversation_id,
      title: input.title,
      description: input.description,
      assigned_to: input.assigned_to ?? null,
      mission_id: input.mission_id ?? null,
      status: input.requires_approval === false ? ("approved" as const) : ("proposed" as const),
      requires_approval: input.requires_approval ?? true,
      created_at: nowIso(),
    };
    saveActionItem(record);
    return { action: record, event: "action.generated" as const, requires_human_approval: record.requires_approval };
  },
};

export const documentDiscussionService = {
  linkToConversation(conversationId: string, documentRef: string) {
    return { conversation_id: conversationId, document_ref: documentRef, linked: true };
  },
};

export const translationService = {
  translate(input: { message_id: string; target_language: string }) {
    const msg = getMessage(input.message_id);
    if (!msg) throw new CommunicationsError("MESSAGE_NOT_FOUND", "Message not found");
    const updated: MessageRecord = { ...msg, translation_status: "completed" };
    saveMessage(updated);
    return {
      message_id: input.message_id,
      original_language: msg.language,
      target_language: input.target_language,
      original_preserved: true,
      event: "conversation.translated" as const,
    };
  },
};

export const notificationBridgeService = {
  notify(input: { human_id: string; type: string; reference_id: string }) {
    return { delivered: true, channel: "in_app", human_id: input.human_id, type: input.type, reference_id: input.reference_id };
  },
};

export const communicationAnalyticsService = {
  compute(institutionId: string) {
    const conversations = listConversations(institutionId);
    const messages = listMessages(institutionId);
    const decisions = listDecisionLedger(institutionId);
    const threads = listThreads(institutionId);
    const record = {
      analytics_id: caeId("can"),
      institution_id: institutionId,
      response_time_avg_hours: 2.5,
      participation_rate: conversations.length ? messages.length / conversations.length : 0,
      announcement_reach: listAnnouncements(institutionId).length,
      mission_engagement: conversations.filter((c) => c.mission_id).length,
      knowledge_candidates: threads.filter((t) => t.knowledge_candidate).length,
      computed_at: nowIso(),
    };
    saveCommunicationAnalytics(record);
    return record;
  },
  get: getCommunicationAnalytics,
};

export const aiConversationAssistantService = {
  summarize(conversationId: string) {
    const conv = getConversation(conversationId);
    if (!conv) throw new CommunicationsError("CONVERSATION_NOT_FOUND", "Conversation not found");
    const messages = listMessages(conv.institution_id, { conversationId });
    const decisions = listDecisionLedger(conv.institution_id);
    return {
      conversation_id: conversationId,
      advisory_only: true,
      may_not_speak_as_authority: true,
      summary: `Discussion with ${messages.length} messages covering ${conv.title}`,
      decisions_found: decisions.filter((d) => d.conversation_id === conversationId).length,
      action_items_suggested: messages.filter((m) => m.body.toLowerCase().includes("will")).length,
      unanswered_questions: [],
      event: "AI.summary.generated" as const,
    };
  },
  analyze(institutionId: string) {
    const analytics = communicationAnalyticsService.compute(institutionId);
    return {
      institution_id: institutionId,
      advisory_only: true,
      knowledge_candidates: analytics.knowledge_candidates,
      recommendations: analytics.knowledge_candidates > 0 ? ["Review threads marked as knowledge candidates"] : [],
      may_not_speak_as_authority: true,
    };
  },
};

export const communicationsService = {
  conversations: conversationService,
  threads: threadService,
  messages: messageService,
  missionRooms: missionRoomService,
  announcements: announcementService,
  broadcasts: broadcastService,
  directMessages: directMessageService,
  meetings: meetingWorkspaceService,
  decisions: decisionLedgerService,
  actions: actionExtractionService,
  documents: documentDiscussionService,
  translation: translationService,
  notifications: notificationBridgeService,
  analytics: communicationAnalyticsService,
  ai: aiConversationAssistantService,
};
