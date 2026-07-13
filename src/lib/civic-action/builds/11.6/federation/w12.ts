/**
 * CAE-11.6-W12 — Federation certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getFederationConstitution, OPS_FEDERATION_PRINCIPLE, REQUIRED_FEDERATION_SERVICES } from "./constitution";
import { checkOpsW12Invariants, OPS_W12_INVARIANTS } from "./invariants";
import { allOpsW12TestsPassed, runOpsW12FederationTests } from "./w12-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/12_FEDERATION_COLLABORATION_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/FEDERATION_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/FEDERATION_GOVERNANCE.md",
  "docs/phase-11/11.6-institutional-operations/SHARED_MISSIONS.md",
  "docs/phase-11/11.6-institutional-operations/FEDERATION_AGREEMENTS.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_12_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/federation_vocabulary.json",
  "data/phase-11/federation_types.json",
  "data/phase-11/agreement_types.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/federation/constitution.ts",
  "src/lib/civic-action/builds/11.6/federation/w12.ts",
  "src/lib/civic-action/builds/11.6/federation/services/federation-ops-service.ts",
  "src/app/api/v1/federations/route.ts",
];

export interface Wave12Certification {
  wave_id: "11.6-W12";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Federation, Multi-Institution Collaboration & Network Operations Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW12Certification(): Wave12Certification {
  const constitution = getFederationConstitution();
  const registry = loadRequirementsRegistry();
  const w12Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W12");
  const testResults = runOpsW12FederationTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/federation_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/federation_vocabulary.json"), "utf8"))
    : { terms: [] };
  const types = existsSync(join(ROOT, "data/phase-11/federation_types.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/federation_types.json"), "utf8"))
    : { types: [] };
  const agreements = existsSync(join(ROOT, "data/phase-11/agreement_types.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/agreement_types.json"), "utf8"))
    : { types: [] };

  const gates = [
    { id: "CAE-11.6-W12-G01", name: "Federation principle", passed: constitution.governing_principle === OPS_FEDERATION_PRINCIPLE, detail: "explicit agreements" },
    { id: "CAE-11.6-W12-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.6-W12-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + types + agreements" },
    { id: "CAE-11.6-W12-G04", name: "Federation types", passed: types.types?.length >= 10, detail: `${types.types?.length ?? 0} types` },
    { id: "CAE-11.6-W12-G05", name: "Agreement types", passed: agreements.types?.length >= 8, detail: `${agreements.types?.length ?? 0} types` },
    { id: "CAE-11.6-W12-G06", name: "W12 requirements", passed: w12Reqs.length >= 30 && w12Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w12Reqs.length} requirements` },
    { id: "CAE-11.6-W12-G07", name: "Federation services", passed: REQUIRED_FEDERATION_SERVICES.length === 14, detail: REQUIRED_FEDERATION_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.6-W12-G08", name: "Federation tests", passed: allOpsW12TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.6-W12-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.6-W12-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkOpsW12Invariants().map((inv) => ({
      id: inv.id,
      name: OPS_W12_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW12TestsPassed();

  return {
    wave_id: "11.6-W12",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Federation, Multi-Institution Collaboration & Network Operations Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW12Complete(): boolean {
  return runOpsW12Certification().all_passed;
}
