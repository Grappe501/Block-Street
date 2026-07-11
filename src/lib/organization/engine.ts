import {
  loadFeatureFlags,
  loadConfigurationTemplates,
  loadUnits,
  persistUnits,
  loadUnitOwners,
  persistUnitOwners,
  loadLeadershipPositions,
  persistLeadershipPositions,
  loadLeadershipAssignments,
  persistLeadershipAssignments,
  loadRoleAssignments,
  persistRoleAssignments,
  loadWorkspaceMappings,
  persistWorkspaceMappings,
  loadJurisdictions,
  persistJurisdictions,
  loadSharedServices,
  persistSharedServices,
  loadApprovalPaths,
  persistApprovalPaths,
  loadEscalationPaths,
  persistEscalationPaths,
  loadConfigurationDrafts,
  persistConfigurationDrafts,
  loadConfigurationVersions,
  persistConfigurationVersions,
  loadReorganizations,
  persistReorganizations,
  loadValidations,
  loadAuditEvents,
  loadHealth,
  persistHealth,
  loadUnitTypes,
  loadMemberships,
} from "./data";
import { recordOrgAudit } from "./audit";
import {
  buildStructureTree,
  getAncestors,
  getDescendants,
  getUnit,
  listInstitutionUnits,
  validateParentChildType,
  wouldCreateCycle,
} from "./hierarchy";
import { validateOrganizationConfiguration } from "./validate";
import type {
  ApplyTemplateInput,
  ConfigurationDraft,
  CreateUnitInput,
  OrganizationConfigurationVersion,
  OrganizationHealth,
  OrganizationalUnit,
  ReorganizationPlan,
  ReorganizationPreview,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
}

function assertOrgEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.ORGANIZATIONAL_MODEL_ENABLED) throw new Error("Organizational model is not enabled.");
  return flags;
}

export function listTemplates() {
  return loadConfigurationTemplates().filter((t) => t.status === "published");
}

export function getConfiguration(institutionId: string) {
  const drafts = loadConfigurationDrafts().filter((d) => d.institution_id === institutionId);
  const versions = loadConfigurationVersions().filter((v) => v.institution_id === institutionId);
  const activeVersion = versions.find((v) => v.status === "active") ?? versions[versions.length - 1] ?? null;
  return {
    institution_id: institutionId,
    units: listInstitutionUnits(institutionId),
    structure: buildStructureTree(institutionId),
    active_version: activeVersion,
    drafts,
    versions,
  };
}

export function createUnit(input: CreateUnitInput, actorId: string): OrganizationalUnit {
  assertOrgEnabled();
  const unitTypes = loadUnitTypes() as Array<{ key: string; allowed_parent_types: string[] }>;
  let parentType: string | null = null;
  if (input.parent_unit_id) {
    const parent = getUnit(input.parent_unit_id);
    if (!parent || parent.institution_id !== input.institution_id) {
      throw new Error("Invalid parent unit or cross-institution parent.");
    }
    parentType = parent.unit_type;
  }
  if (!validateParentChildType(parentType, input.unit_type, unitTypes)) {
    throw new Error(`Unit type ${input.unit_type} cannot be child of ${parentType ?? "institution"}.`);
  }

  const unit: OrganizationalUnit = {
    id: id("unit"),
    public_id: slugify(input.name),
    institution_id: input.institution_id,
    parent_unit_id: input.parent_unit_id ?? null,
    unit_type: input.unit_type,
    name: input.name.trim(),
    display_name: input.name.trim(),
    slug: slugify(input.name),
    description: "",
    status: "active",
    purpose: input.purpose ?? "",
    jurisdiction_type_optional: input.jurisdiction_type ?? null,
    jurisdiction_reference_optional: input.jurisdiction_reference ?? null,
    workspace_id_optional: null,
    primary_owner_user_id: input.primary_owner_user_id ?? null,
    administrative_owner_user_id_optional: null,
    security_owner_user_id_optional: null,
    data_owner_user_id_optional: null,
    support_owner_user_id_optional: null,
    default_timezone: "America/Chicago",
    default_locale: "en-US",
    effective_at: now(),
    expires_at_optional: null,
    created_at: now(),
    updated_at: now(),
    archived_at_optional: null,
  };

  const units = loadUnits();
  units.push(unit);
  persistUnits(units);

  if (input.primary_owner_user_id) {
    assignUnitOwner(unit.id, "primary", input.primary_owner_user_id, actorId);
  }

  if (input.jurisdiction_type && input.jurisdiction_reference) {
    const jurisdictions = loadJurisdictions();
    jurisdictions.push({
      id: id("jur"),
      unit_id: unit.id,
      jurisdiction_type: input.jurisdiction_type,
      jurisdiction_reference: input.jurisdiction_reference,
      is_primary: true,
      coverage_type: "primary",
      starts_at: now(),
    });
    persistJurisdictions(jurisdictions);
  }

  recordOrgAudit({
    institution_id: input.institution_id,
    unit_id_optional: unit.id,
    actor_id: actorId,
    action: "organization.unit_created",
    target_type: "unit",
    target_id: unit.id,
    previous_state: null,
    new_state: "active",
    reason: null,
    configuration_version: null,
    correlation_id: unit.id,
    result: "success",
  });

  refreshHealth(input.institution_id);
  return unit;
}

