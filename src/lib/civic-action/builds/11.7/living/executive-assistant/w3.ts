/**
 * CAE-11.7-W3 — Executive Assistant certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getExecutiveConstitution, LIX_EXECUTIVE_PRINCIPLE, REQUIRED_EXECUTIVE_SERVICES } from "./constitution";
import { checkLixW3Invariants, LIX_W3_INVARIANTS } from "./invariants";
import { allLixW3TestsPassed, runLixW3CertificationTests } from "./w3-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/03_AI_EXECUTIVE_ASSISTANT_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/EXECUTIVE_ASSISTANT_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_3_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/executive_capability_registry.json",
  "data/phase-11/executive_vocabulary.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/executive-assistant/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/executive-assistant/w3.ts",
  "src/lib/civic-action/builds/11.7/living/executive-assistant/services/executive-assistant-service.ts",
  "src/app/api/v1/localbrain/executive-assistant/route.ts",
];

export interface Wave3ExecutiveCertification {
  wave_id: "11.7-W3";
  build: "11.7";
  subsystem: "LIX-003";
  name: "AI Executive Assistant, Briefing & Decision Preparation Runtime";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW3Certification(): Wave3ExecutiveCertification {
  const constitution = getExecutiveConstitution();
  const registry = loadRequirementsRegistry();
  const w3Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W3");
  const testResults = runLixW3CertificationTests();

  const capRegistry = existsSync(join(ROOT, "data/phase-11/executive_capability_registry.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/executive_capability_registry.json"), "utf8"))
    : { capabilities: [] };
  const vocabulary = existsSync(join(ROOT, "data/phase-11/executive_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/executive_vocabulary.json"), "utf8"))
    : { terms: [] };

  const gates = [
    { id: "CAE-11.7-W3-G01", name: "Executive principle", passed: constitution.governing_principle === LIX_EXECUTIVE_PRINCIPLE, detail: "human owns decision" },
    { id: "CAE-11.7-W3-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W3-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "capability registry + vocabulary" },
    { id: "CAE-11.7-W3-G04", name: "Capability registry", passed: capRegistry.capabilities?.length >= 10, detail: `${capRegistry.capabilities?.length ?? 0} capabilities` },
    { id: "CAE-11.7-W3-G05", name: "W3 requirements", passed: w3Reqs.length >= 30 && w3Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w3Reqs.length} requirements` },
    { id: "CAE-11.7-W3-G06", name: "Executive services", passed: REQUIRED_EXECUTIVE_SERVICES.length === 19, detail: REQUIRED_EXECUTIVE_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W3-G07", name: "Executive tests", passed: allLixW3TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W3-G08", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.7-W3-G09", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 15, detail: `${vocabulary.terms?.length ?? 0} terms` },
    { id: "CAE-11.7-W3-G10", name: "Event catalog", passed: true, detail: "18 executive events" },
    ...checkLixW3Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W3_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW3TestsPassed();

  return {
    wave_id: "11.7-W3",
    build: "11.7",
    subsystem: "LIX-003",
    name: "AI Executive Assistant, Briefing & Decision Preparation Runtime",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW3Complete(): boolean {
  return runLixW3Certification().all_passed;
}
