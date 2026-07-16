import { appendConflictAudit } from "./store";

export function recordConflictAudit(input: {
  entityType: "conflict";
  entityId: string;
  eventId?: string | null;
  action: string;
  previousStatus?: string | null;
  nextStatus?: string | null;
  actorUserId?: string | null;
}): void {
  appendConflictAudit(input);
}
