import { readFileSync } from "fs";
import { join } from "path";
import { getCalendarPersistenceConfig } from "./config";

export type DbProbeResult = {
  ok: boolean;
  configured: boolean;
  connected: boolean;
  migrations_applied: string[];
  error?: string;
  target_classification: "unconfigured" | "connected_unverified" | "connected" | "error";
};

let pgModule: typeof import("pg") | null = null;

async function loadPg() {
  if (pgModule) return pgModule;
  try {
    pgModule = await import("pg");
    return pgModule;
  } catch {
    return null;
  }
}

function connectionString(): string | null {
  return (
    process.env.DATABASE_URL?.trim() ||
    process.env.NETLIFY_DATABASE_URL?.trim() ||
    process.env.DIRECT_URL?.trim() ||
    null
  );
}

export async function withCalendarClient<T>(
  fn: (client: { query: (text: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[]; rowCount: number | null }> }) => Promise<T>,
): Promise<T> {
  const url = connectionString();
  if (!url) throw new Error("DATABASE_URL / NETLIFY_DATABASE_URL not configured");
  const pg = await loadPg();
  if (!pg) throw new Error("pg package not installed — run npm install pg");

  const client = new pg.Client({ connectionString: url, connectionTimeoutMillis: 8000 });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end().catch(() => undefined);
  }
}

export async function probeCalendarDatabase(): Promise<DbProbeResult> {
  const cfg = getCalendarPersistenceConfig();
  if (!cfg.databaseConfigured) {
    return {
      ok: false,
      configured: false,
      connected: false,
      migrations_applied: [],
      target_classification: "unconfigured",
      error: "No DATABASE_URL / NETLIFY_DATABASE_URL / DIRECT_URL",
    };
  }
  try {
    return await withCalendarClient(async (client) => {
      await client.query("SELECT 1 AS ok");
      let migrations: string[] = [];
      try {
        const r = await client.query("SELECT id FROM calendar_schema_migrations ORDER BY applied_at");
        migrations = r.rows.map((row) => String(row.id));
      } catch {
        migrations = [];
      }
      return {
        ok: true,
        configured: true,
        connected: true,
        migrations_applied: migrations,
        target_classification: "connected",
      };
    });
  } catch (e) {
    return {
      ok: false,
      configured: true,
      connected: false,
      migrations_applied: [],
      target_classification: "error",
      error: e instanceof Error ? e.message : "connection failed",
    };
  }
}

export function readCoreMigrationSql(): string {
  return readFileSync(
    join(process.cwd(), "database/migrations/20260714190000_calendar_p1_core.sql"),
    "utf8",
  );
}

export function readCoreRollbackSql(): string {
  return readFileSync(
    join(process.cwd(), "database/migrations/20260714190000_calendar_p1_core.down.sql"),
    "utf8",
  );
}

export async function applyCoreMigration(): Promise<{ applied: boolean; detail: string }> {
  const sql = readCoreMigrationSql();
  return withCalendarClient(async (client) => {
    await client.query(sql);
    return { applied: true, detail: "20260714190000_calendar_p1_core applied or already present" };
  });
}

export async function rollbackCoreMigrationRehearsal(): Promise<{ rolled_back: boolean; detail: string }> {
  if (process.env.CALENDAR_ALLOW_DESTRUCTIVE_ROLLBACK !== "true") {
    throw new Error("Set CALENDAR_ALLOW_DESTRUCTIVE_ROLLBACK=true for rehearsal rollback only");
  }
  const sql = readCoreRollbackSql();
  return withCalendarClient(async (client) => {
    await client.query(sql);
    return { rolled_back: true, detail: "Core calendar tables dropped (rehearsal)" };
  });
}
