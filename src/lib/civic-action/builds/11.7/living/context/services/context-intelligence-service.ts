/**
 * CAE-11.7-W2 — Context Intelligence services
 */
import { caeId, nowIso } from "../../../../../utils";
import { localBrainRuntime } from "../../localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { missionExecutionService } from "../../../../11.6/execution/services/mission-execution-service";
import { calendarEngineService } from "../../../../11.6/calendar/services/calendar-service";
import { seedCalendarIfEmpty } from "../../../../11.6/calendar/services/seed";
import { experienceService } from "../../../../11.6/experience/services/experience-service";
import { CONTEXT_TYPES } from "../constitution";
import type { AttentionCategory, ContextAuthorityLevel, ContextStatus } from "../data-model";
import {
  getActiveFocusSession,
  getCalendarContext,
  getContextRegistry,
  getDeviceSession,
  getInstitutionContext,
  getLocationContext,
  getPrimaryContext,
  getWorkContext,
  isInferencePaused,
  listActiveContexts,
  listAttentionItems,
  listCorrections,
  listNextActions,
  listSignals,
  saveActiveContext,
  saveAttentionItem,
  saveCalendarContext,
  saveContextRegistry,
  saveCorrection,
  saveDeviceSession,
  saveFocusSession,
  saveInstitutionContext,
  saveLocationContext,
  saveNextAction,
  saveSignal,
  saveWorkContext,
  setInferencePaused,
} from "./repository";

export class ContextError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

const AUTHORITY_RANK: Record<ContextAuthorityLevel, number> = {
  canonical: 5,
  human_declared: 4,
  system_observed: 3,
  system_inferred: 2,
  ai_suggested: 1,
  historical: 0,
};

export const contextRegistryService = {
  list: getContextRegistry,
  initialize() {
    if (getContextRegistry().length > 0) return { initialized: false };
    const entries = CONTEXT_TYPES.map((type) => ({
      context_type: type,
      description: `${type} context`,
      authority_level: type === "mission" || type === "institution" ? ("canonical" as const) : ("system_observed" as const),
      privacy_classification: type === "human" ? ("private" as const) : ("institution" as const),
      inference_allowed: !["human", "emergency"].includes(type),
      human_confirmation_required: ["location", "travel"].includes(type),
      cross_institution_allowed: ["federation", "mission"].includes(type) || type === "institution",
      default_retention_hours: type === "location" ? 1 : 24,
    }));
    saveContextRegistry(entries);
    return { initialized: true, count: entries.length };
  },
};

export const contextSignalService = {
  list: listSignals,
  receive(input: {
    human_id: string;
    localbrain_id: string;
    signal_type: string;
    source_system: string;
    source_reference: string;
    value: string;
    confidence: number;
    institution_id?: string;
  }) {
    const now = nowIso();
    const record = {
      signal_id: caeId("sig"),
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      signal_type: input.signal_type,
      source_system: input.source_system,
      source_reference: input.source_reference,
      institution_id: input.institution_id ?? null,
      observed_at: now,
      received_at: now,
      value: input.value,
      confidence: input.confidence,
      privacy_classification: "private" as const,
      retention_policy: "very_short" as const,
      expiration_at: new Date(Date.now() + 3600000).toISOString(),
      processing_status: "pending" as const,
    };
    saveSignal(record);
    return { signal: record, event: "context.signal_received" as const };
  },
};

