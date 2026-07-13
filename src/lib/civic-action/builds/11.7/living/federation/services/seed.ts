/**
 * CAE-11.7-W11 — Seed federation defaults
 */
import { seedPartnershipIfEmpty } from "../../partnership/services/seed";
import { readStoreSlice } from "./repository";
import { FEDERATION_STORE_KEYS } from "../data-model";
import { federationRuntime } from "./federation-service";

const HUMAN = "usr-001";
const INSTITUTION = "inst-block-street";
const PARTNER = "inst-county-civic-alliance";

export function seedFederationIfEmpty() {
  seedPartnershipIfEmpty();
  if (readStoreSlice(FEDERATION_STORE_KEYS.institutions).length > 0) return false;

  federationRuntime.institutions.ensureDefaults();

  federationRuntime.trust.update({
    institution_id: INSTITUTION,
    partner_institution_id: PARTNER,
    knowledge_sharing: true,
    mission_sharing: true,
    research_sharing: true,
    approved_by_human: true,
  });

  const coalition = federationRuntime.coalitions.create({
    name: "Southeast Texas Civic Coalition",
    lead_institution_id: INSTITUTION,
    member_institution_ids: [INSTITUTION, PARTNER],
    charter_summary: "Joint county immersion and civic education across partner counties.",
    approved_by_human: true,
  });

  federationRuntime.missions.share({
    title: "Regional County Immersion Campaign",
    mission_type: "joint_campaign",
    lead_institution_id: INSTITUTION,
    participating_institution_ids: [INSTITUTION, PARTNER],
    approved_by_human: true,
  });

  federationRuntime.knowledge.publish({
    owner_institution_id: INSTITUTION,
    publisher_institution_id: INSTITUTION,
    title: "County Immersion Playbook",
    content_type: "playbook",
    summary: "Step-by-step guide for launching county immersion programs with partner organizations.",
    visibility: "partners",
    approved_by_human: true,
  });

  federationRuntime.resources.share({
    owner_institution_id: INSTITUTION,
    resource_type: "volunteers",
    description: "Shared facilitator roster for coalition events (read-only coordination)",
    shared_with: [PARTNER],
    authorized_by: HUMAN,
    approved_by_human: true,
  });

  federationRuntime.identity.bind({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    role_id: "role-executive",
    permissions: ["federation.manage", "knowledge.publish"],
  });

  federationRuntime.identity.bind({
    human_id: HUMAN,
    institution_id: PARTNER,
    role_id: "role-partner-liaison",
    permissions: ["federation.view", "mission.coordinate"],
  });

  federationRuntime.search.search({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    query: "county immersion",
    scope: "partners",
  });

  void coalition;
  return true;
}
