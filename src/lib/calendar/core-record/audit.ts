import { appendCoreRecordAudit } from "./store";

export function recordCoreRecordAudit(input: {
  entityType: "core_record";
  entityId: string;
  eventId: string;
  action: string;
  previousStatus?: string | null;
  nextStatus?: string | null;
  actorUserId?: string | null;
}): void {
  appendCoreRecordAudit(input);
}
