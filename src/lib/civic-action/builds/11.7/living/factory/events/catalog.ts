/**
 * CAE-11.7-W13 — Factory events
 */
export const FACTORY_EVENT_CATALOG = [
  { event: "capability.created", domain: "capability", description: "New capability registered in Factory" },
  { event: "capability.updated", domain: "capability", description: "Capability lifecycle stage advanced" },
  { event: "architecture.approved", domain: "review", description: "Architecture review passed governance checks" },
  { event: "build.started", domain: "build", description: "Reproducible build pipeline initiated" },
  { event: "build.completed", domain: "build", description: "Build packaged and ready for certification" },
  { event: "certification.passed", domain: "certification", description: "All required tests passed certification" },
  { event: "deployment.started", domain: "deployment", description: "Staged deployment initiated with approval" },
  { event: "deployment.completed", domain: "deployment", description: "Deployment completed with observation enabled" },
  { event: "rollback.executed", domain: "rollback", description: "Deployment rolled back safely" },
  { event: "extension.published", domain: "marketplace", description: "Validated extension published to marketplace" },
] as const;
