import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { allW3TestsPassed, runKnwW3ServiceTests } from "./w3-tests";
import { ALL_KNOWLEDGE_DOMAIN_SERVICES } from "./services/domain-registry";
import { ALL_KNOWLEDGE_COMMAND_TYPES } from "./services/commands";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.12-adaptive-learning/03_DOMAIN_SERVICES.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_COMMAND_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_DOMAIN_ERROR_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_LIFECYCLE_ENGINE.md",
  "docs/phase-11/11.12-adaptive-learning/CLAIM_EVIDENCE_SERVICES.md",
  "docs/phase-11/11.12-adaptive-learning/LEARNING_PROGRAM_AND_COURSE_SERVICES.md",
  "docs/phase-11/11.12-adaptive-learning/CERTIFICATION_SERVICES.md",
  "docs/phase-11/11.12-adaptive-learning/TRANSLATION_AND_AI_TUTOR_SERVICES.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_EVENT_AND_OUTBOX_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_SERVICE_OVERLAP_AUDIT.md",
  "docs/phase-11/11.12-adaptive-learning/PROTOCOL_3_CERTIFICATION.md",
  "docs/phase-11/11.12-adaptive-learning/WAVE_3_TEST_PLAN.md",
  "docs/phase-11/11.12-adaptive-learning/WAVE_4_HANDOFF.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.12/services/knowledge-engine.ts",
  "src/lib/civic-action/builds/11.12/services/commands.ts",
  "src/lib/civic-action/builds/11.12/services/validation-pipeline.ts",
  "src/lib/civic-action/builds/11.12/services/events.ts",
  "src/lib/civic-action/builds/11.12/services/repository.ts",
  "src/lib/civic-action/builds/11.12/w3-tests.ts",
];

export interface Protocol3Certification {
  protocol_id: "11.12-W3";
  build: "11.12";
  subsystem: "ADP-001";
  protocol_name: "Knowledge Domain Services Protocol";
  certified_at: string | null;
  all_passed: boolean;
  service_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runKnwW3Certification(): Protocol3Certification {
  const registry = loadRequirementsRegistry();
  const w3Reqs = registry.requirements.filter((r) => r.build === "11.12" && r.wave === "W3");
  const testResults = runKnwW3ServiceTests();
  const testsPassed = allW3TestsPassed();

  const gates = [
    {
      id: "CAE-11.12-W3-G01",
      name: "Knowledge engine docs",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} docs`,
    },
    {
      id: "CAE-11.12-W3-G02",
      name: "Domain service modules",
      passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CODE.length} modules`,
    },
    {
      id: "CAE-11.12-W3-G03",
      name: "Domain service registry",
      passed: ALL_KNOWLEDGE_DOMAIN_SERVICES.length >= 50,
      detail: `${ALL_KNOWLEDGE_DOMAIN_SERVICES.length} services`,
    },
    {
      id: "CAE-11.12-W3-G04",
      name: "W3 requirements implemented",
      passed: w3Reqs.length >= 42 && w3Reqs.every((r) => r.status === "implemented"),
      detail: `${w3Reqs.length} requirements`,
    },
    {
      id: "CAE-11.12-W3-G05",
      name: "Service tests pass",
      passed: testsPassed,
      detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}`,
    },
    {
      id: "CAE-11.12-W3-G06",
      name: "Illegal transitions rejected",
      passed: testResults.find((t) => t.name.includes("draft→published"))?.passed ?? false,
      detail: "lifecycle",
    },
    {
      id: "CAE-11.12-W3-G07",
      name: "Direct mutation forbidden",
      passed: testResults.find((t) => t.name.includes("direct mutation"))?.passed ?? false,
      detail: "SVC-001",
    },
    {
      id: "CAE-11.12-W3-G08",
      name: "Create artifact draft",
      passed: testResults.find((t) => t.name.includes("create artifact"))?.passed ?? false,
      detail: "CreateKnowledgeArtifact",
    },
    {
      id: "CAE-11.12-W3-G09",
      name: "Publish approval gate",
      passed: testResults.find((t) => t.name.includes("publish without approval"))?.passed ?? false,
      detail: "approval required",
    },
    {
      id: "CAE-11.12-W3-G10",
      name: "Command catalog",
      passed: ALL_KNOWLEDGE_COMMAND_TYPES.length >= 40,
      detail: `${ALL_KNOWLEDGE_COMMAND_TYPES.length} commands`,
    },
  ];

  const allPassed = gates.every((g) => g.passed);

  return {
    protocol_id: "11.12-W3",
    build: "11.12",
    subsystem: "ADP-001",
    protocol_name: "Knowledge Domain Services Protocol",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    service_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}

export function getKnwW3Overview() {
  return {
    subsystem: "ADP-001",
    certification: runKnwW3Certification(),
    domain_services: ALL_KNOWLEDGE_DOMAIN_SERVICES,
    requirements: loadRequirementsRegistry().requirements.filter((r) => r.build === "11.12" && r.wave === "W3"),
    commands: ALL_KNOWLEDGE_COMMAND_TYPES,
  };
}

export function isKnwW3Complete(): boolean {
  return runKnwW3Certification().all_passed;
}