export function updateUnit(unitId: string, patch: Partial<OrganizationalUnit>, actorId: string) {
  const units = loadUnits();
  const idx = units.findIndex((u) => u.id === unitId);
  if (idx < 0) throw new Error("Unit not found.");
  const prev = units[idx];
  units[idx] = { ...prev, ...patch, updated_at: now() };
  persistUnits(units);
  recordOrgAudit({
    institution_id: prev.institution_id,
    unit_id_optional: unitId,
    actor_id: actorId,
    action: "organization.unit_updated",
    target_type: "unit",
    target_id: unitId,
    previous_state: prev.status,
    new_state: units[idx].status,
    reason: null,
    configuration_version: null,
    correlation_id: unitId,
    result: "success",
  });
  refreshHealth(prev.institution_id);
  return units[idx];
}

export function moveUnit(unitId: string, newParentId: string | null, actorId: string) {
  if (wouldCreateCycle(unitId, newParentId)) throw new Error("Move would create circular hierarchy.");
  const unit = getUnit(unitId);
  if (!unit) throw new Error("Unit not found.");
  if (newParentId) {
    const parent = getUnit(newParentId);
    if (!parent || parent.institution_id !== unit.institution_id) {
      throw new Error("Cannot move unit across institutions.");
    }
    const unitTypes = loadUnitTypes() as Array<{ key: string; allowed_parent_types: string[] }>;
    if (!validateParentChildType(parent.unit_type, unit.unit_type, unitTypes)) {
      throw new Error("Invalid parent-child unit type for move.");
    }
  }
  return updateUnit(unitId, { parent_unit_id: newParentId }, actorId);
}

export function archiveUnit(unitId: string, actorId: string) {
  const unit = getUnit(unitId);
  if (!unit) throw new Error("Unit not found.");
  const updated = updateUnit(unitId, { status: "archived", archived_at_optional: now() }, actorId);
  recordOrgAudit({
    institution_id: unit.institution_id,
    unit_id_optional: unitId,
    actor_id: actorId,
    action: "organization.unit_archived",
    target_type: "unit",
    target_id: unitId,
    previous_state: "active",
    new_state: "archived",
    reason: null,
    configuration_version: null,
    correlation_id: unitId,
    result: "success",
  });
  refreshHealth(unit.institution_id);
  return updated;
}

export function assignUnitOwner(unitId: string, ownerType: string, userId: string, actorId: string) {
  const unit = getUnit(unitId);
  if (!unit) throw new Error("Unit not found.");

  const owners = loadUnitOwners().filter((o) => !(o.unit_id === unitId && o.owner_type === ownerType && o.status === "active"));
  const assignment = {
    id: id("uown"),
    unit_id: unitId,
    owner_type: ownerType,
    user_id: userId,
    starts_at: now(),
    expires_at_optional: null,
    assigned_by: actorId,
    status: "active" as const,
  };
  owners.push(assignment);
  persistUnitOwners(owners);

  const units = loadUnits();
  const idx = units.findIndex((u) => u.id === unitId);
  if (idx >= 0 && ownerType === "primary") {
    units[idx] = { ...units[idx], primary_owner_user_id: userId, updated_at: now() };
    persistUnits(units);
  }

  recordOrgAudit({
    institution_id: unit.institution_id,
    unit_id_optional: unitId,
    actor_id: actorId,
    action: "organization.owner_assigned",
    target_type: "owner",
    target_id: assignment.id,
    previous_state: null,
    new_state: ownerType,
    reason: null,
    configuration_version: null,
    correlation_id: assignment.id,
    result: "success",
  });
  return assignment;
}

