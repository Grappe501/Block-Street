/**
 * CAE-11.7-W3 — Communications Domain Engine (COM-SVC-001)
 * All communication mutations must pass through this service.
 */
import { createHash } from "crypto";
import { caeId, nowIso } from "../../../utils";
import type {
  ActionItemRecord,
  AISummaryRecord,
  AnnouncementRecord,
  ConversationRecord,
  DecisionRecord,
  DocumentRecord,
  MeetingRecord,
  MessageRecord,
  ThreadRecord,
} from "../data-model";
import type {
  ArchiveConversationPayload,
  CommunicationCommandEnvelope,
  CommunicationCommandResult,
  CreateActionItemPayload,
  CreateConversationPayload,
  CreateDocumentPayload,
  CreateMeetingPayload,
  CreateThreadPayload,
  EditMessagePayload,
  GenerateAISummaryPayload,
  PostMessagePayload,
  PublishAnnouncementPayload,
  RecordDecisionPayload,
  ResolveThreadPayload,
} from "./commands";
import { CommunicationDomainError } from "./errors";
import { publishCommunicationEvent } from "./events";
import { missionSynchronizationService } from "./mission-sync";
import {
  assertConversationTransition,
  requireConversation,
  requireThread,
  runValidationPipeline,
} from "./validation-pipeline";
import {
  appendCommunicationHistory,
  getCommunicationIdempotencyResult,
  loadConversation,
  loadMessage,
  loadThread,
  saveActionItem,
  saveAISummary,
  saveAnnouncement,
  saveConversation,
  saveDecision,
  saveDocument,
  saveMeeting,
  saveMessage,
  saveThread,
  setCommunicationIdempotencyResult,
} from "./repository";
import { createCommunicationVersion, recordCommunicationAudit } from "./version-audit";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function hashPayload(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 16);
}

function ok(
  entityId: string,
  entityType: string,
  prev: string | null,
  next: string | null,
  version: number,
  events: string[],
  auditId?: string
): CommunicationCommandResult {
  return {
    success: true,
    entity_id: entityId,
    entity_type: entityType,
    previous_status_optional: prev,
    new_status_optional: next,
    version,
    events,
    warnings: [],
    next_required_actions: [],
    validation_errors: [],
    audit_id_optional: auditId ?? null,
  };
}

function failResult(e: CommunicationDomainError): CommunicationCommandResult {
  return {
    success: false,
    entity_id: e.entity_id ?? null,
    entity_type: e.entity_type ?? null,
    previous_status_optional: e.current_state ?? null,
    new_status_optional: e.requested_state ?? null,
    version: null,
    events: [],
    warnings: [],
    next_required_actions: [],
    validation_errors: [e.toValidationError()],
  };
}

function bumpEntity<
  T extends { canonical_id: string; current_version: number; updated_at: string; last_modified_by: string },
>(entity: T, actorId: string, reason: string, fields: string[], entityType: string): T {
  const version = createCommunicationVersion({
    entity_id: entity.canonical_id,
    entity_type: entityType,
    current_version: entity.current_version,
    changed_by: actorId,
    reason,
    affected_fields: fields,
    snapshot: { ...entity } as unknown as Record<string, unknown>,
  });
  entity.current_version = version.version_number;
  entity.updated_at = nowIso();
  entity.last_modified_by = actorId;
  return entity;
}

function writeHistory(
  entityId: string,
  entityType: string,
  eventType: string,
  institutionId: string,
  initiativeId: string,
  actorId: string,
  payload: Record<string, unknown>
) {
  appendCommunicationHistory({
    event_id: caeId("chx"),
    entity_id: entityId,
    entity_type: entityType,
    event_type: eventType,
    institution_id: institutionId,
    initiative_id: initiativeId,
    actor_human_id: actorId,
    occurred_at: nowIso(),
    payload,
  });
}

