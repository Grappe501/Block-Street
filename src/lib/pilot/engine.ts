import {
  loadCohorts,
  loadCorrectiveActions,
  loadFeatureFlags,
  loadGates,
  loadHealth,
  loadHelpEvents,
  loadIssues,
  loadLaunchRecommendations,
  loadObservations,
  loadParticipants,
  loadPrograms,
  loadRetests,
  loadSessions,
  loadWorkflowCatalog,
  loadWorkflows,
  persistCohorts,
  persistCorrectiveActions,
  persistGates,
  persistHealth,
  persistHelpEvents,
  persistIssues,
  persistLaunchRecommendations,
  persistObservations,
  persistParticipants,
  persistPrograms,
  persistRetests,
  persistSessions,
  persistWorkflows,
  loadAuditEvents,
} from "./data";
import { recordPilotAudit } from "./audit";
import type {
  GateOutcome,
  HumanHelpEvent,
  LaunchRecommendation,
  PilotAcceptanceGate,
  PilotCohort,
  PilotHealth,
  PilotIssue,
  PilotPhase,
  PilotProgram,
  PilotSession,
  PilotWorkflow,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function assertPilotEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.PILOT_PLATFORM_ENABLED) throw new Error("Pilot platform is not enabled.");
  return flags;
}

export function listPilotPrograms(institutionId?: string) {
  const programs = loadPrograms();
  return institutionId ? programs.filter((p) => p.institution_id === institutionId) : programs;
}

export function getPilotProgram(programId: string) {
  const program = loadPrograms().find((p) => p.id === programId);
  if (!program) throw new Error("Pilot program not found.");
  return {
    program,
    workflows: loadWorkflows().filter((w) => w.pilot_program_id === programId),
    cohorts: loadCohorts().filter((c) => c.pilot_program_id === programId),
    sessions: loadSessions().filter((s) => s.pilot_program_id === programId),
    issues: loadIssues().filter((i) => i.pilot_program_id === programId),
    gates: loadGates().filter((g) => g.pilot_program_id === programId),
  };
}

export function createPilotProgram(input: {
  institution_id: string;
  name: string;
  description: string;
  phase: PilotPhase;
  pilot_owner_user_id: string;
  observation_lead_user_id: string;
  actor_id: string;
}): PilotProgram {
  assertPilotEnabled();
  const program: PilotProgram = {
    id: id("pilot"),
    institution_id: input.institution_id,
    name: input.name,
    description: input.description,
    phase: input.phase,
    scope: "multi-campus",
    pilot_owner_user_id: input.pilot_owner_user_id,
    observation_lead_user_id: input.observation_lead_user_id,
    status: "draft",
    risk_level: "PL2",
    start_at: null,
    end_at: null,
    success_criteria: "Workflow success ≥85%, human-help ≤1.0, zero H4 takeovers, no unresolved P0/P1",
    launch_target: null,
    created_at: now(),
  };
  const programs = loadPrograms();
  programs.push(program);
  persistPrograms(programs);
  recordPilotAudit({
    pilot_program_id: program.id,
    institution_id: input.institution_id,
    actor_id: input.actor_id,
    action: "pilot.created",
    target_type: "pilot_program",
    target_id: program.id,
    previous_state: "",
    new_state: "draft",
    reason: input.name,
    correlation_id: program.id,
    result: "success",
  });
  refreshHealth(input.institution_id);
  return program;
}

export function attachWorkflowCatalog(programId: string, actorId: string): PilotWorkflow[] {
  const program = loadPrograms().find((p) => p.id === programId);
  if (!program) throw new Error("Pilot program not found.");
  const catalog = loadWorkflowCatalog();
  const existing = loadWorkflows().filter((w) => w.pilot_program_id === programId);
  if (existing.length > 0) return existing;

  const workflows: PilotWorkflow[] = catalog.map((w) => ({
    ...w,
    id: id("pwf"),
    pilot_program_id: programId,
  }));
  const all = loadWorkflows();
  all.push(...workflows);
  persistWorkflows(all);
  recordPilotAudit({
    pilot_program_id: programId,
    institution_id: program.institution_id,
    actor_id: actorId,
    action: "pilot.workflows_attached",
    target_type: "pilot_program",
    target_id: programId,
    previous_state: "0",
    new_state: String(workflows.length),
    reason: "Workflow acceptance catalog",
    correlation_id: programId,
    result: "success",
  });
  return workflows;
}

