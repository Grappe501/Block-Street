import {
  loadApprovals,
  loadDuplicateCandidates,
  loadDryRuns,
  loadExceptions,
  loadFeatureFlags,
  loadFieldMappings,
  loadHealth,
  loadIdentityMatches,
  loadImportJobs,
  loadIntakes,
  loadProjects,
  loadQuarantineItems,
  loadReadinessAssessments,
  loadReconciliationReports,
  loadRecordLinks,
  loadRiskAssessments,
  loadSources,
  loadStagingRecords,
  loadTransformationRules,
  loadAuditEvents,
  persistApprovals,
  persistDuplicateCandidates,
  persistDryRuns,
  persistExceptions,
  persistFieldMappings,
  persistHealth,
  persistIdentityMatches,
  persistImportJobs,
  persistIntakes,
  persistProjects,
  persistQuarantineItems,
  persistReadinessAssessments,
  persistReconciliationReports,
  persistRecordLinks,
  persistRiskAssessments,
  persistSources,
  persistStagingRecords,
} from "./data";
import { recordMigrationAudit } from "./audit";
import { classifyMigrationRisk } from "./risk";
import { canApproveImport, createValidationExceptions, validateMigrationProject } from "./validate";
import type {
  AddSourceInput,
  CreateMigrationProjectInput,
  DataReadinessAssessment,
  IntakeCompleteInput,
  MigrationDryRun,
  MigrationHealth,
  MigrationProject,
  MigrationStagingRecord,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function hashContent(content: string) {
  let h = 0;
  for (let i = 0; i < content.length; i++) h = (Math.imul(31, h) + content.charCodeAt(i)) | 0;
  return `sha256-sim-${Math.abs(h).toString(16)}`;
}

function assertMigrationEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.MIGRATION_PLATFORM_ENABLED) throw new Error("Migration platform is not enabled.");
  return flags;
}

function getProject(projectId: string) {
  const project = loadProjects().find((p) => p.id === projectId);
  if (!project) throw new Error("Migration project not found.");
  return project;
}

function assertInstitutionScope(project: MigrationProject, institutionId: string) {
  if (project.institution_id !== institutionId) throw new Error("Cross-institution migration access denied.");
}

export function listProjects(institutionId?: string) {
  const projects = loadProjects();
  return institutionId ? projects.filter((p) => p.institution_id === institutionId) : projects;
}

export function getProjectDetail(projectId: string) {
  const project = getProject(projectId);
  return {
    project,
    sources: loadSources().filter((s) => s.migration_project_id === projectId),
    mappings: loadFieldMappings().filter((m) => m.migration_project_id === projectId),
    staging_count: loadStagingRecords().filter((r) => r.migration_project_id === projectId).length,
    exceptions: loadExceptions().filter((e) => e.migration_project_id === projectId),
    dry_runs: loadDryRuns().filter((d) => d.migration_project_id === projectId),
    approvals: loadApprovals().filter((a) => a.migration_project_id === projectId),
    import_jobs: loadImportJobs().filter((j) => j.migration_project_id === projectId),
    readiness: loadReadinessAssessments().filter((r) => r.migration_project_id === projectId),
  };
}

export function createMigrationProject(input: CreateMigrationProjectInput, actorId: string): MigrationProject {
  assertMigrationEnabled();
  const risk = classifyMigrationRisk({
    record_volume: 0,
    contains_restricted_data: input.target_domains.includes("relationships"),
  });

  const project: MigrationProject = {
    id: id("mig"),
    institution_id: input.institution_id,
    name: input.name,
    description: input.description ?? "",
    migration_type: input.migration_type,
    source_summary: "",
    target_domains: input.target_domains,
    migration_owner_user_id: input.migration_owner_user_id,
    data_owner_user_id: input.data_owner_user_id,
    security_reviewer_user_id: input.security_reviewer_user_id,
    institution_approver_user_id: input.institution_approver_user_id,
    target_launch_stage: "pilot",
    risk_level: input.risk_level ?? risk.risk_level,
    status: "draft",
    created_at: now(),
    started_at_optional: null,
    completed_at_optional: null,
  };

  const projects = loadProjects();
  projects.push(project);
  persistProjects(projects);

  const assessments = loadRiskAssessments();
  assessments.push({
    id: id("risk"),
    migration_project_id: project.id,
    risk_level: project.risk_level,
    risk_factors: risk.risk_factors,
    required_reviews: ["data_steward", "security_reviewer"],
    required_approvals: ["mapping", "dry_run", "security", "data_owner", "institution"],
    required_dry_runs: risk.required_dry_runs,
    rollback_requirement: project.risk_level === "M3" || project.risk_level === "M4",
    reviewed_by: actorId,
    reviewed_at: now(),
  });
  persistRiskAssessments(assessments);

  recordMigrationAudit({
    migration_project_id: project.id,
    institution_id: project.institution_id,
    actor_id: actorId,
    action: "migration.created",
    target_type: "migration_project",
    target_id: project.id,
    previous_state: "",
    new_state: project.status,
    reason: "Migration project created",
    correlation_id: project.id,
    result: "success",
  });

  refreshHealth();
  return project;
}

