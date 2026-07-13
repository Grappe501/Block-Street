/**
 * CAE-11.6-W8 — Executive command center data model
 */
import type { ALERT_PRIORITY_LEVELS, EXECUTIVE_ROLES } from "./constitution";

export type ExecutiveRole = (typeof EXECUTIVE_ROLES)[number];
export type AlertPriority = (typeof ALERT_PRIORITY_LEVELS)[number];

export interface ExecutiveBriefingRecord {
  briefing_id: string;
  institution_id: string;
  executive_human_id: string;
  executive_role: ExecutiveRole;
  briefing_type: "morning" | "evening" | "on_demand";
  mission_status: string;
  strategic_progress: string;
  critical_risks: string[];
  pending_decisions: number;
  ai_summary: string;
  generated_at: string;
}

export interface ExecutiveAlertRecord {
  alert_id: string;
  institution_id: string;
  priority: AlertPriority;
  title: string;
  what_happened: string;
  why_it_matters: string;
  affected_mission_ids: string[];
  recommended_actions: string[];
  evidence_refs: string[];
  ai_confidence: number;
  resolved: boolean;
  created_at: string;
}

export interface ExecutiveDecisionRecord {
  decision_id: string;
  institution_id: string;
  question: string;
  context: string;
  evidence: string[];
  options: string[];
  recommendation: string;
  mission_impact: string;
  financial_impact: string;
  risk_analysis: string;
  status: "awaiting_approval" | "approved" | "denied" | "escalated";
  assigned_to: string;
  approved_by: string | null;
  created_at: string;
}

export interface InstitutionHealthRecord {
  health_id: string;
  institution_id: string;
  mission_completion: number;
  assignment_progress: number;
  budget_health: number;
  organization_health: number;
  workforce_capacity: number;
  communication_health: number;
  decision_velocity: number;
  institutional_readiness: number;
  explanation: string;
  computed_at: string;
}

export interface ScenarioRecord {
  scenario_id: string;
  institution_id: string;
  title: string;
  hypothesis: string;
  parameters: Record<string, string>;
  impact_summary: string;
  status: "draft" | "analyzed" | "approved";
  live_data_altered: false;
  created_by: string;
  created_at: string;
}

export interface WarRoomRecord {
  war_room_id: string;
  institution_id: string;
  title: string;
  purpose: "campaign" | "emergency" | "election_day" | "crisis" | "legislative_session" | "custom";
  status: "active" | "closed";
  mission_ids: string[];
  participant_human_ids: string[];
  opened_by: string;
  opened_at: string;
  closed_at: string | null;
}

export interface ExecutiveTimelineEntry {
  entry_id: string;
  institution_id: string;
  entry_type: "decision" | "mission_milestone" | "leadership_change" | "financial" | "strategic_review" | "knowledge";
  title: string;
  description: string;
  occurred_at: string;
  reference_id: string | null;
}

export const EXECUTIVE_STORE_KEYS = {
  briefings: "ops_executive_briefings",
  alerts: "ops_executive_alerts",
  decisions: "ops_executive_decisions",
  institution_health: "ops_institution_health",
  scenarios: "ops_executive_scenarios",
  war_rooms: "ops_war_rooms",
  timeline: "ops_executive_timeline",
} as const;
