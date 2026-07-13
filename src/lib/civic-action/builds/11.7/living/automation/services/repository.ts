/**
 * CAE-11.7-W12 — Automation persistence
 */
import { readStoreSlice, writeStoreSlice } from "../../../../11.1/services/repository";
export { readStoreSlice, writeStoreSlice };
import type {
  ApprovalRecord,
  AutomationAnalyticsRecord,
  AutomationPermissionRecord,
  ExceptionRecord,
  IntegrationRecord,
  InterventionRecord,
  OperationalGovernanceRecord,
  PlaybookRecord,
  ScheduleRecord,
  WorkflowRecord,
  WorkflowRunRecord,
} from "../data-model";
import { AUTOMATION_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

function listByInstitution<T extends { institution_id: string }>(key: string, institutionId: string) {
  return readStoreSlice<T>(key).filter((r) => r.institution_id === institutionId);
}

export function listWorkflows(institutionId: string) {
  return listByInstitution<WorkflowRecord>(AUTOMATION_STORE_KEYS.workflows, institutionId);
}

export function saveWorkflow(record: WorkflowRecord) {
  upsertById(AUTOMATION_STORE_KEYS.workflows, record, "workflow_id");
}

export function listRuns(institutionId: string) {
  return listByInstitution<WorkflowRunRecord>(AUTOMATION_STORE_KEYS.runs, institutionId);
}

export function saveRun(record: WorkflowRunRecord) {
  upsertById(AUTOMATION_STORE_KEYS.runs, record, "run_id");
}

export function listApprovals(institutionId: string) {
  return listByInstitution<ApprovalRecord>(AUTOMATION_STORE_KEYS.approvals, institutionId);
}

export function saveApproval(record: ApprovalRecord) {
  upsertById(AUTOMATION_STORE_KEYS.approvals, record, "approval_id");
}

export function listAutomationPermissions(institutionId: string) {
  return listByInstitution<AutomationPermissionRecord>(AUTOMATION_STORE_KEYS.permissions, institutionId);
}

export function saveAutomationPermission(record: AutomationPermissionRecord) {
  upsertById(AUTOMATION_STORE_KEYS.permissions, record, "permission_id");
}

export function listPlaybooks(institutionId: string) {
  return listByInstitution<PlaybookRecord>(AUTOMATION_STORE_KEYS.playbooks, institutionId);
}

export function savePlaybook(record: PlaybookRecord) {
  upsertById(AUTOMATION_STORE_KEYS.playbooks, record, "playbook_id");
}

export function listSchedules(institutionId: string) {
  return listByInstitution<ScheduleRecord>(AUTOMATION_STORE_KEYS.schedules, institutionId);
}

export function saveSchedule(record: ScheduleRecord) {
  upsertById(AUTOMATION_STORE_KEYS.schedules, record, "schedule_id");
}

export function listExceptions(institutionId: string) {
  return listByInstitution<ExceptionRecord>(AUTOMATION_STORE_KEYS.exceptions, institutionId);
}

export function saveException(record: ExceptionRecord) {
  upsertById(AUTOMATION_STORE_KEYS.exceptions, record, "exception_id");
}

export function listInterventions(institutionId: string) {
  return listByInstitution<InterventionRecord>(AUTOMATION_STORE_KEYS.interventions, institutionId);
}

export function saveIntervention(record: InterventionRecord) {
  upsertById(AUTOMATION_STORE_KEYS.interventions, record, "intervention_id");
}

export function listAutomationAnalytics(institutionId: string) {
  return listByInstitution<AutomationAnalyticsRecord>(AUTOMATION_STORE_KEYS.analytics, institutionId);
}

export function saveAutomationAnalytics(record: AutomationAnalyticsRecord) {
  upsertById(AUTOMATION_STORE_KEYS.analytics, record, "analytics_id");
}

export function listOperationalGovernance(institutionId: string) {
  return listByInstitution<OperationalGovernanceRecord>(AUTOMATION_STORE_KEYS.governance, institutionId);
}

export function saveOperationalGovernance(record: OperationalGovernanceRecord) {
  upsertById(AUTOMATION_STORE_KEYS.governance, record, "governance_id");
}

export function listIntegrations(institutionId: string) {
  return listByInstitution<IntegrationRecord>(AUTOMATION_STORE_KEYS.integrations, institutionId);
}

export function saveIntegration(record: IntegrationRecord) {
  upsertById(AUTOMATION_STORE_KEYS.integrations, record, "integration_id");
}
