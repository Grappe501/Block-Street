import { randomBytes } from "crypto";
import {
  loadChecklistItems,
  loadFeatureFlags,
  loadHealth,
  loadInvitations,
  loadJourneyTemplates,
  loadJourneys,
  loadMentorAssignments,
  loadReadinessAssessments,
  loadTrainingRequirements,
  loadAuditEvents,
  persistChecklistItems,
  persistHealth,
  persistInvitations,
  persistJourneys,
  persistMentorAssignments,
  persistReadinessAssessments,
  persistTrainingRequirements,
} from "./data";
import { recordOnboardingAudit } from "./audit";
import { hashSecret } from "@/lib/auth/crypto";
import type {
  ChecklistItem,
  CreateInvitationInput,
  GenerateJourneyInput,
  OnboardingHealth,
  OnboardingInvitation,
  OnboardingJourney,
  ReadinessState,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function assertOnboardingEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.ONBOARDING_PLATFORM_ENABLED) throw new Error("Onboarding platform is not enabled.");
  return flags;
}

const ROLE_TEMPLATE_MAP: Record<string, string> = {
  student: "onb-tpl-student",
  volunteer: "onb-tpl-volunteer",
  organizer: "onb-tpl-organizer",
  campus_leader: "onb-tpl-campus-leader",
  county_chair: "onb-tpl-county-chair",
  administrator: "onb-tpl-administrator",
  executive: "onb-tpl-executive",
  regional_director: "onb-tpl-regional-director",
  trainer: "onb-tpl-trainer",
  mentor: "onb-tpl-mentor",
};

export function listJourneyTemplates() {
  return loadJourneyTemplates().filter((t) => t.status === "published");
}

export function createInstitutionalInvitation(input: CreateInvitationInput): { invitation: OnboardingInvitation; token: string } {
  assertOnboardingEnabled();
  const token = randomBytes(24).toString("hex");
  const expires = new Date(Date.now() + (input.expires_hours ?? 168) * 3600000);

  const invitation: OnboardingInvitation = {
    id: id("onb-inv"),
    institution_id: input.institution_id,
    unit_id: input.unit_id ?? null,
    email: input.email.toLowerCase(),
    role_key: input.role_key,
    invited_by: input.invited_by,
    onboarding_package_id: input.onboarding_package_id ?? ROLE_TEMPLATE_MAP[input.role_key] ?? "onb-tpl-student",
    invitation_token_hash: hashSecret(token),
    status: "sent",
    expires_at: expires.toISOString(),
    created_at: now(),
    accepted_at: null,
    user_id: null,
    message: input.message ?? null,
  };

  const invitations = loadInvitations();
  invitations.push(invitation);
  persistInvitations(invitations);

  recordOnboardingAudit({
    institution_id: input.institution_id,
    journey_id: null,
    actor_id: input.invited_by,
    action: "InvitationSent",
    target_type: "onboarding_invitation",
    target_id: invitation.id,
    previous_state: "",
    new_state: "sent",
    correlation_id: invitation.id,
    result: "success",
  });

  refreshHealth();
  return { invitation, token };
}

export function getInvitationByToken(token: string): OnboardingInvitation | null {
  const hash = hashSecret(token);
  const inv = loadInvitations().find((i) => i.invitation_token_hash === hash);
  if (!inv) return null;
  if (["revoked", "accepted", "completed", "expired"].includes(inv.status)) return null;
  if (new Date(inv.expires_at).getTime() < Date.now()) return null;
  return inv;
}

export function acceptInstitutionalInvitation(token: string, userId: string, userEmail: string) {
  assertOnboardingEnabled();
  const inv = getInvitationByToken(token);
  if (!inv) throw new Error("Invitation invalid, expired, or already used.");
  if (inv.email !== userEmail.toLowerCase()) throw new Error("Invitation email mismatch — possible hijack attempt.");

  const invitations = loadInvitations();
  const idx = invitations.findIndex((i) => i.id === inv.id);
  invitations[idx] = { ...inv, status: "accepted", accepted_at: now(), user_id: userId };
  persistInvitations(invitations);

  recordOnboardingAudit({
    institution_id: inv.institution_id,
    journey_id: null,
    actor_id: userId,
    action: "InvitationAccepted",
    target_type: "onboarding_invitation",
    target_id: inv.id,
    previous_state: "sent",
    new_state: "accepted",
    correlation_id: inv.id,
    result: "success",
  });

  return invitations[idx];
}

