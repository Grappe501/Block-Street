/**
 * CPOS-DURABLE-AUTHORITY-1.2 — Postgres shadow persistence (JSON remains canonical).
 */
import type { LeadershipAppointment } from "./types";
import type { AuthorizationDecision } from "./types";
import type { DenialAuditEvent } from "./types";

export type ShadowWriteResult = {
  attempted: boolean;
  succeeded: boolean;
  target: string;
  diagnostic?: string;
};

const SHADOW_ENABLED =
  process.env.AUTHORITY_SHADOW_WRITES_ENABLED !== "false" &&
  !!process.env.DATABASE_URL;

async function getPool() {
  if (!SHADOW_ENABLED) return null;
  try {
    const { Pool } = await import("pg");
    return new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
  } catch {
    return null;
  }
}

export async function shadowWriteAppointment(appt: LeadershipAppointment): Promise<ShadowWriteResult> {
  const pool = await getPool();
  if (!pool) {
    return { attempted: false, succeeded: false, target: "authority_appointments", diagnostic: "shadow_disabled" };
  }
  try {
    await pool.query(
      `INSERT INTO authority_appointments
        (appointment_id, user_id, role_key, status, starts_at, ends_at, appointed_by, appointment_reason)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (appointment_id) DO UPDATE SET
         user_id = EXCLUDED.user_id,
         role_key = EXCLUDED.role_key,
         status = EXCLUDED.status,
         starts_at = EXCLUDED.starts_at,
         ends_at = EXCLUDED.ends_at,
         updated_at = now()`,
      [
        appt.id,
        appt.user_id,
        appt.role_key,
        appt.status,
        appt.starts_at,
        appt.expires_at,
        null,
        "json_shadow_sync",
      ]
    );
    await pool.query(
      `INSERT INTO authority_appointment_scopes (appointment_id, scope_type, scope_id, relationship)
       VALUES ($1, $2, $3, 'primary')
       ON CONFLICT (appointment_id, scope_type, scope_id, relationship) DO NOTHING`,
      [appt.id, appt.scope_kind, appt.scope_id]
    );
    await pool.end();
    return { attempted: true, succeeded: true, target: "authority_appointments" };
  } catch (e) {
    try {
      await pool.end();
    } catch {
      /* ignore */
    }
    return {
      attempted: true,
      succeeded: false,
      target: "authority_appointments",
      diagnostic: e instanceof Error ? e.message.slice(0, 120) : "shadow_write_failed",
    };
  }
}

export async function shadowWriteDenial(event: Omit<DenialAuditEvent, "timestamp">): Promise<ShadowWriteResult> {
  const pool = await getPool();
  if (!pool) {
    return { attempted: false, succeeded: false, target: "authority_denial_events", diagnostic: "shadow_disabled" };
  }
  try {
    await pool.query(
      `INSERT INTO authority_denial_events
        (actor_id, permission_key, resource_type, resource_id, scope_requested, route, method, reason_code, correlation_id)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9)`,
      [
        event.actor_id,
        event.permission_requested,
        event.resource_type,
        event.resource_id,
        JSON.stringify(event.scope_requested),
        event.route,
        event.method,
        event.reason_code,
        event.correlation_id,
      ]
    );
    await pool.end();
    return { attempted: true, succeeded: true, target: "authority_denial_events" };
  } catch (e) {
    try {
      await pool.end();
    } catch {
      /* ignore */
    }
    return {
      attempted: true,
      succeeded: false,
      target: "authority_denial_events",
      diagnostic: e instanceof Error ? e.message.slice(0, 120) : "shadow_write_failed",
    };
  }
}

export async function shadowWriteOverride(event: {
  actor_id: string;
  override_by: string;
  permission: string;
  resource_type?: string;
  resource_id?: string;
  scope_granted: string[];
  route?: string;
  method?: string;
  override_reason: string;
  correlation_id?: string;
}): Promise<ShadowWriteResult> {
  const pool = await getPool();
  if (!pool) {
    return { attempted: false, succeeded: false, target: "authority_override_events", diagnostic: "shadow_disabled" };
  }
  try {
    await pool.query(
      `INSERT INTO authority_override_events
        (actor_id, override_by, permission_key, resource_type, resource_id, scope_granted, route, method, override_reason, correlation_id)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10)`,
      [
        event.actor_id,
        event.override_by,
        event.permission,
        event.resource_type ?? null,
        event.resource_id ?? null,
        JSON.stringify(event.scope_granted),
        event.route ?? null,
        event.method ?? null,
        event.override_reason,
        event.correlation_id ?? null,
      ]
    );
    await pool.end();
    return { attempted: true, succeeded: true, target: "authority_override_events" };
  } catch (e) {
    try {
      await pool.end();
    } catch {
      /* ignore */
    }
    return {
      attempted: true,
      succeeded: false,
      target: "authority_override_events",
      diagnostic: e instanceof Error ? e.message.slice(0, 120) : "shadow_write_failed",
    };
  }
}

export type ParityMismatch = {
  kind: "json_only" | "postgres_only" | "field_mismatch" | "scope_mismatch" | "status_mismatch";
  appointmentId: string;
  detail: string;
};

export async function compareAppointmentParity(
  jsonAppointments: LeadershipAppointment[]
): Promise<{ mismatches: ParityMismatch[]; jsonCount: number; postgresCount: number }> {
  const pool = await getPool();
  if (!pool) {
    return { mismatches: [], jsonCount: jsonAppointments.length, postgresCount: 0 };
  }
  try {
    const { rows } = await pool.query<{
      appointment_id: string;
      user_id: string;
      role_key: string;
      status: string;
    }>("SELECT appointment_id, user_id, role_key, status FROM authority_appointments");
    const pgMap = new Map(rows.map((r) => [r.appointment_id, r]));
    const mismatches: ParityMismatch[] = [];

    for (const appt of jsonAppointments) {
      const pg = pgMap.get(appt.id);
      if (!pg) {
        mismatches.push({ kind: "json_only", appointmentId: appt.id, detail: "present in JSON, absent in Postgres" });
        continue;
      }
      if (pg.status !== appt.status) {
        mismatches.push({
          kind: "status_mismatch",
          appointmentId: appt.id,
          detail: `json=${appt.status} pg=${pg.status}`,
        });
      }
      if (pg.role_key !== appt.role_key || pg.user_id !== appt.user_id) {
        mismatches.push({
          kind: "field_mismatch",
          appointmentId: appt.id,
          detail: "role_key or user_id differs",
        });
      }
      pgMap.delete(appt.id);
    }
    for (const [id] of pgMap) {
      mismatches.push({ kind: "postgres_only", appointmentId: id, detail: "present in Postgres, absent in JSON" });
    }
    await pool.end();
    return { mismatches, jsonCount: jsonAppointments.length, postgresCount: rows.length };
  } catch {
    try {
      await pool.end();
    } catch {
      /* ignore */
    }
    return { mismatches: [], jsonCount: jsonAppointments.length, postgresCount: 0 };
  }
}

export function compareDecisionParity(
  jsonDecision: AuthorizationDecision,
  pgDecision: AuthorizationDecision
): boolean {
  return (
    jsonDecision.allowed === pgDecision.allowed &&
    jsonDecision.reasonCode === pgDecision.reasonCode &&
    jsonDecision.matchedRoleIds.join() === pgDecision.matchedRoleIds.join()
  );
}
