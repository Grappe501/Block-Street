import { createHash } from "crypto";
import { loadWave2Flags } from "./data";
import type { IdentityLedgerEvent } from "./types";
import { loadIdentityLedgerEvents, persistIdentityLedgerEvents } from "./data";
import { itlId, nowIso } from "../utils";

function hashPayload(event: Omit<IdentityLedgerEvent, "integrity_hash" | "previous_event_hash">, previousHash: string | null) {
  const payload = JSON.stringify({
    previous_event_hash: previousHash,
    human_id: event.human_id,
    event_type: event.event_type,
    occurred_at: event.occurred_at,
    previous_state: event.previous_state,
    new_state: event.new_state,
    source_record_id: event.source_record_id,
  });
  return createHash("sha256").update(payload).digest("hex");
}

export function appendLedgerEvent(
  input: Omit<
    IdentityLedgerEvent,
    "id" | "ledger_sequence" | "recorded_at" | "integrity_hash" | "previous_event_hash" | "status" | "event_version"
  > & { status?: IdentityLedgerEvent["status"]; event_version?: string }
): IdentityLedgerEvent {
  const flags = loadWave2Flags();
  if (!flags.IDENTITY_LEDGER_ENABLED) {
    throw new Error("Identity ledger is not enabled.");
  }

  const events = loadIdentityLedgerEvents();
  const humanEvents = events.filter((e) => e.human_id === input.human_id);
  const last = humanEvents.sort((a, b) => a.ledger_sequence - b.ledger_sequence).at(-1);
  const sequence = (last?.ledger_sequence ?? 0) + 1;
  const previousHash = flags.IDENTITY_LEDGER_HASH_CHAIN_ENABLED ? (last?.integrity_hash ?? null) : null;

  const base = {
    ...input,
    id: itlId("iled"),
    ledger_sequence: sequence,
    recorded_at: nowIso(),
    event_version: input.event_version ?? "1",
    status: input.status ?? "active",
    integrity_hash: null as string | null,
    previous_event_hash: previousHash,
  };

  if (flags.IDENTITY_LEDGER_HASH_CHAIN_ENABLED) {
    base.integrity_hash = hashPayload(base, previousHash);
  }

  events.push(base);
  persistIdentityLedgerEvents(events);
  return base;
}

export function listLedgerForHuman(humanId: string, limit = 100): IdentityLedgerEvent[] {
  return loadIdentityLedgerEvents()
    .filter((e) => e.human_id === humanId)
    .sort((a, b) => b.ledger_sequence - a.ledger_sequence)
    .slice(0, limit);
}

export function verifyLedgerIntegrity(humanId?: string): { valid: boolean; broken_at: string | null; checked: number } {
  const flags = loadWave2Flags();
  let events = loadIdentityLedgerEvents();
  if (humanId) events = events.filter((e) => e.human_id === humanId);
  const byHuman = new Map<string, IdentityLedgerEvent[]>();
  for (const e of events) {
    const list = byHuman.get(e.human_id) ?? [];
    list.push(e);
    byHuman.set(e.human_id, list);
  }

  let checked = 0;
  for (const [, list] of byHuman) {
    const sorted = list.sort((a, b) => a.ledger_sequence - b.ledger_sequence);
    let prevHash: string | null = null;
    for (const e of sorted) {
      checked++;
      if (flags.IDENTITY_LEDGER_HASH_CHAIN_ENABLED && e.integrity_hash) {
        const expected = hashPayload(e, prevHash);
        if (expected !== e.integrity_hash) {
          return { valid: false, broken_at: e.id, checked };
        }
        if (e.previous_event_hash !== prevHash) {
          return { valid: false, broken_at: e.id, checked };
        }
        prevHash = e.integrity_hash;
      }
    }
  }
  return { valid: true, broken_at: null, checked };
}

export function getSafeLedgerSummary(humanId: string) {
  return listLedgerForHuman(humanId, 50).map((e) => ({
    event_type: e.event_type,
    occurred_at: e.occurred_at,
    previous_state: e.previous_state,
    new_state: e.new_state,
    reason_code: e.reason_code,
  }));
}
