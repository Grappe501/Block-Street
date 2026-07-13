/**
 * CAE-11.6-W6 — Seed calendar defaults
 */
import { nowIso } from "../../../../utils";
import { seedResourcesIfEmpty } from "../../resources/services/seed";
import { readStoreSlice } from "./repository";
import { CALENDAR_STORE_KEYS } from "../data-model";
import type {
  AvailabilityRuleRecord,
  CalendarEventRecord,
  CanonicalCalendarRecord,
  DeadlineRecord,
} from "../data-model";
import { saveAvailabilityRule, saveCalendarEvent, saveCanonicalCalendar, saveDeadline } from "./repository";

const NOW = nowIso();
const INSTITUTION = "inst-block-street";
const MISSION = "opm-volunteer-training-001";
const CALENDAR_ID = "cal-inst-block-street";
const VAN = "res-field-van-001";

export function seedCalendarIfEmpty() {
  seedResourcesIfEmpty();
  if (readStoreSlice(CALENDAR_STORE_KEYS.calendars).length > 0) return false;

  const calendar: CanonicalCalendarRecord = {
    calendar_id: CALENDAR_ID,
    institution_id: INSTITUTION,
    calendar_type: "institutional",
    owner_human_id: "usr-001",
    visibility: "institution",
    time_zone: "America/Chicago",
    locale: "en-US",
    status: "active",
    created_at: NOW,
    updated_at: NOW,
  };
  saveCanonicalCalendar(calendar);

  const trainingEvent: CalendarEventRecord = {
    event_id: "evt-volunteer-training-kickoff",
    calendar_id: CALENDAR_ID,
    institution_id: INSTITUTION,
    event_type: "training",
    title: "Volunteer Training Kickoff",
    description: "Opening session for field volunteer training mission",
    start_time: "2026-08-15T09:00:00-05:00",
    end_time: "2026-08-15T12:00:00-05:00",
    time_zone: "America/Chicago",
    all_day: false,
    recurring: false,
    recurring_series_id: null,
    priority: "high",
    status: "confirmed",
    visibility: "mission",
    mission_id: MISSION,
    resource_ids: [VAN],
    human_ids: ["usr-001"],
    organization_unit_ids: ["org-field-team"],
    location: "Block Street Training Center — Meeting Room A",
    virtual_location: null,
    created_by: "usr-001",
    approved_by: "usr-001",
    created_at: NOW,
    updated_at: NOW,
  };
  saveCalendarEvent(trainingEvent);

  const committeeMeeting: CalendarEventRecord = {
    event_id: "evt-ops-committee-review",
    calendar_id: CALENDAR_ID,
    institution_id: INSTITUTION,
    event_type: "meeting",
    title: "Operations Committee Review",
    description: "Monthly governance and mission review",
    start_time: "2026-08-20T14:00:00-05:00",
    end_time: "2026-08-20T15:30:00-05:00",
    time_zone: "America/Chicago",
    all_day: false,
    recurring: true,
    recurring_series_id: "ser-monthly-committee",
    priority: "normal",
    status: "scheduled",
    visibility: "institution",
    mission_id: null,
    resource_ids: [],
    human_ids: ["usr-001"],
    organization_unit_ids: ["org-ops-division"],
    location: "Block Street Training Center",
    virtual_location: "https://meet.block-street.example/ops",
    created_by: "usr-001",
    approved_by: null,
    created_at: NOW,
    updated_at: NOW,
  };
  saveCalendarEvent(committeeMeeting);

  const availability: AvailabilityRuleRecord = {
    rule_id: "avl-usr-001",
    institution_id: INSTITUTION,
    human_id: "usr-001",
    working_hours_start: "08:00",
    working_hours_end: "18:00",
    preferred_hours_start: "09:00",
    preferred_hours_end: "17:00",
    time_zone: "America/Chicago",
    updated_at: NOW,
  };
  saveAvailabilityRule(availability);

  const deadline: DeadlineRecord = {
    deadline_id: "ddl-training-materials",
    institution_id: INSTITUTION,
    mission_id: MISSION,
    title: "Training materials finalized",
    due_at: "2026-08-10T17:00:00-05:00",
    deadline_type: "hard",
    event_id: null,
    status: "upcoming",
  };
  saveDeadline(deadline);

  return true;
}
