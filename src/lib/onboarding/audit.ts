import { appendAudit } from "./data";
import type { OnboardingAuditEvent } from "./types";

export function recordOnboardingAudit(input: Omit<OnboardingAuditEvent, "id" | "timestamp">) {
  const event: OnboardingAuditEvent = {
    ...input,
    id: `onb-aud-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
  };
  appendAudit(event);
  return event;
}
