export type UnitStatus =
  | "draft"
  | "provisioning"
  | "active"
  | "needs_review"
  | "restricted"
  | "suspended"
  | "merging"
  | "splitting"
  | "archiving"
  | "archived";

export type ConfigurationDraftStatus =
  | "draft"
  | "validation"
  | "review"
  | "changes_requested"
  | "approved"
  | "scheduled"
  | "active"
  | "superseded";

export type InheritanceMode =
  | "no_inheritance"
  | "unit_only"
  | "downward"
  | "selected_children"
  | "reporting_access_only"
  | "custom_policy";

export type ValidationStatus = "passed" | "passed_with_warnings" | "blocked" | "failed";

export interface OrganizationalUnit {
  id: string;
  public_id: string;
  institution_id: string;
  parent_unit_id: string | null;
  unit_type: string;
  name: string;
  display_name: string;
  slug: string;
  description: string;
  status: UnitStatus;
  purpose: string;
  jurisdiction_type_optional: string | null;
  jurisdiction_reference_optional: string | null;
  workspace_id_optional: string | null;
  primary_owner_user_id: string | null;
  administrative_owner_user_id_optional: string | null;
  security_owner_user_id_optional: string | null;
  data_owner_user_id_optional: string | null;
  support_owner_user_id_optional: string | null;
  default_timezone: string;
  default_locale: string;
  effective_at: string;
  expires_at_optional: string | null;
  created_at: string;
  updated_at: string;
  archived_at_optional: string | null;
}

export interface OrganizationalUnitOwner {
  id: string;
  unit_id: string;
  owner_type: string;
  user_id: string;
  starts_at: string;
  expires_at_optional: string | null;
  assigned_by: string;
  status: "active" | "expired" | "revoked";
}

export interface LeadershipPosition {
  id: string;
  institution_id: string;
  unit_id: string;
  position_key: string;
  title: string;
  description: string;
  role_id: string;
  requires_certification: boolean;
  status: "active" | "archived";
}

export interface LeadershipAssignment {
  id: string;
  position_id: string;
  user_id: string | null;
  starts_at: string;
  ends_at_optional: string | null;
  appointed_by: string;
  status: "filled" | "vacant" | "interim" | "expiring_soon";
  succession_state: string;
  temporary: boolean;
}

export interface OrganizationalUnitMembership {
  id: string;
  unit_id: string;
  user_id: string;
  membership_type: string;
  status: "active" | "ended";
  joined_at: string;
  primary_unit: boolean;
}

export interface OrganizationalRoleAssignment {
  id: string;
  user_id: string;
  unit_id: string;
  role_id: string;
  starts_at: string;
  expires_at_optional: string | null;
  assigned_by: string;
  status: "active" | "revoked";
  inheritance_mode: InheritanceMode;
}

export interface UnitWorkspaceMapping {
  id: string;
  unit_id: string;
  workspace_id: string;
  institution_id: string;
  mapping_type: string;
  purpose: string;
  is_primary: boolean;
  status: "active" | "archived";
}

export interface OrganizationalJurisdiction {
  id: string;
  unit_id: string;
  jurisdiction_type: string;
  jurisdiction_reference: string;
  is_primary: boolean;
  coverage_type: string;
  starts_at: string;
}

export interface SharedServiceAssignment {
  id: string;
  provider_unit_id: string;
  recipient_unit_id: string;
  institution_id: string;
  service_type: string;
  service_level: string;
  owner: string;
  status: "active" | "ended";
  starts_at: string;
}

export interface OrganizationalApprovalPath {
  id: string;
  unit_id: string;
  action_type: string;
  step_number: number;
  required_role: string;
  minimum_approvals: number;
  status: "active";
}

export interface OrganizationalEscalationPath {
  id: string;
  source_unit_id: string;
  issue_type: string;
  target_unit_id: string;
  target_role_id: string;
  status: "active";
}

export interface ConfigurationDraft {
  id: string;
  institution_id: string;
  template_id: string;
  base_configuration_version: number;
  proposed_changes: string;
  status: ConfigurationDraftStatus;
  effective_at: string | null;
  created_by: string;
  created_at: string;
  submitted_at_optional: string | null;
  approved_at_optional: string | null;
}

export interface OrganizationConfigurationVersion {
  id: string;
  institution_id: string;
  version_number: number;
  effective_at: string;
  created_by: string;
  approved_by: string;
  change_summary: string;
  structure_snapshot_reference: string;
  status: "active" | "superseded" | "scheduled";
}

export interface ReorganizationPlan {
  id: string;
  institution_id: string;
  name: string;
  reason: string;
  current_version: number;
  proposed_version: number;
  effective_at: string;
  affected_units: string[];
  status: "draft" | "preview" | "submitted" | "approved" | "executed" | "failed";
  created_by: string;
  preview?: ReorganizationPreview;
}

export interface ReorganizationPreview {
  units_created: number;
  units_archived: number;
  members_reassigned: number;
  leadership_assignments_changed: number;
  workspace_mappings_changed: number;
  approval_paths_affected: number;
  historical_records_rewritten: number;
  blocking_issues: string[];
}

export interface OrganizationConfigurationValidation {
  id: string;
  institution_id: string;
  configuration_version: number;
  checks_total: number;
  checks_passed: number;
  warnings: string[];
  blocking_issues: string[];
  status: ValidationStatus;
  validated_at: string;
}

export interface OrganizationalAuditEvent {
  id: string;
  institution_id: string;
  unit_id_optional: string | null;
  actor_id: string;
  action: string;
  target_type: string;
  target_id: string;
  previous_state: string | null;
  new_state: string | null;
  reason: string | null;
  configuration_version: number | null;
  timestamp: string;
  correlation_id: string;
  result: "success" | "failure" | "denied";
}

export interface OrganizationHealth {
  active_units: number;
  campuses: number;
  chapters: number;
  departments: number;
  ownerless_units: number;
  leadership_vacancies: number;
  configuration_warnings: number;
  pending_reorganizations: number;
  structure_validation: string;
}

export interface StructureNode {
  unit: OrganizationalUnit;
  children: StructureNode[];
  depth: number;
}

export interface CreateUnitInput {
  institution_id: string;
  parent_unit_id?: string | null;
  unit_type: string;
  name: string;
  purpose?: string;
  primary_owner_user_id?: string;
  jurisdiction_type?: string;
  jurisdiction_reference?: string;
}

export interface ApplyTemplateInput {
  institution_id: string;
  template_id: string;
  actor_id: string;
  campus_units?: Array<{ name: string; parent_region_key: string; owner: string }>;
}