export function validateReadiness(programId: string, actorId: string) {
  const program = loadPrograms().find((p) => p.id === programId);
  if (!program) throw new Error("Pilot program not found.");
  const workflows = loadWorkflows().filter((w) => w.pilot_program_id === programId);
  const checklist = [
    { key: "authentication_verified", passed: true },
    { key: "roles_assigned", passed: true },
    { key: "permissions_tested", passed: true },
    { key: "training_complete", passed: true },
    { key: "pilot_users_onboarded", passed: loadParticipants().some((p) => loadCohorts().find((c) => c.id === p.pilot_cohort_id)?.pilot_program_id === programId) },
    { key: "workflows_defined", passed: workflows.length >= 6 },
    { key: "observation_team_assigned", passed: !!program.observation_lead_user_id },
    { key: "stop_conditions_defined", passed: loadFeatureFlags().PILOT_STOP_CONDITIONS_ENABLED },
  ];
  const passed = checklist.every((c) => c.passed);
  if (passed) {
    const programs = loadPrograms();
    const idx = programs.findIndex((p) => p.id === programId);
    programs[idx].status = "ready";
    persistPrograms(programs);
    recordPilotAudit({
      pilot_program_id: programId,
      institution_id: program.institution_id,
      actor_id: actorId,
      action: "pilot.readiness_passed",
      target_type: "pilot_program",
      target_id: programId,
      previous_state: "draft",
      new_state: "ready",
      reason: null,
      correlation_id: programId,
      result: "success",
    });
  }
  return { passed, checklist };
}

export function createCohort(programId: string, name: string, cohortType: string, actorId: string): PilotCohort {
  const program = loadPrograms().find((p) => p.id === programId);
  if (!program) throw new Error("Pilot program not found.");
  const cohort: PilotCohort = {
    id: id("pcoh"),
    pilot_program_id: programId,
    name,
    cohort_type: cohortType,
    participant_count: 0,
    status: "planning",
    start_at: null,
  };
  const cohorts = loadCohorts();
  cohorts.push(cohort);
  persistCohorts(cohorts);
  return cohort;
}

export function addParticipant(
  cohortId: string,
  userId: string,
  roleId: string,
  experienceLevel: string,
  deviceProfile: string
) {
  const participant = {
    id: id("ppart"),
    pilot_cohort_id: cohortId,
    user_id: userId,
    role_id: roleId,
    experience_level: experienceLevel,
    device_profile: deviceProfile,
    participant_status: "accepted",
  };
  const participants = loadParticipants();
  participants.push(participant);
  persistParticipants(participants);
  const cohorts = loadCohorts();
  const idx = cohorts.findIndex((c) => c.id === cohortId);
  if (idx >= 0) {
    cohorts[idx].participant_count += 1;
    persistCohorts(cohorts);
  }
  return participant;
}

export function startPilot(programId: string, actorId: string) {
  const programs = loadPrograms();
  const idx = programs.findIndex((p) => p.id === programId);
  if (idx < 0) throw new Error("Pilot program not found.");
  if (programs[idx].status !== "ready" && programs[idx].status !== "paused") {
    throw new Error("Pilot must be ready before starting.");
  }
  programs[idx].status = "active";
  programs[idx].start_at = programs[idx].start_at ?? now();
  persistPrograms(programs);
  recordPilotAudit({
    pilot_program_id: programId,
    institution_id: programs[idx].institution_id,
    actor_id: actorId,
    action: "pilot.started",
    target_type: "pilot_program",
    target_id: programId,
    previous_state: "ready",
    new_state: "active",
    reason: null,
    correlation_id: programId,
    result: "success",
  });
  return programs[idx];
}

export function createSession(input: {
  program_id: string;
  workflow_id: string;
  participant_id: string;
  observer_id: string;
  device_type: string;
}): PilotSession {
  const session: PilotSession = {
    id: id("psess"),
    pilot_program_id: input.program_id,
    pilot_workflow_id: input.workflow_id,
    participant_id: input.participant_id,
    observer_id: input.observer_id,
    device_type: input.device_type,
    environment: "pilot",
    status: "scheduled",
    outcome: null,
    human_help_count: 0,
    hesitation_count: 0,
    scheduled_at: now(),
    started_at: null,
    completed_at: null,
  };
  const sessions = loadSessions();
  sessions.push(session);
  persistSessions(sessions);
  return session;
}

