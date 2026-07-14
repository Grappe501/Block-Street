/**
 * CAE-11.7-W16 — Genesis events
 */
export const GENESIS_EVENT_CATALOG = [
  { event: "genesis.created", domain: "genesis", description: "Genesis package exported as institutional birth certificate" },
  { event: "archive.updated", domain: "archive", description: "Canonical archive entry versioned with provenance" },
  { event: "continuity.tested", domain: "continuity", description: "Continuity plan tested successfully" },
  { event: "recovery.completed", domain: "recovery", description: "Disaster recovery completed with authenticity preserved" },
  { event: "timeline.updated", domain: "timeline", description: "Historical timeline event permanently recorded" },
  { event: "dna.updated", domain: "dna", description: "Institutional DNA snapshot refreshed" },
  { event: "legacy.recorded", domain: "legacy", description: "Succession or legacy transfer recorded" },
  { event: "institution.certified", domain: "certification", description: "Living Institution continuity certified" },
] as const;
