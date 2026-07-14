/**
 * V2-B.3 — expandable responsibility library bound to mapped positions only.
 * Narratives from position-content become reviewable entities; hierarchy seats
 * without content get placeholder expandables. No invent of Field Plan doctrine.
 * Task templates are scaffolds only — never assigned to real personnel here.
 */
import positionContent from "../../../data/field-plan/position-content.json";
import mappingRegistry from "../../../data/field-plan/position-mapping-registry.json";
import fieldPlanContract from "../../../data/volunteer-command/field-plan-position-contract.json";

const PHASE_FIELDS: Array<{ phase: string; mode: "always_active" | "recurring" | "milestone"; contentKey: string }> = [
  { phase: "always_active", mode: "always_active", contentKey: "purpose" },
  { phase: "before_event", mode: "milestone", contentKey: "before_event" },
  { phase: "event_day", mode: "milestone", contentKey: "event_day" },
  { phase: "after_event", mode: "milestone", contentKey: "after_event" },
  { phase: "canvassing", mode: "recurring", contentKey: "canvassing" },
  { phase: "election_week", mode: "milestone", contentKey: "gotv" },
];

export type ResponsibilityRecord = {
  stable_id: string;
  kind: "responsibility";
  title: string;
  canonical_key: string;
  field_plan_key: string;
  phase: string;
  body: string;
  summary: string | null;
  source_reference: string;
  command_level: string | null;
  position_owner: string;
  reports_to: string[];
  scope_types: string[];
  dashboard_owner: string | null;
  frequency_or_deadline: { mode: string; cadence: string | null; deadline: string | null };
  kpi_relationship: string[];
  completion_evidence_requirement: string;
  sensitivity_classification: string;
  version: string;
  review_status: string;
  content_status: string;
  expandable: true;
  task_template_ids: string[];
  hierarchy_role: string | null;
  function_key: string | null;
};

export type TaskTemplateScaffold = {
  stable_id: string;
  kind: "recurring_task" | "milestone_task";
  title: string;
  linked_responsibility_id: string;
  canonical_key: string;
  phase: string;
  body_hint: string;
  assignment_policy: "not_assigned_until_postgres_rbac";
  review_status: "draft";
  version: string;
  source_reference: string;
};

type MappedRow = {
  field_plan_key: string;
  canonical_key: string;
  title: string;
  where_it_sits: string | null;
  who_supervises: string[] | null;
  geography_or_institution: string[];
  dashboard_owner: string | null;
  hierarchy_role: string | null;
  function_key: string | null;
  source_reference: string;
  status: string;
};

function contentFor(canonicalKey: string, fieldPlanKey: string): Record<string, string> | null {
  const byRole = positionContent.by_role_key as Record<string, Record<string, string>>;
  return byRole[canonicalKey] ?? byRole[fieldPlanKey] ?? null;
}

function templateKind(mode: string): "recurring_task" | "milestone_task" {
  return mode === "recurring" || mode === "always_active" ? "recurring_task" : "milestone_task";
}

function reviewFromContent(status: string | undefined): string {
  if (status === "approved") return "approved";
  if (status === "ingested" || status === "under_review") return "queued_for_review";
  return "draft";
}

