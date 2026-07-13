/**
 * CAE-11.6-W12 — Seed federation defaults
 */
import { nowIso } from "../../../../utils";
import { seedResilienceIfEmpty } from "../../resilience/services/seed";
import { readStoreSlice } from "./repository";
import { FEDERATION_STORE_KEYS } from "../data-model";
import { saveFederationCapability, saveFederationMembership, saveFederationProfile } from "./repository";

const NOW = nowIso();
const INSTITUTION = "inst-block-street";
const FEDERATION_ID = "fed-block-street-001";

export function seedFederationIfEmpty() {
  seedResilienceIfEmpty();
  if (readStoreSlice(FEDERATION_STORE_KEYS.profiles).length > 0) return false;

  saveFederationProfile({
    federation_id: FEDERATION_ID,
    name: "Block Street Civic Coalition",
    description: "Regional coalition of civic action institutions",
    purpose: "Coordinate volunteer training, community outreach, and emergency mutual aid",
    federation_type: "coalition",
    governance_model: "representative_council",
    status: "active",
    charter: {
      mission: "Strengthen civic institutions through governed collaboration",
      vision: "A resilient network of independent organizations working as one",
      shared_principles: ["Sovereignty", "Transparency", "Explicit agreements", "Human authority"],
      membership_rules: "Verified institutions with signed charter acceptance",
      voting_rules: "Simple majority for operational decisions; super majority for charter changes",
      resource_sharing: "Policy-driven sharing with audit trails",
      data_policies: "Institutional data remains owned; sharing requires explicit permission",
      exit_procedures: "30-day notice with historical archive preservation",
    },
    participating_institutions: [INSTITUTION],
    visibility: "members_only",
    membership_policy: "Invitation with verified institution status",
    version: 1,
    created_at: NOW,
    updated_at: NOW,
  });

  saveFederationMembership({
    membership_id: "mem-block-street-001",
    institution_id: INSTITUTION,
    federation_id: FEDERATION_ID,
    membership_type: "full",
    authority_level: "voting",
    voting_rights: true,
    resource_sharing: true,
    knowledge_sharing: true,
    start_date: NOW,
    end_date: null,
    status: "active",
  });

  saveFederationCapability({
    capability_id: "cap-block-street-001",
    institution_id: INSTITUTION,
    federation_id: FEDERATION_ID,
    competencies: ["volunteer_training", "community_outreach", "election_operations"],
    resources: ["training_materials", "volunteer_pool"],
    facilities: ["Block Street Training Center"],
    training: ["civic_action_basics", "election_day_operations"],
    technology: ["ops_platform", "communications"],
    languages: ["en", "es"],
    special_expertise: ["grassroots_mobilization", "emergency_response"],
    updated_at: NOW,
  });

  return true;
}
