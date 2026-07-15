import type { CalendarVerificationSummary } from "./types";
import { isVerificationComplete } from "./status";
import { listVerificationItems } from "./store";

export function buildVerificationSummary(eventId: string): CalendarVerificationSummary {
  const all = listVerificationItems({ eventId });
  const count = (cat: import("./types").VerificationCategory) => {
    const subset = all.filter((i) => i.category === cat);
    return {
      total: subset.length,
      verified: subset.filter((i) => isVerificationComplete(i.itemStatus)).length,
    };
  };
  const venue = count("venue");
  const campus = count("campus");
  const legal = count("legal");
  const accessibility = count("accessibility");
  const now = Date.now();
  const overdue = all.filter((i) => i.dueAt && new Date(i.dueAt).getTime() < now && !isVerificationComplete(i.itemStatus));
  const incompleteRequired = all.filter((i) => i.required && !isVerificationComplete(i.itemStatus));
  let readinessImpact: CalendarVerificationSummary["readinessImpact"] = "none";
  if (incompleteRequired.some((i) => i.blocksReadiness)) readinessImpact = "blocked";
  else if (incompleteRequired.length > 0 || overdue.length > 0) readinessImpact = "watch";

  return {
    eventId,
    venueTotal: venue.total,
    venueVerified: venue.verified,
    campusTotal: campus.total,
    campusVerified: campus.verified,
    legalTotal: legal.total,
    legalVerified: legal.verified,
    accessibilityTotal: accessibility.total,
    accessibilityVerified: accessibility.verified,
    incompleteRequired: incompleteRequired.length,
    overdueCount: overdue.length,
    readinessImpact,
    primaryGap: incompleteRequired[0]?.label ?? null,
  };
}

export function listVerificationRows(eventId: string, category?: import("./types").VerificationCategory) {
  return listVerificationItems({ eventId, category }).map((i) => ({
    itemId: i.itemId,
    category: i.category,
    label: i.label,
    required: i.required,
    status: i.itemStatus,
    dueAt: i.dueAt,
  }));
}
