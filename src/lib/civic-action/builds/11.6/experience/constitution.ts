/**
 * CAE-11.6-W14 — Human Experience & Adaptive Workspace Constitution (OPS-001)
 */
export const OPS_EXPERIENCE_PRINCIPLE =
  "Every Human experiences one Institution—not dozens of disconnected modules.";

export const EXPERIENCE_ARCHITECTURE = [
  "identity",
  "workspace",
  "current_context",
  "current_mission",
  "recommended_actions",
  "ai_guidance",
  "institutional_knowledge",
  "execution",
  "learning",
  "growth",
  "institutional_memory",
] as const;

export const WORKSPACE_TYPES = [
  "volunteer",
  "organizer",
  "campaign",
  "executive",
  "training",
  "research",
  "field",
  "committee",
  "instructor",
  "student",
  "partner",
  "guest",
  "emergency",
  "administrator",
  "developer",
] as const;

export const UNIVERSAL_NAVIGATION = [
  "home",
  "workspace",
  "missions",
  "calendar",
  "communications",
  "knowledge",
  "learning",
  "organizations",
  "resources",
  "reports",
  "search",
  "ai",
  "profile",
] as const;

export const COMMAND_PALETTE_ACTIONS = [
  "start_mission",
  "open_todays_calendar",
  "find_person",
  "show_county",
  "reserve_vehicle",
  "create_meeting",
  "translate_to_spanish",
  "generate_executive_briefing",
  "summarize_conversation",
  "open_election_dashboard",
  "search_knowledge",
  "call_ai",
] as const;

export const NOTIFICATION_GROUPS = [
  "critical",
  "today",
  "upcoming",
  "learning",
  "mission",
  "calendar",
  "communications",
  "organization",
  "executive",
  "ai_suggestions",
] as const;

export const SUPPORTED_LANGUAGES = ["en", "es"] as const;

export const DEVICE_TYPES = ["phone", "tablet", "laptop", "desktop", "large_display", "command_center", "tv_dashboard"] as const;

export const REQUIRED_EXPERIENCE_SERVICES = [
  "WorkspaceService",
  "ContextEngineService",
  "NavigationService",
  "CommandPaletteService",
  "UniversalSearchService",
  "DashboardService",
  "NotificationService",
  "ExperienceMemoryService",
  "PersonalizationService",
  "AccessibilityService",
  "LocalizationService",
  "OfflineWorkspaceService",
  "ExperienceAnalyticsService",
  "AdaptiveInterfaceService",
  "AIExperienceAssistantService",
] as const;

export const EXPERIENCE_COMMANDS = [
  "OpenWorkspace",
  "SwitchInstitution",
  "ChangeWorkspace",
  "OpenCommandPalette",
  "SearchEverything",
  "TranslateWorkspace",
  "CustomizeDashboard",
  "PinWorkspaceCard",
  "ActivateOfflineMode",
  "LaunchAIAssistant",
] as const;

export const EXPERIENCE_AI_MAY_NOT = [
  "Act autonomously on behalf of the Human",
  "Hide underlying evidence or sources",
  "Reduce Human agency over institutional decisions",
  "Evaluate or rank individual Human worth",
  "Obscure permission boundaries in search results",
] as const;

export function getExperienceConstitution() {
  return {
    system_id: "OPS-001",
    build: "11.6",
    wave: "11.6-W14",
    governing_principle: OPS_EXPERIENCE_PRINCIPLE,
    architecture: [...EXPERIENCE_ARCHITECTURE],
    workspace_types: [...WORKSPACE_TYPES],
    universal_navigation: [...UNIVERSAL_NAVIGATION],
    command_palette_actions: [...COMMAND_PALETTE_ACTIONS],
    notification_groups: [...NOTIFICATION_GROUPS],
    supported_languages: [...SUPPORTED_LANGUAGES],
    device_types: [...DEVICE_TYPES],
    required_services: [...REQUIRED_EXPERIENCE_SERVICES],
    commands: [...EXPERIENCE_COMMANDS],
    ai_may_not: [...EXPERIENCE_AI_MAY_NOT],
    api_namespace: "/api/v1/workspace",
  };
}