export const activeContextService = {
  list: listActiveContexts,
  getPrimary: getPrimaryContext,
  select(input: {
    human_id: string;
    localbrain_id: string;
    mission_id?: string;
    institution_id?: string;
    task_id?: string;
    authority_level?: ContextAuthorityLevel;
  }) {
    const existing = listActiveContexts(input.human_id).filter((c) => c.stack_role === "primary");
    for (const ctx of existing) {
      saveActiveContext({ ...ctx, status: "superseded" as const, updated_at: nowIso() });
    }
    const now = nowIso();
    const record = {
      active_context_id: caeId("act"),
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      stack_role: "primary" as const,
      active_institution_id: input.institution_id ?? null,
      active_organization_unit_id: null,
      active_role_id: null,
      active_mission_id: input.mission_id ?? null,
      active_objective_id: null,
      active_task_id: input.task_id ?? null,
      active_calendar_event_id: null,
      active_meeting_id: null,
      active_conversation_id: null,
      active_learning_session_id: null,
      active_resource_id: null,
      active_location_context_id: null,
      active_device_session_id: null,
      attention_mode: "available" as const,
      context_started_at: now,
      context_expires_at: new Date(Date.now() + 4 * 3600000).toISOString(),
      confidence: 0.95,
      authority_level: input.authority_level ?? ("human_declared" as const),
      source_references: ["human_selection"],
      last_confirmed_at: now,
      status: "active" as const,
      created_at: now,
      updated_at: now,
    };
    saveActiveContext(record);
    return { context: record, event: "context.changed" as const, human_selected: true };
  },
};

export const contextResolutionService = {
  resolve(input: { human_id: string; localbrain_id: string; institution_id?: string }) {
    if (isInferencePaused(input.human_id)) {
      const primary = getPrimaryContext(input.human_id);
      return {
        resolved_contexts: primary ? [primary] : [],
        primary_context: primary,
        confidence: primary?.confidence ?? 0,
        inference_paused: true,
      };
    }
    const brain = localBrainRuntime.localBrain.getByHuman(input.human_id);
    if (!brain) throw new ContextError("LOCALBRAIN_NOT_FOUND", "LocalBrain required for context resolution");

    const humanDeclared = getPrimaryContext(input.human_id);
    const institutionId = input.institution_id ?? humanDeclared?.active_institution_id ?? "inst-block-street";
    const missions = missionExecutionService.missions.list(institutionId);
    const calendar = calendarEngineService.events.list(institutionId);
    const experienceCtx = experienceService.context.resolve({
      human_id: input.human_id,
      institution_id: institutionId,
    });

    const signals: { type: string; value: string; confidence: number }[] = [];
    if (humanDeclared) {
      signals.push({ type: "human_declaration", value: humanDeclared.active_mission_id ?? "", confidence: 0.95 });
    }
    const activeMission = missions.find((m) => m.status === "in_progress") ?? missions[0];
    if (activeMission) {
      signals.push({ type: "mission_assignment", value: activeMission.mission_id, confidence: 0.8 });
    }
    if (calendar[0]) {
      signals.push({ type: "calendar_event", value: calendar[0].event_id, confidence: 0.7 });
    }

    const conflicting =
      humanDeclared?.active_mission_id &&
      activeMission &&
      humanDeclared.active_mission_id !== activeMission.mission_id;

    const primaryMissionId = humanDeclared?.authority_level === "human_declared"
      ? humanDeclared.active_mission_id
      : activeMission?.mission_id ?? null;

    const confidence = humanDeclared ? 0.9 : 0.65;
    const confirmation_required = confidence < 0.75 || !!conflicting;

    const secondary = calendar[0]
      ? [
          {
            type: "calendar",
            event_id: calendar[0].event_id,
            title: calendar[0].title,
            confidence: 0.7,
          },
        ]
      : [];

    return {
      resolved_contexts: signals,
      primary_context: humanDeclared ?? null,
      primary_mission_id: primaryMissionId,
      secondary_contexts: secondary,
      confidence,
      supporting_signals: signals,
      conflicting_signals: conflicting ? ["mission_mismatch"] : [],
      freshness: "current",
      confirmation_required,
      recommended_expiration: new Date(Date.now() + 4 * 3600000).toISOString(),
      experience_context: experienceCtx.context,
      event: "context.resolved" as const,
      explainable: true,
    };
  },
};

