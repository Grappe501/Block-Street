/**
 * CAE-11.1-W3 — Initiative Domain Service Engine (INI-SVC-001)
 * All initiative mutations must pass through this service.
 */
import { createHash } from "crypto";
import { caeId, nowIso } from "../../../utils";
import type {
  CanonicalInitiativeStatus,
  CanonicalInitiativeType,
  InitiativeAggregate,
  InitiativeHistoryEvent,
} from "../data-model";
import type {
  InitiativeCharterRecord,
  InitiativeCloseoutRecord,
  InitiativeDependencyRecord,
  InitiativeMembershipRecord,
  InitiativeRecord,
  InitiativeScopeRecord,
  InitiativeTimelineRecord,
  InitiativeVersionRecord,
} from "../data-model";
import { validateTransition } from "../state-machine";
import { nextVersionNumber } from "../versioning";
import type { InitiativeCommandEnvelope, InitiativeCommandResult } from "./commands";
import { InitiativeDomainError } from "./errors";
import { publishDomainEvent } from "./events";
import { resolveInitiativeAuthority, assertAuthorityAllowed } from "./policy";
import { validateCharter } from "./charter-validator";
import { checkOwnerEligibility, detectOwnerEligibilityLoss } from "./owner-eligibility";
import { evaluateDependencyReadiness, validateNewDependency } from "./dependency-graph";
import {
  appendHistoryEvent,
  ensureCanonicalInitiativeStore,
  getIdempotencyResult,
  loadInitiativeAggregate,
  persistAggregate,
  setIdempotencyResult,
} from "./repository";

// Approval conditions tracked via charter approval metadata in W3 MVP

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function hashPayload(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 16);
}

function writeHistory(
  agg: InitiativeAggregate,
  eventType: InitiativeHistoryEvent["event_type"],
  actorHumanId: string,
  previous: Record<string, unknown> | null,
  next: Record<string, unknown>,
  reason: string | null,
  envelope: InitiativeCommandEnvelope
) {
  const event: InitiativeHistoryEvent = {
    initiative_event_id: caeId("ihe"),
    initiative_id: agg.initiative.initiative_id,
    institution_id: agg.initiative.institution_id,
    event_type: eventType,
    actor_human_id: actorHumanId,
    previous_state: previous,
    new_state: next,
    reason,
    correlation_id: envelope.correlation_id,
    request_id: envelope.request_id,
    occurred_at: nowIso(),
  };
  agg.history.push(event);
  appendHistoryEvent(event);
}

function assertNotArchived(agg: InitiativeAggregate) {
  if (agg.initiative.is_archived || agg.initiative.status === "archived") {
    throw new InitiativeDomainError({
      code: "INITIATIVE_ARCHIVED_READ_ONLY",
      message: "Archived initiatives are read-only",
      initiative_id: agg.initiative.initiative_id,
      requirement_ids: ["CAE-11.1-W3-LIF-005"],
    });
  }
}

function assertVersion(agg: InitiativeAggregate, expected?: number | null) {
  if (expected != null && agg.initiative.current_version !== expected) {
    throw new InitiativeDomainError({
      code: "INITIATIVE_VERSION_CONFLICT",
      message: `Version conflict: expected ${expected}, current ${agg.initiative.current_version}`,
      initiative_id: agg.initiative.initiative_id,
      retryable: true,
      requirement_ids: ["CAE-11.1-W3-REL-002"],
      details: { current_version: agg.initiative.current_version },
    });
  }
}

function transitionStatus(
  agg: InitiativeAggregate,
  to: CanonicalInitiativeStatus,
  envelope: InitiativeCommandEnvelope,
  eventType: InitiativeHistoryEvent["event_type"]
) {
  const from = agg.initiative.status;
  const check = validateTransition(from, to);
  if (!check.allowed) {
    throw new InitiativeDomainError({
      code: "INITIATIVE_TRANSITION_NOT_ALLOWED",
      message: check.reason ?? `Cannot transition ${from} → ${to}`,
      initiative_id: agg.initiative.initiative_id,
      current_state: from,
      requested_state: to,
      requirement_ids: ["CAE-11.1-W3-LIF-001", "CAE-11.1-W3-LIF-002"],
    });
  }
  const previous = { status: from, version: agg.initiative.current_version };
  agg.initiative.status = to;
  agg.initiative.updated_at = nowIso();
  agg.initiative.updated_by = envelope.actor_human_id;
  writeHistory(agg, eventType, envelope.actor_human_id, previous, { status: to }, envelope.reason_optional ?? null, envelope);
  return { from, to };
}