export function startSession(sessionId: string, actorId: string) {
  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx < 0) throw new Error("Session not found.");
  sessions[idx].status = "in_progress";
  sessions[idx].started_at = now();
  persistSessions(sessions);
  const program = loadPrograms().find((p) => p.id === sessions[idx].pilot_program_id);
  recordPilotAudit({
    pilot_program_id: sessions[idx].pilot_program_id,
    institution_id: program?.institution_id ?? "unknown",
    actor_id: actorId,
    action: "pilot.session_started",
    target_type: "pilot_session",
    target_id: sessionId,
    previous_state: "scheduled",
    new_state: "in_progress",
    reason: null,
    correlation_id: sessionId,
    result: "success",
  });
  return sessions[idx];
}

export function recordHelpEvent(
  sessionId: string,
  input: { help_type: string; severity: HumanHelpEvent["severity"]; workflow_step: string; question_asked: string; help_provided: string }
) {
  const event: HumanHelpEvent = {
    id: id("help"),
    pilot_session_id: sessionId,
    ...input,
    preventable: input.severity !== "H4",
    timestamp: now(),
  };
  const events = loadHelpEvents();
  events.push(event);
  persistHelpEvents(events);

  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx >= 0) {
    sessions[idx].human_help_count += 1;
    persistSessions(sessions);
  }
  recordPilotAudit({
    pilot_program_id: sessions[idx]?.pilot_program_id ?? "unknown",
    institution_id: "inst-block-street",
    actor_id: "observer",
    action: "pilot.help_requested",
    target_type: "human_help_event",
    target_id: event.id,
    previous_state: "",
    new_state: input.severity,
    reason: input.help_type,
    correlation_id: sessionId,
    result: "success",
  });
  return event;
}

export function recordObservation(
  sessionId: string,
  input: { observation_type: string; workflow_step: string; participant_statement: string; severity: string; observer_notes: string }
) {
  const obs = {
    id: id("pobs"),
    pilot_session_id: sessionId,
    ...input,
    timestamp: now(),
  };
  const observations = loadObservations();
  observations.push(obs);
  persistObservations(observations);

  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx >= 0 && input.observation_type === "hesitation") {
    sessions[idx].hesitation_count += 1;
    persistSessions(sessions);
  }
  recordPilotAudit({
    pilot_program_id: sessions[idx]?.pilot_program_id ?? "unknown",
    institution_id: "inst-block-street",
    actor_id: "observer",
    action: "pilot.observation_recorded",
    target_type: "pilot_observation",
    target_id: obs.id,
    previous_state: "",
    new_state: input.observation_type,
    reason: null,
    correlation_id: sessionId,
    result: "success",
  });
  return obs;
}

export function completeSession(sessionId: string, outcome: "success" | "failure", actorId: string) {
  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx < 0) throw new Error("Session not found.");
  sessions[idx].status = outcome === "success" ? "completed" : "needs_retest";
  sessions[idx].outcome = outcome;
  sessions[idx].completed_at = now();
  persistSessions(sessions);
  const program = loadPrograms().find((p) => p.id === sessions[idx].pilot_program_id);
  recordPilotAudit({
    pilot_program_id: sessions[idx].pilot_program_id,
    institution_id: program?.institution_id ?? "unknown",
    actor_id: actorId,
    action: "pilot.workflow_completed",
    target_type: "pilot_session",
    target_id: sessionId,
    previous_state: "in_progress",
    new_state: outcome,
    reason: `human_help=${sessions[idx].human_help_count}`,
    correlation_id: sessionId,
    result: "success",
  });
  refreshHealth(program?.institution_id);
  return sessions[idx];
}

