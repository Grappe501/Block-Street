import {
  loadApprovalPaths,
  loadConfigurationVersions,
  loadEscalationPaths,
  loadFeatureFlags,
  loadLeadershipAssignments,
  loadLeadershipPositions,
  loadUnits,
  loadValidations,
  persistValidations,
  loadUnitOwners,
  loadWorkspaceMappings,
} from "./data";
import { listInstitutionUnits } from "./hierarchy";
import { recordOrgAudit } from "./audit";
import type { OrganizationConfigurationValidation, ValidationStatus } from "./types";

export function validateOrganizationConfiguration(
  institutionId: string,
  actorId: string
): OrganizationConfigurationValidation {
  const flags = loadFeatureFlags();
  if (!flags.ORGANIZATIONAL_VALIDATION_REQUIRED) {
    throw new Error("Organizational validation is not enabled.");
  }

  const units = listInstitutionUnits(institutionId);
  const owners = loadUnitOwners().filter((o) => o.status === "active");
  const positions = loadLeadershipPositions().filter((p) => p.institution_id === institutionId);
  const assignments = loadLeadershipAssignments();
  const mappings = loadWorkspaceMappings();
  const versions = loadConfigurationVersions().filter((v) => v.institution_id === institutionId);
  const versionNum = versions.length ? Math.max(...versions.map((v) => v.version_number)) : 0;

  const warnings: string[] = [];
  const blocking: string[] = [];
  let passed = 0;
  let total = 0;

  const check = (ok: boolean, block?: string, warn?: string) => {
    total += 1;
    if (ok) passed += 1;
    else if (block) blocking.push(block);
    else if (warn) warnings.push(warn);
  };

  for (const unit of units.filter((u) => u.status === "active")) {
    const unitOwners = owners.filter((o) => o.unit_id === unit.id);
    check(!!unit.primary_owner_user_id || unitOwners.length > 0, `Unit "${unit.name}" has no owner.`);
  }

  for (const unit of units) {
    if (unit.parent_unit_id) {
      const ancestors = [];
      let cur: string | null = unit.parent_unit_id;
      const seen = new Set<string>();
      while (cur) {
        if (seen.has(cur)) {
          blocking.push(`Circular hierarchy detected at unit "${unit.name}".`);
          break;
        }
        seen.add(cur);
        ancestors.push(cur);
        cur = loadUnits().find((u) => u.id === cur)?.parent_unit_id ?? null;
      }
      if (!blocking.some((b) => b.includes("Circular"))) {
        total += 1;
        passed += 1;
      }
    }
  }

  for (const pos of positions) {
    const assign = assignments.find((a) => a.position_id === pos.id);
    if (!assign || assign.status === "vacant") {
      warnings.push(`Leadership vacancy: ${pos.title}`);
    }
  }

  for (const map of mappings.filter((m) => m.institution_id === institutionId)) {
    const unit = units.find((u) => u.id === map.unit_id);
    check(!!unit, `Workspace mapping references unknown unit.`);
    if (map.institution_id !== institutionId) {
      blocking.push("Cross-institution workspace mapping detected.");
    }
  }

  const approvalPaths = loadApprovalPaths().filter((p) => units.some((u) => u.id === p.unit_id));
  check(approvalPaths.length > 0 || units.length === 0, undefined, "No approval paths configured.");

  const escalationPaths = loadEscalationPaths();
  check(escalationPaths.length > 0 || units.length < 3, undefined, "Some units may lack escalation paths.");

  let status: ValidationStatus = "passed";
  if (blocking.length > 0) status = "blocked";
  else if (warnings.length > 0) status = "passed_with_warnings";

  const validation: OrganizationConfigurationValidation = {
    id: `org-val-${Date.now().toString(36)}`,
    institution_id: institutionId,
    configuration_version: versionNum,
    checks_total: total,
    checks_passed: passed,
    warnings,
    blocking_issues: blocking,
    status,
    validated_at: new Date().toISOString(),
  };

  const all = loadValidations();
  all.push(validation);
  persistValidations(all);

  recordOrgAudit({
    institution_id: institutionId,
    unit_id_optional: null,
    actor_id: actorId,
    action: "organization.validation_completed",
    target_type: "validation",
    target_id: validation.id,
    previous_state: null,
    new_state: status,
    reason: blocking.join("; ") || null,
    configuration_version: versionNum,
    correlation_id: validation.id,
    result: status === "blocked" ? "failure" : "success",
  });

  return validation;
}