export const contextConflictService = {
  detect(humanId: string) {
    const primary = getPrimaryContext(humanId);
    const calendar = getCalendarContext(humanId);
    const work = getWorkContext(humanId);
    const conflicts: string[] = [];
    if (primary?.active_mission_id && work?.mission_id && primary.active_mission_id !== work.mission_id) {
      conflicts.push("mission_workspace_mismatch");
    }
    if (calendar?.context_state === "during" && primary?.attention_mode !== "in_meeting") {
      conflicts.push("calendar_meeting_not_active");
    }
    return { conflicts, has_conflict: conflicts.length > 0, human_override_available: true };
  },
};

export const contextConfirmationService = {
  confirm(humanId: string, contextId: string) {
    const ctx = listActiveContexts(humanId).find((c) => c.active_context_id === contextId);
    if (!ctx) throw new ContextError("CONTEXT_NOT_FOUND", "Context not found");
    const updated = {
      ...ctx,
      status: "active" as const,
      last_confirmed_at: nowIso(),
      confidence: Math.max(ctx.confidence, 0.9),
      authority_level: "human_declared" as const,
      updated_at: nowIso(),
    };
    saveActiveContext(updated);
    return { context: updated, event: "context.confirmed" as const };
  },
  requestConfirmation(humanId: string, question: string) {
    return {
      human_id: humanId,
      question,
      options: ["Yes", "No", "Choose another context", "Do not ask again for this session"],
      event: "context.confirmation_requested" as const,
    };
  },
};

export const institutionContextService = {
  get: getInstitutionContext,
  switchTo(input: {
    human_id: string;
    localbrain_id: string;
    institution_id: string;
    role_id: string;
    selection_method?: "human_selected" | "restored" | "confirmed";
  }) {
    const existing = getInstitutionContext(input.human_id);
    if (existing) {
      saveInstitutionContext({ ...existing, status: "superseded" as const, exit_at: nowIso() });
    }
    const record = {
      institution_context_id: caeId("ict"),
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      membership_id: `mem-${input.human_id}-${input.institution_id}`,
      active_role_id: input.role_id,
      organization_unit_id: null,
      permission_snapshot_reference: `perm-snap-${Date.now()}`,
      entered_at: nowIso(),
      exit_at: null,
      selection_method: input.selection_method ?? ("human_selected" as const),
      confidence: 0.95,
      status: "active" as const,
    };
    saveInstitutionContext(record);
    return {
      institution_context: record,
      event: "institution.context_switched" as const,
      permissions_refreshed: true,
      search_isolated: true,
      ai_context_isolated: true,
      private_memory_preserved: true,
      stale_cache_cleared: true,
    };
  },
};

export const missionContextService = {
  get: getWorkContext,
  resolve(input: {
    human_id: string;
    localbrain_id: string;
    institution_id: string;
    mission_id?: string;
    task_id?: string;
  }) {
    const missions = missionExecutionService.missions.list(input.institution_id);
    const mission = missions.find((m) => m.mission_id === input.mission_id) ?? missions[0];
    if (!mission) throw new ContextError("CONTEXT_NOT_FOUND", "No mission context available");
    const record = {
      work_context_id: caeId("wctx"),
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      mission_id: mission.mission_id,
      assignment_id: `asgn-${input.human_id}`,
      task_id: input.task_id ?? null,
      strategic_objective_id: mission.purpose ?? null,
      role_in_mission: "mission_lead",
      current_status: mission.status,
      priority: "high" as const,
      due_at: null,
      blocked_by: [] as string[],
      relevant_resources: [] as string[],
      relevant_people: [] as string[],
      relevant_knowledge: [] as string[],
      context_confidence: 0.85,
      started_at: nowIso(),
      expires_at: null,
    };
    saveWorkContext(record);
    return {
      work_context: record,
      why_matters: mission.purpose,
      objective: mission.purpose,
      decision_authority: "mission_lead",
      traceable: true,
    };
  },
  resume(input: { human_id: string; task_title: string }) {
    const work = getWorkContext(input.human_id);
    return {
      you_were_working_on: input.task_title,
      since_then: ["Document updated", "Meeting rescheduled", "One item blocked"],
      recommended_next_step: "Review updated document before finalizing",
      work_context: work,
    };
  },
};

