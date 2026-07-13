/**
 * CAE-11.7-W3 — Executive Assistant events
 */
export const EXECUTIVE_EVENT_CATALOG = [
  { event: "executive_assistant.requested", domain: "executive", description: "Executive assistance request received" },
  { event: "executive_assistant.response_generated", domain: "executive", description: "Executive response prepared for review" },
  { event: "briefing.generated", domain: "briefing", description: "Briefing generated with evidence" },
  { event: "briefing.refreshed", domain: "briefing", description: "Briefing refreshed after context change" },
  { event: "briefing.expired", domain: "briefing", description: "Stale briefing expired" },
  { event: "meeting.preparation_generated", domain: "meeting", description: "Meeting preparation package created" },
  { event: "decision.package_generated", domain: "decision", description: "Decision package prepared" },
  { event: "decision.more_evidence_required", domain: "decision", description: "Decision blocked pending evidence" },
  { event: "commitment.suggested", domain: "commitment", description: "AI-detected commitment suggested" },
  { event: "commitment.confirmed", domain: "commitment", description: "Human confirmed commitment" },
  { event: "commitment.completed", domain: "commitment", description: "Commitment marked complete" },
  { event: "commitment.overdue", domain: "commitment", description: "Commitment past due" },
  { event: "executive_draft.created", domain: "draft", description: "AI-prepared draft created" },
  { event: "delegation.recommended", domain: "delegation", description: "Delegation recommendation prepared" },
  { event: "handoff.package_created", domain: "handoff", description: "Handoff package created" },
  { event: "executive.risk_escalated", domain: "risk", description: "Material risk escalated for attention" },
  { event: "executive.opportunity_identified", domain: "opportunity", description: "Opportunity brief prepared" },
  { event: "executive_output.reported", domain: "audit", description: "Human reported executive output problem" },
] as const;
