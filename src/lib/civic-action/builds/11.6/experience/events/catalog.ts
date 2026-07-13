/**
 * CAE-11.6-W14 — Experience events
 */
export const EXPERIENCE_EVENT_CATALOG = [
  { event: "workspace.opened", domain: "workspace", description: "Adaptive workspace opened for Human" },
  { event: "workspace.switched", domain: "workspace", description: "Human switched workspace or institution" },
  { event: "dashboard.updated", domain: "dashboard", description: "Adaptive dashboard cards refreshed" },
  { event: "search.executed", domain: "search", description: "Universal search executed with permissions" },
  { event: "AI.assistant.invoked", domain: "ai", description: "AI experience assistant invoked" },
  { event: "notification.grouped", domain: "notification", description: "Notifications intelligently grouped" },
  { event: "offline.mode.enabled", domain: "offline", description: "Offline workspace mode activated" },
  { event: "language.changed", domain: "localization", description: "Workspace language changed" },
  { event: "experience.personalized", domain: "personalization", description: "Institutional or workspace personalization applied" },
  { event: "command.executed", domain: "command_palette", description: "Command palette action executed" },
] as const;
