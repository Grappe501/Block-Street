import type { FunctionalRoleId } from "@/lib/community-workspace/types";
import type { PositionDefinition, PositionFieldPlanContent } from "./types";
import { FIELD_PLAN_PLACEHOLDER } from "./labels";
import fieldPlanSeed from "../../../data/field-plan/position-content.json";

const PURPOSES: Record<FunctionalRoleId, string> = {
  community_lead: "Coordinates the overall local chapter and keeps the organizing spine moving.",
  social_lead: "Builds in-person belonging through regular social meetups and invitations.",
  event_lead: "Plans and runs campus or county events that grow the network.",
  registration_lead: "Helps eligible people register and stay registration-ready—nonpartisan civic work.",
  canvass_lead: "Organizes door and path outreach so conversations reach neighbors.",
  phone_bank_lead: "Coordinates phone or text outreach shifts for the local team.",
  postcard_lead: "Runs handwritten outreach that reminds people they matter to this community.",
};

export function positionIdForRole(scopeId: string, role: FunctionalRoleId): string {
  return `${scopeId}::${role}`;
}

export function positionsForScope(
  scopeId: string,
  roles: Array<{ id: FunctionalRoleId; label: string }>
): PositionDefinition[] {
  return roles.map((r) => ({
    id: positionIdForRole(scopeId, r.id),
    title: r.label,
    purpose: PURPOSES[r.id] ?? "Help build this local team.",
    roleKey: r.id,
  }));
}

export function fieldPlanForPosition(positionId: string, purpose: string): PositionFieldPlanContent {
  const fromSeed = (fieldPlanSeed.positions as Record<string, Partial<PositionFieldPlanContent> | undefined>)[
    positionId
  ];
  const status = fromSeed?.content_status ?? "placeholder";
  const placeholder = FIELD_PLAN_PLACEHOLDER;
  if (status === "placeholder" || !fromSeed) {
    return {
      position_id: positionId,
      summary: purpose,
      purpose,
      before_event: placeholder,
      event_day: placeholder,
      after_event: placeholder,
      canvassing: placeholder,
      gotv: placeholder,
      time_commitment: placeholder,
      helpful_skills: placeholder,
      central_counterpart: placeholder,
      local_needs: placeholder,
      source_reference: "Pending Field Plan upload",
      content_status: "placeholder",
    };
  }
  return {
    position_id: positionId,
    summary: fromSeed.summary ?? purpose,
    purpose: fromSeed.purpose ?? purpose,
    before_event: fromSeed.before_event ?? placeholder,
    event_day: fromSeed.event_day ?? placeholder,
    after_event: fromSeed.after_event ?? placeholder,
    canvassing: fromSeed.canvassing ?? placeholder,
    gotv: fromSeed.gotv ?? placeholder,
    time_commitment: fromSeed.time_commitment ?? placeholder,
    helpful_skills: fromSeed.helpful_skills ?? placeholder,
    central_counterpart: fromSeed.central_counterpart ?? placeholder,
    local_needs: fromSeed.local_needs ?? placeholder,
    source_reference: fromSeed.source_reference ?? "Field Plan",
    content_status: fromSeed.content_status ?? "draft",
  };
}