/** Walk lawful intermediate lifecycle states before approval_pending (records each transition). */
function advanceToDesignIfNeeded(
  agg: InitiativeAggregate,
  envelope: InitiativeCommandEnvelope
) {
  const order: CanonicalInitiativeStatus[] = ["discovery", "design"];
  for (const target of order) {
    const rank: Record<CanonicalInitiativeStatus, number> = {
      concept: 0,
      discovery: 1,
      design: 2,
      approval_pending: 3,
      approved: 4,
      preparation: 5,
      active: 6,
      paused: 6,
      at_risk: 6,
      owner_required: 6,
      closing: 7,
      completed: 8,
      cancelled: 8,
      archived: 9,
    };
    if (rank[agg.initiative.status] >= rank[target]) continue;
    transitionStatus(agg, target, envelope, "status_changed");
    if (target === "discovery" && agg.timeline) agg.timeline.discovery_date = nowIso();
    if (target === "design" && agg.timeline) agg.timeline.design_date = nowIso();
  }
}

export class InitiativeDomainService {
  execute(envelope: InitiativeCommandEnvelope, permissions: string[] = ["civic_action.manage"]): InitiativeCommandResult {
    if (envelope.idempotency_key) {
      const cached = getIdempotencyResult(envelope.idempotency_key);
      if (cached) return cached as InitiativeCommandResult;
    }

    ensureCanonicalInitiativeStore();

    let result: InitiativeCommandResult;
    try {
      result = this.dispatch(envelope, permissions);
    } catch (e) {
      if (e instanceof InitiativeDomainError) {
        return {
          success: false,
          initiative_id: e.initiative_id ?? envelope.initiative_id_optional ?? null,
          previous_status_optional: e.current_state ?? null,
          new_status_optional: e.requested_state ?? null,
          version: null,
          events: [],
          warnings: [],
          next_required_actions: [],
          validation_errors: [{ code: e.code, message: e.message, field: e.field }],
        };
      }
      throw e;
    }

    if (envelope.idempotency_key) {
      const ok = setIdempotencyResult(envelope.idempotency_key, result, hashPayload(envelope));
      if (!ok) {
        throw new InitiativeDomainError({
          code: "INITIATIVE_IDEMPOTENCY_CONFLICT",
          message: "Idempotency key reused with different payload",
          requirement_ids: ["CAE-11.1-W3-REL-001"],
        });
      }
    }
    return result;
  }

  private dispatch(envelope: InitiativeCommandEnvelope, permissions: string[]): InitiativeCommandResult {
    switch (envelope.command_type) {
      case "CreateInitiativeDraftCommand":
        return this.createDraft(envelope, permissions);
      case "UpdateInitiativeDraftCommand":
        return this.updateDraft(envelope, permissions);
      case "SubmitInitiativeForReviewCommand":
        return this.submitForReview(envelope, permissions);
      case "ApproveInitiativeCommand":
        return this.approve(envelope, permissions);
      case "ReturnInitiativeForRevisionCommand":
        return this.returnForRevision(envelope, permissions);
      case "StartPreparationCommand":
        return this.transition(envelope, permissions, "preparation");
      case "ActivateInitiativeCommand":
        return this.activate(envelope, permissions);
      case "PauseInitiativeCommand":
        return this.transition(envelope, permissions, "paused");
      case "ResumeInitiativeCommand":
        return this.transition(envelope, permissions, "active");
      case "MarkInitiativeAtRiskCommand":
        return this.transition(envelope, permissions, "at_risk");
      case "ClearInitiativeRiskCommand":
        return this.transition(envelope, permissions, "active");
      case "TransferOperationalOwnershipCommand":
        return this.transferOwner(envelope, permissions);
      case "AddInitiativeDependencyCommand":
        return this.addDependency(envelope, permissions);
      case "RemoveInitiativeDependencyCommand":
        return this.removeDependency(envelope, permissions);
      case "BeginInitiativeCloseoutCommand":
        return this.transition(envelope, permissions, "closing");
      case "CompleteInitiativeCommand":
        return this.complete(envelope, permissions);
      case "ApproveInitiativeCancellationCommand":
        return this.transition(envelope, permissions, "cancelled");
      case "ArchiveInitiativeCommand":
        return this.archive(envelope, permissions);
      case "CreateSuccessorInitiativeCommand":
        return this.createSuccessor(envelope, permissions);
      case "RestoreInitiativeCommand":
        return this.restore(envelope, permissions);
      default:
        throw new InitiativeDomainError({
          code: "INITIATIVE_DIRECT_MUTATION_FORBIDDEN",
          message: `Unsupported command: ${envelope.command_type}`,
        });
    }
  }

