/**
 * CAE-11.1-W5 — Initiative event catalog registry
 */
import catalog from "../../../../../../data/phase-11/initiative_event_catalog.json";
import { INITIATIVE_DOMAIN_EVENT_TYPES } from "../services/events";

export type InitiativeEventCatalogEntry = (typeof catalog.events)[number];

export function getInitiativeEventCatalog() {
  return catalog;
}

export function getCatalogEntry(eventType: string): InitiativeEventCatalogEntry | undefined {
  return catalog.events.find((e) => e.event_type === eventType);
}

export function assertCatalogCoversProducers() {
  const catalogTypes = new Set(catalog.events.map((e) => e.event_type));
  const missing = INITIATIVE_DOMAIN_EVENT_TYPES.filter((t) => !catalogTypes.has(t));
  return { complete: missing.length === 0, missing };
}
