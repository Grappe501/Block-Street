/**
 * CAE-11.7-W3 — Communication validation pipeline
 */
import { loadInitiativeAggregate } from "../../11.1/services/repository";
import type { CommunicationCommandEnvelope } from "./commands";
import { CommunicationDomainError } from "./errors";
import { resolveCommunicationAuthority, assertCommunicationAuthority, checkModerationPolicy } from "./policy";
import {
  isConversationTransitionAllowed,
  isDecisionTransitionAllowed,
  isDocumentTransitionAllowed,
  isMeetingTransitionAllowed,
} from "../state-machines";
import type { ConversationRecord, DecisionRecord, DocumentRecord, MeetingRecord, MessageRecord, ThreadRecord } from "../data-model";
import { loadConversation, loadThread } from "./repository";

export interface PipelineContext {
  envelope: CommunicationCommandEnvelope;
  permissions: string[];
  conversation?: ConversationRecord | null;
  thread?: ThreadRecord | null;
  message?: MessageRecord | null;
  decision?: DecisionRecord | null;
  meeting?: MeetingRecord | null;
  document?: DocumentRecord | null;
}

export function runValidationPipeline(
  ctx: PipelineContext,
  stages: {
    skipPermission?: boolean;
    skipInstitution?: boolean;
    skipInvitation?: boolean;
    skipVisibility?: boolean;
    skipModeration?: boolean;
    skipRelationships?: boolean;
    skipBusinessRules?: boolean;
  } = {}
) {
  const { envelope, permissions } = ctx;

  if (!stages.skipPermission) {
    const auth = resolveCommunicationAuthority(
      envelope.command_type,
      envelope.actor_human_id,
      envelope.institution_id,
      ctx.conversation?.institution_id ??
        ctx.thread?.institution_id ??
        ctx.message?.institution_id ??
        ctx.decision?.institution_id ??
        ctx.meeting?.institution_id ??
        ctx.document?.institution_id ??
        null,
      ctx.conversation?.owner_human_id,
      ctx.conversation?.moderator_human_ids ?? [],
      permissions,
      envelope.request_source ?? "human"
    );
    assertCommunicationAuthority(auth);
  }

  if (!stages.skipInstitution && envelope.initiative_id) {
    const ini = loadInitiativeAggregate(envelope.initiative_id);
    if (!ini) {
      throw new CommunicationDomainError({
        code: "COMMUNICATION_VALIDATION_FAILED",
        message: "Parent Initiative not found",
        requirement_ids: ["CAE-11.7-W3-VAL-004"],
      });
    }
    if (ini.initiative.institution_id !== envelope.institution_id) {
      throw new CommunicationDomainError({
        code: "COMMUNICATION_INSTITUTION_MISMATCH",
        message: "Initiative institution mismatch",
        requirement_ids: ["CAE-11.7-W3-VAL-003"],
      });
    }
  }

  if (!stages.skipInvitation && ctx.conversation) {
    const participants = new Set(ctx.conversation.participant_human_ids);
    if (
      !participants.has(envelope.actor_human_id) &&
      ctx.conversation.owner_human_id !== envelope.actor_human_id &&
      !ctx.conversation.moderator_human_ids.includes(envelope.actor_human_id) &&
      !["CreateConversation", "ArchiveConversation", "GenerateAISummary"].includes(envelope.command_type)
    ) {
      throw new CommunicationDomainError({
        code: "COMMUNICATION_INVITATION_REQUIRED",
        message: "Actor must be a conversation participant",
        entity_id: ctx.conversation.canonical_id,
        requirement_ids: ["CAE-11.7-W3-INV-001"],
      });
    }
  }

  if (!stages.skipVisibility && ctx.conversation) {
    if (ctx.conversation.visibility === "private" && envelope.command_type === "PublishAnnouncement") {
      throw new CommunicationDomainError({
        code: "COMMUNICATION_VISIBILITY_DENIED",
        message: "Cannot publish announcement from private conversation context",
        requirement_ids: ["CAE-11.7-W3-VIS-001"],
      });
    }
  }

  if (!stages.skipModeration && ctx.conversation) {
    checkModerationPolicy(
      envelope.actor_human_id,
      ctx.conversation.moderator_human_ids,
      ctx.conversation.canonical_id,
      ctx.conversation.lifecycle_state === "archived"
    );
  }

  if (!stages.skipRelationships && !stages.skipBusinessRules) {
    if (ctx.thread && ctx.conversation && ctx.thread.conversation_id !== ctx.conversation.canonical_id) {
      throw new CommunicationDomainError({
        code: "COMMUNICATION_VALIDATION_FAILED",
        message: "Thread must belong to Conversation",
        requirement_ids: ["CAE-11.7-W3-REL-001"],
      });
    }
    if (ctx.message && ctx.thread && ctx.message.thread_id !== ctx.thread.canonical_id) {
      throw new CommunicationDomainError({
        code: "COMMUNICATION_VALIDATION_FAILED",
        message: "Message must belong to Thread",
        requirement_ids: ["CAE-11.7-W3-REL-002"],
      });
    }
  }
}