  private createDraft(envelope: InitiativeCommandEnvelope, permissions: string[]): InitiativeCommandResult {
    const payload = envelope.payload as unknown as import("./commands").CreateDraftPayload;
    const auth = resolveInitiativeAuthority(envelope.command_type, envelope.actor_human_id, envelope.institution_id, null, permissions);
    assertAuthorityAllowed(auth);

    const initiative_id = caeId("ini");
    const now = nowIso();
    const initiative: InitiativeRecord = {
      initiative_id,
      institution_id: payload.governing_institution_id,
      initiative_type: payload.initiative_type as CanonicalInitiativeType,
      initiative_name: payload.initiative_name,
      initiative_slug: slugify(payload.initiative_name),
      public_name: null,
      executive_owner_human_id: envelope.actor_human_id,
      operational_owner_human_id: payload.proposed_operational_owner_optional ?? envelope.actor_human_id,
      backup_owner_human_id: null,
      status: "concept",
      governance_class: 2,
      visibility: payload.visibility,
      strategic_priority_id: null,
      portfolio_category: null,
      current_version: 1,
      is_archived: false,
      created_at: now,
      created_by: envelope.actor_human_id,
      updated_at: now,
      updated_by: envelope.actor_human_id,
    };

    const charter: InitiativeCharterRecord = {
      charter_id: caeId("chr"),
      initiative_id,
      problem_statement: payload.initial_problem_or_opportunity,
      opportunity_statement: null,
      purpose: "",
      institution_alignment: "",
      success_definition: "",
      in_scope: "",
      out_of_scope: "",
      public_description: null,
      review_frequency: "quarterly",
      closeout_basis: "objective_completed",
      charter_status: "draft",
      version: 1,
      approved_at: null,
      approved_by: null,
      created_at: now,
      created_by: envelope.actor_human_id,
      updated_at: now,
      updated_by: envelope.actor_human_id,
    };

    const scope: InitiativeScopeRecord = {
      scope_id: caeId("scp"),
      initiative_id,
      geographic_scope: "",
      population_scope: "",
      institution_scope: payload.governing_institution_id,
      functional_scope: "",
      resource_scope: "",
      visibility_scope: payload.visibility,
      data_scope: "institution_governed",
      version: 1,
      created_at: now,
      updated_at: now,
    };

    const timeline: InitiativeTimelineRecord = {
      timeline_id: caeId("tl"),
      initiative_id,
      concept_date: now,
      discovery_date: null,
      design_date: null,
      approval_date: null,
      preparation_date: null,
      activation_date: null,
      target_completion_date: null,
      completion_date: null,
      archive_date: null,
      next_review_date: null,
    };

    const memberships: InitiativeMembershipRecord[] = [
      {
        membership_id: caeId("mem"),
        initiative_id,
        human_id: envelope.actor_human_id,
        institution_membership_id: envelope.active_membership_id,
        institution_id: envelope.institution_id,
        role: "creator",
        authority_level: "contributor",
        status: "active",
        assigned_at: now,
        ended_at: null,
      },
    ];

    const version: InitiativeVersionRecord = {
      initiative_version_id: caeId("ver"),
      initiative_id,
      version_number: 1,
      change_summary: "Initial draft",
      trigger: "draft_created",
      charter_id: charter.charter_id,
      scope_id: scope.scope_id,
      created_at: now,
      created_by: envelope.actor_human_id,
    };

    const agg: InitiativeAggregate = {
      initiative,
      charter,
      scope,
      timeline,
      memberships,
      versions: [version],
      dependencies: [],
      reviews: [],
      history: [],
      closeout: null,
    };

    writeHistory(agg, "initiative_created", envelope.actor_human_id, null, { status: "concept" }, null, envelope);
    persistAggregate(agg);

    publishDomainEvent({
      event_type: "initiative.draft_created",
      initiative_id,
      institution_id: envelope.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      initiative_version: 1,
      payload: { initiative_name: payload.initiative_name },
    });

    return {
      success: true,
      initiative_id,
      previous_status_optional: null,
      new_status_optional: "concept",
      version: 1,
      events: ["initiative.draft_created"],
      warnings: [],
      next_required_actions: ["Complete discovery", "Develop charter", "Nominate owners"],
      validation_errors: [],
    };
  }

