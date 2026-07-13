/**
 * CAE-11.6-W1 — Strategic Planning Constitution certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { getOperationsConstitution, OPS_GOVERNING_PRINCIPLE, REQUIRED_DOMAIN_SERVICES } from "./constitution";
import { checkOpsW1Invariants, OPS_W1_INVARIANTS } from "./invariants";
import { allOpsW1TestsPassed, runOpsW1StrategyTests } from "./w1-tests";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/01_CONSTITUTION.md",
  "docs/phase-11/11.6-institutional-operations/STRATEGY_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/STRATEGY_TRACEABILITY_STANDARD.md",
  "docs/phase-11/11.6-institutional-operations/STRATEGY_AI_BOUNDARIES.md",
  "docs/phase-11/11.6-institutional-operations/STRATEGY_SPANISH_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/STRATEGIC_HIERARCHY.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_1_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/strategy_vocabulary.json",
  "data/phase-11/strategy_hierarchy.json",
  "data/phase-11/strategy_planning_horizons.json",
  "data/civic-action/requirements_registry.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/constitution.ts",
  "src/lib/civic-action/builds/11.6/invariants.ts",
  "src/lib/civic-action/builds/11.6/data-model.ts",
  "src/lib/civic-action/builds/11.6/services/strategic-planning-service.ts",
  "src/app/api/v1/strategy/dashboard/route.ts",
  "src/app/api/v1/strategy/goals/route.ts",
];

export interface Wave1Certification {
  wave_id: "11.6-W1";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Mission, Vision & Strategic Planning Engine";
  certified_at: string | null;
  all_passed: boolean;
  documentation_complete: boolean;
  technical_enforcement: "planned_w2_w16";
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW1Certification(): Wave1Certification {
  const constitution = getOperationsConstitution();
  const invariants = checkOpsW1Invariants();
  const registry = loadRequirementsRegistry();
  const w1Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W1");
  const testResults = runOpsW1StrategyTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/strategy_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/strategy_vocabulary.json"), "utf8"))
    : { terms: [] };
  const hierarchy = existsSync(join(ROOT, "data/phase-11/strategy_hierarchy.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/strategy_hierarchy.json"), "utf8"))
    : { levels: [] };
  const horizons = existsSync(join(ROOT, "data/phase-11/strategy_planning_horizons.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/strategy_planning_horizons.json"), "utf8"))
    : { horizons: [] };

  const gates = [
    {
      id: "CAE-11.6-W1-G01",
      name: "Governing principle",
      passed: constitution.governing_principle === OPS_GOVERNING_PRINCIPLE,
      detail: OPS_GOVERNING_QUESTION,
    },
    {
      id: "CAE-11.6-W1-G02",
      name: "Documentation spine",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} docs`,
    },
    {
      id: "CAE-11.6-W1-G03",
      name: "Machine-readable contracts",
      passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))),
      detail: "vocabulary + hierarchy + horizons",
    },
    {
      id: "CAE-11.6-W1-G04",
      name: "Strategic hierarchy",
      passed: hierarchy.levels?.length >= 14,
      detail: `${hierarchy.levels?.length ?? 0} levels`,
    },
    {
      id: "CAE-11.6-W1-G05",
      name: "Vocabulary registry",
      passed: (vocabulary.terms?.length ?? 0) >= 20,
      detail: `${vocabulary.terms?.length ?? 0} terms`,
    },
    {
      id: "CAE-11.6-W1-G06",
      name: "W1 requirements",
      passed: w1Reqs.length >= 30 && w1Reqs.every((r) => r.status === "documented" || r.status === "implemented"),
      detail: `${w1Reqs.length} requirements`,
    },
    {
      id: "CAE-11.6-W1-G07",
      name: "No orphan work",
      passed: constitution.commitments.some((c) => c.toLowerCase().includes("orphan") || c.toLowerCase().includes("trace")),
      detail: "traceability commitments",
    },
    {
      id: "CAE-11.6-W1-G08",
      name: "AI plan prohibition",
      passed: constitution.ai_may_not.some((s) => s.toLowerCase().includes("autonomously") || s.toLowerCase().includes("without human")),
      detail: `${constitution.ai_may_not.length} prohibitions`,
    },
    {
      id: "CAE-11.6-W1-G09",
      name: "Spanish vocabulary",
      passed: Object.keys(constitution.spanish_glossary).length >= 15,
      detail: `${Object.keys(constitution.spanish_glossary).length} terms`,
    },
    {
      id: "CAE-11.6-W1-G10",
      name: "Planning horizons",
      passed: horizons.horizons?.length === 8,
      detail: `${horizons.horizons?.length ?? 0} horizons`,
    },
    {
      id: "CAE-11.6-W1-G11",
      name: "Required services",
      passed: REQUIRED_DOMAIN_SERVICES.length === 15,
      detail: REQUIRED_DOMAIN_SERVICES.slice(0, 3).join(", ") + "...",
    },
    {
      id: "CAE-11.6-W1-G12",
      name: "Strategy tests",
      passed: allOpsW1TestsPassed(),
      detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}`,
    },
    {
      id: "CAE-11.6-W1-G13",
      name: "API and service code",
      passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CODE.length} artifacts`,
    },
    ...invariants.map((inv) => ({
      id: inv.id,
      name: OPS_W1_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW1TestsPassed();

  return {
    wave_id: "11.6-W1",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Mission, Vision & Strategic Planning Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    documentation_complete: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
    technical_enforcement: "planned_w2_w16",
    gates,
    test_results: testResults,
  };
}

export function getOpsW1Overview() {
  return {
    constitution: getOperationsConstitution(),
    invariants: checkOpsW1Invariants(),
    certification: runOpsW1Certification(),
  };
}

export function isOpsW1Complete(): boolean {
  return runOpsW1Certification().documentation_complete && allOpsW1TestsPassed();
}

const OPS_GOVERNING_QUESTION = 'Why are we doing this?';