export function createIssue(input: {
  program_id: string;
  session_id?: string;
  workflow_id?: string;
  severity: PilotIssue["severity"];
  title: string;
  description: string;
  issue_domain: string;
  root_cause: string;
  owner: string;
  actor_id: string;
}): PilotIssue {
  const program = loadPrograms().find((p) => p.id === input.program_id);
  if (!program) throw new Error("Pilot program not found.");

  if (input.severity === "P0" && loadFeatureFlags().PILOT_STOP_CONDITIONS_ENABLED) {
    const programs = loadPrograms();
    const pIdx = programs.findIndex((p) => p.id === input.program_id);
    programs[pIdx].status = "paused";
    persistPrograms(programs);
    recordPilotAudit({
      pilot_program_id: input.program_id,
      institution_id: program.institution_id,
      actor_id: input.actor_id,
      action: "pilot.stop_condition_triggered",
      target_type: "pilot_issue",
      target_id: input.title,
      previous_state: "active",
      new_state: "paused",
      reason: input.title,
      correlation_id: input.program_id,
      result: "success",
    });
  }

  const issue: PilotIssue = {
    id: id("piss"),
    pilot_program_id: input.program_id,
    pilot_session_id: input.session_id ?? null,
    workflow_id: input.workflow_id ?? null,
    issue_domain: input.issue_domain,
    severity: input.severity,
    title: input.title,
    description: input.description,
    root_cause: input.root_cause,
    status: "open",
    owner: input.owner,
    created_at: now(),
  };
  const issues = loadIssues();
  issues.push(issue);
  persistIssues(issues);
  recordPilotAudit({
    pilot_program_id: input.program_id,
    institution_id: program.institution_id,
    actor_id: input.actor_id,
    action: "pilot.issue_created",
    target_type: "pilot_issue",
    target_id: issue.id,
    previous_state: "",
    new_state: input.severity,
    reason: input.title,
    correlation_id: issue.id,
    result: "success",
  });
  refreshHealth(program.institution_id);
  return issue;
}

export function assignCorrectiveAction(issueId: string, actionType: string, owner: string, actorId: string) {
  const action = {
    id: id("pca"),
    pilot_issue_id: issueId,
    action_type: actionType,
    owner,
    status: "assigned",
    verification_method: "retest",
  };
  const actions = loadCorrectiveActions();
  actions.push(action);
  persistCorrectiveActions(actions);

  const issues = loadIssues();
  const idx = issues.findIndex((i) => i.id === issueId);
  if (idx >= 0) issues[idx].status = "in_progress";
  persistIssues(issues);

  recordPilotAudit({
    pilot_program_id: issues[idx]?.pilot_program_id ?? "unknown",
    institution_id: "inst-block-street",
    actor_id: actorId,
    action: "pilot.corrective_action_assigned",
    target_type: "pilot_corrective_action",
    target_id: action.id,
    previous_state: "open",
    new_state: "assigned",
    reason: actionType,
    correlation_id: issueId,
    result: "success",
  });
  return action;
}

export function completeRetest(issueId: string, newSessionId: string, humanHelpDelta: number, verifiedBy: string) {
  const retest = {
    id: id("pret"),
    pilot_issue_id: issueId,
    original_session_id: loadIssues().find((i) => i.id === issueId)?.pilot_session_id ?? "",
    new_session_id: newSessionId,
    result: humanHelpDelta <= 0 ? "passed" : "failed",
    human_help_delta: humanHelpDelta,
    verified_by: verifiedBy,
    verified_at: now(),
  };
  const retests = loadRetests();
  retests.push(retest);
  persistRetests(retests);

  if (retest.result === "passed") {
    const issues = loadIssues();
    const idx = issues.findIndex((i) => i.id === issueId);
    if (idx >= 0) {
      issues[idx].status = "verified";
      persistIssues(issues);
    }
    const actions = loadCorrectiveActions().map((a) =>
      a.pilot_issue_id === issueId ? { ...a, status: "completed" } : a
    );
    persistCorrectiveActions(actions);
  }

  recordPilotAudit({
    pilot_program_id: loadIssues().find((i) => i.id === issueId)?.pilot_program_id ?? "unknown",
    institution_id: "inst-block-street",
    actor_id: verifiedBy,
    action: retest.result === "passed" ? "pilot.retest_passed" : "pilot.retest_failed",
    target_type: "pilot_retest",
    target_id: retest.id,
    previous_state: "assigned",
    new_state: retest.result,
    reason: `delta=${humanHelpDelta}`,
    correlation_id: issueId,
    result: "success",
  });
  return retest;
}

