import { itlId, nowIso } from "../utils";
import { loadWorkItems, persistWorkItems, loadWorkAssignments, persistWorkAssignments } from "./data";
import { recordOperationsAudit } from "./audit";
import type { IdentityWorkItem, OperationalRole, WorkItemStatus, WorkItemType } from "./types";
import { canPerformAction } from "./authority";

const PROHIBITED_SIGNAL_ACTIONS = [
  "Do not restrict membership based solely on this signal.",
  "Do not merge Humans based solely on this signal.",
  "Do not characterize this signal as confirmed fraud.",
];

const SLA_HOURS: Partial<Record<WorkItemType, number>> = {
  account_recovery: 1,
  intelligence_signal_review: 4,
  duplicate_candidate: 120,
  identity_appeal: 360,
  provisional_deadline: 48,
  verification_conflict: 72,
};

export function createWorkItem(input: {
  work_type: WorkItemType;
  source_type: string;
  source_id: string;
  subject_human_id?: string;
  institution_id?: string;
  summary: string;
  severity?: string;
  priority?: number;
  required_qualification?: string;
  required_authority?: OperationalRole;
  advisory_signal?: boolean;
  due_hours?: number;
}): IdentityWorkItem {
  const hours = input.due_hours ?? SLA_HOURS[input.work_type] ?? 72;
  const dueAt = new Date(Date.now() + hours * 3600000).toISOString();
  const item: IdentityWorkItem = {
    id: itlId("iwi"),
    work_type: input.work_type,
    source_type: input.source_type,
    source_id: input.source_id,
    subject_human_id: input.subject_human_id ?? null,
    institution_id: input.institution_id ?? null,
    federation_id: null,
    priority: input.priority ?? 3,
    severity: input.severity ?? "normal",
    status: "unassigned",
    summary: input.summary,
    required_qualification: input.required_qualification ?? input.work_type,
    required_authority: input.required_authority ?? "identity_reviewer",
    assigned_to_human_id: null,
    due_at: dueAt,
    escalation_at: new Date(Date.now() + Math.floor(hours * 0.75) * 3600000).toISOString(),
    created_at: nowIso(),
    completed_at: null,
    advisory_signal: input.advisory_signal ?? false,
    prohibited_actions: input.advisory_signal ? PROHIBITED_SIGNAL_ACTIONS : [],
  };

  const existing = loadWorkItems().find(
    (w) => w.source_type === item.source_type && w.source_id === item.source_id && !["closed", "cancelled", "resolved"].includes(w.status)
  );
  if (existing) return existing;

  const all = loadWorkItems();
  all.push(item);
  persistWorkItems(all);

  recordOperationsAudit({
    event_type: "work_item_created",
    actor_human_id: "system",
    subject_human_id: item.subject_human_id,
    institution_id: item.institution_id,
    resource_type: "work_item",
    resource_id: item.id,
    summary: `Work item created: ${item.summary}`,
    correlation_id: item.source_id,
  });

  return item;
}

export function listWorkItems(filters?: {
  status?: WorkItemStatus;
  assigned_to?: string;
  institution_id?: string;
  work_type?: WorkItemType;
  overdue?: boolean;
}) {
  let items = loadWorkItems();
  if (filters?.status) items = items.filter((i) => i.status === filters.status);
  if (filters?.assigned_to) items = items.filter((i) => i.assigned_to_human_id === filters.assigned_to);
  if (filters?.institution_id) items = items.filter((i) => i.institution_id === filters.institution_id);
  if (filters?.work_type) items = items.filter((i) => i.work_type === filters.work_type);
  if (filters?.overdue) {
    const now = nowIso();
    items = items.filter((i) => i.due_at && i.due_at < now && !["resolved", "closed", "cancelled"].includes(i.status));
  }
  return items.sort((a, b) => b.priority - a.priority || (a.due_at ?? "").localeCompare(b.due_at ?? ""));
}

