/**
 * CAE-11.7-W1 — LocalBrain certification module
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getLocalBrainConstitution, LIX_LOCALBRAIN_PRINCIPLE, REQUIRED_LOCALBRAIN_SERVICES } from "./constitution";
import { checkLixW1Invariants, LIX_W1_INVARIANTS } from "./invariants";
import { allLixW1TestsPassed, runLixW1CertificationTests } from "./w1-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/01_LOCALBRAIN_ARCHITECTURE_PROTOCOL.md",
  "docs/phase-11/11.7-living-intelligence/LOCALBRAIN_VOCABULARY.md",
  "docs/phase-11/11.7-living-intelligence/MEMORY_ARCHITECTURE.md",
  "docs/phase-11/11.7-living-intelligence/CONTEXT_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_1_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/localbrain_vocabulary.json",
  "data/phase-11/memory_categories.json",
  "data/phase-11/privacy_domains.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/localbrain/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/localbrain/w1.ts",
  "src/lib/civic-action/builds/11.7/living/localbrain/services/localbrain-service.ts",
  "src/app/api/v1/localbrain/route.ts",
];

export interface Wave1LocalBrainCertification {
  wave_id: "11.7-W1";
  build: "11.7";
  subsystem: "LIX-001";
  name: "LocalBrain Architecture, Personal Memory & Context Runtime";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW1Certification(): Wave1LocalBrainCertification {
  const constitution = getLocalBrainConstitution();
  const registry = loadRequirementsRegistry();
  const w1Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W1");
  const testResults = runLixW1CertificationTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/localbrain_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/localbrain_vocabulary.json"), "utf8"))
    : { terms: [] };
  const categories = existsSync(join(ROOT, "data/phase-11/memory_categories.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/memory_categories.json"), "utf8"))
    : { categories: [] };
  const privacy = existsSync(join(ROOT, "data/phase-11/privacy_domains.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/privacy_domains.json"), "utf8"))
    : { domains: [] };

  const gates = [
    { id: "CAE-11.7-W1-G01", name: "LocalBrain principle", passed: constitution.governing_principle === LIX_LOCALBRAIN_PRINCIPLE, detail: "one human one brain" },
    { id: "CAE-11.7-W1-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W1-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + memory + privacy" },
    { id: "CAE-11.7-W1-G04", name: "Memory categories", passed: categories.categories?.length >= 11, detail: `${categories.categories?.length ?? 0} categories` },
    { id: "CAE-11.7-W1-G05", name: "Privacy domains", passed: privacy.domains?.length >= 4, detail: `${privacy.domains?.length ?? 0} domains` },
    { id: "CAE-11.7-W1-G06", name: "W1 requirements", passed: w1Reqs.length >= 30 && w1Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w1Reqs.length} requirements` },
    { id: "CAE-11.7-W1-G07", name: "LocalBrain services", passed: REQUIRED_LOCALBRAIN_SERVICES.length === 15, detail: REQUIRED_LOCALBRAIN_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W1-G08", name: "LocalBrain tests", passed: allLixW1TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W1-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.7-W1-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkLixW1Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W1_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW1TestsPassed();

  return {
    wave_id: "11.7-W1",
    build: "11.7",
    subsystem: "LIX-001",
    name: "LocalBrain Architecture, Personal Memory & Context Runtime",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW1Complete(): boolean {
  return runLixW1Certification().all_passed;
}
