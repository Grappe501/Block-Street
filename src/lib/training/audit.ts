import { appendAudit } from "./data";
import type { TrainingAuditEvent } from "./types";

export function recordTrainingAudit(input: Omit<TrainingAuditEvent, "id" | "timestamp">) {
  const event: TrainingAuditEvent = {
    ...input,
    id: `trn-aud-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
  };
  appendAudit(event);
  return event;
}