export function generateJourney(input: GenerateJourneyInput): OnboardingJourney {
  assertOnboardingEnabled();
  const templateId = ROLE_TEMPLATE_MAP[input.role_key] ?? "onb-tpl-student";
  const template = loadJourneyTemplates().find((t) => t.id === templateId) as {
    id: string;
    checklist: Array<{ key: string; label: string; description: string; required: boolean; unlocks_feature?: string }>;
    training: Array<{ key: string; title: string; certification_gate?: string }>;
    first_mission_key: string;
    mentor_type: string;
    mentor_label: string;
    tour_steps: number;
  } | undefined;

  if (!template) throw new Error(`No journey template for role ${input.role_key}.`);

  const unitName = input.unit_name ?? "your organization";
  const institutionName = input.institution_name ?? "your institution";

  const journey: OnboardingJourney = {
    id: id("journey"),
    user_id: input.user_id,
    institution_id: input.institution_id,
    unit_id: input.unit_id ?? null,
    unit_name: unitName,
    institution_name: institutionName,
    role_key: input.role_key,
    journey_template_id: template.id,
    status: "in_progress",
    readiness_state: "joining",
    readiness_score: 10,
    current_step_index: 0,
    tour_completed: false,
    first_mission_id: `mission-${template.first_mission_key}`,
    first_mission_completed: false,
    mentor_assignment_id: null,
    unlocked_features: ["dashboard_basic", "profile"],
    started_at: now(),
    completed_at: null,
    last_active_at: now(),
  };

  const journeys = loadJourneys();
  journeys.push(journey);
  persistJourneys(journeys);

  const checklist = loadChecklistItems();
  template.checklist.forEach((item, order) => {
    checklist.push({
      id: id("chk"),
      journey_id: journey.id,
      key: item.key,
      label: item.label,
      description: item.description,
      order,
      required: item.required,
      status: order === 0 ? "in_progress" : "pending",
      completed_at: null,
      unlocks_feature: item.unlocks_feature ?? null,
    });
  });
  persistChecklistItems(checklist);

  const training = loadTrainingRequirements();
  template.training.forEach((t) => {
    training.push({
      id: id("trn"),
      journey_id: journey.id,
      training_key: t.key,
      title: t.title,
      required: true,
      status: "pending",
      certification_gate: t.certification_gate ?? null,
    });
  });
  persistTrainingRequirements(training);

  const mentors = loadMentorAssignments();
  const mentor: import("./types").MentorAssignment = {
    id: id("mentor"),
    journey_id: journey.id,
    mentor_type: (template.mentor_type as import("./types").MentorType) ?? "organizational",
    mentor_user_id: null,
    mentor_label: template.mentor_label,
    assigned_at: now(),
    status: "active",
  };
  mentors.push(mentor);
  persistMentorAssignments(mentors);

  const jIdx = journeys.findIndex((j) => j.id === journey.id);
  journeys[jIdx].mentor_assignment_id = mentor.id;
  persistJourneys(journeys);

  recordOnboardingAudit({
    institution_id: input.institution_id,
    journey_id: journey.id,
    actor_id: input.user_id,
    action: "JourneyStarted",
    target_type: "onboarding_journey",
    target_id: journey.id,
    previous_state: "",
    new_state: "in_progress",
    correlation_id: journey.id,
    result: "success",
  });

  recordOnboardingAudit({
    institution_id: input.institution_id,
    journey_id: journey.id,
    actor_id: "system",
    action: "MentorAssigned",
    target_type: "mentor_assignment",
    target_id: mentor.id,
    previous_state: "",
    new_state: mentor.mentor_label,
    correlation_id: mentor.id,
    result: "success",
  });

  refreshHealth();
  return journeys[jIdx];
}

