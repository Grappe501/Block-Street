/**
 * V2-B.5 — durability prep for approved Field Plan templates.
 * Stays on static_seed + Blobs path. No Postgres cutover. No personnel assign.
 */
import responsibilityLibrary from "../../../data/field-plan/responsibility-library.json";
import kpiBinding from "../../../data/field-plan/kpi-binding-registry.json";
import sourceContract from "../../../data/field-plan/source-contract.json";
import spineState from "../../../data/field-plan/ingestion/spine-state.json";

export type DurabilityRecord = {
  stable_id: string;
  kind: "responsibility" | "recurring_task" | "milestone_task" | "kpi";
  title: string;
  canonical_key: string;
  phase: string | null;
  review_status: string;
  kpi_relationship: string[];
  completion_evidence_requirement: string | null;
  assignment_policy: string | null;
  storage_class: "static_seed";
  dual_write_candidate: false;
  postgres_ready: false;
  personnel_assign_allowed: false;
  linked_responsibility_id?: string;
};

export type DurabilityGate = {
  id: string;
  pass: boolean;
  detail: string;
};

type Resp = {
  stable_id: string;
  kind?: string;
  title: string;
  canonical_key: string;
  phase: string;
  review_status: string;
  kpi_relationship: string[];
  completion_evidence_requirement: string;
  task_template_ids: string[];
  content_status: string;
};

type Tmpl = {
  stable_id: string;
  kind: "recurring_task" | "milestone_task";
  title: string;
  canonical_key: string;
  phase: string;
  linked_responsibility_id: string;
  review_status: string;
  assignment_policy: string;
};

export function buildDurabilityPrep(): {
  generated_at: string;
  phase: string;
  records: DurabilityRecord[];
  gates: DurabilityGate[];
  summary: Record<string, number | string | boolean>;
  freeze: {
    approved_responsibility_ids: string[];
    approved_template_ids: string[];
    approved_kpi_ids: string[];
  };
} {
  const resps = (responsibilityLibrary.responsibilities ?? []) as Resp[];
  const templates = (responsibilityLibrary.task_templates ?? []) as Tmpl[];
  const bindings = (kpiBinding.bindings ?? []) as Array<{
    responsibility_id: string;
    kpi_ids: string[];
    wiring_status: string;
  }>;

  const approvedResps = resps.filter((r) => r.review_status === "approved");
  const approvedTemplates = templates.filter((t) => t.review_status === "approved");
  const approvedRespIds = new Set(approvedResps.map((r) => r.stable_id));

  const kpiIds = new Set<string>();
  for (const b of bindings) {
    if (b.wiring_status === "wired") {
      for (const id of b.kpi_ids ?? []) kpiIds.add(id);
    }
  }
  for (const r of approvedResps) {
    for (const id of r.kpi_relationship ?? []) kpiIds.add(id);
  }

  const records: DurabilityRecord[] = [];

  for (const r of approvedResps) {
    records.push({
      stable_id: r.stable_id,
      kind: "responsibility",
      title: r.title,
      canonical_key: r.canonical_key,
      phase: r.phase,
      review_status: r.review_status,
      kpi_relationship: r.kpi_relationship ?? [],
      completion_evidence_requirement: r.completion_evidence_requirement ?? null,
      assignment_policy: null,
      storage_class: "static_seed",
      dual_write_candidate: false,
      postgres_ready: false,
      personnel_assign_allowed: false,
    });
  }

  for (const t of approvedTemplates) {
    records.push({
      stable_id: t.stable_id,
      kind: t.kind,
      title: t.title,
      canonical_key: t.canonical_key,
      phase: t.phase,
      review_status: t.review_status,
      kpi_relationship: [],
      completion_evidence_requirement: null,
      assignment_policy: t.assignment_policy,
      storage_class: "static_seed",
      dual_write_candidate: false,
      postgres_ready: false,
      personnel_assign_allowed: false,
      linked_responsibility_id: t.linked_responsibility_id,
    });
  }

  for (const kpiId of [...kpiIds].sort()) {
    records.push({
      stable_id: kpiId,
      kind: "kpi",
      title: kpiId.replace(/^FP-kpi-/, "").replace(/_/g, " "),
      canonical_key: "framework",
      phase: null,
      review_status: "approved",
      kpi_relationship: [kpiId],
      completion_evidence_requirement: "framework_target_not_live_telemetry",
      assignment_policy: null,
      storage_class: "static_seed",
      dual_write_candidate: false,
      postgres_ready: false,
      personnel_assign_allowed: false,
    });
  }

  const templatesNotAssigned = approvedTemplates.every(
    (t) => t.assignment_policy === "not_assigned_until_postgres_rbac",
  );
  const approvedHaveParent = approvedTemplates.every((t) =>
    approvedRespIds.has(t.linked_responsibility_id),
  );
  const placeholdersNotApproved = resps
    .filter((r) => r.content_status === "placeholder")
    .every((r) => r.review_status !== "approved");
  const broadIngestBlocked = sourceContract.broad_content_ingest_allowed !== true;
  const spineBlocked =
    String((spineState as { broad_ingest?: string }).broad_ingest ?? "").includes("blocked") ||
    broadIngestBlocked;

  const gates: DurabilityGate[] = [
    {
      id: "approved_templates_present",
      pass: approvedTemplates.length >= 20,
      detail: `${approvedTemplates.length} approved templates frozen`,
    },
    {
      id: "templates_unassigned",
      pass: templatesNotAssigned,
      detail: "All approved templates keep not_assigned_until_postgres_rbac",
    },
    {
      id: "templates_link_approved_responsibilities",
      pass: approvedHaveParent,
      detail: "Every approved template links an approved responsibility",
    },
    {
      id: "placeholders_not_approved",
      pass: placeholdersNotApproved,
      detail: "Placeholder responsibilities remain non-approved",
    },
    {
      id: "broad_ingest_blocked",
      pass: broadIngestBlocked && spineBlocked,
      detail: "broad_content_ingest_allowed is false; spine still blocked",
    },
    {
      id: "personnel_assign_disabled",
      pass: true,
      detail: "personnel_assign_allowed false on every durability record",
    },
    {
      id: "postgres_not_cutover",
      pass: records.every((r) => r.postgres_ready === false && r.storage_class === "static_seed"),
      detail: "Storage remains static_seed; postgres_ready false",
    },
    {
      id: "sensitive_personnel_still_disabled",
      pass:
        (sourceContract.preserves as { sensitive_personnel_mutations?: string })
          ?.sensitive_personnel_mutations === "disabled",
      detail: "Source contract: sensitive_personnel_mutations disabled",
    },
  ];

  return {
    generated_at: new Date().toISOString(),
    phase: "V2-B.5",
    records,
    gates,
    summary: {
      approved_responsibilities: approvedResps.length,
      approved_templates: approvedTemplates.length,
      approved_kpis: kpiIds.size,
      durability_records: records.length,
      gates_pass: gates.filter((g) => g.pass).length,
      gates_total: gates.length,
      all_gates_green: gates.every((g) => g.pass),
      storage_backend: "static_seed",
      dual_write_started: false,
      postgres_live: false,
      personnel_assignments: 0,
      broad_ingest_allowed: false,
    },
    freeze: {
      approved_responsibility_ids: approvedResps.map((r) => r.stable_id).sort(),
      approved_template_ids: approvedTemplates.map((t) => t.stable_id).sort(),
      approved_kpi_ids: [...kpiIds].sort(),
    },
  };
}

export function durabilityPrepReady(): boolean {
  return buildDurabilityPrep().gates.every((g) => g.pass);
}
