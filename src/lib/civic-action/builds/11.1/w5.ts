/**
 * CAE-11.1-W5 — API, events, and integrations certification
 */
import { existsSync } from "fs";
import { join } from "path";
import { allW5TestsPassed, runIniW5ApiTests } from "./w5-tests";
import { nowIso } from "../../utils";

const ROOT = process.cwd();

const REQUIRED_DOCS = [
  "docs/phase-11/11.1-initiatives/05_API_EVENTS_INTEGRATIONS.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_API_CONSTITUTION.md",
  "docs/phase-11/11.1-initiatives/INITIATIVE_EVENT_CATALOG.md",
  "docs/phase-11/11.1-initiatives/WAVE_5_CERTIFICATION.md",
  "docs/phase-11/11.1-initiatives/WAVE_6_INTELLIGENCE_HANDOFF.md",
];

const REQUIRED_CODE = [
  "src/lib/civic-action/builds/11.1/api/context.ts",
  "src/lib/civic-action/builds/11.1/api/query-service.ts",
  "src/lib/civic-action/builds/11.1/api/command-service.ts",
  "src/lib/civic-action/builds/11.1/events/outbox-publisher.ts",
  "src/lib/civic-action/builds/11.1/integrations/search-projection.ts",
  "src/lib/civic-action/builds/11.1/integrations/webhook-delivery.ts",
  "src/lib/civic-action/builds/11.1/w5-tests.ts",
  "src/app/api/v1/initiatives/route.ts",
  "src/app/api/v1/initiatives/[id]/actions/[action]/route.ts",
  "src/app/api/v1/search/initiatives/route.ts",
  "data/phase-11/initiative_event_catalog.json",
];

export interface Wave5Certification {
  wave_id: "11.1-W5";
  build: "11.1";
  subsystem: "INI-API-001";
  name: "Initiative APIs, Events, Integrations, Search, and Interoperability";
  certified_at: string | null;
  all_passed: boolean;
  api_tests_passed: boolean;
  gates: { id: string; name: string; passed: boolean; detail: string }[];
  test_results: { name: string; passed: boolean; detail?: string }[];
}

export function runIniW5Certification(): Wave5Certification {
  const testResults = runIniW5ApiTests();
  const testsPassed = allW5TestsPassed();

  const gates = [
    { id: "CAE-11.1-W5-G01", name: "API documentation", passed: REQUIRED_DOCS.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_DOCS.length} docs` },
    { id: "CAE-11.1-W5-G02", name: "API and integration modules", passed: REQUIRED_CODE.every((p) => existsSync(join(ROOT, p))), detail: `${REQUIRED_CODE.length} artifacts` },
    { id: "CAE-11.1-W5-G03", name: "No generic lifecycle CRUD", passed: testsPassed, detail: "constitution tests" },
    { id: "CAE-11.1-W5-G04", name: "Event catalog registered", passed: existsSync(join(ROOT, "data/phase-11/initiative_event_catalog.json")), detail: "initiative_event_catalog.json" },
    { id: "CAE-11.1-W5-G05", name: "Search visibility enforcement", passed: testResults.find((t) => t.name === "search_visibility_scope")?.passed ?? false, detail: "member scope" },
    { id: "CAE-11.1-W5-G06", name: "Import authority guard", passed: testResults.find((t) => t.name === "import_rejects_fabricated_authority")?.passed ?? false, detail: "no fabricated Active" },
    { id: "CAE-11.1-W5-G07", name: "Webhook signing", passed: testResults.find((t) => t.name === "webhook_signature_roundtrip")?.passed ?? false, detail: "HMAC verify" },
    { id: "CAE-11.1-W5-G08", name: "Consumer idempotency", passed: testResults.find((t) => t.name === "consumer_idempotency_receipt")?.passed ?? false, detail: "receipt store" },
  ];

  const allPassed = gates.every((g) => g.passed) && testsPassed;

  return {
    wave_id: "11.1-W5",
    build: "11.1",
    subsystem: "INI-API-001",
    name: "Initiative APIs, Events, Integrations, Search, and Interoperability",
    certified_at: allPassed ? nowIso() : null,
    all_passed: allPassed,
    api_tests_passed: testsPassed,
    gates,
    test_results: testResults,
  };
}
