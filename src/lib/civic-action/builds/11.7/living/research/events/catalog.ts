/**
 * CAE-11.7-W5 — Research Network events
 */
export const RESEARCH_EVENT_CATALOG = [
  { event: "research.discovered", domain: "research", description: "New research item acquired from authorized source" },
  { event: "research.updated", domain: "research", description: "Research item version updated" },
  { event: "research.promoted", domain: "research", description: "Research promoted after governed review" },
  { event: "change.detected", domain: "monitoring", description: "Meaningful change detected in monitored domain" },
  { event: "source.validated", domain: "source", description: "Source trust validation completed" },
  { event: "source.failed", domain: "source", description: "Source validation or retrieval failed" },
  { event: "opportunity.discovered", domain: "opportunity", description: "Evidence-backed opportunity identified" },
  { event: "threat.detected", domain: "threat", description: "Evidence-backed threat identified" },
  { event: "brief.generated", domain: "brief", description: "Research brief generated for review" },
  { event: "monitor.started", domain: "monitoring", description: "Continuous monitoring subscription started" },
  { event: "correlation.linked", domain: "correlation", description: "Research correlated to mission or knowledge" },
] as const;