export class CommunicationsDomainService {
  execute(
    envelope: CommunicationCommandEnvelope,
    permissions: string[] = ["civic_action.manage"]
  ): CommunicationCommandResult {
    if (envelope.idempotency_key) {
      const cached = getCommunicationIdempotencyResult(envelope.idempotency_key);
      if (cached) return cached as CommunicationCommandResult;
    }

    let result: CommunicationCommandResult;
    try {
      result = this.dispatch(envelope, permissions);
    } catch (e) {
      if (e instanceof CommunicationDomainError) return failResult(e);
      throw e;
    }

    if (envelope.idempotency_key) {
      const okIdem = setCommunicationIdempotencyResult(envelope.idempotency_key, result, hashPayload(envelope));
      if (!okIdem) {
        throw new CommunicationDomainError({
          code: "COMMUNICATION_IDEMPOTENCY_CONFLICT",
          message: "Idempotency key reused with different payload",
          requirement_ids: ["CAE-11.7-W3-CON-001"],
        });
      }
    }
    return result;
  }

  private dispatch(envelope: CommunicationCommandEnvelope, permissions: string[]): CommunicationCommandResult {
    switch (envelope.command_type) {
      case "CreateConversation":
        return this.createConversation(envelope, permissions);
      case "CreateThread":
        return this.createThread(envelope, permissions);
      case "PostMessage":
        return this.postMessage(envelope, permissions);
      case "EditMessage":
        return this.editMessage(envelope, permissions);
      case "RecordDecision":
        return this.recordDecision(envelope, permissions);
      case "CreateMeeting":
        return this.createMeeting(envelope, permissions);
      case "PublishAnnouncement":
        return this.publishAnnouncement(envelope, permissions);
      case "CreateDocument":
        return this.createDocument(envelope, permissions);
      case "ArchiveConversation":
        return this.archiveConversation(envelope, permissions);
      case "GenerateAISummary":
        return this.generateAISummary(envelope, permissions);
      case "CreateActionItem":
        return this.createActionItem(envelope, permissions);
      case "ResolveThread":
        return this.resolveThread(envelope, permissions);
      default:
        throw new CommunicationDomainError({
          code: "COMMUNICATION_DIRECT_MUTATION_FORBIDDEN",
          message: `Unsupported command: ${envelope.command_type}`,
        });
    }
  }

  private createConversation(envelope: CommunicationCommandEnvelope, permissions: string[]): CommunicationCommandResult {
    const payload = envelope.payload as unknown as CreateConversationPayload;
    runValidationPipeline({ envelope, permissions }, { skipInvitation: true });

    const id = caeId("cnv");
    const now = nowIso();
    const participants = Array.from(new Set([envelope.actor_human_id, ...payload.participant_human_ids]));
    const conversation: ConversationRecord = {
      canonical_id: id,
      public_id: `CNV-${id.slice(-6).toUpperCase()}`,
      display_name: payload.display_name,
      canonical_slug: slugify(payload.display_name),
      institution_id: envelope.institution_id,
      initiative_id: envelope.initiative_id,
      parent_object_id: payload.related_object_id,
      parent_object_type: payload.related_object_type,
      object_type: "Conversation",
      visibility: (payload.visibility as ConversationRecord["visibility"]) ?? "institution_internal",
      governance_classification: 3,
      owner_human_id: envelope.actor_human_id,
      created_by: envelope.actor_human_id,
      last_modified_by: envelope.actor_human_id,
      created_at: now,
      updated_at: now,
      current_version: 1,
      lifecycle_state: "draft",
      tags: [],
      purpose: payload.purpose,
      context_type: payload.context_type,
      related_object_id: payload.related_object_id,
      related_object_type: payload.related_object_type,
      participant_human_ids: participants,
      moderator_human_ids: [envelope.actor_human_id],
      mission_id_optional: payload.mission_id_optional ?? null,
      objective_id_optional: payload.objective_id_optional ?? null,
      pinned_message_ids: [],
      ai_summary_id_optional: null,
    };

    runValidationPipeline({ envelope, permissions, conversation });
    saveConversation(conversation);

    const event = publishCommunicationEvent({
      event_type: "communication.conversation_created",
      entity_id: id,
      entity_type: "Conversation",
      initiative_id: envelope.initiative_id,
      institution_id: envelope.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { display_name: payload.display_name, purpose: payload.purpose },
    });

    const audit = recordCommunicationAudit({
      who: envelope.actor_human_id,
      what: "CreateConversation",
      where: envelope.institution_id,
      previous_state: null,
      new_state: { lifecycle_state: "draft" },
      reason: envelope.reason_optional ?? null,
      authority: "communication.conversation.create",
      request_source: envelope.request_source ?? "human",
    });

    writeHistory(id, "Conversation", "conversation_created", envelope.institution_id, envelope.initiative_id, envelope.actor_human_id, {
      lifecycle_state: "draft",
    });

    return ok(id, "Conversation", null, "draft", 1, [event.event_id], audit.audit_id);
  }

