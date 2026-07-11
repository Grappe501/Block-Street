import {
  loadAssessments,
  loadAssignments,
  loadCertificationAwards,
  loadCertificationDefinitions,
  loadCourses,
  loadEvaluatorQualifications,
  loadFeatureFlags,
  loadHealth,
  loadLearnerRecords,
  loadLearningPaths,
  loadLessonCompletions,
  loadLessons,
  loadPracticeWorkspaces,
  loadRemediationPlans,
  loadScenarioAttempts,
  loadScenarios,
  loadAssessmentAttempts,
  loadAuditEvents,
  persistAssessmentAttempts,
  persistAssignments,
  persistCertificationAwards,
  persistLearnerRecords,
  persistLessonCompletions,
  persistPracticeWorkspaces,
  persistRemediationPlans,
  persistScenarioAttempts,
  persistHealth,
} from "./data";
import { recordTrainingAudit } from "./audit";
import type {
  AssessmentAttempt,
  CertificationAward,
  LearnerRecord,
  TrainingAssignment,
  TrainingHealth,
  TrainingWorkspace,
} from "./types";

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function assertTrainingEnabled() {
  const flags = loadFeatureFlags();
  if (!flags.TRAINING_PLATFORM_ENABLED) throw new Error("Training platform is not enabled.");
  return flags;
}

function getPathLessons(learningPathId: string) {
  const courseIds = loadCourses().filter((c) => c.learning_path_id === learningPathId).map((c) => c.id);
  return loadLessons().filter((l) => courseIds.includes(l.course_id)).sort((a, b) => a.sequence - b.sequence);
}

export function listLearningPaths(institutionId?: string) {
  const paths = loadLearningPaths().filter((p) => p.status === "published");
  return institutionId ? paths.filter((p) => p.institution_id === institutionId || !p.institution_id) : paths;
}

export function getLearningPath(pathId: string) {
  const path = loadLearningPaths().find((p) => p.id === pathId);
  if (!path) throw new Error("Learning path not found.");
  const courses = loadCourses().filter((c) => c.learning_path_id === pathId);
  const lessons = getPathLessons(pathId);
  const assessment = loadAssessments().find((a) => a.learning_path_id === pathId) ?? null;
  const certification = loadCertificationDefinitions().find((c) => c.learning_path_id === pathId) ?? null;
  return { path, courses, lessons, assessment, certification };
}

export function assignLearningPath(input: {
  user_id: string;
  learning_path_id: string;
  institution_id: string;
  unit_id?: string;
  assigned_by: string;
  reason: string;
}): { assignment: TrainingAssignment; learner_record: LearnerRecord } {
  assertTrainingEnabled();
  const path = loadLearningPaths().find((p) => p.id === input.learning_path_id);
  if (!path) throw new Error("Learning path not found.");

  const lessons = getPathLessons(input.learning_path_id);
  const assignment: TrainingAssignment = {
    id: id("asgn"),
    user_id: input.user_id,
    learning_path_id: input.learning_path_id,
    institution_id: input.institution_id,
    unit_id: input.unit_id ?? null,
    assigned_by: input.assigned_by,
    assignment_reason: input.reason,
    assigned_at: now(),
    due_at: null,
    status: "assigned",
    completed_at: null,
  };

  const learnerRecord: LearnerRecord = {
    id: id("lr"),
    user_id: input.user_id,
    institution_id: input.institution_id,
    learning_path_id: input.learning_path_id,
    assignment_id: assignment.id,
    status: "not_started",
    progress_percent: 0,
    current_step: lessons[0]?.title ?? "Start",
    lessons_completed: 0,
    lessons_total: lessons.length,
    human_help_count: 0,
    started_at: null,
    completed_at: null,
    last_activity_at: now(),
  };

  const assignments = loadAssignments();
  assignments.push(assignment);
  persistAssignments(assignments);

  const records = loadLearnerRecords();
  records.push(learnerRecord);
  persistLearnerRecords(records);

  recordTrainingAudit({
    institution_id: input.institution_id,
    actor_id: input.assigned_by,
    user_id: input.user_id,
    action: "training.assigned",
    target_type: "training_assignment",
    target_id: assignment.id,
    previous_state: "",
    new_state: input.learning_path_id,
    reason: input.reason,
    correlation_id: assignment.id,
    result: "success",
  });

  refreshHealth(input.institution_id);
  return { assignment, learner_record: learnerRecord };
}

