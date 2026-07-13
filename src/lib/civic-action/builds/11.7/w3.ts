import { existsSync } from "fs";
import { join } from "path";
import { loadRequirementsRegistry } from "../../scaffold/ledger";
import { allW3TestsPassed, runComW3ServiceTests } from "./w3-tests";
import { ALL_COMMUNICATION_DOMAIN_SERVICES } from "./services/domain-registry";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-communications/03_DOMAIN_SERVICES_PROTOCOL.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_DOMAIN_SERVICES.md",
  "docs/phase-11/11.7-communications/CONVERSATION_ENGINE.md",
  "docs/phase-11/11.7-communications/MESSAGE_ENGINE.md",
  "docs/phase-11/11.7-communications/DECISION_ENGINE.md",
  "docs/phase-11/11.7-communications/MEETING_ENGINE.md",
  "docs/phase-11/11.7-communications/DOCUMENT_COLLABORATION_ENGINE.md",
  "docs/phase-11/11.7-communications/KNOWLEDGE_CAPTURE_ENGINE.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_POLICY_ENGINE.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_STATE_MACHINE.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_VALIDATION_PIPELINE.md",
  "docs/phase-11/11.7-communications/PROTOCOL_3_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/services/communications-engine.ts",
  "src/lib/civic-action/builds/11.7/services/commands.ts",
  "src/lib/civic-action/builds/11.7/services/validation-pipeline.ts",
  "src/lib/civic-action/builds/11.7/services/events.ts",
  "src/lib/civic-action/builds/11.7/services/repository.ts",
  "src/lib/civic-action/builds/11.7/w3-tests.ts",
];

export interface Protocol3Certification {
  protocol_id: "11.7-W3";
  build: "11.7";
  subsystem: "COM-SVC-001";
  protocol_name: "Communications Domain Services Protocol";
  certified_at: string | null;
  all_passed: boolean;
  service_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runComW3Certification(): Protocol3Certification {
  const registry = loadRequirementsRegistry();
  const w3Reqs = registry.requirements.filter((r) => r.build === "11.7" && r.wave === "W3");
  const testResults = runComW3ServiceTests();
  const testsPassed = allW3TestsPassed();

  const gates = [
    {
      id: "CAE-11.7-W3-G01",
      name: "Communications engine docs",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} docs`,
    },
    {
      id: "CAE-11.7-W3-G02",
      name: "Domain service modules",
      passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CODE.length} modules`,
    },
    {
      id: "CAE-11.7-W3-G03",
      name: "Domain service registry",
      passed: ALL_COMMUNICATION_DOMAIN_SERVICES.length >= 50,
      detail: `${ALL_COMMUNICATION_DOMAIN_SERVICES.length} services`,
    },
    {
      id: "CAE-11.7-W3-G04",
      name: "W3 requirements implemented",
      passed: w3Reqs.length >= 40 && w3Reqs.every((r) => r.status === "implemented"),
      detail: `${w3Reqs.length} requirements`,
    },
    {
      id: "CAE-11.7-W3-G05",
      name: "Service tests pass",
      passed: testsPassed,
      detail: `${testResults.filter((t) => t.passed).length}/${testResults.length}`,
    },
    {
      id: "CAE-11.7-W3-G06",
      name: "Illegal transitions rejected",
      passed: testResults.find((t) => t.name.includes("draft→archived"))?.passed ?? false,
      detail: "lifecycle",
    },
    {
      id: "CAE-11.7-W3-G07",
      name: "Service identity rejected",
      passed: testResults.find((t) => t.name.includes("service identity"))?.passed ?? false,
      detail: "AI boundary",
    },
    {
      id: "CAE-11.7-W3-G08",
      name: "Direct mutation forbidden",
      passed: testResults.find((t) => t.name.includes("direct mutation"))?.passed ?? false,
      detail: "SVC-001",
    },
    {
      id: "CAE-11.7-W3-G09",
      name: "Create conversation works",
      passed: testResults.find((t) => t.name.includes("create conversation"))?.passed ?? false,
      detail: "CreateConversation",
    },
    {
      id: "CAE-11.7-W3-G10",
      name: "Post message works",
      passed: testResults.find((t) => t.name.includes("post message"))?.passed ?? false,
      detail: "PostMessage",
    },
    {
      id: "CAE-11.7-W3-G11",
      name: "Version on mutation",
      passed: testResults.find((t) => t.name.includes("version on edit"))?.passed ?? false,
      detail: "versioning",
    },
    {
      id: "CAE-11.7-W3-G12",
      name: "Events published",
      passed: testResults.find((t) => t.name.includes("events published"))?.passed ?? false,
      detail: "event bus",
    },
    {
      id: "CAE-11.7-W3-G13",
      name: "Decision recorded",
      passed: testResults.find((t) => t.name.includes("decision recorded"))?.passed ?? false,
      detail: "RecordDecision",
    },
    {
      id: "CAE-11.7-W3-G14",
      name: "AI summary boundary",
      passed: testResults.find((t) => t.name.includes("AI summary does not post"))?.passed ?? false,
      detail: "AI doctrine",
    },
    {
      id: "CAE-11.7-W3-G15",
      name: "Mission sync queue",
      passed: testResults.find((t) => t.name.includes("mission sync"))?.passed ?? false,
      detail: "11.3 stub",
    },
  ];

  const allPassed = gates.every((g) => g.passed);

  return {
    protocol_id: "11.7-W3",
    build: "11.7",
    subsystem: "COM-SVC-001",
    protocol_name: "Communications Domain Services Protocol",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    service_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}

export function getComW3Overview() {
  return {
    subsystem: "COM-SVC-001",
    certification: runComW3Certification(),
    domain_services: ALL_COMMUNICATION_DOMAIN_SERVICES,
    requirements: loadRequirementsRegistry().requirements.filter((r) => r.build === "11.7" && r.wave === "W3"),
    commands: [
      "CreateConversation",
      "CreateThread",
      "PostMessage",
      "EditMessage",
      "RecordDecision",
      "CreateMeeting",
      "PublishAnnouncement",
      "CreateDocument",
      "ArchiveConversation",
      "GenerateAISummary",
      "CreateActionItem",
      "ResolveThread",
    ],
  };
}

export function isComW3Complete(): boolean {
  return runComW3Certification().all_passed;
}
