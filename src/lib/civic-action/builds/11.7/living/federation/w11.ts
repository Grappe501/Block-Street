/**
 * CAE-11.7-W11 — Federation certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../../scaffold/ledger";
import { getFederationConstitution, LIX_FEDERATION_PRINCIPLE, REQUIRED_FEDERATION_SERVICES } from "./constitution";
import { checkLixW11Invariants, LIX_W11_INVARIANTS } from "./invariants";
import { allLixW11TestsPassed, runLixW11CertificationTests } from "./w11-tests";
import { nowIso } from "../../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-living-intelligence/11_FEDERATED_INSTITUTIONAL_INTELLIGENCE.md",
  "docs/phase-11/11.7-living-intelligence/FEDERATION_CONSTITUTION.md",
  "docs/phase-11/11.7-living-intelligence/WAVE_11_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/living/federation/constitution.ts",
  "src/lib/civic-action/builds/11.7/living/federation/w11.ts",
  "src/lib/civic-action/builds/11.7/living/federation/services/federation-service.ts",
  "src/app/api/v1/localbrain/federation/route.ts",
];

export interface Wave11FederationCertification {
  wave_id: "11.7-W11";
  build: "11.7";
  subsystem: "LIX-011";
  name: "Federated Institutional Intelligence, Sovereignty & Inter-Organization Collaboration Runtime";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runLixW11Certification(): Wave11FederationCertification {
  const constitution = getFederationConstitution();
  const registry = loadRequirementsRegistry();
  const w11Reqs = registry.requirements.filter((r) => r.build === "11.7-lix" && r.wave === "W11");
  const testResults = runLixW11CertificationTests();

  const gates = [
    { id: "CAE-11.7-W11-G01", name: "Federation principle", passed: constitution.governing_principle === LIX_FEDERATION_PRINCIPLE, detail: "sovereignty preserved" },
    { id: "CAE-11.7-W11-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.7-W11-G03", name: "W11 requirements", passed: w11Reqs.length >= 25, detail: `${w11Reqs.length} requirements` },
    { id: "CAE-11.7-W11-G04", name: "Federation services", passed: REQUIRED_FEDERATION_SERVICES.length === 12, detail: REQUIRED_FEDERATION_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.7-W11-G05", name: "Federation tests", passed: allLixW11TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.7-W11-G06", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    ...checkLixW11Invariants().map((inv) => ({
      id: inv.id,
      name: LIX_W11_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allLixW11TestsPassed();

  return {
    wave_id: "11.7-W11",
    build: "11.7",
    subsystem: "LIX-011",
    name: "Federated Institutional Intelligence, Sovereignty & Inter-Organization Collaboration Runtime",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isLixW11Complete(): boolean {
  return runLixW11Certification().all_passed;
}
