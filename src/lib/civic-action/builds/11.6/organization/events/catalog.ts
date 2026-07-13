/**
 * CAE-11.6-W4 — Organization events
 */
export const ORGANIZATION_EVENT_CATALOG = [
  { event: "institution.created", domain: "institution", description: "OPS institution created" },
  { event: "institution.updated", domain: "institution", description: "Institution updated" },
  { event: "organization.created", domain: "organization", description: "Organization unit created" },
  { event: "organization.updated", domain: "organization", description: "Organization unit updated" },
  { event: "leadership.assigned", domain: "leadership", description: "Leadership role assigned" },
  { event: "authority.delegated", domain: "authority", description: "Authority delegated" },
  { event: "membership.created", domain: "membership", description: "Organizational membership created" },
  { event: "membership.ended", domain: "membership", description: "Membership ended" },
  { event: "governance.decision_recorded", domain: "governance", description: "Governance decision recorded" },
  { event: "vote.completed", domain: "governance", description: "Vote completed" },
  { event: "shared_mission.created", domain: "mission", description: "Shared mission created" },
  { event: "federation.joined", domain: "federation", description: "Institution joined federation" },
] as const;
