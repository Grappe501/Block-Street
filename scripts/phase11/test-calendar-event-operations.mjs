/**
 * CAL-P2 Wave 1A — event operations, readiness, and attention tests.
 */
import "../h-drive-env.mjs";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function loadCalendar() {
  try {
    const { createJiti } = await import("jiti");
    const jiti = createJiti(import.meta.url);
    return jiti(join(root, "src/lib/calendar/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const jiti = require("jiti")(import.meta.url);
    return jiti(join(root, "src/lib/calendar/index.ts"));
  }
}

const cal = await loadCalendar();
const ops = cal.listEventOperationsSummaries({ kind: "command" });

// --- event-operations ---
const dupes = cal.assertNoDuplicateEventIds();
assert(dupes.length === 0, "duplicate event ids");
assert(ops.length >= cal.SEED_EVENTS.length, `expected at least ${cal.SEED_EVENTS.length} summaries, got ${ops.length}`);
const ids = new Set(ops.map((s) => s.eventId));
assert(ids.size === ops.length, "duplicate summaries");

const henderson = ops.find((s) => s.eventId === "evt-henderson-vr-drive");
assert(henderson, "henderson summary");
assert(henderson.readiness.length === 12, "12 readiness dimensions");

const collegeHenderson = cal.listEventOperationsSummaries({ kind: "college", collegeSlug: "henderson-state" });
assert(collegeHenderson.some((s) => s.eventId === "evt-henderson-vr-drive"), "college scope");
assert(!collegeHenderson.some((s) => s.eventId === "evt-uca-networking"), "uca not in henderson scope");

const countyClark = cal.listEventOperationsSummaries({ kind: "county", countySlug: "clark" });
assert(countyClark.some((s) => s.eventId === "evt-henderson-vr-drive"), "county scope");

const uca = cal.getEventById("evt-uca-networking");
const ucaOps = cal.buildEventOperationsSummary(uca);
const serialized = JSON.stringify(ucaOps);
assert(!serialized.includes("PRIVATE"), "candidate-private must not leak in ops summary");
assert(!serialized.includes(uca.security_or_private_notes ?? "___"), "private notes must not leak");

// --- readiness ---
for (const s of ops) {
  assert(s.readiness.length === 12, `${s.eventId} must have 12 dimensions`);
  for (const item of s.readiness) {
    assert(item.state && item.label && item.explanation, `${s.eventId} ${item.dimension} incomplete`);
  }
}

const approvalDim = henderson.readiness.find((r) => r.dimension === "approval");
const verifyDim = henderson.readiness.find((r) => r.dimension === "verification");
assert(approvalDim?.explanation.includes("calendar") || approvalDim?.explanation.includes("Calendar"), "approval labeled");
assert(verifyDim?.explanation.includes("venue") || verifyDim?.explanation.includes("legal") || verifyDim?.state === "not_required", "verification separate");

const kellyEvent = cal.getEventById("evt-kelly-campus-hold-asu");
const kellyOps = cal.buildEventOperationsSummary(kellyEvent);
const candDim = kellyOps.readiness.find((r) => r.dimension === "candidate");
assert(candDim?.explanation.includes("confirmation") || candDim?.explanation.includes("≠"), "request ≠ confirmation");

const staffingDim = henderson.readiness.find((r) => r.dimension === "staffing");
assert(staffingDim?.explanation.includes("Interest") || staffingDim?.explanation.includes("assignment"), "interest ≠ assignment");

// blocked overall when dimension blocked — ops committee has pending approval, virtual kickoff unowned test
const unowned = cal.filterUnowned(ops);
assert(unowned.length >= 1, "at least one unowned seed event");

// --- attention ---
const withAttention = ops.filter((s) => s.attentionSeverity !== "none");
assert(withAttention.length >= 1, "seed should produce attention signals");
for (const s of withAttention) {
  assert(s.attentionReasons.length >= 1, `${s.eventId} attention must have reasons`);
  assert(s.attentionReasons.every((r) => r.length > 10), "reasons must be human-readable");
}

const critical = ops.filter((s) => s.attentionSeverity === "critical");
for (const s of critical) {
  assert(s.attentionReasons[0], "critical must explain");
}

const sorted = cal.sortByAttention(ops);
if (sorted.length >= 2) {
  const rank = { critical: 0, urgent: 1, needs_attention: 2, watch: 3, none: 4 };
  assert(rank[sorted[0].attentionSeverity] <= rank[sorted[1].attentionSeverity], "severity sort");
}

// route files exist
const routeChecks = [
  "src/app/command/events/page.tsx",
  "src/app/command/events/today/page.tsx",
  "src/app/command/events/upcoming/page.tsx",
  "src/app/command/events/attention/page.tsx",
  "src/app/command/events/readiness/page.tsx",
  "src/app/command/events/at-risk/page.tsx",
  "src/app/command/events/unowned/page.tsx",
  "src/app/command/events/reports-due/page.tsx",
  "src/components/calendar/operations/EventOperationsMatrix.tsx",
  "src/components/calendar/operations/EventOperationsPanel.tsx",
  "data/calendar/cal-p2-wave1a-status.json",
];
for (const rel of routeChecks) {
  readFileSync(join(root, rel), "utf8");
}

const matrixSrc = readFileSync(join(root, "src/components/calendar/operations/EventOperationsMatrix.tsx"), "utf8");
assert(matrixSrc.includes("md:hidden"), "mobile card fallback in matrix");

const status = JSON.parse(readFileSync(join(root, "data/calendar/cal-p2-wave1a-status.json"), "utf8"));
assert(status.gate_a === "OPEN", "gate A open");
assert(status.rbac_mode === "audit_only", "audit only");
assert(status.final_state === "TESTED" || status.final_state === "PRESENT", "honest claim");

const contractFiles = [
  "tests/calendar/event-operations.test.ts",
  "tests/calendar/readiness.test.ts",
  "tests/calendar/attention.test.ts",
];
for (const f of contractFiles) {
  const src = readFileSync(join(root, f), "utf8");
  assert(src.includes("export const suite"), `${f} contract`);
}

console.log("CAL-P2 Wave 1A operations tests passed");
console.log(`  events evaluated: ${ops.length}`);
console.log(`  attention flagged: ${withAttention.length}`);
console.log(`  readiness dimensions: 12`);
console.log(`  attention rules: ${cal.ATTENTION_KEYS.length}`);
