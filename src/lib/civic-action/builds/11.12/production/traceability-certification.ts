/**
 * CAE-11.12-W8 — Requirement traceability certification
 */
import { readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";

type RegistryRequirement = {
  id: string;
  build: string;
  wave: string;
  status: string;
  risk?: string;
  enforcement_layer?: string;
};

const ROOT = process.cwd();

export type RequirementCoverageRow = {
  requirement_id: string;
  wave: string;
  status: string;
  classification: "certified" | "tested" | "implemented" | "partial" | "deferred" | "not_implemented";
  has_enforcement_layer: boolean;
};

export type TraceabilityCertificationResult = {
  coverage_matrix: RequirementCoverageRow[];
  total_requirements: number;
  implemented_count: number;
  certified_count: number;
  deferred_count: number;
  not_implemented_count: number;
  untested_critical: number;
  failed_requirements: number;
  coverage_pct: number;
};

function classifyRequirement(status: string, enforcement: string): RequirementCoverageRow["classification"] {
  if (status === "deferred") return "deferred";
  if (status === "documented") return enforcement && enforcement !== "planned" ? "tested" : "partial";
  if (status !== "implemented") return "not_implemented";
  if (!enforcement || enforcement === "planned") return "partial";
  return "tested";
}

export function runKnowledgeTraceabilityCertification(): TraceabilityCertificationResult {
  const registry = loadRequirementsRegistry();
  const reqs = (registry.requirements as RegistryRequirement[]).filter((r) => r.build === "11.12");

  const coverage_matrix: RequirementCoverageRow[] = reqs.map((r) => ({
    requirement_id: r.id,
    wave: r.wave,
    status: r.status,
    classification: classifyRequirement(r.status, r.enforcement_layer ?? ""),
    has_enforcement_layer: !!(r.enforcement_layer && r.enforcement_layer !== "planned"),
  }));

  const implemented_count = coverage_matrix.filter((r) => r.status === "implemented").length;
  const certified_count = coverage_matrix.filter((r) => r.classification === "tested" || r.classification === "certified").length;
  const deferred_count = coverage_matrix.filter((r) => r.classification === "deferred").length;
  const not_implemented_count = coverage_matrix.filter((r) => r.classification === "not_implemented").length;
  const failed_requirements = coverage_matrix.filter(
    (r) => r.classification === "not_implemented" && r.status !== "deferred"
  ).length;

  const untested_critical = (registry.requirements as RegistryRequirement[]).filter(
    (r) =>
      r.build === "11.12" &&
      r.risk === "critical" &&
      r.status === "implemented" &&
      (!r.enforcement_layer || r.enforcement_layer === "planned")
  ).length;

  const manifestPath = join(ROOT, "data/phase-11/knowledge_production_manifest.json");
  let deferredFromManifest = 0;
  if (manifestPath) {
    try {
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
      deferredFromManifest = (manifest.deferred_requirements ?? []).length;
    } catch {
      /* ignore */
    }
  }

  return {
    coverage_matrix,
    total_requirements: reqs.length,
    implemented_count,
    certified_count,
    deferred_count: deferred_count + deferredFromManifest,
    not_implemented_count,
    untested_critical,
    failed_requirements,
    coverage_pct: reqs.length ? Math.round((implemented_count / reqs.length) * 100) : 0,
  };
}
