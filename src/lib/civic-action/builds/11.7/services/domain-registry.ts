/**
 * CAE-11.7-W3 — Domain service registry (COM-SVC-001)
 */
export const CONVERSATION_DOMAIN_SERVICES = [
  "ConversationLifecycleService",
  "ConversationCreationService",
  "ConversationArchiveService",
  "ConversationParticipantService",
  "ConversationOwnershipService",
  "ConversationVisibilityService",
  "ConversationModerationService",
  "ConversationPinService",
] as const;

export const THREAD_DOMAIN_SERVICES = [
  "ThreadLifecycleService",
  "ThreadCreationService",
  "ThreadResolutionService",
  "ThreadParticipantService",
  "ThreadSubjectService",
] as const;

export const MESSAGE_DOMAIN_SERVICES = [
  "MessagePostingService",
  "MessageEditService",
  "MessageVersionService",
  "MessageMentionService",
  "MessageReactionService",
  "MessageAttachmentService",
  "MessageReferenceService",
] as const;

export const ANNOUNCEMENT_DOMAIN_SERVICES = [
  "AnnouncementPublishService",
  "AnnouncementDeliveryService",
  "AnnouncementAudienceService",
  "AnnouncementExpirationService",
] as const;

export const MEETING_DOMAIN_SERVICES = [
  "MeetingLifecycleService",
  "MeetingSchedulingService",
  "MeetingAgendaService",
  "MeetingMinutesService",
  "MeetingRecordingService",
  "MeetingAttendanceService",
] as const;

export const DECISION_DOMAIN_SERVICES = [
  "DecisionRecordService",
  "DecisionApprovalService",
  "DecisionHistoryService",
  "DecisionTraceabilityService",
] as const;

export const ACTION_ITEM_DOMAIN_SERVICES = [
  "ActionItemCreationService",
  "ActionItemAssignmentService",
  "ActionItemCompletionService",
  "MissionSyncQueueService",
] as const;

export const DOCUMENT_DOMAIN_SERVICES = [
  "DocumentCreationService",
  "DocumentReviewService",
  "DocumentPublicationService",
  "DocumentCollaborationService",
  "DocumentRevisionService",
] as const;

export const KNOWLEDGE_DOMAIN_SERVICES = [
  "KnowledgeCaptureService",
  "KnowledgeSearchService",
  "KnowledgeRetentionService",
  "KnowledgeIndexingService",
] as const;

export const AI_DOMAIN_SERVICES = [
  "AISummaryGenerationService",
  "AITranslationService",
  "AIAdvisoryService",
  "AIActionItemDiscoveryService",
  "AIDecisionDiscoveryService",
] as const;

export const MODERATION_DOMAIN_SERVICES = [
  "ModerationPolicyService",
  "ContentModerationService",
  "ParticipantModerationService",
  "RetentionPolicyService",
] as const;

export const SEARCH_DOMAIN_SERVICES = [
  "CommunicationSearchService",
  "SemanticSearchService",
  "CommunicationTimelineService",
  "CommunicationBookmarkService",
] as const;

export const SHARED_COMMUNICATION_SERVICES = [
  "CommunicationValidationService",
  "CommunicationTraceabilityService",
  "CommunicationVersionService",
  "CommunicationPermissionService",
  "CommunicationRelationshipService",
  "CommunicationHistoryService",
  "CommunicationAuditService",
  "CommunicationEventPublisher",
  "MissionSynchronizationService",
  "CommunicationIntegrityService",
] as const;

export const ALL_COMMUNICATION_DOMAIN_SERVICES = [
  ...CONVERSATION_DOMAIN_SERVICES,
  ...THREAD_DOMAIN_SERVICES,
  ...MESSAGE_DOMAIN_SERVICES,
  ...ANNOUNCEMENT_DOMAIN_SERVICES,
  ...MEETING_DOMAIN_SERVICES,
  ...DECISION_DOMAIN_SERVICES,
  ...ACTION_ITEM_DOMAIN_SERVICES,
  ...DOCUMENT_DOMAIN_SERVICES,
  ...KNOWLEDGE_DOMAIN_SERVICES,
  ...AI_DOMAIN_SERVICES,
  ...MODERATION_DOMAIN_SERVICES,
  ...SEARCH_DOMAIN_SERVICES,
  ...SHARED_COMMUNICATION_SERVICES,
] as const;

export const COMMUNICATION_POLICIES = [
  { policy_id: "COM-POL-001", rule: "No orphan Messages", enforcement: "block" as const },
  { policy_id: "COM-POL-002", rule: "No communication without constitutional context", enforcement: "block" as const },
  { policy_id: "COM-POL-003", rule: "No archived parent with active children", enforcement: "block" as const },
  { policy_id: "COM-POL-004", rule: "AI cannot impersonate Humans", enforcement: "block" as const },
  { policy_id: "COM-POL-005", rule: "Decisions require dedicated records", enforcement: "block" as const },
  { policy_id: "COM-POL-006", rule: "Action Items queue for Mission sync", enforcement: "block" as const },
  { policy_id: "COM-POL-007", rule: "Draft→Active conversation requires Open", enforcement: "block" as const },
];
