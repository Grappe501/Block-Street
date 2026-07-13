/**
 * CAE-11.7-W11 — Federation events
 */
export const FEDERATION_EVENT_CATALOG = [
  { event: "institution.joined", domain: "federation", description: "Sovereign institution joined federation voluntarily" },
  { event: "institution.left", domain: "federation", description: "Institution left federation with ownership preserved" },
  { event: "knowledge.shared", domain: "knowledge", description: "Knowledge published with ownership metadata" },
  { event: "knowledge.revoked", domain: "knowledge", description: "Shared knowledge revoked by owner institution" },
  { event: "mission.shared", domain: "mission", description: "Mission shared across coalition with lead institution" },
  { event: "trust.updated", domain: "trust", description: "Contractual trust relationship updated" },
  { event: "coalition.created", domain: "coalition", description: "Coalition formed from sovereign institutions" },
  { event: "coalition.updated", domain: "coalition", description: "Coalition membership or charter updated" },
  { event: "resource.shared", domain: "resource", description: "Resource coordinated without ownership transfer" },
  { event: "federation.audited", domain: "audit", description: "Shared object audit recorded with provenance" },
] as const;