export function getTrainingMe(userId: string, institutionId?: string) {
  let records = loadLearnerRecords().filter((r) => r.user_id === userId);
  if (institutionId) records = records.filter((r) => r.institution_id === institutionId);
  const awards = loadCertificationAwards().filter((a) => a.user_id === userId && a.status === "active");
  const remediation = loadRemediationPlans().filter((r) => r.user_id === userId && r.status !== "completed");
  return {
    learner_records: records.map((r) => ({
      ...r,
      path: loadLearningPaths().find((p) => p.id === r.learning_path_id),
    })),
    certifications: awards,
    remediation,
    next_action: records.find((r) => r.status !== "completed")?.current_step ?? null,
  };
}

export function completeLesson(learnerRecordId: string, lessonId: string, actorId: string) {
  assertTrainingEnabled();
  const records = loadLearnerRecords();
  const rIdx = records.findIndex((r) => r.id === learnerRecordId);
  if (rIdx < 0) throw new Error("Learner record not found.");

  const record = records[rIdx];
  const completions = loadLessonCompletions();
  if (completions.some((c) => c.learner_record_id === learnerRecordId && c.lesson_id === lessonId)) {
    return record;
  }

  completions.push({
    id: id("lc"),
    learner_record_id: learnerRecordId,
    lesson_id: lessonId,
    completed_at: now(),
    version: 1,
  });
  persistLessonCompletions(completions);

  const lessons = getPathLessons(record.learning_path_id);
  const completedCount = completions.filter((c) => c.learner_record_id === learnerRecordId).length;
  const nextLesson = lessons.find((l) => !completions.some((c) => c.learner_record_id === learnerRecordId && c.lesson_id === l.id));

  record.lessons_completed = completedCount;
  record.progress_percent = Math.round((completedCount / record.lessons_total) * 100);
  record.current_step = nextLesson?.title ?? "Practice required";
  record.status = completedCount >= record.lessons_total ? "practice_required" : "in_progress";
  record.started_at = record.started_at ?? now();
  record.last_activity_at = now();
  records[rIdx] = record;
  persistLearnerRecords(records);

  recordTrainingAudit({
    institution_id: record.institution_id,
    actor_id: actorId,
    user_id: record.user_id,
    action: "training.lesson_completed",
    target_type: "training_lesson",
    target_id: lessonId,
    previous_state: String(completedCount - 1),
    new_state: String(completedCount),
    reason: null,
    correlation_id: lessonId,
    result: "success",
  });

  refreshHealth(record.institution_id);
  return record;
}

export function createPracticeWorkspace(userId: string, learningPathId: string, institutionId: string): TrainingWorkspace {
  assertTrainingEnabled();
  if (!loadFeatureFlags().TRAINING_PRACTICE_WORKSPACES_ENABLED) throw new Error("Practice workspaces disabled.");

  const workspace: TrainingWorkspace = {
    id: id("pws"),
    institution_id: institutionId,
    user_id: userId,
    learning_path_id: learningPathId,
    workspace_type: "practice",
    synthetic_data_profile: "workspace_admin_synthetic_v1",
    reset_policy: "on_demand",
    status: "active",
    created_at: now(),
  };

  const workspaces = loadPracticeWorkspaces();
  workspaces.push(workspace);
  persistPracticeWorkspaces(workspaces);

  recordTrainingAudit({
    institution_id: institutionId,
    actor_id: userId,
    user_id: userId,
    action: "training.practice_started",
    target_type: "training_workspace",
    target_id: workspace.id,
    previous_state: "",
    new_state: "active",
    reason: "Practice workspace created — no production data",
    correlation_id: workspace.id,
    result: "success",
  });

  return workspace;
}

