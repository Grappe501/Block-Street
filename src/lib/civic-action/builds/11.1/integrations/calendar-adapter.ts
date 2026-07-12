/**
 * CAE-11.1-W5 — Calendar adapter (schedules timing; does not mutate lifecycle)
 */
import { readStoreSlice, writeStoreSlice } from "../services/repository";
import type { InitiativeEventOutboxRecord } from "../services/events";
import { caeId, nowIso } from "../../../utils";

export type InitiativeCalendarLink = {
  link_id: string;
  initiative_id: string;
  operational_event_id: string;
  link_type: string;
  source: "initiative_domain_event";
  sync_direction: "initiative_to_calendar";
  status: "active";
  created_at: string;
};

const LINKS_KEY = "initiative_calendar_links";

const CALENDAR_EVENT_TYPES: Record<string, string> = {
  "initiative.submitted_for_review": "Initiative Approval Deadline",
  "initiative.activated": "Initiative Activation",
  "initiative.review_due": "Initiative Review",
  "initiative.closeout_started": "Initiative Closeout",
};

export function handleInitiativeCalendarEvent(record: InitiativeEventOutboxRecord) {
  const linkType = CALENDAR_EVENT_TYPES[record.event_type];
  if (!linkType) return null;

  const link: InitiativeCalendarLink = {
    link_id: caeId("icl"),
    initiative_id: record.initiative_id,
    operational_event_id: record.event_id,
    link_type: linkType,
    source: "initiative_domain_event",
    sync_direction: "initiative_to_calendar",
    status: "active",
    created_at: nowIso(),
  };

  const links = readStoreSlice<InitiativeCalendarLink>(LINKS_KEY);
  links.push(link);
  writeStoreSlice(LINKS_KEY, links);
  return link;
}