  private loadRequired(envelope: InitiativeCommandEnvelope): InitiativeAggregate {
    const id = envelope.initiative_id_optional;
    if (!id) throw new InitiativeDomainError({ code: "INITIATIVE_NOT_FOUND", message: "initiative_id required" });
    const agg = loadInitiativeAggregate(id);
    if (!agg) throw new InitiativeDomainError({ code: "INITIATIVE_NOT_FOUND", message: "Initiative not found", initiative_id: id });
    return agg;
  }

  private updateDraft(envelope: InitiativeCommandEnvelope, permissions: string[]): InitiativeCommandResult {
    const agg = this.loadRequired(envelope);
    assertNotArchived(agg);
    assertVersion(agg, envelope.expected_version_optional);
    const auth = resolveInitiativeAuthority(envelope.command_type, envelope.actor_human_id, envelope.institution_id, agg, permissions);
    assertAuthorityAllowed(auth);

    const payload = envelope.payload as Record<string, string>;
    if (payload.initiative_name) agg.initiative.initiative_name = payload.initiative_name;
    if (payload.purpose && agg.charter) agg.charter.purpose = payload.purpose;
    if (payload.problem_statement && agg.charter) agg.charter.problem_statement = payload.problem_statement;

    agg.initiative.updated_at = nowIso();
    persistAggregate(agg);
    return this.ok(agg, null, agg.initiative.status, ["Draft updated"]);
  }

  private submitForReview(envelope: InitiativeCommandEnvelope, permissions: string[]): InitiativeCommandResult {
    const agg = this.loadRequired(envelope);
    assertNotArchived(agg);
    assertVersion(agg, envelope.expected_version_optional);
    const auth = resolveInitiativeAuthority(envelope.command_type, envelope.actor_human_id, envelope.institution_id, agg, permissions);
    assertAuthorityAllowed(auth);

    const validation = validateCharter(agg, "review_submission");
    if (!validation.is_valid) {
      throw new InitiativeDomainError({
        code: "INITIATIVE_CHARTER_INCOMPLETE",
        message: "Charter incomplete for review submission",
        initiative_id: agg.initiative.initiative_id,
        requirement_ids: ["CAE-11.1-W3-CHR-001", "CAE-11.1-W3-CHR-002"],
        details: { errors: validation.errors },
      });
    }

    advanceToDesignIfNeeded(agg, envelope);
    const { from } = transitionStatus(agg, "approval_pending", envelope, "status_changed");
    if (agg.charter) agg.charter.charter_status = "ready_for_review";
    persistAggregate(agg);
    publishDomainEvent({
      event_type: "initiative.submitted_for_review",
      initiative_id: agg.initiative.initiative_id,
      institution_id: agg.initiative.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      initiative_version: agg.initiative.current_version,
      payload: {},
    });
    return this.ok(agg, from, "approval_pending", ["Await approval"], ["initiative.submitted_for_review"]);
  }

