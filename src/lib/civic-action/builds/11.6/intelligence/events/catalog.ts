/**
 * CAE-11.6-W10 — Intelligence events
 */
export const INTELLIGENCE_EVENT_CATALOG = [
  { event: "forecast.generated", domain: "forecast", description: "Institutional forecast generated" },
  { event: "insight.created", domain: "insight", description: "Executive insight created" },
  { event: "pattern.detected", domain: "pattern", description: "Operational pattern detected" },
  { event: "risk.predicted", domain: "risk", description: "Risk prediction generated" },
  { event: "opportunity.detected", domain: "opportunity", description: "Institutional opportunity identified" },
  { event: "scenario.completed", domain: "scenario", description: "What-if scenario analyzed" },
  { event: "simulation.finished", domain: "simulation", description: "Isolated simulation completed" },
  { event: "recommendation.created", domain: "recommendation", description: "Advisory recommendation created" },
  { event: "prediction.evaluated", domain: "learning", description: "Prediction outcome evaluated" },
  { event: "institutional.learning.updated", domain: "learning", description: "Continuous learning record updated" },
] as const;