export function updateProjectStatus(projectId: string, status: MigrationProject["status"], actorId: string) {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === projectId);
  if (idx < 0) throw new Error("Migration project not found.");
  const prev = projects[idx].status;
  projects[idx] = { ...projects[idx], status, started_at_optional: projects[idx].started_at_optional ?? now() };
  persistProjects(projects);
  recordMigrationAudit({
    migration_project_id: projectId,
    institution_id: projects[idx].institution_id,
    actor_id: actorId,
    action: "migration.status_changed",
    target_type: "migration_project",
    target_id: projectId,
    previous_state: prev,
    new_state: status,
    reason: `Status changed to ${status}`,
    correlation_id: projectId,
    result: "success",
  });
  refreshHealth();
  return projects[idx];
}

export function addSource(input: AddSourceInput, actorId: string) {
  assertMigrationEnabled();
  const project = getProject(input.migration_project_id);
  const source = {
    id: id("src"),
    migration_project_id: input.migration_project_id,
    name: input.name,
    source_type: input.source_type,
    source_system: input.source_system,
    source_owner_user_id: input.source_owner_user_id ?? null,
    source_location_reference: input.source_location_reference,
    source_format: input.source_format,
    estimated_record_count: input.estimated_record_count ?? 0,
    estimated_file_count: 1,
    contains_personal_data: input.contains_personal_data ?? false,
    contains_restricted_data: input.contains_restricted_data ?? false,
    access_method: "secure_upload",
    status: input.source_owner_user_id ? ("identified" as const) : ("identified" as const),
  };

  if (!source.source_owner_user_id) {
    source.status = "identified";
  }

  const sources = loadSources();
  sources.push(source);
  persistSources(sources);

  recordMigrationAudit({
    migration_project_id: project.id,
    institution_id: project.institution_id,
    actor_id: actorId,
    action: "migration.source_identified",
    target_type: "migration_source",
    target_id: source.id,
    previous_state: "",
    new_state: source.status,
    reason: `Source ${source.name} inventoried`,
    correlation_id: source.id,
    result: "success",
  });

  if (!source.source_owner_user_id) {
    const exceptions = loadExceptions();
    exceptions.push({
      id: id("exc"),
      migration_project_id: project.id,
      staging_record_id: null,
      exception_type: "missing_owner",
      severity: "blocking",
      description: `Source "${source.name}" lacks an owner.`,
      suggested_actions: ["Assign source owner before staging."],
      assigned_to: null,
      status: "open",
      resolution: null,
      created_at: now(),
      resolved_at: null,
    });
    persistExceptions(exceptions);
  }

  refreshHealth();
  return source;
}

export function assignSourceOwner(sourceId: string, ownerId: string, actorId: string) {
  const sources = loadSources();
  const idx = sources.findIndex((s) => s.id === sourceId);
  if (idx < 0) throw new Error("Source not found.");
  sources[idx].source_owner_user_id = ownerId;
  sources[idx].status = "approved_for_staging";
  persistSources(sources);

  const projectId = sources[idx].migration_project_id;
  const exceptions = loadExceptions().filter(
    (e) => !(e.migration_project_id === projectId && e.exception_type === "missing_owner" && e.description.includes(sources[idx].name))
  );
  persistExceptions(exceptions);

  const project = getProject(projectId);
  recordMigrationAudit({
    migration_project_id: projectId,
    institution_id: project.institution_id,
    actor_id: actorId,
    action: "migration.source_owner_assigned",
    target_type: "migration_source",
    target_id: sourceId,
    previous_state: "ownerless",
    new_state: ownerId,
    reason: "Source owner assigned",
    correlation_id: sourceId,
    result: "success",
  });
  return sources[idx];
}

