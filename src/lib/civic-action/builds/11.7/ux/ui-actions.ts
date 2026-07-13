/**
 * CAE-11.7-W4 — Governed communication UI actions (display only)
 */
import type { ConversationRecord, DecisionRecord, DocumentRecord, MeetingRecord } from "../data-model";
import { COMMUNICATION_PERMISSIONS } from "../services/commands";
import type { CommunicationCommandType } from "../services/commands";
import {
  isConversationTransitionAllowed,
  isDecisionTransitionAllowed,
  isDocumentTransitionAllowed,
  isMeetingTransitionAllowed,
} from "../state-machines";
import type { CommunicationExperienceContext } from "./experience-context";
import type { CommunicationUiAction } from "./view-models";

const CONVERSATION_ACTIONS: Partial<
  Record<string, { command: CommunicationCommandType; label: string; description: string; target: string }[]>
> = {
  draft: [
    {
      command: "PostMessage",
      label: "Open with First Message",
      description: "Post the opening message to activate this conversation.",
      target: "open",
    },
  ],
  open: [
    {
      command: "PostMessage",
      label: "Continue Conversation",
      description: "Add a message to keep the thread moving.",
      target: "active",
    },
    {
      command: "ArchiveConversation",
      label: "Archive Conversation",
      description: "Make this conversation read-only when work is complete.",
      target: "archived",
    },
  ],
  active: [
    {
      command: "RecordDecision",
      label: "Record Decision",
      description: "Capture an institutional decision from this conversation.",
      target: "approved",
    },
    {
      command: "ArchiveConversation",
      label: "Archive Conversation",
      description: "Preserve this conversation as institutional memory.",
      target: "archived",
    },
  ],
  resolved: [
    {
      command: "ArchiveConversation",
      label: "Archive Conversation",
      description: "Archive after outcomes are recorded.",
      target: "archived",
    },
  ],
};

function hasPermission(command: CommunicationCommandType, permissions: string[]): boolean {
  const key = COMMUNICATION_PERMISSIONS[command];
  return permissions.includes(key) || permissions.includes("civic_action.manage");
}

function toUiAction(
  def: { command: CommunicationCommandType; label: string; description: string; target: string },
  allowed: boolean,
  permitted: boolean,
  ctx: CommunicationExperienceContext
): CommunicationUiAction {
  return {
    action_key: def.command,
    label: def.label,
    description: def.description,
    available: allowed && permitted,
    blocked_reason_optional: !allowed
      ? "Lifecycle step not available"
      : !permitted
        ? "You do not have authority"
        : undefined,
    requires_confirmation: def.command === "ArchiveConversation",
    endpoint_or_command: "/api/v1/civic-action/communications/commands",
    permission_key: COMMUNICATION_PERMISSIONS[def.command],
  };
}

export function resolveCommunicationActions(
  conversation: ConversationRecord,
  ctx: CommunicationExperienceContext
): CommunicationUiAction[] {
  const defs = CONVERSATION_ACTIONS[conversation.lifecycle_state] ?? [];
  return defs.map((def) => {
    const allowed = isConversationTransitionAllowed(
      conversation.lifecycle_state,
      def.target as ConversationRecord["lifecycle_state"]
    );
    const permitted = hasPermission(def.command, ctx.permissions);
    return toUiAction(def, allowed, permitted, ctx);
  });
}

export function resolveMeetingActions(
  meeting: MeetingRecord,
  ctx: CommunicationExperienceContext
): CommunicationUiAction[] {
  const defs: { command: CommunicationCommandType; label: string; description: string; target: string }[] = [];
  if (meeting.lifecycle_state === "draft") {
    defs.push({
      command: "CreateMeeting",
      label: "Schedule Meeting",
      description: "Move this meeting to scheduled status.",
      target: "scheduled",
    });
  }
  if (meeting.lifecycle_state === "scheduled") {
    defs.push({
      command: "CreateMeeting",
      label: "Start Meeting",
      description: "Mark meeting as in progress.",
      target: "in_progress",
    });
  }
  return defs.map((def) => {
    const allowed = isMeetingTransitionAllowed(
      meeting.lifecycle_state,
      def.target as MeetingRecord["lifecycle_state"]
    );
    const permitted = hasPermission(def.command, ctx.permissions);
    return toUiAction(def, allowed, permitted, ctx);
  });
}

export function resolveDecisionActions(
  decision: DecisionRecord,
  ctx: CommunicationExperienceContext
): CommunicationUiAction[] {
  const defs: { command: CommunicationCommandType; label: string; description: string; target: string }[] = [];
  if (decision.lifecycle_state === "draft") {
    defs.push({
      command: "RecordDecision",
      label: "Propose Decision",
      description: "Send this decision for review.",
      target: "proposed",
    });
  }
  if (decision.lifecycle_state === "proposed") {
    defs.push({
      command: "RecordDecision",
      label: "Approve Decision",
      description: "Approve this institutional decision.",
      target: "approved",
    });
  }
  return defs.map((def) => {
    const allowed = isDecisionTransitionAllowed(
      decision.lifecycle_state,
      def.target as DecisionRecord["lifecycle_state"]
    );
    const permitted = hasPermission(def.command, ctx.permissions);
    return toUiAction(def, allowed, permitted, ctx);
  });
}

export function resolveDocumentActions(
  document: DocumentRecord,
  ctx: CommunicationExperienceContext
): CommunicationUiAction[] {
  const defs: { command: CommunicationCommandType; label: string; description: string; target: string }[] = [];
  if (document.lifecycle_state === "draft") {
    defs.push({
      command: "CreateDocument",
      label: "Send for Review",
      description: "Move document into collaborative review.",
      target: "review",
    });
  }
  if (document.lifecycle_state === "review") {
    defs.push({
      command: "CreateDocument",
      label: "Publish Document",
      description: "Publish the reviewed document.",
      target: "published",
    });
  }
  return defs.map((def) => {
    const allowed = isDocumentTransitionAllowed(
      document.lifecycle_state,
      def.target as DocumentRecord["lifecycle_state"]
    );
    const permitted = hasPermission(def.command, ctx.permissions);
    return toUiAction(def, allowed, permitted, ctx);
  });
}
