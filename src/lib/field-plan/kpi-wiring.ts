/**
 * V2-B.4 — bind Field Plan KPIs to mapped responsibilities; resolve review for
 * content-backed rows. Placeholders stay draft. No personnel assignment.
 */
import kpiCatalog from "../../../data/field-plan/kpi-catalog.json";
import responsibilityLibrary from "../../../data/field-plan/responsibility-library.json";

export type FieldPlanKpi = (typeof kpiCatalog.kpis)[number];

export type ResponsibilityRow = {
  stable_id: string;
  canonical_key: string;
  field_plan_key: string;
  phase: string;
  function_key: string | null;
  content_status: string;
  review_status: string;
  kpi_relationship: string[];
  completion_evidence_requirement: string;
  task_template_ids: string[];
  body?: string;
  title?: string;
};

export type TaskTemplateRow = {
  stable_id: string;
  linked_responsibility_id: string;
  review_status: string;
  assignment_policy: string;
  canonical_key?: string;
  phase?: string;
};

export type KpiBinding = {
  responsibility_id: string;
  canonical_key: string;
  phase: string;
  kpi_ids: string[];
  evidence_requirements: string[];
  review_status: string;
  content_status: string;
  task_template_ids: string[];
  wiring_status: "wired" | "placeholder_deferred" | "no_matching_kpi";
};

function listKpis(): FieldPlanKpi[] {
  return kpiCatalog.kpis as FieldPlanKpi[];
}

export function matchingKpisFor(row: {
  canonical_key: string;
  phase: string;
  function_key: string | null;
}): FieldPlanKpi[] {
  return refineMatches(row as ResponsibilityRow);
}

function refineMatches(row: {
  canonical_key: string;
  phase: string;
  function_key: string | null;
}): FieldPlanKpi[] {
  const exact = listKpis().filter((kpi) => {
    const byCanonical = kpi.canonical_keys.includes(row.canonical_key);
    const byFunction =
      row.function_key != null ? kpi.function_keys.includes(row.function_key) : false;
    if (!byCanonical && !byFunction) return false;
    return kpi.phases.includes(row.phase);
  });
  if (exact.length) return exact;

  // Fallback for summary / always_active cards: KPIs tagged always_active for that seat
  if (row.phase === "always_active") {
    return listKpis().filter((kpi) => {
      const byCanonical = kpi.canonical_keys.includes(row.canonical_key);
      const byFunction =
        row.function_key != null ? kpi.function_keys.includes(row.function_key) : false;
      return (byCanonical || byFunction) && kpi.phases.includes("always_active");
    });
  }
  return [];
}

export function wireFieldPlanKpis(): {
  generated_at: string;
  phase: string;
  catalog_count: number;
  bindings: KpiBinding[];
  responsibilities: ResponsibilityRow[];
  task_templates: TaskTemplateRow[];
  summary: Record<string, number>;
} {
  const sourceResps = (responsibilityLibrary.responsibilities ?? []) as ResponsibilityRow[];
  const sourceTemplates = (responsibilityLibrary.task_templates ?? []) as TaskTemplateRow[];

  const bindings: KpiBinding[] = [];
  const responsibilities: ResponsibilityRow[] = [];
  const templateByResp = new Map<string, TaskTemplateRow[]>();
  for (const t of sourceTemplates) {
    const list = templateByResp.get(t.linked_responsibility_id) ?? [];
    list.push(t);
    templateByResp.set(t.linked_responsibility_id, list);
  }

  let approved = 0;
  let wired = 0;
  let placeholderDeferred = 0;
  let noMatch = 0;

  for (const row of sourceResps) {
    const matches = refineMatches(row);
    const isPlaceholder = row.content_status === "placeholder";

    if (isPlaceholder) {
      placeholderDeferred += 1;
      const next: ResponsibilityRow = {
        ...row,
        kpi_relationship: [],
        review_status: "draft",
        completion_evidence_requirement: "awaiting_field_plan_content",
      };
      responsibilities.push(next);
      bindings.push({
        responsibility_id: row.stable_id,
        canonical_key: row.canonical_key,
        phase: row.phase,
        kpi_ids: [],
        evidence_requirements: [],
        review_status: "draft",
        content_status: row.content_status,
        task_template_ids: row.task_template_ids ?? [],
        wiring_status: "placeholder_deferred",
      });
      continue;
    }

    const kpiIds = matches.map((m) => m.stable_id);
    const evidence = [
      ...new Set([
        ...matches.map((m) => m.evidence),
        "operator_review_of_field_plan_source",
      ]),
    ];

    if (!kpiIds.length) {
      noMatch += 1;
      const next: ResponsibilityRow = {
        ...row,
        kpi_relationship: [],
        review_status: "queued_for_review",
        completion_evidence_requirement: row.completion_evidence_requirement,
      };
      responsibilities.push(next);
      bindings.push({
        responsibility_id: row.stable_id,
        canonical_key: row.canonical_key,
        phase: row.phase,
        kpi_ids: [],
        evidence_requirements: [],
        review_status: "queued_for_review",
        content_status: row.content_status,
        task_template_ids: row.task_template_ids ?? [],
        wiring_status: "no_matching_kpi",
      });
      continue;
    }

    wired += 1;
    approved += 1;
    const next: ResponsibilityRow = {
      ...row,
      kpi_relationship: kpiIds,
      review_status: "approved",
      completion_evidence_requirement: evidence.join(" | "),
    };
    responsibilities.push(next);
    bindings.push({
      responsibility_id: row.stable_id,
      canonical_key: row.canonical_key,
      phase: row.phase,
      kpi_ids: kpiIds,
      evidence_requirements: evidence,
      review_status: "approved",
      content_status: row.content_status,
      task_template_ids: row.task_template_ids ?? [],
      wiring_status: "wired",
    });
  }

  const approvedIds = new Set(
    responsibilities.filter((r) => r.review_status === "approved").map((r) => r.stable_id),
  );

  const task_templates: TaskTemplateRow[] = sourceTemplates.map((t) => ({
    ...t,
    assignment_policy: "not_assigned_until_postgres_rbac",
    review_status: approvedIds.has(t.linked_responsibility_id) ? "approved" : t.review_status,
  }));

  const templatesApproved = task_templates.filter((t) => t.review_status === "approved").length;

  return {
    generated_at: new Date().toISOString(),
    phase: "V2-B.4",
    catalog_count: listKpis().length,
    bindings,
    responsibilities,
    task_templates,
    summary: {
      catalog_kpis: listKpis().length,
      responsibilities_considered: sourceResps.length,
      bindings_wired: wired,
      placeholders_deferred: placeholderDeferred,
      no_matching_kpi: noMatch,
      responsibilities_approved: approved,
      task_templates_approved: templatesApproved,
      task_templates_total: task_templates.length,
      personnel_assignments: 0,
    },
  };
}
