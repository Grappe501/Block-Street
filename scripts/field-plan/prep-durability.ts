/**
 * V2-B.5 — freeze approved Field Plan templates for durability prep.
 * npm run field-plan:prep-durability
 */
import fs from "fs";
import path from "path";
import { buildDurabilityPrep } from "../../src/lib/field-plan/durability-prep";

const root = process.cwd();
const result = buildDurabilityPrep();

if (!result.summary.all_gates_green) {
  console.error("field-plan:prep-durability FAILED gates", result.gates.filter((g) => !g.pass));
  process.exit(1);
}

const registry = {
  version: "1.0.0",
  phase: "V2-B.5",
  generated_at: result.generated_at,
  authority: "docs/v2/V2B5_DURABILITY_PREP.md",
  persistence_authority: "docs/v2/PRODUCTION_PERSISTENCE_FORENSIC_AUDIT.md",
  postgres_map: "data/v2/v2b-postgres-port-readiness-map.json",
  policy: {
    storage_class: "static_seed",
    dual_write_started: false,
    postgres_cutover: false,
    personnel_assignment: false,
    broad_ingest: false,
    invite_chain_certification: "pending_launch_blocker",
    approved_only: true,
  },
  summary: result.summary,
  gates: result.gates,
  freeze: result.freeze,
  records: result.records,
};

fs.writeFileSync(
  path.join(root, "data/field-plan/approved-template-durability-registry.json"),
  JSON.stringify(registry, null, 2) + "\n",
);

const mapPath = path.join(root, "data/v2/v2b-postgres-port-readiness-map.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
map.updated = result.generated_at;
map.entities = map.entities ?? [];
const fpIdx = map.entities.findIndex((e: { id: string }) => e.id === "field_plan_approved_templates");
const fpEntity = {
  id: "field_plan_approved_templates",
  class: "static_seed",
  note: "V2-B.5 freeze — Blobs dual-write later; no personnel assign; no Postgres cutover",
  approved_templates: result.summary.approved_templates,
  approved_responsibilities: result.summary.approved_responsibilities,
  twin: "data/field-plan/approved-template-durability-registry.json",
};
if (fpIdx >= 0) map.entities[fpIdx] = fpEntity;
else map.entities.push(fpEntity);
fs.writeFileSync(mapPath, JSON.stringify(map, null, 2) + "\n");

const spinePath = path.join(root, "data/field-plan/ingestion/spine-state.json");
const spine = JSON.parse(fs.readFileSync(spinePath, "utf8"));
spine.phase = "V2-B.5";
spine.updated = result.generated_at;
spine.status = "durability_prep_approved_templates_frozen";
spine.approved_template_durability_registry =
  "data/field-plan/approved-template-durability-registry.json";
spine.broad_ingest = "blocked_until_gates_pass";
spine.notes = [
  ...(spine.notes ?? []),
  `V2-B.5 durability prep: ${result.summary.approved_templates} templates · ${result.summary.approved_responsibilities} responsibilities · ${result.summary.approved_kpis} KPIs frozen on static_seed · 0 personnel · Postgres not live`,
];
fs.writeFileSync(spinePath, JSON.stringify(spine, null, 2) + "\n");

const lineagePath = path.join(root, "data/field-plan/ingestion/lineage-log.json");
const lineage = JSON.parse(fs.readFileSync(lineagePath, "utf8"));
lineage.updated = result.generated_at;
lineage.entries = lineage.entries ?? [];
lineage.entries.push({
  at: result.generated_at,
  event: "v2b5_durability_prep_freeze",
  artifacts: [
    "data/field-plan/approved-template-durability-registry.json",
    "data/v2/v2b-postgres-port-readiness-map.json",
  ],
  summary: result.summary,
  broad_ingest: false,
  personnel_assignment: false,
  postgres_cutover: false,
});
fs.writeFileSync(lineagePath, JSON.stringify(lineage, null, 2) + "\n");

console.log("field-plan:prep-durability OK", result.summary);