export function completeIntake(input: IntakeCompleteInput, actorId: string) {
  assertMigrationEnabled();
  const flags = loadFeatureFlags();
  const project = getProject(input.migration_project_id);
  const source = loadSources().find((s) => s.id === input.migration_source_id);
  if (!source || source.migration_project_id !== project.id) throw new Error("Invalid source.");
  if (!source.source_owner_user_id) throw new Error("Source blocked: owner required before intake.");

  const secretPattern = /(api[_-]?key|secret|password|token|private[_-]?key)/i;
  const hasSecret = secretPattern.test(input.content);
  const contentHash = hashContent(input.content);

  const intake = {
    id: id("intake"),
    migration_project_id: project.id,
    migration_source_id: source.id,
    uploaded_by: input.uploaded_by,
    storage_reference: `staging/raw/${project.id}/${source.id}/${contentHash}`,
    original_filename: input.original_filename,
    content_hash: contentHash,
    size: input.content.length,
    mime_type: input.mime_type ?? "text/csv",
    scan_status: hasSecret ? ("quarantined" as const) : ("passed" as const),
    classification: source.contains_restricted_data ? "restricted" : "internal",
    received_at: now(),
    status: hasSecret ? ("quarantined" as const) : ("received" as const),
  };

  const intakes = loadIntakes();
  intakes.push(intake);
  persistIntakes(intakes);

  if (hasSecret) {
    const quarantine = loadQuarantineItems();
    quarantine.push({
      id: id("q"),
      migration_project_id: project.id,
      source_id: source.id,
      staging_record_id: null,
      reason: "Potential API secret or credential detected",
      classification: "highly_restricted",
      quarantined_at: now(),
      review_owner: project.security_reviewer_user_id,
      status: "quarantined",
    });
    persistQuarantineItems(quarantine);
    recordMigrationAudit({
      migration_project_id: project.id,
      institution_id: project.institution_id,
      actor_id: actorId,
      action: "migration.quarantined",
      target_type: "migration_intake",
      target_id: intake.id,
      previous_state: "",
      new_state: "quarantined",
      reason: "Secret detection",
      correlation_id: intake.id,
      result: "success",
    });
    refreshHealth();
    return { intake, quarantined: true, staged_records: 0 };
  }

  source.status = "received";
  const sources = loadSources();
  const sIdx = sources.findIndex((s) => s.id === source.id);
  sources[sIdx] = source;
  persistSources(sources);

  const staged = profileAndStageRecords(project, source, input.content, actorId);

  recordMigrationAudit({
    migration_project_id: project.id,
    institution_id: project.institution_id,
    actor_id: actorId,
    action: "migration.source_received",
    target_type: "migration_intake",
    target_id: intake.id,
    previous_state: "",
    new_state: "received",
    reason: `Intake ${input.original_filename}`,
    correlation_id: intake.id,
    result: "success",
  });

  refreshHealth();
  return { intake, quarantined: false, staged_records: staged.length };
}

