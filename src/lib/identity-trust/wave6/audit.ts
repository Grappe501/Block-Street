import { itlId, nowIso } from "../utils";
import { loadOperationsAuditEvents, persistOperationsAuditEvents } from "./data";
import type { IdentityOperationsAuditEvent } from "./types";

export function recordOperationsAudit(input: Omit<IdentityOperationsAuditEvent, "id" | "timestamp">) {
  const event: IdentityOperationsAuditEvent = {
    id: itlId("ioae"),
    timestamp: nowIso(),
    ...input,
  };
  const all = loadOperationsAuditEvents();
  all.push(event);
  persistOperationsAuditEvents(all);
  return event;
}

export function searchAuditEvents(filters?: {
  human_id?: string;
  institution_id?: string;
  event_type?: string;
  correlation_id?: string;
  limit?: number;
}) {
  let events = loadOperationsAuditEvents();
  if (filters?.human_id) {
    events = events.filter(
      (e) => e.actor_human_id === filters.human_id || e.subject_human_id === filters.human_id
    );
  }
  if (filters?.institution_id) events = events.filter((e) => e.institution_id === filters.institution_id);
  if (filters?.event_type) events = events.filter((e) => e.event_type === filters.event_type);
  if (filters?.correlation_id) events = events.filter((e) => e.correlation_id === filters.correlation_id);
  events = events.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const limit = filters?.limit ?? 100;
  return events.slice(0, limit);
}

export function getAuditLineage(humanId: string) {
  const { loadIdentityLedgerEvents } = require("../wave2/data") as typeof import("../wave2/data");
  const { loadSponsorRelationships } = require("../data") as typeof import("../data");
  const { loadTrustInvitations } = require("../data") as typeof import("../data");
  const { loadIdentityCases } = require("../wave3/data") as typeof import("../wave3/data");

  const sponsors = loadSponsorRelationships().filter((s) => s.sponsored_user_id === humanId);
  const invitations = loadTrustInvitations().filter((i) => i.sponsor_id && humanId);
  const ledger = loadIdentityLedgerEvents().filter((e) => e.human_id === humanId || e.actor_human_id === humanId);
  const cases = loadIdentityCases().filter((c) => c.subject_human_id === humanId);
  const ops = searchAuditEvents({ human_id: humanId, limit: 50 });

  return {
    human_id: humanId,
    sponsors: sponsors.map((s) => ({ sponsor_id: s.sponsor_id, sponsored_at: s.created_at })),
    invitations: invitations.slice(0, 5).map((i) => ({ id: i.id, status: i.status, sponsor_id: i.sponsor_id })),
    ledger_events: ledger.length,
    cases: cases.map((c) => ({ id: c.id, type: c.case_type, status: c.status })),
    operational_events: ops.length,
    lineage_complete: sponsors.length > 0 && ledger.length > 0,
  };
}

export function runIntegrityCheck() {
  const { verifyLedgerIntegrity } = require("../wave2/ledger") as typeof import("../wave2/ledger");
  const ledger = verifyLedgerIntegrity();
  const events = loadOperationsAuditEvents();
  return {
    ledger_integrity: ledger,
    operations_audit_count: events.length,
    healthy: ledger.valid,
    checked_at: nowIso(),
  };
}

export function createAuditExport(input: {
  requester_id: string;
  purpose: string;
  scope: string[];
  institution_id?: string;
}) {
  const events = searchAuditEvents({
    institution_id: input.institution_id,
    limit: 500,
  });
  const exportRecord = {
    id: itlId("iaex"),
    purpose: input.purpose,
    requester_id: input.requester_id,
    scope: input.scope,
    record_count: events.length,
    fields: ["event_type", "actor", "subject", "institution", "summary", "timestamp"],
    created_at: nowIso(),
    expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    digest: `sha256:${events.length}:${input.purpose}`,
  };
  recordOperationsAudit({
    event_type: "audit_export",
    actor_human_id: input.requester_id,
    subject_human_id: null,
    institution_id: input.institution_id ?? null,
    resource_type: "audit_export",
    resource_id: exportRecord.id,
    summary: `Export: ${input.purpose} (${events.length} records)`,
    correlation_id: exportRecord.id,
  });
  return { export: exportRecord, events: events.map((e) => ({ ...e, private_evidence_excluded: true })) };
}
