/**
 * CAE-11.6-W2 — Mission Execution Engine certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getMissionExecutionConstitution, OPS_EXECUTION_PRINCIPLE, REQUIRED_EXECUTION_SERVICES } from "./constitution";
import { checkOpsW2Invariants, OPS_W2_INVARIANTS } from "./invariants";
import { allOpsW2TestsPassed, runOpsW2MissionTests } from "./w2-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/02_MISSION_EXECUTION_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/MISSION_EXECUTION_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/MISSION_LIFECYCLE.md",
  "docs/phase-11/11.6-institutional-operations/MISSION_TRACEABILITY.md",
  "docs/phase-11/11.6-institutional-operations/MISSION_AI_BOUNDARIES.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_2_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/operations_mission_vocabulary.json",
  "data/phase-11/operations_mission_lifecycle.json",
  "data/phase-11/operations_mission_hierarchy.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/execution/constitution.ts",
  "src/lib/civic-action/builds/11.6/execution/data-model.ts",
  "src/lib/civic-action/builds/11.6/execution/state-machines.ts",
  "src/lib/civic-action/builds/11.6/execution/services/mission-execution-service.ts",
  "src/app/api/v1/operations/missions/route.ts",
];

export interface Wave2Certification {
  wave_id: "11.6-W2";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Mission Execution Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW2Certification(): Wave2Certification {
  const constitution = getMissionExecutionConstitution();
  const invariants = checkOpsW2Invariants();
  const registry = loadRequirementsRegistry();
  const w2Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W2");
  const testResults = runOpsW2MissionTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/operations_mission_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/operations_mission_vocabulary.json"), "utf8"))
    : { terms: [] };
  const lifecycle = existsSync(join(ROOT, "data/phase-11/operations_mission_lifecycle.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/operations_mission_lifecycle.json"), "utf8"))
    : { states: [] };
  const hierarchy = existsSync(join(ROOT, "data/phase-11/operations_mission_hierarchy.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/operations_mission_hierarchy.json"), "utf8"))
    : { levels: [] };

  const gates = [
    {
      id: "CAE-11.6-W2-G01",
      name: "Execution principle",
      passed: constitution.governing_principle === OPS_EXECUTION_PRINCIPLE,
      detail: "Missions as operational unit",
    },
    {
      id: "CAE-11.6-W2-G02",
      name: "Documentation spine",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} docs`,
    },
    {
      id: "CAE-11.6-W2-G03",
      name: "Machine-readable contracts",
      passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))),
      detail: "vocabulary + lifecycle + hierarchy",
    },
    {
      id: "CAE-11.6-W2-G04",
      name: "Mission hierarchy",
      passed: hierarchy.levels?.length >= 12,
      detail: `${hierarchy.levels?.length ?? 0} levels`,
    },
    {
      id: "CAE-11.6-W2-G05",
      name: "Lifecycle states",
      passed: lifecycle.states?.length === 13,
      detail: `${lifecycle.states?.length ?? 0} states`,
    },
    {
      id: "CAE-11.6-W2-G06",
      name: "W2 requirements",
      passed: w2Reqs.length >= 30 && w2Reqs.every((r) => r.status === "documented" || r.status === "implemented"),
      detail: `${w2Reqs.length} requirements`,
    },
    {
      id: "CAE-11.6-W2-G07",
      name: "Execution services",
      passed: REQUIRED_EXECUTION_SERVICES.length === 17,
      detail: REQUIRED_EXECUTION_SERVICES.slice(0, 3).join(", ") + "...",
    },
    {
      id: "CAE-11.6-W2-G08",
      name: "Mission tests",
      passed: allOpsW2TestsPassed(),
      detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}`,
    },
    {
      id: "CAE-11.6-W2-G09",
      name: "API and service code",
      passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CODE.length} artifacts`,
    },
    {
      id: "CAE-11.6-W2-G10",
      name: "Vocabulary registry",
      passed: (vocabulary.terms?.length ?? 0) >= 18,
      detail: `${vocabulary.terms?.length ?? 0} terms`,
    },
    ...invariants.map((inv) => ({
      id: inv.id,
      name: OPS_W2_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW2TestsPassed();

  return {
    wave_id: "11.6-W2",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Mission Execution Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW2Complete(): boolean {
  return runOpsW2Certification().all_passed;
}