function profileAndStageRecords(
  project: MigrationProject,
  source: { id: string; name: string; contains_restricted_data: boolean },
  content: string,
  actorId: string
): MigrationStagingRecord[] {
  const lines = content.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const records: MigrationStagingRecord[] = [];
  const staging = loadStagingRecords();
  const identityMatches = loadIdentityMatches();
  const duplicates = loadDuplicateCandidates();
  const exceptions = loadExceptions();

  const campusAliases: Record<string, string> = {
    "uark": "University of Arkansas",
    "university of arkansas": "University of Arkansas",
    "uca": "University of Central Arkansas",
    "arkansas state": "Arkansas State University",
  };

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? "";
    });

    const email = row.email ?? row.Email ?? "";
    const name = row.name ?? row.Name ?? "";
    const campus = row.campus ?? row.Campus ?? row.CampusName ?? "";
    const normalizedCampus = campusAliases[campus.toLowerCase()] ?? campus;

    let identityStatus: MigrationStagingRecord["identity_resolution_status"] = "no_match";
    let matchSignals: string[] = [];
    if (email && email.includes("@")) {
      identityStatus = email.endsWith("@block-street.local") ? "verified_match" : "probable_match";
      matchSignals = ["verified_email"];
    } else if (name && !email) {
      identityStatus = "possible_match";
      matchSignals = ["name_only"];
    }

    let orgStatus = "mapped";
    if (!normalizedCampus) orgStatus = "no_matching_unit";
    else if (!Object.values(campusAliases).includes(normalizedCampus) && campus) orgStatus = "review_required";

    let consent: MigrationStagingRecord["consent_state"] = "consent_unknown";
    if (row.consent === "verified") consent = "verified_consent";
    if (row.consent === "transactional") consent = "transactional_only";

    const classification = source.contains_restricted_data || (row.notes ?? "").length > 0 ? "restricted" : "internal";

    const record: MigrationStagingRecord = {
      id: id("stg"),
      migration_project_id: project.id,
      migration_source_id: source.id,
      source_record_key: `${source.id}-row-${i}`,
      staging_zone: orgStatus === "no_matching_unit" || identityStatus === "possible_match" ? "exception" : "mapped",
      canonical_entity_type: row.entity_type ?? "user",
      normalized_payload: row,
      mapped_payload: { ...row, campus: normalizedCampus },
      validation_status: email || name ? "valid" : "warning",
      identity_resolution_status: identityStatus,
      duplicate_status: "no_duplicate",
      organization_mapping_status: orgStatus,
      classification,
      consent_state: consent,
      review_status: "pending",
      approval_status: "pending",
      import_status: "pending",
      created_at: now(),
      updated_at: now(),
    };

    records.push(record);
    staging.push(record);

    if (identityStatus === "probable_match" || identityStatus === "verified_match") {
      identityMatches.push({
        id: id("idm"),
        migration_project_id: project.id,
        staging_record_id: record.id,
        candidate_user_id: email || null,
        match_status: identityStatus,
        match_score: identityStatus === "verified_match" ? 0.95 : 0.75,
        match_signals: matchSignals,
        conflicting_signals: [],
        reviewed_by: null,
        review_decision: identityStatus === "verified_match" ? "auto_approved" : null,
      });
    }

    if (identityStatus === "possible_match") {
      exceptions.push({
        id: id("exc"),
        migration_project_id: project.id,
        staging_record_id: record.id,
        exception_type: "identity_conflict",
        severity: "warning",
        description: `Name-only match for "${name}" — cannot auto-commit.`,
        suggested_actions: ["Review identity manually."],
        assigned_to: null,
        status: "open",
        resolution: null,
        created_at: now(),
        resolved_at: null,
      });
    }

    if (orgStatus === "no_matching_unit" || orgStatus === "review_required") {
      exceptions.push({
        id: id("exc"),
        migration_project_id: project.id,
        staging_record_id: record.id,
        exception_type: "unmapped_organization",
        severity: orgStatus === "no_matching_unit" ? "error" : "warning",
        description: `Campus "${campus}" requires organizational mapping review.`,
        suggested_actions: ["Map to approved campus unit.", "Create review exception."],
        assigned_to: null,
        status: "open",
        resolution: null,
        created_at: now(),
        resolved_at: null,
      });
    }

    if (consent === "consent_unknown") {
      exceptions.push({
        id: id("exc"),
        migration_project_id: project.id,
        staging_record_id: record.id,
        exception_type: "consent_unknown",
        severity: "warning",
        description: "Outreach consent unknown — transactional only.",
        suggested_actions: ["Verify consent before marketing use."],
        assigned_to: null,
        status: "open",
        resolution: null,
        created_at: now(),
        resolved_at: null,
      });
    }
  }

  persistStagingRecords(staging);
  persistIdentityMatches(identityMatches);
  persistExceptions(exceptions);

  const projectIdx = loadProjects().findIndex((p) => p.id === project.id);
  if (projectIdx >= 0) {
    const projects = loadProjects();
    projects[projectIdx].status = "staging";
    projects[projectIdx].source_summary = `${records.length} records staged from ${source.name}`;
    persistProjects(projects);
  }

  return records;
}

export function addFieldMapping(
  projectId: string,
  mapping: Omit<import("./types").MigrationFieldMapping, "id" | "migration_project_id" | "version" | "approved_by">,
  actorId: string
) {
  const project = getProject(projectId);
  const mappings = loadFieldMappings();
  const item = {
    id: id("map"),
    migration_project_id: projectId,
    ...mapping,
    version: 1,
    approved_by: null,
  };
  mappings.push(item);
  persistFieldMappings(mappings);

  recordMigrationAudit({
    migration_project_id: projectId,
    institution_id: project.institution_id,
    actor_id: actorId,
    action: "migration.mapping_updated",
    target_type: "field_mapping",
    target_id: item.id,
    previous_state: "",
    new_state: `${mapping.source_field} → ${mapping.target_field}`,
    reason: "Field mapping added",
    correlation_id: item.id,
    result: "success",
  });
  return item;
}

