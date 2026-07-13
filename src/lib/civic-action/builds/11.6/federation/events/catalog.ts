/**
 * CAE-11.6-W12 — Federation events
 */
export const FEDERATION_EVENT_CATALOG = [
  { event: "federation.created", domain: "federation", description: "Federation created with charter" },
  { event: "institution.joined", domain: "membership", description: "Institution joined federation" },
  { event: "institution.left", domain: "membership", description: "Institution left federation" },
  { event: "agreement.signed", domain: "agreement", description: "Federation agreement signed" },
  { event: "shared.mission.created", domain: "mission", description: "Joint mission created across institutions" },
  { event: "resource.shared", domain: "resource", description: "Resource shared between institutions" },
  { event: "knowledge.shared", domain: "knowledge", description: "Knowledge shared with federation permissions" },
  { event: "mutual.aid.activated", domain: "mutual_aid", description: "Federation mutual aid request activated" },
  { event: "vote.completed", domain: "governance", description: "Federation vote completed" },
  { event: "federation.briefing.generated", domain: "briefing", description: "Executive federation briefing generated" },
] as const;
