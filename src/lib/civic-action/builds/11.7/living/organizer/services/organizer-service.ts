/**
 * CAE-11.7-W4 — Organizer services
 */
import { caeId, nowIso } from "../../../../../utils";
import { localBrainRuntime } from "../../localbrain/services/localbrain-service";
import { seedLocalBrainIfEmpty } from "../../localbrain/services/seed";
import { contextIntelligenceRuntime } from "../../context/services/context-intelligence-service";
import { seedContextIfEmpty } from "../../context/services/seed";
import { executiveAssistantRuntime } from "../../executive-assistant/services/executive-assistant-service";
import { seedExecutiveIfEmpty } from "../../executive-assistant/services/seed";
import { missionExecutionService } from "../../../../11.6/execution/services/mission-execution-service";
import type { PlanType } from "../data-model";
import {
  getCommunicationCoordination,
  getDailyPlan,
  getMissionPlan,
  getRecommendation,
  getTeamStatus,
  getTravelPlan,
  listChecklists,
  listDailyPlans,
  listDeadlines,
  listDependencies,
  listRecommendations,
  listResources,
  listReviews,
  listTasks,
  saveChecklist,
  saveCommunicationCoordination,
  saveDailyPlan,
  saveDeadline,
  saveDependency,
  saveMissionPlan,
  saveRecommendation,
  saveResource,
  saveReview,
  saveTask,
  saveTeamStatus,
  saveTravelPlan,
} from "./repository";

export class OrganizerError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function ensureOrganizerBoot() {
  seedLocalBrainIfEmpty();
  seedContextIfEmpty();
  seedExecutiveIfEmpty();
}

function getBrain(humanId: string) {
  ensureOrganizerBoot();
  const brain = localBrainRuntime.localBrain.getByHuman(humanId);
  if (!brain) throw new OrganizerError("ORGANIZER_CONTEXT_REQUIRED", "LocalBrain required");
  return brain;
}

export const dailyPlanningService = {
  list: listDailyPlans,
  get: getDailyPlan,
  create(input: {
    human_id: string;
    localbrain_id: string;
    institution_id: string;
    plan_type?: PlanType;
    sections?: { title: string; items: string[] }[];
  }) {
    const context = contextIntelligenceRuntime.assemble({
      human_id: input.human_id,
      institution_id: input.institution_id,
    });
    const attention = contextIntelligenceRuntime.attention.evaluate({
      human_id: input.human_id,
      localbrain_id: input.localbrain_id,
      institution_id: input.institution_id,
    });
    const defaultSections = [
      { title: "Highest priorities", items: attention.items.slice(0, 2).map((i) => i.subject) },
      { title: "Meetings", items: ["Partner meeting — 3:30 PM"] },
      { title: "Preparation blocks", items: ["Volunteer briefing review — 30 min"] },
      { title: "Deep work blocks", items: ["Finalize county immersion checklist"] },
      { title: "Waiting items", items: ["Budget approval from Treasurer"] },
      { title: "Suggested delegation", items: ["Room setup — recommend usr-003"] },
    ];
    const sections = (input.sections ?? defaultSections).map((s) => ({
      section_id: caeId("sec"),
      title: s.title,
      items: s.items,
      editable: true as const,
    }));
    const record = {
      daily_plan_id: caeId("dpl"),
      localbrain_id: input.localbrain_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      plan_type: input.plan_type ?? ("morning" as const),
      title: "Today's Plan",
      sections,
      human_editable: true as const,
      auto_executed: false as const,
      prepared_at: nowIso(),
      status: "active" as const,
    };
    saveDailyPlan(record);
    return {
      plan: record,
      event: "daily.plan.created" as const,
      confidence: context.confidence,
      human_editable: true,
    };
  },
  update(planId: string, humanId: string, sections: { title: string; items: string[] }[]) {
    const existing = getDailyPlan(planId);
    if (!existing || existing.human_id !== humanId) throw new OrganizerError("ORGANIZER_PLAN_NOT_FOUND", "Plan not found");
    const updated = {
      ...existing,
      sections: sections.map((s) => ({
        section_id: caeId("sec"),
        title: s.title,
        items: s.items,
        editable: true as const,
      })),
      status: "active" as const,
    };
    saveDailyPlan(updated);
    return { plan: updated, event: "daily.plan.updated" as const };
  },
};

