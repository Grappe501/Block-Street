import { getCalendarRbacRole } from "./roles";
import type { CalendarActor, CalendarAuthorityScope, CalendarPolicyResource } from "./types";

export function scopesForActor(actor: CalendarActor): CalendarAuthorityScope[] {
  const out: CalendarAuthorityScope[] = [];
  if (actor.campaignWide) out.push({ type: "campaign", key: "campaign" });
  if (actor.candidateScheduleAccess) out.push({ type: "candidate", key: "candidate" });
  for (const s of actor.collegeSlugs) out.push({ type: "college", key: s });
  for (const s of actor.countySlugs) out.push({ type: "county", key: s });
  for (const s of actor.citySlugs) out.push({ type: "city", key: s });
  for (const s of actor.teamIds) out.push({ type: "team", key: s });
  for (const s of actor.positionIds) out.push({ type: "position", key: s });
  if (!actor.authenticated) out.push({ type: "public", key: "public" });
  return out;
}

export function scopeAllowsActor(
  actor: CalendarActor,
  resource: CalendarPolicyResource,
  roleKey: string,
): { ok: boolean; matched: CalendarAuthorityScope[] } {
  const role = getCalendarRbacRole(roleKey);
  if (!role) return { ok: false, matched: [] };

  const geo = role.geographic_restriction;
  const matched = scopesForActor(actor);

  if (geo === "statewide" || geo === "campaign_approved_scopes") {
    return { ok: true, matched };
  }
  if (geo === "public_only") {
    return { ok: true, matched: [{ type: "public", key: "public" }] };
  }
  if (geo === "relevant_public_and_assigned" || geo === "assigned_shift" || geo === "event_only") {
    return { ok: true, matched };
  }

  if (geo === "assigned_college_only") {
    const needed = resource.collegeSlugs ?? [];
    if (needed.length === 0) return { ok: false, matched: [] };
    const ok = needed.every((slug) => actor.collegeSlugs.includes(slug));
    return {
      ok,
      matched: ok ? needed.map((key) => ({ type: "college" as const, key })) : [],
    };
  }

  if (geo === "assigned_county_only") {
    const needed = resource.countySlugs ?? [];
    if (needed.length === 0) return { ok: false, matched: [] };
    const ok = needed.every((slug) => actor.countySlugs.includes(slug));
    return {
      ok,
      matched: ok ? needed.map((key) => ({ type: "county" as const, key })) : [],
    };
  }

  if (geo === "assigned_city_only") {
    const needed = resource.citySlugs ?? [];
    if (needed.length === 0) return { ok: false, matched: [] };
    const ok = needed.every((slug) => actor.citySlugs.includes(slug));
    return {
      ok,
      matched: ok ? needed.map((key) => ({ type: "city" as const, key })) : [],
    };
  }

  if (geo === "assigned_team_scope") {
    const needed = resource.teamIds ?? [];
    if (needed.length === 0) return { ok: true, matched };
    const ok = needed.every((id) => actor.teamIds.includes(id));
    return {
      ok,
      matched: ok ? needed.map((key) => ({ type: "team" as const, key })) : [],
    };
  }

  return { ok: false, matched: [] };
}

export function assertCalendarScope(
  actor: CalendarActor,
  resource: CalendarPolicyResource,
  roleKey: string,
): boolean {
  return scopeAllowsActor(actor, resource, roleKey).ok;
}