  private createThread(envelope: CommunicationCommandEnvelope, permissions: string[]): CommunicationCommandResult {
    const payload = envelope.payload as unknown as CreateThreadPayload;
    const conversation = requireConversation(payload.conversation_id);
    runValidationPipeline({ envelope, permissions, conversation });

    const id = caeId("thd");
    const now = nowIso();
    const thread: ThreadRecord = {
      canonical_id: id,
      public_id: `THD-${id.slice(-6).toUpperCase()}`,
      display_name: payload.subject,
      canonical_slug: slugify(payload.subject),
      institution_id: conversation.institution_id,
      initiative_id: conversation.initiative_id,
      parent_object_id: conversation.canonical_id,
      parent_object_type: "Conversation",
      object_type: "Thread",
      visibility: conversation.visibility,
      governance_classification: conversation.governance_classification,
      owner_human_id: envelope.actor_human_id,
      created_by: envelope.actor_human_id,
      last_modified_by: envelope.actor_human_id,
      created_at: now,
      updated_at: now,
      current_version: 1,
      lifecycle_state: "open",
      tags: [],
      conversation_id: conversation.canonical_id,
      subject: payload.subject,
      participant_human_ids: payload.participant_human_ids ?? conversation.participant_human_ids,
      parent_message_id_optional: payload.parent_message_id_optional ?? null,
      resolved: false,
      related_decision_ids: [],
    };

    saveThread(thread);
    const event = publishCommunicationEvent({
      event_type: "communication.thread_opened",
      entity_id: id,
      entity_type: "Thread",
      initiative_id: conversation.initiative_id,
      institution_id: conversation.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { conversation_id: conversation.canonical_id, subject: payload.subject },
    });
    return ok(id, "Thread", null, "open", 1, [event.event_id]);
  }

  private postMessage(envelope: CommunicationCommandEnvelope, permissions: string[]): CommunicationCommandResult {
    const payload = envelope.payload as unknown as PostMessagePayload;
    const conversation = requireConversation(payload.conversation_id);
    const thread = requireThread(payload.thread_id);

    if (conversation.lifecycle_state === "draft") {
      assertConversationTransition("draft", "open", conversation.canonical_id);
      conversation.lifecycle_state = "open";
      bumpEntity(conversation, envelope.actor_human_id, "Open conversation for messaging", ["lifecycle_state"], "Conversation");
      saveConversation(conversation);
    }

    runValidationPipeline({ envelope, permissions, conversation, thread });

    const id = caeId("msg");
    const now = nowIso();
    const message: MessageRecord = {
      canonical_id: id,
      public_id: `MSG-${id.slice(-6).toUpperCase()}`,
      display_name: payload.body.slice(0, 80),
      canonical_slug: slugify(payload.body),
      institution_id: conversation.institution_id,
      initiative_id: conversation.initiative_id,
      parent_object_id: thread.canonical_id,
      parent_object_type: "Thread",
      object_type: "Message",
      visibility: conversation.visibility,
      governance_classification: conversation.governance_classification,
      owner_human_id: envelope.actor_human_id,
      created_by: envelope.actor_human_id,
      last_modified_by: envelope.actor_human_id,
      created_at: now,
      updated_at: now,
      current_version: 1,
      lifecycle_state: "active",
      tags: [],
      conversation_id: conversation.canonical_id,
      thread_id: thread.canonical_id,
      author_human_id: envelope.actor_human_id,
      body: payload.body,
      attachment_ids: payload.attachment_ids ?? [],
      mention_human_ids: payload.mention_human_ids ?? [],
      reference_object_ids: [],
      edited_at_optional: null,
      edit_reason_optional: null,
      is_ai_generated: false,
    };

    saveMessage(message);
    const event = publishCommunicationEvent({
      event_type: "communication.message_posted",
      entity_id: id,
      entity_type: "Message",
      initiative_id: conversation.initiative_id,
      institution_id: conversation.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { thread_id: thread.canonical_id, is_ai_generated: false },
    });
    return ok(id, "Message", null, "active", 1, [event.event_id]);
  }

