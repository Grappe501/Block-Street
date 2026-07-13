/**
 * CAE-11.7-W1 — Seed LocalBrain defaults
 */
import { nowIso } from "../../../../../utils";
import { readStoreSlice } from "./repository";
import { LOCALBRAIN_STORE_KEYS } from "../data-model";
import {
  saveCalendarMemory,
  saveContextRuntime,
  saveInstitutionConnection,
  saveKnowledgeNode,
  saveLearningMemory,
  saveLocalBrain,
  saveMemory,
  savePreferences,
  saveRelationshipMemory,
  saveTimelineEntry,
  saveWorkingMemory,
  saveWorkspaceMemory,
} from "./repository";

const NOW = nowIso();
const HUMAN = "usr-001";
const LOCALBRAIN = "lbr-usr-001";
const INSTITUTION = "inst-block-street";

export function seedLocalBrainIfEmpty() {
  if (readStoreSlice(LOCALBRAIN_STORE_KEYS.brains).length > 0) return false;

  saveLocalBrain({
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    brain_version: "11.7-w1.1",
    status: "active",
    primary_language: "en",
    secondary_languages: ["es"],
    timezone: "America/Chicago",
    preferred_voice: "neutral",
    assistant_personality: "professional",
    privacy_level: "strict",
    memory_policy: "human_promotion_required",
    sync_policy: "encrypted_cloud",
    created_at: NOW,
    updated_at: NOW,
  });

  saveMemory({
    memory_id: "mem-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    tier: "long_term",
    category: "personal",
    title: "Leadership development goal",
    content: "Complete executive readiness certification",
    privacy_domain: "private",
    institution_id: null,
    reference: null,
    expires_at: null,
    promoted_from: null,
    searchable: true,
    created_at: NOW,
    updated_at: NOW,
  });

  saveWorkingMemory({
    snapshot_id: "wkm-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    current_mission_id: "msn-block-street-001",
    current_meeting_id: null,
    current_task_id: null,
    current_document_id: null,
    current_conversation_id: null,
    current_calendar_block_id: null,
    current_research_id: null,
    current_goal_id: "goal-leadership-001",
    updated_at: NOW,
  });

  saveContextRuntime({
    context_id: "ctx-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    institution_id: INSTITUTION,
    mission_id: "msn-block-street-001",
    calendar_event_id: null,
    organization_id: "org-block-street",
    conversation_id: null,
    learning_session_id: null,
    executive_priority: "Q3 mission readiness",
    device: "laptop",
    timezone: "America/Chicago",
    priorities: ["Mission execution", "Team coordination"],
    deadlines: ["2026-07-20"],
    updated_at: NOW,
  });

  saveTimelineEntry({
    entry_id: "tl-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    period: "today",
    category: "mission",
    title: "Mission planning session",
    occurred_at: NOW,
    institution_id: INSTITUTION,
  });

  saveKnowledgeNode({
    node_id: "kg-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    node_type: "organization",
    label: "Block Street Coalition",
    links: ["kg-lbr-002"],
    created_at: NOW,
  });

  saveInstitutionConnection({
    connection_id: "con-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    institution_id: INSTITUTION,
    institution_type: "campaign",
    roles: ["executive", "volunteer"],
    trust_level: "verified",
    connected_at: NOW,
  });

  saveWorkspaceMemory({
    workspace_memory_id: "wsp-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    favorite_dashboards: ["executive", "missions"],
    pinned_missions: ["msn-block-street-001"],
    preferred_reports: ["readiness", "weekly-progress"],
    frequent_searches: ["volunteer schedule", "mission status"],
    workspace_layout: { sidebar: "collapsed", theme: "system" },
    recent_organizations: [INSTITUTION],
    updated_at: NOW,
  });

  saveRelationshipMemory({
    relationship_id: "rel-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    contact_human_id: "usr-002",
    relationship_type: "team",
    interaction_count: 12,
    last_interaction_at: NOW,
  });

  saveCalendarMemory({
    calendar_memory_id: "cal-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    working_hours: { start: "08:00", end: "18:00" },
    meeting_preferences: ["morning", "30min_buffer"],
    travel_patterns: ["local_weekdays"],
    preparation_buffer_minutes: 15,
    recovery_time_minutes: 10,
    updated_at: NOW,
  });

  saveLearningMemory({
    learning_memory_id: "lrn-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    completed_courses: ["leadership-101"],
    competencies: ["mission-planning", "volunteer-coordination"],
    certifications: ["operations-readiness"],
    preferred_style: "hands_on",
    knowledge_gaps: ["advanced analytics"],
    future_goals: ["executive certification"],
    updated_at: NOW,
  });

  savePreferences({
    preferences_id: "prf-lbr-001",
    localbrain_id: LOCALBRAIN,
    human_id: HUMAN,
    notifications: { mission_updates: true, meeting_reminders: true },
    accessibility: { high_contrast: false, screen_reader: false },
    language: "en",
    updated_at: NOW,
  });

  return true;
}
