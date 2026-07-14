/**
 * CAL-P1 persistence probes and import tooling.
 * Never prints connection strings.
 */
import "../h-drive-env.mjs";
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");
const require = createRequire(import.meta.url);
const jiti = require("jiti")(import.meta.url);

const persistence = jiti(join(root, "src/lib/calendar/persistence/repository.ts"));
const seedMod = jiti(join(root, "src/lib/calendar/seed.ts"));

const cmd = process.argv[2] ?? "probe";

async function main() {
  if (cmd === "probe") {
    const probe = await persistence.probeCalendarDatabase();
    const cfg = persistence.getCalendarPersistenceConfig();
    console.log(
      JSON.stringify(
        {
          command: "probe",
          mode: cfg.mode,
          writeEnabled: cfg.writeEnabled,
          ...probe,
        },
        null,
        2,
      ),
    );
    process.exit(probe.connected || !cfg.databaseConfigured ? 0 : 1);
  }

  if (cmd === "migrate") {
    const cfg = persistence.getCalendarPersistenceConfig();
    if (!cfg.databaseConfigured) {
      console.log(JSON.stringify({ command: "migrate", status: "blocked", reason: "no database URL" }, null, 2));
      process.exit(0);
    }
    const result = await persistence.applyCoreMigration();
    console.log(JSON.stringify({ command: "migrate", ...result }, null, 2));
    return;
  }

  if (cmd === "seed-import") {
    const result = await persistence.importAllSeedEvents("cli-seed-import");
    console.log(JSON.stringify({ command: "seed-import", seedCount: seedMod.SEED_EVENTS.length, ...result }, null, 2));
    return;
  }

  if (cmd === "shadow-compare") {
    const result = await persistence.runShadowComparison();
    console.log(JSON.stringify({ command: "shadow-compare", ...result }, null, 2));
    process.exit(result.status === "fail" ? 1 : 0);
  }

  if (cmd === "rollback-rehearsal") {
    const result = await persistence.rollbackCoreMigrationRehearsal();
    console.log(JSON.stringify({ command: "rollback-rehearsal", ...result }, null, 2));
    return;
  }

  console.error("Usage: calendar-p1-tool.mjs [probe|migrate|seed-import|shadow-compare|rollback-rehearsal]");
  process.exit(2);
}

main().catch((e) => {
  console.error(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }));
  process.exit(1);
});
