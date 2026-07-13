/**
 * CAE-11.7-W2 — Context Intelligence certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getContextConstitution, LIX_CONTEXT_PRINCIPLE, REQUIRED_CONTEXT_SERVICES } from "./constitution";
import { checkLixW2Invariants, LIX_W2_INVARIANTS } from "./invariants";
import { allLixW2TestsPassed, runLixW2CertificationTests } from "./w2-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/02_CONTEXT_INTELLIGENCE_RUNTIME.md",
  "docs/phase-11/11.7-living-intelligence/CONTEXT_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/ACTIVE_CONTEXT_MODEL.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_2_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/context_registry.json",
  "data/phase-11/context_vocabulary.json",
  "data/phase-11/attention_categories.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/context/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/context/w2.ts",
  "src/lib/civic-action/builds/11.7/living/context/services/context-intelligence-service.ts",
  "src/app/api/v1/localbrain/context/active/route.ts",
];

export interface Wave2ContextCertification {
  wave_id: "11.7-W2";
  build: "11.7";
  subsystem: "LIX-002";
  name: "Context Intelligence, Situational Awareness & Attention Runtime";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW2Certification(): Wave2ContextCertification {
  const constitution = getContextConstitution();
  const registry = loadRequirementsRegistry();
  const w2Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W2");
  const testResults = runLixW2CertificationTests();

  const contextRegistry = existsSync(join(ROOT, "data/phase-11/context_registry.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/context_registry.json"), "utf8"))
    : { types: [] };
  const vocabulary = existsSync(join(ROOT, "data/phase-11/context_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/context_vocabulary.json"), "utf8"))
    : { terms: [] };
  const attention = existsSync(join(ROOT, "data/phase-11/attention_categories.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/attention_categories.json"), "utf8"))
    : { categories: [] };

  const gates = [
    { id: "CAE-11.7-W2-G01", name: "Context principle", passed: constitution.governing_principle === LIX_CONTEXT_PRINCIPLE, detail: "human control preserved" },
    { id: "CAE-11.7-W2-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W2-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "registry + vocabulary + attention" },
    { id: "CAE-11.7-W2-G04", name: "Context registry", passed: contextRegistry.types?.length >= 18, detail: `${contextRegistry.types?.length ?? 0} types` },
    { id: "CAE-11.7-W2-G05", name: "Attention categories", passed: attention.categories?.length >= 8, detail: `${attention.categories?.length ?? 0} categories` },
    { id: "CAE-11.7-W2-G06", name: "W2 requirements", passed: w2Reqs.length >= 30 && w2Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w2Reqs.length} requirements` },
    { id: "CAE-11.7-W2-G07", name: "Context services", passed: REQUIRED_CONTEXT_SERVICES.length === 20, detail: REQUIRED_CONTEXT_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W2-G08", name: "Context tests", passed: allLixW2TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W2-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.7-W2-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkLixW2Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W2_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW2TestsPassed();

  return {
    wave_id: "11.7-W2",
    build: "11.7",
    subsystem: "LIX-002",
    name: "Context Intelligence, Situational Awareness & Attention Runtime",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW2Complete(): boolean {
  return runLixW2Certification().all_passed;
}