  private approve(envelope: InitiativeCommandEnvelope, permissions: string[]): InitiativeCommandResult {
    const agg = this.loadRequired(envelope);
    assertNotArchived(agg);
    const auth = resolveInitiativeAuthority(envelope.command_type, envelope.actor_human_id, envelope.institution_id, agg, permissions);
    assertAuthorityAllowed(auth);

    const validation = validateCharter(agg, "approval");
    if (!validation.is_valid) {
      throw new InitiativeDomainError({
        code: "INITIATIVE_CHARTER_INCOMPLETE",
        message: "Charter invalid for approval",
        initiative_id: agg.initiative.initiative_id,
        details: { errors: validation.errors },
      });
    }

    const conditions = (envelope.payload as { conditions?: string[] }).conditions ?? [];
    const { from } = transitionStatus(agg, "approved", envelope, "charter_approved");
    if (agg.charter) {
      agg.charter.charter_status = "approved";
      agg.charter.approved_at = nowIso();
      agg.charter.approved_by = envelope.actor_human_id;
    }
    persistAggregate(agg);

    const warnings = conditions.length ? [`${conditions.length} approval conditions must be satisfied before activation`] : [];
    return this.ok(agg, from, "approved", conditions.length ? ["Satisfy approval conditions", "Assign backup owner if required"] : ["Start preparation"], ["initiative.approved"], warnings);
  }

  private returnForRevision(envelope: InitiativeCommandEnvelope, permissions: string[]): InitiativeCommandResult {
    const agg = this.loadRequired(envelope);
    const auth = resolveInitiativeAuthority(envelope.command_type, envelope.actor_human_id, envelope.institution_id, agg, permissions);
    assertAuthorityAllowed(auth);
    const { from } = transitionStatus(agg, "design", envelope, "status_changed");
    persistAggregate(agg);
    return this.ok(agg, from, "design", ["Revise charter"]);
  }

  private activate(envelope: InitiativeCommandEnvelope, permissions: string[]): InitiativeCommandResult {
    const agg = this.loadRequired(envelope);
    assertNotArchived(agg);
    assertVersion(agg, envelope.expected_version_optional);
    const auth = resolveInitiativeAuthority(envelope.command_type, envelope.actor_human_id, envelope.institution_id, agg, permissions);
    assertAuthorityAllowed(auth);

    const validation = validateCharter(agg, "activation");
    if (!validation.is_valid) {
      throw new InitiativeDomainError({
        code: "INITIATIVE_CHARTER_INCOMPLETE",
        message: "Activation blocked",
        initiative_id: agg.initiative.initiative_id,
        requirement_ids: ["CAE-11.1-W3-APR-003", "CAE-11.1-W3-APR-004"],
        details: { errors: validation.errors, warnings: validation.warnings },
      });
    }

    const opsEligibility = checkOwnerEligibility(
      agg.initiative.operational_owner_human_id,
      agg.initiative.institution_id,
      agg.initiative.initiative_id,
      "operational_owner"
    );
    if (!opsEligibility.eligible) {
      throw new InitiativeDomainError({
        code: "INITIATIVE_OWNER_INELIGIBLE",
        message: "Operational owner ineligible",
        initiative_id: agg.initiative.initiative_id,
        requirement_ids: ["CAE-11.1-W3-OWN-001", "CAE-11.1-W3-OWN-002"],
        details: { reason_codes: opsEligibility.reason_codes },
      });
    }

    const depReady = evaluateDependencyReadiness(agg.initiative.initiative_id, agg.dependencies);
    if (!depReady.ready) {
      throw new InitiativeDomainError({
        code: depReady.blocking_dependencies.length ? "INITIATIVE_BLOCKING_DEPENDENCY" : "INITIATIVE_CIRCULAR_DEPENDENCY",
        message: "Dependency readiness failed",
        initiative_id: agg.initiative.initiative_id,
        requirement_ids: ["CAE-11.1-W3-DEP-001", "CAE-11.1-W3-DEP-002"],
      });
    }

    const fromStatus = agg.initiative.status;
    if (fromStatus !== "preparation" && fromStatus !== "approved") {
      transitionStatus(agg, "preparation", envelope, "status_changed");
    }
    const { from } = transitionStatus(agg, "active", envelope, "activated");
    if (agg.charter) agg.charter.charter_status = "active_version";
    if (agg.timeline) agg.timeline.activation_date = nowIso();
    persistAggregate(agg);

    publishDomainEvent({
      event_type: "initiative.activated",
      initiative_id: agg.initiative.initiative_id,
      institution_id: agg.initiative.institution_id,
      actor_human_id_optional: envelope.actor_human_id,
      service_identity_id_optional: null,
      source_command_id: envelope.command_id,
      request_id: envelope.request_id,
      correlation_id: envelope.correlation_id,
      initiative_version: agg.initiative.current_version,
      payload: {},
    });

    return this.ok(agg, from, "active", ["Create objectives", "Assign workstreams"], ["initiative.activated"]);
  }