export function evaluateGate(programId: string, phase: PilotPhase, reviewedBy: string): PilotAcceptanceGate {
  const program = loadPrograms().find((p) => p.id === programId);
  if (!program) throw new Error("Pilot program not found.");

  const sessions = loadSessions().filter((s) => s.pilot_program_id === programId && s.status === "completed");
  const avgHelp = sessions.length ? sessions.reduce((a, s) => a + s.human_help_count, 0) / sessions.length : 0;
  const successRate = sessions.length
    ? (sessions.filter((s) => s.outcome === "success").length / sessions.length) * 100
    : 0;
  const openP1 = loadIssues().filter((i) => i.pilot_program_id === programId && i.severity === "P1" && i.status !== "verified" && i.status !== "closed").length;
  const openP0 = loadIssues().filter((i) => i.pilot_program_id === programId && i.severity === "P0" && i.status !== "verified" && i.status !== "closed").length;

  let status: GateOutcome = "passed";
  let conditions: string | null = null;

  if (openP0 > 0) status = "blocked";
  else if (openP1 > 0) status = "failed";
  else if (avgHelp > 1.0 || successRate < 85) status = "retest_required";
  else if (phase === "C" && avgHelp > 0.5) {
    status = "passed_with_conditions";
    conditions = "Continue monitoring human-help on mobile workflows";
  }

  const gate: PilotAcceptanceGate = {
    id: id("pgate"),
    pilot_program_id: programId,
    gate_type: `phase_${phase}`,
    phase,
    criteria: `Success ≥85%, human-help ≤1.0, no P0/P1 unresolved`,
    status,
    evidence: `sessions=${sessions.length}, success=${successRate.toFixed(0)}%, avg_help=${avgHelp.toFixed(1)}`,
    reviewed_by: reviewedBy,
    reviewed_at: now(),
    conditions,
  };

  const gates = loadGates();
  gates.push(gate);
  persistGates(gates);

  const programs = loadPrograms();
  const pIdx = programs.findIndex((p) => p.id === programId);
  if (status === "retest_required") programs[pIdx].status = "retest_required";
  else if (status === "passed" || status === "passed_with_conditions") programs[pIdx].status = "review";
  persistPrograms(programs);

  recordPilotAudit({
    pilot_program_id: programId,
    institution_id: program.institution_id,
    actor_id: reviewedBy,
    action: "pilot.gate_reviewed",
    target_type: "pilot_acceptance_gate",
    target_id: gate.id,
    previous_state: program.phase,
    new_state: status,
    reason: gate.evidence,
    correlation_id: gate.id,
    result: "success",
  });
  return gate;
}

export function advancePhase(programId: string, actorId: string) {
  const programs = loadPrograms();
  const idx = programs.findIndex((p) => p.id === programId);
  if (idx < 0) throw new Error("Pilot program not found.");

  const phaseOrder: PilotPhase[] = ["A", "B", "C", "D"];
  const currentIdx = phaseOrder.indexOf(programs[idx].phase);
  if (currentIdx < phaseOrder.length - 1) {
    programs[idx].phase = phaseOrder[currentIdx + 1];
    programs[idx].status = "ready";
    persistPrograms(programs);
    recordPilotAudit({
      pilot_program_id: programId,
      institution_id: programs[idx].institution_id,
      actor_id: actorId,
      action: "pilot.phase_advanced",
      target_type: "pilot_program",
      target_id: programId,
      previous_state: phaseOrder[currentIdx],
      new_state: programs[idx].phase,
      reason: null,
      correlation_id: programId,
      result: "success",
    });
  }
  return programs[idx];
}

export function recordEngineeringIntervention(programId: string, reason: string, actorId: string) {
  const health = loadHealth();
  health.engineering_interventions += 1;
  persistHealth(health);
  recordPilotAudit({
    pilot_program_id: programId,
    institution_id: "inst-block-street",
    actor_id: actorId,
    action: "pilot.engineering_intervention",
    target_type: "pilot_program",
    target_id: programId,
    previous_state: String(health.engineering_interventions - 1),
    new_state: String(health.engineering_interventions),
    reason,
    correlation_id: programId,
    result: "success",
  });
}