export function createLeadershipPosition(
  institutionId: string,
  unitId: string,
  positionKey: string,
  title: string,
  actorId: string,
  requiresCertification = false
) {
  const pos = {
    id: id("lpos"),
    institution_id: institutionId,
    unit_id: unitId,
    position_key: positionKey,
    title,
    description: "",
    role_id: positionKey,
    requires_certification: requiresCertification,
    status: "active" as const,
  };
  const positions = loadLeadershipPositions();
  positions.push(pos);
  persistLeadershipPositions(positions);

  const assignments = loadLeadershipAssignments();
  assignments.push({
    id: id("lassign"),
    position_id: pos.id,
    user_id: null,
    starts_at: now(),
    ends_at_optional: null,
    appointed_by: actorId,
    status: "vacant",
    succession_state: "recruiting",
    temporary: false,
  });
  persistLeadershipAssignments(assignments);
  return pos;
}

export function assignLeadership(positionId: string, userId: string, actorId: string) {
  const assignments = loadLeadershipAssignments();
  const idx = assignments.findIndex((a) => a.position_id === positionId);
  if (idx < 0) throw new Error("Leadership position not found.");
  assignments[idx] = {
    ...assignments[idx],
    user_id: userId,
    status: "filled",
    succession_state: "filled",
  };
  persistLeadershipAssignments(assignments);
  return assignments[idx];
}

export function mapWorkspace(
  unitId: string,
  workspaceId: string,
  institutionId: string,
  actorId: string,
  mappingType = "primary"
) {
  const unit = getUnit(unitId);
  if (!unit || unit.institution_id !== institutionId) {
    recordOrgAudit({
      institution_id: institutionId,
      unit_id_optional: unitId,
      actor_id: actorId,
      action: "organization.workspace_mapping_denied",
      target_type: "workspace_mapping",
      target_id: workspaceId,
      previous_state: null,
      new_state: "denied",
      reason: "Cross-institution workspace mapping",
      configuration_version: null,
      correlation_id: workspaceId,
      result: "denied",
    });
    throw new Error("Cross-institution workspace mapping is not allowed.");
  }

  const mappings = loadWorkspaceMappings();
  const mapping = {
    id: id("wmap"),
    unit_id: unitId,
    workspace_id: workspaceId,
    institution_id: institutionId,
    mapping_type: mappingType,
    purpose: "operational",
    is_primary: mappingType === "primary",
    status: "active" as const,
  };
  mappings.push(mapping);
  persistWorkspaceMappings(mappings);

  const units = loadUnits();
  const uIdx = units.findIndex((u) => u.id === unitId);
  if (uIdx >= 0) {
    units[uIdx] = { ...units[uIdx], workspace_id_optional: workspaceId, updated_at: now() };
    persistUnits(units);
  }

  recordOrgAudit({
    institution_id: institutionId,
    unit_id_optional: unitId,
    actor_id: actorId,
    action: "organization.workspace_mapped",
    target_type: "workspace_mapping",
    target_id: mapping.id,
    previous_state: null,
    new_state: workspaceId,
    reason: null,
    configuration_version: null,
    correlation_id: mapping.id,
    result: "success",
  });
  return mapping;
}

export function createSharedService(
  providerUnitId: string,
  recipientUnitId: string,
  institutionId: string,
  serviceType: string,
  owner: string,
  actorId: string
) {
  const services = loadSharedServices();
  const svc = {
    id: id("ssvc"),
    provider_unit_id: providerUnitId,
    recipient_unit_id: recipientUnitId,
    institution_id: institutionId,
    service_type: serviceType,
    service_level: "standard",
    owner,
    status: "active" as const,
    starts_at: now(),
  };
  services.push(svc);
  persistSharedServices(services);
  recordOrgAudit({
    institution_id: institutionId,
    unit_id_optional: providerUnitId,
    actor_id: actorId,
    action: "organization.shared_service_created",
    target_type: "shared_service",
    target_id: svc.id,
    previous_state: null,
    new_state: serviceType,
    reason: null,
    configuration_version: null,
    correlation_id: svc.id,
    result: "success",
  });
  return svc;
}