export function getJourney(journeyId: string) {
  const journey = loadJourneys().find((j) => j.id === journeyId);
  if (!journey) throw new Error("Journey not found.");
  return {
    journey,
    checklist: loadChecklistItems().filter((c) => c.journey_id === journeyId).sort((a, b) => a.order - b.order),
    training: loadTrainingRequirements().filter((t) => t.journey_id === journeyId),
    mentor: loadMentorAssignments().find((m) => m.journey_id === journeyId) ?? null,
    readiness: loadReadinessAssessments().filter((r) => r.journey_id === journeyId).sort((a, b) => b.assessed_at.localeCompare(a.assessed_at))[0] ?? null,
    context_card: {
      where: journey.unit_name,
      institution: journey.institution_name,
      role: journey.role_key,
      welcome_message: `Welcome to the ${journey.unit_name}.`,
      next_step: loadChecklistItems().find((c) => c.journey_id === journeyId && c.status === "in_progress")?.label ?? "Continue onboarding",
    },
  };
}

export function getJourneyForUser(userId: string, institutionId?: string) {
  let journeys = loadJourneys().filter((j) => j.user_id === userId);
  if (institutionId) journeys = journeys.filter((j) => j.institution_id === institutionId);
  const active = journeys.find((j) => j.status === "in_progress" || j.status === "paused") ?? journeys[journeys.length - 1];
  return active ? getJourney(active.id) : null;
}

export function completeChecklistItem(journeyId: string, itemKey: string, actorId: string) {
  const items = loadChecklistItems();
  const idx = items.findIndex((c) => c.journey_id === journeyId && c.key === itemKey);
  if (idx < 0) throw new Error("Checklist item not found.");

  items[idx].status = "completed";
  items[idx].completed_at = now();

  const nextPending = items.filter((c) => c.journey_id === journeyId && c.status === "pending").sort((a, b) => a.order - b.order)[0];
  if (nextPending) nextPending.status = "in_progress";

  persistChecklistItems(items);

  const journeys = loadJourneys();
  const jIdx = journeys.findIndex((j) => j.id === journeyId);
  const journey = journeys[jIdx];
  journey.last_active_at = now();
  journey.current_step_index += 1;

  if (items[idx].unlocks_feature && !journey.unlocked_features.includes(items[idx].unlocks_feature!)) {
    journey.unlocked_features.push(items[idx].unlocks_feature!);
  }

  const allRequired = items.filter((c) => c.journey_id === journeyId && c.required);
  const allDone = allRequired.every((c) => c.status === "completed");
  if (allDone && journey.tour_completed && journey.first_mission_completed) {
    journey.status = "completed";
    journey.completed_at = now();
    journey.readiness_state = "operational";
  }

  journeys[jIdx] = journey;
  persistJourneys(journeys);

  recordOnboardingAudit({
    institution_id: journey.institution_id,
    journey_id: journeyId,
    actor_id: actorId,
    action: "ChecklistCompleted",
    target_type: "checklist_item",
    target_id: items[idx].id,
    previous_state: "in_progress",
    new_state: "completed",
    correlation_id: items[idx].id,
    result: "success",
  });

  updateReadiness(journeyId);
  refreshHealth();
  return items[idx];
}

export function completeTraining(journeyId: string, trainingKey: string, actorId: string) {
  const training = loadTrainingRequirements();
  const idx = training.findIndex((t) => t.journey_id === journeyId && t.training_key === trainingKey);
  if (idx < 0) throw new Error("Training requirement not found.");

  training[idx].status = "completed";
  persistTrainingRequirements(training);

  const journeys = loadJourneys();
  const jIdx = journeys.findIndex((j) => j.id === journeyId);
  const journey = journeys[jIdx];

  if (training[idx].certification_gate && !journey.unlocked_features.includes(training[idx].certification_gate!)) {
    journey.unlocked_features.push(training[idx].certification_gate!);
  }
  journey.readiness_state = "learning";
  journey.last_active_at = now();
  persistJourneys(journeys);

  recordOnboardingAudit({
    institution_id: journey.institution_id,
    journey_id: journeyId,
    actor_id: actorId,
    action: "TrainingCompleted",
    target_type: "training_requirement",
    target_id: training[idx].id,
    previous_state: "pending",
    new_state: "completed",
    correlation_id: training[idx].id,
    result: "success",
  });

  updateReadiness(journeyId);
  return training[idx];
}

