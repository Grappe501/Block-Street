import fixtures from "../../../../data/calendar/calendar-rbac-test-fixtures.json";
import { evaluatePolicy } from "./evaluate";
import type { CalendarActor, CalendarPolicyContext, CalendarPolicyDecision, CalendarPolicyResource } from "./types";
import { defaultPolicyContext } from "./types";

const PUBLIC_FIELDS = new Set(fixtures.public_fields as string[]);
const CANDIDATE_PRIVATE = new Set(fixtures.candidate_private_fields as string[]);

export function filterCalendarEventForActor(
  event: Record<string, unknown>,
  actor: CalendarActor,
  options: { isPublicProjection?: boolean } = {},
): Record<string, unknown> {
  const decision = evaluatePolicy({
    actor,
    permission: options.isPublicProjection
      ? "calendar.event.view_public"
      : "calendar.event.view_internal",
    resource: {
      eventId: String(event.event_id ?? event.id ?? ""),
      visibility: String(event.visibility ?? "public"),
      publicationStatus: String(event.publication_status ?? event.publicationStatus ?? ""),
      containsCandidatePrivateData: true,
    },
    context: defaultPolicyContext({
      isPublicProjection: Boolean(options.isPublicProjection),
    }),
  });

  const privateDecision = evaluatePolicy({
    actor,
    permission: "calendar.event.view_candidate_private",
    resource: { containsCandidatePrivateData: true },
    context: defaultPolicyContext(),
  });

  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(event)) {
    if (CANDIDATE_PRIVATE.has(k) && !privateDecision.allowed) continue;
    if (options.isPublicProjection && !PUBLIC_FIELDS.has(k) && CANDIDATE_PRIVATE.has(k)) continue;
    if (options.isPublicProjection && CANDIDATE_PRIVATE.has(k)) continue;
    if (!decision.allowed && !PUBLIC_FIELDS.has(k)) continue;
    if (options.isPublicProjection && !PUBLIC_FIELDS.has(k)) continue;
    out[k] = v;
  }
  return out;
}

export function projectPublicCalendarEvent(event: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(event)) {
    if (CANDIDATE_PRIVATE.has(k)) continue;
    if (!PUBLIC_FIELDS.has(k)) continue;
    out[k] = v;
  }
  return out;
}

export { PUBLIC_FIELDS, CANDIDATE_PRIVATE };
