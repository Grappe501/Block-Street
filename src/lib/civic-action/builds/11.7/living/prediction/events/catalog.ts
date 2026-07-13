/**
 * CAE-11.7-W8 — Prediction events
 */
export const PREDICTION_EVENT_CATALOG = [
  { event: "forecast.generated", domain: "forecast", description: "Evidence-backed forecast generated" },
  { event: "scenario.completed", domain: "scenario", description: "Scenario modeling completed" },
  { event: "trend.updated", domain: "trend", description: "Trend analysis updated" },
  { event: "risk.forecasted", domain: "risk", description: "Emerging risk forecasted with evidence" },
  { event: "opportunity.forecasted", domain: "opportunity", description: "Future opportunity forecasted" },
  { event: "assumption.changed", domain: "assumption", description: "Human edited assumption and model rerun" },
  { event: "simulation.completed", domain: "simulation", description: "Strategic simulation completed" },
  { event: "impact.analyzed", domain: "impact", description: "Decision impact analysis prepared" },
  { event: "planning.updated", domain: "planning", description: "Long-term planning horizon updated" },
] as const;