export function assertConversationTransition(from: string, to: string, entityId: string) {
  if (!isConversationTransitionAllowed(from as never, to as never)) {
    throw new CommunicationDomainError({
      code: "COMMUNICATION_TRANSITION_NOT_ALLOWED",
      message: `Illegal Conversation transition: ${from} → ${to}`,
      entity_id: entityId,
      entity_type: "Conversation",
      current_state: from,
      requested_state: to,
      requirement_ids: ["CAE-11.7-W3-LIF-001"],
      suggested_action: "Follow lawful intermediate states (e.g. Draft → Open → Active)",
    });
  }
}

export function assertDecisionTransition(from: string, to: string, entityId: string) {
  if (!isDecisionTransitionAllowed(from as never, to as never)) {
    throw new CommunicationDomainError({
      code: "COMMUNICATION_TRANSITION_NOT_ALLOWED",
      message: `Illegal Decision transition: ${from} → ${to}`,
      entity_id: entityId,
      entity_type: "Decision",
      current_state: from,
      requested_state: to,
      requirement_ids: ["CAE-11.7-W3-LIF-002"],
    });
  }
}

export function assertDocumentTransition(from: string, to: string, entityId: string) {
  if (!isDocumentTransitionAllowed(from as never, to as never)) {
    throw new CommunicationDomainError({
      code: "COMMUNICATION_TRANSITION_NOT_ALLOWED",
      message: `Illegal Document transition: ${from} → ${to}`,
      entity_id: entityId,
      entity_type: "Document",
      current_state: from,
      requested_state: to,
      requirement_ids: ["CAE-11.7-W3-LIF-003"],
    });
  }
}

export function assertMeetingTransition(from: string, to: string, entityId: string) {
  if (!isMeetingTransitionAllowed(from as never, to as never)) {
    throw new CommunicationDomainError({
      code: "COMMUNICATION_TRANSITION_NOT_ALLOWED",
      message: `Illegal Meeting transition: ${from} → ${to}`,
      entity_id: entityId,
      entity_type: "Meeting",
      current_state: from,
      requested_state: to,
      requirement_ids: ["CAE-11.7-W3-LIF-004"],
    });
  }
}

export function requireConversation(conversationId: string): ConversationRecord {
  const conversation = loadConversation(conversationId);
  if (!conversation) {
    throw new CommunicationDomainError({
      code: "COMMUNICATION_NOT_FOUND",
      message: "Conversation not found — orphan communication prohibited",
      entity_id: conversationId,
      requirement_ids: ["CAE-11.7-W3-POL-001"],
    });
  }
  return conversation;
}

export function requireThread(threadId: string): ThreadRecord {
  const thread = loadThread(threadId);
  if (!thread) {
    throw new CommunicationDomainError({
      code: "COMMUNICATION_NOT_FOUND",
      message: "Thread not found",
      entity_id: threadId,
      requirement_ids: ["CAE-11.7-W3-POL-001"],
    });
  }
  return thread;
}
