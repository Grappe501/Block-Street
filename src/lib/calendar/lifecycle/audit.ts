import { appendLifecycleAudit } from "./store";

export function recordLifecycleAudit(input: {
  entityType: "lifecycle";
  entityId: string;
  eventId: string;
  action: string;
  previousStatus?: string | null;
  nextStatus?: string | null;
  actorUserId?: string | null;
}): void {
  appendLifecycleAudit(input);
}
