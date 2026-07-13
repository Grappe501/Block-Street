/**
 * CAE-11.12-W5 — Knowledge event catalog registry
 */
import catalog from "../../../../../../data/phase-11/knowledge_event_catalog.json";
import { KNOWLEDGE_DOMAIN_EVENT_TYPES } from "../services/events";

export type KnowledgeEventCatalogEntry = (typeof catalog.events)[number];

export function getKnowledgeEventCatalog() {
  return catalog;
}

export function getCatalogEntry(eventType: string): KnowledgeEventCatalogEntry | undefined {
  return catalog.events.find((e) => e.event_type === eventType);
}

export function assertCatalogCoversProducers() {
  const catalogTypes = new Set(catalog.events.map((e) => e.event_type));
  const missing = KNOWLEDGE_DOMAIN_EVENT_TYPES.filter((t) => !catalogTypes.has(t));
  return { complete: missing.length === 0, missing };
}
