/**
 * CAE-11.6-W3 — Workforce certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getWorkforceConstitution, OPS_WORKFORCE_PRINCIPLE, REQUIRED_WORKFORCE_SERVICES } from "./constitution";
import { checkOpsW3Invariants, OPS_W3_INVARIANTS } from "./invariants";
import { allOpsW3TestsPassed, runOpsW3WorkforceTests } from "./w3-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/03_WORKFORCE_MANAGEMENT_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/WORKFORCE_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/WORKFORCE_CAPACITY.md",
  "docs/phase-11/11.6-institutional-operations/WORKFORCE_ASSIGNMENTS.md",
  "docs/phase-11/11.6-institutional-operations/WORKFORCE_AI_BOUNDARIES.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_3_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/workforce_vocabulary.json",
  "data/phase-11/workforce_status.json",
  "data/phase-11/workforce_hierarchy.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/workforce/constitution.ts",
  "src/lib/civic-action/builds/11.6/workforce/data-model.ts",
  "src/lib/civic-action/builds/11.6/workforce/services/workforce-service.ts",
  "src/app/api/v1/workforce/dashboard/route.ts",
];

export interface Wave3Certification {
  wave_id: "11.6-W3";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Human Work Management, Capacity & Workforce Intelligence";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW3Certification(): Wave3Certification {
  const constitution = getWorkforceConstitution();
  const registry = loadRequirementsRegistry();
  const w3Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W3");
  const testResults = runOpsW3WorkforceTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/workforce_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/workforce_vocabulary.json"), "utf8"))
    : { terms: [] };
  const status = existsSync(join(ROOT, "data/phase-11/workforce_status.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/workforce_status.json"), "utf8"))
    : { statuses: [] };
  const hierarchy = existsSync(join(ROOT, "data/phase-11/workforce_hierarchy.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/workforce_hierarchy.json"), "utf8"))
    : { levels: [] };

  const gates = [
    { id: "CAE-11.6-W3-G01", name: "Workforce principle", passed: constitution.governing_principle === OPS_WORKFORCE_PRINCIPLE, detail: "optimizes work not people" },
    { id: "CAE-11.6-W3-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.6-W3-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + status + hierarchy" },
    { id: "CAE-11.6-W3-G04", name: "Workforce hierarchy", passed: hierarchy.levels?.length >= 10, detail: `${hierarchy.levels?.length ?? 0} levels` },
    { id: "CAE-11.6-W3-G05", name: "Workforce statuses", passed: status.statuses?.length === 8, detail: `${status.statuses?.length ?? 0} statuses` },
    { id: "CAE-11.6-W3-G06", name: "W3 requirements", passed: w3Reqs.length >= 30 && w3Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w3Reqs.length} requirements` },
    { id: "CAE-11.6-W3-G07", name: "Workforce services", passed: REQUIRED_WORKFORCE_SERVICES.length === 15, detail: REQUIRED_WORKFORCE_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.6-W3-G08", name: "Workforce tests", passed: allOpsW3TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.6-W3-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.6-W3-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkOpsW3Invariants().map((inv) => ({
      id: inv.id,
      name: OPS_W3_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW3TestsPassed();

  return {
    wave_id: "11.6-W3",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Human Work Management, Capacity & Workforce Intelligence",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW3Complete(): boolean {
  return runOpsW3Certification().all_passed;
}
