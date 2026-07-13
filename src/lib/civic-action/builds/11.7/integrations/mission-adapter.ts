/**
 * CAE-11.7-W5 — Mission adapter (MissionCreated/Completed → mission conversation stub)
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import { missionSynchronizationService } from "../services/mission-sync";
import type { CommunicationEventOutboxRecord } from "../services/events";

export type MissionConversationStub = {
  stub_id: string;
  mission_id: string;
  conversation_id: string | null;
  institution_id: string;
  initiative_id: string;
  status: "pending" | "created" | "completed";
  created_at: string;
  source_event_id: string;
};

const STUB_KEY = "communication_mission_conversation_stubs";

const MISSION_EVENT_TYPES = new Set([
  "execution.mission_created",
  "execution.mission_completed",
  "communication.action_item_created",
]);

export function handleMissionCommunicationEvent(record: CommunicationEventOutboxRecord | { event_type: string; event_id: string; entity_id: string; payload: Record<string, unknown> }) {
  if (!MISSION_EVENT_TYPES.has(record.event_type)) return null;

  if (record.event_type === "communication.action_item_created") {
    const payload = record.payload;
    missionSynchronizationService.queueActionItem({
      action_item_id: (payload.action_item_id as string) ?? record.entity_id,
      conversation_id: (payload.conversation_id as string) ?? "",
      institution_id: (payload.institution_id as string) ?? "",
      initiative_id: (payload.initiative_id as string) ?? "",
      description: (payload.description as string) ?? "",
      assignee_human_id: (payload.assignee_human_id as string) ?? "",
    });
    return { synced: true, type: "action_item" };
  }

  const missionId = record.entity_id;
  const institutionId = (record.payload.institution_id as string) ?? "";
  const initiativeId = (record.payload.initiative_id as string) ?? "";

  const stub: MissionConversationStub = {
    stub_id: caeId("mcs"),
    mission_id: missionId,
    conversation_id: record.event_type === "execution.mission_created" ? null : (record.payload.conversation_id as string) ?? null,
    institution_id: institutionId,
    initiative_id: initiativeId,
    status: record.event_type === "execution.mission_completed" ? "completed" : "pending",
    created_at: nowIso(),
    source_event_id: record.event_id,
  };

  const stubs = readStoreSlice<MissionConversationStub>(STUB_KEY);
  stubs.push(stub);
  writeStoreSlice(STUB_KEY, stubs);
  return stub;
}

export function listMissionConversationStubs(missionId?: string) {
  const stubs = readStoreSlice<MissionConversationStub>(STUB_KEY);
  return missionId ? stubs.filter((s) => s.mission_id === missionId) : stubs;
}