export function startScenario(scenarioKey: string, userId: string, workspaceId: string, mode: "guided" | "independent") {
  const scenario = loadScenarios().find((s) => s.key === scenarioKey);
  if (!scenario) throw new Error("Scenario not found.");
  const workspace = loadPracticeWorkspaces().find((w) => w.id === workspaceId);
  if (!workspace || workspace.user_id !== userId) throw new Error("Invalid practice workspace.");

  const attempt = {
    id: id("scn"),
    scenario_id: scenario.id,
    user_id: userId,
    practice_workspace_id: workspaceId,
    mode,
    actions_taken: [],
    errors: 0,
    hints_used: 0,
    human_help_count: 0,
    status: "in_progress" as const,
    started_at: now(),
    completed_at: null,
  };

  const attempts = loadScenarioAttempts();
  attempts.push(attempt);
  persistScenarioAttempts(attempts);
  return { scenario, attempt };
}

export function completeScenario(
  attemptId: string,
  actions: string[],
  errors: number,
  hintsUsed: number,
  humanHelpCount: number,
  actorId: string
) {
  const attempts = loadScenarioAttempts();
  const idx = attempts.findIndex((a) => a.id === attemptId);
  if (idx < 0) throw new Error("Scenario attempt not found.");

  const passed = errors === 0 && actions.length >= 3;
  attempts[idx].actions_taken = actions;
  attempts[idx].errors = errors;
  attempts[idx].hints_used = hintsUsed;
  attempts[idx].human_help_count = humanHelpCount;
  attempts[idx].status = passed ? "completed" : "failed";
  attempts[idx].completed_at = now();
  persistScenarioAttempts(attempts);

  const record = loadLearnerRecords().find(
    (r) => r.user_id === attempts[idx].user_id && r.status === "practice_required"
  );
  if (record) {
    const records = loadLearnerRecords();
    const rIdx = records.findIndex((r) => r.id === record.id);
    records[rIdx].human_help_count += humanHelpCount;
    if (passed) {
      records[rIdx].status = "assessment_pending";
      records[rIdx].current_step = "Final practical assessment";
    }
    records[rIdx].last_activity_at = now();
    persistLearnerRecords(records);
  }

  recordTrainingAudit({
    institution_id: record?.institution_id ?? "unknown",
    actor_id: actorId,
    user_id: attempts[idx].user_id,
    action: passed ? "training.practice_completed" : "training.practice_failed",
    target_type: "scenario_attempt",
    target_id: attemptId,
    previous_state: "in_progress",
    new_state: attempts[idx].status,
    reason: `human_help_count=${humanHelpCount}`,
    correlation_id: attemptId,
    result: "success",
  });

  return attempts[idx];
}

export function submitAssessment(assessmentId: string, userId: string, evidenceRef: string) {
  assertTrainingEnabled();
  const assessment = loadAssessments().find((a) => a.id === assessmentId);
  if (!assessment) throw new Error("Assessment not found.");

  const priorAttempts = loadAssessmentAttempts().filter((a) => a.assessment_id === assessmentId && a.user_id === userId);
  if (priorAttempts.length >= assessment.attempt_limit) throw new Error("Attempt limit reached.");

  const attempt: AssessmentAttempt = {
    id: id("atm"),
    assessment_id: assessmentId,
    user_id: userId,
    started_at: now(),
    submitted_at: now(),
    score: null,
    status: assessment.requires_human_evaluation ? "evaluation_required" : "submitted",
    evaluator_id: null,
    evaluation_result: null,
    evidence_reference: evidenceRef,
  };

  const attempts = loadAssessmentAttempts();
  attempts.push(attempt);
  persistAssessmentAttempts(attempts);

  recordTrainingAudit({
    institution_id: "institution",
    actor_id: userId,
    user_id: userId,
    action: "training.assessment_submitted",
    target_type: "assessment_attempt",
    target_id: attempt.id,
    previous_state: "",
    new_state: attempt.status,
    reason: null,
    correlation_id: attempt.id,
    result: "success",
  });

  return attempt;
}

