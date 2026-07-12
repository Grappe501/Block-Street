/**
 * CAE-11.1-W3 — Charter validation by lifecycle stage
 */
import type { InitiativeAggregate, InitiativeCharterRecord } from "../data-model";

export type CharterValidationLevel =
  | "draft"
  | "review_submission"
  | "approval"
  | "activation"
  | "scope_change"
  | "closeout";

export interface CharterValidationIssue {
  code: string;
  message: string;
  field?: string;
  blocking: boolean;
}

export interface InitiativeCharterValidation {
  initiative_id: string;
  charter_version: number;
  validation_level: CharterValidationLevel;
  is_valid: boolean;
  errors: CharterValidationIssue[];
  warnings: CharterValidationIssue[];
  missing_fields: string[];
  evaluated_at: string;
}

function missing(charter: InitiativeCharterRecord | null, field: keyof InitiativeCharterRecord, label: string): CharterValidationIssue | null {
  if (!charter) return { code: "MISSING_CHARTER", message: "Charter record required", blocking: true };
  const val = charter[field];
  if (val === null || val === undefined || (typeof val === "string" && !val.trim())) {
    return { code: "MISSING_REQUIRED_FIELD", message: `${label} is required`, field: String(field), blocking: true };
  }
  return null;
}

export function validateCharter(
  aggregate: InitiativeAggregate,
  level: CharterValidationLevel
): InitiativeCharterValidation {
  const { initiative, charter, scope } = aggregate;
  const errors: CharterValidationIssue[] = [];
  const warnings: CharterValidationIssue[] = [];
  const missing_fields: string[] = [];

  const add = (issue: CharterValidationIssue | null) => {
    if (!issue) return;
    if (issue.blocking) {
      errors.push(issue);
      if (issue.field) missing_fields.push(issue.field);
    } else warnings.push(issue);
  };

  if (level === "draft") {
    if (!initiative.institution_id) add({ code: "MISSING_INSTITUTION", message: "Institution required", blocking: true });
    if (!initiative.initiative_name?.trim()) add({ code: "MISSING_NAME", message: "Name required", field: "initiative_name", blocking: true });
    if (!initiative.initiative_type) add({ code: "MISSING_TYPE", message: "Type required", field: "initiative_type", blocking: true });
    add(missing(charter, "problem_statement", "Problem or opportunity"));
  }

  if (level === "review_submission" || level === "approval" || level === "activation") {
    add(missing(charter, "purpose", "Purpose"));
    add(missing(charter, "institution_alignment", "Institutional alignment"));
    add(missing(charter, "success_definition", "Success definition"));
    add(missing(charter, "in_scope", "In scope"));
    add(missing(charter, "out_of_scope", "Out of scope"));
    add(missing(charter, "closeout_basis", "Closeout basis"));
    add(missing(charter, "review_frequency", "Review frequency"));
    if (!initiative.executive_owner_human_id) add({ code: "MISSING_EXEC_OWNER", message: "Executive owner required", blocking: true });
    if (!initiative.operational_owner_human_id) add({ code: "MISSING_OPS_OWNER", message: "Operational owner required", blocking: true });
    if (!scope?.functional_scope?.trim()) add({ code: "MISSING_SCOPE", message: "Functional scope required", blocking: true });
  }

  if (level === "approval" || level === "activation") {
    if (charter && charter.charter_status !== "approved" && charter.charter_status !== "active_version" && level === "activation") {
      add({ code: "CHARTER_NOT_APPROVED", message: "Approved charter required for activation", blocking: true });
    }
    if (initiative.governance_class >= 4 && !initiative.backup_owner_human_id) {
      add({ code: "MISSING_BACKUP_OWNER", message: "Class 4+ initiative requires backup owner", blocking: true });
    } else if (initiative.governance_class >= 2 && !initiative.backup_owner_human_id) {
      warnings.push({ code: "BACKUP_RECOMMENDED", message: "No backup owner assigned", blocking: false });
    }
  }

  if (level === "activation") {
    if (initiative.status === "owner_required") {
      add({ code: "OWNER_REQUIRED", message: "Initiative in owner_required state", blocking: true });
    }
    if (!aggregate.timeline?.next_review_date) {
      add({
        code: "MISSING_REVIEW_DATE",
        message: "Review date or rhythm must be scheduled before activation",
        field: "next_review_date",
        blocking: true,
      });
    }
    if (initiative.status !== "preparation" && initiative.status !== "approved") {
      add({
        code: "LIFECYCLE_CONFLICT",
        message: "Initiative must be in preparation before activation",
        blocking: true,
      });
    }
    const blockingDeps = aggregate.dependencies.filter((d) => d.blocks_activation);
    if (blockingDeps.length > 0) {
      add({
        code: "BLOCKING_DEPENDENCY",
        message: `${blockingDeps.length} blocking dependencies remain`,
        blocking: true,
      });
    }
    if (charter?.problem_statement?.toLowerCase().includes("we need a new app")) {
      add({ code: "VANITY_PURPOSE", message: "Purpose appears solution-prejudged", field: "purpose", blocking: true });
    }
  }

  return {
    initiative_id: initiative.initiative_id,
    charter_version: charter?.version ?? 0,
    validation_level: level,
    is_valid: errors.length === 0,
    errors,
    warnings,
    missing_fields,
    evaluated_at: new Date().toISOString(),
  };
}
