/**
 * npm run test:v2b3-responsibility-library
 */
import assert from "assert";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { buildResponsibilityLibrary } from "../src/lib/field-plan/responsibility-library";

const root = process.cwd();
const result = buildResponsibilityLibrary();

assert.ok(result.summary.mapped_canonical_positions >= 10, "mapped seats expected");
assert.ok(result.summary.responsibilities >= 20, "phase expansion should produce many responsibilities");
assert.ok(result.summary.task_templates >= 15, "scaffolds expected for content-backed seats");
assert.ok(result.skipped_unmapped.includes("media_lead"));
assert.ok(result.skipped_unmapped.includes("logistics_lead"));
assert.ok(
  !result.responsibilities.some((r) => r.canonical_key === "media_lead" || r.canonical_key === "logistics_lead"),
  "unmapped must not enter library",
);
assert.ok(
  !result.responsibilities.some((r) => result.skipped_deferred_central.includes(r.canonical_key)),
  "central deferred must not enter library",
);
assert.ok(result.responsibilities.every((r) => r.expandable === true));
assert.ok(result.responsibilities.every((r) => r.kind === "responsibility"));
assert.ok(result.responsibilities.some((r) => r.canonical_key === "event_lead" && r.phase === "before_event"));
assert.ok(result.responsibilities.some((r) => r.content_status === "placeholder"));
assert.ok(result.task_templates.every((t) => t.assignment_policy === "not_assigned_until_postgres_rbac"));

const required = [
  "stable_id",
  "source_reference",
  "command_level",
  "position_owner",
  "frequency_or_deadline",
  "kpi_relationship",
  "completion_evidence_requirement",
  "sensitivity_classification",
  "version",
  "review_status",
] as const;
for (const r of result.responsibilities) {
  for (const f of required) {
    assert.ok((r as Record<string, unknown>)[f] !== undefined && (r as Record<string, unknown>)[f] !== null, `${r.stable_id} missing ${f}`);
  }
}

const libPath = join(root, "data/field-plan/responsibility-library.json");
assert.ok(existsSync(libPath), "run npm run field-plan:build-responsibility-library before ship");
const library = JSON.parse(readFileSync(libPath, "utf8"));
assert.ok(
  library.phase === "V2-B.3" || library.phase === "V2-B.4",
  `library phase should be V2-B.3+ (got ${library.phase})`,
);
assert.strictEqual(library.policy.bound_to_mapped_only, true);
assert.ok(library.summary.responsibilities >= 20);

console.log("v2b3-responsibility-library tests passed", result.summary);