export function getWorkItem(id: string) {
  return loadWorkItems().find((w) => w.id === id) ?? null;
}

export function assignWorkItem(workItemId: string, assigneeId: string, assignedBy: string): IdentityWorkItem {
  const items = loadWorkItems();
  const idx = items.findIndex((w) => w.id === workItemId);
  if (idx < 0) throw new Error("Work item not found");

  const item = items[idx];
  if (item.subject_human_id === assigneeId) {
    throw new Error("Reviewer cannot be the subject of the work item");
  }

  items[idx] = {
    ...item,
    status: "assigned",
    assigned_to_human_id: assigneeId,
  };
  persistWorkItems(items);

  const assignment = {
    id: itlId("iwa"),
    work_item_id: workItemId,
    assigned_to_human_id: assigneeId,
    assigned_by_human_id: assignedBy,
    assigned_at: nowIso(),
    conflict_cleared: item.subject_human_id !== assigneeId,
  };
  const assignments = loadWorkAssignments();
  assignments.push(assignment);
  persistWorkAssignments(assignments);

  recordOperationsAudit({
    event_type: "work_item_assigned",
    actor_human_id: assignedBy,
    subject_human_id: item.subject_human_id,
    institution_id: item.institution_id,
    resource_type: "work_item",
    resource_id: workItemId,
    summary: `Assigned to ${assigneeId}`,
    correlation_id: item.source_id,
  });

  return items[idx];
}

export function acknowledgeWorkItem(workItemId: string, actorId: string): IdentityWorkItem {
  return updateWorkItemStatus(workItemId, "acknowledged", actorId);
}

export function escalateWorkItem(workItemId: string, actorId: string, reason: string): IdentityWorkItem {
  const item = updateWorkItemStatus(workItemId, "escalated", actorId);
  recordOperationsAudit({
    event_type: "work_item_escalated",
    actor_human_id: actorId,
    subject_human_id: item.subject_human_id,
    institution_id: item.institution_id,
    resource_type: "work_item",
    resource_id: workItemId,
    summary: reason,
    correlation_id: item.source_id,
  });
  return item;
}

export function completeWorkItem(workItemId: string, actorId: string): IdentityWorkItem {
  const items = loadWorkItems();
  const idx = items.findIndex((w) => w.id === workItemId);
  if (idx < 0) throw new Error("Work item not found");
  items[idx] = { ...items[idx], status: "resolved", completed_at: nowIso() };
  persistWorkItems(items);
  recordOperationsAudit({
    event_type: "work_item_completed",
    actor_human_id: actorId,
    subject_human_id: items[idx].subject_human_id,
    institution_id: items[idx].institution_id,
    resource_type: "work_item",
    resource_id: workItemId,
    summary: "Work item resolved",
    correlation_id: items[idx].source_id,
  });
  return items[idx];
}

function updateWorkItemStatus(workItemId: string, status: WorkItemStatus, actorId: string): IdentityWorkItem {
  const items = loadWorkItems();
  const idx = items.findIndex((w) => w.id === workItemId);
  if (idx < 0) throw new Error("Work item not found");
  items[idx] = { ...items[idx], status };
  persistWorkItems(items);
  return items[idx];
}

export function processOverdueEscalations() {
  const now = nowIso();
  const items = loadWorkItems();
  let escalated = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (
      item.escalation_at &&
      item.escalation_at < now &&
      !["escalated", "resolved", "closed", "cancelled"].includes(item.status)
    ) {
      items[i] = { ...item, status: "escalated", priority: Math.min(item.priority + 1, 5) };
      escalated++;
    }
  }
  if (escalated > 0) persistWorkItems(items);
  return escalated;
}

export function assertOperatorMayAct(operatorId: string, action: string, operation: string) {
  if (!canPerformAction(operatorId, action)) {
    throw new Error(`Operator lacks authority for ${operation}`);
  }
}
