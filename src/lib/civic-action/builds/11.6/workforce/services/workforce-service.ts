/**
 * CAE-11.6-W3 — Workforce management services
 */
import { caeId, nowIso } from "../../../../utils";
import { loadOperationalMission } from "../../execution/services/repository";
import { listTasksForMission } from "../../execution/services/repository";
import type { WorkloadLevel } from "../data-model";
import type { HumanWorkProfileRecord, WorkAssignmentRecord } from "../data-model";
import {
  getAssignment,
  getBurnoutIndicator,
  getVolunteerProfile,
  getWorkProfileByHuman,
  listAssignments,
  listAvailabilityProfiles,
  listCapacitySnapshots,
  listDelegations,
  listGrowthGoals,
  listRecognitions,
  listWorkProfiles,
  saveAssignment,
  saveAvailabilityProfile,
  saveBurnoutIndicator,
  saveCapacitySnapshot,
  saveDelegation,
  saveGrowthGoal,
  saveRecognition,
  saveVolunteerProfile,
  saveWorkProfile,
} from "./repository";
import { explainAssignment, validateAssignmentTraceability } from "../traceability";

const DEFAULT_INSTITUTION = "inst-block-street";

export class WorkforceError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function computeWorkloadLevel(current: number, maximum: number): WorkloadLevel {
  const ratio = maximum > 0 ? current / maximum : 0;
  if (ratio >= 1) return "critical";
  if (ratio >= 0.85) return "heavy";
  if (ratio >= 0.6) return "busy";
  if (ratio >= 0.3) return "balanced";
  return "very_light";
}

function resolveMissionContext(missionId: string) {
  const mission = loadOperationalMission(missionId);
  if (!mission) throw new WorkforceError("MISSION_NOT_FOUND", `Mission ${missionId} not found`);
  return {
    mission,
    strategic_goal_id: mission.strategic_goal_id,
    objective_id: mission.objective_id,
  };
}

export const workforceService = {
  listProfiles(institutionId = DEFAULT_INSTITUTION) {
    return listWorkProfiles(institutionId);
  },
  getProfile(humanId: string) {
    const profile = getWorkProfileByHuman(humanId);
    if (!profile) throw new WorkforceError("PROFILE_NOT_FOUND", `Work profile for ${humanId} not found`);
    return profile;
  },
  getPersonalWorkCenter(humanId: string, institutionId = DEFAULT_INSTITUTION) {
    const profile = getWorkProfileByHuman(humanId);
    const assignments = listAssignments(institutionId, humanId).filter((a) => a.status === "active" || a.status === "accepted");
    const capacity = listCapacitySnapshots(institutionId, humanId)[0];
    const goals = listGrowthGoals(humanId);
    return {
      human_id: humanId,
      question: "What should I work on next?",
      todays_priorities: assignments.slice(0, 5).map((a) => ({ assignment_id: a.assignment_id, mission_id: a.mission_id, priority: a.priority })),
      assigned_missions: [...new Set(assignments.map((a) => a.mission_id))],
      open_tasks_count: assignments.filter((a) => a.task_id).length,
      workload_level: profile?.workload_level ?? "balanced",
      growth_goals: goals,
      certifications_near_expiration: [],
      ai_daily_brief: { advisory_only: true, summary: `${assignments.length} active assignments` },
    };
  },
};

