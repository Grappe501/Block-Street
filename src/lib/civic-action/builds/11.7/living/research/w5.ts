/**
 * CAE-11.7-W5 — Research Network certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getResearchConstitution, LIX_RESEARCH_PRINCIPLE, REQUIRED_RESEARCH_SERVICES } from "./constitution";
import { checkLixW5Invariants, LIX_W5_INVARIANTS } from "./invariants";
import { allLixW5TestsPassed, runLixW5CertificationTests } from "./w5-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/05_AI_RESEARCH_NETWORK_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/RESEARCH_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_5_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/research/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/research/w5.ts",
  "src/lib/civic-action/builds/11.7/living/research/services/research-network-service.ts",
  "src/app/api/v1/localbrain/research/route.ts",
];

export interface Wave5ResearchCertification {
  wave_id: "11.7-W5";
  build: "11.7";
  subsystem: "LIX-005";
  name: "AI Research Network, Continuous Knowledge Acquisition & Intelligence Fusion Runtime";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW5Certification(): Wave5ResearchCertification {
  const constitution = getResearchConstitution();
  const registry = loadRequirementsRegistry();
  const w5Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W5");
  const testResults = runLixW5CertificationTests();

  const gates = [
    { id: "CAE-11.7-W5-G01", name: "Research principle", passed: constitution.governing_principle === LIX_RESEARCH_PRINCIPLE, detail: "humans determine meaning" },
    { id: "CAE-11.7-W5-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W5-G03", name: "W5 requirements", passed: w5Reqs.length >= 25, detail: `${w5Reqs.length} requirements` },
    { id: "CAE-11.7-W5-G04", name: "Research services", passed: REQUIRED_RESEARCH_SERVICES.length === 13, detail: REQUIRED_RESEARCH_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W5-G05", name: "Research tests", passed: allLixW5TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W5-G06", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    ...checkLixW5Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W5_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW5TestsPassed();

  return {
    wave_id: "11.7-W5",
    build: "11.7",
    subsystem: "LIX-005",
    name: "AI Research Network, Continuous Knowledge Acquisition & Intelligence Fusion Runtime",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW5Complete(): boolean {
  return runLixW5Certification().all_passed;
}