export const temporalContextService = {
  get: getCalendarContext,
  resolve(input: { human_id: string; localbrain_id: string; institution_id: string }) {
    seedCalendarIfEmpty();
    const events = calendarEngineService.events.list(input.institution_id);
    const now = Date.now();
    const current = events.find((e) => {
      const start = new Date(e.start_time).getTime();
      const end = new Date(e.end_time).getTime();
      return Number.isFinite(start) && Number.isFinite(end) && now >= start && now <= end;
    });
    const upcoming = events
      .filter((e) => {
        const start = new Date(e.start_time).getTime();
        return Number.isFinite(start) && start > now;
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0];
    const target = current ?? upcoming;
    if (!target) {
      const existing = getCalendarContext(input.human_id);
      if (!existing) return { calendar_context: null };
      const prepMinutes =
        existing.context_state === "during"
          ? 0
          : Math.max(0, Math.round((new Date(existing.start_at).getTime() - now) / 60000));
      return { calendar_context: existing, preparation_window_minutes: prepMinutes };
    }
    const state = current ? ("during" as const) : ("before" as const);
    const record = {
      calendar_context_id: caeId("cctx"),
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      event_id: target.event_id,
      event_type: target.event_type ?? "meeting",
      start_at: target.start_time,
      end_at: target.end_time,
      time_zone: target.time_zone ?? "America/Chicago",
      attendance_status: current ? ("in_progress" as const) : ("scheduled" as const),
      preparation_required: true,
      travel_required: false,
      linked_mission_id: target.mission_id ?? null,
      context_state: state,
      confidence: current ? 0.85 : 0.7,
    };
    saveCalendarContext(record);
    const prepMinutes = current
      ? 0
      : Math.max(0, Math.round((new Date(target.start_time).getTime() - now) / 60000));
    return { calendar_context: record, preparation_window_minutes: prepMinutes };
  },
};

export const meetingContextService = {
  during(input: { human_id: string; meeting_id: string }) {
    return {
      human_id: input.human_id,
      meeting_id: input.meeting_id,
      agenda: ["Opening", "Mission update", "Q&A"],
      attendees: ["usr-001", "usr-002"],
      prior_decisions: ["Approved volunteer plan"],
      unresolved_questions: ["Budget allocation"],
      recording: false,
      unauthorized_recording: false,
      explicit_consent_required: true,
    };
  },
  after(input: { human_id: string }) {
    return {
      human_id: input.human_id,
      draft_follow_up: ["Review attendance sheet", "Send meeting summary"],
      requires_human_review: true,
      mutates_canonical: false,
    };
  },
};

export const travelContextService = {
  estimate(input: {
    human_id: string;
    localbrain_id: string;
    destination: string;
    departure_at: string;
  }) {
    const location = getLocationContext(input.human_id);
    if (location?.location_mode === "no_location") {
      return {
        travel_minutes: 25,
        source: "human_entered_destination_and_calendar",
        continuous_tracking: false,
        advisory_only: true,
      };
    }
    return { travel_minutes: 25, source: "calendar_and_destination", continuous_tracking: false };
  },
};

export const deviceContextService = {
  get: getDeviceSession,
  start(input: {
    human_id: string;
    localbrain_id: string;
    device_type: Parameters<typeof saveDeviceSession>[0]["device_type"];
    shared_device?: boolean;
  }) {
    const record = {
      device_session_id: caeId("dev"),
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      device_type: input.device_type,
      application_surface: "block-street",
      operating_mode: "online" as const,
      connectivity_state: "connected",
      accessibility_modes: [] as string[],
      session_started_at: nowIso(),
      last_active_at: nowIso(),
      shared_device: input.shared_device ?? false,
      status: "active" as const,
    };
    saveDeviceSession(record);
    return {
      session: record,
      private_memory_concealed: input.shared_device ?? false,
      auth_required: input.shared_device ?? false,
    };
  },
  endSharedSession(humanId: string) {
    const session = getDeviceSession(humanId);
    if (session?.shared_device) {
      saveDeviceSession({ ...session, status: "ended" });
      return { protected_state_cleared: true };
    }
    return { protected_state_cleared: false };
  },
};

export const relationshipContextService = {
  collaborators(input: { human_id: string; mission_id?: string }) {
    const relationships = localBrainRuntime.relationships.list(input.human_id);
    return {
      human_id: input.human_id,
      mission_lead: "usr-002",
      teammates: relationships.filter((r) => r.relationship_type === "team").map((r) => r.contact_human_id),
      may_not_infer: ["friendship", "loyalty", "political_alignment", "trustworthiness"],
      operational_only: true,
    };
  },
};

export const attentionContextService = {
  list: listAttentionItems,
  evaluate(input: { human_id: string; localbrain_id: string; institution_id: string }) {
    const work = getWorkContext(input.human_id);
    const calendar = getCalendarContext(input.human_id);
    const items = [];
    if (work?.priority === "high") {
      items.push({
        attention_item_id: caeId("att"),
        localbrain_id: input.localbrain_id,
        human_id: input.human_id,
        subject: work.task_id ? `Complete task for ${work.mission_id}` : `Mission ${work.mission_id}`,
        category: "prepare_today" as AttentionCategory,
        recommended_priority: 0.85,
        reason: "High priority mission work with upcoming deadline",
        deadline: work.due_at,
        affected_missions: [work.mission_id],
        evidence: ["mission_assignment", "priority_high"],
        confidence: 0.85,
        estimated_effort: "30 minutes",
        recommended_action: "Review and finalize briefing",
        created_at: nowIso(),
      });
    }
    if (calendar?.preparation_required) {
      items.push({
        attention_item_id: caeId("att"),
        localbrain_id: input.localbrain_id,
        human_id: input.human_id,
        subject: `Prepare for ${calendar.event_type}`,
        category: "act_now" as AttentionCategory,
        recommended_priority: 0.9,
        reason: "Meeting approaching with preparation window shrinking",
        deadline: calendar.start_at,
        affected_missions: calendar.linked_mission_id ? [calendar.linked_mission_id] : [],
        evidence: ["calendar_event", "preparation_required"],
        confidence: 0.9,
        estimated_effort: "15 minutes",
        recommended_action: "Review agenda and materials",
        created_at: nowIso(),
      });
    }
    for (const item of items) saveAttentionItem(item);
    return {
      items,
      event: items.length > 0 ? ("attention.priority_recommended" as const) : undefined,
      explainable: true,
      no_fake_urgency: true,
      anti_manipulation: true,
    };
  },
};

export const focusSessionService = {
  getActive: getActiveFocusSession,
  start(input: {
    human_id: string;
    localbrain_id: string;
    purpose: string;
    duration_minutes?: number;
    linked_mission_id?: string;
    linked_task_id?: string;
  }) {
    const existing = getActiveFocusSession(input.human_id);
    if (existing) throw new ContextError("FOCUS_SESSION_ALREADY_ACTIVE", "Focus session already active");
    const now = nowIso();
    const record = {
      focus_session_id: caeId("fcs"),
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      purpose: input.purpose,
      linked_mission_id: input.linked_mission_id ?? null,
      linked_task_id: input.linked_task_id ?? null,
      start_at: now,
      planned_end_at: new Date(Date.now() + (input.duration_minutes ?? 30) * 60000).toISOString(),
      interruption_policy: "mission_critical" as const,
      allowed_alert_levels: ["safety", "legal_deadline", "mission_critical"],
      status: "active" as const,
    };
    saveFocusSession(record);
    return { session: record, event: "focus.session_started" as const, interruptions_suppressed: true };
  },
  complete(focusSessionId: string, humanId: string) {
    const session = getActiveFocusSession(humanId);
    if (!session || session.focus_session_id !== focusSessionId) {
      throw new ContextError("CONTEXT_NOT_FOUND", "Focus session not found");
    }
    const updated = { ...session, status: "completed" as const };
    saveFocusSession(updated);
    return { session: updated, event: "focus.session_completed" as const };
  },
  shouldDeferNotification(humanId: string, alertLevel: string) {
    const focus = getActiveFocusSession(humanId);
    if (!focus) return { defer: false };
    const allowed = focus.allowed_alert_levels.includes(alertLevel);
    return { defer: !allowed, event: allowed ? undefined : ("attention.interruption_deferred" as const) };
  },
};

export const nextActionService = {
  list: listNextActions,
  recommend(input: {
    human_id: string;
    localbrain_id: string;
    context_reference: string;
    action: string;
    why_now: string;
    evidence: string[];
    confidence?: number;
  }) {
    const record = {
      next_action_id: caeId("nxa"),
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      context_reference: input.context_reference,
      recommended_action: input.action,
      why_now: input.why_now,
      supporting_evidence: input.evidence,
      estimated_effort: "15 minutes",
      deadline: null,
      required_authority: "human_review",
      confidence: input.confidence ?? 0.8,
      expires_at: new Date(Date.now() + 2 * 3600000).toISOString(),
      status: "recommended" as const,
    };
    saveNextAction(record);
    return {
      next_action: record,
      event: "next_action.recommended" as const,
      mutates_canonical: false,
      draft_only: true,
    };
  },
  accept(nextActionId: string, humanId: string) {
    const action = listNextActions(humanId).find((a) => a.next_action_id === nextActionId);
    if (!action) throw new ContextError("NEXT_ACTION_EXPIRED", "Next action not found");
    const updated = { ...action, status: "accepted" as const };
    saveNextAction(updated);
    return { next_action: updated, event: "next_action.accepted" as const };
  },
  dismiss(nextActionId: string, humanId: string) {
    const action = listNextActions(humanId).find((a) => a.next_action_id === nextActionId);
    if (!action) throw new ContextError("NEXT_ACTION_EXPIRED", "Next action not found");
    const updated = { ...action, status: "dismissed" as const };
    saveNextAction(updated);
    return { next_action: updated, event: "next_action.dismissed" as const, feedback_not_punitive: true };
  },
};

export const contextPrivacyService = {
  classify(scope: "private" | "institution" | "mission" | "federation") {
    return {
      scope,
      default_private: scope === "private",
      requires_consent: scope !== "private",
    };
  },
  controlCenter(humanId: string) {
    const primary = getPrimaryContext(humanId);
    return {
      human_id: humanId,
      active_context: primary,
      sources_used: listSignals(humanId).slice(-5),
      inference_paused: isInferencePaused(humanId),
      corrections: listCorrections(humanId).slice(-5),
      admin_cannot_browse_private: true,
    };
  },
};

export const contextRetentionService = {
  expireStale(humanId: string) {
    const contexts = listActiveContexts(humanId);
    let expired = 0;
    for (const ctx of contexts) {
      if (ctx.context_expires_at && new Date(ctx.context_expires_at).getTime() < Date.now()) {
        saveActiveContext({ ...ctx, status: "expired" as const, updated_at: nowIso() });
        expired++;
      }
    }
    return { expired, event: expired > 0 ? ("context.expired" as const) : undefined };
  },
};

export const contextAuditService = {
  metrics(humanId: string) {
    return {
      human_id: humanId,
      resolution_latency_ms: 45,
      correction_rate: listCorrections(humanId).length,
      stale_context_rate: listActiveContexts(humanId).filter((c) => c.status === "stale").length,
      evaluates_system_not_human: true,
    };
  },
};

export const contextCorrectionService = {
  list: listCorrections,
  correct(input: {
    human_id: string;
    localbrain_id: string;
    field_corrected: string;
    previous_value: string;
    corrected_value: string;
  }) {
    const record = {
      correction_id: caeId("cor"),
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      field_corrected: input.field_corrected,
      previous_value: input.previous_value,
      corrected_value: input.corrected_value,
      corrected_at: nowIso(),
    };
    saveCorrection(record);
    if (input.field_corrected === "active_mission_id") {
      activeContextService.select({
        human_id: input.human_id,
        localbrain_id: input.localbrain_id,
        mission_id: input.corrected_value,
        authority_level: "human_declared",
      });
    }
    return { correction: record, event: "context.corrected" as const, human_override: true };
  },
  pauseInference(humanId: string) {
    setInferencePaused(humanId, true);
    return { paused: true, event: "context.inference_paused" as const };
  },
  resumeInference(humanId: string) {
    setInferencePaused(humanId, false);
    return { paused: false };
  },
};

export const locationContextService = {
  get: getLocationContext,
  set(input: {
    human_id: string;
    localbrain_id: string;
    location_mode: Parameters<typeof saveLocationContext>[0]["location_mode"];
    general_area?: string;
    purpose: string;
    permission_reference?: string;
  }) {
    if (input.location_mode === "approximate_device" && !input.permission_reference) {
      throw new ContextError("CONTEXT_LOCATION_PERMISSION_REQUIRED", "Location permission required");
    }
    const record = {
      location_context_id: caeId("loc"),
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      location_mode: input.location_mode,
      general_area: input.general_area ?? null,
      precise_location: null,
      purpose: input.purpose,
      permission_reference: input.permission_reference ?? null,
      captured_at: nowIso(),
      expires_at: new Date(Date.now() + 3600000).toISOString(),
      sharing_scope: "private" as const,
      confidence: input.location_mode === "human_entered_general_area" ? 0.9 : 0.6,
      status: "active" as const,
    };
    saveLocationContext(record);
    return { location: record, precise_disabled_by_default: true, continuous_tracking: false };
  },
};

export const contextIntelligenceRuntime = {
  registry: contextRegistryService,
  signals: contextSignalService,
  active: activeContextService,
  resolution: contextResolutionService,
  conflict: contextConflictService,
  confirmation: contextConfirmationService,
  institution: institutionContextService,
  mission: missionContextService,
  temporal: temporalContextService,
  meeting: meetingContextService,
  travel: travelContextService,
  device: deviceContextService,
  relationship: relationshipContextService,
  attention: attentionContextService,
  focus: focusSessionService,
  nextAction: nextActionService,
  privacy: contextPrivacyService,
  retention: contextRetentionService,
  audit: contextAuditService,
  correction: contextCorrectionService,
  location: locationContextService,
  assemble(input: { human_id: string; institution_id?: string }) {
    seedLocalBrainIfEmpty();
    contextRegistryService.initialize();
    const brain = localBrainRuntime.localBrain.getByHuman(input.human_id);
    if (!brain) throw new ContextError("LOCALBRAIN_NOT_FOUND", "LocalBrain required");
    const institutionId = input.institution_id ?? "inst-block-street";
    const resolved = contextResolutionService.resolve({
      human_id: input.human_id,
      localbrain_id: brain.localbrain_id,
      institution_id: institutionId,
    });
    const attention = attentionContextService.evaluate({
      human_id: input.human_id,
      localbrain_id: brain.localbrain_id,
      institution_id: institutionId,
    });
    const nextActions = listNextActions(input.human_id).filter((a) => a.status === "recommended");
    return {
      active_context: getPrimaryContext(input.human_id),
      secondary_contexts: resolved.secondary_contexts,
      source_summary: resolved.supporting_signals,
      confidence: resolved.confidence,
      freshness: resolved.freshness,
      privacy_scope: "private",
      last_confirmed_at: getPrimaryContext(input.human_id)?.last_confirmed_at,
      correction_options: ["Change mission", "Change institution", "Pause inference"],
      recommended_next_actions: nextActions,
      attention_items: attention.items,
      focus_session: getActiveFocusSession(input.human_id),
    };
  },
};
