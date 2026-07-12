/**
 * CAE-11.2-W5 — API, events, and integrations certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { allW5TestsPassed, runObjW5ApiTests } from "./w5-tests";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.2-objectives/05_API_EVENTS_INTEGRATIONS.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_API_PROTOCOL.md",
  "docs/phase-11/11.2-objectives/OBJECTIVE_EVENT_CATALOG.md",
  "docs/phase-11/11.2-objectives/PROTOCOL_5_CERTIFICATION.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.2/api/context.ts",
  "src/lib/civic-action/builds/11.2/api/query-service.ts",
  "src/lib/civic-action/builds/11.2/api/command-service.ts",
  "src/lib/civic-action/builds/11.2/events/outbox-publisher.ts",
  "src/lib/civic-action/builds/11.2/integrations/search-projection.ts",
  "src/lib/civic-action/builds/11.2/integrations/webhook-delivery.ts",
  "src/lib/civic-action/builds/11.2/w5-tests.ts",
  "src/app/api/v1/objectives/route.ts",
  "src/app/api/v1/objectives/[id]/actions/[action]/route.ts",
  "src/app/api/v1/search/objectives/route.ts",
  "data/phase-11/objective_event_catalog.json",
];

export interface Wave5Certification {
  wave_id: "11.2-W5";
  build: "11.2";
  subsystem: "OBJ-API-001";
  name: "Objective APIs, Events, Integration & Automation";
  certified_at: string | null;
  all_passed: boolean;
  api_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runObjW5Certification(): Wave5Certification {
  const testResults = runObjW5ApiTests();
  const testsPassed = allW5TestsPassed();

  const gates = [
    {
      id: "CAE-11.2-W5-G01",
      name: "API documentation",
      passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_DOCS.length} docs`,
    },
    {
      id: "CAE-11.2-W5-G02",
      name: "API and integration modules",
      passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))),
      detail: `${REQUIRED_CODE.length} artifacts`,
    },
    {
      id: "CAE-11.2-W5-G03",
      name: "No generic lifecycle CRUD",
      passed: testsPassed,
      detail: "constitution tests",
    },
    {
      id: "CAE-11.2-W5-G04",
      name: "Event catalog registered",
      passed: existsSync(join(ROOT, "data/phase-11/objective_event_catalog.json")),
      detail: "objective_event_catalog.json",
    },
    {
      id: "CAE-11.2-W5-G05",
      name: "Search visibility enforcement",
      passed: testResults.find((t) => t.name === "search_visibility_scope")?.passed ?? false,
      detail: "institution scope",
    },
    {
      id: "CAE-11.2-W5-G06",
      name: "Initiative upstream guard",
      passed: testResults.find((t) => t.name === "initiative_guard_blocks_missing")?.passed ?? false,
      detail: "11.1 contract",
    },
    {
      id: "CAE-11.2-W5-G07",
      name: "Webhook signing",
      passed: testResults.find((t) => t.name === "webhook_signature_roundtrip")?.passed ?? false,
      detail: "HMAC verify",
    },
    {
      id: "CAE-11.2-W5-G08",
      name: "Consumer idempotency",
      passed: testResults.find((t) => t.name === "consumer_idempotency_receipt")?.passed ?? false,
      detail: "receipt store",
    },
  ];

  const allPassed = gates.every((g) => g.passed) && testsPassed;

  return {
    wave_id: "11.2-W5",
    build: "11.2",
    subsystem: "OBJ-API-001",
    name: "Objective APIs, Events, Integration & Automation",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    api_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}
