/**
 * CAE-11.7-W1 — LocalBrain events
 */
export const LOCALBRAIN_EVENT_CATALOG = [
  { event: "localbrain.created", domain: "localbrain", description: "LocalBrain provisioned for verified Human" },
  { event: "memory.created", domain: "memory", description: "Memory record created in governed tier" },
  { event: "memory.updated", domain: "memory", description: "Memory record updated with traceability" },
  { event: "memory.promoted", domain: "memory", description: "Memory promoted between tiers with approval" },
  { event: "context.changed", domain: "context", description: "Context runtime updated for current situation" },
  { event: "timeline.updated", domain: "timeline", description: "Personal timeline entry recorded" },
  { event: "workspace.updated", domain: "workspace", description: "Workspace preferences or layout updated" },
  { event: "relationship.learned", domain: "relationships", description: "Relationship memory enriched" },
  { event: "knowledge.cached", domain: "knowledge", description: "Local knowledge cache updated" },
  { event: "preferences.changed", domain: "preferences", description: "Human preferences updated" },
] as const;