  private editMessage(envelope: CommunicationCommandEnvelope, permissions: string[]): CommunicationCommandResult {
    const payload = envelope.payload as unknown as EditMessagePayload;
    const message = loadMessage(payload.message_id);
    if (!message) {
      throw new CommunicationDomainError({ code: "COMMUNICATION_NOT_FOUND", message: "Message not found", entity_id: payload.message_id });
    }
    const conversation = requireConversation(message.conversation_id);
    const thread = requireThread(message.thread_id);
    runValidationPipeline({ envelope, permissions, conversation, thread, message });

    if (envelope.expected_version_optional != null && message.current_version !== envelope.expected_version_optional) {
      throw new CommunicationDomainError({
        code: "COMMUNICATION_VERSION_CONFLICT",
        message: "Version conflict",
        entity_id: message.canonical_id,
        retryable: true,
        requirement_ids: ["CAE-11.7-W3-CON-002"],
      });
    }

    const prev = message.lifecycle_state;
    message.body = payload.body;
    message.edited_at_optional = nowIso();
    message.edit_reason_optional = payload.edit_reason ?? null;
    message.lifecycle_state = "edited";
    bumpEntity(message, envelope.actor_human_id, "Edit message", ["body", "lifecycle_state"], "Message");
    saveMessage(message);

    const event = publishCommunicationEvent({
      event_type: "communication.message_edited",
      entity_id: message.canonical_id,
      entity_type: "Message",
      initiative_id: conversation.initiative_id,
      institution_id: conversation.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: message.current_version,
      payload: { from: prev, to: "edited" },
    });
    return ok(message.canonical_id, "Message", prev, "edited", message.current_version, [event.event_id]);
  }

  private recordDecision(envelope: CommunicationCommandEnvelope, permissions: string[]): CommunicationCommandResult {
    const payload = envelope.payload as unknown as RecordDecisionPayload;
    const conversation = requireConversation(payload.conversation_id);
    runValidationPipeline({ envelope, permissions, conversation });

    const id = caeId("dec");
    const now = nowIso();
    const actionItemIds: string[] = [];

    for (const item of payload.action_items ?? []) {
      const aiId = this.persistActionItem(
        envelope,
        conversation,
        item.description,
        item.assignee_human_id,
        id,
        item.due_date_optional ?? null
      );
      actionItemIds.push(aiId);
    }

    const decision: DecisionRecord = {
      canonical_id: id,
      public_id: `DEC-${id.slice(-6).toUpperCase()}`,
      display_name: payload.decision_text.slice(0, 80),
      canonical_slug: slugify(payload.decision_text),
      institution_id: conversation.institution_id,
      initiative_id: conversation.initiative_id,
      parent_object_id: conversation.canonical_id,
      parent_object_type: "Conversation",
      object_type: "Decision",
      visibility: conversation.visibility,
      governance_classification: conversation.governance_classification,
      owner_human_id: envelope.actor_human_id,
      created_by: envelope.actor_human_id,
      last_modified_by: envelope.actor_human_id,
      created_at: now,
      updated_at: now,
      current_version: 1,
      lifecycle_state: "approved",
      tags: [],
      conversation_id: conversation.canonical_id,
      thread_id_optional: payload.thread_id_optional ?? null,
      decision_text: payload.decision_text,
      rationale: payload.rationale,
      decided_by_human_id: envelope.actor_human_id,
      approved_by_human_id_optional: envelope.actor_human_id,
      related_message_ids: payload.related_message_ids ?? [],
      action_item_ids: actionItemIds,
    };

    saveDecision(decision);
    const event = publishCommunicationEvent({
      event_type: "communication.decision_recorded",
      entity_id: id,
      entity_type: "Decision",
      initiative_id: conversation.initiative_id,
      institution_id: conversation.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { decision_text: payload.decision_text, action_item_ids: actionItemIds },
    });
    return ok(id, "Decision", null, "approved", 1, [event.event_id]);
  }

