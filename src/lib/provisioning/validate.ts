import {
  loadCheckpoints,
  loadDeploymentProfiles,
  loadFeatureFlags,
  loadModules,
  loadOwnerAssignments,
  loadSecurityProfiles,
  loadWorkspaces,
  persistValidations,
  loadValidations,
  loadInstitutions,
  persistInstitutions,
} from "./data";
import { recordAudit } from "./audit";
import type { ProvisioningValidation, ValidationStatus } from "./types";

export function validateInstitution(institutionId: string, actorId: string): ProvisioningValidation {
  const flags = loadFeatureFlags();
  if (!flags.INSTITUTION_VALIDATION_REQUIRED) {
    throw new Error("Institution validation is not enabled.");
  }

  const institution = loadInstitutions().find((i) => i.id === institutionId);
  if (!institution) throw new Error("Institution not found.");

  const owners = loadOwnerAssignments().filter((o) => o.institution_id === institutionId && o.status === "active");
  const workspaces = loadWorkspaces().filter((w) => w.institution_id === institutionId);
  const modules = loadModules().filter((m) => m.institution_id === institutionId);
  const security = loadSecurityProfiles().find((s) => s.institution_id === institutionId);
  const deployment = loadDeploymentProfiles().find((d) => d.institution_id === institutionId);

  const warnings: string[] = [];
  const blocking: string[] = [];
  let passed = 0;
  let total = 0;

  const check = (ok: boolean, blockMsg: string, warnMsg?: string) => {
    total += 1;
    if (ok) passed += 1;
    else if (warnMsg) warnings.push(warnMsg);
    else blocking.push(blockMsg);
  };

  const ownerTypes = new Set(owners.map((o) => o.owner_type));
  check(ownerTypes.has("executive"), "Executive owner is required.");
  check(ownerTypes.has("administrative"), "Administrative owner is required.");
  check(ownerTypes.has("security"), "Security owner is required.");
  check(ownerTypes.has("data"), "Data owner is required.");
  check(ownerTypes.has("support"), "Support owner is required.");

  check(!!security && security.status === "applied", "Security baseline must be applied.");
  check(workspaces.length > 0, "At least one workspace must exist.");
  const ownerless = workspaces.filter((w) => !w.owner_user_id);
  check(ownerless.length === 0, `Workspace(s) lack owner: ${ownerless.map((w) => w.name).join(", ")}`);

  check(workspaces.some((w) => w.type === "training"), "Training workspace is required.");
  check(workspaces.some((w) => w.type === "pilot"), "Pilot workspace is required.");
  check(!!deployment, "Deployment profile must be configured.");

  const massNotif = modules.find((m) => m.module_key === "notifications");
  if (massNotif && massNotif.status === "active") {
    warnings.push("Notifications module active before launch approval — verify consent controls.");
  }

  const aiModule = modules.find((m) => m.module_key === "ai_assistance");
  check(!aiModule || aiModule.status !== "active", "AI assistance must remain restricted until governance review.");

  let status: ValidationStatus = "passed";
  if (blocking.length > 0) status = "blocked";
  else if (warnings.length > 0) status = "passed_with_warnings";

  const validation: ProvisioningValidation = {
    id: `val-${Date.now().toString(36)}`,
    institution_id: institutionId,
    template_version: institution.template_version ?? "unknown",
    checks_total: total,
    checks_passed: passed,
    checks_failed: total - passed,
    warnings,
    blocking_issues: blocking,
    status,
    validated_at: new Date().toISOString(),
    validated_by: actorId,
  };

  const all = loadValidations();
  all.push(validation);
  persistValidations(all);

  const institutions = loadInstitutions();
  const idx = institutions.findIndex((i) => i.id === institutionId);
  if (idx >= 0) {
    if (status === "blocked") {
      institutions[idx] = { ...institutions[idx], status: "validation", launch_stage: "validation" };
    } else if (status === "passed" || status === "passed_with_warnings") {
      institutions[idx] = {
        ...institutions[idx],
        status: "provisioned",
        launch_stage: "configuration_required",
        progress_percent: 100,
      };
    }
    persistInstitutions(institutions);
  }

  recordAudit({
    institution_id: institutionId,
    request_id_optional: institution.request_id,
    actor_id: actorId,
    action: "institution.validation_completed",
    target_type: "validation",
    target_id_optional: validation.id,
    previous_state: institution.status,
    new_state: status === "blocked" ? "validation" : "configuration_required",
    reason: blocking.join("; ") || null,
    correlation_id: validation.id,
    result: status === "blocked" ? "failure" : "success",
  });

  return validation;
}
