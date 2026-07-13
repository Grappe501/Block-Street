/**
 * CAE-11.7-W3 — Mission synchronization stub (11.3 integration)
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "./repository";

export const MISSION_SYNC_QUEUE_KEY = "communication_mission_sync_queue";

export interface MissionSyncQueueEntry {
  queue_id: string;
  action_item_id: string;
  conversation_id: string;
  institution_id: string;
  initiative_id: string;
  description: string;
  assignee_human_id: string;
  status: "queued" | "processing" | "synced" | "failed";
  queued_at: string;
  target_build: "11.3";
}

export class MissionSynchronizationService {
  queueActionItem(input: {
    action_item_id: string;
    conversation_id: string;
    institution_id: string;
    initiative_id: string;
    description: string;
    assignee_human_id: string;
  }): MissionSyncQueueEntry {
    const entry: MissionSyncQueueEntry = {
      queue_id: caeId("msq"),
      action_item_id: input.action_item_id,
      conversation_id: input.conversation_id,
      institution_id: input.institution_id,
      initiative_id: input.initiative_id,
      description: input.description,
      assignee_human_id: input.assignee_human_id,
      status: "queued",
      queued_at: nowIso(),
      target_build: "11.3",
    };
    const queue = readStoreSlice<MissionSyncQueueEntry>(MISSION_SYNC_QUEUE_KEY);
    queue.push(entry);
    writeStoreSlice(MISSION_SYNC_QUEUE_KEY, queue);
    return entry;
  }

  listQueued(limit = 50): MissionSyncQueueEntry[] {
    return readStoreSlice<MissionSyncQueueEntry>(MISSION_SYNC_QUEUE_KEY)
      .filter((e) => e.status === "queued")
      .slice(0, limit);
  }
}

export const missionSynchronizationService = new MissionSynchronizationService();
