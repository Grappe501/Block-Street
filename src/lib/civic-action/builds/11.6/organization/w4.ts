/**
 * CAE-11.6-W4 — Organization certification
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../../scaffold/ledger";
import { getOrganizationConstitution, OPS_ORGANIZATION_PRINCIPLE, REQUIRED_ORGANIZATION_SERVICES } from "./constitution";
import { checkOpsW4Invariants, OPS_W4_INVARIANTS } from "./invariants";
import { allOpsW4TestsPassed, runOpsW4OrganizationTests } from "./w4-tests";
import { nowIso } from "../../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.6-institutional-operations/04_ORGANIZATION_GOVERNANCE_PROTOCOL.md",
  "docs/phase-11/11.6-institutional-operations/ORGANIZATION_VOCABULARY.md",
  "docs/phase-11/11.6-institutional-operations/ORGANIZATION_HIERARCHY.md",
  "docs/phase-11/11.6-institutional-operations/GOVERNANCE_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/FEDERATION_MODEL.md",
  "docs/phase-11/11.6-institutional-operations/WAVE_4_CERTIFICATION.md",
];

const REQUIRED_DATA = [
  "data/phase-11/organization_vocabulary.json",
  "data/phase-11/organization_hierarchy.json",
  "data/phase-11/governance_models.json",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.6/organization/constitution.ts",
  "src/lib/civic-action/builds/11.6/organization/w4.ts",
  "src/lib/civic-action/builds/11.6/organization/services/organization-service.ts",
  "src/app/api/v1/operations/institutions/route.ts",
];

export interface Wave4Certification {
  wave_id: "11.6-W4";
  build: "11.6";
  subsystem: "OPS-001";
  name: "Organizational Structure, Governance & Federation Engine";
  certified_at: string | null;
  all_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runOpsW4Certification(): Wave4Certification {
  const constitution = getOrganizationConstitution();
  const registry = loadRequirementsRegistry();
  const w4Reqs = registry.requirements.filter((r) => r.build === "11.6" && r.wave === "W4");
  const testResults = runOpsW4OrganizationTests();

  const vocabulary = existsSync(join(ROOT, "data/phase-11/organization_vocabulary.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/organization_vocabulary.json"), "utf8"))
    : { terms: [] };
  const hierarchy = existsSync(join(ROOT, "data/phase-11/organization_hierarchy.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/organization_hierarchy.json"), "utf8"))
    : { levels: [] };
  const governance = existsSync(join(ROOT, "data/phase-11/governance_models.json"))
    ? JSON.parse(readFileSync(join(ROOT, "data/phase-11/governance_models.json"), "utf8"))
    : { models: [] };

  const gates = [
    { id: "CAE-11.6-W4-G01", name: "Organization principle", passed: constitution.governing_principle === OPS_ORGANIZATION_PRINCIPLE, detail: "accountable structures" },
    { id: "CAE-11.6-W4-G02", name: "Documentation spine", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.6-W4-G03", name: "Machine-readable contracts", passed: REQUIRED_DATA.every((p) => existsSync(join(ROOT, p))), detail: "vocabulary + hierarchy + governance" },
    { id: "CAE-11.6-W4-G04", name: "Organization hierarchy", passed: hierarchy.levels?.length >= 10, detail: `${hierarchy.levels?.length ?? 0} levels` },
    { id: "CAE-11.6-W4-G05", name: "Governance models", passed: governance.models?.length >= 6, detail: `${governance.models?.length ?? 0} models` },
    { id: "CAE-11.6-W4-G06", name: "W4 requirements", passed: w4Reqs.length >= 30 && w4Reqs.every((r) => r.status === "documented" || r.status === "implemented"), detail: `${w4Reqs.length} requirements` },
    { id: "CAE-11.6-W4-G07", name: "Organization services", passed: REQUIRED_ORGANIZATION_SERVICES.length === 14, detail: REQUIRED_ORGANIZATION_SERVICES.slice(0, 3).join(", ") + "..." },
    { id: "CAE-11.6-W4-G08", name: "Organization tests", passed: allOpsW4TestsPassed(), detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.6-W4-G09", name: "API and service code", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.6-W4-G10", name: "Vocabulary registry", passed: (vocabulary.terms?.length ?? 0) >= 18, detail: `${vocabulary.terms?.length ?? 0} terms` },
    ...checkOpsW4Invariants().map((inv) => ({
      id: inv.id,
      name: OPS_W4_INVARIANTS.find((i) => i.id === inv.id)?.text.slice(0, 48) ?? inv.id,
      passed: inv.passed,
      detail: inv.detail,
    })),
  ];

  const all_passed = gates.every((g) => g.passed) && allOpsW4TestsPassed();

  return {
    wave_id: "11.6-W4",
    build: "11.6",
    subsystem: "OPS-001",
    name: "Organizational Structure, Governance & Federation Engine",
    certified_at: all_passed ? nowIso() : null,
    all_passed,
    gates,
    test_results: testResults,
  };
}

export function isOpsW4Complete(): boolean {
  return runOpsW4Certification().all_passed;
}
