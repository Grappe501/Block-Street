/**
 * CAE-11.7-W6 — Seed conversation defaults
 */
import { seedResearchIfEmpty } from "../../research/services/seed";
import { readStoreSlice } from "./repository";
import { CONVERSATION_STORE_KEYS } from "../data-model";
import { conversationRuntime } from "./conversation-service";

const HUMAN = "usr-001";
const INSTITUTION = "inst-block-street";

export function seedConversationIfEmpty() {
  seedResearchIfEmpty();
  if (readStoreSlice(CONVERSATION_STORE_KEYS.conversations).length > 0) return false;

  const imported = conversationRuntime.conversations.import({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    channel: "board_meeting",
    title: "County Immersion Planning Session",
    participants: ["usr-001", "usr-003", "partner-county-liaison"],
    mission_id: "msn-block-street-001",
    consent_status: "recorded_by_institution",
    source: "zoom_recording_import",
    evidence_links: ["County briefing packet", "HB-214 fiscal note"],
  });

  conversationRuntime.speakers.identify({
    conversation_id: imported.conversation.conversation_id,
    display_name: "Executive Director",
    identity_id: HUMAN,
    institution_id: INSTITUTION,
    role: "executive",
    confidence: 0.95,
  });

  conversationRuntime.speakers.identify({
    conversation_id: imported.conversation.conversation_id,
    display_name: "Unknown Participant",
    institution_id: INSTITUTION,
    confidence: 0.4,
  });

  const transcript = conversationRuntime.transcription.generate({
    conversation_id: imported.conversation.conversation_id,
    human_id: HUMAN,
    institution_id: INSTITUTION,
    content:
      "[00:05] Executive Director: We need to confirm the county match for the CDBG planning grant.\n[00:12] Partner: I will follow up with the county clerk by Friday.",
    transcript_type: "speaker_separated",
  });

  conversationRuntime.translation.translate({
    transcript_id: transcript.transcript.transcript_id,
    conversation_id: imported.conversation.conversation_id,
    original_language: "en",
    translated_language: "es",
    content: "Necesitamos confirmar el contrapartida del condado para la subvención de planificación CDBG.",
  });

  conversationRuntime.meetings.store({
    conversation_id: imported.conversation.conversation_id,
    human_id: HUMAN,
    institution_id: INSTITUTION,
    title: "County Immersion Planning Session",
    agenda: ["County update", "Grant timeline", "Volunteer coordination"],
    attendance: ["usr-001", "usr-003"],
  });

  conversationRuntime.decisions.detect({
    conversation_id: imported.conversation.conversation_id,
    human_id: HUMAN,
    institution_id: INSTITUTION,
    summary: "Defer final grant application until county match is confirmed.",
    decision_type: "deferred",
    evidence: ["Transcript 00:05-00:15"],
  });

  conversationRuntime.commitments.detect({
    conversation_id: imported.conversation.conversation_id,
    human_id: HUMAN,
    institution_id: INSTITUTION,
    commitment_text: "Partner will follow up with county clerk by Friday",
    assignee_id: "partner-county-liaison",
    deadline: "2026-07-18",
    evidence: ["Transcript 00:12"],
  });

  conversationRuntime.actions.suggest({
    conversation_id: imported.conversation.conversation_id,
    human_id: HUMAN,
    institution_id: INSTITUTION,
    action_type: "research_request",
    title: "Verify CDBG county match requirement",
    description: "Research Network should confirm official match percentage from county records.",
  });

  conversationRuntime.dialogue.link({
    institution_id: INSTITUTION,
    node_type: "meeting",
    label: "County Immersion Planning Session",
    reference_id: imported.conversation.conversation_id,
    linked_nodes: ["msn-block-street-001"],
  });

  conversationRuntime.dialogue.link({
    institution_id: INSTITUTION,
    node_type: "topic",
    label: "CDBG county match",
    reference_id: "topic-cdbg-match",
    linked_nodes: [imported.conversation.conversation_id],
  });

  return true;
}
