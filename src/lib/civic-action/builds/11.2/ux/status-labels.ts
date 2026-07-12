/**
 * CAE-11.2-W4 — Status labels
 */
import type { CanonicalObjectiveStatus } from "../data-model";
import { t } from "./locale";

export function objectiveStatusLabel(status: CanonicalObjectiveStatus, locale: "en" | "es" = "en"): string {
  return t(locale, `status.${status}`);
}

export function objectiveHealthLabel(status: CanonicalObjectiveStatus, locale: "en" | "es" = "en"): string {
  if (["on_track", "active"].includes(status)) return t(locale, "health.on_track");
  if (["needs_attention", "proposed", "approved", "ready"].includes(status)) return t(locale, "health.needs_attention");
  if (status === "at_risk") return t(locale, "health.at_risk");
  if (status === "draft") return t(locale, "health.draft");
  return objectiveStatusLabel(status, locale);
}

export function objectiveTypeLabel(type: string): string {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function missionStatusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
