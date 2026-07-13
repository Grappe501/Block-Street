/**
 * CAE-11.7-W4 — Organizer tests
 */
import { organizerRuntime } from "./services/organizer-service";
import { seedOrganizerIfEmpty } from "./services/seed";
import { contextIntelligenceRuntime } from "../context/services/context-intelligence-service";
import { getOrganizerConstitution, LIX_ORGANIZER_PRINCIPLE, REQUIRED_ORGANIZER_SERVICES } from "./constitution";
import { checkLixW4Invariants } from "./invariants";
import { explainOrganizerAction } from "./traceability";
import { ORGANIZER_EVENT_CATALOG } from "./events/catalog";

export type LixW4TestResult = { name: string; passed: boolean; detail?: string };

export function runLixW4CertificationTests(): LixW4TestResult[] {
  seedOrganizerIfEmpty();
  const results: LixW4TestResult[] = [];
  const humanId = "usr-001";
  const localbrainId = "lbr-usr-001";
  const institutionId = "inst-block-street";

  contextIntelligenceRuntime.institution.switchTo({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
    role_id: "role-executive",
  });

  const constitution = getOrganizerConstitution();
  results.push({ name: "organizer_principle", passed: constitution.governing_principle === LIX_ORGANIZER_PRINCIPLE });

  results.push({
    name: "required_organizer_services",
    passed: REQUIRED_ORGANIZER_SERVICES.length === 14,
    detail: `${REQUIRED_ORGANIZER_SERVICES.length} services`,
  });

  results.push({ name: "w4_invariants", passed: checkLixW4Invariants().every((i) => i.passed) });

  const dashboard = organizerRuntime.organizer.dashboard({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "organizer_dashboard",
    passed: !!dashboard.todays_plan && dashboard.next_question.includes("next"),
    detail: dashboard.greeting,
  });

  const plan = organizerRuntime.dailyPlanning.create({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
    plan_type: "morning",
  });
  results.push({
    name: "daily_planning",
    passed: plan.human_editable && plan.plan.auto_executed === false,
    detail: `${plan.plan.sections.length} sections`,
  });

  const mission = organizerRuntime.mission.coordinate({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
    mission_id: "msn-block-street-001",
  });
  results.push({
    name: "mission_coordination",
    passed: mission.mission_plan.blocked_work.length > 0 && mission.mutates_canonical === false,
    detail: `${mission.mission_plan.blocked_work.length} blockers`,
  });

  const tasks = organizerRuntime.task.sequence({
    human_id: humanId,
    mission_id: "msn-block-street-001",
    tasks: [
      { title: "Review briefing", owner_id: humanId, priority: "high" },
      { title: "Confirm room", owner_id: "usr-003", priority: "medium" },
    ],
  });
  results.push({
    name: "task_coordination",
    passed: tasks.tasks.length === 2 && tasks.auto_assign === false,
    detail: `seq ${tasks.tasks[0].recommended_sequence}`,
  });

  const dep = organizerRuntime.dependency.track({
    human_id: humanId,
    institution_id: institutionId,
    dependency_type: "approval",
    blocked_item: "Briefing send",
    blocking_item: "Legal review",
    reason: "Policy review required",
  });
  results.push({
    name: "dependency_engine",
    passed: dep.dependency.explainable && dep.mysterious === false,
    detail: dep.dependency.status,
  });

  const checklist = organizerRuntime.checklist.create({
    human_id: humanId,
    institution_id: institutionId,
    checklist_type: "travel",
    title: "County travel checklist",
    items: ["Badge", "Materials", "Parking pass"],
    mission_id: "msn-block-street-001",
  });
  results.push({
    name: "checklist_runtime",
    passed: checklist.checklist.reusable && checklist.checklist.items.length === 3,
    detail: checklist.checklist.checklist_type,
  });

  const team = organizerRuntime.team.snapshot({ institution_id: institutionId, mission_id: "msn-block-street-001" });
  results.push({
    name: "team_coordination",
    passed: team.ranks_human_worth === false && team.team_status.members.every((m) => m.worth_score === null),
    detail: `${team.team_status.members.length} members`,
  });

  const capacity = organizerRuntime.capacity.evaluate({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "workload_balancing",
    passed: capacity.advisory_only && capacity.productivity_score === null,
    detail: `${capacity.available_capacity_hours}h capacity`,
  });

  const resources = organizerRuntime.resource.snapshot(institutionId);
  results.push({
    name: "resource_coordination",
    passed: resources.resources.length >= 2,
    detail: `${resources.shortages.length} shortages`,
  });

  const travel = organizerRuntime.travel.prepare({
    human_id: humanId,
    institution_id: institutionId,
    destination: "Partner Office",
    departure_at: new Date().toISOString(),
    arrival_at: new Date(Date.now() + 3600000).toISOString(),
  });
  results.push({
    name: "travel_coordination",
    passed: travel.travel_plan.continuous_location_tracking === false,
    detail: `${travel.travel_plan.travel_buffer_minutes}min buffer`,
  });

  const comm = organizerRuntime.communication.prepare({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "communication_coordination",
    passed: comm.send_autonomous === false,
    detail: `${comm.coordination.pending_replies.length} pending`,
  });

  const deadline = organizerRuntime.deadline.evaluate({ human_id: humanId, institution_id: institutionId });
  results.push({
    name: "deadline_intelligence",
    passed: deadline.explainable && !!deadline.deadline.suggested_action,
    detail: deadline.deadline.suggested_action ?? "none",
  });

  const review = organizerRuntime.review.complete({
    human_id: humanId,
    localbrain_id: localbrainId,
    institution_id: institutionId,
  });
  results.push({
    name: "daily_review",
    passed: review.review.completed_work.length > 0 && review.event === "review.completed",
    detail: review.review.mission_health.slice(0, 30),
  });

  const privacy = organizerRuntime.privacy.governance();
  results.push({
    name: "organizer_privacy",
    passed: !privacy.employee_scores && !privacy.keyboard_tracking,
    detail: "no surveillance",
  });

  const rec = organizerRuntime.organizer.recommend({
    human_id: humanId,
    institution_id: institutionId,
    subject: "Room setup",
    recommended_action: "Delegate to usr-003",
    why: "usr-003 has capacity and logistics skill",
    evidence: ["team-capacity-snapshot"],
  });
  results.push({
    name: "recommendation_explainable",
    passed: rec.recommendation.dismissible && rec.recommendation.mutates_canonical === false,
    detail: rec.recommendation.recommended_action.slice(0, 25),
  });

  const dismissed = organizerRuntime.organizer.dismiss(rec.recommendation.recommendation_id, humanId);
  results.push({
    name: "recommendation_dismissible",
    passed: dismissed.recommendation.status === "dismissed",
    detail: dismissed.event,
  });

  const reassignBlocked = (() => {
    try {
      organizerRuntime.organizer.reassign();
      return false;
    } catch (e) {
      return (e as { code?: string }).code === "ORGANIZER_REASSIGN_NOT_ALLOWED";
    }
  })();
  results.push({ name: "reassign_prohibition", passed: reassignBlocked, detail: "no auto reassign" });

  const calendarBlocked = (() => {
    try {
      organizerRuntime.organizer.modifyCalendar();
      return false;
    } catch (e) {
      return (e as { code?: string }).code === "ORGANIZER_CALENDAR_MUTATION_BLOCKED";
    }
  })();
  results.push({ name: "calendar_mutation_prohibition", passed: calendarBlocked, detail: "no silent calendar" });

  const trace = explainOrganizerAction({
    human_id: humanId,
    action_type: "daily_planning",
    institution_id: institutionId,
    confidence: 0.85,
  });
  results.push({
    name: "organizer_traceability",
    passed: trace.includes(humanId) && trace.includes(LIX_ORGANIZER_PRINCIPLE),
  });

  results.push({
    name: "organizer_event_catalog",
    passed: ORGANIZER_EVENT_CATALOG.length === 12,
    detail: `${ORGANIZER_EVENT_CATALOG.length} events`,
  });

  return results;
}

export function allLixW4TestsPassed(): boolean {
  return runLixW4CertificationTests().every((t) => t.passed);
}