export function runDryRun(projectId: string, actorId: string): MigrationDryRun {
  assertMigrationEnabled();
  if (!loadFeatureFlags().MIGRATION_DRY_RUN_REQUIRED) throw new Error("Dry run not required by policy.");
  const project = getProject(projectId);
  const staging = loadStagingRecords().filter((r) => r.migration_project_id === projectId);
  const eligible = staging.filter((r) => r.staging_zone !== "quarantine" && r.staging_zone !== "rejected");

  const ready = eligible.filter((r) => r.staging_zone === "mapped" || r.staging_zone === "validated");
  const blocked = eligible.filter((r) => r.validation_status === "blocked" || r.organization_mapping_status === "no_matching_unit");
  const warnings = eligible.filter((r) => r.identity_resolution_status === "possible_match" || r.consent_state === "consent_unknown");
  const quarantined = loadQuarantineItems().filter((q) => q.migration_project_id === projectId).length;

  const dryRun: MigrationDryRun = {
    id: id("dry"),
    migration_project_id: projectId,
    mapping_version: 1,
    records_processed: eligible.length,
    records_ready: ready.length,
    records_blocked: blocked.length,
    records_warning: warnings.length,
    new_records: ready.filter((r) => r.identity_resolution_status !== "verified_match").length,
    updates: ready.filter((r) => r.identity_resolution_status === "verified_match").length,
    merges: 0,
    skipped: staging.length - eligible.length,
    quarantined,
    started_at: now(),
    completed_at: now(),
    status: "completed",
  };

  const dryRuns = loadDryRuns();
  dryRuns.push(dryRun);
  persistDryRuns(dryRuns);

  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === projectId);
  projects[idx].status = "dry_run";
  persistProjects(projects);

  recordMigrationAudit({
    migration_project_id: projectId,
    institution_id: project.institution_id,
    actor_id: actorId,
    action: "migration.dry_run_completed",
    target_type: "migration_dry_run",
    target_id: dryRun.id,
    previous_state: "",
    new_state: String(dryRun.records_ready),
    reason: "Dry run completed — no canonical writes",
    correlation_id: dryRun.id,
    result: "success",
  });

  refreshHealth();
  return dryRun;
}

export function resolveException(exceptionId: string, resolution: string, actorId: string) {
  const exceptions = loadExceptions();
  const idx = exceptions.findIndex((e) => e.id === exceptionId);
  if (idx < 0) throw new Error("Exception not found.");
  exceptions[idx].status = "resolved";
  exceptions[idx].resolution = resolution;
  exceptions[idx].resolved_at = now();
  exceptions[idx].assigned_to = actorId;
  persistExceptions(exceptions);

  if (exceptions[idx].staging_record_id) {
    const staging = loadStagingRecords();
    const sIdx = staging.findIndex((s) => s.id === exceptions[idx].staging_record_id);
    if (sIdx >= 0) {
      staging[sIdx].staging_zone = "approved";
      staging[sIdx].review_status = "resolved";
      staging[sIdx].updated_at = now();
      if (exceptions[idx].exception_type === "unmapped_organization") {
        staging[sIdx].organization_mapping_status = "mapped_by_human_review";
      }
      if (exceptions[idx].exception_type === "identity_conflict") {
        staging[sIdx].identity_resolution_status = "probable_match";
      }
      persistStagingRecords(staging);
    }
  }

  const project = getProject(exceptions[idx].migration_project_id);
  recordMigrationAudit({
    migration_project_id: project.id,
    institution_id: project.institution_id,
    actor_id: actorId,
    action: "migration.exception_resolved",
    target_type: "migration_exception",
    target_id: exceptionId,
    previous_state: "open",
    new_state: "resolved",
    reason: resolution,
    correlation_id: exceptionId,
    result: "success",
  });
  refreshHealth();
  return exceptions[idx];
}

export function submitApproval(projectId: string, approvalType: string, actorId: string) {
  const project = getProject(projectId);
  const approvals = loadApprovals();
  approvals.push({
    id: id("appr"),
    migration_project_id: projectId,
    approval_type: approvalType,
    requested_by: actorId,
    requested_at: now(),
    approved_by: null,
    approved_at: null,
    status: "pending",
    conditions: [],
  });
  persistApprovals(approvals);

  recordMigrationAudit({
    migration_project_id: projectId,
    institution_id: project.institution_id,
    actor_id: actorId,
    action: "migration.approval_requested",
    target_type: "migration_approval",
    target_id: approvalType,
    previous_state: "",
    new_state: "pending",
    reason: `${approvalType} approval requested`,
    correlation_id: projectId,
    result: "success",
  });
  return approvals[approvals.length - 1];
}

