/**
 * CAE-11.7-W2 — Context Intelligence Constitution (LIX-002)
 */
export const LIX_CONTEXT_PRINCIPLE =
  "Context should reduce Human effort without reducing Human control.";

export const CONTEXT_ARCHITECTURE = [
  "verified_human_identity",
  "localbrain_runtime",
  "context_intake",
  "permission_privacy_filtering",
  "context_resolution",
  "attention_evaluation",
  "situational_awareness",
  "recommendations_preparation",
  "human_action",
] as const;

export const CONTEXT_TYPES = [
  "human",
  "institution",
  "organization",
  "role",
  "mission",
  "objective",
  "task",
  "calendar",
  "meeting",
  "conversation",
  "knowledge",
  "learning",
  "resource",
  "location",
  "travel",
  "device",
  "attention",
  "emergency",
] as const;

export const CONTEXT_AUTHORITY_LEVELS = [
  "canonical",
  "human_declared",
  "system_observed",
  "system_inferred",
  "ai_suggested",
  "historical",
] as const;

export const CONTEXT_STATUSES = [
  "active",
  "possible",
  "pending_confirmation",
  "stale",
  "expired",
  "rejected",
  "superseded",
  "restricted",
] as const;

export const ATTENTION_MODES = [
  "available",
  "focused_work",
  "in_meeting",
  "traveling",
  "field_operations",
  "presenting",
  "resting",
  "quiet_time",
  "emergency",
  "do_not_disturb",
] as const;

export const ATTENTION_CATEGORIES = [
  "act_now",
  "prepare_today",
  "review_soon",
  "waiting_on_others",
  "monitor",
  "optional",
  "dismissed",
  "deferred",
] as const;

export const LOCATION_MODES = [
  "no_location",
  "human_entered_general_area",
  "approximate_device",
  "mission_check_in",
  "travel_route",
  "emergency_sharing",
] as const;

export const REQUIRED_CONTEXT_SERVICES = [
  "ContextRegistryService",
  "ContextSignalService",
  "ActiveContextService",
  "ContextResolutionService",
  "ContextConflictService",
  "ContextConfirmationService",
  "InstitutionContextService",
  "MissionContextService",
  "TemporalContextService",
  "MeetingContextService",
  "TravelContextService",
  "DeviceContextService",
  "RelationshipContextService",
  "AttentionContextService",
  "FocusSessionService",
  "NextActionService",
  "ContextPrivacyService",
  "ContextRetentionService",
  "ContextAuditService",
  "ContextCorrectionService",
] as const;

export const CONTEXT_COMMANDS = [
  "SelectActiveContext",
  "ResolveActiveContext",
  "ConfirmActiveContext",
  "CorrectActiveContext",
  "ExpireActiveContext",
  "PauseContextInference",
  "ResumeContextInference",
  "StartFocusSession",
  "CompleteFocusSession",
  "SetQuietTime",
  "RecommendNextAction",
  "AcceptNextAction",
  "DismissNextAction",
] as const;

export const CONTEXT_AI_MAY_NOT = [
  "Silently change institutional records based on context",
  "Infer political beliefs, medical conditions, or psychological state",
  "Track precise location by default",
  "Infer intent from proximity or attendance alone",
  "Use fake urgency or guilt-based attention prompts",
  "Leak context across institutions without authorization",
  "Overwrite human-declared context with weak inference",
] as const;

export function getContextConstitution() {
  return {
    system_id: "LIX-002",
    build: "11.7",
    wave: "11.7-W2",
    governing_principle: LIX_CONTEXT_PRINCIPLE,
    architecture: [...CONTEXT_ARCHITECTURE],
    context_types: [...CONTEXT_TYPES],
    authority_levels: [...CONTEXT_AUTHORITY_LEVELS],
    context_statuses: [...CONTEXT_STATUSES],
    attention_modes: [...ATTENTION_MODES],
    required_services: [...REQUIRED_CONTEXT_SERVICES],
    commands: [...CONTEXT_COMMANDS],
    ai_may_not: [...CONTEXT_AI_MAY_NOT],
    api_namespace: "/api/v1/localbrain/context",
  };
}
