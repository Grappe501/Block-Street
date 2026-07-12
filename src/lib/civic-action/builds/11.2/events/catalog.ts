/**
 * CAE-11.2-W5 — Objective event catalog registry
 */
import catalog from "../../../../../../data/phase-11/objective_event_catalog.json";
import { EXECUTION_DOMAIN_EVENT_TYPES } from "../services/events";

export type ObjectiveEventCatalogEntry = (typeof catalog.events)[number];

export function getObjectiveEventCatalog() {
  return catalog;
}

export function getCatalogEntry(eventType: string): ObjectiveEventCatalogEntry | undefined {
  return catalog.events.find((e) => e.event_type === eventType);
}

export function assertCatalogCoversProducers() {
  const catalogTypes = new Set(catalog.events.map((e) => e.event_type));
  const missing = EXECUTION_DOMAIN_EVENT_TYPES.filter((t) => !catalogTypes.has(t));
  return { complete: missing.length === 0, missing };
}