export function completeTour(journeyId: string, actorId: string) {
  const journeys = loadJourneys();
  const jIdx = journeys.findIndex((j) => j.id === journeyId);
  if (jIdx < 0) throw new Error("Journey not found.");

  journeys[jIdx].tour_completed = true;
  journeys[jIdx].readiness_state = "practicing";
  journeys[jIdx].last_active_at = now();
  if (!journeys[jIdx].unlocked_features.includes("navigation_full")) {
    journeys[jIdx].unlocked_features.push("navigation_full");
  }
  persistJourneys(journeys);

  recordOnboardingAudit({
    institution_id: journeys[jIdx].institution_id,
    journey_id: journeyId,
    actor_id: actorId,
    action: "TourCompleted",
    target_type: "onboarding_journey",
    target_id: journeyId,
    previous_state: "false",
    new_state: "true",
    correlation_id: journeyId,
    result: "success",
  });

  updateReadiness(journeyId);
  return journeys[jIdx];
}

export function completeFirstMission(journeyId: string, actorId: string) {
  const journeys = loadJourneys();
  const jIdx = journeys.findIndex((j) => j.id === journeyId);
  if (jIdx < 0) throw new Error("Journey not found.");

  journeys[jIdx].first_mission_completed = true;
  journeys[jIdx].readiness_state = "operational";
  journeys[jIdx].last_active_at = now();
  if (!journeys[jIdx].unlocked_features.includes("missions_full")) {
    journeys[jIdx].unlocked_features.push("missions_full");
  }
  if (!journeys[jIdx].unlocked_features.includes("analytics_summary")) {
    journeys[jIdx].unlocked_features.push("analytics_summary");
  }
  persistJourneys(journeys);

  recordOnboardingAudit({
    institution_id: journeys[jIdx].institution_id,
    journey_id: journeyId,
    actor_id: actorId,
    action: "MissionCompleted",
    target_type: "first_mission",
    target_id: journeys[jIdx].first_mission_id,
    previous_state: "pending",
    new_state: "completed",
    correlation_id: journeyId,
    result: "success",
  });

  recordOnboardingAudit({
    institution_id: journeys[jIdx].institution_id,
    journey_id: journeyId,
    actor_id: actorId,
    action: "OperationalReady",
    target_type: "onboarding_journey",
    target_id: journeyId,
    previous_state: journeys[jIdx].readiness_state,
    new_state: "operational",
    correlation_id: journeyId,
    result: "success",
  });

  updateReadiness(journeyId);
  refreshHealth();
  return journeys[jIdx];
}

export function pauseJourney(journeyId: string, actorId: string) {
  const journeys = loadJourneys();
  const jIdx = journeys.findIndex((j) => j.id === journeyId);
  journeys[jIdx].status = "paused";
  journeys[jIdx].last_active_at = now();
  persistJourneys(journeys);
  return journeys[jIdx];
}

export function resumeJourney(journeyId: string, actorId: string) {
  const journeys = loadJourneys();
  const jIdx = journeys.findIndex((j) => j.id === journeyId);
  journeys[jIdx].status = "in_progress";
  journeys[jIdx].last_active_at = now();
  persistJourneys(journeys);

  recordOnboardingAudit({
    institution_id: journeys[jIdx].institution_id,
    journey_id: journeyId,
    actor_id: actorId,
    action: "JourneyResumed",
    target_type: "onboarding_journey",
    target_id: journeyId,
    previous_state: "paused",
    new_state: "in_progress",
    correlation_id: journeyId,
    result: "success",
  });

  return journeys[jIdx];
}

