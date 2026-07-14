import { getCalendarPersistenceConfig } from "./config";
import { createPostgresCalendarRepository, createSeedCalendarRepository } from "./postgres-repository";
import type { CalendarRepository } from "./types";
import { SEED_EVENTS } from "../seed";
import type { CalendarEvent } from "../types";

export function getCalendarRepository(): CalendarRepository {
  const cfg = getCalendarPersistenceConfig();
  if (cfg.canAttemptPostgres) {
    return createPostgresCalendarRepository();
  }
  return createSeedCalendarRepository();
}

export async function importAllSeedEvents(actor = "seed-import"): Promise<{
  inserted: number;
  skipped: number;
  conflict: number;
  mode: string;
  writeEnabled: boolean;
  databaseConfigured: boolean;
}> {
  const cfg = getCalendarPersistenceConfig();
  const repo = getCalendarRepository();
  let inserted = 0;
  let skipped = 0;
  let conflict = 0;

  if (!cfg.writesToPostgres) {
    return {
      inserted: 0,
      skipped: SEED_EVENTS.length,
      conflict: 0,
      mode: cfg.mode,
      writeEnabled: cfg.writeEnabled,
      databaseConfigured: cfg.databaseConfigured,
    };
  }

  for (const event of SEED_EVENTS as CalendarEvent[]) {
    const result = await repo.importSeedEvent(event, { actor });
    if (result === "inserted") inserted += 1;
    else if (result === "skipped") skipped += 1;
    else conflict += 1;
  }

  return {
    inserted,
    skipped,
    conflict,
    mode: cfg.mode,
    writeEnabled: cfg.writeEnabled,
    databaseConfigured: cfg.databaseConfigured,
  };
}

export async function runShadowComparison() {
  const cfg = getCalendarPersistenceConfig();
  const repo = getCalendarRepository();
  if (!cfg.databaseConfigured || !cfg.canAttemptPostgres) {
    return {
      status: "blocked" as const,
      reason: "Postgres not configured or mode is not postgres_shadow/primary",
      report: null,
    };
  }
  const report = await repo.shadowCompare(SEED_EVENTS);
  const pass =
    report.missing_in_store.length === 0 &&
    report.scope_mismatches.length === 0 &&
    report.extra_in_store.length === 0;
  return {
    status: pass ? ("pass" as const) : ("fail" as const),
    reason: pass ? "Seed catalog matches store event_ids and college scopes" : "Mismatch detected",
    report,
  };
}

export { getCalendarPersistenceConfig } from "./config";
export { probeCalendarDatabase, applyCoreMigration, rollbackCoreMigrationRehearsal } from "./db";
export type { CalendarRepository } from "./types";
