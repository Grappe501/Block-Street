import {
  loadFeatureFlags,
  loadHealth,
  persistHealth,
  loadInstitutionTypes,
  loadTemplates,
  loadSecurityBaselines,
  loadInstitutions,
  persistInstitutions,
  loadRequests,
  persistRequests,
  loadRiskAssessments,
  persistRiskAssessments,
  loadOwnerAssignments,
  persistOwnerAssignments,
  loadWorkspaces,
  persistWorkspaces,
  loadModules,
  persistModules,
  loadSecurityProfiles,
  persistSecurityProfiles,
  loadDeploymentProfiles,
  persistDeploymentProfiles,
  loadCheckpoints,
  persistCheckpoints,
  loadAuditEvents,
  loadValidations,
} from "./data";
import { recordAudit } from "./audit";
import { classifyRisk } from "./risk";
import { validateInstitution } from "./validate";
import type {
  CreateRequestInput,
  Institution,
  InstitutionModule,
  InstitutionOwnerAssignment,
  InstitutionProvisioningRequest,
  InstitutionTypeRecord,
  ProvisioningAttentionItem,
  ProvisioningHealth,
  ProvisioningTemplate,
  RequestStatus,
  OwnerType,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function publicId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32);
}

function assertEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.INSTITUTION_PROVISIONING_ENABLED) throw new Error("Institution provisioning is not enabled.");
  return flags;
}

export function listInstitutionTypes(): InstitutionTypeRecord[] {
  return loadInstitutionTypes();
}

export function listTemplates(): ProvisioningTemplate[] {
  return loadTemplates().filter((t) => t.status === "published");
}

export function getTemplate(templateId: string) {
  return loadTemplates().find((t) => t.id === templateId) ?? null;
}

