/**
 * CAE-11.7-W5 — API, events, and integrations certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { allW5TestsPassed, runComW5ApiTests } from "./w5-tests";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.7-communications/05_API_EVENTS_INTEGRATIONS.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_API_PROTOCOL.md",
  "docs/phase-11/11.7-communications/COMMUNICATION_EVENT_STANDARD.md",
  "docs/phase-11/11.7-communications/PROTOCOL_5_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.7/api/context.ts",
  "src/lib/civic-action/builds/11.7/api/query-service.ts",
  "src/lib/civic-action/builds/11.7/api/command-service.ts",
  "src/lib/civic-action/builds/11.7/events/outbox-publisher.ts",
  "src/lib/civic-action/builds/11.7/integrations/search-projection.ts",
  "src/lib/civic-action/builds/11.7/integrations/webhook-delivery.ts",
  "src/lib/civic-action/builds/11.7/w5-tests.ts",
  "src/app/api/v1/communications/route.ts",
  "src/app/api/v1/communications/[id]/actions/[action]/route.ts",
  "data/phase-11/communication_event_catalog.json",
];

export interface Wave5Certification {
  wave_id: "11.7-W5";
  build: "11.7";
  subsystem: "COM-API-001";
  name: "Communication APIs, Events, Integration & Automation";
  certified_at: string | null;
  all_passed: boolean;
  api_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runComW5Certification(): Wave5Certification {
  const testResults = runComW5ApiTests();
  const testsPassed = allW5TestsPassed();

  const gates = [
    {
      id: "CAE-11.7-W5-G01",
      name: "API documentation",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} docs`,
    },
    {
      id: "CAE-11.7-W5-G02",
      name: "API and integration modules",
      passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CODE.length} artifacts`,
    },
    {
      id: "CAE-11.7-W5-G03",
      name: "No generic lifecycle CRUD",
      passed: testsPassed,
      detail: "constitution tests",
    },
    {
      id: "CAE-11.7-W5-G04",
      name: "Event catalog registered",
      passed: existsSync(join(ROOT, "data/phase-11/communication_event_catalog.json")),
      detail: "communication_event_catalog.json",
    },
    {
      id: "CAE-11.7-W5-G05",
      name: "Search visibility enforcement",
      passed: testResults.find((t) => t.name === "search_visibility_scope")?.passed ?? false,
      detail: "institution scope",
    },
    {
      id: "CAE-11.7-W5-G06",
      name: "Mission adapter stub",
      passed: testResults.find((t) => t.name === "mission_adapter_creates_stub")?.passed ?? false,
      detail: "mission conversation",
    },
    {
      id: "CAE-11.7-W5-G07",
      name: "Webhook signing",
      passed: testResults.find((t) => t.name === "webhook_signature_roundtrip")?.passed ?? false,
      detail: "HMAC verify",
    },
    {
      id: "CAE-11.7-W5-G08",
      name: "Consumer idempotency",
      passed: testResults.find((t) => t.name === "consumer_idempotency_receipt")?.passed ?? false,
      detail: "receipt store",
    },
    {
      id: "CAE-11.7-W5-G09",
      name: "AI read-only interface",
      passed: testResults.find((t) => t.name === "ai_read_only_summary")?.passed ?? false,
      detail: "no mutation",
    },
    {
      id: "CAE-11.7-W5-G10",
      name: "Calendar one-way sync",
      passed: testResults.find((t) => t.name === "calendar_one_way_no_lifecycle_mutation")?.passed ?? false,
      detail: "schedule only",
    },
  ];

  const allPassed = gates.every((g) => g.passed) && testsPassed;

  return {
    wave_id: "11.7-W5",
    build: "11.7",
    subsystem: "COM-API-001",
    name: "Communication APIs, Events, Integration & Automation",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    api_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}

export function isComW5Complete(): boolean {
  return runComW5Certification().all_passed;
}