export function buildResponsibilityLibrary(): {
  generated_at: string;
  phase: string;
  responsibilities: ResponsibilityRecord[];
  task_templates: TaskTemplateScaffold[];
  skipped_unmapped: string[];
  skipped_conflict: string[];
  skipped_deferred_central: string[];
  summary: Record<string, number>;
} {
  const mapped = (mappingRegistry.mapped ?? []) as MappedRow[];
  const skipped_unmapped = ((mappingRegistry.unmapped ?? []) as { field_plan_key: string }[]).map(
    (r) => r.field_plan_key,
  );
  const skipped_conflict = ((mappingRegistry.conflicts ?? []) as { field_plan_key: string }[]).map(
    (r) => r.field_plan_key,
  );
  const skipped_deferred_central = (
    (mappingRegistry.deferred_central ?? []) as { field_plan_key: string }[]
  ).map((r) => r.field_plan_key);

  // Deduplicate by canonical_key so social_media_lead alias does not double the library
  const byCanonical = new Map<string, MappedRow>();
  for (const row of mapped) {
    if (row.status !== "mapped") continue;
    if (!byCanonical.has(row.canonical_key)) byCanonical.set(row.canonical_key, row);
  }

  const responsibilities: ResponsibilityRecord[] = [];
  const task_templates: TaskTemplateScaffold[] = [];
  const placeholder = fieldPlanContract.placeholder_copy as string;

  for (const row of byCanonical.values()) {
    const content = contentFor(row.canonical_key, row.field_plan_key);
    const contentStatus = content?.content_status ?? "placeholder";
    const sourceRef = content?.source_reference ?? row.source_reference;

    if (content) {
      // Summary card — always expandable entry point
      const summaryId = `FP-resp-${row.canonical_key}-summary`;
      const summaryTemplateId = `FP-tmpl-${row.canonical_key}-summary`;
      responsibilities.push({
        stable_id: summaryId,
        kind: "responsibility",
        title: `${row.title} — role summary`,
        canonical_key: row.canonical_key,
        field_plan_key: row.field_plan_key,
        phase: "always_active",
        body: content.summary ?? content.purpose ?? placeholder,
        summary: content.summary ?? null,
        source_reference: sourceRef,
        command_level: row.where_it_sits,
        position_owner: row.canonical_key,
        reports_to: row.who_supervises ?? [],
        scope_types: row.geography_or_institution ?? [],
        dashboard_owner: row.dashboard_owner,
        frequency_or_deadline: { mode: "always_active", cadence: null, deadline: null },
        kpi_relationship: [],
        completion_evidence_requirement: "operator_review_of_field_plan_source",
        sensitivity_classification: "volunteer_internal",
        version: "0.1.0",
        review_status: reviewFromContent(contentStatus),
        content_status: contentStatus,
        expandable: true,
        task_template_ids: [summaryTemplateId],
        hierarchy_role: row.hierarchy_role,
        function_key: row.function_key,
      });
      task_templates.push({
        stable_id: summaryTemplateId,
        kind: "recurring_task",
        title: `${row.title}: hold role purpose`,
        linked_responsibility_id: summaryId,
        canonical_key: row.canonical_key,
        phase: "always_active",
        body_hint: content.purpose ?? content.summary ?? placeholder,
        assignment_policy: "not_assigned_until_postgres_rbac",
        review_status: "draft",
        version: "0.1.0",
        source_reference: sourceRef,
      });

      for (const pf of PHASE_FIELDS) {
        const body = content[pf.contentKey];
        if (!body || !String(body).trim()) continue;
        const respId = `FP-resp-${row.canonical_key}-${pf.phase}`;
        const tmplId = `FP-tmpl-${row.canonical_key}-${pf.phase}`;
        responsibilities.push({
          stable_id: respId,
          kind: "responsibility",
          title: `${row.title} — ${pf.phase.replace(/_/g, " ")}`,
          canonical_key: row.canonical_key,
          field_plan_key: row.field_plan_key,
          phase: pf.phase,
          body: String(body),
          summary: content.summary ?? null,
          source_reference: sourceRef,
          command_level: row.where_it_sits,
          position_owner: row.canonical_key,
          reports_to: row.who_supervises ?? [],
          scope_types: row.geography_or_institution ?? [],
          dashboard_owner: row.dashboard_owner,
          frequency_or_deadline: {
            mode: pf.mode,
            cadence: pf.mode === "recurring" ? "phase_window" : null,
            deadline: pf.mode === "milestone" ? pf.phase : null,
          },
          kpi_relationship: [],
          completion_evidence_requirement: "operator_review_of_field_plan_source",
          sensitivity_classification: "volunteer_internal",
          version: "0.1.0",
          review_status: reviewFromContent(contentStatus),
          content_status: contentStatus,
          expandable: true,
          task_template_ids: [tmplId],
          hierarchy_role: row.hierarchy_role,
          function_key: row.function_key,
        });
        task_templates.push({
          stable_id: tmplId,
          kind: templateKind(pf.mode),
          title: `${row.title}: ${pf.phase.replace(/_/g, " ")}`,
          linked_responsibility_id: respId,
          canonical_key: row.canonical_key,
          phase: pf.phase,
          body_hint: String(body).slice(0, 240),
          assignment_policy: "not_assigned_until_postgres_rbac",
          review_status: "draft",
          version: "0.1.0",
          source_reference: sourceRef,
        });
      }
    } else {
      const respId = `FP-resp-${row.canonical_key}-placeholder`;
      responsibilities.push({
        stable_id: respId,
        kind: "responsibility",
        title: `${row.title} — awaiting Field Plan responsibilities`,
        canonical_key: row.canonical_key,
        field_plan_key: row.field_plan_key,
        phase: "always_active",
        body: placeholder,
        summary: null,
        source_reference: row.source_reference,
        command_level: row.where_it_sits,
        position_owner: row.canonical_key,
        reports_to: row.who_supervises ?? [],
        scope_types: row.geography_or_institution ?? [],
        dashboard_owner: row.dashboard_owner,
        frequency_or_deadline: { mode: "always_active", cadence: null, deadline: null },
        kpi_relationship: [],
        completion_evidence_requirement: "awaiting_field_plan_content",
        sensitivity_classification: "leader_internal",
        version: "0.1.0",
        review_status: "draft",
        content_status: "placeholder",
        expandable: true,
        task_template_ids: [],
        hierarchy_role: row.hierarchy_role,
        function_key: row.function_key,
      });
    }
  }

  const uniqueCanonicals = byCanonical.size;
  const withContent = [...byCanonical.values()].filter((r) => contentFor(r.canonical_key, r.field_plan_key)).length;

  return {
    generated_at: new Date().toISOString(),
    phase: "V2-B.3",
    responsibilities,
    task_templates,
    skipped_unmapped,
    skipped_conflict,
    skipped_deferred_central,
    summary: {
      mapped_canonical_positions: uniqueCanonicals,
      positions_with_content: withContent,
      positions_placeholder: uniqueCanonicals - withContent,
      responsibilities: responsibilities.length,
      task_templates: task_templates.length,
      skipped_unmapped: skipped_unmapped.length,
      skipped_conflict: skipped_conflict.length,
      skipped_deferred_central: skipped_deferred_central.length,
    },
  };
}

export function responsibilitiesForCanonical(canonicalKey: string): ResponsibilityRecord[] {
  return buildResponsibilityLibrary().responsibilities.filter((r) => r.canonical_key === canonicalKey);
}
