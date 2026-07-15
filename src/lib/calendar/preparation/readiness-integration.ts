import type { CalendarEvent } from "../types";
import type { EventReadinessItem } from "../operations/types";
import { buildPreparationSummary } from "./checklist";
import { ensurePreparationFromEvent, preparationRequiredForEvent } from "./template-integration";
import { isPreparationReady } from "./status";
import { listPreparationItems } from "./store";

function eventRoute(eventId: string, suffix = ""): string {
  return `/calendar/event/${eventId}${suffix}`;
}

function isPublicFacing(event: CalendarEvent): boolean {
  return event.visibility === "public" || event.publication_status === "published" || event.publication_status === "ready_to_publish";
}

export function evaluateMaterialsReadiness(event: CalendarEvent, now: Date = new Date()): EventReadinessItem {
  const route = eventRoute(event.event_id, "/preparation/materials");
  if (event.operational_status === "completed" || event.operational_status === "canceled") {
    return { dimension: "materials", state: "not_required", label: "Materials", explanation: "Event closed.", route };
  }
  if (!preparationRequiredForEvent(event, "materials")) {
    return { dimension: "materials", state: "not_required", label: "Materials", explanation: "Materials checklist not required.", route };
  }
  ensurePreparationFromEvent(event);
  const summary = buildPreparationSummary(event.event_id);
  const hoursUntil = (new Date(event.start_at).getTime() - now.getTime()) / 36e5;
  const blocking = listPreparationItems({ eventId: event.event_id, category: "materials" }).filter(
    (i) => i.required && i.blocksReadiness && !isPreparationReady(i.itemStatus),
  );
  if (blocking.length > 0 && hoursUntil <= 48 && hoursUntil >= 0) {
    return {
      dimension: "materials",
      state: "blocked",
      label: "Materials",
      explanation: `Required materials not ready: ${blocking[0].label}`,
      blocker: blocking.map((b) => b.label).join("; "),
      route,
    };
  }
  if (summary.materialsReady >= summary.materialsTotal && summary.materialsTotal > 0) {
    return { dimension: "materials", state: "ready", label: "Materials", explanation: "Materials checklist complete (soft beta).", route };
  }
  return {
    dimension: "materials",
    state: "in_progress",
    label: "Materials",
    explanation: `${summary.materialsReady}/${summary.materialsTotal} materials ready.`,
    route,
  };
}

export function evaluatePromotionReadiness(event: CalendarEvent, now: Date = new Date()): EventReadinessItem {
  const route = eventRoute(event.event_id, "/preparation/promotion");
  if (!isPublicFacing(event)) {
    return { dimension: "promotion", state: "not_required", label: "Promotion", explanation: "Internal event — promotion not required.", route: eventRoute(event.event_id) };
  }
  if (event.operational_status === "completed" || event.operational_status === "canceled") {
    return { dimension: "promotion", state: "not_required", label: "Promotion", explanation: "Event closed.", route };
  }
  ensurePreparationFromEvent(event);
  const summary = buildPreparationSummary(event.event_id);
  const hoursUntil = (new Date(event.start_at).getTime() - now.getTime()) / 36e5;
  const blocking = listPreparationItems({ eventId: event.event_id, category: "promotion" }).filter(
    (i) => i.required && !isPreparationReady(i.itemStatus),
  );
  if (blocking.length > 0 && hoursUntil <= 72 && hoursUntil >= 0) {
    return {
      dimension: "promotion",
      state: "blocked",
      label: "Promotion",
      explanation: `Promotion prep incomplete: ${blocking[0].label}`,
      blocker: blocking.map((b) => b.label).join("; "),
      route,
    };
  }
  if (summary.promotionReady >= summary.promotionTotal && summary.promotionTotal > 0) {
    return {
      dimension: "promotion",
      state: event.publication_status === "published" ? "ready" : "in_progress",
      label: "Promotion",
      explanation: event.publication_status === "published" ? "Published with promotion checklist ready." : "Promotion checklist ready — publication pending.",
      route,
    };
  }
  if (summary.promotionTotal === 0) {
    return { dimension: "promotion", state: "not_started", label: "Promotion", explanation: "Public event without promotion checklist.", route };
  }
  return {
    dimension: "promotion",
    state: "in_progress",
    label: "Promotion",
    explanation: `${summary.promotionReady}/${summary.promotionTotal} promotion items ready.`,
    route,
  };
}
