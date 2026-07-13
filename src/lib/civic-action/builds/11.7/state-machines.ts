/**
 * CAE-11.7-W3 — Communication lifecycle state machines
 */
import type {
  CanonicalConversationStatus,
  CanonicalDecisionStatus,
  CanonicalDocumentStatus,
  CanonicalMeetingStatus,
} from "./data-model";

export const CONVERSATION_TRANSITIONS: Record<CanonicalConversationStatus, CanonicalConversationStatus[]> = {
  draft: ["open"],
  open: ["active", "archived"],
  active: ["resolved", "archived"],
  resolved: ["active", "archived"],
  archived: [],
};

export const DECISION_TRANSITIONS: Record<CanonicalDecisionStatus, CanonicalDecisionStatus[]> = {
  draft: ["proposed", "historical"],
  proposed: ["approved", "draft"],
  approved: ["historical"],
  historical: [],
};

export const DOCUMENT_TRANSITIONS: Record<CanonicalDocumentStatus, CanonicalDocumentStatus[]> = {
  draft: ["review", "archived"],
  review: ["published", "draft"],
  published: ["archived"],
  archived: [],
};

export const MEETING_TRANSITIONS: Record<CanonicalMeetingStatus, CanonicalMeetingStatus[]> = {
  draft: ["scheduled", "cancelled", "archived"],
  scheduled: ["in_progress", "cancelled", "archived"],
  in_progress: ["completed", "cancelled"],
  completed: ["archived"],
  cancelled: ["archived"],
  archived: [],
};

export function isConversationTransitionAllowed(
  from: CanonicalConversationStatus,
  to: CanonicalConversationStatus
): boolean {
  if (from === to) return true;
  return CONVERSATION_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isDecisionTransitionAllowed(from: CanonicalDecisionStatus, to: CanonicalDecisionStatus): boolean {
  if (from === to) return true;
  return DECISION_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isDocumentTransitionAllowed(from: CanonicalDocumentStatus, to: CanonicalDocumentStatus): boolean {
  if (from === to) return true;
  return DOCUMENT_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isMeetingTransitionAllowed(from: CanonicalMeetingStatus, to: CanonicalMeetingStatus): boolean {
  if (from === to) return true;
  return MEETING_TRANSITIONS[from]?.includes(to) ?? false;
}