export function assignUnitRole(
  unitId: string,
  userId: string,
  roleId: string,
  actorId: string,
  inheritanceMode: "unit_only" | "reporting_access_only" = "unit_only"
) {
  const unit = getUnit(unitId);
  if (!unit) throw new Error("Unit not found.");
  const assignments = loadRoleAssignments();
  const assignment = {
    id: id("urole"),
    user_id: userId,
    unit_id: unitId,
    role_id: roleId,
    starts_at: now(),
    expires_at_optional: null,
    assigned_by: actorId,
    status: "active" as const,
    inheritance_mode: inheritanceMode,
  };
  assignments.push(assignment);
  persistRoleAssignments(assignments);
  recordOrgAudit({
    institution_id: unit.institution_id,
    unit_id_optional: unitId,
    actor_id: actorId,
    action: "organization.role_assigned",
    target_type: "role_assignment",
    target_id: assignment.id,
    previous_state: null,
    new_state: roleId,
    reason: null,
    configuration_version: null,
    correlation_id: assignment.id,
    result: "success",
  });
  return assignment;
}

export function addApprovalPath(unitId: string, actionType: string, requiredRole: string) {
  const paths = loadApprovalPaths();
  const path = {
    id: id("apath"),
    unit_id: unitId,
    action_type: actionType,
    step_number: paths.filter((p) => p.unit_id === unitId && p.action_type === actionType).length + 1,
    required_role: requiredRole,
    minimum_approvals: 1,
    status: "active" as const,
  };
  paths.push(path);
  persistApprovalPaths(paths);
  return path;
}

export function addEscalationPath(sourceUnitId: string, issueType: string, targetUnitId: string, targetRoleId: string) {
  const paths = loadEscalationPaths();
  const path = {
    id: id("epath"),
    source_unit_id: sourceUnitId,
    issue_type: issueType,
    target_unit_id: targetUnitId,
    target_role_id: targetRoleId,
    status: "active" as const,
  };
  paths.push(path);
  persistEscalationPaths(paths);
  return path;
}

export function previewTemplate(institutionId: string, templateId: string) {
  const template = loadConfigurationTemplates().find((t) => t.id === templateId);
  if (!template) throw new Error("Template not found.");
  const structure = template.unit_structure as Array<{ key: string; name: string; unit_type: string; parent_key: string | null }>;
  return {
    template,
    proposed_units: structure.length,
    unit_preview: structure,
    existing_units: listInstitutionUnits(institutionId).length,
    requires_confirmation: true,
  };
}