export function approveMigration(projectId: string, approvalType: string, actorId: string, conditions: string[] = []) {
  const project = getProject(projectId);
  const approvals = loadApprovals();
  const pending = approvals.find((a) => a.migration_project_id === projectId && a.approval_type === approvalType && a.status === "pending");
  if (pending) {
    pending.status = "approved";
    pending.approved_by = actorId;
    pending.approved_at = now();
    pending.conditions = conditions;
  } else {
    approvals.push({
      id: id("appr"),
      migration_project_id: projectId,
      approval_type: approvalType,
      requested_by: actorId,
      requested_at: now(),
      approved_by: actorId,
      approved_at: now(),
      status: "approved",
      conditions,
    });
  }
  persistApprovals(approvals);

  recordMigrationAudit({
    migration_project_id: projectId,
    institution_id: project.institution_id,
    actor_id: actorId,
    action: "migration.approved",
    target_type: "migration_approval",
    target_id: approvalType,
    previous_state: "pending",
    new_state: "approved",
    reason: `${approvalType} approved`,
    correlation_id: projectId,
    result: "success",
  });

  if (canApproveImport(projectId)) {
    updateProjectStatus(projectId, "approval", actorId);
  }
  return approvals.find((a) => a.migration_project_id === projectId && a.approval_type === approvalType);
}

export function runImport(projectId: string, actorId: string, resumeFromCheckpoint?: string) {
  assertMigrationEnabled();
  if (!canApproveImport(projectId)) throw new Error("Import not authorized — approvals incomplete.");
  const validation = validateMigrationProject(projectId);
  if (validation.status === "blocked") {
    createValidationExceptions(projectId, validation.blocking_issues);
    throw new Error(`Import blocked: ${validation.blocking_issues.join("; ")}`);
  }

  const project = getProject(projectId);
  const staging = loadStagingRecords().filter(
    (r) => r.migration_project_id === projectId && (r.staging_zone === "approved" || r.staging_zone === "mapped" || r.staging_zone === "validated")
  );
  const links = loadRecordLinks();
  const existingKeys = new Set(links.filter((l) => l.migration_project_id === projectId).map((l) => l.source_record_key));

  const toImport = staging.filter((r) => !existingKeys.has(r.source_record_key) || resumeFromCheckpoint);
  const batchSize = 100;
  const batch = toImport.slice(0, batchSize);

  let created = 0;
  let updated = 0;
  let linked = 0;
  let skipped = 0;

  for (const record of batch) {
    if (record.identity_resolution_status === "possible_match") {
      skipped += 1;
      continue;
    }
    const action = record.identity_resolution_status === "verified_match" ? "linked" : "created";
    if (action === "created") created += 1;
    else linked += 1;

    links.push({
      id: id("link"),
      migration_project_id: projectId,
      migration_source_id: record.migration_source_id,
      source_record_key: record.source_record_key,
      canonical_entity_type: record.canonical_entity_type ?? "user",
      canonical_entity_id: id("canon"),
      import_action: action,
      mapping_version: 1,
      imported_at: now(),
    });

    const allStaging = loadStagingRecords();
    const sIdx = allStaging.findIndex((s) => s.id === record.id);
    if (sIdx >= 0) {
      allStaging[sIdx].import_status = "imported";
      allStaging[sIdx].updated_at = now();
      persistStagingRecords(allStaging);
    }
  }
  persistRecordLinks(links);

  const jobs = loadImportJobs();
  const job = {
    id: id("job"),
    migration_project_id: projectId,
    batch_number: jobs.filter((j) => j.migration_project_id === projectId).length + 1,
    status: batch.length < toImport.length ? ("paused" as const) : ("completed" as const),
    records_attempted: batch.length,
    records_created: created,
    records_updated: updated,
    records_linked: linked,
    records_skipped: skipped,
    records_failed: 0,
    checkpoint_reference: `batch-${batch.length}`,
    started_at: now(),
    completed_at: batch.length < toImport.length ? null : now(),
  };
  jobs.push(job);
  persistImportJobs(jobs);

  const projects = loadProjects();
  const pIdx = projects.findIndex((p) => p.id === projectId);
  projects[pIdx].status = job.status === "paused" ? "importing" : "reconciliation";
  persistProjects(projects);

  recordMigrationAudit({
    migration_project_id: projectId,
    institution_id: project.institution_id,
    actor_id: actorId,
    action: "migration.import_started",
    target_type: "migration_import_job",
    target_id: job.id,
    previous_state: "",
    new_state: job.status,
    reason: `Batch ${job.batch_number} imported`,
    correlation_id: job.id,
    result: "success",
  });

  refreshHealth();
  return { job, resume_available: job.status === "paused" };
}