function updateReadiness(journeyId: string) {
  const detail = getJourney(journeyId);
  const { journey, checklist, training } = detail;

  const checklistDone = checklist.filter((c) => c.required && c.status === "completed").length;
  const checklistTotal = checklist.filter((c) => c.required).length || 1;
  const trainingDone = training.filter((t) => t.required && t.status === "completed").length;
  const trainingTotal = training.filter((t) => t.required).length || 1;

  const knowledge = Math.round((trainingDone / trainingTotal) * 100);
  const navigation = journey.tour_completed ? 90 : 40;
  const mission_participation = journey.first_mission_completed ? 100 : 20;
  const operational_competence = Math.round((checklistDone / checklistTotal) * 100);
  const overall = Math.round((knowledge + navigation + mission_participation + operational_competence) / 4);

  let state: ReadinessState = journey.readiness_state;
  if (overall >= 80 && journey.first_mission_completed) state = "operational";
  else if (overall >= 50) state = "practicing";
  else if (trainingDone > 0) state = "learning";
  else state = "joining";

  const assessment = {
    id: id("ready"),
    journey_id: journeyId,
    knowledge,
    confidence: Math.min(overall + 5, 100),
    navigation,
    mission_participation,
    training: knowledge,
    certification: trainingDone === trainingTotal ? 100 : 50,
    community_connection: journey.mentor_assignment_id ? 70 : 30,
    operational_competence,
    overall,
    state,
    assessed_at: now(),
  };

  const all = loadReadinessAssessments().filter((r) => r.journey_id !== journeyId);
  all.push(assessment);
  persistReadinessAssessments(all);

  const journeys = loadJourneys();
  const jIdx = journeys.findIndex((j) => j.id === journeyId);
  journeys[jIdx].readiness_score = overall;
  journeys[jIdx].readiness_state = state;
  persistJourneys(journeys);

  recordOnboardingAudit({
    institution_id: journey.institution_id,
    journey_id: journeyId,
    actor_id: journey.user_id,
    action: "ReadinessUpdated",
    target_type: "readiness_assessment",
    target_id: assessment.id,
    previous_state: String(journey.readiness_score),
    new_state: String(overall),
    correlation_id: assessment.id,
    result: "success",
  });

  return assessment;
}

export function getOnboardingHealth(institutionId?: string): OnboardingHealth {
  refreshHealth(institutionId);
  return loadHealth();
}

export function listInstitutionJourneys(institutionId: string) {
  return loadJourneys().filter((j) => j.institution_id === institutionId);
}

export function listInstitutionInvitations(institutionId: string) {
  return loadInvitations().filter((i) => i.institution_id === institutionId);
}

export function listAuditEvents(institutionId?: string) {
  const events = loadAuditEvents();
  return institutionId ? events.filter((e) => e.institution_id === institutionId) : events;
}

function refreshHealth(institutionId?: string) {
  let invitations = loadInvitations();
  let journeys = loadJourneys();
  if (institutionId) {
    invitations = invitations.filter((i) => i.institution_id === institutionId);
    journeys = journeys.filter((j) => j.institution_id === institutionId);
  }

  const invited = invitations.filter((i) => ["sent", "delivered", "viewed"].includes(i.status)).length;
  const inProgress = journeys.filter((j) => j.status === "in_progress").length;
  const completed = journeys.filter((j) => j.status === "completed").length;
  const blocked = journeys.filter((j) => j.readiness_state === "joining" && j.readiness_score < 20).length;
  const operational = journeys.filter((j) => j.readiness_state === "operational" || j.readiness_state === "advanced").length;
  const avgCompletion = journeys.length
    ? Math.round(journeys.reduce((s, j) => s + j.readiness_score, 0) / journeys.length)
    : 0;

  persistHealth({
    invited,
    in_progress: inProgress,
    completed,
    blocked,
    average_completion: avgCompletion,
    operational_ready: operational,
    average_time_to_first_mission_hours: 4.2,
  });
}