export const assignmentService = {
  list(institutionId = DEFAULT_INSTITUTION, humanId?: string, missionId?: string) {
    return listAssignments(institutionId, humanId, missionId);
  },
  assign(input: {
    institution_id: string;
    mission_id: string;
    task_id?: string | null;
    human_id: string;
    assigned_role: WorkAssignmentRecord["assigned_role"];
    assigned_by: string;
    assignment_reason: string;
    priority?: WorkAssignmentRecord["priority"];
    estimated_effort?: number;
    required_competencies?: string[];
    required_certifications?: string[];
  }) {
    const ctx = resolveMissionContext(input.mission_id);
    const profile = getWorkProfileByHuman(input.human_id);
    if (!profile) throw new WorkforceError("PROFILE_NOT_FOUND", "Human must have a work profile before assignment");

    const missingCompetencies = (input.required_competencies ?? []).filter((c) => !profile.competencies.includes(c));
    const missingCerts = (input.required_certifications ?? []).filter((c) => !profile.certifications.includes(c));
    if (missingCompetencies.length || missingCerts.length) {
      throw new WorkforceError("SKILLS_GAP", `Missing: competencies=[${missingCompetencies.join(",")}] certs=[${missingCerts.join(",")}]`);
    }

    const now = nowIso();
    const assignment: WorkAssignmentRecord = {
      assignment_id: caeId("asg"),
      institution_id: input.institution_id,
      mission_id: input.mission_id,
      task_id: input.task_id ?? null,
      human_id: input.human_id,
      assigned_role: input.assigned_role,
      assigned_by: input.assigned_by,
      assignment_reason: input.assignment_reason,
      priority: input.priority ?? "medium",
      estimated_effort: input.estimated_effort ?? 4,
      actual_effort: 0,
      required_competencies: input.required_competencies ?? [],
      required_certifications: input.required_certifications ?? [],
      status: "pending_acceptance",
      accepted_at: null,
      completed_at: null,
      strategic_goal_id: ctx.strategic_goal_id,
      objective_id: ctx.objective_id,
      created_at: now,
      updated_at: now,
    };
    if (!validateAssignmentTraceability(assignment)) {
      throw new WorkforceError("TRACEABILITY_INCOMPLETE", "Assignment must trace to mission");
    }
    saveAssignment(assignment);
    return { assignment, event: "assignment.created" as const, traceability: explainAssignment(assignment) };
  },
  accept(assignmentId: string, humanId: string) {
    const assignment = getAssignment(assignmentId);
    if (!assignment) throw new WorkforceError("ASSIGNMENT_NOT_FOUND", `Assignment ${assignmentId} not found`);
    if (assignment.human_id !== humanId) throw new WorkforceError("FORBIDDEN", "Only assignee may accept");
    const updated = { ...assignment, status: "accepted" as const, accepted_at: nowIso(), updated_at: nowIso() };
    saveAssignment(updated);
    return { assignment: updated, event: "assignment.accepted" as const };
  },
  decline(assignmentId: string, humanId: string, reason: string) {
    const assignment = getAssignment(assignmentId);
    if (!assignment) throw new WorkforceError("ASSIGNMENT_NOT_FOUND", `Assignment ${assignmentId} not found`);
    if (assignment.human_id !== humanId) throw new WorkforceError("FORBIDDEN", "Only assignee may decline");
    const updated = { ...assignment, status: "declined" as const, assignment_reason: reason, updated_at: nowIso() };
    saveAssignment(updated);
    return { assignment: updated, event: "assignment.declined" as const };
  },
  complete(assignmentId: string, actorId: string, actualEffort?: number) {
    const assignment = getAssignment(assignmentId);
    if (!assignment) throw new WorkforceError("ASSIGNMENT_NOT_FOUND", `Assignment ${assignmentId} not found`);
    const updated = {
      ...assignment,
      status: "completed" as const,
      actual_effort: actualEffort ?? assignment.actual_effort,
      completed_at: nowIso(),
      updated_at: nowIso(),
    };
    saveAssignment(updated);
    return { assignment: updated, event: "assignment.completed" as const, actor_id: actorId };
  },
};

