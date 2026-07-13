/**
 * CAE-11.6-W7 — Communications tests
 */
import { communicationsService } from "./services/communications-service";
import { seedCommunicationsIfEmpty } from "./services/seed";
import { getCommunicationsConstitution, OPS_COMMUNICATIONS_PRINCIPLE, REQUIRED_COMMUNICATIONS_SERVICES } from "./constitution";
import { checkOpsW7Invariants } from "./invariants";
import { explainConversationInstitutionalContext } from "./traceability";
import { COMMUNICATIONS_EVENT_CATALOG } from "./events/catalog";

export type OpsW7TestResult = { name: string; passed: boolean; detail?: string };

export function runOpsW7CommunicationsTests(): OpsW7TestResult[] {
  seedCommunicationsIfEmpty();
  const results: OpsW7TestResult[] = [];
  const institutionId = "inst-block-street";
  const missionId = "opm-volunteer-training-001";

  const constitution = getCommunicationsConstitution();
  results.push({
    name: "communications_principle",
    passed: constitution.governing_principle === OPS_COMMUNICATIONS_PRINCIPLE,
  });

  results.push({
    name: "required_communications_services",
    passed: REQUIRED_COMMUNICATIONS_SERVICES.length === 15,
    detail: `${REQUIRED_COMMUNICATIONS_SERVICES.length} services`,
  });

  results.push({
    name: "w7_invariants",
    passed: checkOpsW7Invariants().every((i) => i.passed),
  });

  const conversations = communicationsService.conversations.list(institutionId);
  results.push({
    name: "seeded_conversations",
    passed: conversations.length >= 1,
    detail: `${conversations.length} conversations`,
  });

  const missionRoom = communicationsService.missionRooms.build(missionId, institutionId);
  results.push({
    name: "mission_room",
    passed: !!missionRoom && missionRoom.room.conversation_type === "mission_room",
    detail: missionRoom?.room.title,
  });

  const messages = communicationsService.messages.list(institutionId);
  results.push({
    name: "canonical_messages",
    passed: messages.length >= 1 && messages.every((m) => !!m.thread_id),
    detail: `${messages.length} messages`,
  });

  const decisions = communicationsService.decisions.list(institutionId, missionId);
  results.push({
    name: "decision_ledger",
    passed: decisions.length >= 1,
    detail: decisions[0]?.decision.slice(0, 40),
  });

  const threads = communicationsService.threads.list(institutionId);
  results.push({
    name: "thread_model",
    passed: threads.length >= 1,
    detail: threads[0]?.title,
  });

  const trace = explainConversationInstitutionalContext({
    conversation_id: conversations[0].conversation_id,
    institution_id: institutionId,
    mission_id: conversations[0].mission_id,
    conversation_type: conversations[0].conversation_type,
  });
  results.push({
    name: "conversation_traceability",
    passed: trace.includes("Mission") && trace.includes("Institution"),
    detail: trace.slice(0, 60),
  });

  const ai = communicationsService.ai.analyze(institutionId);
  results.push({
    name: "ai_conversation_advisory",
    passed: ai.advisory_only === true && ai.may_not_speak_as_authority === true,
  });

  const summary = communicationsService.ai.summarize(conversations[0].conversation_id);
  results.push({
    name: "ai_summary",
    passed: summary.advisory_only === true && !!summary.summary,
    detail: summary.summary.slice(0, 40),
  });

  const analytics = communicationsService.analytics.compute(institutionId);
  results.push({
    name: "communication_analytics",
    passed: analytics.participation_rate >= 0 && analytics.knowledge_candidates >= 0,
    detail: `candidates=${analytics.knowledge_candidates}`,
  });

  results.push({
    name: "communications_event_catalog",
    passed: COMMUNICATIONS_EVENT_CATALOG.length >= 11,
    detail: `${COMMUNICATIONS_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allOpsW7TestsPassed(): boolean {
  return runOpsW7CommunicationsTests().every((t) => t.passed);
}