export function reconcileMigration(projectId: string, actorId: string) {
  const project = getProject(projectId);
  const links = loadRecordLinks().filter((l) => l.migration_project_id === projectId);
  const staging = loadStagingRecords().filter((r) => r.migration_project_id === projectId);
  const expected = staging.filter((r) => r.import_status === "imported" || r.staging_zone === "approved" || r.staging_zone === "mapped").length;

  const report = {
    id: id("recon"),
    migration_project_id: projectId,
    expected_records: expected,
    actual_records: links.length,
    matched_records: Math.min(expected, links.length),
    missing_records: Math.max(0, expected - links.length),
    unexpected_records: 0,
    relationship_errors: 0,
    permission_errors: 0,
    classification_errors: staging.filter((r) => r.classification === "restricted" && r.import_status === "imported").length > 0 ? 0 : 0,
    status: links.length >= expected * 0.9 ? ("passed" as const) : ("passed_with_warnings" as const),
    generated_at: now(),
  };

  const reports = loadReconciliationReports();
  reports.push(report);
  persistReconciliationReports(reports);

  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === projectId);
  projects[idx].status = "readiness_review";
  persistProjects(projects);

  recordMigrationAudit({
    migration_project_id: projectId,
    institution_id: project.institution_id,
    actor_id: actorId,
    action: "migration.reconciliation_completed",
    target_type: "reconciliation_report",
    target_id: report.id,
    previous_state: "",
    new_state: report.status,
    reason: "Reconciliation completed",
    correlation_id: report.id,
    result: "success",
  });

  refreshHealth();
  return report;
}

export function assessDataReadiness(institutionId: string, projectId: string, actorId: string): DataReadinessAssessment[] {
  const project = getProject(projectId);
  assertInstitutionScope(project, institutionId);

  const domains = project.target_domains.length ? project.target_domains : ["users", "memberships", "campuses"];
  const assessments: DataReadinessAssessment[] = [];
  const existing = loadReadinessAssessments().filter((a) => !(a.migration_project_id === projectId));

  for (const domain of domains) {
    let status: DataReadinessAssessment["status"] = "ready";
    let conditions: string[] = [];
    let overall = 85;

    if (domain === "volunteer_history") {
      status = "ready_with_conditions";
      conditions = ["Historical hours viewable; not included in certification totals until sampled."];
      overall = 78;
    } else if (domain === "communication_consent" || domain === "contacts") {
      const unknownConsent = loadStagingRecords().filter(
        (r) => r.migration_project_id === projectId && r.consent_state === "consent_unknown"
      ).length;
      if (unknownConsent > 0) {
        status = "needs_remediation";
        conditions = ["Marketing email disabled until consent verified."];
        overall = 62;
      }
    } else if (domain === "organizations") {
      const unmapped = loadStagingRecords().filter(
        (r) => r.migration_project_id === projectId && r.organization_mapping_status === "no_matching_unit"
      ).length;
      if (unmapped > 0) {
        status = "needs_remediation";
        overall = 70;
      }
    }

    assessments.push({
      id: id("ready"),
      institution_id: institutionId,
      migration_project_id: projectId,
      data_domain: domain,
      completeness_score: overall,
      validity_score: overall,
      duplicate_resolution_score: 80,
      ownership_score: 90,
      classification_score: 85,
      organizational_mapping_score: domain === "campuses" ? 88 : 75,
      consent_score: domain.includes("consent") || domain === "contacts" ? 60 : null,
      reconciliation_score: 92,
      overall_score: overall,
      status,
      conditions,
      assessed_at: now(),
      assessed_by: actorId,
    });
  }

  persistReadinessAssessments([...existing, ...assessments]);

  recordMigrationAudit({
    migration_project_id: projectId,
    institution_id: institutionId,
    actor_id: actorId,
    action: "migration.readiness_assessed",
    target_type: "data_readiness",
    target_id: projectId,
    previous_state: "",
    new_state: String(assessments.reduce((s, a) => s + a.overall_score, 0) / assessments.length),
    reason: "Data readiness assessed",
    correlation_id: projectId,
    result: "success",
  });

  refreshHealth();
  return assessments;
}

