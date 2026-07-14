import { SEED_EVENTS } from "../seed";
import type { CalendarEvent } from "../types";
import { getCalendarPersistenceConfig } from "./config";
import { withCalendarClient } from "./db";
import { eventToDurableParts, type CalendarRepository } from "./types";
import { buildCanonicalEvent } from "../canonical";

function rowToEvent(row: Record<string, unknown>, scopes: { scope_type: string; scope_key: string }[]): CalendarEvent {
  const college_slugs = scopes.filter((s) => s.scope_type === "college").map((s) => s.scope_key);
  const county_slugs = scopes.filter((s) => s.scope_type === "county").map((s) => s.scope_key);
  const city_slugs = scopes.filter((s) => s.scope_type === "city").map((s) => s.scope_key);
  return buildCanonicalEvent({
    event_id: String(row.event_id),
    event_slug: String(row.event_slug),
    title: String(row.title),
    description: String(row.full_description ?? row.short_description ?? ""),
    short_description: String(row.short_description ?? ""),
    event_type: row.event_type as CalendarEvent["event_type"],
    operational_status: row.operational_status as CalendarEvent["operational_status"],
    approval_status: row.approval_status as CalendarEvent["approval_status"],
    publication_status: row.publication_status as CalendarEvent["publication_status"],
    start_at: new Date(String(row.start_at)).toISOString(),
    end_at: new Date(String(row.end_at)).toISOString(),
    location_name: row.location_name ? String(row.location_name) : null,
    city: row.city ? String(row.city) : null,
    county: row.county ? String(row.county) : null,
    county_slug: county_slugs[0] ?? null,
    college_slugs,
    county_slugs,
    city_slugs,
    campaign_wide: scopes.some((s) => s.scope_type === "campaign"),
    visibility: (row.visibility as CalendarEvent["visibility"]) ?? "team",
    public_summary: row.public_summary ? String(row.public_summary) : null,
    internal_notes: row.internal_notes ? String(row.internal_notes) : null,
    owned_by_team: row.owned_by_team_id ? String(row.owned_by_team_id) : null,
  });
}

