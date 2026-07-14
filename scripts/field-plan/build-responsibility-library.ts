/**
 * V2-B.3 — generate expandable responsibility library from mapped positions.
 * npm run field-plan:build-responsibility-library
 */
import fs from "fs";
import path from "path";
import { buildResponsibilityLibrary } from "../../src/lib/field-plan/responsibility-library";

const root = process.cwd();
const result = buildResponsibilityLibrary();

const library = {
  version: "1.0.0",
  phase: "V2-B.3",
  generated_at: result.generated_at,
  authority: "docs/v2/V2B3_RESPONSIBILITY_LIBRARY.md",
  mapping_registry: "data/field-plan/position-mapping-registry.json",
  role_content: "data/field-plan/position-content.json",
  policy: {
    bound_to_mapped_only: true,
    no_silent_assign_unmapped: true,
    task_templates_not_assigned_to_personnel: true,
    kpi_wiring: "deferred_to_later_b3_plus",
    do_not_invent_doctrine: true,
  },
  summary: result.summary,
  skipped_unmapped: result.skipped_unmapped,
  skipped_conflict: result.skipped_conflict,
  skipped_deferred_central: result.skipped_deferred_central,
  responsibilities: result.responsibilities,
  task_templates: result.task_templates,
};

fs.writeFileSync(
  path.join(root, "data/field-plan/responsibility-library.json"),
  JSON.stringify(library, null, 2) + "\n",
);

const spinePath = path.join(root, "data/field-plan/ingestion/spine-state.json");
const spine = JSON.parse(fs.readFileSync(spinePath, "utf8"));
spine.phase = "V2-B.3";
spine.updated = result.generated_at;
spine.status = "responsibility_library_generated_awaiting_operator_review";
spine.responsibility_library = "data/field-plan/responsibility-library.json";
spine.broad_ingest = "blocked_until_gates_pass";
spine.notes = [
  ...(spine.notes ?? []),
  `V2-B.3 library: ${result.summary.responsibilities} responsibilities · ${result.summary.task_templates} task scaffolds · ${result.summary.mapped_canonical_positions} mapped seats`,
];
fs.writeFileSync(spinePath, JSON.stringify(spine, null, 2) + "\n");

const lineagePath = path.join(root, "data/field-plan/ingestion/lineage-log.json");
const lineage = JSON.parse(fs.readFileSync(lineagePath, "utf8"));
lineage.updated = result.generated_at;
lineage.entries = lineage.entries ?? [];
lineage.entries.push({
  at: result.generated_at,
  event: "v2b3_responsibility_library_build",
  artifacts: ["data/field-plan/responsibility-library.json"],
  summary: result.summary,
  broad_ingest: false,
  personnel_assignment: false,
});
fs.writeFileSync(lineagePath, JSON.stringify(lineage, null, 2) + "\n");

console.log("field-plan:build-responsibility-library OK", result.summary);
