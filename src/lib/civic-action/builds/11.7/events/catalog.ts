/**
 * CAE-11.7-W5 — Communication event catalog registry
 */
import catalog from "../../../../../../data/phase-11/communication_event_catalog.json";
import { COMMUNICATION_DOMAIN_EVENT_TYPES } from "../services/events";

export type CommunicationEventCatalogEntry = (typeof catalog.events)[number];

export function getCommunicationEventCatalog() {
  return catalog;
}

export function getCatalogEntry(eventType: string): CommunicationEventCatalogEntry | undefined {
  return catalog.events.find((e) => e.event_type === eventType);
}

export function assertCatalogCoversProducers() {
  const catalogTypes = new Set(catalog.events.map((e) => e.event_type));
  const missing = COMMUNICATION_DOMAIN_EVENT_TYPES.filter((t) => !catalogTypes.has(t));
  return { complete: missing.length === 0, missing };
}
