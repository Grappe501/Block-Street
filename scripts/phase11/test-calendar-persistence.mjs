/**
 * test:calendar:persistence — Wave 1 architecture + optional live DB gates.
 */
import "../h-drive-env.mjs";
import { existsSync, readFileSync } from "fs";
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");
const require = createRequire(import.meta.url);
const jiti = require("jiti")(import.meta.url);

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const migration = join(root, "database/migrations/20260714190000_calendar_p1_core.sql");
const down = join(root, "database/migrations/20260714190000_calendar_p1_core.down.sql");
const arch = join(root, "docs/calendar/CAL_P1_DURABILITY_ARCHITECTURE.md");
const plan = join(root, "docs/calendar/CAL_P1_MIGRATION_AND_ROLLBACK_PLAN.md");

assert(existsSync(migration), "core migration missing");
assert(existsSync(down), "rollback sql missing");
assert(existsSync(arch), "architecture doc missing");
assert(existsSync(plan), "migration plan missing");

const sql = readFileSync(migration, "utf8");
assert(sql.includes("calendar_events"), "events table");
assert(sql.includes("calendar_event_scopes"), "scopes table");
assert(sql.includes("calendar_event_candidate_details"), "candidate privacy table");
assert(sql.includes("calendar_event_audit_log"), "audit table");
assert(sql.includes("UNIQUE (event_id, scope_type, scope_key)"), "scope uniqueness");

const persistence = jiti(join(root, "src/lib/calendar/persistence/repository.ts"));
const seedMod = jiti(join(root, "src/lib/calendar/seed.ts"));
const cfg = persistence.getCalendarPersistenceConfig();

assert(["seed_only", "session_soft_beta", "postgres_shadow", "postgres_primary"].includes(cfg.mode), "valid mode");
assert(cfg.rbacMode === "audit_only" || cfg.rbacMode === "enforced", "rbac mode");
assert(cfg.authoritative === false || cfg.mode === "postgres_primary", "authority default safe");

const ids = seedMod.SEED_EVENTS.map((e) => e.event_id);
assert(new Set(ids).size === ids.length, "seed event_ids unique");

const probe = await persistence.probeCalendarDatabase();
let live = null;

if (probe.connected && cfg.writeEnabled && (cfg.mode === "postgres_shadow" || cfg.mode === "postgres_primary")) {
  await persistence.applyCoreMigration();
  const first = await persistence.importAllSeedEvents("persistence-test");
  const second = await persistence.importAllSeedEvents("persistence-test");
  assert(second.inserted === 0, "second import must insert 0 (idempotent)");
  assert(second.conflict === 0, "no conflicts on clean seed import");
  const compare = await persistence.runShadowComparison();
  assert(compare.status === "pass", `shadow compare failed: ${compare.reason}`);
  const repo = persistence.getCalendarRepository();
  const hend = await repo.getEventById("evt-henderson-vr-drive");
  assert(hend, "henderson persisted");
  assert((await repo.getAuditCount("evt-henderson-vr-drive")) >= 1, "audit on import");
  live = {
    first,
    second,
    compare,
    scopes: await repo.countScopes(),
    events: (await repo.listEventIds()).length,
  };
}

console.log(
  JSON.stringify(
    {
      status: "PASS",
      wave: "CAL-P1.0+P1.1",
      mode: cfg.mode,
      writeEnabled: cfg.writeEnabled,
      databaseConfigured: cfg.databaseConfigured,
      probe: probe.target_classification,
      seedEvents: ids.length,
      liveImport: live,
      authority: cfg.authoritative ? "postgres_primary" : "not_certified_soft_beta_or_shadow",
      note: live
        ? "Live Postgres idempotent import verified"
        : "Architecture PASS without live DB — connectivity gate remains open until DATABASE_URL is available",
    },
    null,
    2,
  ),
);
