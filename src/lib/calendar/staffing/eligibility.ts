import type { CalendarVolunteerTrainingStatus } from "./types";
import { listTrainingStatuses } from "./store";
import { getTrainingRequirement } from "./training-catalog";

export function isTrainingCurrent(status: CalendarVolunteerTrainingStatus | null): boolean {
  if (!status) return false;
  if (status.status === "verified" || status.status === "self_attested") {
    if (status.expiresAt && new Date(status.expiresAt) < new Date()) return false;
    return true;
  }
  if (status.status === "waived") return true;
  return false;
}

export function evaluateTrainingEligibility(
  userId: string,
  trainingKeys: string[],
): { eligible: boolean; missing: string[]; expired: string[] } {
  const statuses = listTrainingStatuses(userId);
  const missing: string[] = [];
  const expired: string[] = [];
  for (const key of trainingKeys) {
    const req = getTrainingRequirement(key);
    if (!req?.active) continue;
    const status = statuses.find((s) => s.trainingKey === key) ?? null;
    if (!status || status.status === "not_started" || status.status === "in_progress") {
      missing.push(key);
      continue;
    }
    if (status.status === "expired" || (status.expiresAt && new Date(status.expiresAt) < new Date())) {
      expired.push(key);
      continue;
    }
    if (!isTrainingCurrent(status)) missing.push(key);
  }
  return { eligible: missing.length === 0 && expired.length === 0, missing, expired };
}

export function trainingEligibilityLabel(
  userId: string,
  trainingKeys: string[],
): "unknown" | "eligible" | "missing_training" | "expired_training" {
  const { eligible, missing, expired } = evaluateTrainingEligibility(userId, trainingKeys);
  if (trainingKeys.length === 0) return "eligible";
  if (expired.length > 0) return "expired_training";
  if (missing.length > 0) return "missing_training";
  return eligible ? "eligible" : "unknown";
}