export function listRequests(filters?: { status?: RequestStatus }) {
  let items = loadRequests();
  if (filters?.status) items = items.filter((r) => r.status === filters.status);
  return items.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getRequest(requestId: string) {
  return loadRequests().find((r) => r.id === requestId) ?? null;
}

export function detectDuplicates(name: string, executiveSponsor: string): boolean {
  const norm = name.trim().toLowerCase();
  const institutions = loadInstitutions();
  const requests = loadRequests();
  return (
    institutions.some((i) => i.name.toLowerCase() === norm) ||
    requests.some(
      (r) =>
        r.requested_name.toLowerCase() === norm &&
        !["rejected", "withdrawn", "expired"].includes(r.status)
    ) ||
    institutions.some((i) => i.executive_owner_user_id === executiveSponsor && i.name.toLowerCase().includes(norm.split(" ")[0]))
  );
}

export function createRequest(input: CreateRequestInput): InstitutionProvisioningRequest {
  const flags = assertEnabled();
  if (!flags.INSTITUTION_REQUESTS_ENABLED) throw new Error("Institution requests are not enabled.");

  const duplicate = detectDuplicates(input.requested_name, input.executive_sponsor);
  const type = loadInstitutionTypes().find((t) => t.key === input.institution_type);

  const request: InstitutionProvisioningRequest = {
    id: id("req"),
    requested_name: input.requested_name.trim(),
    institution_type: input.institution_type,
    requesting_user_id: input.requesting_user_id,
    sponsoring_organization_optional: input.sponsoring_organization_optional ?? null,
    purpose: input.purpose,
    intended_users: input.intended_users ?? 50,
    intended_regions: input.intended_regions ?? ["Arkansas"],
    requested_modules: input.requested_modules ?? type?.default_module_set ?? [],
    anticipated_data_types: input.anticipated_data_types ?? [],
    requested_integrations: input.requested_integrations ?? [],
    target_launch_date: input.target_launch_date ?? null,
    executive_sponsor: input.executive_sponsor,
    security_contact: input.security_contact,
    support_contact: input.support_contact,
    data_owner_contact: input.data_owner_contact,
    administrative_owner_contact: input.administrative_owner_contact,
    risk_notes: input.risk_notes ?? "",
    status: "draft",
    risk_level: null,
    template_id: type?.default_template_id ?? null,
    institution_id: null,
    duplicate_review_required: duplicate,
    created_at: now(),
    submitted_at: null,
    updated_at: now(),
  };

  const items = loadRequests();
  items.push(request);
  persistRequests(items);

  recordAudit({
    institution_id: null,
    request_id_optional: request.id,
    actor_id: input.requesting_user_id,
    action: "institution.requested",
    target_type: "request",
    target_id_optional: request.id,
    previous_state: null,
    new_state: "draft",
    reason: duplicate ? "Duplicate review flagged" : null,
    correlation_id: request.id,
    result: "success",
  });

  return request;
}

export function updateRequest(requestId: string, patch: Partial<CreateRequestInput>, actorId: string) {
  const items = loadRequests();
  const idx = items.findIndex((r) => r.id === requestId);
  if (idx < 0) throw new Error("Request not found.");
  const current = items[idx];
  if (!["draft", "changes_requested"].includes(current.status)) {
    throw new Error("Request cannot be edited in current status.");
  }

  items[idx] = {
    ...current,
    ...patch,
    requested_name: patch.requested_name?.trim() ?? current.requested_name,
    updated_at: now(),
  };
  persistRequests(items);
  recordAudit({
    institution_id: null,
    request_id_optional: requestId,
    actor_id: actorId,
    action: "institution.request_updated",
    target_type: "request",
    target_id_optional: requestId,
    previous_state: current.status,
    new_state: current.status,
    reason: null,
    correlation_id: requestId,
    result: "success",
  });
  return items[idx];
}

export function submitRequest(requestId: string, actorId: string) {
  const items = loadRequests();
  const idx = items.findIndex((r) => r.id === requestId);
  if (idx < 0) throw new Error("Request not found.");
  const req = items[idx];
  if (req.status !== "draft" && req.status !== "changes_requested") {
    throw new Error("Only draft requests can be submitted.");
  }

  const risk = classifyRisk(req);
  const assessment = {
    id: id("risk"),
    request_id: requestId,
    risk_level: risk.risk_level,
    risk_factors: risk.risk_factors,
    required_controls: risk.required_controls,
    required_approvals: risk.required_approvals,
    required_training: risk.required_training,
    required_security_review: risk.required_security_review,
    required_data_review: risk.required_data_review,
    recommended_template:
      loadInstitutionTypes().find((t) => t.key === req.institution_type)?.default_template_id ?? "",
    reviewed_by: "system",
    reviewed_at: now(),
  };

  const risks = loadRiskAssessments();
  risks.push(assessment);
  persistRiskAssessments(risks);

  items[idx] = {
    ...req,
    status: "submitted",
    submitted_at: now(),
    updated_at: now(),
    risk_level: risk.risk_level,
  };
  persistRequests(items);

  items[idx] = { ...items[idx], status: "under_review", updated_at: now() };
  persistRequests(items);

  recordAudit({
    institution_id: null,
    request_id_optional: requestId,
    actor_id: actorId,
    action: "institution.request_review_started",
    target_type: "request",
    target_id_optional: requestId,
    previous_state: "draft",
    new_state: "under_review",
    reason: `Risk ${risk.risk_level}`,
    correlation_id: assessment.id,
    result: "success",
  });

  return { request: items[idx], assessment };
}

export function approveRequest(requestId: string, actorId: string, templateId?: string) {
  const items = loadRequests();
  const idx = items.findIndex((r) => r.id === requestId);
  if (idx < 0) throw new Error("Request not found.");
  const req = items[idx];
  if (req.status !== "under_review" && req.status !== "submitted") {
    throw new Error("Request is not ready for approval.");
  }

  items[idx] = {
    ...req,
    status: "approved",
    template_id: templateId ?? req.template_id,
    updated_at: now(),
  };
  persistRequests(items);

  recordAudit({
    institution_id: null,
    request_id_optional: requestId,
    actor_id: actorId,
    action: "institution.request_approved",
    target_type: "request",
    target_id_optional: requestId,
    previous_state: req.status,
    new_state: "approved",
    reason: null,
    correlation_id: requestId,
    result: "success",
  });

  return items[idx];
}

export function rejectRequest(requestId: string, actorId: string, reason: string) {
  const items = loadRequests();
  const idx = items.findIndex((r) => r.id === requestId);
  if (idx < 0) throw new Error("Request not found.");
  items[idx] = { ...items[idx], status: "rejected", updated_at: now() };
  persistRequests(items);
  recordAudit({
    institution_id: null,
    request_id_optional: requestId,
    actor_id: actorId,
    action: "institution.request_rejected",
    target_type: "request",
    target_id_optional: requestId,
    previous_state: items[idx].status,
    new_state: "rejected",
    reason,
    correlation_id: requestId,
    result: "success",
  });
  return items[idx];
}

const OWNER_MAP: Record<OwnerType, keyof Institution> = {
  executive: "executive_owner_user_id",
  administrative: "administrative_owner_user_id",
  security: "security_owner_user_id",
  data: "data_owner_user_id",
  support: "support_owner_user_id",
};

export function assignOwner(
  institutionId: string,
  ownerType: OwnerType,
  userId: string,
  assignedBy: string
): InstitutionOwnerAssignment {
  const assignment: InstitutionOwnerAssignment = {
    id: id("own"),
    institution_id: institutionId,
    owner_type: ownerType,
    user_id: userId,
    starts_at: now(),
    expires_at_optional: null,
    assigned_by: assignedBy,
    approved_by_optional: assignedBy,
    status: "active",
  };

  const assignments = loadOwnerAssignments().filter(
    (a) => !(a.institution_id === institutionId && a.owner_type === ownerType && a.status === "active")
  );
  assignments.push(assignment);
  persistOwnerAssignments(assignments);

  const institutions = loadInstitutions();
  const idx = institutions.findIndex((i) => i.id === institutionId);
  if (idx >= 0) {
    const field = OWNER_MAP[ownerType];
    institutions[idx] = { ...institutions[idx], [field]: userId };
    persistInstitutions(institutions);
  }

  const workspaces = loadWorkspaces();
  const roleMap: Record<OwnerType, string> = {
    executive: "institution_executive",
    administrative: "institution_administrator",
    security: "security_administrator",
    data: "data_steward",
    support: "support_lead",
  };
  for (const ws of workspaces) {
    if (ws.institution_id === institutionId && ws.owner_role === roleMap[ownerType]) {
      ws.owner_user_id = userId;
    }
  }
  persistWorkspaces(workspaces);

  recordAudit({
    institution_id: institutionId,
    request_id_optional: null,
    actor_id: assignedBy,
    action: "institution.owner_assigned",
    target_type: "owner",
    target_id_optional: assignment.id,
    previous_state: null,
    new_state: ownerType,
    reason: null,
    correlation_id: assignment.id,
    result: "success",
  });

  return assignment;
}

export function runProvisioning(requestId: string, actorId: string): Institution {
  assertEnabled();
  const req = getRequest(requestId);
  if (!req) throw new Error("Request not found.");
  if (req.status !== "approved") throw new Error("Request must be approved before provisioning.");
  if (req.institution_id) {
    const existing = loadInstitutions().find((i) => i.id === req.institution_id);
    if (existing) return resumeProvisioning(existing.id, actorId);
  }

  const template = getTemplate(req.template_id ?? "");
  if (!template) throw new Error("Provisioning template not found.");

  const institutionId = id("inst");
  const orgId = id("org");

  const institution: Institution = {
    id: institutionId,
    public_id: publicId(req.requested_name),
    name: req.requested_name,
    legal_name_optional: null,
    display_name: req.requested_name,
    institution_type: req.institution_type,
    status: "provisioning",
    launch_stage: "provisioning",
    primary_domain_optional: null,
    primary_contact_user_id: req.requesting_user_id,
    executive_owner_user_id: null,
    administrative_owner_user_id: null,
    security_owner_user_id: null,
    data_owner_user_id: null,
    support_owner_user_id: null,
    default_timezone: "America/Chicago",
    default_locale: "en-US",
    data_region: "us-central",
    retention_policy_id: "institutional_standard",
    security_policy_id: template.default_security_policy,
    notification_policy_id: "standard_with_quiet_hours",
    deployment_model: "shared_multi_tenant",
    template_id: template.id,
    template_version: template.version,
    request_id: requestId,
    organization_id: orgId,
    progress_percent: 10,
    checkpoint: "institution_created",
    created_at: now(),
    approved_at_optional: now(),
    activated_at_optional: null,
    suspended_at_optional: null,
    archived_at_optional: null,
  };

  const institutions = loadInstitutions();
  institutions.push(institution);
  persistInstitutions(institutions);

  const requests = loadRequests();
  const rIdx = requests.findIndex((r) => r.id === requestId);
  if (rIdx >= 0) {
    requests[rIdx] = { ...requests[rIdx], institution_id: institutionId, updated_at: now() };
    persistRequests(requests);
  }

  recordAudit({
    institution_id: institutionId,
    request_id_optional: requestId,
    actor_id: actorId,
    action: "institution.provisioning_started",
    target_type: "institution",
    target_id_optional: institutionId,
    previous_state: null,
    new_state: "provisioning",
    reason: null,
    correlation_id: institutionId,
    result: "success",
  });

  assignOwner(institutionId, "executive", req.executive_sponsor, actorId);
  assignOwner(institutionId, "administrative", req.administrative_owner_contact, actorId);
  assignOwner(institutionId, "security", req.security_contact, actorId);
  assignOwner(institutionId, "data", req.data_owner_contact, actorId);
  assignOwner(institutionId, "support", req.support_contact, actorId);

  const baselines = loadSecurityBaselines();
  const baseline = baselines.find((b) => b.id === template.default_security_policy) ?? baselines[0];
  const profiles = loadSecurityProfiles();
  profiles.push({
    id: id("sec"),
    institution_id: institutionId,
    baseline_version: String(baseline.version),
    baseline_id: String(baseline.id),
    mfa_policy: String(baseline.mfa_policy),
    session_policy: String(baseline.session_policy),
    export_policy: String(baseline.export_policy),
    integration_policy: String(baseline.integration_policy),
    ai_policy: String(baseline.ai_policy),
    status: "applied",
    applied_at: now(),
  });
  persistSecurityProfiles(profiles);

  recordAudit({
    institution_id: institutionId,
    request_id_optional: requestId,
    actor_id: actorId,
    action: "institution.security_baseline_applied",
    target_type: "security_profile",
    target_id_optional: institutionId,
    previous_state: null,
    new_state: "applied",
    reason: null,
    correlation_id: institutionId,
    result: "success",
  });

  const deployments = loadDeploymentProfiles();
  deployments.push({
    id: id("dpl"),
    institution_id: institutionId,
    deployment_model: "shared_multi_tenant",
    application_targets: ["block-street-netlify"],
    database_target: "json-bootstrap",
    storage_target: "us-central",
    environment_ids: ["pilot"],
    domain_configuration: {
      platform_subdomain: `${institution.public_id}.platform.block-street.local`,
      admin_subdomain: `admin.${institution.public_id}.platform.block-street.local`,
    },
    release_channel: "pilot",
    status: "configured",
  });
  persistDeploymentProfiles(deployments);

  const workspaceRecords = template.default_workspaces.map((ws) => {
    const ownerAssignment = loadOwnerAssignments().find(
      (a) => a.institution_id === institutionId && a.owner_type === mapRoleToOwner(ws.owner_role)
    );
    return {
      id: id("ws"),
      institution_id: institutionId,
      key: ws.key,
      name: ws.name,
      type: ws.type,
      purpose: ws.purpose,
      owner_user_id: ownerAssignment?.user_id ?? null,
      owner_role: ws.owner_role,
      module_access: template.default_modules.map((m) => m.key),
      security_scope: "institutional",
      data_classification: "internal",
      launch_state: ws.type === "pilot" ? "pilot" : "provisioning",
      status: "created" as const,
    };
  });
  const allWs = loadWorkspaces();
  allWs.push(...workspaceRecords);
  persistWorkspaces(allWs);

  for (const ws of workspaceRecords) {
    recordAudit({
      institution_id: institutionId,
      request_id_optional: requestId,
      actor_id: actorId,
      action: "institution.workspace_created",
      target_type: "workspace",
      target_id_optional: ws.id,
      previous_state: null,
      new_state: ws.key,
      reason: null,
      correlation_id: ws.id,
      result: "success",
    });
  }

  const moduleRecords = template.default_modules.map((m) => ({
    id: id("mod"),
    institution_id: institutionId,
    module_key: m.key,
    status: m.status as InstitutionModule["status"],
    activation_stage: m.status === "restricted" ? "gated" : "provisioned",
    feature_flag_reference: template.default_feature_flags[m.key] ?? null,
    approved_by: actorId,
    activated_at_optional: m.status === "provisioned" ? now() : null,
  }));
  const allMod = loadModules();
  allMod.push(...moduleRecords);
  persistModules(allMod);

  for (const m of moduleRecords) {
    recordAudit({
      institution_id: institutionId,
      request_id_optional: requestId,
      actor_id: actorId,
      action: "institution.module_provisioned",
      target_type: "module",
      target_id_optional: m.id,
      previous_state: null,
      new_state: m.module_key,
      reason: null,
      correlation_id: m.id,
      result: "success",
    });
  }

  const cps = loadCheckpoints().filter((c) => c.institution_id !== institutionId);
  cps.push({
    institution_id: institutionId,
    step: "resources_created",
    completed_steps: ["institution_created", "owners_assigned", "security_baseline", "workspaces", "modules"],
    paused: false,
    updated_at: now(),
  });
  persistCheckpoints(cps);

  const updated = loadInstitutions();
  const iIdx = updated.findIndex((i) => i.id === institutionId);
  if (iIdx >= 0) {
    updated[iIdx] = {
      ...updated[iIdx],
      status: "validation",
      launch_stage: "validation",
      progress_percent: 85,
      checkpoint: "resources_created",
    };
    persistInstitutions(updated);
  }

  return updated[iIdx];
}

function mapRoleToOwner(role: string): OwnerType {
  if (role.includes("executive")) return "executive";
  if (role.includes("security")) return "security";
  if (role.includes("support") || role.includes("training")) return "support";
  if (role.includes("data")) return "data";
  return "administrative";
}

export function resumeProvisioning(institutionId: string, actorId: string): Institution {
  const checkpoints = loadCheckpoints();
  const cp = checkpoints.find((c) => c.institution_id === institutionId);
  if (!cp) throw new Error("No checkpoint found.");
  if (!cp.paused) {
    const inst = loadInstitutions().find((i) => i.id === institutionId);
    if (!inst) throw new Error("Institution not found.");
    return inst;
  }
  cp.paused = false;
  cp.updated_at = now();
  persistCheckpoints(checkpoints);
  recordAudit({
    institution_id: institutionId,
    request_id_optional: null,
    actor_id: actorId,
    action: "institution.provisioning_resumed",
    target_type: "institution",
    target_id_optional: institutionId,
    previous_state: "paused",
    new_state: cp.step,
    reason: null,
    correlation_id: institutionId,
    result: "success",
  });
  const inst = loadInstitutions().find((i) => i.id === institutionId);
  if (!inst) throw new Error("Institution not found.");
  return inst;
}

export function pauseProvisioning(institutionId: string, actorId: string, reason: string) {
  const institutions = loadInstitutions();
  const idx = institutions.findIndex((i) => i.id === institutionId);
  if (idx < 0) throw new Error("Institution not found.");
  institutions[idx] = { ...institutions[idx], status: "paused", launch_stage: "paused" };
  persistInstitutions(institutions);
  const cps = loadCheckpoints();
  const cp = cps.find((c) => c.institution_id === institutionId);
  if (cp) {
    cp.paused = true;
    cp.updated_at = now();
    persistCheckpoints(cps);
  }
  recordAudit({
    institution_id: institutionId,
    request_id_optional: institutions[idx].request_id,
    actor_id: actorId,
    action: "institution.provisioning_paused",
    target_type: "institution",
    target_id_optional: institutionId,
    previous_state: institutions[idx].status,
    new_state: "paused",
    reason,
    correlation_id: institutionId,
    result: "success",
  });
  return institutions[idx];
}

export function getInstitution(institutionId: string) {
  return loadInstitutions().find((i) => i.id === institutionId) ?? null;
}

export function getInstitutionProvisioning(institutionId: string) {
  const institution = getInstitution(institutionId);
  if (!institution) return null;
  return {
    institution,
    owners: loadOwnerAssignments().filter((o) => o.institution_id === institutionId),
    workspaces: loadWorkspaces().filter((w) => w.institution_id === institutionId),
    modules: loadModules().filter((m) => m.institution_id === institutionId),
    security_profile: loadSecurityProfiles().find((s) => s.institution_id === institutionId) ?? null,
    deployment_profile: loadDeploymentProfiles().find((d) => d.institution_id === institutionId) ?? null,
    checkpoint: loadCheckpoints().find((c) => c.institution_id === institutionId) ?? null,
    latest_validation: loadValidations()
      .filter((v) => v.institution_id === institutionId)
      .sort((a, b) => b.validated_at.localeCompare(a.validated_at))[0] ?? null,
  };
}

export function listInstitutionOwners(institutionId: string) {
  return loadOwnerAssignments().filter((o) => o.institution_id === institutionId);
}

export function listInstitutionWorkspaces(institutionId: string) {
  return loadWorkspaces().filter((w) => w.institution_id === institutionId);
}

export function listInstitutionModules(institutionId: string) {
  return loadModules().filter((m) => m.institution_id === institutionId);
}

export function getProvisioningHealth(): ProvisioningHealth {
  const requests = loadRequests();
  const institutions = loadInstitutions();
  const validations = loadValidations();
  const base = loadHealth();

  const blocked = validations.filter((v) => v.status === "blocked").length;
  const passed = validations.filter((v) => v.status === "passed" || v.status === "passed_with_warnings").length;
  const rate = validations.length ? Math.round((passed / validations.length) * 100) : base.validation_success_rate;

  return {
    ...base,
    requests_under_review: requests.filter((r) => r.status === "under_review").length,
    active_provisioning_jobs: institutions.filter((i) => i.status === "provisioning" || i.status === "validation").length,
    blocked_institutions: institutions.filter((i) => i.status === "validation" || i.status === "paused").length,
  };
}

export function getAttentionQueue(): ProvisioningAttentionItem[] {
  const items: ProvisioningAttentionItem[] = [];
  for (const inst of loadInstitutions()) {
    const owners = loadOwnerAssignments().filter((o) => o.institution_id === inst.id && o.status === "active");
    if (owners.length < 5) {
      items.push({
        severity: "blocking",
        category: "missing_owner",
        message: `Missing required owners (${owners.length}/5)`,
        institution_id: inst.id,
        institution_name: inst.name,
      });
    }
    for (const ws of loadWorkspaces().filter((w) => w.institution_id === inst.id)) {
      if (!ws.owner_user_id) {
        items.push({
          severity: "blocking",
          category: "ownerless_workspace",
          message: `Workspace "${ws.name}" lacks owner`,
          institution_id: inst.id,
          institution_name: inst.name,
        });
      }
    }
    const sec = loadSecurityProfiles().find((s) => s.institution_id === inst.id);
    if (!sec || sec.status !== "applied") {
      items.push({
        severity: "blocking",
        category: "security_baseline",
        message: "Security baseline not applied",
        institution_id: inst.id,
        institution_name: inst.name,
      });
    }
  }
  return items;
}

export function listAuditEvents(institutionId?: string) {
  const events = loadAuditEvents();
  if (institutionId) return events.filter((e) => e.institution_id === institutionId);
  return events.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export { validateInstitution };