export function evaluateAttempt(
  attemptId: string,
  evaluatorId: string,
  passed: boolean,
  rubricNotes: string
) {
  assertTrainingEnabled();
  const evaluators = loadEvaluatorQualifications();
  const qualified = evaluators.find(
    (e) => e.user_id === evaluatorId && e.status === "active" && e.competency_domain === "workspace_administration"
  );
  if (!qualified && loadFeatureFlags().TRAINING_HUMAN_EVALUATION_ENABLED) {
    throw new Error("Evaluator not qualified or has disqualifying conflict.");
  }

  const attempts = loadAssessmentAttempts();
  const idx = attempts.findIndex((a) => a.id === attemptId);
  if (idx < 0) throw new Error("Assessment attempt not found.");

  const assessment = loadAssessments().find((a) => a.id === attempts[idx].assessment_id);
  attempts[idx].evaluator_id = evaluatorId;
  attempts[idx].evaluation_result = rubricNotes;
  attempts[idx].score = passed ? (assessment?.passing_score ?? 80) : 40;
  attempts[idx].status = passed ? "passed" : "failed";
  persistAssessmentAttempts(attempts);

  recordTrainingAudit({
    institution_id: "institution",
    actor_id: evaluatorId,
    user_id: attempts[idx].user_id,
    action: passed ? "training.assessment_passed" : "training.assessment_failed",
    target_type: "assessment_attempt",
    target_id: attemptId,
    previous_state: "evaluation_required",
    new_state: attempts[idx].status,
    reason: rubricNotes,
    correlation_id: attemptId,
    result: "success",
  });

  if (!passed) {
    assignRemediation(attempts[idx].user_id, attemptId, "Failed practical assessment — targeted practice required", evaluatorId);
  }

  return attempts[idx];
}

export function issueCertification(
  definitionId: string,
  userId: string,
  institutionId: string,
  issuedBy: string,
  evidenceRef: string
): CertificationAward {
  assertTrainingEnabled();
  if (issuedBy === userId) throw new Error("Self-issued certification denied.");

  const definition = loadCertificationDefinitions().find((d) => d.id === definitionId);
  if (!definition) throw new Error("Certification definition not found.");

  const pathRecord = loadLearnerRecords().find(
    (r) => r.user_id === userId && r.learning_path_id === definition.learning_path_id && r.status !== "completed"
  );
  const passedAttempt = loadAssessmentAttempts().find(
    (a) => a.user_id === userId && a.status === "passed"
  );
  if (!passedAttempt) throw new Error("Certification requires passed assessment evidence.");

  const expiresAt = new Date(Date.now() + definition.renewal_period_days * 86400000).toISOString();
  const award: CertificationAward = {
    id: id("cert"),
    certification_definition_id: definitionId,
    user_id: userId,
    institution_id: institutionId,
    issued_at: now(),
    expires_at: expiresAt,
    issued_by: issuedBy,
    evidence_reference: evidenceRef,
    status: "active",
    revoked_at: null,
    revocation_reason: null,
  };

  const awards = loadCertificationAwards();
  awards.push(award);
  persistCertificationAwards(awards);

  const records = loadLearnerRecords();
  const rIdx = records.findIndex((r) => r.user_id === userId && r.learning_path_id === definition.learning_path_id);
  if (rIdx >= 0) {
    records[rIdx].status = "completed";
    records[rIdx].completed_at = now();
    records[rIdx].progress_percent = 100;
    persistLearnerRecords(records);
  }

  recordTrainingAudit({
    institution_id: institutionId,
    actor_id: issuedBy,
    user_id: userId,
    action: "training.certification_issued",
    target_type: "certification_award",
    target_id: award.id,
    previous_state: "",
    new_state: "active",
    reason: evidenceRef,
    correlation_id: award.id,
    result: "success",
  });

  refreshHealth(institutionId);
  return award;
}

export function checkCertificationEligibility(userId: string, permissionKey: string) {
  const definitions = loadCertificationDefinitions().filter((d) => d.eligible_permission_key === permissionKey);
  const awards = loadCertificationAwards().filter((a) => a.user_id === userId && a.status === "active");
  const eligible = definitions.some((d) =>
    awards.some((a) => a.certification_definition_id === d.id && new Date(a.expires_at) > new Date())
  );
  return { eligible, certifications: awards, note: "Certification grants eligibility only — role assignment still required." };
}

