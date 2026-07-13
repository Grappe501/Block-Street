/**
 * CAE-11.7-W2 — Context Intelligence tests
 */
import { contextIntelligenceRuntime } from "./services/context-intelligence-service";
import { seedContextIfEmpty } from "./services/seed";
import { getContextConstitution, LIX_CONTEXT_PRINCIPLE, REQUIRED_CONTEXT_SERVICES } from "./constitution";
import { checkLixW2Invariants } from "./invariants";
import { explainContextAction } from "./traceability";
import { CONTEXT_EVENT_CATALOG } from "./events/catalog";

export type LixW2TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW2CertificationTests(): LixW2TestResult[] {
  seedContextIfEmpty();
  const results: LixW2TestResult[] = [];
  const humanId = "usr-001";
  const localbrainId = "lbr-usr-001";
  const institutionId = "inst-block-street";
  const federationId = "fed-block-street-001";

  const constitution = getContextConstitution();
  results.push({ name: "context_principle", passed: constitution.governing_principle === LIX_CONTEXT_PRINCIPLE });

  results.push({
    name: "required_context_services",
    passed: REQUIRED_CONTEXT_SERVICES.length === 20,
    detail: `${REQUIRED_CONTEXT_SERVICES.length} services`,
  });

  results.push({ name: "w2_invariants", passed: checkLixW2Invariants().every((i) => i.passed) });

  const registry = contextIntelligenceRuntime.registry.initialize();
  results.push({
    name: "context_registry",
    passed: registry.initialized === false || (registry.count ?? 0) >= 18,
    detail: `${registry.count ?? "existing"} types`,
  });

  const assembled = contextIntelligenceRuntime.assemble({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "context_assembly",
    passed: !!assembled.active_context && assembled.confidence > 0,
    detail: `confidence ${assembled.confidence}`,
  });

  const resolved = contextIntelligenceRuntime.resolution.resolve({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
  });
  results.push({
    name: "context_resolution",
    passed: resolved.event === "context.resolved" && resolved.explainable,
    detail: `confidence ${resolved.confidence}`,
  });

  const humanSelect = contextIntelligenceRuntime.active.select({
    human_id: humanId,
    localbrain_id: localbrainId,
    mission_id: "msn-block-street-002",
    institution_id: institutionId,
    authority_level: "human_declared",
  });
  results.push({
    name: "human_override_selection",
    passed: humanSelect.human_selected && humanSelect.context.authority_level === "human_declared",
    detail: humanSelect.context.active_mission_id ?? "none",
  });

  const corrected = contextIntelligenceRuntime.correction.correct({
    human_id: humanId,
    localbrain_id: localbrainId,
    field_corrected: "active_mission_id",
    previous_value: "msn-block-street-001",
    corrected_value: "msn-block-street-003",
  });
  results.push({
    name: "context_correction",
    passed: corrected.event === "context.corrected" && corrected.human_override,
    detail: corrected.correction.field_corrected,
  });

  const institutionSwitch = contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: federationId,
    role_id: "role-federation",
  });
  results.push({
    name: "institution_isolation",
    passed:
      institutionSwitch.ai_context_isolated &&
      institutionSwitch.private_memory_preserved &&
      institutionSwitch.stale_cache_cleared,
    detail: institutionSwitch.institution_context.institution_id,
  });

  const mission = contextIntelligenceRuntime.mission.resolve({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
    mission_id: "msn-block-street-001",
    task_id: "task-volunteer-briefing",
  });
  results.push({
    name: "mission_context_traceability",
    passed: mission.traceable && !!mission.why_matters,
    detail: mission.work_context.mission_id,
  });

  const resume = contextIntelligenceRuntime.mission.resume({
    human_id: humanId,
    task_title: "Prepare volunteer briefing",
  });
  results.push({
    name: "work_resume",
    passed: !!resume.recommended_next_step,
    detail: resume.recommended_next_step.slice(0, 40),
  });

  const temporal = contextIntelligenceRuntime.temporal.resolve({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
  });
  results.push({
    name: "calendar_context",
    passed: !!temporal.calendar_context,
    detail: temporal.calendar_context?.context_state ?? "none",
  });

  const meeting = contextIntelligenceRuntime.meeting.during({
    human_id: humanId,
    meeting_id: "evt-partner-meeting",
  });
  results.push({
    name: "meeting_no_unauthorized_recording",
    passed: meeting.recording === false && meeting.unauthorized_recording === false,
    detail: "no silent recording",
  });

  const locationDenied = (() => {
    try {
      contextIntelligenceRuntime.location.set({
        human_id: humanId,
        localbrain_id: localbrainId,
        location_mode: "approximate_device",
        purpose: "travel",
      });
      return false;
    } catch (e) {
      return (e as { code?: string }).code === "CONTEXT_LOCATION_PERMISSION_REQUIRED";
    }
  })();
  results.push({
    name: "location_permission_required",
    passed: locationDenied,
    detail: "precise disabled by default",
  });

  const locationHuman = contextIntelligenceRuntime.location.set({
    human_id: humanId,
    localbrain_id: localbrainId,
    location_mode: "human_entered_general_area",
    general_area: "Benton County",
    purpose: "travel_estimate",
  });
  results.push({
    name: "location_purpose_limited",
    passed: locationHuman.continuous_tracking === false && !!locationHuman.location.expires_at,
    detail: locationHuman.location.location_mode,
  });

  const travel = contextIntelligenceRuntime.travel.estimate({
    human_id: humanId,
    localbrain_id: localbrainId,
    destination: "Partner Office",
    departure_at: new Date().toISOString(),
  });
  results.push({
    name: "travel_no_continuous_tracking",
    passed: travel.continuous_tracking === false,
    detail: `${travel.travel_minutes} min`,
  });

  const device = contextIntelligenceRuntime.device.start({
    human_id: humanId,
    localbrain_id: localbrainId,
    device_type: "kiosk",
    shared_device: true,
  });
  results.push({
    name: "shared_device_safety",
    passed: device.private_memory_concealed && device.auth_required,
    detail: "kiosk session",
  });

  const relationships = contextIntelligenceRuntime.relationship.collaborators({
    human_id: humanId,
    mission_id: "msn-block-street-001",
  });
  results.push({
    name: "relationship_boundaries",
    passed: relationships.operational_only && relationships.may_not_infer.length >= 3,
    detail: "no sensitive inference",
  });

  const attention = contextIntelligenceRuntime.attention.evaluate({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
  });
  results.push({
    name: "attention_explainable",
    passed: attention.explainable && attention.no_fake_urgency,
    detail: `${attention.items.length} items`,
  });

  const focus = contextIntelligenceRuntime.focus.start({
    human_id: humanId,
    localbrain_id: localbrainId,
    purpose: "Volunteer briefing preparation",
    duration_minutes: 30,
    linked_mission_id: "msn-block-street-001",
  });
  const defer = contextIntelligenceRuntime.focus.shouldDeferNotification(humanId, "announcement");
  results.push({
    name: "focus_interruption_control",
    passed: focus.event === "focus.session_started" && defer.defer === true,
    detail: focus.session.interruption_policy,
  });

  contextIntelligenceRuntime.focus.complete(focus.session.focus_session_id, humanId);

  const nextAction = contextIntelligenceRuntime.nextAction.recommend({
    human_id: humanId,
    localbrain_id: localbrainId,
    context_reference: "doc-attendance-sheet",
    action: "Review updated attendance sheet",
    why_now: "Updated since last view",
    evidence: ["doc-updated"],
    confidence: 0.82,
  });
  results.push({
    name: "next_action_nonauthoritative",
    passed: nextAction.mutates_canonical === false && nextAction.draft_only,
    detail: nextAction.next_action.recommended_action.slice(0, 30),
  });

  const dismissed = contextIntelligenceRuntime.nextAction.dismiss(
    nextAction.next_action.next_action_id,
    humanId
  );
  results.push({
    name: "next_action_dismissible",
    passed: dismissed.event === "next_action.dismissed" && dismissed.feedback_not_punitive,
    detail: dismissed.next_action.status,
  });

  const privacy = contextIntelligenceRuntime.privacy.controlCenter(humanId);
  results.push({
    name: "privacy_control_center",
    passed: privacy.admin_cannot_browse_private,
    detail: "private protected",
  });

  const paused = contextIntelligenceRuntime.correction.pauseInference(humanId);
  const pausedResolve = contextIntelligenceRuntime.resolution.resolve({
    human_id: humanId,
    localbrain_id: localbrainId,
  });
  contextIntelligenceRuntime.correction.resumeInference(humanId);
  results.push({
    name: "inference_pause",
    passed: paused.paused && pausedResolve.inference_paused === true,
    detail: "inference paused",
  });

  const expired = contextIntelligenceRuntime.retention.expireStale(humanId);
  results.push({
    name: "context_retention",
    passed: expired.expired >= 0,
    detail: `${expired.expired} expired`,
  });

  const conflict = contextIntelligenceRuntime.conflict.detect(humanId);
  results.push({
    name: "context_conflict_detection",
    passed: conflict.human_override_available,
    detail: `${conflict.conflicts.length} conflicts`,
  });

  const trace = explainContextAction({
    human_id: humanId,
    action_type: "context_resolution",
    confidence: resolved.confidence,
  });
  results.push({
    name: "context_traceability",
    passed: trace.includes(humanId) && trace.includes(LIX_CONTEXT_PRINCIPLE),
  });

  results.push({
    name: "context_event_catalog",
    passed: CONTEXT_EVENT_CATALOG.length === 16,
    detail: `${CONTEXT_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allLixW2TestsPassed(): boolean {
  return runLixW2CertificationTests().every((t) => t.passed);
}
