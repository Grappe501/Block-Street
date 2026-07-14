/**
 * V2-B.4 — wire KPI catalog into responsibility library; write binding registry.
 * npm run field-plan:wire-kpis
 */
import fs from "fs";
import path from "path";
import { wireFieldPlanKpis } from "../../src/lib/field-plan/kpi-wiring";

const root = process.cwd();
const result = wireFieldPlanKpis();

const libraryPath = path.join(root, "data/field-plan/responsibility-library.json");
const library = JSON.parse(fs.readFileSync(libraryPath, "utf8"));
library.phase = "V2-B.4";
library.generated_at = result.generated_at;
library.policy = {
  ...(library.policy ?? {}),
  kpi_wiring: "v2b4_bound_for_content_backed_rows",
  placeholders_remain_draft: true,
  task_templates_not_assigned_to_personnel: true,
  operator_review_resolution: "content_backed_auto_approved_on_kpi_bind",
};
library.summary = {
  ...(library.summary ?? {}),
  ...result.summary,
  responsibilities: result.responsibilities.length,
  task_templates: result.task_templates.length,
};
library.responsibilities = result.responsibilities;
library.task_templates = result.task_templates;
fs.writeFileSync(libraryPath, JSON.stringify(library, null, 2) + "\n");

const registry = {
  version: "1.0.0",
  phase: "V2-B.4",
  generated_at: result.generated_at,
  authority: "docs/v2/V2B4_KPI_WIRING.md",
  catalog: "data/field-plan/kpi-catalog.json",
  responsibility_library: "data/field-plan/responsibility-library.json",
  policy: {
    mapped_content_only: true,
    placeholders_not_auto_approved: true,
    no_personnel_assignment: true,
    broad_ingest_blocked: true,
    framework_targets_not_live_telemetry: true,
  },
  summary: result.summary,
  bindings: result.bindings,
};
fs.writeFileSync(
  path.join(root, "data/field-plan/kpi-binding-registry.json"),
  JSON.stringify(registry, null, 2) + "\n",
);

const spinePath = path.join(root, "data/field-plan/ingestion/spine-state.json");
const spine = JSON.parse(fs.readFileSync(spinePath, "utf8"));
spine.phase = "V2-B.4";
spine.updated = result.generated_at;
spine.status = "kpi_wiring_complete_placeholders_awaiting_content";
spine.kpi_catalog = "data/field-plan/kpi-catalog.json";
spine.kpi_binding_registry = "data/field-plan/kpi-binding-registry.json";
spine.broad_ingest = "blocked_until_gates_pass";
spine.notes = [
  ...(spine.notes ?? []),
  `V2-B.4 KPI wiring: ${result.summary.bindings_wired} wired · ${result.summary.responsibilities_approved} approved · ${result.summary.placeholders_deferred} placeholders deferred · 0 personnel assigns`,
];
fs.writeFileSync(spinePath, JSON.stringify(spine, null, 2) + "\n");

const lineagePath = path.join(root, "data/field-plan/ingestion/lineage-log.json");
const lineage = JSON.parse(fs.readFileSync(lineagePath, "utf8"));
lineage.updated = result.generated_at;
lineage.entries = lineage.entries ?? [];
lineage.entries.push({
  at: result.generated_at,
  event: "v2b4_kpi_wiring_run",
  artifacts: [
    "data/field-plan/kpi-catalog.json",
    "data/field-plan/kpi-binding-registry.json",
    "data/field-plan/responsibility-library.json",
  ],
  summary: result.summary,
  broad_ingest: false,
  personnel_assignment: false,
});
fs.writeFileSync(lineagePath, JSON.stringify(lineage, null, 2) + "\n");

console.log("field-plan:wire-kpis OK", result.summary);
