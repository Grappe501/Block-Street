/**
 * CAE-11.7-W3 — Communications domain service tests
 */
import { caeId, nowIso } from "../../utils";
import { initiativeDomainService } from "../11.1/services/domain-service";
import type { InitiativeCommandEnvelope } from "../11.1/services/commands";
import {
  communicationsDomainService,
  assertCommunicationMutationViaService,
} from "./services/communications-engine";
import type { CommunicationCommandEnvelope } from "./services/commands";
import { assertConversationTransition } from "./services/validation-pipeline";
import { isServiceOrAiIdentity } from "./services/policy";
import { readStoreSlice, COMMUNICATION_DOMAIN_EVENTS_KEY } from "./services/repository";
import { COMMUNICATION_STORE_KEYS } from "./data-model";
import { MISSION_SYNC_QUEUE_KEY } from "./services/mission-sync";

function iniEnvelope(
  partial: Partial<InitiativeCommandEnvelope> & {
    command_type: InitiativeCommandEnvelope["command_type"];
    payload?: Record<string, unknown>;
  }
): InitiativeCommandEnvelope {
  return {
    command_id: caeId("cmd"),
    command_type: partial.command_type,
    actor_human_id: partial.actor_human_id ?? "usr-001",
    institution_id: partial.institution_id ?? "inst-block-street",
    active_membership_id: partial.active_membership_id ?? "mem-001",
    initiative_id_optional: partial.initiative_id_optional ?? null,
    expected_version_optional: partial.expected_version_optional ?? null,
    requested_at: nowIso(),
    request_id: caeId("req"),
    correlation_id: caeId("cor"),
    idempotency_key: partial.idempotency_key ?? null,
    reason_optional: partial.reason_optional ?? null,
    payload: partial.payload ?? {},
  };
}

function comEnvelope(
  partial: Partial<CommunicationCommandEnvelope> & {
    command_type: CommunicationCommandEnvelope["command_type"];
    initiative_id: string;
    payload?: Record<string, unknown>;
  }
): CommunicationCommandEnvelope {
  return {
    command_id: caeId("cmd"),
    command_type: partial.command_type,
    actor_human_id: partial.actor_human_id ?? "usr-001",
    institution_id: partial.institution_id ?? "inst-block-street",
    active_membership_id: partial.active_membership_id ?? "mem-001",
    initiative_id: partial.initiative_id,
    entity_id_optional: partial.entity_id_optional ?? null,
    expected_version_optional: partial.expected_version_optional ?? null,
    requested_at: nowIso(),
    request_id: caeId("req"),
    correlation_id: caeId("cor"),
    idempotency_key: partial.idempotency_key ?? null,
    reason_optional: partial.reason_optional ?? null,
    request_source: partial.request_source ?? "human",
    payload: partial.payload ?? {},
  };
}

export interface W3TestResult {
  name: string;
  passed: boolean;
  detail?: string;
}

