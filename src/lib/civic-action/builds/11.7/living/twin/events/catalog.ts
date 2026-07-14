/**
 * CAE-11.7-W14 — Digital Twin events
 */
export const TWIN_EVENT_CATALOG = [
  { event: "twin.updated", domain: "twin", description: "Digital Twin synchronized or versioned" },
  { event: "simulation.started", domain: "simulation", description: "Isolated simulation began" },
  { event: "simulation.completed", domain: "simulation", description: "Simulation completed with audit trail" },
  { event: "experiment.created", domain: "experiment", description: "Governed experiment registered" },
  { event: "experiment.completed", domain: "experiment", description: "Experiment results and lessons recorded" },
  { event: "scenario.compared", domain: "scenario", description: "Alternative scenarios compared" },
  { event: "stress.test.completed", domain: "stress", description: "Operational stress test identified breaking points" },
  { event: "twin.accuracy.updated", domain: "accuracy", description: "Twin accuracy measured against reality" },
] as const;
