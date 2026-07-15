import type { CalendarEvent } from "../types";
import type { StaffingStatus } from "../types";
import { calculateEventStaffingSummary } from "./coverage";
import { ensureStaffingFromEvent } from "./template-integration";

export function deriveStaffingStatus(event: CalendarEvent): StaffingStatus {
  ensureStaffingFromEvent(event);
  const summary = calculateEventStaffingSummary(event.event_id);
  switch (summary.overallStatus) {
    case "not_required":
      return "staffing_not_required";
    case "no_plan":
      return "no_staffing_plan";
    case "critical_shortage":
      return "critical_shortage";
    case "fully_staffed":
      return "fully_staffed";
    case "minimum_staffed":
      return "nearly_staffed";
    case "overstaffed":
      return "fully_staffed";
    default:
      return "needs_volunteers";
  }
}

export const STAFFING_SOFT_BETA_DISCLOSURE =
  "Staffing tools are operating in soft beta. Volunteer interest and shift planning are not yet durable production assignments.";
