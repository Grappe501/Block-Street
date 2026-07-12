import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { getObjectiveConstitution, OBJ_GOVERNING_PRINCIPLE } from "./constitution";
import { checkObjW1Invariants, OBJ_W1_INVARIANTS } from "./invariants";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.2-objectives/01_CONSTITUTION.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_VOCABULARY.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_TAXONOMY.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_AUTHORITY_MODEL.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_TRACEABILITY_STANDARD.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_LIFECYCLE_CONSTITUTION.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_SUCCESS_DOCTRINE.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_REVIEW_DOCTRINE.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_AI_BOUNDARIES.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_SPANISH_VOCABULARY.md",
  "docs/phase-11/11.2-objectives/EXECUTION_HIERARCHY.md",
  "docs/phase-11/11.2-objectives/IMPLEMENTATION_LEDGER.md",
  "docs/phase-11/11.2-objectives/CURSOR_HANDOFF.md",
];

const REQUIRED_DATA = [
  "data/phase-11/objective_vocabulary.json",
  "data/phase-11/objective_types.json",
  "data/phase-11/objective_lifecycle.json",
  "data/civic-action/requirements_registry.json",
];

export interface Wave1Certification {
  wave_id: "11.2-W1";
  build: "11.2";
  name: "Objectives Constitution and Execution Model";
  certified_at: string | null;
  all_passed: boolean;
  documentation_complete: boolean;
  technical_enforcement: "planned_w2_w8";
  gates: { id: string; name: string; passed: boolean; detail: string }[];
}

export function runObjW1Certification(): Wave1Certification {
  const constitution = getObjectiveConstitution();
  const invariants = checkObjW1Invariants();
  const registry = loadRequirementsRegistry();
  const w1Reqs = registry.requirements.filter((r) => r.build === "11.2" && r.wave === "W1");

  const types = JSON.parse(readFileSync(join(ROOT, "data/phase-11/objective_types.json"), "utf8"));
  const vocabulary = JSON.parse(readFileSync(join(ROOT, "data/phase-11/objective_vocabulary.json"), "utf8"));
  const lifecycle = JSON.parse(readFileSync(join(ROOT, "data/phase-11/objective_lifecycle.json"), "utf8"));

  const gates = [
    {
      id: "CAE-11.2-W1-G01",
      name: "Governing principle defined",
      passed: constitution.governing_principle === OBJ_GOVERNING_PRINCIPLE,
      detail: OBJ_GOVERNING_PRINCIPLE.slice(0, 72) + "...",
    },
    {
      id: "CAE-11.2-W1-G02",
      name: "Required documentation spine",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} documents`,
    },
    {
      id: "CAE-11.2-W1-G03",
      name: "Machine-readable contracts",
      passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))),
      detail: "vocabulary + types + lifecycle + requirements",
    },
    {
      id: "CAE-11.2-W1-G04",
      name: "Objective type taxonomy (13 types)",
      passed: types.types?.length === 13,
      detail: `${types.types?.length ?? 0} types`,
    },
    {
      id: "CAE-11.2-W1-G05",
      name: "Vocabulary registry",
      passed: (vocabulary.terms?.length ?? 0) >= 20,
      detail: `${vocabulary.terms?.length ?? 0} terms`,
    },
    {
      id: "CAE-11.2-W1-G06",
      name: "Requirements documented",
      passed: w1Reqs.length >= 40 && w1Reqs.every((r) => r.status === "documented"),
      detail: `${w1Reqs.length} requirements`,
    },
    {
      id: "CAE-11.2-W1-G07",
      name: "No orphan work rule",
      passed: constitution.commitments.some((c) => c.toLowerCase().includes("orphan") || c.includes("exactly one")),
      detail: "traceability commitments",
    },
    {
      id: "CAE-11.2-W1-G08",
      name: "AI approval prohibition",
      passed: constitution.ai_may_not.some((s) => s.toLowerCase().includes("approve")),
      detail: `${constitution.ai_may_not.length} prohibitions`,
    },
    {
      id: "CAE-11.2-W1-G09",
      name: "Spanish core vocabulary",
      passed: Object.keys(constitution.spanish_glossary).length >= 20,
      detail: `${Object.keys(constitution.spanish_glossary).length} terms`,
    },
    {
      id: "CAE-11.2-W1-G10",
      name: "Lifecycle states defined",
      passed: lifecycle.states?.length === 12,
      detail: `${lifecycle.states?.length ?? 0} states`,
    },
    {
      id: "CAE-11.2-W1-G11",
      name: "Execution hierarchy complete",
      passed: constitution.execution_hierarchy.length >= 12,
      detail: `${constitution.execution_hierarchy.length} levels`,
    },
    {
      id: "CAE-11.2-W1-G12",
      name: "Domain services declared",
      passed: constitution.required_services.length === 10,
      detail: "10 services for W3",
    },
  ];

  for (const inv of invariants) {
    gates.push({
      id: inv.id,
      name: inv.id,
      passed: inv.passed,
      detail: `${inv.detail} (MVP seed check; full enforcement W2+)`,
    });
  }

  const docComplete = gates.filter((g) => g.id.startsWith("CAE-11.2-W1-G")).every((g) => g.passed);
  const allPassed = gates.every((g) => g.passed);

  return {
    wave_id: "11.2-W1",
    build: "11.2",
    name: "Objectives Constitution and Execution Model",
    certified_at: docComplete ? nowIso() : null,
    all_passed: allPassed,
    documentation_complete: docComplete,
    technical_enforcement: "planned_w2_w8",
    gates,
  };
}

export function getObjW1Overview() {
  return {
    constitution: getObjectiveConstitution(),
    invariants: checkObjW1Invariants(),
    invariant_docs: OBJ_W1_INVARIANTS,
    requirements: loadRequirementsRegistry().requirements.filter((r) => r.build === "11.2" && r.wave === "W1"),
    certification: runObjW1Certification(),
  };
}

export function isObjW1Complete(): boolean {
  return runObjW1Certification().documentation_complete;
}
