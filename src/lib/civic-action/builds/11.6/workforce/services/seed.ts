/**
 * CAE-11.6-W3 — Seed workforce defaults
 */
import { caeId, nowIso } from "../../../../utils";
import { seedOperationalMissionsIfEmpty } from "../../execution/services/seed";
import { readStoreSlice } from "./repository";
import { WORKFORCE_STORE_KEYS } from "../data-model";
import type { AvailabilityProfileRecord, HumanWorkProfileRecord, WorkAssignmentRecord } from "../data-model";
import { saveAssignment, saveAvailabilityProfile, saveWorkProfile } from "./repository";

const INSTITUTION = "inst-block-street";
const NOW = nowIso();

export function seedWorkforceIfEmpty() {
  seedOperationalMissionsIfEmpty();
  if (readStoreSlice(WORKFORCE_STORE_KEYS.work_profiles).length > 0) return false;

  const profile: HumanWorkProfileRecord = {
    human_work_profile_id: "wfp-usr-001",
    human_id: "usr-001",
    institution_id: INSTITUTION,
    primary_role: "mission_lead",
    secondary_roles: ["mentor", "backup"],
    department: "Operations",
    team: "Field Operations",
    employment_type: "staff",
    volunteer_type: null,
    availability_profile_id: "avl-usr-001",
    preferred_work_types: ["training", "community"],
    current_capacity: 12,
    maximum_capacity: 40,
    capacity_unit: "hours",
    workload_level: "balanced",
    workforce_status: "available",
    time_zone: "America/Chicago",
    languages: ["en", "es"],
    certifications: ["volunteer-orientation"],
    competencies: ["facilitation", "volunteer-training"],
    interests: ["civic engagement"],
    growth_goals: ["Develop leadership skills"],
    status: "active",
    created_at: NOW,
    updated_at: NOW,
  };
  saveWorkProfile(profile);

  const availability: AvailabilityProfileRecord = {
    availability_profile_id: "avl-usr-001",
    human_id: "usr-001",
    institution_id: INSTITUTION,
    schedule_type: "weekly",
    weekly_hours_available: 20,
    emergency_available: true,
    temporary_override_until: null,
    calendar_sync_enabled: true,
    updated_at: NOW,
  };
  saveAvailabilityProfile(availability);

  const assignment: WorkAssignmentRecord = {
    assignment_id: "asg-001",
    institution_id: INSTITUTION,
    mission_id: "opm-volunteer-training-001",
    task_id: null,
    human_id: "usr-001",
    assigned_role: "primary_owner",
    assigned_by: "usr-001",
    assignment_reason: "Lead volunteer training mission",
    priority: "high",
    estimated_effort: 12,
    actual_effort: 4,
    required_competencies: ["volunteer-training"],
    required_certifications: ["volunteer-orientation"],
    status: "accepted",
    accepted_at: NOW,
    completed_at: null,
    strategic_goal_id: "str-goal-001",
    objective_id: "str-obj-001",
    created_at: NOW,
    updated_at: NOW,
  };
  saveAssignment(assignment);

  return true;
}