export function createPostgresCalendarRepository(): CalendarRepository {
  return {
    async getEventById(eventId) {
      return withCalendarClient(async (client) => {
        const ev = await client.query(`SELECT * FROM calendar_events WHERE event_id = $1`, [eventId]);
        if (!ev.rows[0]) return null;
        const scopes = await client.query(
          `SELECT scope_type, scope_key FROM calendar_event_scopes WHERE event_id = $1`,
          [eventId],
        );
        return rowToEvent(
          ev.rows[0],
          scopes.rows.map((r) => ({ scope_type: String(r.scope_type), scope_key: String(r.scope_key) })),
        );
      });
    },

    async listEvents() {
      return withCalendarClient(async (client) => {
        const ev = await client.query(`SELECT * FROM calendar_events ORDER BY start_at`);
        const allScopes = await client.query(`SELECT event_id, scope_type, scope_key FROM calendar_event_scopes`);
        const byEvent = new Map<string, { scope_type: string; scope_key: string }[]>();
        for (const s of allScopes.rows) {
          const id = String(s.event_id);
          const list = byEvent.get(id) ?? [];
          list.push({ scope_type: String(s.scope_type), scope_key: String(s.scope_key) });
          byEvent.set(id, list);
        }
        return ev.rows.map((r) => rowToEvent(r, byEvent.get(String(r.event_id)) ?? []));
      });
    },

    async listEventIds() {
      return withCalendarClient(async (client) => {
        const r = await client.query(`SELECT event_id FROM calendar_events ORDER BY event_id`);
        return r.rows.map((row) => String(row.event_id));
      });
    },

    async countScopes() {
      return withCalendarClient(async (client) => {
        const r = await client.query(`SELECT count(*)::int AS c FROM calendar_event_scopes`);
        return Number(r.rows[0]?.c ?? 0);
      });
    },

    async importSeedEvent(event, opts) {
      const cfg = getCalendarPersistenceConfig();
      if (!cfg.writeEnabled) return "skipped";

      return withCalendarClient(async (client) => {
        const existing = await client.query(
          `SELECT event_id, durable_edit FROM calendar_events WHERE event_id = $1`,
          [event.event_id],
        );
        if (existing.rows[0]) {
          if (existing.rows[0].durable_edit === true) return "conflict";
          // Idempotent: refresh scopes if import-owned
          const parts = eventToDurableParts(event);
          for (const s of parts.scopes) {
            await client.query(
              `INSERT INTO calendar_event_scopes (event_id, scope_type, scope_key, is_primary)
               VALUES ($1,$2,$3,$4)
               ON CONFLICT (event_id, scope_type, scope_key) DO NOTHING`,
              [event.event_id, s.scope_type, s.scope_key, s.is_primary],
            );
          }
          await client.query(
            `INSERT INTO calendar_event_audit_log (event_id, action_type, actor_user_id, actor_role, entity_type, after_json)
             VALUES ($1,'seed_import',$2,'system','event',$3::jsonb)`,
            [event.event_id, opts?.actor ?? "seed-import", JSON.stringify({ status: "skipped_existing" })],
          );
          return "skipped";
        }

        const parts = eventToDurableParts(event);
        const r = parts.row;
        await client.query(
          `INSERT INTO calendar_events (
            event_id, event_slug, title, short_description, full_description, event_type,
            operational_status, approval_status, candidate_attendance_status, publication_status,
            start_at, end_at, timezone, all_day, location_type, location_name, street_address,
            city, county, state, postal_code, virtual_url, visibility, public_summary, internal_notes,
            owned_by_team_id, version, import_source, durable_edit
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,false
          )`,
          [
            r.event_id,
            r.event_slug,
            r.title,
            r.short_description,
            r.full_description,
            r.event_type,
            r.operational_status,
            r.approval_status,
            r.candidate_attendance_status,
            r.publication_status,
            r.start_at,
            r.end_at,
            r.timezone,
            r.all_day,
            r.location_type,
            r.location_name,
            r.street_address,
            r.city,
            r.county,
            r.state,
            r.postal_code,
            r.virtual_url,
            r.visibility,
            r.public_summary,
            r.internal_notes,
            r.owned_by_team_id,
            r.version,
            r.import_source,
          ],
        );

        for (const s of parts.scopes) {
          await client.query(
            `INSERT INTO calendar_event_scopes (event_id, scope_type, scope_key, is_primary)
             VALUES ($1,$2,$3,$4)
             ON CONFLICT (event_id, scope_type, scope_key) DO NOTHING`,
            [event.event_id, s.scope_type, s.scope_key, s.is_primary],
          );
        }

        if (parts.candidate) {
          const c = parts.candidate;
          await client.query(
            `INSERT INTO calendar_event_candidate_details (
              event_id, kelly_requested, attendance_status, requested_arrival_at, requested_departure_at,
              candidate_role, brief_required, brief_status, travel_required, private_travel_notes, private_security_notes
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            ON CONFLICT (event_id) DO NOTHING`,
            [
              event.event_id,
              c.kelly_requested,
              c.attendance_status,
              c.requested_arrival_at,
              c.requested_departure_at,
              c.candidate_role,
              c.brief_required,
              c.brief_status,
              c.travel_required,
              c.private_travel_notes,
              c.private_security_notes,
            ],
          );
        }

        for (const req of parts.requirements) {
          await client.query(
            `INSERT INTO calendar_event_volunteer_requirements (
              event_id, role_key, role_title, number_needed, number_confirmed, training_required
            ) VALUES ($1,$2,$3,$4,$5,$6)
            ON CONFLICT (event_id, role_key) DO NOTHING`,
            [event.event_id, req.role_key, req.role_title, req.number_needed, req.number_confirmed, req.training_required],
          );
        }

        await client.query(
          `INSERT INTO calendar_event_publication (
            event_id, public_enabled, public_title, public_summary, publish_status, ics_enabled
          ) VALUES ($1,$2,$3,$4,$5,$6)
          ON CONFLICT (event_id) DO NOTHING`,
          [
            event.event_id,
            parts.publication.public_enabled,
            parts.publication.public_title,
            parts.publication.public_summary,
            parts.publication.publish_status,
            parts.publication.ics_enabled,
          ],
        );

        await client.query(
          `INSERT INTO calendar_event_audit_log (event_id, action_type, actor_user_id, actor_role, entity_type, after_json)
           VALUES ($1,'seed_import',$2,'system','event',$3::jsonb)`,
          [event.event_id, opts?.actor ?? "seed-import", JSON.stringify({ status: "inserted" })],
        );

        return "inserted";
      });
    },

    async getAuditCount(eventId) {
      return withCalendarClient(async (client) => {
        if (eventId) {
          const r = await client.query(
            `SELECT count(*)::int AS c FROM calendar_event_audit_log WHERE event_id = $1`,
            [eventId],
          );
          return Number(r.rows[0]?.c ?? 0);
        }
        const r = await client.query(`SELECT count(*)::int AS c FROM calendar_event_audit_log`);
        return Number(r.rows[0]?.c ?? 0);
      });
    },

    async shadowCompare(seed) {
      const storeIds = await this.listEventIds();
      const seedIds = seed.map((e) => e.event_id);
      const matching = seedIds.filter((id) => storeIds.includes(id));
      const missing = seedIds.filter((id) => !storeIds.includes(id));
      const extra = storeIds.filter((id) => !seedIds.includes(id));
      const scope_mismatches: string[] = [];
      for (const id of matching) {
        const seedEv = seed.find((e) => e.event_id === id)!;
        const storeEv = await this.getEventById(id);
        if (!storeEv) continue;
        const seedColleges = [...seedEv.college_slugs].sort().join(",");
        const storeColleges = [...storeEv.college_slugs].sort().join(",");
        if (seedColleges !== storeColleges) scope_mismatches.push(id);
      }
      return {
        matching_ids: matching,
        missing_in_store: missing,
        extra_in_store: extra,
        scope_mismatches,
      };
    },
  };
}

/** Seed-facing repository used when Postgres is not primary. */
export function createSeedCalendarRepository(): CalendarRepository {
  return {
    async getEventById(eventId) {
      return SEED_EVENTS.find((e) => e.event_id === eventId) ?? null;
    },
    async listEvents() {
      return [...SEED_EVENTS];
    },
    async listEventIds() {
      return SEED_EVENTS.map((e) => e.event_id);
    },
    async countScopes() {
      return SEED_EVENTS.reduce((a, e) => a + e.college_slugs.length + e.county_slugs.length + e.city_slugs.length, 0);
    },
    async importSeedEvent() {
      return "skipped";
    },
    async getAuditCount() {
      return 0;
    },
    async shadowCompare(seed) {
      const ids = seed.map((e) => e.event_id);
      return {
        matching_ids: ids,
        missing_in_store: [],
        extra_in_store: [],
        scope_mismatches: [],
      };
    },
  };
}