export function suspendCertification(awardId: string, reason: string, actorId: string) {
  const awards = loadCertificationAwards();
  const idx = awards.findIndex((a) => a.id === awardId);
  if (idx < 0) throw new Error("Certification award not found.");
  awards[idx].status = "suspended";
  awards[idx].revocation_reason = reason;
  persistCertificationAwards(awards);

  recordTrainingAudit({
    institution_id: awards[idx].institution_id,
    actor_id: actorId,
    user_id: awards[idx].user_id,
    action: "training.certification_suspended",
    target_type: "certification_award",
    target_id: awardId,
    previous_state: "active",
    new_state: "suspended",
    reason,
    correlation_id: awardId,
    result: "success",
  });

  return awards[idx];
}

export function revokeCertification(awardId: string, reason: string, actorId: string) {
  const awards = loadCertificationAwards();
  const idx = awards.findIndex((a) => a.id === awardId);
  if (idx < 0) throw new Error("Certification award not found.");
  awards[idx].status = "revoked";
  awards[idx].revoked_at = now();
  awards[idx].revocation_reason = reason;
  persistCertificationAwards(awards);

  recordTrainingAudit({
    institution_id: awards[idx].institution_id,
    actor_id: actorId,
    user_id: awards[idx].user_id,
    action: "training.certification_revoked",
    target_type: "certification_award",
    target_id: awardId,
    previous_state: "active",
    new_state: "revoked",
    reason,
    correlation_id: awardId,
    result: "success",
  });

  return awards[idx];
}

export function assignRemediation(userId: string, attemptId: string | null, reason: string, assignedBy: string) {
  const plan = {
    id: id("rem"),
    user_id: userId,
    assessment_attempt_id: attemptId,
    reason,
    required_actions: ["Complete targeted lessons", "Additional practice scenario", "Reassessment"],
    assigned_by: assignedBy,
    due_at: new Date(Date.now() + 14 * 86400000).toISOString(),
    status: "assigned" as const,
  };

  const plans = loadRemediationPlans();
  plans.push(plan);
  persistRemediationPlans(plans);

  recordTrainingAudit({
    institution_id: "institution",
    actor_id: assignedBy,
    user_id: userId,
    action: "training.remediation_assigned",
    target_type: "remediation_plan",
    target_id: plan.id,
    previous_state: "",
    new_state: "assigned",
    reason,
    correlation_id: plan.id,
    result: "success",
  });

  return plan;
}

export function getTrainingHealth(institutionId?: string): TrainingHealth {
  refreshHealth(institutionId);
  return loadHealth();
}

export function listAuditEvents(institutionId?: string) {
  const events = loadAuditEvents();
  return institutionId ? events.filter((e) => e.institution_id === institutionId) : events;
}

function refreshHealth(institutionId?: string) {
  let records = loadLearnerRecords();
  let awards = loadCertificationAwards();
  if (institutionId) {
    records = records.filter((r) => r.institution_id === institutionId);
    awards = awards.filter((a) => a.institution_id === institutionId);
  }

  const attempts = loadAssessmentAttempts();
  const passed = attempts.filter((a) => a.status === "passed").length;
  const total = attempts.filter((a) => ["passed", "failed"].includes(a.status)).length;

  const in60Days = new Date(Date.now() + 60 * 86400000);
  const expiring = awards.filter((a) => a.status === "active" && new Date(a.expires_at) <= in60Days).length;

  const humanHelp = records.length
    ? Math.round((records.reduce((s, r) => s + r.human_help_count, 0) / records.length) * 10) / 10
    : 0;

  persistHealth({
    assigned_learners: records.length,
    in_progress: records.filter((r) => ["in_progress", "practice_required", "assessment_pending"].includes(r.status)).length,
    completed: records.filter((r) => r.status === "completed").length,
    overdue: records.filter((r) => r.status === "overdue").length,
    assessment_pass_rate: total ? Math.round((passed / total) * 1000) / 10 : 0,
    active_certifications: awards.filter((a) => a.status === "active").length,
    expiring_in_60_days: expiring,
    human_help_per_learner: humanHelp,
  });
}
