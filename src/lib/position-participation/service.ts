import { randomUUID } from "crypto";
import { deriveTeamDisplayLabel } from "./labels";
import { fieldPlanForPosition, positionIdForRole, positionsForScope } from "./field-plan";
import { computeHonestMetrics } from "./metrics";
import {
  loadPositionStore,
  resolveCanonicalPersonId,
  savePositionStore,
} from "./store";
import type {
  ParticipationType,
  PositionCardView,
  PositionMembership,
  ScopeType,
} from "./types";
import type { FunctionalRoleId } from "@/lib/community-workspace/types";
import { FUNCTIONAL_ROLES, roleLabel, toCommunityId } from "@/lib/community-workspace/roles";

function communityKindToScopeType(kind: string): ScopeType {
  if (kind === "county") return "county";
  if (kind === "institution" || kind === "high_school" || kind === "private_charter") return "college";
  return "community";
}

export function upsertMembership(input: {
  scope_type: ScopeType;
  scope_id: string;
  position_id: string;
  person_id: string;
  participation_type: ParticipationType;
  display_name?: string;
  public_visibility?: boolean;
}): PositionMembership {
  const store = loadPositionStore();
  const canonical = resolveCanonicalPersonId(input.person_id, store);
  const now = new Date().toISOString();

  const existingIdx = store.memberships.findIndex(
    (m) =>
      m.position_id === input.position_id &&
      m.canonical_person_id === canonical &&
      m.status === "active"
  );

  if (existingIdx >= 0) {
    const updated: PositionMembership = {
      ...store.memberships[existingIdx],
      participation_type: input.participation_type,
      person_id: input.person_id,
      display_name: input.display_name ?? store.memberships[existingIdx].display_name,
      public_visibility: input.public_visibility ?? store.memberships[existingIdx].public_visibility,
    };
    store.memberships[existingIdx] = updated;
    savePositionStore(store);
    return updated;
  }

  const row: PositionMembership = {
    id: `pm-${randomUUID()}`,
    position_id: input.position_id,
    person_id: input.person_id,
    canonical_person_id: canonical,
    scope_type: input.scope_type,
    scope_id: input.scope_id,
    participation_type: input.participation_type,
    status: "active",
    joined_at: now,
    approved_at: now,
    public_visibility: input.public_visibility ?? true,
    display_name: input.display_name,
  };
  store.memberships.push(row);
  savePositionStore(store);
  return row;
}

export function listPositionCards(input: {
  kind: "county" | "institution" | "high_school" | "private_charter";
  slug: string;
}): PositionCardView[] {
  const scope_id = toCommunityId(input.kind, input.slug);
  const scope_type = communityKindToScopeType(input.kind);
  const roleKind = input.kind === "county" ? "county" : "institution";
  const store = loadPositionStore();

  const defs = positionsForScope(
    scope_id,
    FUNCTIONAL_ROLES.map((r) => ({ id: r.id as FunctionalRoleId, label: roleLabel(r.id as FunctionalRoleId, roleKind) }))
  );

  return defs.map((position) => {
    const memberships = store.memberships.filter(
      (m) => m.position_id === position.id && m.status === "active" && m.public_visibility
    );
    const leads = memberships
      .filter((m) => m.participation_type === "lead")
      .map((m) => ({
        person_id: m.person_id,
        canonical_person_id: m.canonical_person_id,
        display_name: m.display_name ?? "Team lead",
      }));
    const volunteers = memberships
      .filter((m) => m.participation_type === "volunteer")
      .map((m) => ({
        person_id: m.person_id,
        canonical_person_id: m.canonical_person_id,
        display_name: m.display_name ?? "Volunteer",
      }));
    const lead_count = leads.length;
    const volunteer_count = volunteers.length;
    return {
      position,
      scope_type,
      scope_id,
      memberships,
      lead_count,
      volunteer_count,
      display_label: deriveTeamDisplayLabel(lead_count, volunteer_count),
      leads,
      volunteers,
      field_plan: fieldPlanForPosition(position.id, position.purpose),
    };
  });
}

export function getScopeMetrics(input: {
  kind: "county" | "institution" | "high_school" | "private_charter";
  slug: string;
  enrollment?: number | null;
}) {
  return computeHonestMetrics({
    scopeId: toCommunityId(input.kind, input.slug),
    scopeType: communityKindToScopeType(input.kind),
    kind: input.kind,
    enrollment: input.enrollment,
  });
}

export function positionId(scopeId: string, role: FunctionalRoleId) {
  return positionIdForRole(scopeId, role);
}
