import {
  loadApprovals,
  loadDryRuns,
  loadExceptions,
  loadFieldMappings,
  loadProjects,
  loadSources,
  loadStagingRecords,
  persistExceptions,
} from "./data";
import type { MigrationException, ValidationSeverity } from "./types";

export interface MigrationValidationSummary {
  checks_total: number;
  checks_passed: number;
  warnings: string[];
  blocking_issues: string[];
  status: "passed" | "passed_with_warnings" | "blocked";
}

export function validateMigrationProject(projectId: string): MigrationValidationSummary {
  const project = loadProjects().find((p) => p.id === projectId);
  const warnings: string[] = [];
  const blocking: string[] = [];
  let total = 0;
  let passed = 0;

  const check = (ok: boolean, msg: string, severity: ValidationSeverity = "blocking") => {
    total += 1;
    if (ok) passed += 1;
    else if (severity === "blocking") blocking.push(msg);
    else warnings.push(msg);
  };

  if (!project) {
    return { checks_total: 1, checks_passed: 0, warnings: [], blocking_issues: ["Migration project not found."], status: "blocked" };
  }

  check(!!project.migration_owner_user_id, "Migration owner is required.");
  check(!!project.data_owner_user_id, "Data owner is required.");
  check(!!project.security_reviewer_user_id, "Security reviewer is required.");

  const sources = loadSources().filter((s) => s.migration_project_id === projectId);
  check(sources.length > 0, "At least one source must be inventoried.");
  for (const source of sources) {
    if (source.status !== "rejected" && source.status !== "archive_only") {
      check(!!source.source_owner_user_id, `Source "${source.name}" lacks an owner.`);
    }
  }

  const mappings = loadFieldMappings().filter((m) => m.migration_project_id === projectId);
  check(mappings.length > 0, "Field mappings are required before validation.", "warning");

  const staging = loadStagingRecords().filter((r) => r.migration_project_id === projectId);
  const openExceptions = loadExceptions().filter((e) => e.migration_project_id === projectId && e.status !== "resolved");
  const blockingExceptions = openExceptions.filter((e) => e.severity === "blocking" || e.severity === "error");
  check(blockingExceptions.length === 0, `${blockingExceptions.length} blocking exceptions remain open.`);

  const unmappedOrg = staging.filter((r) => r.organization_mapping_status === "no_matching_unit");
  if (unmappedOrg.length > 0) warnings.push(`${unmappedOrg.length} records have unmapped organizational units.`);

  const consentUnknown = staging.filter((r) => r.consent_state === "consent_unknown");
  if (consentUnknown.length > 0) warnings.push(`${consentUnknown.length} contacts have unknown consent state.`);

  const dryRuns = loadDryRuns().filter((d) => d.migration_project_id === projectId && d.status === "completed");
  if (project.risk_level === "M3" || project.risk_level === "M4") {
    check(dryRuns.length > 0, "Dry run required for M3/M4 migrations.");
  }

  let status: MigrationValidationSummary["status"] = "passed";
  if (blocking.length > 0) status = "blocked";
  else if (warnings.length > 0) status = "passed_with_warnings";

  return { checks_total: total, checks_passed: passed, warnings, blocking_issues: blocking, status };
}

export function createValidationExceptions(projectId: string, issues: string[]) {
  const exceptions = loadExceptions();
  for (const issue of issues) {
    exceptions.push({
      id: `exc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      migration_project_id: projectId,
      staging_record_id: null,
      exception_type: "validation",
      severity: "blocking",
      description: issue,
      suggested_actions: ["Resolve blocking issue before import."],
      assigned_to: null,
      status: "open",
      resolution: null,
      created_at: new Date().toISOString(),
      resolved_at: null,
    } as MigrationException);
  }
  persistExceptions(exceptions);
}

export function canApproveImport(projectId: string): boolean {
  const validation = validateMigrationProject(projectId);
  if (validation.status === "blocked") return false;
  const approvals = loadApprovals().filter((a) => a.migration_project_id === projectId);
  const required = ["mapping", "dry_run", "security", "data_owner", "institution"];
  return required.every((type) => approvals.some((a) => a.approval_type === type && a.status === "approved"));
}
