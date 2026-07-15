import gateAStatusJson from "../../../../data/calendar/certification/CAL-P1/gate-a/status.json";
import { getCalendarPersistenceConfig } from "../persistence/config";
import type { CalendarRbacMode } from "./types";

export function getGateAStatus() {
  return gateAStatusJson;
}

export function getCalendarRbacMode(): CalendarRbacMode {
  const mode = getCalendarPersistenceConfig().rbacMode;
  if (mode === "disabled" || mode === "audit_only" || mode === "enforced") return mode;
  return "audit_only";
}

/** Hard guard: enforcement blocked while Gate A open OR mode is not enforced. */
export function isRbacEnforcementBlocked(): boolean {
  if (getGateAStatus().verdict !== "CLOSED") return true;
  return getCalendarRbacMode() !== "enforced";
}

export function isDisabledModeWarningRequired(): boolean {
  return getCalendarRbacMode() === "disabled";
}

export function canActivateEnforcement(): boolean {
  return getGateAStatus().verdict === "CLOSED" && getCalendarRbacMode() === "enforced";
}
