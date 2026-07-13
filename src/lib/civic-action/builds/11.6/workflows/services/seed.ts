/**
 * CAE-11.6-W9 — Seed workflow defaults
 */
import { nowIso } from "../../../../utils";
import { seedExecutiveIfEmpty } from "../../executive/services/seed";
import { readStoreSlice } from "./repository";
import { WORKFLOW_STORE_KEYS } from "../data-model";
import type { WorkflowStep, WorkflowTemplateRecord, WorkflowTrigger } from "../data-model";
import { saveTemplate, saveWorkflow } from "./repository";

const NOW = nowIso();
const INSTITUTION = "inst-block-street";

const volunteerOnboardingSteps: WorkflowStep[] = [
  { step_id: "vo-1", action_type: "notify_users", config: { title: "Welcome new volunteer", body: "Onboarding started" }, approval_required: false },
  { step_id: "vo-2", action_type: "assign_human", config: { human_id: "usr-001", role: "volunteer", mission_id: "opm-volunteer-training-001" }, approval_required: false },
  { step_id: "vo-3", action_type: "create_task", config: { title: "Complete orientation", mission_id: "opm-volunteer-training-001" }, approval_required: true, approval_type: "single_approval" },
  { step_id: "vo-4", action_type: "schedule_event", config: { title: "Orientation session" }, approval_required: false },
];

const volunteerOnboardingTriggers: WorkflowTrigger[] = [
  { trigger_type: "volunteer_registered", config: {} },
  { trigger_type: "manual_trigger", config: {} },
];

export function seedWorkflowsIfEmpty() {
  seedExecutiveIfEmpty();
  if (readStoreSlice(WORKFLOW_STORE_KEYS.workflows).length > 0) return false;

  const template: WorkflowTemplateRecord = {
    template_id: "wft-volunteer-onboarding",
    institution_id: INSTITUTION,
    name: "New Volunteer Onboarding",
    description: "Automated onboarding for new volunteers with Human approval gate",
    category: "volunteer",
    default_steps: volunteerOnboardingSteps,
    default_triggers: volunteerOnboardingTriggers,
    created_at: NOW,
  };
  saveTemplate(template);

  saveWorkflow({
    workflow_id: "wfl-volunteer-onboarding",
    institution_id: INSTITUTION,
    name: "New Volunteer Onboarding",
    description: "Automated onboarding for new volunteers",
    category: "volunteer",
    status: "published",
    owner: "usr-001",
    created_by: "usr-001",
    version: 1,
    approval_level: "single_approval",
    risk_level: "low",
    automation_level: 3,
    effective_date: NOW,
    expiration_date: null,
    triggers: volunteerOnboardingTriggers,
    conditions: [{ expression: "volunteer.status == registered", operator: "if_then" }],
    steps: volunteerOnboardingSteps,
    textual_representation:
      'Workflow "New Volunteer Onboarding": WHEN [volunteer_registered, manual_trigger] THEN notify_users → assign_human → create_task [approval] → schedule_event',
    immutable_when_published: true,
    created_at: NOW,
    updated_at: NOW,
  });

  return true;
}