export const missionCoordinator = {
  get: getMissionPlan,
  coordinate(input: { human_id: string; localbrain_id: string; institution_id: string; mission_id: string }) {
    const mission = (() => {
      try {
        return missionExecutionService.missions.get(input.mission_id);
      } catch {
        return { mission_id: input.mission_id, purpose: "County immersion" };
      }
    })();
    const record = {
      mission_plan_id: caeId("mpl"),
      mission_id: input.mission_id,
      human_id: input.human_id,
      institution_id: input.institution_id,
      localbrain_id: input.localbrain_id,
      blocked_work: ["Volunteer briefing — waiting on attendance sheet approval"],
      missing_approvals: ["Budget line item for field supplies"],
      resource_shortages: ["Field van reserved for overlapping event"],
      deadline_conflicts: ["Briefing due before partner meeting moved earlier"],
      duplicate_effort: ["Two teams preparing separate county contact lists"],
      idle_work: ["Outreach template update — unassigned 5 days"],
      critical_path_changes: ["Partner meeting moved — preparation window shortened"],
      prepared_at: nowIso(),
    };
    saveMissionPlan(record);
    return {
      mission_plan: record,
      mission,
      event: "mission.updated" as const,
      mutates_canonical: false,
    };
  },
};

export const taskCoordinator = {
  list: listTasks,
  sequence(input: {
    human_id: string;
    mission_id: string;
    tasks: { title: string; owner_id: string; priority: string; deadline?: string }[];
  }) {
    const sequenced = input.tasks.map((t, i) => {
      const record = {
        task_id: caeId("tsk"),
        human_id: input.human_id,
        title: t.title,
        owner_id: t.owner_id,
        mission_id: input.mission_id,
        priority: t.priority,
        dependencies: i > 0 ? [`task-seq-${i - 1}`] : [],
        resources: [],
        evidence: [],
        estimated_effort_hours: 2,
        deadline: t.deadline ?? null,
        status: "ready",
        completion_criteria: "Evidence uploaded and reviewed",
        recommended_sequence: i + 1,
      };
      saveTask(record);
      return record;
    });
    return { tasks: sequenced, human_completes_work: true, auto_assign: false };
  },
};