export const capacityService = {
  compute(humanId: string, institutionId = DEFAULT_INSTITUTION) {
    const profile = getWorkProfileByHuman(humanId);
    const assignments = listAssignments(institutionId, humanId).filter((a) => a.status === "active" || a.status === "accepted");
    const missionIds = [...new Set(assignments.map((a) => a.mission_id))];
    let openTasks = 0;
    for (const mid of missionIds) openTasks += listTasksForMission(mid).filter((t) => t.owner === humanId && t.status !== "completed").length;

    const current = assignments.reduce((sum, a) => sum + a.estimated_effort, 0) + openTasks * 0.5;
    const maximum = profile?.maximum_capacity ?? 40;
    const snapshot = {
      capacity_snapshot_id: caeId("cap"),
      human_id: humanId,
      institution_id: institutionId,
      active_missions: missionIds.length,
      open_tasks: openTasks,
      scheduled_events: 0,
      training_hours: 0,
      current_capacity: current,
      maximum_capacity: maximum,
      workload_level: computeWorkloadLevel(current, maximum),
      computed_at: nowIso(),
    };
    saveCapacitySnapshot(snapshot);
    if (profile) {
      saveWorkProfile({ ...profile, current_capacity: current, workload_level: snapshot.workload_level, updated_at: nowIso() });
    }
    return { snapshot, event: "capacity.updated" as const };
  },
  list(institutionId = DEFAULT_INSTITUTION, humanId?: string) {
    return listCapacitySnapshots(institutionId, humanId);
  },
  getOrganizationCapacity(institutionId = DEFAULT_INSTITUTION) {
    const profiles = listWorkProfiles(institutionId);
    const snapshots = profiles.map((p) => capacityService.compute(p.human_id, institutionId).snapshot);
    const totalCurrent = snapshots.reduce((s, c) => s + c.current_capacity, 0);
    const totalMax = snapshots.reduce((s, c) => s + c.maximum_capacity, 0);
    return {
      institution_id: institutionId,
      headcount: profiles.length,
      total_current_capacity: totalCurrent,
      total_maximum_capacity: totalMax,
      utilization: totalMax > 0 ? totalCurrent / totalMax : 0,
      workload_distribution: snapshots.reduce<Record<string, number>>((acc, s) => {
        acc[s.workload_level] = (acc[s.workload_level] ?? 0) + 1;
        return acc;
      }, {}),
    };
  },
};

