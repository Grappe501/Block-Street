/**
 * CAE-11.7-W1 — Communications Constitution certification (documentation gates)
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const CONSTITUTION_PATH = "docs/phase-11/11.7-communications/01_CONSTITUTION.md";

const REQUIRED_DOCS = [
  CONSTITUTION_PATH,
  "docs/phase-11/11.7-communications/README.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_AI_INTERFACE.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_SPANISH_STANDARD.md",
];

export interface Wave1Certification {
  wave_id: "11.7-W1";
  build: "11.7";
  subsystem: "COM-002";
  name: "Communications & Collaboration Constitution";
  certified_at: string | null;
  all_passed: boolean;
  documentation_complete: boolean;
  technical_enforcement: "planned_w2_w8";
  gates: { id: string; name: string; passed: boolean; detail: string }[];
}

function readConstitution(): string {
  return readFileSync(join(ROOT, CONSTITUTION_PATH), "utf8");
}

export function runComW1Certification(): Wave1Certification {
  const registry = loadRequirementsRegistry();
  const w1Reqs = registry.requirements.filter((r) => r.build === "11.7" && r.wave === "W1");
  const constitutionMd = existsSync(join(ROOT, CONSTITUTION_PATH)) ? readConstitution() : "";

  const gates = [
    {
      id: "CAE-11.7-W1-G01",
      name: "Constitution documentation",
      passed: existsSync(join(ROOT, CONSTITUTION_PATH)),
      detail: CONSTITUTION_PATH,
    },
    {
      id: "CAE-11.7-W1-G02",
      name: "Constitutional spine docs",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} documents`,
    },
    {
      id: "CAE-11.7-W1-G03",
      name: "W1 requirements documented",
      passed: w1Reqs.length >= 10 && w1Reqs.every((r) => r.status === "documented"),
      detail: `${w1Reqs.length} requirements`,
    },
    {
      id: "CAE-11.7-W1-G04",
      name: "Governing mission defined",
      passed: constitutionMd.includes("Communication exists to improve execution"),
      detail: "constitutional doctrine",
    },
    {
      id: "CAE-11.7-W1-G05",
      name: "Operational context rule",
      passed: constitutionMd.toLowerCase().includes("operational context"),
      detail: "context-bound communication",
    },
    {
      id: "CAE-11.7-W1-G06",
      name: "AI approval prohibition",
      passed:
        constitutionMd.toLowerCase().includes("ai may never") &&
        constitutionMd.toLowerCase().includes("approve decisions"),
      detail: "AI doctrine in constitution",
    },
    {
      id: "CAE-11.7-W1-G07",
      name: "Human publication authority",
      passed: constitutionMd.includes("Humans approve publication"),
      detail: "human authority preserved",
    },
    {
      id: "CAE-11.7-W1-G08",
      name: "Institutional memory doctrine",
      passed: constitutionMd.toLowerCase().includes("institutional memory"),
      detail: "permanence and searchability",
    },
    {
      id: "CAE-11.7-W1-G09",
      name: "Decision permanence",
      passed: constitutionMd.toLowerCase().includes("decisions remain permanently searchable"),
      detail: "decision record doctrine",
    },
    {
      id: "CAE-11.7-W1-G10",
      name: "Spanish standard referenced",
      passed: existsSync(join(ROOT, "docs/phase-11/11.7-communications/COMMUNICATION_SPANISH_STANDARD.md")),
      detail: "bilingual readiness",
    },
    {
      id: "CAE-11.7-W1-G11",
      name: "Requirements registry",
      passed: existsSync(join(ROOT, "data/civic-action/requirements_registry.json")),
      detail: "traceability spine",
    },
    {
      id: "CAE-11.7-W1-G12",
      name: "Build reconciliation documented",
      passed: existsSync(join(ROOT, "docs/phase-11/BUILD_NUMBER_RECONCILIATION.md")),
      detail: "COM-002 at 11.7",
    },
  ];

  const docComplete = gates.every((g) => g.passed);
  const allPassed = gates.every((g) => g.passed);

  return {
    wave_id: "11.7-W1",
    build: "11.7",
    subsystem: "COM-002",
    name: "Communications & Collaboration Constitution",
    certified_at: docComplete ? nowIso() : null,
    all_passed: allPassed,
    documentation_complete: docComplete,
    technical_enforcement: "planned_w2_w8",
    gates,
  };
}

export function isComW1Complete(): boolean {
  return runComW1Certification().documentation_complete;
}