  private transition(
    envelope: InitiativeCommandEnvelope,
    permissions: string[],
    target: CanonicalInitiativeStatus,
    _eventType?: string
  ): InitiativeCommandResult {
    const agg = this.loadRequired(envelope);
    assertNotArchived(agg);
    assertVersion(agg, envelope.expected_version_optional);
    const auth = resolveInitiativeAuthority(envelope.command_type, envelope.actor_human_id, envelope.institution_id, agg, permissions);
    assertAuthorityAllowed(auth);
    const { from } = transitionStatus(agg, target, envelope, "status_changed");
    persistAggregate(agg);
    return this.ok(agg, from, target, []);
  }

  private transferOwner(envelope: InitiativeCommandEnvelope, permissions: string[]): InitiativeCommandResult {
    const agg = this.loadRequired(envelope);
    assertNotArchived(agg);
    const auth = resolveInitiativeAuthority(envelope.command_type, envelope.actor_human_id, envelope.institution_id, agg, permissions);
    assertAuthorityAllowed(auth);

    const payload = envelope.payload as unknown as import("./commands").TransferOwnerPayload;
    const eligibility = checkOwnerEligibility(
      payload.proposed_operational_owner_human_id,
      agg.initiative.institution_id,
      agg.initiative.initiative_id,
      "operational_owner",
      agg.initiative.operational_owner_human_id
    );
    if (!eligibility.eligible) {
      throw new InitiativeDomainError({
        code: "INITIATIVE_OWNER_INELIGIBLE",
        message: "Proposed owner ineligible",
        details: { reason_codes: eligibility.reason_codes },
        requirement_ids: ["CAE-11.1-W3-OWN-002"],
      });
    }

    const previous = agg.initiative.operational_owner_human_id;
    agg.initiative.operational_owner_human_id = payload.proposed_operational_owner_human_id;
    agg.initiative.current_version = nextVersionNumber(agg.initiative.current_version);
    agg.initiative.updated_at = nowIso();

    agg.memberships.push({
      membership_id: caeId("mem"),
      initiative_id: agg.initiative.initiative_id,
      human_id: payload.proposed_operational_owner_human_id,
      institution_membership_id: envelope.active_membership_id,
      institution_id: envelope.institution_id,
      role: "operational_owner",
      authority_level: "operational",
      status: "active",
      assigned_at: nowIso(),
      ended_at: null,
    });

    writeHistory(
      agg,
      "owner_changed",
      envelope.actor_human_id,
      { operational_owner: previous },
      { operational_owner: payload.proposed_operational_owner_human_id },
      payload.reason,
      envelope
    );
    persistAggregate(agg);
    return this.ok(agg, agg.initiative.status, agg.initiative.status, ["Ownership transferred"], ["initiative.owner_transferred"]);
  }

  private addDependency(envelope: InitiativeCommandEnvelope, permissions: string[]): InitiativeCommandResult {
    const agg = this.loadRequired(envelope);
    const auth = resolveInitiativeAuthority(envelope.command_type, envelope.actor_human_id, envelope.institution_id, agg, permissions);
    assertAuthorityAllowed(auth);
    const payload = envelope.payload as unknown as import("./commands").AddDependencyPayload;
    const check = validateNewDependency(agg.initiative.initiative_id, payload.target_type, payload.target_id, agg.dependencies);
    if (!check.valid) {
      throw new InitiativeDomainError({
        code: check.cycle ? "INITIATIVE_CIRCULAR_DEPENDENCY" : "INITIATIVE_BLOCKING_DEPENDENCY",
        message: check.error ?? "Invalid dependency",
        details: { cycle: check.cycle },
        requirement_ids: ["CAE-11.1-W3-DEP-002"],
      });
    }
    const dep: InitiativeDependencyRecord = {
      initiative_dependency_id: caeId("dep"),
      initiative_id: agg.initiative.initiative_id,
      dependency_type: payload.dependency_type as InitiativeDependencyRecord["dependency_type"],
      target_type: payload.target_type as InitiativeDependencyRecord["target_type"],
      target_id: payload.target_id,
      description: payload.description,
      blocks_activation: payload.blocks_activation ?? true,
      blocks_completion: false,
      created_at: nowIso(),
      created_by: envelope.actor_human_id,
    };
    agg.dependencies.push(dep);
    writeHistory(agg, "dependency_added", envelope.actor_human_id, null, { dependency_id: dep.initiative_dependency_id }, null, envelope);
    persistAggregate(agg);
    return this.ok(agg, null, agg.initiative.status, [], ["initiative.dependency_added"]);
  }

