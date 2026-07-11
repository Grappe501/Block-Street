import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  Assessment,
  AssessmentAttempt,
  CertificationAward,
  CertificationDefinition,
  Competency,
  Course,
  EvaluatorQualification,
  LearnerRecord,
  LessonCompletion,
  RemediationPlan,
  ScenarioAttempt,
  TrainingAssignment,
  TrainingAuditEvent,
  TrainingHealth,
  TrainingLesson,
  TrainingScenario,
  TrainingWorkspace,
} from "./types";
import type { LearningPath } from "./types";

export const TRN_DATA = join(process.cwd(), "data", "training");

const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(TRN_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(TRN_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJsonFile<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(TRN_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readJsonFile<Record<string, boolean>>("feature_flags.json");
}

export function loadLearningPaths() {
  return readJsonFile<{ paths: LearningPath[] }>("learning_paths.json").paths;
}

export function loadCourses() {
  return readJsonFile<{ courses: Course[] }>("courses.json").courses;
}

export function loadLessons() {
  return readJsonFile<{ lessons: TrainingLesson[] }>("lessons.json").lessons;
}

export function loadCompetencies() {
  return readJsonFile<{ competencies: Competency[] }>("competencies.json").competencies;
}

export function loadCertificationDefinitions() {
  return readJsonFile<{ definitions: CertificationDefinition[] }>("certifications.json").definitions;
}

export function loadScenarios() {
  return readJsonFile<{ scenarios: TrainingScenario[] }>("scenarios.json").scenarios;
}

export function loadAssessments() {
  return readJsonFile<{ assessments: Assessment[] }>("assessments.json").assessments;
}

function getKey<K extends string>(key: K): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey<K extends string>(key: K, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadAssignments = () => getKey("assignments") as TrainingAssignment[];
export const persistAssignments = (items: TrainingAssignment[]) => setKey("assignments", items);
export const loadLearnerRecords = () => getKey("learner_records") as LearnerRecord[];
export const persistLearnerRecords = (items: LearnerRecord[]) => setKey("learner_records", items);
export const loadLessonCompletions = () => getKey("lesson_completions") as LessonCompletion[];
export const persistLessonCompletions = (items: LessonCompletion[]) => setKey("lesson_completions", items);
export const loadPracticeWorkspaces = () => getKey("practice_workspaces") as TrainingWorkspace[];
export const persistPracticeWorkspaces = (items: TrainingWorkspace[]) => setKey("practice_workspaces", items);
export const loadScenarioAttempts = () => getKey("scenario_attempts") as ScenarioAttempt[];
export const persistScenarioAttempts = (items: ScenarioAttempt[]) => setKey("scenario_attempts", items);
export const loadAssessmentAttempts = () => getKey("assessment_attempts") as AssessmentAttempt[];
export const persistAssessmentAttempts = (items: AssessmentAttempt[]) => setKey("assessment_attempts", items);
export const loadCertificationAwards = () => getKey("certification_awards") as CertificationAward[];
export const persistCertificationAwards = (items: CertificationAward[]) => setKey("certification_awards", items);
export const loadEvaluatorQualifications = () => getKey("evaluator_qualifications") as EvaluatorQualification[];
export const persistEvaluatorQualifications = (items: EvaluatorQualification[]) => setKey("evaluator_qualifications", items);
export const loadRemediationPlans = () => getKey("remediation_plans") as RemediationPlan[];
export const persistRemediationPlans = (items: RemediationPlan[]) => setKey("remediation_plans", items);
export const loadAuditEvents = () => getKey("audit_events") as TrainingAuditEvent[];
export const persistAuditEvents = (items: TrainingAuditEvent[]) => setKey("audit_events", items);

export function appendAudit(event: TrainingAuditEvent) {
  const events = loadAuditEvents();
  events.push(event);
  persistAuditEvents(events);
}

export function loadHealth(): TrainingHealth {
  const store = readStore();
  return (store.health as TrainingHealth) ?? {
    assigned_learners: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0,
    assessment_pass_rate: 0,
    active_certifications: 0,
    expiring_in_60_days: 0,
    human_help_per_learner: 0,
  };
}

export function persistHealth(health: TrainingHealth) {
  const store = readStore();
  store.health = health;
  writeStore(store);
}
