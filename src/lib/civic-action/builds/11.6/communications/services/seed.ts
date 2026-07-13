/**
 * CAE-11.6-W7 — Seed communications defaults
 */
import { nowIso } from "../../../../utils";
import { seedCalendarIfEmpty } from "../../calendar/services/seed";
import { readStoreSlice } from "./repository";
import { COMMUNICATIONS_STORE_KEYS } from "../data-model";
import type {
  ConversationRecord,
  DecisionLedgerRecord,
  MessageRecord,
  ThreadRecord,
} from "../data-model";
import { saveConversation, saveDecision, saveMessage, saveThread } from "./repository";

const NOW = nowIso();
const INSTITUTION = "inst-block-street";
const MISSION = "opm-volunteer-training-001";

export function seedCommunicationsIfEmpty() {
  seedCalendarIfEmpty();
  if (readStoreSlice(COMMUNICATIONS_STORE_KEYS.conversations).length > 0) return false;

  const missionRoom: ConversationRecord = {
    conversation_id: "conv-mission-training",
    institution_id: INSTITUTION,
    conversation_type: "mission_room",
    title: "Volunteer Training Mission Room",
    description: "Collaboration space for field volunteer training mission",
    status: "active",
    visibility: "mission",
    owner_human_id: "usr-001",
    participant_human_ids: ["usr-001"],
    mission_id: MISSION,
    organization_unit_id: "org-field-team",
    calendar_reference: "evt-volunteer-training-kickoff",
    created_at: NOW,
    updated_at: NOW,
  };
  saveConversation(missionRoom);

  const thread: ThreadRecord = {
    thread_id: "thr-training-plan",
    conversation_id: missionRoom.conversation_id,
    institution_id: INSTITUTION,
    title: "Training plan and logistics",
    created_by: "usr-001",
    status: "open",
    priority: "high",
    tags: ["training", "logistics"],
    resolved: false,
    knowledge_candidate: true,
    created_at: NOW,
  };
  saveThread(thread);

  const message: MessageRecord = {
    message_id: "msg-training-kickoff",
    thread_id: thread.thread_id,
    conversation_id: missionRoom.conversation_id,
    institution_id: INSTITUTION,
    author_human_id: "usr-001",
    timestamp: NOW,
    body: "We will finalize training materials by August 10 and use the field van for supply delivery.",
    attachments: [],
    mentions: [],
    reactions: {},
    reply_to_message_id: null,
    edited: false,
    edit_versions: [],
    language: "en",
    translation_status: "none",
    ai_summary_reference: null,
    classification: "discussion",
    visibility: "conversation",
  };
  saveMessage(message);

  const decision: DecisionLedgerRecord = {
    decision_id: "dec-training-venue",
    institution_id: INSTITUTION,
    conversation_id: missionRoom.conversation_id,
    thread_id: thread.thread_id,
    message_id: message.message_id,
    decision: "Training kickoff will be held at Block Street Training Center",
    reason: "Facility capacity and accessibility requirements met",
    evidence: ["fac-training-center"],
    approved_by: "usr-001",
    effective_date: "2026-08-15",
    affected_mission_ids: [MISSION],
    recorded_at: NOW,
  };
  saveDecision(decision);

  return true;
}
