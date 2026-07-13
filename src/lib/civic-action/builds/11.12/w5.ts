/**
 * CAE-11.12-W5 — API, events, and integrations certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { allW5TestsPassed, runKnwW5ApiTests } from "./w5-tests";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.12-adaptive-learning/05_API_EVENTS_INTEGRATIONS.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_API_PROTOCOL.md",
  "docs/phase-11/11.12-adaptive-learning/KNOWLEDGE_EVENT_STANDARD.md",
  "docs/phase-11/11.12-adaptive-learning/PROTOCOL_5_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.12/api/context.ts",
  "src/lib/civic-action/builds/11.12/api/query-service.ts",
  "src/lib/civic-action/builds/11.12/api/command-service.ts",
  "src/lib/civic-action/builds/11.12/events/outbox-publisher.ts",
  "src/lib/civic-action/builds/11.12/integrations/search-projection.ts",
  "src/lib/civic-action/builds/11.12/integrations/webhook-delivery.ts",
  "src/lib/civic-action/builds/11.12/w5-tests.ts",
  "src/app/api/v1/knowledge/route.ts",
  "src/app/api/v1/knowledge/commands/route.ts",
  "data/phase-11/knowledge_event_catalog.json",
  "data/phase-11/knowledge_api_registry.json",
];

export interface Wave5Certification {
  wave_id: "11.12-W5";
  build: "11.12";
  subsystem: "KNW-API-001";
  name: "Knowledge APIs, Events, Integration & Automation";
  certified_at: string | null;
  all_passed: boolean;
  api_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runKnwW5Certification(): Wave5Certification {
  const testResults = runKnwW5ApiTests();
  const testsPassed = allW5TestsPassed();

  const gates = [
    {
      id: "CAE-11.12-W5-G01",
      name: "API documentation",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} docs`,
    },
    {
      id: "CAE-11.12-W5-G02",
      name: "API and integration modules",
      passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CODE.length} artifacts`,
    },
    {
      id: "CAE-11.12-W5-G03",
      name: "Commands route through W3 engine",
      passed: testsPassed,
      detail: "constitution tests",
    },
    {
      id: "CAE-11.12-W5-G04",
      name: "Event catalog registered",
      passed: existsSync(join(ROOT, "data/phase-11/knowledge_event_catalog.json")),
      detail: "knowledge_event_catalog.json",
    },
    {
      id: "CAE-11.12-W5-G05",
      name: "Search privacy enforcement",
      passed: testResults.find((t) => t.name === "search_visibility_scope")?.passed ?? false,
      detail: "institution scope",
    },
    {
      id: "CAE-11.12-W5-G06",
      name: "Mission evidence candidate",
      passed: testResults.find((t) => t.name === "mission_evidence_candidate")?.passed ?? false,
      detail: "not auto-verify",
    },
    {
      id: "CAE-11.12-W5-G07",
      name: "Webhook signing",
      passed: testResults.find((t) => t.name === "webhook_signature_roundtrip")?.passed ?? false,
      detail: "HMAC verify",
    },
    {
      id: "CAE-11.12-W5-G08",
      name: "Consumer idempotency",
      passed: testResults.find((t) => t.name === "consumer_idempotency_receipt")?.passed ?? false,
      detail: "receipt store",
    },
    {
      id: "CAE-11.12-W5-G09",
      name: "AI tutor boundaries",
      passed: testResults.find((t) => t.name === "ai_tutor_blocks_exam")?.passed ?? false,
      detail: "assessment protection",
    },
    {
      id: "CAE-11.12-W5-G10",
      name: "Calendar one-way sync",
      passed: testResults.find((t) => t.name === "calendar_one_way_no_lifecycle_mutation")?.passed ?? false,
      detail: "schedule only",
    },
  ];

  const allPassed = gates.every((g) => g.passed) && testsPassed;

  return {
    wave_id: "11.12-W5",
    build: "11.12",
    subsystem: "KNW-API-001",
    name: "Knowledge APIs, Events, Integration & Automation",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    api_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}

export function isKnwW5Complete(): boolean {
  return runKnwW5Certification().all_passed;
}
