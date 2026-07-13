/**
 * CAE-11.7-W12 — Seed automation defaults
 */
import { seedFederationIfEmpty } from "../../federation/services/seed";
import { readStoreSlice } from "./repository";
import { AUTOMATION_STORE_KEYS } from "../data-model";
import { automationRuntime } from "./automation-service";

const HUMAN = "usr-001";
const INSTITUTION = "inst-block-street";

export function seedAutomationIfEmpty() {
  seedFederationIfEmpty();
  if (readStoreSlice(AUTOMATION_STORE_KEYS.workflows).length > 0) return false;

  const workflow = automationRuntime.registry.register({
    institution_id: INSTITUTION,
    name: "Volunteer Onboarding",
    owner: HUMAN,
    category: "operations",
    purpose: "Onboard new volunteers with checklist and training enrollment",
    risk_level: "medium",
    automation_level: 2,
    approval_requirements: ["supervisor"],
  });

  automationRuntime.playbooks.create({
    institution_id: INSTITUTION,
    name: "County Immersion Launch",
    category: "campaign",
    description: "Reusable playbook for launching county immersion programs",
    workflow_id: workflow.workflow.workflow_id,
  });

  automationRuntime.integrations.connect({
    institution_id: INSTITUTION,
    system: "calendar",
    approved_by_human: true,
  });

  automationRuntime.scheduler.schedule({
    workflow_id: workflow.workflow.workflow_id,
    institution_id: INSTITUTION,
    trigger_type: "recurring",
    authorized: true,
  });

  automationRuntime.engine.start({
    human_id: HUMAN,
    institution_id: INSTITUTION,
    workflow_id: workflow.workflow.workflow_id,
    approved_by_human: true,
  });

  return true;
}
