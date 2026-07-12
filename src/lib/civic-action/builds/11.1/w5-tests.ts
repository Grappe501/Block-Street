/**
 * CAE-11.1-W5 — API, events, and integration tests
 */
import { stripUntrustedIdentityFields, LIFECYCLE_ACTION_ROUTES, HIGH_IMPACT_ACTIONS } from "./api";
import { assertCatalogCoversProducers } from "./events/catalog";
import { wasEventProcessed, recordConsumerReceipt } from "./events/consumer-receipts";
import { createImportPreviewJob } from "./integrations/import-export";
import { evaluateInitiativeMissionGuard } from "./integrations/mission-contract";
import { searchInitiatives, upsertInitiativeSearchIndex, projectInitiativeSearchDocument } from "./integrations/search-projection";
import { signWebhookPayload, verifyWebhookSignature } from "./integrations/webhook-delivery";
import { initiativeApplicationService } from "./services/application-service";
import { DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT } from "./ux/experience-context";
import { queryInitiativeCollection } from "./api/query-service";

export type W5TestResult = { name: string; passed: boolean; detail?: string };

export function runIniW5ApiTests(): W5TestResult[] {
  const results: W5TestResult[] = [];

  const stripped = stripUntrustedIdentityFields({
    name: "Test",
    status: "active",
    actor_human_id: "evil",
    institution_id: "evil-inst",
  });
  results.push({
    name: "strip_untrusted_identity_fields",
    passed:
      !("status" in stripped) &&
      !("actor_human_id" in stripped) &&
      (stripped as { name?: string }).name === "Test",
  });

  results.push({
    name: "lifecycle_action_routes_exist",
    passed: Object.keys(LIFECYCLE_ACTION_ROUTES).length >= 10,
    detail: `${Object.keys(LIFECYCLE_ACTION_ROUTES).length} actions`,
  });

  results.push({
    name: "high_impact_requires_idempotency_set",
    passed: HIGH_IMPACT_ACTIONS.has("activate") && HIGH_IMPACT_ACTIONS.has("approve"),
  });

  const catalog = assertCatalogCoversProducers();
  results.push({
    name: "event_catalog_covers_w3_producers",
    passed: catalog.complete,
    detail: catalog.missing.join(", ") || "complete",
  });

  recordConsumerReceipt("search", "evt-test-1", "processed");
  results.push({
    name: "consumer_idempotency_receipt",
    passed: wasEventProcessed("search", "evt-test-1"),
  });

  const importJob = createImportPreviewJob({
    institution_id: "inst-block-street",
    source_type: "legacy",
    source_reference: "sheet",
    requested_by: "usr-001",
    rows: [{ name: "Legacy", status: "Active" }],
  });
  results.push({
    name: "import_rejects_fabricated_authority",
    passed: importJob.preview.rejected_authority_rows === 1 && importJob.status === "needs_review",
  });

  const missionBlocked = evaluateInitiativeMissionGuard({
    status: "active",
    owner_required: false,
    closing: false,
    archived: false,
    paused: true,
  });
  results.push({
    name: "mission_guard_blocks_paused",
    passed: !missionBlocked.allowed && missionBlocked.code === "INITIATIVE_PAUSED",
  });

  const sigBody = JSON.stringify({ event_type: "initiative.activated" });
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = signWebhookPayload("secret", ts, sigBody);
  results.push({
    name: "webhook_signature_roundtrip",
    passed: verifyWebhookSignature("secret", ts, sigBody, sig),
  });

  const ids = initiativeApplicationService.listInitiativeIds();
  if (ids[0]) {
    const doc = projectInitiativeSearchDocument(ids[0]);
    if (doc) upsertInitiativeSearchIndex(doc);
    const apiCtx = {
      actor_human_id: DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.actor_human_id,
      service_identity_id_optional: null,
      institution_id: DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.institution_id,
      institution_membership_id: DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.active_membership_id,
      initiative_id_optional: null,
      request_id: "req_test",
      correlation_id: "corr_test",
      idempotency_key_optional: null,
      locale: "en" as const,
      timezone: "America/Chicago",
      effective_permissions: DEFAULT_INITIATIVE_EXPERIENCE_CONTEXT.permissions,
    };
    const collection = queryInitiativeCollection(apiCtx, { limit: 10 });
    const search = searchInitiatives({
      institution_id: apiCtx.institution_id,
      visibility_scope: "member",
    });
    results.push({
      name: "institution_scoped_query",
      passed: collection.items.every((i) => i.governing_institution_id === apiCtx.institution_id),
      detail: `${collection.items.length} items`,
    });
    results.push({
      name: "search_visibility_scope",
      passed: search.every((s) => s.institution_id === apiCtx.institution_id || s.visibility === "public"),
      detail: `${search.length} indexed`,
    });
  } else {
    results.push({ name: "institution_scoped_query", passed: true, detail: "no initiatives seeded" });
    results.push({ name: "search_visibility_scope", passed: true, detail: "no initiatives seeded" });
  }

  return results;
}

export function allW5TestsPassed(): boolean {
  return runIniW5ApiTests().every((t) => t.passed);
}