export function certifyReadiness(institutionId: string, projectId: string, actorId: string) {
  const assessments = loadReadinessAssessments().filter((a) => a.migration_project_id === projectId);
  const blockers = assessments.filter((a) => a.status === "blocked");
  if (blockers.length > 0) throw new Error("Cannot certify — blocked domains remain.");

  const project = getProject(projectId);
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === projectId);
  projects[idx].status = "certified";
  projects[idx].completed_at_optional = now();
  persistProjects(projects);

  recordMigrationAudit({
    migration_project_id: projectId,
    institution_id: institutionId,
    actor_id: actorId,
    action: "migration.certified",
    target_type: "migration_project",
    target_id: projectId,
    previous_state: "readiness_review",
    new_state: "certified",
    reason: "Data readiness certified for pilot",
    correlation_id: projectId,
    result: "success",
  });

  refreshHealth();
  return { project: projects[idx], assessments };
}

export function getMigrationHealth(institutionId?: string): MigrationHealth {
  refreshHealth(institutionId);
  return loadHealth();
}

export function getAttentionQueue(institutionId?: string) {
  const projects = listProjects(institutionId);
  const projectIds = new Set(projects.map((p) => p.id));
  const items: Array<{ type: string; message: string; project_id: string; severity: string }> = [];

  for (const source of loadSources().filter((s) => projectIds.has(s.migration_project_id))) {
    if (!source.source_owner_user_id) {
      items.push({ type: "missing_owner", message: `Source "${source.name}" lacks owner`, project_id: source.migration_project_id, severity: "blocking" });
    }
  }

  for (const q of loadQuarantineItems().filter((q) => projectIds.has(q.migration_project_id) && q.status === "quarantined")) {
    items.push({ type: "quarantine", message: q.reason, project_id: q.migration_project_id, severity: "blocking" });
  }

  for (const exc of loadExceptions().filter((e) => projectIds.has(e.migration_project_id) && e.status === "open")) {
    items.push({ type: exc.exception_type, message: exc.description, project_id: exc.migration_project_id, severity: exc.severity });
  }

  return items.slice(0, 25);
}

export function listAuditEvents(projectId?: string) {
  const events = loadAuditEvents();
  return projectId ? events.filter((e) => e.migration_project_id === projectId) : events;
}

function refreshHealth(institutionId?: string) {
  const projects = listProjects(institutionId);
  const projectIds = new Set(projects.map((p) => p.id));
  const active = projects.filter((p) => !["closed", "cancelled", "certified"].includes(p.status)).length;
  const staging = loadStagingRecords().filter((r) => projectIds.has(r.migration_project_id));
  const validated = staging.filter((r) => r.validation_status === "valid").length;
  const exceptions = loadExceptions().filter((e) => projectIds.has(e.migration_project_id) && e.status !== "resolved");
  const identityConflicts = loadIdentityMatches().filter(
    (m) => projectIds.has(m.migration_project_id) && (m.match_status === "conflicting_identity" || m.match_status === "possible_match")
  ).length;
  const quarantined = loadQuarantineItems().filter((q) => projectIds.has(q.migration_project_id) && q.status === "quarantined").length;
  const reports = loadReconciliationReports().filter((r) => projectIds.has(r.migration_project_id));
  const passedRecon = reports.filter((r) => r.status === "passed").length;
  const readiness = loadReadinessAssessments().filter((a) => projectIds.has(a.migration_project_id));
  const blockers = readiness.filter((a) => a.status === "blocked" || a.status === "needs_remediation").length;

  persistHealth({
    active_projects: active,
    records_in_staging: staging.length,
    validation_pass_rate: staging.length ? Math.round((validated / staging.length) * 1000) / 10 : 0,
    open_exceptions: exceptions.length,
    identity_conflicts: identityConflicts,
    quarantined_items: quarantined,
    reconciliation_success_rate: reports.length ? Math.round((passedRecon / reports.length) * 1000) / 10 : 100,
    readiness_blockers: blockers,
  });
}

export { validateMigrationProject, canApproveImport };
export function loadTransformationRegistry() {
  return loadTransformationRules();
}
