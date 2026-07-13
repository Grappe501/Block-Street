/**
 * CAE-11.6-W8 — Executive certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getExecutiveConstitution, OPS_EXECUTIVE_PRINCIPLE, REQUIRED_EXECUTIVE_SERVICES } from "./constitution";
import { checkOpsW8Invariants, OPS_W8_INVARIANTS } from "./invariants";
import { allOpsW8TestsPassed, runOpsW8ExecutiveTests } from "./w8-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/08_EXECUTIVE_COMMAND_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/EXECUTIVE_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/EXECUTIVE_BRIEFING.md",
  "docs/phase-11/11.6-institutional-operations/DECISION_WORKSPACE.md",
  "docs/phase-11/11.6-institutional-operations/WAR_ROOM_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_8_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/executive_vocabulary.json",
  "data/phase-11/executive_roles.json",
  "data/phase-11/alert_priorities.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/executive/constitution.ts",
  "src/lib/civic-action/builds/11.6/executive/w8.ts",
  "src/lib/civic-action/builds/11.6/executive/services/executive-service.ts",
  "src/app/api/v1/executive/dashboard/route.ts",
];

export interface Wave8Certification {
  wave_id: "11.6-W8";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Executive Operations, Command Center & Decision Intelligence Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW8Certification(): Wave8Certification {
  const constitution = getExecutiveConstitution();
  const registry = loadRequirementsRegistry();
  const w8Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W8");
  const testResults = runOpsW8ExecutiveTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/executive_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/executive_vocabulary.json"), "utf8"))
    : { terms: [] };
  const roles = existsSync(join(ROOT, "data/phase-11/executive_roles.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/executive_roles.json"), "utf8"))
    : { roles: [] };
  const priorities = existsSync(join(ROOT, "data/phase-11/alert_priorities.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/alert_priorities.json"), "utf8"))
    : { priorities: [] };

  const gates = [
    { id: "CAE-11.6-W8-G01", name: "Executive principle", passed: constitution.governing_principle === OPS_EXECUTIVE_PRINCIPLE, detail: "decisions not data collection" },
    { id: "CAE-11.6-W8-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.6-W8-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + roles + priorities" },
    { id: "CAE-11.6-W8-G04", name: "Executive roles", passed: roles.roles?.length >= 10, detail: `${roles.roles?.length ?? 0} roles` },
    { id: "CAE-11.6-W8-G05", name: "Alert priorities", passed: priorities.priorities?.length >= 5, detail: `${priorities.priorities?.length ?? 0} levels` },
    { id: "CAE-11.6-W8-G06", name: "W8 requirements", passed: w8Reqs.length >= 30 && w8Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w8Reqs.length} requirements` },
    { id: "CAE-11.6-W8-G07", name: "Executive services", passed: REQUIRED_EXECUTIVE_SERVICES.length === 16, detail: REQUIRED_EXECUTIVE_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.6-W8-G08", name: "Executive tests", passed: allOpsW8TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.6-W8-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.6-W8-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkOpsW8Invariants().map((inv) => ({
      id: inv.id,
      name: OPS_W8_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW8TestsPassed();

  return {
    wave_id: "11.6-W8",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Executive Operations, Command Center & Decision Intelligence Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW8Complete(): boolean {
  return runOpsW8Certification().all_passed;
}
