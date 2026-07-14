/**
 * V2-B.2 — generate position mapping registry and refresh queues.
 * npm run field-plan:map-positions
 */
import fs from "fs";
import path from "path";
import { mapFieldPlanPositions, mappingAnswersFor } from "../../src/lib/field-plan/position-mapper";

const root = process.cwd();
const result = mapFieldPlanPositions();

const registry = {
  version: "1.0.0",
  phase: "V2-B.2",
  generated_at: result.generated_at,
  authority: "docs/v2/V2B2_POSITION_MAPPING.md",
  rules: "data/field-plan/position-mapping-rules.json",
  summary: result.summary,
  mapped: result.mapped,
  unmapped: result.unmapped,
  conflicts: result.conflicts,
  deferred_central: result.deferred_central,
  mapping_questions: [
    "where_does_position_sit",
    "who_supervises",
    "geography_or_institution",
    "eventual_permissions",
    "dashboard_owner",
    "vacancy_behavior",
  ],
};

const reviewItems = [
  ...result.unmapped.map((r) => ({
    stable_id: r.stable_id,
    title: r.title,
    reason: r.reason ?? "unmapped",
    status: "unmapped",
    mapping_answers: mappingAnswersFor(r),
    queued_at: result.generated_at,
  })),
  ...result.deferred_central.map((r) => ({
    stable_id: r.stable_id,
    title: r.title,
    reason: r.reason ?? "deferred_central",
    status: "deferred_central",
    mapping_answers: mappingAnswersFor(r),
    queued_at: result.generated_at,
  })),
];

const conflictItems = result.conflicts.map((r) => ({
  stable_id: r.stable_id,
  title: r.title,
  reason: r.reason ?? "conflict",
  status: "conflict",
  mapping_answers: mappingAnswersFor(r),
  queued_at: result.generated_at,
}));

fs.mkdirSync(path.join(root, "data/field-plan/ingestion"), { recursive: true });
fs.writeFileSync(
  path.join(root, "data/field-plan/position-mapping-registry.json"),
  JSON.stringify(registry, null, 2) + "\n",
);
fs.writeFileSync(
  path.join(root, "data/field-plan/ingestion/review-queue.json"),
  JSON.stringify({ version: "1.0.0", updated: result.generated_at, phase: "V2-B.2", items: reviewItems }, null, 2) +
    "\n",
);
fs.writeFileSync(
  path.join(root, "data/field-plan/ingestion/conflict-queue.json"),
  JSON.stringify(
    { version: "1.0.0", updated: result.generated_at, phase: "V2-B.2", items: conflictItems },
    null,
    2,
  ) + "\n",
);

const spinePath = path.join(root, "data/field-plan/ingestion/spine-state.json");
const spine = JSON.parse(fs.readFileSync(spinePath, "utf8"));
spine.phase = "V2-B.2";
spine.updated = result.generated_at;
spine.status = "position_mapping_complete_awaiting_operator_review";
spine.position_mapping_registry = "data/field-plan/position-mapping-registry.json";
spine.broad_ingest = "blocked_until_gates_pass";
spine.notes = [
  ...(spine.notes ?? []),
  `V2-B.2 mapping: ${result.summary.mapped} mapped · ${result.summary.unmapped} unmapped · ${result.summary.conflicts} conflicts · ${result.summary.deferred_central} central deferred`,
];
fs.writeFileSync(spinePath, JSON.stringify(spine, null, 2) + "\n");

const lineagePath = path.join(root, "data/field-plan/ingestion/lineage-log.json");
const lineage = JSON.parse(fs.readFileSync(lineagePath, "utf8"));
lineage.updated = result.generated_at;
lineage.entries = lineage.entries ?? [];
lineage.entries.push({
  at: result.generated_at,
  event: "v2b2_position_mapping_run",
  artifacts: [
    "data/field-plan/position-mapping-registry.json",
    "data/field-plan/ingestion/review-queue.json",
    "data/field-plan/ingestion/conflict-queue.json",
  ],
  summary: result.summary,
  broad_ingest: false,
});
fs.writeFileSync(lineagePath, JSON.stringify(lineage, null, 2) + "\n");

console.log("field-plan:map-positions OK", result.summary);
