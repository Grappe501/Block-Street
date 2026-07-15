import { recordCalendarPolicyDecision } from "./audit";
import { denialMessageFor } from "./audit";
import { evaluatePolicy } from "./evaluate";
import type {
  CalendarActor,
  CalendarPermissionKey,
  CalendarPolicyContext,
  CalendarPolicyDecision,
  CalendarPolicyResource,
} from "./types";
import { defaultPolicyContext } from "./types";

export class CalendarAuthorizationError extends Error {
  decision: CalendarPolicyDecision;
  constructor(decision: CalendarPolicyDecision) {
    super(denialMessageFor(decision.reasonCode));
    this.name = "CalendarAuthorizationError";
    this.decision = decision;
  }
}

export function evaluateCalendarPermissionGuard(input: {
  actor: CalendarActor;
  permission: CalendarPermissionKey;
  resource?: CalendarPolicyResource;
  context?: Partial<CalendarPolicyContext>;
  actualBehavior?: "allowed" | "denied" | "unknown";
}): CalendarPolicyDecision {
  const context = defaultPolicyContext(input.context);
  const request = {
    actor: input.actor,
    permission: input.permission,
    resource: input.resource ?? {},
    context,
  };
  const decision = evaluatePolicy(request);
  recordCalendarPolicyDecision(request, decision, input.actualBehavior ?? "unknown");
  return decision;
}

/**
 * Server-side guard. In audit_only, never throws for policy deny.
 * Soft-beta write gates (CALENDAR_WRITE_ENABLED) remain separate.
 */
export function requireCalendarPermission(input: {
  actor: CalendarActor;
  permission: CalendarPermissionKey;
  resource?: CalendarPolicyResource;
  context?: Partial<CalendarPolicyContext>;
  actualBehavior?: "allowed" | "denied" | "unknown";
}): CalendarPolicyDecision {
  const decision = evaluateCalendarPermissionGuard(input);
  if (decision.should_block) {
    throw new CalendarAuthorizationError(decision);
  }
  return decision;
}

export function assertCalendarMutationAllowed(input: Parameters<typeof requireCalendarPermission>[0]): CalendarPolicyDecision {
  return requireCalendarPermission({
    ...input,
    context: { isMutation: true, ...(input.context ?? {}) },
  });
}

export { assertCalendarScope } from "./scopes";
export { filterCalendarEventForActor } from "./public-projection";
export { recordCalendarPolicyDecision };
