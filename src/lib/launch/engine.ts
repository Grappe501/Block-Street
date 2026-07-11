import {
  loadAdoptionMetrics,
  loadConfigurationTemplates,
  loadFeatureFlags,
  loadProvisionings,
  persistProvisionings,
  loadSupportRequests,
} from "./data";
import type {
  CreateProvisioningInput,
  InstitutionProvisioning,
  LaunchOverview,
  ProvisioningStatus,
} from "./types";

const DEFAULT_PACKAGE = [
  "organization_identity",
  "admin_workspace",
  "default_roles",
  "security_baseline",
  "notification_policy",
  "cms_space",
  "initial_dashboards",
  "training_environment",
  "pilot_workspace",
  "support_access",
  "launch_checklist",
];

const PIPELINE_STATUSES: ProvisioningStatus[] = [
  "requested",
  "reviewed",
  "approved",
  "provisioning",
  "configuration_required",
  "data_readiness",
  "pilot",
  "launch_ready",
];

const TRANSITIONS: Record<ProvisioningStatus, ProvisioningStatus[]> = {
  requested: ["reviewed", "rejected", "paused"],
  reviewed: ["approved", "rejected", "paused"],
  approved: ["provisioning", "paused", "restricted"],
  provisioning: ["configuration_required", "paused", "restricted"],
  configuration_required: ["data_readiness", "paused", "restricted"],
  data_readiness: ["pilot", "paused", "restricted"],
  pilot: ["launch_ready", "paused", "restricted"],
  launch_ready: ["active", "paused", "restricted"],
  active: ["suspended", "archived"],
  rejected: ["archived"],
  paused: ["requested", "reviewed", "approved", "archived"],
  restricted: ["paused", "archived"],
  suspended: ["active", "archived"],
  archived: [],
};

function nowIso() {
  return new Date().toISOString();
}

function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

export function getLaunchOverview(): LaunchOverview {
  const provisionings = loadProvisionings();
  const metrics = loadAdoptionMetrics().metrics;
  const openSupport = loadSupportRequests().filter((r) => r.status !== "closed").length;

  return {
    phase_status: "in_progress",
    steps_complete: 1,
    steps_total: 8,
    provisioning_total: provisionings.length,
    provisioning_active: provisionings.filter((p) => p.status === "active").length,
    provisioning_in_pipeline: provisionings.filter((p) => PIPELINE_STATUSES.includes(p.status)).length,
    configuration_templates: loadConfigurationTemplates().length,
    launch_readiness_score: metrics.launch_readiness_score,
    human_help_count_avg: metrics.human_help_count_avg,
    open_support_issues: openSupport,
  };
}

export function listProvisionings(filters?: { status?: ProvisioningStatus }) {
  let items = loadProvisionings();
  if (filters?.status) items = items.filter((p) => p.status === filters.status);
  return items.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getProvisioning(id: string) {
  return loadProvisionings().find((p) => p.id === id) ?? null;
}

export function listConfigurationTemplates() {
  return loadConfigurationTemplates();
}

export function createProvisioning(input: CreateProvisioningInput): InstitutionProvisioning {
  const flags = loadFeatureFlags();
  if (!flags.ILS_PLATFORM_ENABLED || !flags.PROVISIONING_WORKFLOW_ENABLED) {
    throw new Error("Institutional provisioning workflow is not enabled.");
  }

  const record: InstitutionProvisioning = {
    id: nextId("prv"),
    institution_name: input.institution_name.trim(),
    institution_type: input.institution_type,
    requesting_user: input.requesting_user,
    executive_owner: input.executive_owner,
    technical_owner: input.technical_owner,
    security_owner: input.security_owner,
    primary_administrator: input.primary_administrator,
    requested_modules: input.requested_modules ?? ["auth", "admin", "cms", "notifications"],
    deployment_model: input.deployment_model ?? "shared_platform",
    data_region: input.data_region ?? "us-central",
    default_timezone: input.default_timezone ?? "America/Chicago",
    launch_target: input.launch_target ?? null,
    status: "requested",
    risk_classification: input.risk_classification ?? "moderate",
    configuration_template_id: input.configuration_template_id ?? null,
    provisioning_package: [...DEFAULT_PACKAGE],
    created_at: nowIso(),
    approved_at: null,
    activated_at: null,
    updated_at: nowIso(),
    audit_notes: [`Provisioning requested for ${input.institution_name}`],
  };

  const items = loadProvisionings();
  items.push(record);
  persistProvisionings(items);
  return record;
}

export function transitionProvisioning(
  id: string,
  nextStatus: ProvisioningStatus,
  note?: string
): InstitutionProvisioning {
  const flags = loadFeatureFlags();
  if (!flags.ILS_PLATFORM_ENABLED) throw new Error("Institutional launch platform is not enabled.");

  const items = loadProvisionings();
  const idx = items.findIndex((p) => p.id === id);
  if (idx < 0) throw new Error("Provisioning record not found.");

  const current = items[idx];
  const allowed = TRANSITIONS[current.status] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw new Error(`Cannot transition from ${current.status} to ${nextStatus}.`);
  }

  const updated: InstitutionProvisioning = {
    ...current,
    status: nextStatus,
    updated_at: nowIso(),
    approved_at: nextStatus === "approved" || current.approved_at ? current.approved_at ?? nowIso() : current.approved_at,
    activated_at: nextStatus === "active" ? nowIso() : current.activated_at,
    audit_notes: [
      ...current.audit_notes,
      note ?? `Status changed: ${current.status} → ${nextStatus}`,
    ],
  };

  if (nextStatus === "approved" && !updated.approved_at) updated.approved_at = nowIso();

  items[idx] = updated;
  persistProvisionings(items);
  return updated;
}