  private createMeeting(envelope: CommunicationCommandEnvelope, permissions: string[]): CommunicationCommandResult {
    const payload = envelope.payload as unknown as CreateMeetingPayload;
    const conversation = payload.conversation_id_optional ? loadConversation(payload.conversation_id_optional) : null;
    runValidationPipeline({ envelope, permissions, conversation });

    const id = caeId("mtg");
    const now = nowIso();
    const meeting: MeetingRecord = {
      canonical_id: id,
      public_id: `MTG-${id.slice(-6).toUpperCase()}`,
      display_name: payload.display_name,
      canonical_slug: slugify(payload.display_name),
      institution_id: envelope.institution_id,
      initiative_id: envelope.initiative_id,
      parent_object_id: conversation?.canonical_id ?? envelope.initiative_id,
      parent_object_type: conversation ? "Conversation" : "Initiative",
      object_type: "Meeting",
      visibility: conversation?.visibility ?? "institution_internal",
      governance_classification: 3,
      owner_human_id: envelope.actor_human_id,
      created_by: envelope.actor_human_id,
      last_modified_by: envelope.actor_human_id,
      created_at: now,
      updated_at: now,
      current_version: 1,
      lifecycle_state: "scheduled",
      tags: [],
      purpose: payload.purpose,
      conversation_id_optional: payload.conversation_id_optional ?? null,
      scheduled_at: payload.scheduled_at,
      location_optional: payload.location_optional ?? null,
      participant_human_ids: payload.participant_human_ids,
      agenda_items: payload.agenda_items ?? [],
      minutes_text_optional: null,
      recording_uri_optional: null,
      action_item_ids: [],
    };

    saveMeeting(meeting);
    const event = publishCommunicationEvent({
      event_type: "communication.meeting_created",
      entity_id: id,
      entity_type: "Meeting",
      initiative_id: envelope.initiative_id,
      institution_id: envelope.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { scheduled_at: payload.scheduled_at },
    });
    return ok(id, "Meeting", null, "scheduled", 1, [event.event_id]);
  }

  private publishAnnouncement(envelope: CommunicationCommandEnvelope, permissions: string[]): CommunicationCommandResult {
    const payload = envelope.payload as unknown as PublishAnnouncementPayload;
    runValidationPipeline({ envelope, permissions });

    const id = caeId("ann");
    const now = nowIso();
    const announcement: AnnouncementRecord = {
      canonical_id: id,
      public_id: `ANN-${id.slice(-6).toUpperCase()}`,
      display_name: payload.display_name,
      canonical_slug: slugify(payload.display_name),
      institution_id: envelope.institution_id,
      initiative_id: envelope.initiative_id,
      parent_object_id: payload.related_object_id,
      parent_object_type: payload.related_object_type,
      object_type: "Announcement",
      visibility: "institution_internal",
      governance_classification: 2,
      owner_human_id: envelope.actor_human_id,
      created_by: envelope.actor_human_id,
      last_modified_by: envelope.actor_human_id,
      created_at: now,
      updated_at: now,
      current_version: 1,
      lifecycle_state: "published",
      tags: [],
      audience: payload.audience,
      priority: payload.priority ?? 2,
      effective_date: payload.effective_date,
      expiration_date_optional: payload.expiration_date_optional ?? null,
      related_object_id: payload.related_object_id,
      related_object_type: payload.related_object_type,
      body: payload.body,
      delivery_status: "pending",
    };

    saveAnnouncement(announcement);
    const event = publishCommunicationEvent({
      event_type: "communication.announcement_published",
      entity_id: id,
      entity_type: "Announcement",
      initiative_id: envelope.initiative_id,
      institution_id: envelope.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { audience: payload.audience },
    });
    return ok(id, "Announcement", null, "published", 1, [event.event_id]);
  }

