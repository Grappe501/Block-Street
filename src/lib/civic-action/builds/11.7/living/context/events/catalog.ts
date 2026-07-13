/**
 * CAE-11.7-W2 — Context Intelligence events
 */
export const CONTEXT_EVENT_CATALOG = [
  { event: "context.signal_received", domain: "context", description: "Context signal ingested from approved source" },
  { event: "context.resolved", domain: "context", description: "Context resolution completed with confidence" },
  { event: "context.changed", domain: "context", description: "Active context stack updated" },
  { event: "context.confirmation_requested", domain: "context", description: "Low-confidence context requires Human confirmation" },
  { event: "context.confirmed", domain: "context", description: "Human confirmed active context" },
  { event: "context.corrected", domain: "context", description: "Human corrected context inference" },
  { event: "context.expired", domain: "context", description: "Stale context expired per freshness rules" },
  { event: "context.inference_paused", domain: "context", description: "Human paused context inference" },
  { event: "attention.priority_recommended", domain: "attention", description: "Explainable priority surfaced to Human" },
  { event: "attention.interruption_deferred", domain: "attention", description: "Notification bundled during focus" },
  { event: "focus.session_started", domain: "focus", description: "Focus session activated with interruption policy" },
  { event: "focus.session_completed", domain: "focus", description: "Focus session completed" },
  { event: "next_action.recommended", domain: "next_action", description: "Contextual next action recommended" },
  { event: "next_action.accepted", domain: "next_action", description: "Human accepted recommended action" },
  { event: "next_action.dismissed", domain: "next_action", description: "Human dismissed recommendation" },
  { event: "institution.context_switched", domain: "institution", description: "Institution context switched with isolation refresh" },
] as const;
