export type CalendarPersistenceMode =
  | "seed_only"
  | "session_soft_beta"
  | "postgres_shadow"
  | "postgres_primary";

export type CalendarRbacMode = "disabled" | "audit_only" | "enforced";
export type CalendarNotificationMode = "disabled" | "in_app" | "email_draft" | "sms_draft";

function env(name: string, fallback = ""): string {
  return (process.env[name] ?? fallback).trim();
}

function boolEnv(name: string, fallback: boolean): boolean {
  const v = env(name).toLowerCase();
  if (!v) return fallback;
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export function getCalendarPersistenceConfig() {
  const mode = (env("CALENDAR_PERSISTENCE_MODE", "session_soft_beta") ||
    "session_soft_beta") as CalendarPersistenceMode;
  const writeEnabled = boolEnv("CALENDAR_WRITE_ENABLED", false);
  const rawRbac = (env("CALENDAR_RBAC_MODE", "audit_only") || "audit_only").toLowerCase();
  const rbacMode = (
    rawRbac === "disabled" || rawRbac === "audit_only" || rawRbac === "enforced" ? rawRbac : "audit_only"
  ) as CalendarRbacMode;
  if (rbacMode === "disabled") {
    console.warn(
      "[calendar-rbac] CALENDAR_RBAC_MODE=disabled — emergency local development only; must never be production default",
    );
  }
  const publicationEnabled = boolEnv("CALENDAR_PUBLICATION_ENABLED", false);
  const notificationMode = (env("CALENDAR_NOTIFICATION_MODE", "disabled") ||
    "disabled") as CalendarNotificationMode;

  const databaseUrl = env("DATABASE_URL") || env("NETLIFY_DATABASE_URL") || env("DIRECT_URL");
  const directUrl = env("DIRECT_URL") || databaseUrl;

  return {
    mode,
    writeEnabled,
    rbacMode,
    publicationEnabled,
    notificationMode,
    hasDatabaseUrl: Boolean(databaseUrl),
    /** Never expose the URL — health only. */
    databaseConfigured: Boolean(databaseUrl),
    canAttemptPostgres: Boolean(databaseUrl) && (mode === "postgres_shadow" || mode === "postgres_primary"),
    readsFromPostgres: mode === "postgres_primary",
    writesToPostgres:
      writeEnabled && Boolean(databaseUrl) && (mode === "postgres_shadow" || mode === "postgres_primary"),
    authoritative: mode === "postgres_primary" && writeEnabled,
    safeDefaults: {
      mode: "session_soft_beta" as const,
      writeEnabled: false,
      rbacMode: "audit_only" as const,
      publicationEnabled: false,
      notificationMode: "disabled" as const,
    },
    // reserved for driver — not logged
    _directUrlPresent: Boolean(directUrl),
  };
}

export function assertCalendarWriteAllowed(action: string): void {
  const cfg = getCalendarPersistenceConfig();
  if (!cfg.writeEnabled) {
    throw new Error(`Calendar write blocked (${action}): CALENDAR_WRITE_ENABLED=false`);
  }
  if (!cfg.writesToPostgres && (cfg.mode === "postgres_shadow" || cfg.mode === "postgres_primary")) {
    throw new Error(`Calendar write blocked (${action}): Postgres not configured or mode forbids writes`);
  }
}