  private createDocument(envelope: CommunicationCommandEnvelope, permissions: string[]): CommunicationCommandResult {
    const payload = envelope.payload as unknown as CreateDocumentPayload;
    const conversation = payload.conversation_id_optional ? loadConversation(payload.conversation_id_optional) : null;
    runValidationPipeline({ envelope, permissions, conversation });

    const id = caeId("doc");
    const now = nowIso();
    const document: DocumentRecord = {
      canonical_id: id,
      public_id: `DOC-${id.slice(-6).toUpperCase()}`,
      display_name: payload.display_name,
      canonical_slug: slugify(payload.display_name),
      institution_id: envelope.institution_id,
      initiative_id: envelope.initiative_id,
      parent_object_id: conversation?.canonical_id ?? envelope.initiative_id,
      parent_object_type: conversation ? "Conversation" : "Initiative",
      object_type: "Document",
      visibility: conversation?.visibility ?? "institution_internal",
      governance_classification: 3,
      owner_human_id: envelope.actor_human_id,
      created_by: envelope.actor_human_id,
      last_modified_by: envelope.actor_human_id,
      created_at: now,
      updated_at: now,
      current_version: 1,
      lifecycle_state: "draft",
      tags: [],
      conversation_id_optional: payload.conversation_id_optional ?? null,
      content: payload.content,
      editor_human_ids: payload.editor_human_ids ?? [envelope.actor_human_id],
      reviewer_human_ids: [],
      published_at_optional: null,
    };

    saveDocument(document);
    const event = publishCommunicationEvent({
      event_type: "communication.document_created",
      entity_id: id,
      entity_type: "Document",
      initiative_id: envelope.initiative_id,
      institution_id: envelope.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { display_name: payload.display_name },
    });
    return ok(id, "Document", null, "draft", 1, [event.event_id]);
  }

  private archiveConversation(envelope: CommunicationCommandEnvelope, permissions: string[]): CommunicationCommandResult {
    const payload = envelope.payload as unknown as ArchiveConversationPayload;
    const conversation = requireConversation(payload.conversation_id ?? envelope.entity_id_optional ?? "");
    runValidationPipeline({ envelope, permissions, conversation });

    const prev = conversation.lifecycle_state;
    if (prev === "draft") {
      throw new CommunicationDomainError({
        code: "COMMUNICATION_TRANSITION_NOT_ALLOWED",
        message: "Draft cannot transition directly to Archived; must pass through Open",
        entity_id: conversation.canonical_id,
        current_state: "draft",
        requested_state: "archived",
        requirement_ids: ["CAE-11.7-W3-LIF-001", "CAE-11.7-W3-POL-007"],
        suggested_action: "Open the conversation before archiving",
      });
    }
    assertConversationTransition(prev, "archived", conversation.canonical_id);
    conversation.lifecycle_state = "archived";
    bumpEntity(conversation, envelope.actor_human_id, "Archive conversation", ["lifecycle_state"], "Conversation");
    saveConversation(conversation);

    const event = publishCommunicationEvent({
      event_type: "communication.conversation_archived",
      entity_id: conversation.canonical_id,
      entity_type: "Conversation",
      initiative_id: conversation.initiative_id,
      institution_id: conversation.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: conversation.current_version,
      payload: { from: prev, to: "archived" },
    });
    return ok(conversation.canonical_id, "Conversation", prev, "archived", conversation.current_version, [event.event_id]);
  }

  private generateAISummary(envelope: CommunicationCommandEnvelope, permissions: string[]): CommunicationCommandResult {
    const payload = envelope.payload as unknown as GenerateAISummaryPayload;
    const conversation = requireConversation(payload.conversation_id);
    runValidationPipeline({ envelope, permissions, conversation });

    const id = caeId("ais");
    const now = nowIso();
    const summary: AISummaryRecord = {
      canonical_id: id,
      public_id: `AIS-${id.slice(-6).toUpperCase()}`,
      display_name: `AI Summary — ${conversation.display_name}`,
      canonical_slug: `ai-summary-${conversation.canonical_slug}`,
      institution_id: conversation.institution_id,
      initiative_id: conversation.initiative_id,
      parent_object_id: conversation.canonical_id,
      parent_object_type: "Conversation",
      object_type: "AISummary",
      visibility: conversation.visibility,
      governance_classification: conversation.governance_classification,
      owner_human_id: envelope.actor_human_id,
      created_by: envelope.actor_human_id,
      last_modified_by: envelope.actor_human_id,
      created_at: now,
      updated_at: now,
      current_version: 1,
      lifecycle_state: "active",
      tags: [],
      conversation_id: conversation.canonical_id,
      thread_id_optional: payload.thread_id_optional ?? null,
      summary_text: payload.summary_text,
      generated_by_service_id: payload.service_identity_id,
      requested_by_human_id: envelope.actor_human_id,
      source_message_ids: payload.source_message_ids,
      does_not_impersonate_human: true,
    };

    saveAISummary(summary);
    conversation.ai_summary_id_optional = id;
    saveConversation(conversation);

    const event = publishCommunicationEvent({
      event_type: "communication.ai_summary_generated",
      entity_id: id,
      entity_type: "AISummary",
      initiative_id: conversation.initiative_id,
      institution_id: conversation.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: payload.service_identity_id,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { does_not_impersonate_human: true, generated_by_service_id: payload.service_identity_id },
    });
    return ok(id, "AISummary", null, "active", 1, [event.event_id]);
  }

