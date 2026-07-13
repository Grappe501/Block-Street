/**
 * CAE-11.12-W1 — Knowledge Constitution certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { getKnowledgeConstitution, KNW_GOVERNING_PRINCIPLE } from "./constitution";
import { checkKnwW1Invariants } from "./invariants";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const CONSTITUTION_PATH = "docs/phase-11/11.12-adaptive-learning/01_CONSTITUTION.md";

const REQUIRED_DOCS = [
  CONSTITUTION_PATH,
  "docs/phase-11/11.12-adaptive-learning/README.md",
  "docs/phase-11/11.12-adaptive-learning/00_KNOWLEDGE_ENGINE_OVERVIEW.md",
  "docs/phase-11/11.12-adaptive-learning/LEARNING_PHILOSOPHY.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_LIFECYCLE_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/EVIDENCE_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/COMPETENCY_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/CERTIFICATION_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/PLAYBOOK_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_STEWARDSHIP_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/AI_LEARNING_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/LEARNING_INSTITUTIONAL_MEMORY_STANDARD.md",
  "src/lib/civic-action/builds/11.12/constitution.ts",
  "src/lib/civic-action/builds/11.12/invariants.ts",
];

export interface Wave1Certification {
  wave_id: "11.12-W1";
  build: "11.12";
  subsystem: "ADP-001";
  name: "Knowledge, Learning & Institutional Intelligence Constitution";
  certified_at: string | null;
  all_passed: boolean;
  documentation_complete: boolean;
  technical_enforcement: "planned_w2_w8";
  gates: { id: string; name: string; passed: boolean; detail: string }[];
}

function readConstitutionMd(): string {
  return readFileSync(join(ROOT, CONSTITUTION_PATH), "utf8");
}

export function runKnwW1Certification(): Wave1Certification {
  const registry = loadRequirementsRegistry();
  const w1Reqs = registry.requirements.filter((r) => r.build === "11.12" && r.wave === "W1");
  const constitution = getKnowledgeConstitution();
  const invariants = checkKnwW1Invariants();
  const constitutionMd = existsSync(join(ROOT, CONSTITUTION_PATH)) ? readConstitutionMd() : "";

  const gates = [
    {
      id: "CAE-11.12-W1-G01",
      name: "Constitution documentation",
      passed: existsSync(join(ROOT, CONSTITUTION_PATH)),
      detail: CONSTITUTION_PATH,
    },
    {
      id: "CAE-11.12-W1-G02",
      name: "Constitutional spine docs",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} artifacts`,
    },
    {
      id: "CAE-11.12-W1-G03",
      name: "W1 requirements documented",
      passed: w1Reqs.length >= 12 && w1Reqs.every((r) => r.status === "documented"),
      detail: `${w1Reqs.length} requirements`,
    },
    {
      id: "CAE-11.12-W1-G04",
      name: "Governing principle defined",
      passed: constitution.governing_principle === KNW_GOVERNING_PRINCIPLE,
      detail: KNW_GOVERNING_PRINCIPLE.slice(0, 72) + "...",
    },
    {
      id: "CAE-11.12-W1-G05",
      name: "Evidence doctrine",
      passed: constitutionMd.toLowerCase().includes("evidence") && constitutionMd.includes("Confidence must always be visible"),
      detail: "evidence + confidence",
    },
    {
      id: "CAE-11.12-W1-G06",
      name: "AI truth prohibition",
      passed:
        constitutionMd.toLowerCase().includes("ai may never") &&
        constitutionMd.toLowerCase().includes("fabricate sources"),
      detail: "AI doctrine",
    },
    {
      id: "CAE-11.12-W1-G07",
      name: "Competency doctrine",
      passed: constitutionMd.toLowerCase().includes("demonstrated capability"),
      detail: "competency standard",
    },
    {
      id: "CAE-11.12-W1-G08",
      name: "Institutional memory",
      passed: constitutionMd.toLowerCase().includes("institutional memory"),
      detail: "memory doctrine",
    },
    {
      id: "CAE-11.12-W1-G09",
      name: "Knowledge lifecycle",
      passed: constitution.lifecycle.length === 7,
      detail: constitution.lifecycle.join(" → "),
    },
    {
      id: "CAE-11.12-W1-G10",
      name: "Constitutional invariants",
      passed: invariants.every((i) => i.passed),
      detail: `${invariants.filter((i) => i.passed).length}/${invariants.length}`,
    },
    {
      id: "CAE-11.12-W1-G11",
      name: "Required constitutional services",
      passed: constitution.required_services.length === 9,
      detail: `${constitution.required_services.length} services`,
    },
    {
      id: "CAE-11.12-W1-G12",
      name: "Build reconciliation",
      passed: existsSync(join(ROOT, "docs/phase-11/BUILD_NUMBER_RECONCILIATION.md")),
      detail: "ADP-001 at 11.12",
    },
  ];

  const allPassed = gates.every((g) => g.passed);

  return {
    wave_id: "11.12-W1",
    build: "11.12",
    subsystem: "ADP-001",
    name: "Knowledge, Learning & Institutional Intelligence Constitution",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    documentation_complete: gates[0].passed && gates[1].passed,
    technical_enforcement: "planned_w2_w8",
    gates,
  };
}
