/**
 * CAE-11.6-W13 — Improvement events
 */
export const IMPROVEMENT_EVENT_CATALOG = [
  { event: "measurement.created", domain: "measurement", description: "Outcome-based measurement created" },
  { event: "outcome.recorded", domain: "outcome", description: "Mission or community outcome recorded" },
  { event: "benchmark.completed", domain: "benchmark", description: "Benchmark comparison completed with context" },
  { event: "improvement.recommended", domain: "improvement", description: "Continuous improvement recommendation generated" },
  { event: "experiment.started", domain: "experiment", description: "Institutional experiment launched" },
  { event: "experiment.completed", domain: "experiment", description: "Experiment results and lessons recorded" },
  { event: "best.practice.registered", domain: "best_practice", description: "Successful practice registered as institutional asset" },
  { event: "maturity.assessed", domain: "maturity", description: "Institutional maturity assessed across domains" },
  { event: "innovation.recorded", domain: "innovation", description: "Innovation idea or pilot recorded" },
  { event: "institution.improved", domain: "improvement", description: "Approved improvement implemented and evaluated" },
] as const;
