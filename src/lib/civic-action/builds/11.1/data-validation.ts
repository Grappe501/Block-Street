import type {
  InitiativeAggregate,
  InitiativeCharterRecord,
  InitiativeRecord,
  InitiativeScopeRecord,
} from "./data-model";
import type { CanonicalInitiativeStatus } from "./data-model";
import { validateTransition } from "./state-machine";

export interface ValidationIssue {
  code: string;
  field?: string;
  message: string;
}

export function validateInitiativeRecord(record: InitiativeRecord): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!record.initiative_id) issues.push({ code: "INI-V-001", field: "initiative_id", message: "initiative_id required" });
  if (!record.institution_id) issues.push({ code: "INI-V-002", field: "institution_id", message: "One governing institution required" });
  if (!record.executive_owner_human_id) issues.push({ code: "INI-V-003", field: "executive_owner_human_id", message: "Executive owner required" });
  if (!record.operational_owner_human_id) issues.push({ code: "INI-V-004", field: "operational_owner_human_id", message: "One operational owner required" });
  if (record.executive_owner_human_id.startsWith("svc-") || record.operational_owner_human_id.startsWith("svc-")) {
    issues.push({ code: "INI-V-005", message: "Service identity cannot be owner" });
  }
  if (!record.initiative_name?.trim()) issues.push({ code: "INI-V-006", field: "initiative_name", message: "Initiative name required" });
  if (!record.initiative_slug?.trim()) issues.push({ code: "INI-V-007", field: "initiative_slug", message: "Initiative slug required" });
  return issues;
}

export function validateActivationReadiness(
  initiative: InitiativeRecord,
  charter: InitiativeCharterRecord | null,
  scope: InitiativeScopeRecord | null
): ValidationIssue[] {
  const issues = validateInitiativeRecord(initiative);
  if (!charter || charter.charter_status !== "approved" && charter.charter_status !== "active_version") {
    issues.push({ code: "INI-V-010", message: "Approved charter required for activation" });
  }
  if (!charter?.purpose?.trim()) issues.push({ code: "INI-V-011", field: "purpose", message: "Purpose required" });
  if (!scope) issues.push({ code: "INI-V-012", message: "Scope record required" });
  if (scope && !scope.functional_scope?.trim()) {
    issues.push({ code: "INI-V-013", field: "functional_scope", message: "Functional scope required" });
  }
  return issues;
}

export function validateStatusTransition(from: CanonicalInitiativeStatus, to: CanonicalInitiativeStatus): ValidationIssue[] {
  const result = validateTransition(from, to);
  if (!result.allowed) return [{ code: "INI-V-020", message: result.reason ?? "Illegal transition" }];
  return [];
}

export function detectCircularDependencies(
  initiativeId: string,
  edges: { initiative_id: string; target_id: string; dependency_type: string; target_type: string }[]
): ValidationIssue[] {
  const graph = new Map<string, string[]>();
  for (const e of edges) {
    if (e.target_type !== "initiative") continue;
    const list = graph.get(e.initiative_id) ?? [];
    list.push(e.target_id);
    graph.set(e.initiative_id, list);
  }

  const visited = new Set<string>();
  const stack = new Set<string>();

  function dfs(node: string): boolean {
    if (stack.has(node)) return true;
    if (visited.has(node)) return false;
    visited.add(node);
    stack.add(node);
    for (const next of graph.get(node) ?? []) {
      if (dfs(next)) return true;
    }
    stack.delete(node);
    return false;
  }

  if (dfs(initiativeId)) {
    return [{ code: "INI-V-030", message: "Circular initiative dependency detected" }];
  }
  return [];
}

export function validateAggregateIntegrity(aggregate: InitiativeAggregate): ValidationIssue[] {
  const issues = validateInitiativeRecord(aggregate.initiative);
  if (aggregate.charter && aggregate.charter.initiative_id !== aggregate.initiative.initiative_id) {
    issues.push({ code: "INI-V-040", message: "Charter initiative_id mismatch" });
  }
  if (aggregate.scope && aggregate.scope.initiative_id !== aggregate.initiative.initiative_id) {
    issues.push({ code: "INI-V-041", message: "Scope initiative_id mismatch" });
  }
  const ownerMemberships = aggregate.memberships.filter(
    (m) => m.role === "operational_owner" && m.status === "active"
  );
  if (ownerMemberships.length > 1) {
    issues.push({ code: "INI-V-042", message: "At most one active operational owner membership" });
  }
  issues.push(
    ...detectCircularDependencies(
      aggregate.initiative.initiative_id,
      aggregate.dependencies.map((d) => ({
        initiative_id: d.initiative_id,
        target_id: d.target_id,
        dependency_type: d.dependency_type,
        target_type: d.target_type,
      }))
    )
  );
  return issues;
}

export function getValidationRules() {
  return {
    wave: "11.1-W2",
    activation_requires: ["institution", "executive_owner", "operational_owner", "approved_charter", "scope", "valid_status"],
    deletion: "soft_archive_only",
    id_immutability: true,
    history_immutability: true,
  };
}
