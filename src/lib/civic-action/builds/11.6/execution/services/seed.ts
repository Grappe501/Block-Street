/**
 * CAE-11.6-W2 — Seed operational mission defaults
 */
import { caeId, nowIso } from "../../../../utils";
import { seedStrategicPlanningIfEmpty } from "../../services/seed";
import { readStoreSlice } from "./repository";
import { EXECUTION_STORE_KEYS } from "../data-model";
import type { ChecklistItemRecord, MissionTaskRecord, OperationalMissionRecord } from "../data-model";
import { saveChecklistItem, saveOperationalMission, saveTask } from "./repository";

const INSTITUTION = "inst-block-street";

export function seedOperationalMissionsIfEmpty() {
  seedStrategicPlanningIfEmpty();
  if (readStoreSlice(EXECUTION_STORE_KEYS.operational_missions).length > 0) return false;

  const now = nowIso();
  const mission: OperationalMissionRecord = {
    mission_id: "opm-volunteer-training-001",
    institution_id: INSTITUTION,
    vision_id: "str-vision-001",
    mission_statement_id: "str-mission-001",
    pillar_id: "str-pillar-edu",
    strategic_goal_id: "str-goal-001",
    objective_id: "str-obj-001",
    key_result_id: "str-kr-001",
    program_id: "str-program-001",
    project_id: "str-project-001",
    title: "Volunteer Training Mission",
    description: "Prepare volunteers for county immersion activities",
    purpose: "Increase volunteer readiness and competency",
    desired_outcome: "Certified volunteers ready for field missions",
    status: "in_progress",
    priority: "high",
    classification: "training",
    visibility: "internal",
    created_by: "usr-001",
    mission_owner: "usr-001",
    executive_owner: "usr-001",
    start_date: now,
    target_completion: now,
    actual_completion: null,
    estimated_effort_hours: 40,
    actual_effort_hours: 12,
    confidence: 0.8,
    risk_level: "low",
    success_definition: "All required tasks and checklist items complete",
    failure_definition: "Volunteers deploy without required training",
    budget_reference: null,
    calendar_reference: null,
    health: "healthy",
    template_id: null,
    created_at: now,
    updated_at: now,
    version: 1,
  };
  saveOperationalMission(mission);

  const tasks: MissionTaskRecord[] = [
    {
      task_id: caeId("tsk"),
      mission_id: mission.mission_id,
      activity_id: null,
      title: "Develop training curriculum",
      description: "Align curriculum with competency requirements",
      owner: "usr-001",
      status: "completed",
      estimated_time_minutes: 240,
      actual_time_minutes: 200,
      priority: "high",
      due_date: now,
      dependencies: [],
      completion_rules: "Curriculum approved by mission lead",
      created_at: now,
      updated_at: now,
    },
    {
      task_id: caeId("tsk"),
      mission_id: mission.mission_id,
      activity_id: null,
      title: "Schedule training sessions",
      description: "Book venues and notify volunteers",
      owner: "usr-001",
      status: "in_progress",
      estimated_time_minutes: 120,
      actual_time_minutes: 30,
      priority: "medium",
      due_date: now,
      dependencies: [],
      completion_rules: "All sessions on calendar",
      created_at: now,
      updated_at: now,
    },
  ];
  for (const t of tasks) saveTask(t);

  const checklist: ChecklistItemRecord[] = [
    {
      item_id: caeId("chk"),
      mission_id: mission.mission_id,
      title: "Training materials distributed",
      required: true,
      completed: true,
      completed_by: "usr-001",
      completed_at: now,
      verification_required: false,
    },
    {
      item_id: caeId("chk"),
      mission_id: mission.mission_id,
      title: "Attendance records collected",
      required: true,
      completed: false,
      completed_by: null,
      completed_at: null,
      verification_required: true,
    },
  ];
  for (const c of checklist) saveChecklistItem(c);

  return true;
}