export function applyConfigurationTemplate(input: ApplyTemplateInput) {
  const flags = assertOrgEnabled();
  if (!flags.ORGANIZATIONAL_TEMPLATES_ENABLED) throw new Error("Organizational templates are not enabled.");

  const template = loadConfigurationTemplates().find((t) => t.id === input.template_id);
  if (!template) throw new Error("Template not found.");

  const structure = template.unit_structure as Array<{ key: string; name: string; unit_type: string; parent_key: string | null }>;
  const keyToId = new Map<string, string>();

  for (const node of structure) {
    const parentId = node.parent_key ? keyToId.get(node.parent_key) ?? null : null;
    const unit = createUnit(
      {
        institution_id: input.institution_id,
        parent_unit_id: parentId,
        unit_type: node.unit_type,
        name: node.name,
        purpose: `${node.name} — from template ${template.name}`,
        primary_owner_user_id: input.actor_id,
      },
      input.actor_id
    );
    keyToId.set(node.key, unit.id);
  }

  if (input.campus_units) {
    for (const campus of input.campus_units) {
      const parentId = keyToId.get(campus.parent_region_key);
      if (!parentId) continue;
      const campusUnit = createUnit(
        {
          institution_id: input.institution_id,
          parent_unit_id: parentId,
          unit_type: "campus",
          name: campus.name,
          primary_owner_user_id: campus.owner,
        },
        input.actor_id
      );
      keyToId.set(slugify(campus.name), campusUnit.id);
      const chapter = createUnit(
        {
          institution_id: input.institution_id,
          parent_unit_id: campusUnit.id,
          unit_type: "chapter",
          name: `${campus.name} Chapter`,
          primary_owner_user_id: campus.owner,
        },
        input.actor_id
      );
      createLeadershipPosition(input.institution_id, chapter.id, "campus_president", "Campus President", input.actor_id, true);
      mapWorkspace(chapter.id, `ws-${slugify(campus.name)}`, input.institution_id, input.actor_id);
    }
  }

  const trainingKey = keyToId.get("training_dept");
  if (trainingKey && flags.ORGANIZATIONAL_SHARED_SERVICES_ENABLED) {
    const campuses = listInstitutionUnits(input.institution_id).filter((u) => u.unit_type === "campus");
    for (const campus of campuses) {
      createSharedService(trainingKey, campus.id, input.institution_id, "training", input.actor_id, input.actor_id);
    }
    mapWorkspace(trainingKey, "ws-statewide-training", input.institution_id, input.actor_id, "shared");
  }

  const drafts = loadConfigurationDrafts();
  const draft: ConfigurationDraft = {
    id: id("cdraft"),
    institution_id: input.institution_id,
    template_id: input.template_id,
    base_configuration_version: 0,
    proposed_changes: `Applied template ${template.name}`,
    status: "draft",
    effective_at: null,
    created_by: input.actor_id,
    created_at: now(),
    submitted_at_optional: null,
    approved_at_optional: null,
  };
  drafts.push(draft);
  persistConfigurationDrafts(drafts);

  for (const unit of listInstitutionUnits(input.institution_id).filter((u) => u.unit_type === "chapter")) {
    addApprovalPath(unit.id, "public_content", "content_publisher");
    addApprovalPath(unit.id, "restricted_export", "data_steward");
  }

  const campuses = listInstitutionUnits(input.institution_id).filter((u) => u.unit_type === "campus");
  for (const campus of campuses) {
    const region = getAncestors(campus.id).find((a) => a.unit_type === "region");
    if (region) {
      addEscalationPath(campus.id, "operational", region.id, "regional_organizer");
    }
  }

  const firstRegion = listInstitutionUnits(input.institution_id).find((u) => u.unit_type === "region");
  if (firstRegion) {
    assignUnitRole(firstRegion.id, input.actor_id, "regional_organizer", input.actor_id, "reporting_access_only");
  }

  recordOrgAudit({
    institution_id: input.institution_id,
    unit_id_optional: null,
    actor_id: input.actor_id,
    action: "organization.template_applied",
    target_type: "configuration_draft",
    target_id: draft.id,
    previous_state: null,
    new_state: "draft",
    reason: template.name as string,
    configuration_version: null,
    correlation_id: draft.id,
    result: "success",
  });

  refreshHealth(input.institution_id);
  return { draft, units_created: listInstitutionUnits(input.institution_id).length, key_to_id: Object.fromEntries(keyToId) };
}

export function submitConfigurationDraft(draftId: string, actorId: string) {
  const drafts = loadConfigurationDrafts();
  const idx = drafts.findIndex((d) => d.id === draftId);
  if (idx < 0) throw new Error("Draft not found.");
  drafts[idx] = { ...drafts[idx], status: "validation", submitted_at_optional: now() };
  persistConfigurationDrafts(drafts);
  const validation = validateOrganizationConfiguration(drafts[idx].institution_id, actorId);
  if (validation.status === "blocked") {
    drafts[idx] = { ...drafts[idx], status: "changes_requested" };
    persistConfigurationDrafts(drafts);
  } else {
    drafts[idx] = { ...drafts[idx], status: "review" };
    persistConfigurationDrafts(drafts);
  }
  return { draft: drafts[idx], validation };
}

export function approveConfigurationDraft(draftId: string, actorId: string, effectiveAt?: string) {
  const drafts = loadConfigurationDrafts();
  const idx = drafts.findIndex((d) => d.id === draftId);
  if (idx < 0) throw new Error("Draft not found.");
  drafts[idx] = {
    ...drafts[idx],
    status: "approved",
    approved_at_optional: now(),
    effective_at: effectiveAt ?? now(),
  };
  persistConfigurationDrafts(drafts);
  recordOrgAudit({
    institution_id: drafts[idx].institution_id,
    unit_id_optional: null,
    actor_id: actorId,
    action: "organization.configuration_approved",
    target_type: "configuration_draft",
    target_id: draftId,
    previous_state: "review",
    new_state: "approved",
    reason: null,
    configuration_version: null,
    correlation_id: draftId,
    result: "success",
  });
  return drafts[idx];
}