export const availabilityService = {
  list(institutionId = DEFAULT_INSTITUTION, humanId?: string) {
    return listAvailabilityProfiles(institutionId, humanId);
  },
  update(input: {
    human_id: string;
    institution_id: string;
    schedule_type: Parameters<typeof saveAvailabilityProfile>[0]["schedule_type"];
    weekly_hours_available: number;
    emergency_available?: boolean;
  }) {
    const existing = listAvailabilityProfiles(input.institution_id, input.human_id)[0];
    const record = {
      availability_profile_id: existing?.availability_profile_id ?? caeId("avl"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      schedule_type: input.schedule_type,
      weekly_hours_available: input.weekly_hours_available,
      emergency_available: input.emergency_available ?? false,
      temporary_override_until: null,
      calendar_sync_enabled: true,
      updated_at: nowIso(),
    };
    saveAvailabilityProfile(record);
    return { availability: record, event: "availability.updated" as const };
  },
};

export const skillsMatchingService = {
  check(humanId: string, requiredCompetencies: string[], requiredCertifications: string[]) {
    const profile = getWorkProfileByHuman(humanId);
    if (!profile) return { eligible: false, missing_competencies: requiredCompetencies, missing_certifications: requiredCertifications };
    const missingCompetencies = requiredCompetencies.filter((c) => !profile.competencies.includes(c));
    const missingCertifications = requiredCertifications.filter((c) => !profile.certifications.includes(c));
    return {
      eligible: missingCompetencies.length === 0 && missingCertifications.length === 0,
      verified_competencies: profile.competencies,
      active_certifications: profile.certifications,
      missing_competencies: missingCompetencies,
      missing_certifications: missingCertifications,
    };
  },
};

export const volunteerService = {
  get(humanId: string) {
    return getVolunteerProfile(humanId);
  },
  upsert(record: Parameters<typeof saveVolunteerProfile>[0]) {
    saveVolunteerProfile(record);
    return record;
  },
};

export const delegationService = {
  delegate(input: {
    assignment_id: string;
    delegated_by: string;
    delegated_to: string;
    reason: string;
    duration_end: string;
    authority_scope: string;
    approved_by?: string;
  }) {
    const assignment = getAssignment(input.assignment_id);
    if (!assignment) throw new WorkforceError("ASSIGNMENT_NOT_FOUND", "Assignment not found");
    const record = {
      delegation_id: caeId("dlg"),
      assignment_id: input.assignment_id,
      delegated_by: input.delegated_by,
      delegated_to: input.delegated_to,
      reason: input.reason,
      duration_end: input.duration_end,
      authority_scope: input.authority_scope,
      approved_by: input.approved_by ?? null,
      status: input.approved_by ? ("approved" as const) : ("pending" as const),
      created_at: nowIso(),
    };
    saveDelegation(record);
    saveAssignment({ ...assignment, status: "delegated", updated_at: nowIso() });
    return { delegation: record, event: "assignment.delegated" as const };
  },
  list(assignmentId?: string) {
    return listDelegations(assignmentId);
  },
};

export const priorityService = {
  explain(assignment: WorkAssignmentRecord) {
    return {
      assignment_id: assignment.assignment_id,
      factors: {
        assignment_priority: assignment.priority,
        mission_id: assignment.mission_id,
        strategic_goal_id: assignment.strategic_goal_id,
        objective_id: assignment.objective_id,
      },
      transparent: true,
    };
  },
};

export const recognitionService = {
  award(input: {
    institution_id: string;
    human_id: string;
    recognition_type: Parameters<typeof saveRecognition>[0]["recognition_type"];
    title: string;
    description: string;
    mission_id?: string | null;
    awarded_by: string;
  }) {
    const record = {
      recognition_id: caeId("rec"),
      institution_id: input.institution_id,
      human_id: input.human_id,
      recognition_type: input.recognition_type,
      title: input.title,
      description: input.description,
      mission_id: input.mission_id ?? null,
      awarded_by: input.awarded_by,
      awarded_at: nowIso(),
    };
    saveRecognition(record);
    return { recognition: record, event: "recognition.awarded" as const };
  },
  list(institutionId = DEFAULT_INSTITUTION, humanId?: string) {
    return listRecognitions(institutionId, humanId);
  },
};

export const burnoutMonitoringService = {
  evaluate(humanId: string, institutionId = DEFAULT_INSTITUTION) {
    const profile = getWorkProfileByHuman(humanId);
    const assignments = listAssignments(institutionId, humanId).filter((a) => a.status === "active" || a.status === "accepted");
    const indicators: string[] = [];
    if (profile && profile.workload_level === "critical") indicators.push("excessive_workload");
    if (assignments.length > 5) indicators.push("too_many_concurrent_missions");
    const declined = listAssignments(institutionId, humanId).filter((a) => a.status === "declined").length;
    if (declined >= 3) indicators.push("declined_assignments");
    const record = {
      indicator_id: caeId("brn"),
      human_id: humanId,
      institution_id: institutionId,
      indicators,
      severity: indicators.length >= 2 ? ("elevated" as const) : indicators.length ? ("watch" as const) : ("watch" as const),
      advisory_only: true,
      private: true,
      computed_at: nowIso(),
    };
    if (indicators.length) saveBurnoutIndicator(record);
    return { ...record, event: indicators.length ? ("burnout.warning" as const) : null };
  },
  get(humanId: string) {
    return getBurnoutIndicator(humanId);
  },
};

export const successionPlanningService = {
  analyze(institutionId = DEFAULT_INSTITUTION) {
    const profiles = listWorkProfiles(institutionId);
    const criticalRoles = profiles.filter((p) => p.primary_role.includes("lead") || p.primary_role.includes("director"));
    const backups = profiles.filter((p) => p.secondary_roles.includes("backup"));
    return {
      institution_id: institutionId,
      critical_roles: criticalRoles.map((p) => ({ human_id: p.human_id, role: p.primary_role })),
      backup_personnel: backups.map((p) => p.human_id),
      emerging_leaders: profiles.filter((p) => p.growth_goals.some((g) => g.toLowerCase().includes("leadership"))).map((p) => p.human_id),
      certification_gaps: [],
    };
  },
};

export const workQueueService = {
  build(humanId: string, institutionId = DEFAULT_INSTITUTION) {
    const assignments = listAssignments(institutionId, humanId);
    return {
      assigned: assignments.filter((a) => a.status === "accepted" || a.status === "active"),
      available: assignments.filter((a) => a.status === "proposed" || a.status === "pending_acceptance"),
      awaiting_review: assignments.filter((a) => a.status === "completed"),
      blocked: assignments.filter((a) => a.status === "declined"),
      completed: assignments.filter((a) => a.status === "completed"),
      delegated: assignments.filter((a) => a.status === "delegated"),
    };
  },
};

export const teamDashboardService = {
  build(team: string, institutionId = DEFAULT_INSTITUTION) {
    const profiles = listWorkProfiles(institutionId).filter((p) => p.team === team);
    const capacities = profiles.map((p) => capacityService.compute(p.human_id, institutionId).snapshot);
    const assignments = listAssignments(institutionId).filter((a) => profiles.some((p) => p.human_id === a.human_id));
    return {
      team,
      member_count: profiles.length,
      team_capacity: capacities.reduce((s, c) => s + c.current_capacity, 0),
      mission_distribution: [...new Set(assignments.map((a) => a.mission_id))],
      task_completion_rate: assignments.length
        ? assignments.filter((a) => a.status === "completed").length / assignments.length
        : 0,
      workload_balance: capacities.map((c) => ({ human_id: c.human_id, workload: c.workload_level })),
      open_risks: [],
      missing_competencies: [],
    };
  },
};

export const executiveWorkforceDashboardService = {
  build(institutionId = DEFAULT_INSTITUTION) {
    const orgCapacity = capacityService.getOrganizationCapacity(institutionId);
    const profiles = listWorkProfiles(institutionId);
    const assignments = listAssignments(institutionId);
    const volunteers = profiles.filter((p) => p.employment_type === "volunteer");
    return {
      institution_id: institutionId,
      organization_capacity: orgCapacity,
      department_capacity: {},
      team_health: "governed",
      staffing_gaps: [],
      volunteer_engagement: { count: volunteers.length, active_assignments: assignments.filter((a) => volunteers.some((v) => v.human_id === a.human_id)).length },
      mission_staffing: [...new Set(assignments.map((a) => a.mission_id))].length,
      competency_distribution: profiles.flatMap((p) => p.competencies),
      certification_coverage: profiles.flatMap((p) => p.certifications),
      future_capacity_forecast: "advisory_only",
      no_human_ranking: true,
    };
  },
};

export const aiWorkforceAdvisorService = {
  recommendAssignment(input: {
    mission_id: string;
    institution_id: string;
    required_competencies?: string[];
    required_certifications?: string[];
  }) {
    const profiles = listWorkProfiles(input.institution_id).filter((p) => p.workforce_status === "available" || p.workforce_status === "limited_availability");
    const ranked = profiles
      .map((p) => {
        const match = skillsMatchingService.check(p.human_id, input.required_competencies ?? [], input.required_certifications ?? []);
        const cap = listCapacitySnapshots(input.institution_id, p.human_id)[0];
        const score = (match.eligible ? 10 : 0) + (cap ? Math.max(0, 10 - cap.current_capacity) : 5);
        return { human_id: p.human_id, score, eligible: match.eligible, growth_opportunity: p.growth_goals.length > 0 };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    return {
      mission_id: input.mission_id,
      advisory_only: true,
      requires_human_approval: true,
      recommendations: ranked,
      event: "AI.assignment.recommended" as const,
      may_not_silently_assign: true,
    };
  },
};

export const growthGoalsService = {
  update(input: { human_id: string; institution_id: string; goals: string[]; target_competency?: string }) {
    const existing = listGrowthGoals(input.human_id);
    for (const g of existing) saveGrowthGoal({ ...g, status: "paused", updated_at: nowIso() });
    const records = input.goals.map((goal) => ({
      growth_goal_id: caeId("grw"),
      human_id: input.human_id,
      institution_id: input.institution_id,
      goal,
      target_competency: input.target_competency ?? null,
      status: "active" as const,
      updated_at: nowIso(),
    }));
    for (const r of records) saveGrowthGoal(r);
    const profile = getWorkProfileByHuman(input.human_id);
    if (profile) saveWorkProfile({ ...profile, growth_goals: input.goals, updated_at: nowIso() });
    return { goals: records, event: "growth.goal.updated" as const };
  },
};

export const workforceManagementService = {
  workforce: workforceService,
  assignments: assignmentService,
  capacity: capacityService,
  availability: availabilityService,
  skills: skillsMatchingService,
  volunteer: volunteerService,
  delegation: delegationService,
  priority: priorityService,
  recognition: recognitionService,
  burnout: burnoutMonitoringService,
  succession: successionPlanningService,
  queues: workQueueService,
  teamDashboard: teamDashboardService,
  executiveDashboard: executiveWorkforceDashboardService,
  ai: aiWorkforceAdvisorService,
  growth: growthGoalsService,
};