export function runComW3ServiceTests(): W3TestResult[] {
  const results: W3TestResult[] = [];
  const assert = (name: string, condition: boolean, detail?: string) => {
    results.push({ name, passed: condition, detail });
  };

  try {
    assertConversationTransition("draft", "archived", "test");
    assert("draft→archived rejected", false);
  } catch {
    assert("draft→archived rejected", true);
  }

  assert("service identity detected", isServiceOrAiIdentity("svc-bot-001"));

  try {
    assertCommunicationMutationViaService();
    assert("direct mutation forbidden", false);
  } catch {
    assert("direct mutation forbidden", true);
  }

  const draftIni = initiativeDomainService.execute(
    iniEnvelope({
      command_type: "CreateInitiativeDraftCommand",
      payload: {
        governing_institution_id: "inst-block-street",
        initiative_name: `W3 Com Test ${Date.now()}`,
        initiative_type: "program",
        initial_problem_or_opportunity: "Test communications engine",
        proposed_operational_owner_optional: "usr-002",
        visibility: "institution_internal",
      },
    })
  );
  assert("initiative draft for tests", draftIni.success);
  const iniId = draftIni.initiative_id!;

  const created = communicationsDomainService.execute(
    comEnvelope({
      command_type: "CreateConversation",
      initiative_id: iniId,
      payload: {
        purpose: "Coordinate voter outreach messaging",
        context_type: "initiative",
        related_object_id: iniId,
        related_object_type: "Initiative",
        display_name: "Outreach coordination",
        participant_human_ids: ["usr-002"],
      },
    })
  );
  assert("create conversation", created.success && created.new_status_optional === "draft");
  const convId = created.entity_id!;

  const threadCreated = communicationsDomainService.execute(
    comEnvelope({
      command_type: "CreateThread",
      initiative_id: iniId,
      payload: {
        conversation_id: convId,
        subject: "Week 1 messaging plan",
      },
    })
  );
  assert("create thread", threadCreated.success);
  const threadId = threadCreated.entity_id!;

  const posted = communicationsDomainService.execute(
    comEnvelope({
      command_type: "PostMessage",
      initiative_id: iniId,
      payload: {
        conversation_id: convId,
        thread_id: threadId,
        body: "Draft flyer copy for review",
      },
    })
  );
  assert("post message", posted.success);
  const messageId = posted.entity_id!;

  const edited = communicationsDomainService.execute(
    comEnvelope({
      command_type: "EditMessage",
      initiative_id: iniId,
      payload: {
        message_id: messageId,
        body: "Revised flyer copy for review",
        edit_reason: "Clarified call to action",
      },
    })
  );
  assert("edit message", edited.success && (edited.version ?? 0) >= 2);

  const versions = readStoreSlice<import("./data-model").CommunicationVersionRecord>(COMMUNICATION_STORE_KEYS.versions);
  assert("version on edit", versions.some((v) => v.entity_id === messageId && v.version_number >= 2));

  const decision = communicationsDomainService.execute(
    comEnvelope({
      command_type: "RecordDecision",
      initiative_id: iniId,
      payload: {
        conversation_id: convId,
        thread_id_optional: threadId,
        decision_text: "Approve flyer for print",
        rationale: "Messaging aligns with initiative goals",
        action_items: [{ description: "Send files to printer", assignee_human_id: "usr-002" }],
      },
    })
  );
  assert("decision recorded", decision.success && decision.entity_type === "Decision");

  const aiSummary = communicationsDomainService.execute(
    comEnvelope({
      command_type: "GenerateAISummary",
      initiative_id: iniId,
      request_source: "ai_suggestion",
      payload: {
        conversation_id: convId,
        thread_id_optional: threadId,
        source_message_ids: [messageId],
        summary_text: "Team discussed flyer revisions and approved print.",
        service_identity_id: "svc-ai-summary-001",
      },
    })
  );
  assert("AI summary generated", aiSummary.success);
  const summaries = readStoreSlice<import("./data-model").AISummaryRecord>(COMMUNICATION_STORE_KEYS.ai_summaries);
  const summary = summaries.find((s) => s.canonical_id === aiSummary.entity_id);
  assert(
    "AI summary does not post as human",
    summary?.does_not_impersonate_human === true && summary.generated_by_service_id.startsWith("svc-")
  );
  const messages = readStoreSlice<import("./data-model").MessageRecord>(COMMUNICATION_STORE_KEYS.messages);
  assert(
    "no AI impersonation in messages",
    !messages.some((m) => m.is_ai_generated && !isServiceOrAiIdentity(m.author_human_id))
  );

  const actionItem = communicationsDomainService.execute(
    comEnvelope({
      command_type: "CreateActionItem",
      initiative_id: iniId,
      payload: {
        conversation_id: convId,
        description: "Schedule door knock training",
        assignee_human_id: "usr-002",
      },
    })
  );
  assert("create action item", actionItem.success);
  const queue = readStoreSlice<{ action_item_id: string; status: string }>(MISSION_SYNC_QUEUE_KEY);
  assert(
    "action item queues mission sync",
    queue.some((q) => q.action_item_id === actionItem.entity_id && q.status === "queued")
  );

  const archiveOpen = communicationsDomainService.execute(
    comEnvelope({
      command_type: "ArchiveConversation",
      initiative_id: iniId,
      payload: { conversation_id: convId },
    })
  );
  assert("archive conversation after open", archiveOpen.success);

  const svcCmd = communicationsDomainService.execute(
    comEnvelope({
      command_type: "PostMessage",
      initiative_id: iniId,
      actor_human_id: "svc-bot-001",
      payload: {
        conversation_id: convId,
        thread_id: threadId,
        body: "Bot message attempt",
      },
    })
  );
  assert("service identity rejected for PostMessage", !svcCmd.success);

  const events = readStoreSlice<{ event_id: string }>(COMMUNICATION_DOMAIN_EVENTS_KEY);
  assert("events published", events.length >= 4, `${events.length} events`);

  return results;
}

export function allW3TestsPassed(): boolean {
  return runComW3ServiceTests().every((t) => t.passed);
}
