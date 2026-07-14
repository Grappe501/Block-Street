import Link from "next/link";
import type { CalendarEvent } from "@/lib/calendar";
import { publicKellyLabel } from "@/lib/calendar";
import { EventSubnav } from "./CalendarNav";

function formatRange(start: string, end: string) {
  const s = new Date(start).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const e = new Date(end).toLocaleString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${s} – ${e}`;
}

export function EventDetailView({
  event,
  mode = "participant",
}: {
  event: CalendarEvent;
  mode?: "participant" | "internal";
}) {
  const kellyPublic = publicKellyLabel(event);
  const openRoles = event.volunteer_roles.filter((r) => r.number_confirmed < r.number_needed);

  return (
    <div className="space-y-6">
      <EventSubnav eventId={event.event_id} />
      <div className="rounded-xl bg-field-dusk p-5 text-field-mist">
        <p className="font-fieldSans text-xs font-semibold uppercase tracking-[0.14em] text-field-wheat">
          {event.event_type.replace(/_/g, " ")}
        </p>
        <h2 className="mt-1 font-fieldDisplay text-2xl text-white">{event.title}</h2>
        <p className="mt-2 font-fieldSans text-sm text-field-mist/90">{formatRange(event.start_at, event.end_at)}</p>
        {event.location_name ? (
          <p className="mt-1 font-fieldSans text-sm text-field-mist/80">{event.location_name}</p>
        ) : null}
      </div>

      <section className="rounded-xl border border-field-ink/15 bg-white p-4">
        <h3 className="font-fieldDisplay text-lg text-field-ink">The five questions</h3>
        <dl className="mt-3 space-y-2 font-fieldSans text-sm text-field-ink/85">
          <div>
            <dt className="font-semibold text-field-ink">What is happening?</dt>
            <dd>{event.short_description || event.description}</dd>
          </div>
          <div>
            <dt className="font-semibold text-field-ink">Where and when?</dt>
            <dd>
              {formatRange(event.start_at, event.end_at)}
              {event.location_name ? ` · ${event.location_name}` : ""}
              {event.city ? ` · ${event.city}` : ""}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-field-ink">Who owns and approves?</dt>
            <dd>
              Owner: {event.owned_by_team ?? "Open / soft beta"} · Approval: {event.approval_status} · Event
              Board: {event.volunteer_manager ?? "Carol Eagan"}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-field-ink">Is Kelly attending?</dt>
            <dd>{kellyPublic ?? "Not requested / not for public announcement"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-field-ink">Volunteers needed?</dt>
            <dd>
              {event.volunteers_needed
                ? `${event.volunteers_confirmed}/${event.volunteers_needed} confirmed · ${openRoles.length} roles still open · staffing ${event.staffing_status.replace(/_/g, " ")}`
                : "Staffing not required"}
            </dd>
          </div>
        </dl>
      </section>

      <p className="font-fieldSans text-sm leading-relaxed text-field-ink/85">{event.description}</p>

      {openRoles.length > 0 ? (
        <section>
          <h3 className="font-fieldDisplay text-lg text-field-ink">Open volunteer roles</h3>
          <ul className="mt-2 space-y-2">
            {openRoles.map((r) => (
              <li key={r.role_id} className="rounded-lg border border-field-ink/15 bg-white px-3 py-2 font-fieldSans text-sm">
                <span className="font-semibold text-field-ink">{r.title}</span>
                <span className="text-field-ink/70">
                  {" "}
                  — {r.number_confirmed}/{r.number_needed}
                  {r.training_required ? " · training required" : ""}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 font-fieldSans text-xs text-field-ink/65">
            Signing up records interest or availability. Final assignment may require confirmation from the event team.
          </p>
          <Link
            href={`/calendar/event/${event.event_id}/volunteer`}
            className="mt-3 inline-block font-fieldSans text-sm font-semibold text-field-pine underline"
          >
            Express interest in a role →
          </Link>
        </section>
      ) : null}

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-field-ink/15 bg-white px-3 py-2">
          <dt className="font-fieldSans text-xs font-semibold uppercase text-field-ink/55">Operational</dt>
          <dd className="font-fieldSans text-sm font-semibold text-field-ink">{event.operational_status}</dd>
        </div>
        <div className="rounded-lg border border-field-ink/15 bg-white px-3 py-2">
          <dt className="font-fieldSans text-xs font-semibold uppercase text-field-ink/55">Publication</dt>
          <dd className="font-fieldSans text-sm font-semibold text-field-ink">{event.publication_status}</dd>
        </div>
        {event.college_slug ? (
          <div className="rounded-lg border border-field-ink/15 bg-white px-3 py-2">
            <dt className="font-fieldSans text-xs font-semibold uppercase text-field-ink/55">College</dt>
            <dd>
              <Link
                href={`/college/${event.college_slug}/calendar`}
                className="font-fieldSans text-sm font-semibold text-field-pine underline"
              >
                {event.college_slug}
              </Link>
            </dd>
          </div>
        ) : null}
        {event.county_slug ? (
          <div className="rounded-lg border border-field-ink/15 bg-white px-3 py-2">
            <dt className="font-fieldSans text-xs font-semibold uppercase text-field-ink/55">County</dt>
            <dd>
              <Link
                href={`/county/${event.county_slug}/calendar`}
                className="font-fieldSans text-sm font-semibold text-field-pine underline"
              >
                {event.county_slug}
              </Link>
            </dd>
          </div>
        ) : null}
      </dl>

      {mode === "internal" ? (
        <section className="rounded-xl border border-amber-300/50 bg-amber-50 p-4">
          <h3 className="font-fieldSans text-sm font-bold text-field-ink">Internal only</h3>
          <p className="mt-2 font-fieldSans text-sm text-field-ink/80">
            Approval stage: {event.approval_stage ?? "—"} · Conflict: {event.conflict_state}
          </p>
          {event.security_or_private_notes ? (
            <p className="mt-2 font-fieldSans text-sm text-field-ink">
              Private notes (never public): {event.security_or_private_notes}
            </p>
          ) : null}
          {event.kelly_arrival_time ? (
            <p className="mt-2 font-fieldSans text-xs text-field-ink/70">
              Internal Kelly window: {event.kelly_arrival_time} → {event.kelly_departure_time}
            </p>
          ) : null}
        </section>
      ) : null}

      <p className="font-fieldSans text-xs text-field-ink/60">
        Soft beta: calendar approval ≠ venue/legal approval · interest ≠ assignment · Kelly request ≠ confirmation · no
        production RBAC · no automatic external calendar writes
      </p>
    </div>
  );
}