export function activateConfiguration(draftId: string, actorId: string): OrganizationConfigurationVersion {
  const drafts = loadConfigurationDrafts();
  const draft = drafts.find((d) => d.id === draftId);
  if (!draft || draft.status !== "approved") throw new Error("Draft must be approved before activation.");

  const versions = loadConfigurationVersions().filter((v) => v.institution_id === draft.institution_id);
  const nextVersion = versions.length ? Math.max(...versions.map((v) => v.version_number)) + 1 : 1;

  for (const v of versions.filter((v) => v.status === "active")) {
    v.status = "superseded";
  }
  persistConfigurationVersions(versions);

  const snapshot = JSON.stringify(buildStructureTree(draft.institution_id));
  const version: OrganizationConfigurationVersion = {
    id: id("ocver"),
    institution_id: draft.institution_id,
    version_number: nextVersion,
    effective_at: draft.effective_at ?? now(),
    created_by: draft.created_by,
    approved_by: actorId,
    change_summary: draft.proposed_changes,
    structure_snapshot_reference: `snapshot-v${nextVersion}`,
    status: new Date(draft.effective_at ?? now()) > new Date() ? "scheduled" : "active",
  };
  versions.push(version);
  persistConfigurationVersions(versions);

  const dIdx = drafts.findIndex((d) => d.id === draftId);
  drafts[dIdx] = { ...drafts[dIdx], status: "active" };
  persistConfigurationDrafts(drafts);

  recordOrgAudit({
    institution_id: draft.institution_id,
    unit_id_optional: null,
    actor_id: actorId,
    action: "organization.configuration_activated",
    target_type: "configuration_version",
    target_id: version.id,
    previous_state: String(nextVersion - 1),
    new_state: String(nextVersion),
    reason: snapshot.slice(0, 100),
    configuration_version: nextVersion,
    correlation_id: version.id,
    result: "success",
  });

  refreshHealth(draft.institution_id);
  return version;
}

export function createReorganization(
  institutionId: string,
  name: string,
  reason: string,
  affectedUnits: string[],
  actorId: string
): ReorganizationPlan {
  const flags = assertOrgEnabled();
  if (!flags.ORGANIZATIONAL_REORGANIZATION_ENABLED) throw new Error("Reorganization is not enabled.");

  const versions = loadConfigurationVersions().filter((v) => v.institution_id === institutionId);
  const current = versions.find((v) => v.status === "active")?.version_number ?? 0;

  const plan: ReorganizationPlan = {
    id: id("reorg"),
    institution_id: institutionId,
    name,
    reason,
    current_version: current,
    proposed_version: current + 1,
    effective_at: now(),
    affected_units: affectedUnits,
    status: "draft",
    created_by: actorId,
  };
  const plans = loadReorganizations();
  plans.push(plan);
  persistReorganizations(plans);
  return plan;
}

export function previewReorganization(planId: string): ReorganizationPreview {
  const plans = loadReorganizations();
  const plan = plans.find((p) => p.id === planId);
  if (!plan) throw new Error("Reorganization plan not found.");

  const preview: ReorganizationPreview = {
    units_created: 0,
    units_archived: plan.affected_units.length > 0 ? 0 : 0,
    members_reassigned: 0,
    leadership_assignments_changed: 0,
    workspace_mappings_changed: plan.affected_units.length,
    approval_paths_affected: plan.affected_units.length,
    historical_records_rewritten: 0,
    blocking_issues: [],
  };

  const idx = plans.findIndex((p) => p.id === planId);
  plans[idx] = { ...plan, status: "preview", preview };
  persistReorganizations(plans);
  return preview;
}