  private removeDependency(envelope: InitiativeCommandEnvelope, permissions: string[]): InitiativeCommandResult {
    const agg = this.loadRequired(envelope);
    const auth = resolveInitiativeAuthority(envelope.command_type, envelope.actor_human_id, envelope.institution_id, agg, permissions);
    assertAuthorityAllowed(auth);
    const depId = (envelope.payload as { dependency_id: string }).dependency_id;
    agg.dependencies = agg.dependencies.filter((d) => d.initiative_dependency_id !== depId);
    persistAggregate(agg);
    return this.ok(agg, null, agg.initiative.status, []);
  }

  private complete(envelope: InitiativeCommandEnvelope, permissions: string[]): InitiativeCommandResult {
    const agg = this.loadRequired(envelope);
    const auth = resolveInitiativeAuthority(envelope.command_type, envelope.actor_human_id, envelope.institution_id, agg, permissions);
    assertAuthorityAllowed(auth);
    const payload = envelope.payload as unknown as import("./commands").CompleteInitiativePayload;

    if (agg.initiative.status !== "closing") {
      transitionStatus(agg, "closing", envelope, "status_changed");
    }
    const { from } = transitionStatus(agg, "completed", envelope, "closed");

    const closeout: InitiativeCloseoutRecord = {
      closeout_id: caeId("clo"),
      initiative_id: agg.initiative.initiative_id,
      closeout_category: payload.completion_classification,
      authorized_by: envelope.actor_human_id,
      reason: payload.objectives_summary,
      unfinished_obligations: payload.unfinished_work ?? "",
      lessons_learned: payload.lessons ?? null,
      successor_initiative_id: null,
      completed_at: nowIso(),
    };
    agg.closeout = closeout;
    if (agg.timeline) agg.timeline.completion_date = nowIso();
    persistAggregate(agg);
    return this.ok(agg, from, "completed", ["Archive when ready"], ["initiative.completed"]);
  }

  private archive(envelope: InitiativeCommandEnvelope, permissions: string[]): InitiativeCommandResult {
    const agg = this.loadRequired(envelope);
    const auth = resolveInitiativeAuthority(envelope.command_type, envelope.actor_human_id, envelope.institution_id, agg, permissions);
    assertAuthorityAllowed(auth);
    if (!["completed", "cancelled"].includes(agg.initiative.status)) {
      throw new InitiativeDomainError({
        code: "INITIATIVE_TRANSITION_NOT_ALLOWED",
        message: "Only completed or cancelled initiatives may be archived",
        current_state: agg.initiative.status,
        requested_state: "archived",
      });
    }
    const { from } = transitionStatus(agg, "archived", envelope, "archived");
    agg.initiative.is_archived = true;
    if (agg.timeline) agg.timeline.archive_date = nowIso();
    persistAggregate(agg);
    return this.ok(agg, from, "archived", [], ["initiative.archived"]);
  }

