/**
 * CAE-11.12-W5 — Mission evidence adapter (competency candidates, not auto-verify)
 */
import { caeId, nowIso } from "../../../utils";
import { readStoreSlice, writeStoreSlice } from "../services/repository";

export type MissionCompetencyEvidenceCandidate = {
  candidate_id: string;
  mission_id: string;
  human_id: string;
  institution_id: string;
  evidence_type: string;
  status: "pending_review";
  source_event_id: string;
  created_at: string;
  auto_verified: false;
};

const CANDIDATE_KEY = "knowledge_mission_evidence_candidates";

export function handleMissionEvidenceEvent(input: {
  event_type: string;
  event_id: string;
  entity_id: string;
  payload: Record<string, unknown>;
}) {
  if (input.event_type !== "execution.mission_completed" && input.event_type !== "knowledge.learning_completed") {
    return null;
  }

  const candidate: MissionCompetencyEvidenceCandidate = {
    candidate_id: caeId("kec"),
    mission_id: (input.payload.mission_id as string) ?? input.entity_id,
    human_id: (input.payload.human_id as string) ?? (input.payload.actor_human_id as string) ?? "",
    institution_id: (input.payload.institution_id as string) ?? "",
    evidence_type: "field_practice",
    status: "pending_review",
    source_event_id: input.event_id,
    created_at: nowIso(),
    auto_verified: false,
  };

  const items = readStoreSlice<MissionCompetencyEvidenceCandidate>(CANDIDATE_KEY);
  items.push(candidate);
  writeStoreSlice(CANDIDATE_KEY, items);
  return candidate;
}
