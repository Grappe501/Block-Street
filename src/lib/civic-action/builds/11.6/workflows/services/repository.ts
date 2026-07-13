/**
 * CAE-11.6-W9 — Workflow persistence
 */
export { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import { readStoreSlice, writeStoreSlice } from "../../../11.1/services/repository";
import type {
  WorkflowApprovalRecord,
  WorkflowAuditRecord,
  WorkflowExecutionRecord,
  WorkflowRecord,
  WorkflowTemplateRecord,
} from "../data-model";
import { WORKFLOW_STORE_KEYS } from "../data-model";

function upsertById<T>(key: string, record: T, idField: keyof T & string) {
  const items = readStoreSlice<T>(key);
  const id = String(record[idField]);
  const idx = items.findIndex((i) => String(i[idField]) === id);
  if (idx >= 0) items[idx] = record;
  else items.push(record);
  writeStoreSlice(key, items);
}

export function listWorkflows(institutionId: string, status?: WorkflowRecord["status"]) {
  return readStoreSlice<WorkflowRecord>(WORKFLOW_STORE_KEYS.workflows).filter(
    (w) => w.institution_id === institutionId && (!status || w.status === status)
  );
}

export function getWorkflow(workflowId: string) {
  return readStoreSlice<WorkflowRecord>(WORKFLOW_STORE_KEYS.workflows).find((w) => w.workflow_id === workflowId) ?? null;
}

export function saveWorkflow(record: WorkflowRecord) {
  upsertById(WORKFLOW_STORE_KEYS.workflows, record, "workflow_id");
}

export function listExecutions(institutionId: string, status?: WorkflowExecutionRecord["status"]) {
  return readStoreSlice<WorkflowExecutionRecord>(WORKFLOW_STORE_KEYS.executions).filter(
    (e) => e.institution_id === institutionId && (!status || e.status === status)
  );
}

export function getExecution(executionId: string) {
  return readStoreSlice<WorkflowExecutionRecord>(WORKFLOW_STORE_KEYS.executions).find((e) => e.execution_id === executionId) ?? null;
}

export function saveExecution(record: WorkflowExecutionRecord) {
  upsertById(WORKFLOW_STORE_KEYS.executions, record, "execution_id");
}

export function listApprovals(institutionId: string, status?: WorkflowApprovalRecord["status"]) {
  return readStoreSlice<WorkflowApprovalRecord>(WORKFLOW_STORE_KEYS.approvals).filter(
    (a) => (!institutionId || a.institution_id === institutionId) && (!status || a.status === status)
  );
}

export function getApproval(approvalId: string) {
  return readStoreSlice<WorkflowApprovalRecord>(WORKFLOW_STORE_KEYS.approvals).find((a) => a.approval_id === approvalId) ?? null;
}

export function saveApproval(record: WorkflowApprovalRecord) {
  upsertById(WORKFLOW_STORE_KEYS.approvals, record, "approval_id");
}

export function listTemplates(institutionId: string) {
  return readStoreSlice<WorkflowTemplateRecord>(WORKFLOW_STORE_KEYS.templates).filter((t) => t.institution_id === institutionId);
}

export function saveTemplate(record: WorkflowTemplateRecord) {
  upsertById(WORKFLOW_STORE_KEYS.templates, record, "template_id");
}

export function listAudit(institutionId: string, workflowId?: string) {
  return readStoreSlice<WorkflowAuditRecord>(WORKFLOW_STORE_KEYS.audit).filter(
    (a) => a.institution_id === institutionId && (!workflowId || a.workflow_id === workflowId)
  );
}

export function saveAudit(record: WorkflowAuditRecord) {
  upsertById(WORKFLOW_STORE_KEYS.audit, record, "audit_id");
}