  private createSuccessor(envelope: InitiativeCommandEnvelope, permissions: string[]): InitiativeCommandResult {
    const source = this.loadRequired(envelope);
    const createEnvelope: InitiativeCommandEnvelope = {
      ...envelope,
      command_type: "CreateInitiativeDraftCommand",
      initiative_id_optional: null,
      payload: {
        governing_institution_id: source.initiative.institution_id,
        initiative_name: `${source.initiative.initiative_name} (Successor)`,
        initiative_type: source.initiative.initiative_type,
        initial_problem_or_opportunity: source.charter?.purpose ?? source.charter?.problem_statement ?? "",
        proposed_operational_owner_optional: source.initiative.operational_owner_human_id,
        visibility: source.initiative.visibility,
      },
    };
    const result = this.createDraft(createEnvelope, permissions);
    if (result.initiative_id) {
      const dep: InitiativeDependencyRecord = {
        initiative_dependency_id: caeId("dep"),
        initiative_id: result.initiative_id,
        dependency_type: "derived_from",
        target_type: "initiative",
        target_id: source.initiative.initiative_id,
        description: "Successor initiative lineage",
        blocks_activation: false,
        blocks_completion: false,
        created_at: nowIso(),
        created_by: envelope.actor_human_id,
      };
      const successor = loadInitiativeAggregate(result.initiative_id);
      if (successor) {
        successor.dependencies.push(dep);
        persistAggregate(successor);
      }
    }
    return { ...result, events: [...result.events, "initiative.successor_created"] };
  }

  private restore(envelope: InitiativeCommandEnvelope, permissions: string[]): InitiativeCommandResult {
    const agg = this.loadRequired(envelope);
    const auth = resolveInitiativeAuthority(envelope.command_type, envelope.actor_human_id, envelope.institution_id, agg, permissions);
    assertAuthorityAllowed(auth);

    const target = (envelope.payload as { target_status?: CanonicalInitiativeStatus }).target_status ?? "design";
    if (target === "active") {
      throw new InitiativeDomainError({
        code: "INITIATIVE_RESTORATION_REQUIRED",
        message: "Direct restoration to Active is prohibited",
        requirement_ids: ["CAE-11.1-W3-CLS-005"],
      });
    }
    if (!["archived", "cancelled", "completed"].includes(agg.initiative.status)) {
      throw new InitiativeDomainError({
        code: "INITIATIVE_TRANSITION_NOT_ALLOWED",
        message: "Initiative is not in a restorable terminal state",
      });
    }
    agg.initiative.is_archived = false;
    const { from } = transitionStatus(agg, target, envelope, "restoration_requested");
    persistAggregate(agg);
    return this.ok(agg, from, target, ["Complete restoration review", "Re-approve if required"]);
  }

  /** Detect owner loss and enter owner_required */
  checkAndApplyOwnerRequired(initiativeId: string, actorHumanId: string, envelope: Partial<InitiativeCommandEnvelope>) {
    const agg = loadInitiativeAggregate(initiativeId);
    if (!agg || agg.initiative.status !== "active") return null;
    const loss = detectOwnerEligibilityLoss(agg.initiative.executive_owner_human_id, agg.initiative.operational_owner_human_id);
    if (!loss.owner_required) return null;
    const previous = agg.initiative.status;
    agg.initiative.status = "owner_required";
    writeHistory(
      agg,
      "status_changed",
      actorHumanId,
      { status: previous },
      { status: "owner_required", reasons: loss.reasons },
      "Owner eligibility lost",
      envelope as InitiativeCommandEnvelope
    );
    persistAggregate(agg);
    return loss;
  }

  private ok(
    agg: InitiativeAggregate,
    previous: CanonicalInitiativeStatus | null,
    current: CanonicalInitiativeStatus,
    next: string[],
    events: string[] = [],
    warnings: string[] = []
  ): InitiativeCommandResult {
    return {
      success: true,
      initiative_id: agg.initiative.initiative_id,
      previous_status_optional: previous,
      new_status_optional: current,
      version: agg.initiative.current_version,
      events,
      warnings,
      next_required_actions: next,
      validation_errors: [],
    };
  }
}

export const initiativeDomainService = new InitiativeDomainService();

/** Guard: direct status mutation is forbidden outside the service engine */
export function assertInitiativeMutationViaService() {
  throw new InitiativeDomainError({
    code: "INITIATIVE_DIRECT_MUTATION_FORBIDDEN",
    message: "Initiative mutations must pass through InitiativeDomainService",
    requirement_ids: ["CAE-11.1-W3-SVC-001"],
  });
}
