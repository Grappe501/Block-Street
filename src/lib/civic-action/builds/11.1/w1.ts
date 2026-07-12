import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { getInitiativeConstitution, INI_GOVERNING_PRINCIPLE } from "./constitution";
import { checkIniW1Invariants, INI_W1_INVARIANTS } from "./invariants";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.1-initiatives/01_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_VOCABULARY.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_TAXONOMY.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_AUTHORITY_MODEL.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_SCOPE_STANDARD.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_CHARTER_STANDARD.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_LIFECYCLE_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_CLOSEOUT_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_AI_BOUNDARIES.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_PRIVACY_AND_SECURITY.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_SPANISH_VOCABULARY.md",
  "docs/phase-11/11.1-initiatives/IMPLEMENTATION_LEDGER.md",
  "docs/phase-11/11.1-initiatives/CURSOR_HANDOFF.md",
];

const REQUIRED_DATA = [
  "data/phase-11/initiative_vocabulary.json",
  "data/phase-11/initiative_types.json",
  "data/civic-action/requirements_registry.json",
];

export interface Wave1Certification {
  wave_id: "11.1-W1";
  build: "11.1";
  name: "Initiative Constitution and Domain Definition";
  certified_at: string | null;
  all_passed: boolean;
  documentation_complete: boolean;
  technical_enforcement: "planned_w2_w8";
  gates: { id: string; name: string; passed: boolean; detail: string }[];
}

function checkDocsExist() {
  return REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p)));
}

function checkDataContracts() {
  return REQUIRED_DATA.every((p) => existsSync(join(ROOT, p)));
}

export function runIniW1Certification(): Wave1Certification {
  const constitution = getInitiativeConstitution();
  const invariants = checkIniW1Invariants();
  const registry = loadRequirementsRegistry();
  const w1Reqs = registry.requirements.filter((r) => r.build === "11.1" && r.wave === "W1");

  const types = JSON.parse(readFileSync(join(ROOT, "data/phase-11/initiative_types.json"), "utf8"));
  const vocabulary = JSON.parse(readFileSync(join(ROOT, "data/phase-11/initiative_vocabulary.json"), "utf8"));

  const gates = [
    {
      id: "CAE-11.1-W1-G01",
      name: "Governing principle defined",
      passed: constitution.governing_principle === INI_GOVERNING_PRINCIPLE,
      detail: INI_GOVERNING_PRINCIPLE.slice(0, 72) + "...",
    },
    {
      id: "CAE-11.1-W1-G02",
      name: "Required documentation spine",
      passed: checkDocsExist(),
      detail: `${REQUIRED_DOCS.length} documents`,
    },
    {
      id: "CAE-11.1-W1-G03",
      name: "Machine-readable contracts",
      passed: checkDataContracts(),
      detail: "vocabulary + types + requirements",
    },
    {
      id: "CAE-11.1-W1-G04",
      name: "Initiative type taxonomy (12 types)",
      passed: types.types?.length === 12,
      detail: `${types.types?.length ?? 0} types`,
    },
    {
      id: "CAE-11.1-W1-G05",
      name: "Vocabulary registry",
      passed: (vocabulary.terms?.length ?? 0) >= 18,
      detail: `${vocabulary.terms?.length ?? 0} terms`,
    },
    {
      id: "CAE-11.1-W1-G06",
      name: "Requirements documented (44)",
      passed: w1Reqs.length === 44 && w1Reqs.every((r) => r.status === "documented"),
      detail: `${w1Reqs.length}/44 documented`,
    },
    {
      id: "CAE-11.1-W1-G07",
      name: "AI ownership prohibition",
      passed: constitution.ai_may_not.some((s) => s.toLowerCase().includes("owner")),
      detail: `${constitution.ai_may_not.length} prohibitions`,
    },
    {
      id: "CAE-11.1-W1-G08",
      name: "Emergency expiration rule",
      passed: constitution.prohibited.some((p) => p.toLowerCase().includes("emergency")),
      detail: "permanent emergency prohibited",
    },
    {
      id: "CAE-11.1-W1-G09",
      name: "Spanish core vocabulary",
      passed: Object.keys(constitution.spanish_glossary).length >= 20,
      detail: `${Object.keys(constitution.spanish_glossary).length} terms`,
    },
    {
      id: "CAE-11.1-W1-G10",
      name: "Lifecycle terms defined",
      passed: constitution.lifecycle.length >= 12,
      detail: `${constitution.lifecycle.length} states`,
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

  const docComplete = gates.filter((g) => g.id.startsWith("CAE-11.1-W1-G")).every((g) => g.passed);
  const allPassed = gates.every((g) => g.passed);

  return {
    wave_id: "11.1-W1",
    build: "11.1",
    name: "Initiative Constitution and Domain Definition",
    certified_at: docComplete ? nowIso() : null,
    all_passed: allPassed,
    documentation_complete: docComplete,
    technical_enforcement: "planned_w2_w8",
    gates,
  };
}

export function getIniW1Overview() {
  return {
    constitution: getInitiativeConstitution(),
    invariants: checkIniW1Invariants(),
    invariant_docs: INI_W1_INVARIANTS,
    requirements: loadRequirementsRegistry().requirements.filter((r) => r.build === "11.1" && r.wave === "W1"),
    certification: runIniW1Certification(),
  };
}

export function isIniW1Complete(): boolean {
  return runIniW1Certification().documentation_complete;
}
