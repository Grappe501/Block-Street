/**
 * CAE-11.6-W15 — Certification certification module
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getCertificationConstitution, OPS_CERTIFICATION_PRINCIPLE, REQUIRED_CERTIFICATION_SERVICES } from "./constitution";
import { checkOpsW15Invariants, OPS_W15_INVARIANTS } from "./invariants";
import { allOpsW15TestsPassed, runOpsW15CertificationTests } from "./w15-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/15_CERTIFICATION_READINESS_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/CERTIFICATION_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/READINESS_FRAMEWORK.md",
  "docs/phase-11/11.6-institutional-operations/COMPLIANCE_ENGINE.md",
  "docs/phase-11/11.6-institutional-operations/LAUNCH_READINESS.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_15_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/certification_vocabulary.json",
  "data/phase-11/certification_categories.json",
  "data/phase-11/readiness_levels.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/certification/constitution.ts",
  "src/lib/civic-action/builds/11.6/certification/w15.ts",
  "src/lib/civic-action/builds/11.6/certification/services/certification-service.ts",
  "src/app/api/v1/certifications/route.ts",
];

export interface Wave15Certification {
  wave_id: "11.6-W15";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Institutional Certification, Trust, Compliance & Operational Readiness Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW15Certification(): Wave15Certification {
  const constitution = getCertificationConstitution();
  const registry = loadRequirementsRegistry();
  const w15Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W15");
  const testResults = runOpsW15CertificationTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/certification_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/certification_vocabulary.json"), "utf8"))
    : { terms: [] };
  const categories = existsSync(join(ROOT, "data/phase-11/certification_categories.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/certification_categories.json"), "utf8"))
    : { categories: [] };
  const levels = existsSync(join(ROOT, "data/phase-11/readiness_levels.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/readiness_levels.json"), "utf8"))
    : { levels: [] };

  const gates = [
    { id: "CAE-11.6-W15-G01", name: "Certification principle", passed: constitution.governing_principle === OPS_CERTIFICATION_PRINCIPLE, detail: "verification not assumption" },
    { id: "CAE-11.6-W15-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.6-W15-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + categories + levels" },
    { id: "CAE-11.6-W15-G04", name: "Certification categories", passed: categories.categories?.length >= 20, detail: `${categories.categories?.length ?? 0} categories` },
    { id: "CAE-11.6-W15-G05", name: "Readiness levels", passed: levels.levels?.length >= 6, detail: `${levels.levels?.length ?? 0} levels` },
    { id: "CAE-11.6-W15-G06", name: "W15 requirements", passed: w15Reqs.length >= 30 && w15Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w15Reqs.length} requirements` },
    { id: "CAE-11.6-W15-G07", name: "Certification services", passed: REQUIRED_CERTIFICATION_SERVICES.length === 15, detail: REQUIRED_CERTIFICATION_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.6-W15-G08", name: "Certification tests", passed: allOpsW15TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.6-W15-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.6-W15-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkOpsW15Invariants().map((inv) => ({
      id: inv.id,
      name: OPS_W15_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW15TestsPassed();

  return {
    wave_id: "11.6-W15",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Institutional Certification, Trust, Compliance & Operational Readiness Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW15Complete(): boolean {
  return runOpsW15Certification().all_passed;
}
