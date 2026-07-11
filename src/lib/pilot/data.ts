import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  HumanHelpEvent,
  LaunchRecommendation,
  PilotAcceptanceGate,
  PilotAuditEvent,
  PilotCohort,
  PilotCorrectiveAction,
  PilotHealth,
  PilotIssue,
  PilotObservation,
  PilotParticipant,
  PilotProgram,
  PilotRetest,
  PilotSession,
  PilotWorkflow,
} from "./types";

export const PLT_DATA = join(process.cwd(), "data", "pilot");

const cache = new Map<string, unknown>();

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  const raw = JSON.parse(readFileSync(join(PLT_DATA, "store.json"), "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  writeFileSync(join(PLT_DATA, "store.json"), JSON.stringify(store, null, 2));
  cache.clear();
}

function readJsonFile<T>(file: string): T {
  const ck = `obj:${file}`;
  if (cache.has(ck)) return cache.get(ck) as T;
  const raw = JSON.parse(readFileSync(join(PLT_DATA, file), "utf8"));
  cache.set(ck, raw);
  return raw;
}

export function loadFeatureFlags() {
  return readJsonFile<Record<string, boolean>>("feature_flags.json");
}

export function loadWorkflowCatalog() {
  return readJsonFile<{ workflows: Omit<PilotWorkflow, "pilot_program_id" | "id">[] }>("workflow_catalog.json").workflows;
}

function getKey<K extends string>(key: K): unknown[] {
  return (readStore()[key] as unknown[]) ?? [];
}

function setKey<K extends string>(key: K, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export const loadPrograms = () => getKey("programs") as PilotProgram[];
export const persistPrograms = (items: PilotProgram[]) => setKey("programs", items);
export const loadWorkflows = () => getKey("workflows") as PilotWorkflow[];
export const persistWorkflows = (items: PilotWorkflow[]) => setKey("workflows", items);
export const loadCohorts = () => getKey("cohorts") as PilotCohort[];
export const persistCohorts = (items: PilotCohort[]) => setKey("cohorts", items);
export const loadParticipants = () => getKey("participants") as PilotParticipant[];
export const persistParticipants = (items: PilotParticipant[]) => setKey("participants", items);
export const loadSessions = () => getKey("sessions") as PilotSession[];
export const persistSessions = (items: PilotSession[]) => setKey("sessions", items);
export const loadHelpEvents = () => getKey("help_events") as HumanHelpEvent[];
export const persistHelpEvents = (items: HumanHelpEvent[]) => setKey("help_events", items);
export const loadObservations = () => getKey("observations") as PilotObservation[];
export const persistObservations = (items: PilotObservation[]) => setKey("observations", items);
export const loadIssues = () => getKey("issues") as PilotIssue[];
export const persistIssues = (items: PilotIssue[]) => setKey("issues", items);
export const loadCorrectiveActions = () => getKey("corrective_actions") as PilotCorrectiveAction[];
export const persistCorrectiveActions = (items: PilotCorrectiveAction[]) => setKey("corrective_actions", items);
export const loadRetests = () => getKey("retests") as PilotRetest[];
export const persistRetests = (items: PilotRetest[]) => setKey("retests", items);
export const loadGates = () => getKey("gates") as PilotAcceptanceGate[];
export const persistGates = (items: PilotAcceptanceGate[]) => setKey("gates", items);
export const loadLaunchRecommendations = () => getKey("launch_recommendations") as LaunchRecommendation[];
export const persistLaunchRecommendations = (items: LaunchRecommendation[]) => setKey("launch_recommendations", items);
export const loadAuditEvents = () => getKey("audit_events") as PilotAuditEvent[];
export const persistAuditEvents = (items: PilotAuditEvent[]) => setKey("audit_events", items);
export const loadHealth = () => readStore().health as PilotHealth;
export const persistHealth = (health: PilotHealth) => {
  const store = readStore();
  store.health = health;
  writeStore(store);
};