export function executeReorganization(planId: string, moveOperations: Array<{ unit_id: string; new_parent_id: string }>, actorId: string) {
  const plans = loadReorganizations();
  const plan = plans.find((p) => p.id === planId);
  if (!plan) throw new Error("Plan not found.");

  for (const op of moveOperations) {
    moveUnit(op.unit_id, op.new_parent_id, actorId);
  }

  const versions = loadConfigurationVersions().filter((v) => v.institution_id === plan.institution_id);
  const prevActive = versions.find((v) => v.status === "active");
  if (prevActive) prevActive.status = "superseded";

  const newVersion: OrganizationConfigurationVersion = {
    id: id("ocver"),
    institution_id: plan.institution_id,
    version_number: plan.proposed_version,
    effective_at: plan.effective_at,
    created_by: actorId,
    approved_by: actorId,
    change_summary: plan.reason,
    structure_snapshot_reference: `reorg-${plan.id}`,
    status: "active",
  };
  versions.push(newVersion);
  persistConfigurationVersions(versions);

  const idx = plans.findIndex((p) => p.id === planId);
  plans[idx] = { ...plan, status: "executed" };
  persistReorganizations(plans);

  recordOrgAudit({
    institution_id: plan.institution_id,
    unit_id_optional: null,
    actor_id: actorId,
    action: "organization.reorganization_completed",
    target_type: "reorganization",
    target_id: planId,
    previous_state: String(plan.current_version),
    new_state: String(plan.proposed_version),
    reason: plan.reason,
    configuration_version: plan.proposed_version,
    correlation_id: planId,
    result: "success",
  });

  refreshHealth(plan.institution_id);
  return { plan: plans[idx], version: newVersion };
}

function refreshHealth(institutionId: string) {
  const units = listInstitutionUnits(institutionId);
  const owners = loadUnitOwners();
  const assignments = loadLeadershipAssignments();
  const positions = loadLeadershipPositions().filter((p) => p.institution_id === institutionId);
  const validations = loadValidations().filter((v) => v.institution_id === institutionId);
  const latestValidation = validations.sort((a, b) => b.validated_at.localeCompare(a.validated_at))[0];
  const reorgs = loadReorganizations().filter((r) => r.institution_id === institutionId && ["draft", "preview", "submitted"].includes(r.status));

  const ownerless = units.filter(
    (u) => u.status === "active" && !u.primary_owner_user_id && !owners.some((o) => o.unit_id === u.id && o.status === "active")
  ).length;

  const vacancies = positions.filter((p) => {
    const a = assignments.find((x) => x.position_id === p.id);
    return !a || a.status === "vacant";
  }).length;

  const health: OrganizationHealth = {
    active_units: units.filter((u) => u.status === "active").length,
    campuses: units.filter((u) => u.unit_type === "campus").length,
    chapters: units.filter((u) => u.unit_type === "chapter").length,
    departments: units.filter((u) => u.unit_type === "department").length,
    ownerless_units: ownerless,
    leadership_vacancies: vacancies,
    configuration_warnings: latestValidation?.warnings.length ?? 0,
    pending_reorganizations: reorgs.length,
    structure_validation: latestValidation?.status ?? "not_run",
  };
  persistHealth(health);
  return health;
}

export function getOrganizationHealth(institutionId?: string): OrganizationHealth {
  if (institutionId) refreshHealth(institutionId);
  return loadHealth();
}

export function listUnitOwners(unitId: string) {
  return loadUnitOwners().filter((o) => o.unit_id === unitId);
}

export function listUnitLeadership(unitId: string) {
  const positions = loadLeadershipPositions().filter((p) => p.unit_id === unitId);
  const assignments = loadLeadershipAssignments();
  return positions.map((p) => ({
    position: p,
    assignment: assignments.find((a) => a.position_id === p.id) ?? null,
  }));
}

export function listUnitMembers(unitId: string) {
  return loadMemberships().filter((m) => m.unit_id === unitId && m.status === "active");
}

export function listUnitRoles(unitId: string) {
  return loadRoleAssignments().filter((r) => r.unit_id === unitId && r.status === "active");
}

export function listUnitWorkspaces(unitId: string) {
  return loadWorkspaceMappings().filter((m) => m.unit_id === unitId);
}

export function getInstitutionStructure(institutionId: string) {
  return {
    tree: buildStructureTree(institutionId),
    units: listInstitutionUnits(institutionId),
    health: refreshHealth(institutionId),
  };
}

export function listAuditEvents(institutionId?: string) {
  const events = loadAuditEvents();
  if (institutionId) return events.filter((e) => e.institution_id === institutionId);
  return events.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export { getUnit, getAncestors, getDescendants, listInstitutionUnits, validateOrganizationConfiguration };
