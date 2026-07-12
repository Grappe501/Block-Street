/**
 * CAE-11.1-W4 — Human-readable lifecycle labels
 */
import type { CanonicalInitiativeStatus } from "../data-model";

const INTERNAL: Record<CanonicalInitiativeStatus, string> = {
  concept: "Concept",
  discovery: "Discovery",
  design: "Design",
  approval_pending: "Awaiting Approval",
  approved: "Approved",
  preparation: "Preparation",
  active: "Active",
  paused: "Paused",
  at_risk: "At Risk",
  closing: "Closing",
  completed: "Completed",
  cancelled: "Cancelled",
  archived: "Archived",
  owner_required: "Owner Required",
};

const PUBLIC: Partial<Record<CanonicalInitiativeStatus, string>> = {
  preparation: "Preparing to Launch",
  active: "Underway",
  paused: "Temporarily Paused",
  closing: "Wrapping Up",
  completed: "Completed",
};

export function lifecycleLabel(status: CanonicalInitiativeStatus, publicFacing = false): string {
  if (publicFacing && PUBLIC[status]) return PUBLIC[status]!;
  return INTERNAL[status] ?? status;
}

export function typeLabel(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
