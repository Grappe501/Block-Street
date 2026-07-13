/**
 * CAE-11.6-W14 — Seed experience defaults
 */
import { nowIso } from "../../../../utils";
import { seedImprovementIfEmpty } from "../../improvement/services/seed";
import { readStoreSlice } from "./repository";
import { EXPERIENCE_STORE_KEYS } from "../data-model";
import { saveExperienceMemory, savePersonalization, saveWorkspace } from "./repository";

const NOW = nowIso();
const INSTITUTION = "inst-block-street";
const HUMAN = "usr-001";

export function seedExperienceIfEmpty() {
  seedImprovementIfEmpty();
  if (readStoreSlice(EXPERIENCE_STORE_KEYS.workspaces).length > 0) return false;

  saveWorkspace({
    workspace_id: "wks-block-street-001",
    human_id: HUMAN,
    institution_id: INSTITUTION,
    workspace_type: "organizer",
    role: "organizer",
    current_mission_id: null,
    device: "laptop",
    language: "en",
    pinned_cards: ["todays_work", "upcoming_meeting"],
    preferences: { daily_focus: true },
    status: "active",
    created_at: NOW,
    updated_at: NOW,
  });

  saveExperienceMemory({
    memory_id: "mem-exp-001",
    human_id: HUMAN,
    institution_id: INSTITUTION,
    open_items: ["Review mission assignments"],
    favorite_tools: ["missions", "calendar", "search"],
    recent_missions: [],
    pinned_knowledge: [],
    recent_searches: ["community outreach"],
    preferred_views: ["dashboard"],
    updated_at: NOW,
  });

  savePersonalization({
    personalization_id: "per-block-street-001",
    institution_id: INSTITUTION,
    brand_name: "Block Street",
    logo_url: "/logo.svg",
    primary_color: "#1a56db",
    terminology: { mission: "Mission", volunteer: "Volunteer" },
    theme: "light",
    home_layout: "default",
    updated_at: NOW,
  });

  return true;
}