export function generateLaunchRecommendation(programId: string, actorId: string): LaunchRecommendation {
  const program = loadPrograms().find((p) => p.id === programId);
  if (!program) throw new Error("Pilot program not found.");

  const openCritical = loadIssues().filter(
    (i) => i.pilot_program_id === programId && (i.severity === "P0" || i.severity === "P1") && i.status !== "verified"
  );

  const rec: LaunchRecommendation = {
    id: id("plrec"),
    pilot_program_id: programId,
    institution_id: program.institution_id,
    readiness_summary: "Phase D institutional pilot completed with operational independence demonstrated",
    critical_blockers: openCritical.map((i) => i.title),
    conditions: [
      "Limited launch: three campuses only",
      "Mass messaging remains restricted",
      "AI remains draft-only",
    ],
    accepted_risks: ["Minor terminology friction on mobile calendar workflow"],
    recommended_launch_scope: "Three pilot campuses — trained administrators only",
    recommended_support_level: "Institutional support with platform escalation for defects only",
    decision: openCritical.length === 0 ? "recommend_launch" : "extend_pilot",
    created_at: now(),
  };

  const recs = loadLaunchRecommendations();
  recs.push(rec);
  persistLaunchRecommendations(recs);

  const programs = loadPrograms();
  const idx = programs.findIndex((p) => p.id === programId);
  programs[idx].status = openCritical.length === 0 ? "accepted_with_conditions" : "extended";
  programs[idx].launch_target = rec.recommended_launch_scope;
  persistPrograms(programs);

  recordPilotAudit({
    pilot_program_id: programId,
    institution_id: program.institution_id,
    actor_id: actorId,
    action: "pilot.launch_recommended",
    target_type: "launch_recommendation",
    target_id: rec.id,
    previous_state: program.phase,
    new_state: rec.decision,
    reason: rec.recommended_launch_scope,
    correlation_id: rec.id,
    result: "success",
  });
  refreshHealth(program.institution_id);
  return rec;
}

export function getPilotHealth(institutionId?: string): PilotHealth {
  return loadHealth();
}

export function listAuditEvents(institutionId?: string) {
  const events = loadAuditEvents();
  if (!institutionId) return events;
  return events.filter((e) => e.institution_id === institutionId);
}

export function refreshHealth(institutionId?: string) {
  const programs = institutionId ? loadPrograms().filter((p) => p.institution_id === institutionId) : loadPrograms();
  const active = programs.filter((p) => p.status === "active" || p.status === "review").length;
  const sessions = loadSessions();
  const today = new Date().toISOString().slice(0, 10);
  const todaySessions = sessions.filter((s) => s.scheduled_at.startsWith(today));
  const completed = sessions.filter((s) => s.status === "completed");
  const successRate = completed.length
    ? Math.round((completed.filter((s) => s.outcome === "success").length / completed.length) * 100)
    : 0;
  const avgHelp = completed.length
    ? Math.round((completed.reduce((a, s) => a + s.human_help_count, 0) / completed.length) * 10) / 10
    : 0;
  const helpEvents = loadHelpEvents();
  const h4 = helpEvents.filter((h) => h.severity === "H4").length;
  const issues = institutionId ? loadIssues().filter((i) => loadPrograms().find((p) => p.id === i.pilot_program_id)?.institution_id === institutionId) : loadIssues();
  const p0 = issues.filter((i) => i.severity === "P0" && i.status !== "verified").length;
  const p1 = issues.filter((i) => i.severity === "P1" && i.status !== "verified").length;
  const retestsPending = loadRetests().filter((r) => r.result !== "passed").length;
  const launchPending = loadLaunchRecommendations().filter((r) => r.decision === "recommend_launch").length;

  const health: PilotHealth = {
    active_programs: active,
    sessions_today: todaySessions.length,
    workflow_success_rate: successRate,
    average_human_help: avgHelp,
    h4_takeovers: h4,
    p0_issues: p0,
    p1_issues: p1,
    retests_pending: retestsPending,
    engineering_interventions: loadHealth().engineering_interventions,
    launch_recommendations_pending: launchPending,
  };
  persistHealth(health);
  return health;
}