  private createActionItem(envelope: CommunicationCommandEnvelope, permissions: string[]): CommunicationCommandResult {
    const payload = envelope.payload as unknown as CreateActionItemPayload;
    const conversation = requireConversation(payload.conversation_id);
    runValidationPipeline({ envelope, permissions, conversation });

    const id = this.persistActionItem(
      envelope,
      conversation,
      payload.description,
      payload.assignee_human_id,
      payload.source_decision_id_optional ?? null,
      payload.due_date_optional ?? null
    );

    const event = publishCommunicationEvent({
      event_type: "communication.action_item_created",
      entity_id: id,
      entity_type: "ActionItem",
      initiative_id: conversation.initiative_id,
      institution_id: conversation.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: 1,
      payload: { description: payload.description },
    });
    return ok(id, "ActionItem", null, "open", 1, [event.event_id]);
  }

  private resolveThread(envelope: CommunicationCommandEnvelope, permissions: string[]): CommunicationCommandResult {
    const payload = envelope.payload as unknown as ResolveThreadPayload;
    const thread = requireThread(payload.thread_id);
    const conversation = requireConversation(thread.conversation_id);
    runValidationPipeline({ envelope, permissions, conversation, thread });

    const prev = thread.lifecycle_state;
    thread.lifecycle_state = "resolved";
    thread.resolved = true;
    bumpEntity(thread, envelope.actor_human_id, "Resolve thread", ["lifecycle_state", "resolved"], "Thread");
    saveThread(thread);

    const event = publishCommunicationEvent({
      event_type: "communication.thread_resolved",
      entity_id: thread.canonical_id,
      entity_type: "Thread",
      initiative_id: conversation.initiative_id,
      institution_id: conversation.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      entity_version: thread.current_version,
      payload: { from: prev, to: "resolved" },
    });
    return ok(thread.canonical_id, "Thread", prev, "resolved", thread.current_version, [event.event_id]);
  }

  private persistActionItem(
    envelope: CommunicationCommandEnvelope,
    conversation: ConversationRecord,
    description: string,
    assigneeHumanId: string,
    sourceDecisionId: string | null,
    dueDate: string | null
  ): string {
    const id = caeId("act");
    const now = nowIso();
    const actionItem: ActionItemRecord = {
      canonical_id: id,
      public_id: `ACT-${id.slice(-6).toUpperCase()}`,
      display_name: description.slice(0, 80),
      canonical_slug: slugify(description),
      institution_id: conversation.institution_id,
      initiative_id: conversation.initiative_id,
      parent_object_id: conversation.canonical_id,
      parent_object_type: "Conversation",
      object_type: "ActionItem",
      visibility: conversation.visibility,
      governance_classification: conversation.governance_classification,
      owner_human_id: envelope.actor_human_id,
      created_by: envelope.actor_human_id,
      last_modified_by: envelope.actor_human_id,
      created_at: now,
      updated_at: now,
      current_version: 1,
      lifecycle_state: "open",
      tags: [],
      conversation_id: conversation.canonical_id,
      source_decision_id_optional: sourceDecisionId,
      source_meeting_id_optional: null,
      description,
      assignee_human_id: assigneeHumanId,
      due_date_optional: dueDate,
      mission_sync_status: "queued",
    };
    saveActionItem(actionItem);
    missionSynchronizationService.queueActionItem({
      action_item_id: id,
      conversation_id: conversation.canonical_id,
      institution_id: conversation.institution_id,
      initiative_id: conversation.initiative_id,
      description,
      assignee_human_id: assigneeHumanId,
    });
    return id;
  }
}

export const communicationsDomainService = new CommunicationsDomainService();

export function assertCommunicationMutationViaService(): never {
  throw new CommunicationDomainError({
    code: "COMMUNICATION_DIRECT_MUTATION_FORBIDDEN",
    message: "Direct communication mutation is forbidden; use CommunicationsDomainService",
    requirement_ids: ["CAE-11.7-W3-SVC-001"],
  });
}
