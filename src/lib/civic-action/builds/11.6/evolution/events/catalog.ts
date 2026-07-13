/**
 * CAE-11.6-W16 — Evolution events
 */
export const EVOLUTION_EVENT_CATALOG = [
  { event: "canon.updated", domain: "canon", description: "Canon revision published with traceability" },
  { event: "evolution.proposed", domain: "evolution", description: "Evolution proposal submitted with evidence" },
  { event: "evolution.approved", domain: "evolution", description: "Human governance approved evolution proposal" },
  { event: "architecture.review.completed", domain: "architecture", description: "Architecture health review completed" },
  { event: "drift.detected", domain: "drift", description: "Canon drift detected for Human review" },
  { event: "factory.generated", domain: "factory", description: "Factory deployment package generated" },
  { event: "institution.generated", domain: "cloning", description: "New institution generated from certified Canon" },
  { event: "documentation.generated", domain: "documentation", description: "Living documentation synchronized" },
  { event: "digital.twin.completed", domain: "digital_twin", description: "Digital twin simulation completed" },
  { event: "future.build.queued", domain: "future_builds", description: "Future build item added to queue" },
] as const;
