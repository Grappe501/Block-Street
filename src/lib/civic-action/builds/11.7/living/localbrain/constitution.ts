/**
 * CAE-11.7-W1 — LocalBrain Architecture Constitution (LIX-001)
 */
export const LIX_LOCALBRAIN_PRINCIPLE = "One Human. One Identity. One LocalBrain.";

export const LOCALBRAIN_ARCHITECTURE = [
  "human",
  "canonical_identity",
  "trust_layer",
  "localbrain",
  "context_engine",
  "memory_engine",
  "ai_runtime",
  "institution_connections",
  "mission_context",
  "knowledge_context",
  "calendar_context",
  "operational_assistance",
] as const;

export const LOCALBRAIN_LAYERS = [
  "identity",
  "memory",
  "context",
  "reasoning",
  "planning",
  "experience",
] as const;

export const MEMORY_CATEGORIES = [
  "personal",
  "institutional",
  "mission",
  "learning",
  "calendar",
  "relationships",
  "communications",
  "knowledge",
  "executive",
  "temporary",
  "archived",
] as const;

export const MEMORY_TIERS = ["temporary", "working", "long_term", "institutional"] as const;

export const PRIVACY_DOMAINS = ["private", "shared", "institution", "federation"] as const;

export const CONTEXT_OBJECTS = [
  "current_human",
  "current_institution",
  "current_mission",
  "current_calendar_event",
  "current_resource",
  "current_organization",
  "current_conversation",
  "current_learning_session",
  "current_executive_priority",
] as const;

export const SYNC_MODES = ["cloud", "offline", "cross_device", "phone", "tablet", "desktop"] as const;

export const REQUIRED_LOCALBRAIN_SERVICES = [
  "LocalBrainService",
  "MemoryService",
  "WorkingMemoryService",
  "LongTermMemoryService",
  "TemporaryMemoryService",
  "ContextRuntimeService",
  "TimelineService",
  "KnowledgeGraphService",
  "WorkspaceMemoryService",
  "RelationshipMemoryService",
  "CalendarMemoryService",
  "LearningMemoryService",
  "PrivacyService",
  "SynchronizationService",
  "LocalBrainAnalyticsService",
] as const;

export const LOCALBRAIN_AI_MAY_NOT = [
  "Impersonate the Human or assume Human authority",
  "Become the Human or replace Human decisions",
  "Promote memory to institutional knowledge without governed approval",
  "Share private memory automatically",
  "Duplicate canonical identity records",
] as const;

export function getLocalBrainConstitution() {
  return {
    system_id: "LIX-001",
    build: "11.7",
    wave: "11.7-W1",
    governing_principle: LIX_LOCALBRAIN_PRINCIPLE,
    architecture: [...LOCALBRAIN_ARCHITECTURE],
    layers: [...LOCALBRAIN_LAYERS],
    memory_categories: [...MEMORY_CATEGORIES],
    memory_tiers: [...MEMORY_TIERS],
    privacy_domains: [...PRIVACY_DOMAINS],
    context_objects: [...CONTEXT_OBJECTS],
    sync_modes: [...SYNC_MODES],
    required_services: [...REQUIRED_LOCALBRAIN_SERVICES],
    ai_may_not: [...LOCALBRAIN_AI_MAY_NOT],
    api_namespace: "/api/v1/localbrain",
  };
}
