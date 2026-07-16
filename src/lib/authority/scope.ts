import geographicClusters from "../../../data/volunteer-command/geographic-clusters.json";
import type { LeadershipAppointment, ScopeKind } from "./types";
import { parseScopeToken, scopeToken } from "./types";

/** Counties contained in a cluster key. */
export function countiesInCluster(clusterKey: string): string[] {
  const row = geographicClusters.clusters.find((c) => c.cluster_key === clusterKey);
  return row?.county_slugs ?? [];
}

/** Expand an appointment scope into comparable scope tokens. */
export function expandAppointmentScopes(appt: LeadershipAppointment): string[] {
  const base = scopeToken(appt.scope_kind, appt.scope_id);
  const tokens = new Set<string>([base]);

  if (appt.scope_kind === "campaign") {
    tokens.add(scopeToken("campaign", appt.scope_id));
  }

  if (appt.scope_kind === "cluster") {
    for (const county of countiesInCluster(appt.scope_id)) {
      tokens.add(scopeToken("county", county));
    }
  }

  if (appt.functional_lane) {
    tokens.add(scopeToken("functional_lane", appt.functional_lane));
  }

  return [...tokens];
}

/** Whether appointment scope covers a requested scope token. */
export function appointmentCoversRequested(appt: LeadershipAppointment, requested: string): boolean {
  const parsed = parseScopeToken(requested);
  if (!parsed) return false;

  if (appt.scope_kind === "campaign" && appt.scope_id === "arkansas") {
    return parsed.kind !== "campaign" || parsed.id === appt.scope_id;
  }

  const expanded = expandAppointmentScopes(appt);

  if (expanded.includes(requested)) return true;

  if (appt.scope_kind === "county" && parsed.kind === "institution") {
    const county = institutionCounty(parsed.id);
    return county === appt.scope_id;
  }

  if (appt.scope_kind === "institution" && parsed.kind === "institution") {
    return appt.scope_id === parsed.id;
  }

  if (appt.scope_kind === "institution" && parsed.kind === "county") {
    return institutionCounty(appt.scope_id) === parsed.id;
  }

  if (appt.scope_kind === "county" && parsed.kind === "county") {
    return appt.scope_id === parsed.id;
  }

  if (appt.scope_kind === "committee" && parsed.kind === "committee") {
    return appt.scope_id === parsed.id;
  }

  if (appt.scope_kind === "cluster" && parsed.kind === "county") {
    return countiesInCluster(appt.scope_id).includes(parsed.id);
  }

  if (parsed.kind === "self" && parsed.id === appt.user_id) {
    return appt.scope_kind === "committee" || appt.role_key === "volunteer";
  }

  return false;
}

export function institutionCounty(institutionId: string): string | null {
  const map: Record<string, string> = {
    "henderson-state": "clark",
  };
  return map[institutionId] ?? null;
}

export function scopeKindRank(kind: ScopeKind): number {
  const order: ScopeKind[] = ["campaign", "functional_lane", "cluster", "county", "institution", "committee", "team", "self"];
  return order.indexOf(kind);
}
