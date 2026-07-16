import type { CalendarEvent } from "../types";
import { SEED_CONFLICTS } from "../seed";
import { allCanonicalEvents } from "../events";
import { detectScheduleOverlaps, inferConflictState } from "./detect";
import { createConflictItem } from "./items";
import { isConflictItemReady } from "./status";
import {
  getConflictRecordById,
  hasSeededConflicts,
  listConflictItems,
  listConflictRecords,
  markConflictsSeeded,
  saveConflictRecord,
} from "./store";
import type { CalendarConflictRecord, CalendarConflictResolutionItem, ConflictKind } from "./types";

function resolutionItemsForEvent(
  conflictId: string,
  eventId: string,
  state: import("../types").ConflictState,
): CalendarConflictResolutionItem[] {
  const existing = listConflictItems({ conflictId, eventId });
  if (existing.length > 0) return existing;

  const keys = [
    { category: "review" as const, key: "identify-parties", label: "Identify affected parties and scope" },
    { category: "review" as const, key: "review-schedule", label: "Review overlapping schedule details" },
    { category: "communication" as const, key: "contact-organizers", label: "Contact organizers for resolution path" },
    { category: "resolution" as const, key: "document-decision", label: "Document resolution or override decision" },
  ];
  const created: CalendarConflictResolutionItem[] = [];
  for (const row of keys) {
    let initial: CalendarConflictResolutionItem["itemStatus"] = "not_started";
    if (state === "override_approved") initial = "ready";
    if (state === "no_conflict") initial = "not_applicable";
    created.push(
      createConflictItem({
        conflictId,
        eventId,
        category: row.category,
        itemKey: row.key,
        label: row.label,
        required: row.key !== "document-decision" || state !== "possible_conflict",
        blocksResolution: row.key === "document-decision",
        generatedFromSeed: true,
        initialStatus: initial,
      }),
    );
  }
  return created;
}

function upsertRecord(input: {
  conflictId: string;
  eventIds: string[];
  kind: ConflictKind;
  summary: string;
  severity: "low" | "medium" | "high";
  state?: import("../types").ConflictState;
}): CalendarConflictRecord {
  const now = new Date().toISOString();
  const existing = getConflictRecordById(input.conflictId);
  const state = input.state ?? inferConflictState(input.severity, input.kind);
  const record: CalendarConflictRecord = {
    conflictId: input.conflictId,
    eventIds: input.eventIds,
    kind: input.kind,
    summary: input.summary,
    severity: input.severity,
    state,
    resolutionStatus:
      state === "override_approved" ? "override_approved" : state === "no_conflict" ? "resolved" : "open",
    detectedAt: existing?.detectedAt ?? now,
    softBeta: true,
    durableAuthority: false,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  saveConflictRecord(record);
  for (const eventId of input.eventIds) {
    resolutionItemsForEvent(input.conflictId, eventId, state);
  }
  return record;
}

export function seedConflictCatalog(): CalendarConflictRecord[] {
  if (hasSeededConflicts()) return listConflictRecords();
  const created: CalendarConflictRecord[] = [];
  for (const c of SEED_CONFLICTS) {
    created.push(
      upsertRecord({
        conflictId: c.conflict_id,
        eventIds: c.event_ids,
        kind: "kelly_travel",
        summary: c.summary,
        severity: c.severity,
        state: c.state ?? "possible_conflict",
      }),
    );
  }
  markConflictsSeeded();
  return created;
}

export function ensureConflictsFromEvents(events: CalendarEvent[] = allCanonicalEvents()): CalendarConflictRecord[] {
  seedConflictCatalog();
  const created = [...listConflictRecords()];

  for (const event of events) {
    for (const conflictId of event.conflict_ids ?? []) {
      const seed = SEED_CONFLICTS.find((c) => c.conflict_id === conflictId);
      if (seed) {
        created.push(
          upsertRecord({
            conflictId: seed.conflict_id,
            eventIds: seed.event_ids,
            kind: "kelly_travel",
            summary: seed.summary,
            severity: seed.severity,
            state: seed.state ?? event.conflict_state,
          }),
        );
      }
    }
  }

  const overlaps = detectScheduleOverlaps(events);
  for (const [idx, overlap] of overlaps.entries()) {
    const conflictId = `conf-detected-${overlap.eventIds.sort().join("-")}-${idx}`;
    if (!getConflictRecordById(conflictId)) {
      created.push(
        upsertRecord({
          conflictId,
          eventIds: overlap.eventIds,
          kind: overlap.kind,
          summary: overlap.summary,
          severity: overlap.severity,
        }),
      );
    }
  }

  return listConflictRecords();
}

export function ensureConflictsForEvent(event: CalendarEvent): CalendarConflictRecord[] {
  ensureConflictsFromEvents(allCanonicalEvents());
  return listConflictRecords({ eventId: event.event_id });
}

export function listUnresolvedConflicts(): CalendarConflictRecord[] {
  ensureConflictsFromEvents();
  return listConflictRecords().filter(
    (r) => r.state !== "no_conflict" && r.state !== "override_approved" && r.resolutionStatus !== "resolved",
  );
}

export function listCandidateConflicts(): CalendarConflictRecord[] {
  ensureConflictsFromEvents();
  return listConflictRecords().filter((r) => r.kind === "candidate_schedule" || r.kind === "kelly_travel");
}

export function listOverrideCandidates(): CalendarConflictRecord[] {
  ensureConflictsFromEvents();
  return listConflictRecords().filter((r) => {
    const items = listConflictItems({ conflictId: r.conflictId });
    const blocked = items.filter((i) => i.required && i.blocksResolution && !isConflictItemReady(i.itemStatus));
    return blocked.length > 0 && (r.state === "likely_conflict" || r.state === "hard_conflict");
  });
}

export function listAllConflictRecords(): CalendarConflictRecord[] {
  return ensureConflictsFromEvents();
}
