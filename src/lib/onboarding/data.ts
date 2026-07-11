import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  ChecklistItem,
  MentorAssignment,
  OnboardingAuditEvent,
  OnboardingHealth,
  OnboardingInvitation,
  OnboardingJourney,
  ReadinessAssessment,
  TrainingRequirement,
} from "./types";

export const ONB_DATA = join(process.cwd(), "data", "onboarding");

const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(ONB_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(ONB_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJsonFile<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(ONB_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readJsonFile<Record<string, boolean>>("feature_flags.json");
}

export function loadJourneyTemplates() {
  return readJsonFile<{ templates: Array<Record<string, unknown>> }>("journey_templates.json").templates;
}

function getKey<K extends string>(key: K): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey<K extends string>(key: K, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadInvitations = () => getKey("invitations") as OnboardingInvitation[];
export const persistInvitations = (items: OnboardingInvitation[]) => setKey("invitations", items);
export const loadJourneys = () => getKey("journeys") as OnboardingJourney[];
export const persistJourneys = (items: OnboardingJourney[]) => setKey("journeys", items);
export const loadChecklistItems = () => getKey("checklist_items") as ChecklistItem[];
export const persistChecklistItems = (items: ChecklistItem[]) => setKey("checklist_items", items);
export const loadTrainingRequirements = () => getKey("training_requirements") as TrainingRequirement[];
export const persistTrainingRequirements = (items: TrainingRequirement[]) => setKey("training_requirements", items);
export const loadMentorAssignments = () => getKey("mentor_assignments") as MentorAssignment[];
export const persistMentorAssignments = (items: MentorAssignment[]) => setKey("mentor_assignments", items);
export const loadReadinessAssessments = () => getKey("readiness_assessments") as ReadinessAssessment[];
export const persistReadinessAssessments = (items: ReadinessAssessment[]) => setKey("readiness_assessments", items);
export const loadAuditEvents = () => getKey("audit_events") as OnboardingAuditEvent[];
export const persistAuditEvents = (items: OnboardingAuditEvent[]) => setKey("audit_events", items);

export function appendAudit(event: OnboardingAuditEvent) {
  const events = loadAuditEvents();
  events.push(event);
  persistAuditEvents(events);
}

export function loadHealth(): OnboardingHealth {
  const store = readStore();
  return (store.health as OnboardingHealth) ?? {
    invited: 0,
    in_progress: 0,
    completed: 0,
    blocked: 0,
    average_completion: 0,
    operational_ready: 0,
    average_time_to_first_mission_hours: 0,
  };
}

export function persistHealth(health: OnboardingHealth) {
  const store = readStore();
  store.health = health;
  writeStore(store);
}
