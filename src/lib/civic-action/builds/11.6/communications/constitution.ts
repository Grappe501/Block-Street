/**
 * CAE-11.6-W7 — Communications & Institutional Conversation Constitution (OPS-001)
 */
export const OPS_COMMUNICATIONS_PRINCIPLE =
  "Conversations are institutional assets. Messages are not disposable. Communication always serves Missions.";

export const COMMUNICATION_ARCHITECTURE = [
  "institution",
  "organization",
  "mission",
  "conversation_space",
  "thread",
  "message",
  "decision",
  "action",
  "knowledge",
  "institutional_memory",
] as const;

export const CONVERSATION_TYPES = [
  "mission_room",
  "team_room",
  "department_room",
  "committee_room",
  "executive_room",
  "project_room",
  "program_room",
  "volunteer_room",
  "training_room",
  "community_discussion",
  "direct_message",
  "group_message",
  "announcement_channel",
  "support_desk",
  "incident_room",
  "emergency_operations",
  "knowledge_review",
  "research_collaboration",
  "custom",
] as const;

export const CONVERSATION_LIFECYCLE = [
  "created",
  "active",
  "muted",
  "archived",
  "locked",
  "retained",
  "disposed",
] as const;

export const COMMUNICATION_CHANNELS = [
  "real_time_chat",
  "announcements",
  "direct_messaging",
  "group_messaging",
  "mission_rooms",
  "discussion_boards",
  "comments",
  "meeting_chat",
  "voice_notes",
  "video_references",
  "broadcasts",
  "system_messages",
  "ai_conversations",
] as const;

export const REQUIRED_COMMUNICATIONS_SERVICES = [
  "ConversationService",
  "ThreadService",
  "MessageService",
  "MissionRoomService",
  "AnnouncementService",
  "BroadcastService",
  "DirectMessageService",
  "MeetingWorkspaceService",
  "DecisionLedgerService",
  "ActionExtractionService",
  "DocumentDiscussionService",
  "TranslationService",
  "NotificationBridgeService",
  "CommunicationAnalyticsService",
  "AIConversationAssistantService",
] as const;

export const COMMUNICATIONS_COMMANDS = [
  "CreateConversation",
  "CreateThread",
  "PostMessage",
  "EditMessage",
  "ArchiveConversation",
  "CreateAnnouncement",
  "BroadcastMessage",
  "CaptureDecision",
  "ExtractActionItems",
  "CreateMeetingWorkspace",
  "TranslateConversation",
  "GenerateAISummary",
] as const;

export const COMMUNICATIONS_AI_MAY_NOT = [
  "Speak as organizational authority",
  "Create actions without Human approval unless governed",
  "Override privacy or retention policies",
  "Dispose of institutional conversation history autonomously",
  "Bypass permission boundaries in federation communications",
] as const;

export function getCommunicationsConstitution() {
  return {
    system_id: "OPS-001",
    build: "11.6",
    wave: "11.6-W7",
    governing_principle: OPS_COMMUNICATIONS_PRINCIPLE,
    architecture: [...COMMUNICATION_ARCHITECTURE],
    conversation_types: [...CONVERSATION_TYPES],
    communication_channels: [...COMMUNICATION_CHANNELS],
    required_services: [...REQUIRED_COMMUNICATIONS_SERVICES],
    commands: [...COMMUNICATIONS_COMMANDS],
    ai_may_not: [...COMMUNICATIONS_AI_MAY_NOT],
    api_namespace: "/api/v1/conversations",
    legacy_communications_note: "Legacy 11.7 communications remain at /api/v1/communications/*",
  };
}
