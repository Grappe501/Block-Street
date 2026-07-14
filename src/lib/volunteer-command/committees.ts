/**
 * Committee = all active leads + volunteers on the same position and scope.
 */
import { loadPositionStore } from "../position-participation/store";
import type { PositionMembership } from "../position-participation/types";

export type CommitteeView = {
  committee_id: string;
  position_key: string;
  scope_type: string;
  scope_id: string;
  name: string;
  status: "forming" | "active" | "empty";
  lead_count: number;
  volunteer_count: number;
  member_count: number;
  leads: Array<{ person_id: string; display_name: string }>;
  volunteers: Array<{ person_id: string; display_name: string }>;
  field_plan_position_key: string;
  field_plan_content_status: "placeholder";
  persistence: "derived_from_position_memberships";
};

export function committeeId(scopeId: string, positionId: string): string {
  return `committee:${scopeId}::${positionId}`;
}

export function buildCommitteeFromMemberships(input: {
  scopeId: string;
  positionId: string;
  positionTitle: string;
  memberships: PositionMembership[];
}): CommitteeView {
  const active = input.memberships.filter((m) => m.status === "active");
  const leads = active.filter((m) => m.participation_type === "lead");
  const volunteers = active.filter((m) => m.participation_type === "volunteer");
  const status =
    active.length === 0 ? "empty" : leads.length > 0 && volunteers.length > 0 ? "active" : "forming";

  return {
    committee_id: committeeId(input.scopeId, input.positionId),
    position_key: input.positionId,
    scope_type: active[0]?.scope_type ?? "community",
    scope_id: input.scopeId,
    name: `${input.positionTitle} Committee`,
    status,
    lead_count: leads.length,
    volunteer_count: volunteers.length,
    member_count: new Set(active.map((m) => m.canonical_person_id)).size,
    leads: leads.map((m) => ({
      person_id: m.canonical_person_id,
      display_name: m.display_name || "Lead",
    })),
    volunteers: volunteers.map((m) => ({
      person_id: m.canonical_person_id,
      display_name: m.display_name || "Volunteer",
    })),
    field_plan_position_key: input.positionId,
    field_plan_content_status: "placeholder",
    persistence: "derived_from_position_memberships",
  };
}

export function listCommitteesForScope(scopeId: string): CommitteeView[] {
  const store = loadPositionStore();
  const byPosition = new Map<string, PositionMembership[]>();
  for (const m of store.memberships) {
    if (m.scope_id !== scopeId || m.status !== "active") continue;
    const list = byPosition.get(m.position_id) ?? [];
    list.push(m);
    byPosition.set(m.position_id, list);
  }
  return [...byPosition.entries()].map(([positionId, memberships]) =>
    buildCommitteeFromMemberships({
      scopeId,
      positionId,
      positionTitle: positionId.split("::").pop() || positionId,
      memberships,
    }),
  );
}
