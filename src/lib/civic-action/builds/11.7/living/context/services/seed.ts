/**
 * CAE-11.7-W2 — Seed context intelligence defaults
 */
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { contextRegistryService, contextIntelligenceRuntime } from "./context-intelligence-service";
import { readStoreSlice } from "./repository";
import { CONTEXT_STORE_KEYS } from "../data-model";
import {
  saveActiveContext,
  saveCalendarContext,
  saveInstitutionContext,
  saveWorkContext,
} from "./repository";

const HUMAN = "usr-001";
const LOCALBRAIN = "lbr-usr-001";
const INSTITUTION = "inst-block-street";
const NOW = new Date().toISOString();

export function seedContextIfEmpty() {
  seedLocalBrainIfEmpty();
  contextRegistryService.initialize();
  if (readStoreSlice(CONTEXT_STORE_KEYS.active).length > 0) return false;

  saveInstitutionContext({
    institution_context_id: "ict-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    institution_id: INSTITUTION,
    membership_id: `mem-${HUMAN}-${INSTITUTION}`,
    active_role_id: "role-executive",
    organization_unit_id: "org-block-street",
    permission_snapshot_reference: "perm-snap-001",
    entered_at: NOW,
    exit_at: null,
    selection_method: "restored",
    confidence: 0.95,
    status: "active",
  });

  saveActiveContext({
    active_context_id: "act-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    stack_role: "primary",
    active_institution_id: INSTITUTION,
    active_organization_unit_id: "org-block-street",
    active_role_id: "role-executive",
    active_mission_id: "msn-block-street-001",
    active_objective_id: null,
    active_task_id: "task-volunteer-briefing",
    active_calendar_event_id: "evt-partner-meeting",
    active_meeting_id: null,
    active_conversation_id: null,
    active_learning_session_id: null,
    active_resource_id: null,
    active_location_context_id: null,
    active_device_session_id: null,
    attention_mode: "available",
    context_started_at: NOW,
    context_expires_at: new Date(Date.now() + 4 * 3600000).toISOString(),
    confidence: 0.92,
    authority_level: "human_declared",
    source_references: ["human_selection", "mission_assignment"],
    last_confirmed_at: NOW,
    status: "active",
    created_at: NOW,
    updated_at: NOW,
  });

  saveWorkContext({
    work_context_id: "wctx-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    mission_id: "msn-block-street-001",
    assignment_id: `asgn-${HUMAN}`,
    task_id: "task-volunteer-briefing",
    strategic_objective_id: "obj-county-immersion",
    role_in_mission: "mission_lead",
    current_status: "in_progress",
    priority: "high",
    due_at: new Date(Date.now() + 45 * 60000).toISOString(),
    blocked_by: [],
    relevant_resources: ["doc-attendance-sheet"],
    relevant_people: ["usr-002"],
    relevant_knowledge: ["kb-volunteer-training"],
    context_confidence: 0.88,
    started_at: NOW,
    expires_at: null,
  });

  saveCalendarContext({
    calendar_context_id: "cctx-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    event_id: "evt-partner-meeting",
    event_type: "partner_meeting",
    start_at: new Date(Date.now() + 45 * 60000).toISOString(),
    end_at: new Date(Date.now() + 105 * 60000).toISOString(),
    time_zone: "America/Chicago",
    attendance_status: "scheduled",
    preparation_required: true,
    travel_required: false,
    linked_mission_id: "msn-block-street-001",
    context_state: "before",
    confidence: 0.85,
  });

  contextIntelligenceRuntime.nextAction.recommend({
    human_id: HUMAN,
    localbrain_id: LOCALBRAIN,
    context_reference: "task-volunteer-briefing",
    action: "Review updated attendance sheet before finalizing briefing",
    why_now: "Document updated since last view; meeting in 45 minutes",
    evidence: ["doc-attendance-sheet-updated", "calendar-45min-window"],
    confidence: 0.82,
  });

  return true;
}
