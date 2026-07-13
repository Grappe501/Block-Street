/**
 * CAE-11.6-W9 — Workflow certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getWorkflowConstitution, OPS_WORKFLOW_PRINCIPLE, REQUIRED_WORKFLOW_SERVICES } from "./constitution";
import { checkOpsW9Invariants, OPS_W9_INVARIANTS } from "./invariants";
import { allOpsW9TestsPassed, runOpsW9WorkflowTests } from "./w9-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/09_WORKFLOW_AUTOMATION_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/WORKFLOW_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/WORKFLOW_EXECUTION.md",
  "docs/phase-11/11.6-institutional-operations/APPROVAL_GATES.md",
  "docs/phase-11/11.6-institutional-operations/AUTOMATION_TEMPLATES.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_9_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/workflow_vocabulary.json",
  "data/phase-11/workflow_categories.json",
  "data/phase-11/automation_levels.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/workflows/constitution.ts",
  "src/lib/civic-action/builds/11.6/workflows/w9.ts",
  "src/lib/civic-action/builds/11.6/workflows/services/workflow-service.ts",
  "src/app/api/v1/workflows/route.ts",
];

export interface Wave9Certification {
  wave_id: "11.6-W9";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Institutional Automation, Workflow Orchestration & AI Coordination Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW9Certification(): Wave9Certification {
  const constitution = getWorkflowConstitution();
  const registry = loadRequirementsRegistry();
  const w9Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W9");
  const testResults = runOpsW9WorkflowTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/workflow_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/workflow_vocabulary.json"), "utf8"))
    : { terms: [] };
  const categories = existsSync(join(ROOT, "data/phase-11/workflow_categories.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/workflow_categories.json"), "utf8"))
    : { categories: [] };
  const levels = existsSync(join(ROOT, "data/phase-11/automation_levels.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/automation_levels.json"), "utf8"))
    : { levels: [] };

  const gates = [
    { id: "CAE-11.6-W9-G01", name: "Workflow principle", passed: constitution.governing_principle === OPS_WORKFLOW_PRINCIPLE, detail: "human judgment preserved" },
    { id: "CAE-11.6-W9-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.6-W9-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + categories + levels" },
    { id: "CAE-11.6-W9-G04", name: "Workflow categories", passed: categories.categories?.length >= 15, detail: `${categories.categories?.length ?? 0} categories` },
    { id: "CAE-11.6-W9-G05", name: "Automation levels", passed: levels.levels?.length >= 5, detail: `${levels.levels?.length ?? 0} levels` },
    { id: "CAE-11.6-W9-G06", name: "W9 requirements", passed: w9Reqs.length >= 30 && w9Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w9Reqs.length} requirements` },
    { id: "CAE-11.6-W9-G07", name: "Workflow services", passed: REQUIRED_WORKFLOW_SERVICES.length === 14, detail: REQUIRED_WORKFLOW_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.6-W9-G08", name: "Workflow tests", passed: allOpsW9TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.6-W9-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.6-W9-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkOpsW9Invariants().map((inv) => ({
      id: inv.id,
      name: OPS_W9_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW9TestsPassed();

  return {
    wave_id: "11.6-W9",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Institutional Automation, Workflow Orchestration & AI Coordination Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW9Complete(): boolean {
  return runOpsW9Certification().all_passed;
}