export const dependencyService = {
  list: listDependencies,
  track(input: {
    human_id: string;
    institution_id: string;
    dependency_type: Parameters<typeof saveDependency>[0]["dependency_type"];
    blocked_item: string;
    blocking_item: string;
    reason: string;
  }) {
    const record = {
      dependency_id: caeId("dep"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      dependency_type: input.dependency_type,
      blocked_item: input.blocked_item,
      blocking_item: input.blocking_item,
      reason: input.reason,
      status: "blocked" as const,
      explainable: true as const,
    };
    saveDependency(record);
    return { dependency: record, event: "dependency.blocked" as const, mysterious: false };
  },
};

export const checklistService = {
  list: listChecklists,
  create(input: {
    human_id: string;
    institution_id: string;
    checklist_type: Parameters<typeof saveChecklist>[0]["checklist_type"];
    title: string;
    items: string[];
    mission_id?: string;
  }) {
    const record = {
      checklist_id: caeId("chk"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      checklist_type: input.checklist_type,
      title: input.title,
      items: input.items.map((label) => ({ item_id: caeId("chi"), label, completed: false })),
      reusable: true,
      mission_id: input.mission_id ?? null,
    };
    saveChecklist(record);
    return { checklist: record, institutional_knowledge: true };
  },
  completeItem(checklistId: string, itemId: string, humanId: string) {
    const checklist = listChecklists(humanId).find((c) => c.checklist_id === checklistId);
    if (!checklist) throw new OrganizerError("ORGANIZER_CHECKLIST_NOT_FOUND", "Checklist not found");
    const updated = {
      ...checklist,
      items: checklist.items.map((i) => (i.item_id === itemId ? { ...i, completed: true } : i)),
    };
    saveChecklist(updated);
    return { checklist: updated, event: "checklist.completed" as const, human_action: true };
  },
};

export const teamCoordinator = {
  get: getTeamStatus,
  snapshot(input: { institution_id: string; mission_id?: string }) {
    const record = {
      team_status_id: caeId("tms"),
      institution_id: input.institution_id,
      mission_id: input.mission_id ?? "msn-block-street-001",
      members: [
        {
          human_id: "usr-001",
          name: "Executive Director",
          availability: "busy" as const,
          open_tasks: 4,
          waiting_on_count: 2,
          skills: ["leadership", "governance"],
          worth_score: null,
        },
        {
          human_id: "usr-002",
          name: "Mission Lead",
          availability: "available" as const,
          open_tasks: 2,
          waiting_on_count: 0,
          skills: ["field_operations", "volunteer_training"],
          worth_score: null,
        },
        {
          human_id: "usr-003",
          name: "Field Coordinator",
          availability: "overloaded" as const,
          open_tasks: 7,
          waiting_on_count: 1,
          skills: ["logistics", "events"],
          worth_score: null,
        },
      ],
      operational_readiness_only: true as const,
      updated_at: nowIso(),
    };
    saveTeamStatus(record);
    return {
      team_status: record,
      event: "team.capacity.changed" as const,
      ranks_human_worth: false,
    };
  },
};

export const capacityService = {
  evaluate(input: { human_id: string; institution_id: string }) {
    const team = teamCoordinator.snapshot({ institution_id: input.institution_id });
    const member = team.team_status.members.find((m) => m.human_id === input.human_id);
    const openWork = member?.open_tasks ?? 0;
    const meetingLoad = 3;
    const capacity = Math.max(0, 8 - openWork - meetingLoad);
    return {
      open_work: openWork,
      meeting_load: meetingLoad,
      available_capacity_hours: capacity,
      burnout_indicator: openWork > 6 ? "high_operational_load" : "normal",
      advisory_only: true,
      auto_reassign: false,
      productivity_score: null,
    };
  },
};

export const resourceCoordinator = {
  list: listResources,
  snapshot(institutionId: string) {
    const resources = [
      {
        resource_status_id: caeId("res"),
        institution_id: institutionId,
        resource_type: "vehicle",
        resource_id: "res-field-van-001",
        name: "Field Van",
        status: "reserved" as const,
        needed_by: "evt-volunteer-training-kickoff",
      },
      {
        resource_status_id: caeId("res"),
        institution_id: institutionId,
        resource_type: "room",
        resource_id: "room-meeting-a",
        name: "Meeting Room A",
        status: "shortage" as const,
        needed_by: "evt-partner-meeting",
      },
    ];
    for (const r of resources) saveResource(r);
    const shortages = resources.filter((r) => r.status === "shortage");
    return {
      resources,
      shortages,
      event: shortages.length > 0 ? ("resource.shortage" as const) : null,
    };
  },
};

export const travelCoordinator = {
  get: getTravelPlan,
  prepare(input: {
    human_id: string;
    institution_id: string;
    destination: string;
    departure_at: string;
    arrival_at: string;
  }) {
    const record = {
      travel_plan_id: caeId("trv"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      destination: input.destination,
      departure_at: input.departure_at,
      arrival_at: input.arrival_at,
      travel_buffer_minutes: 20,
      packing_list: ["Briefing materials", "Badge", "Charger"],
      venue_info: "Partner Office — 123 Main St",
      parking: "Visitor lot B",
      emergency_contacts: ["usr-002 — Mission Lead"],
      continuous_location_tracking: false as const,
      prepared_at: nowIso(),
    };
    saveTravelPlan(record);
    return {
      travel_plan: record,
      event: "travel.updated" as const,
      location_surveillance: false,
    };
  },
};

export const communicationCoordinator = {
  get: getCommunicationCoordination,
  prepare(input: { human_id: string; institution_id: string }) {
    const record = {
      communication_id: caeId("com"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      pending_replies: ["County lead — volunteer count confirmation"],
      who_needs_updates: ["usr-002", "partner-team"],
      draft_reminders: ["Send revised outline — draft ready, not sent"],
      send_autonomous: false as const,
    };
    saveCommunicationCoordination(record);
    return { coordination: record, send_autonomous: false };
  },
};

export const deadlineService = {
  list: listDeadlines,
  evaluate(input: { human_id: string; institution_id: string }) {
    const deps = listDependencies(input.human_id);
    const record = {
      deadline_id: caeId("ddl"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      title: "Volunteer briefing finalization",
      due_at: new Date(Date.now() + 3 * 3600000).toISOString(),
      deadline_type: "hard" as const,
      dependency_ids: deps.slice(0, 1).map((d) => d.dependency_id),
      suggested_action: "accelerate" as const,
      reason: "Partner meeting moved earlier; preparation window shortened",
      confidence: 0.82,
    };
    saveDeadline(record);
    return {
      deadline: record,
      event: "deadline.warning" as const,
      explainable: true,
    };
  },
};

export const dailyReviewService = {
  list: listReviews,
  complete(input: { human_id: string; localbrain_id: string; institution_id: string }) {
    const plans = listDailyPlans(input.human_id);
    const commitments = executiveAssistantRuntime.commitment.list(input.human_id).filter((c) => c.status === "confirmed");
    const record = {
      review_id: caeId("rev"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      localbrain_id: input.localbrain_id,
      completed_work: ["Reviewed attendance sheet", "Confirmed county commitment"],
      incomplete_work: ["Finalize volunteer briefing"],
      commitments: commitments.map((c) => c.commitment_text),
      lessons_learned: ["Earlier meeting change requires faster briefing turnaround"],
      mission_health: "County immersion on track with one blocker",
      tomorrow_preparation: ["Review partner meeting follow-up", "Delegate room setup"],
      knowledge_candidates: ["County contact list template"],
      completed_at: nowIso(),
    };
    saveReview(record);
    return { review: record, event: "review.completed" as const };
  },
};

export const organizerPrivacyService = {
  governance() {
    return {
      spying_prohibited: true,
      secret_productivity_monitoring: false,
      employee_scores: false,
      keyboard_tracking: false,
      mouse_tracking: false,
      loyalty_measurement: false,
      behavioral_ratings: false,
      transparent: true,
    };
  },
};

export const organizerService = {
  dashboard(input: { human_id: string; institution_id: string }) {
    const brain = getBrain(input.human_id);
    const plan = dailyPlanningService.create({
      human_id: input.human_id,
      localbrain_id: brain.localbrain_id,
      institution_id: input.institution_id,
    });
    const mission = missionCoordinator.coordinate({
      human_id: input.human_id,
      localbrain_id: brain.localbrain_id,
      institution_id: input.institution_id,
      mission_id: "msn-block-street-001",
    });
    const blocked = listDependencies(input.human_id).filter((d) => d.status === "blocked");
    return {
      greeting: "Organizer Dashboard",
      todays_plan: plan.plan,
      mission_progress: mission.mission_plan,
      blocked_work: blocked,
      waiting_on: plan.plan.sections.find((s) => s.title === "Waiting items")?.items ?? [],
      next_question: "What do I need to do next?",
    };
  },
  recommend(input: {
    human_id: string;
    institution_id: string;
    subject: string;
    recommended_action: string;
    why: string;
    evidence?: string[];
  }) {
    const record = {
      recommendation_id: caeId("rec"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      subject: input.subject,
      recommended_action: input.recommended_action,
      why: input.why,
      evidence: input.evidence ?? [],
      confidence: 0.8,
      dismissible: true as const,
      editable: true as const,
      mutates_canonical: false as const,
      status: "recommended" as const,
    };
    saveRecommendation(record);
    return { recommendation: record, event: "organizer.recommendation.created" as const };
  },
  dismiss(recommendationId: string, humanId: string) {
    const rec = getRecommendation(recommendationId);
    if (!rec || rec.human_id !== humanId) throw new OrganizerError("ORGANIZER_RECOMMENDATION_NOT_FOUND", "Not found");
    const updated = { ...rec, status: "dismissed" as const };
    saveRecommendation(updated);
    return { recommendation: updated, event: "organizer.recommendation.dismissed" as const };
  },
  reassign() {
    throw new OrganizerError("ORGANIZER_REASSIGN_NOT_ALLOWED", "Autonomous reassignment prohibited");
  },
  modifyCalendar() {
    throw new OrganizerError("ORGANIZER_CALENDAR_MUTATION_BLOCKED", "Silent calendar modification prohibited");
  },
};

export const organizerRuntime = {
  organizer: organizerService,
  dailyPlanning: dailyPlanningService,
  mission: missionCoordinator,
  task: taskCoordinator,
  dependency: dependencyService,
  checklist: checklistService,
  team: teamCoordinator,
  capacity: capacityService,
  resource: resourceCoordinator,
  travel: travelCoordinator,
  communication: communicationCoordinator,
  deadline: deadlineService,
  review: dailyReviewService,
  privacy: organizerPrivacyService,
};
