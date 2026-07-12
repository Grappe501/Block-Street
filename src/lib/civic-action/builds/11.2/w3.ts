import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { allW3TestsPassed, runObjW3ServiceTests } from "./w3-tests";
import { ALL_EXECUTION_DOMAIN_SERVICES } from "./services/domain-registry";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.2-objectives/EXECUTION_ENGINE_PROTOCOL.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_DOMAIN_SERVICES.md",
  "docs/phase-11/11.2-objectives/MISSION_DOMAIN_SERVICES.md",
  "docs/phase-11/11.2-objectives/TASK_DOMAIN_SERVICES.md",
  "docs/phase-11/11.2-objectives/EXECUTION_STATE_MACHINES.md",
  "docs/phase-11/11.2-objectives/EXECUTION_POLICY_ENGINE.md",
  "docs/phase-11/11.2-objectives/COMMAND_PIPELINE.md",
  "docs/phase-11/11.2-objectives/EVENT_PUBLISHING_STANDARD.md",
  "docs/phase-11/11.2-objectives/VERSIONING_ENGINE.md",
  "docs/phase-11/11.2-objectives/AUDIT_ENGINE.md",
  "docs/phase-11/11.2-objectives/PROTOCOL_3_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.2/services/execution-engine.ts",
  "src/lib/civic-action/builds/11.2/services/commands.ts",
  "src/lib/civic-action/builds/11.2/services/validation-pipeline.ts",
  "src/lib/civic-action/builds/11.2/services/events.ts",
  "src/lib/civic-action/builds/11.2/services/repository.ts",
  "src/lib/civic-action/builds/11.2/w3-tests.ts",
];

export interface Protocol3Certification {
  protocol_id: "11.2-W3";
  build: "11.2";
  subsystem: "OBJ-SVC-001";
  protocol_name: "Objective Domain Services & Execution Engine Protocol";
  certified_at: string | null;
  all_passed: boolean;
  service_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runObjW3Certification(): Protocol3Certification {
  const registry = loadRequirementsRegistry();
  const w3Reqs = registry.requirements.filter((r) => r.build === "11.2" && r.wave === "W3");
  const testResults = runObjW3ServiceTests();
  const testsPassed = allW3TestsPassed();

  const gates = [
    { id: "CAE-11.2-W3-G01", name: "Execution engine docs", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.2-W3-G02", name: "Domain service modules", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} modules` },
    { id: "CAE-11.2-W3-G03", name: "Domain service registry", passed: ALL_EXECUTION_DOMAIN_SERVICES.length >= 30, detail: `${ALL_EXECUTION_DOMAIN_SERVICES.length} services` },
    { id: "CAE-11.2-W3-G04", name: "W3 requirements implemented", passed: w3Reqs.length >= 40 && w3Reqs.every((r) => r.status === "implemented"), detail: `${w3Reqs.length} requirements` },
    { id: "CAE-11.2-W3-G05", name: "Service tests pass", passed: testsPassed, detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}` },
    { id: "CAE-11.2-W3-G06", name: "Illegal transitions rejected", passed: testResults.find((t) => t.name.includes("draft→approved"))?.passed ?? false, detail: "lifecycle" },
    { id: "CAE-11.2-W3-G07", name: "Service identity rejected", passed: testResults.find((t) => t.name.includes("service identity"))?.passed ?? false, detail: "AI boundary" },
    { id: "CAE-11.2-W3-G08", name: "Direct mutation forbidden", passed: testResults.find((t) => t.name.includes("direct mutation"))?.passed ?? false, detail: "SVC-001" },
    { id: "CAE-11.2-W3-G09", name: "Create objective works", passed: testResults.find((t) => t.name.includes("create objective"))?.passed ?? false, detail: "CreateObjective" },
    { id: "CAE-11.2-W3-G10", name: "Parent constraint enforced", passed: testResults.find((t) => t.name.includes("mission start blocked"))?.passed ?? false, detail: "parent validation" },
    { id: "CAE-11.2-W3-G11", name: "Version on mutation", passed: testResults.find((t) => t.name.includes("version records"))?.passed ?? false, detail: "versioning" },
    { id: "CAE-11.2-W3-G12", name: "Events published", passed: testResults.find((t) => t.name.includes("events published"))?.passed ?? false, detail: "event bus" },
  ];

  const allPassed = gates.every((g) => g.passed);

  return {
    protocol_id: "11.2-W3",
    build: "11.2",
    subsystem: "OBJ-SVC-001",
    protocol_name: "Objective Domain Services & Execution Engine Protocol",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    service_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}

export function getObjW3Overview() {
  return {
    subsystem: "OBJ-SVC-001",
    certification: runObjW3Certification(),
    domain_services: ALL_EXECUTION_DOMAIN_SERVICES,
    requirements: loadRequirementsRegistry().requirements.filter((r) => r.build === "11.2" && r.wave === "W3"),
    commands: [
      "CreateObjective",
      "ProposeObjective",
      "ApproveObjective",
      "ActivateObjective",
      "CreateMission",
      "StartMission",
      "CompleteMission",
      "CreateTask",
      "AssignTask",
      "CompleteTask",
      "AttachEvidence",
      "RecordOutcome",
    ],
  };
}

export function isObjW3Complete(): boolean {
  return runObjW3Certification().all_passed;
}
