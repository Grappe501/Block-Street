/**
 * CAE-11.6-W8 — Executive events
 */
export const EXECUTIVE_EVENT_CATALOG = [
  { event: "executive.briefing.generated", domain: "briefing", description: "Executive briefing generated" },
  { event: "executive.alert.created", domain: "alert", description: "Executive alert created" },
  { event: "decision.awaiting_approval", domain: "decision", description: "Decision queued for executive approval" },
  { event: "decision.approved", domain: "decision", description: "Executive decision approved" },
  { event: "warroom.opened", domain: "warroom", description: "Executive war room opened" },
  { event: "scenario.created", domain: "scenario", description: "What-if scenario created" },
  { event: "scenario.analyzed", domain: "scenario", description: "Scenario analyzed without live data change" },
  { event: "institution.health.updated", domain: "health", description: "Institution health recalculated" },
  { event: "risk.escalated", domain: "risk", description: "Risk escalated to executive attention" },
  { event: "executive.summary.published", domain: "summary", description: "Executive summary published" },
] as const;
