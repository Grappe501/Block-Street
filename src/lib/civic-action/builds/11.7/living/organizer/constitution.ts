/**
 * CAE-11.7-W4 — Organizer Constitution (LIX-004)
 */
export const LIX_ORGANIZER_PRINCIPLE =
  "The Organizer coordinates work. Humans perform work.";

export const ORGANIZER_ARCHITECTURE = [
  "identity",
  "localbrain",
  "context_runtime",
  "executive_assistant",
  "organizer_runtime",
  "mission_coordination",
  "human_review",
  "authorized_execution",
  "operational_tracking",
  "institutional_memory",
] as const;

export const ORGANIZER_MAY = [
  "plan",
  "schedule",
  "organize",
  "prioritize",
  "prepare",
  "coordinate",
  "remind",
  "recommend",
  "track",
  "explain",
] as const;

export const ORGANIZER_MAY_NOT = [
  "perform_work_without_authorization",
  "invent_priorities",
  "change_canonical_records_silently",
  "reassign_humans_autonomously",
  "cancel_commitments",
  "override_human_judgment",
  "send_communications_autonomously",
  "modify_calendar_silently",
  "spend_resources",
  "score_employee_productivity",
  "monitor_keyboard_or_mouse",
  "track_continuous_location",
  "generate_hidden_workload_rankings",
] as const;

export const PLAN_TYPES = [
  "morning",
  "afternoon_adjustment",
  "evening_review",
  "tomorrow_preview",
  "weekly",
  "mission",
  "travel",
  "recovery",
] as const;

export const DEPENDENCY_TYPES = [
  "human",
  "document",
  "approval",
  "budget",
  "calendar",
  "technology",
  "external_partner",
] as const;

export const CHECKLIST_TYPES = [
  "simple",
  "mission",
  "travel",
  "meeting_preparation",
  "incident_response",
  "training",
  "campaign_event",
  "certification",
  "deployment",
] as const;

export const DEADLINE_ACTIONS = ["accelerate", "delegate", "delay", "escalate"] as const;

export const REQUIRED_ORGANIZER_SERVICES = [
  "OrganizerService",
  "DailyPlanningService",
  "MissionCoordinator",
  "TaskCoordinator",
  "DependencyService",
  "ChecklistService",
  "TeamCoordinator",
  "CapacityService",
  "ResourceCoordinator",
  "TravelCoordinator",
  "CommunicationCoordinator",
  "DeadlineService",
  "DailyReviewService",
  "OrganizerPrivacyService",
] as const;

export function getOrganizerConstitution() {
  return {
    protocol_id: "CAE-11.7-W4",
    governing_principle: LIX_ORGANIZER_PRINCIPLE,
    architecture: ORGANIZER_ARCHITECTURE,
    may: ORGANIZER_MAY,
    may_not: ORGANIZER_MAY_NOT,
    required_services: REQUIRED_ORGANIZER_SERVICES,
  };
}
