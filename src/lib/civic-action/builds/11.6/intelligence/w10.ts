/**
 * CAE-11.6-W10 — Intelligence certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getIntelligenceConstitution, OPS_INTELLIGENCE_PRINCIPLE, REQUIRED_INTELLIGENCE_SERVICES } from "./constitution";
import { checkOpsW10Invariants, OPS_W10_INVARIANTS } from "./invariants";
import { allOpsW10TestsPassed, runOpsW10IntelligenceTests } from "./w10-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/10_PREDICTIVE_INTELLIGENCE_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/INTELLIGENCE_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/FORECAST_ENGINE.md",
  "docs/phase-11/11.6-institutional-operations/SCENARIO_SIMULATION.md",
  "docs/phase-11/11.6-institutional-operations/INSTITUTIONAL_LEARNING.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_10_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/intelligence_vocabulary.json",
  "data/phase-11/intelligence_categories.json",
  "data/phase-11/forecast_types.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/intelligence/constitution.ts",
  "src/lib/civic-action/builds/11.6/intelligence/w10.ts",
  "src/lib/civic-action/builds/11.6/intelligence/services/intelligence-service.ts",
  "src/app/api/v1/intelligence/insights/route.ts",
];

export interface Wave10Certification {
  wave_id: "11.6-W10";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Predictive Intelligence, Institutional Analytics & Decision Forecasting Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW10Certification(): Wave10Certification {
  const constitution = getIntelligenceConstitution();
  const registry = loadRequirementsRegistry();
  const w10Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W10");
  const testResults = runOpsW10IntelligenceTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/intelligence_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/intelligence_vocabulary.json"), "utf8"))
    : { terms: [] };
  const categories = existsSync(join(ROOT, "data/phase-11/intelligence_categories.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/intelligence_categories.json"), "utf8"))
    : { categories: [] };
  const forecastTypes = existsSync(join(ROOT, "data/phase-11/forecast_types.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/forecast_types.json"), "utf8"))
    : { types: [] };

  const gates = [
    { id: "CAE-11.6-W10-G01", name: "Intelligence principle", passed: constitution.governing_principle === OPS_INTELLIGENCE_PRINCIPLE, detail: "predictions inform not replace" },
    { id: "CAE-11.6-W10-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.6-W10-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + categories + forecast types" },
    { id: "CAE-11.6-W10-G04", name: "Intelligence categories", passed: categories.categories?.length >= 15, detail: `${categories.categories?.length ?? 0} categories` },
    { id: "CAE-11.6-W10-G05", name: "Forecast types", passed: forecastTypes.types?.length >= 10, detail: `${forecastTypes.types?.length ?? 0} types` },
    { id: "CAE-11.6-W10-G06", name: "W10 requirements", passed: w10Reqs.length >= 30 && w10Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w10Reqs.length} requirements` },
    { id: "CAE-11.6-W10-G07", name: "Intelligence services", passed: REQUIRED_INTELLIGENCE_SERVICES.length === 15, detail: REQUIRED_INTELLIGENCE_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.6-W10-G08", name: "Intelligence tests", passed: allOpsW10TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.6-W10-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.6-W10-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkOpsW10Invariants().map((inv) => ({
      id: inv.id,
      name: OPS_W10_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW10TestsPassed();

  return {
    wave_id: "11.6-W10",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Predictive Intelligence, Institutional Analytics & Decision Forecasting Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW10Complete(): boolean {
  return runOpsW10Certification().all_passed;
}
