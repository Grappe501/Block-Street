/**
 * CAE-11.6-W14 — Experience certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getExperienceConstitution, OPS_EXPERIENCE_PRINCIPLE, REQUIRED_EXPERIENCE_SERVICES } from "./constitution";
import { checkOpsW14Invariants, OPS_W14_INVARIANTS } from "./invariants";
import { allOpsW14TestsPassed, runOpsW14ExperienceTests } from "./w14-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/14_HUMAN_EXPERIENCE_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/EXPERIENCE_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/WORKSPACE_ENGINE.md",
  "docs/phase-11/11.6-institutional-operations/ADAPTIVE_DASHBOARD.md",
  "docs/phase-11/11.6-institutional-operations/UNIVERSAL_SEARCH.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_14_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/experience_vocabulary.json",
  "data/phase-11/workspace_types.json",
  "data/phase-11/universal_navigation.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/experience/constitution.ts",
  "src/lib/civic-action/builds/11.6/experience/w14.ts",
  "src/lib/civic-action/builds/11.6/experience/services/experience-service.ts",
  "src/app/api/v1/workspace/route.ts",
];

export interface Wave14Certification {
  wave_id: "11.6-W14";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Human Experience, Workspace & Adaptive Interface Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW14Certification(): Wave14Certification {
  const constitution = getExperienceConstitution();
  const registry = loadRequirementsRegistry();
  const w14Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W14");
  const testResults = runOpsW14ExperienceTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/experience_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/experience_vocabulary.json"), "utf8"))
    : { terms: [] };
  const types = existsSync(join(ROOT, "data/phase-11/workspace_types.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/workspace_types.json"), "utf8"))
    : { types: [] };
  const navigation = existsSync(join(ROOT, "data/phase-11/universal_navigation.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/universal_navigation.json"), "utf8"))
    : { items: [] };

  const gates = [
    { id: "CAE-11.6-W14-G01", name: "Experience principle", passed: constitution.governing_principle === OPS_EXPERIENCE_PRINCIPLE, detail: "one continuous experience" },
    { id: "CAE-11.6-W14-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.6-W14-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + types + navigation" },
    { id: "CAE-11.6-W14-G04", name: "Workspace types", passed: types.types?.length >= 14, detail: `${types.types?.length ?? 0} types` },
    { id: "CAE-11.6-W14-G05", name: "Universal navigation", passed: navigation.items?.length >= 12, detail: `${navigation.items?.length ?? 0} items` },
    { id: "CAE-11.6-W14-G06", name: "W14 requirements", passed: w14Reqs.length >= 30 && w14Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w14Reqs.length} requirements` },
    { id: "CAE-11.6-W14-G07", name: "Experience services", passed: REQUIRED_EXPERIENCE_SERVICES.length === 15, detail: REQUIRED_EXPERIENCE_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.6-W14-G08", name: "Experience tests", passed: allOpsW14TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.6-W14-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.6-W14-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkOpsW14Invariants().map((inv) => ({
      id: inv.id,
      name: OPS_W14_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW14TestsPassed();

  return {
    wave_id: "11.6-W14",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Human Experience, Workspace & Adaptive Interface Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW14Complete(): boolean {
  return runOpsW14Certification().all_passed;
}
