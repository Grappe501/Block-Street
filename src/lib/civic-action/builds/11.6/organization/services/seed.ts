/**
 * CAE-11.6-W4 — Seed organization defaults
 */
import { nowIso } from "../../../../utils";
import { seedWorkforceIfEmpty } from "../../workforce/services/seed";
import { readStoreSlice } from "./repository";
import { ORGANIZATION_STORE_KEYS } from "../data-model";
import type { AuthorityRecord, FederationRecord, OpsInstitutionRecord, OrganizationUnitRecord, OrgMembershipRecord } from "../data-model";
import { saveAuthority, saveFederation, saveOpsInstitution, saveOrganizationUnit, saveOrgMembership } from "./repository";

const NOW = nowIso();

export function seedOrganizationIfEmpty() {
  seedWorkforceIfEmpty();
  if (readStoreSlice(ORGANIZATION_STORE_KEYS.institutions).length > 0) return false;

  const federation: FederationRecord = {
    federation_id: "fed-block-street-001",
    name: "Block Street Civic Federation",
    description: "Governed coalition of civic institutions",
    status: "active",
    created_at: NOW,
  };
  saveFederation(federation);

  const institution: OpsInstitutionRecord = {
    institution_id: "inst-block-street",
    federation_id: federation.federation_id,
    legal_name: "Block Street Civic Action Institute",
    public_name: "Block Street",
    short_name: "BS",
    institution_type: "nonprofit",
    status: "active",
    primary_language: "en",
    secondary_languages: ["es"],
    time_zone: "America/Chicago",
    jurisdiction: "US-IL",
    mission_statement: "Equip institutions and volunteers with governed tools for learning, mission execution, and accountability.",
    vision_statement: "A community where every citizen can participate effectively in public life.",
    website: "https://block-street.example",
    governance_model: "board",
    branding: { primary_color: "#1a365d", logo_uri: null },
    created_at: NOW,
    updated_at: NOW,
  };
  saveOpsInstitution(institution);

  const division: OrganizationUnitRecord = {
    organization_unit_id: "org-ops-division",
    institution_id: institution.institution_id,
    parent_unit_id: null,
    unit_type: "division",
    name: "Operations Division",
    description: "Mission execution and workforce operations",
    manager_human_id: "usr-001",
    executive_owner_human_id: "usr-001",
    status: "active",
    visibility: "institution",
    created_at: NOW,
  };
  saveOrganizationUnit(division);

  const team: OrganizationUnitRecord = {
    organization_unit_id: "org-field-team",
    institution_id: institution.institution_id,
    parent_unit_id: division.organization_unit_id,
    unit_type: "team",
    name: "Field Operations",
    description: "Field missions and volunteer coordination",
    manager_human_id: "usr-001",
    executive_owner_human_id: "usr-001",
    status: "active",
    visibility: "team",
    created_at: NOW,
  };
  saveOrganizationUnit(team);

  const membership: OrgMembershipRecord = {
    membership_id: "mem-usr-001",
    human_id: "usr-001",
    institution_id: institution.institution_id,
    organization_unit_id: team.organization_unit_id,
    role: "mission_lead",
    start_date: NOW,
    end_date: null,
    status: "active",
    primary_membership: true,
    leadership_flag: true,
  };
  saveOrgMembership(membership);

  const authority: AuthorityRecord = {
    authority_id: "aut-mission-approve",
    institution_id: institution.institution_id,
    organization_unit_id: team.organization_unit_id,
    authority_scope: "mission.approve",
    delegation_allowed: true,
    approval_required: true,
    expiration: null,
    assigned_human_id: "usr-001",
    assigned_role: "mission_lead",
  };
  saveAuthority(authority);

  return true;
}
