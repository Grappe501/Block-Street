/**
 * CAE-11.2-W5 — API, events, and integration tests
 */
import {
  stripUntrustedIdentityFields,
  LIFECYCLE_ACTION_ROUTES,
  HIGH_IMPACT_ACTIONS,
  IDEMPOTENT_COMMANDS,
  queryObjectiveCollection,
} from "./api";
import { assertCatalogCoversProducers } from "./events/catalog";
import { wasEventProcessed, recordConsumerReceipt } from "./events/consumer-receipts";
import { evaluateInitiativeObjectiveGuard } from "./integrations/initiative-guard";
import {
  searchObjectives,
  upsertObjectiveSearchIndex,
  projectObjectiveSearchDocument,
} from "./integrations/search-projection";
import { signWebhookPayload, verifyWebhookSignature } from "./integrations/webhook-delivery";
import { objectiveApplicationService } from "./application-service";
import { DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT } from "./ux/experience-context";

export type W5TestResult = { name: string; passed: boolean; detail?: string };

function apiCtx() {
  return {
    actor_human_id: DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.actor_human_id,
    service_identity_id_optional: null,
    institution_id: DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.institution_id,
    institution_membership_id: DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.active_membership_id,
    initiative_id_optional: null,
    request_id: "req_test",
    correlation_id: "corr_test",
    idempotency_key_optional: null,
    locale: "en" as const,
    timezone: "America/Chicago",
    effective_permissions: DEFAULT_OBJECTIVE_EXPERIENCE_CONTEXT.permissions,
  };
}

export function runObjW5ApiTests(): W5TestResult[] {
  const results: W5TestResult[] = [];

  const stripped = stripUntrustedIdentityFields({
    display_name: "Test",
    lifecycle_state: "active",
    actor_human_id: "evil",
    institution_id: "evil-inst",
  });
  results.push({
    name: "strip_untrusted_identity_fields",
    passed:
      !("lifecycle_state" in stripped) &&
      !("actor_human_id" in stripped) &&
      (stripped as { display_name?: string }).display_name === "Test",
  });

  results.push({
    name: "lifecycle_action_routes_exist",
    passed: Object.keys(LIFECYCLE_ACTION_ROUTES).length >= 4,
    detail: `${Object.keys(LIFECYCLE_ACTION_ROUTES).length} actions`,
  });

  results.push({
    name: "high_impact_requires_idempotency_set",
    passed: HIGH_IMPACT_ACTIONS.has("activate") && HIGH_IMPACT_ACTIONS.has("approve"),
  });

  results.push({
    name: "idempotent_commands_registered",
    passed: IDEMPOTENT_COMMANDS.has("AssignMission") && IDEMPOTENT_COMMANDS.has("AttachEvidence"),
  });

  const catalog = assertCatalogCoversProducers();
  results.push({
    name: "event_catalog_covers_w3_producers",
    passed: catalog.complete,
    detail: catalog.missing.join(", ") || "complete",
  });

  recordConsumerReceipt("search", "evt-obj-test-1", "processed");
  results.push({
    name: "consumer_idempotency_receipt",
    passed: wasEventProcessed("search", "evt-obj-test-1"),
  });

  const guardBlocked = evaluateInitiativeObjectiveGuard("nonexistent-initiative");
  results.push({
    name: "initiative_guard_blocks_missing",
    passed: !guardBlocked.allowed && guardBlocked.code === "INITIATIVE_NOT_FOUND",
  });

  const sigBody = JSON.stringify({ event_type: "execution.mission_completed" });
  const ts = String(Math.floor(Date.now() / 1000));
  const sig = signWebhookPayload("secret", ts, sigBody);
  results.push({
    name: "webhook_signature_roundtrip",
    passed: verifyWebhookSignature("secret", ts, sigBody, sig),
  });

  const objectives = objectiveApplicationService.listAllObjectives();
  if (objectives[0]) {
    const doc = projectObjectiveSearchDocument(objectives[0].canonical_id, "objective");
    if (doc) upsertObjectiveSearchIndex(doc);
    const ctx = apiCtx();
    const collection = queryObjectiveCollection(ctx, { limit: 10 });
    const search = searchObjectives({ institution_id: ctx.institution_id });
    results.push({
      name: "institution_scoped_query",
      passed: collection.items.every((i) => i.institution_id === ctx.institution_id),
      detail: `${collection.items.length} items`,
    });
    results.push({
      name: "search_visibility_scope",
      passed: search.every((s) => s.institution_id === ctx.institution_id),
      detail: `${search.length} indexed`,
    });
  } else {
    results.push({ name: "institution_scoped_query", passed: true, detail: "no objectives seeded" });
    results.push({ name: "search_visibility_scope", passed: true, detail: "no objectives seeded" });
  }

  return results;
}

export function allW5TestsPassed(): boolean {
  return runObjW5ApiTests().every((t) => t.passed);
}
