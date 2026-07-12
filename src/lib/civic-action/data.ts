import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type {
  ActionEvidence,
  ActionOutcomeLink,
  CoalitionInitiative,
  CommunicationsPlan,
  ExecutionAdaptation,
  ExecutionMission,
  ExecutionPlaybook,
  Initiative,
  InitiativeAuditEvent,
  InitiativeResponsibility,
  OperationalDecision,
  OperationalEvent,
  OperationalIncident,
  OperationalResource,
  OperationalRisk,
  ResourceAllocation,
  StrategicObjective,
  Workstream,
} from "./types";

const DATA_DIR = join(process.cwd(), "data", "civic-action");
const STORE_PATH = join(DATA_DIR, "store.json");
const cache = new Map<string, unknown>();

function ensureStore() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(STORE_PATH)) {
    writeFileSync(STORE_PATH, JSON.stringify({}, null, 2));
  }
}

function readStore(): Record<string, unknown> {
  if (cache.has("store")) return cache.get("store") as Record<string, unknown>;
  ensureStore();
  const raw = JSON.parse(readFileSync(STORE_PATH, "utf8"));
  cache.set("store", raw);
  return raw;
}

function writeStore(store: Record<string, unknown>) {
  ensureStore();
  writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
  cache.clear();
}

function getKey<T>(key: string): T[] {
  return (readStore()[key] as T[]) ?? [];
}

function setKey(key: string, items: unknown[]) {
  const store = readStore();
  store[key] = items;
  writeStore(store);
}

export function loadCaeFlags() {
  return JSON.parse(readFileSync(join(DATA_DIR, "cae_flags.json"), "utf8")) as Record<string, boolean | string>;
}

export const loadInitiatives = () => getKey<Initiative>("initiatives");
export const persistInitiatives = (items: Initiative[]) => setKey("initiatives", items);

export const loadObjectives = () => getKey<StrategicObjective>("strategic_objectives");
export const persistObjectives = (items: StrategicObjective[]) => setKey("strategic_objectives", items);

export const loadWorkstreams = () => getKey<Workstream>("workstreams");
export const persistWorkstreams = (items: Workstream[]) => setKey("workstreams", items);

export const loadExecutionMissions = () => getKey<ExecutionMission>("execution_missions");
export const persistExecutionMissions = (items: ExecutionMission[]) => setKey("execution_missions", items);

export const loadResponsibilities = () => getKey<InitiativeResponsibility>("initiative_responsibilities");
export const persistResponsibilities = (items: InitiativeResponsibility[]) => setKey("initiative_responsibilities", items);

export const loadOperationalEvents = () => getKey<OperationalEvent>("operational_events");
export const persistOperationalEvents = (items: OperationalEvent[]) => setKey("operational_events", items);

export const loadOperationalResources = () => getKey<OperationalResource>("operational_resources");
export const persistOperationalResources = (items: OperationalResource[]) => setKey("operational_resources", items);

export const loadResourceAllocations = () => getKey<ResourceAllocation>("resource_allocations");
export const persistResourceAllocations = (items: ResourceAllocation[]) => setKey("resource_allocations", items);

export const loadCommunicationsPlans = () => getKey<CommunicationsPlan>("communications_plans");
export const persistCommunicationsPlans = (items: CommunicationsPlan[]) => setKey("communications_plans", items);

export const loadFieldOperations = () => getKey<import("./types").FieldOperation>("field_operations");
export const persistFieldOperations = (items: import("./types").FieldOperation[]) => setKey("field_operations", items);

export const loadCoalitionInitiatives = () => getKey<CoalitionInitiative>("coalition_initiatives");
export const persistCoalitionInitiatives = (items: CoalitionInitiative[]) => setKey("coalition_initiatives", items);

export const loadOperationalDecisions = () => getKey<OperationalDecision>("operational_decisions");
export const persistOperationalDecisions = (items: OperationalDecision[]) => setKey("operational_decisions", items);

export const loadAdaptations = () => getKey<ExecutionAdaptation>("execution_adaptations");
export const persistAdaptations = (items: ExecutionAdaptation[]) => setKey("execution_adaptations", items);

export const loadActionEvidence = () => getKey<ActionEvidence>("action_evidence");
export const persistActionEvidence = (items: ActionEvidence[]) => setKey("action_evidence", items);

export const loadOutcomeLinks = () => getKey<ActionOutcomeLink>("action_outcome_links");
export const persistOutcomeLinks = (items: ActionOutcomeLink[]) => setKey("action_outcome_links", items);

export const loadPlaybooks = () => getKey<ExecutionPlaybook>("execution_playbooks");
export const persistPlaybooks = (items: ExecutionPlaybook[]) => setKey("execution_playbooks", items);

export const loadOperationalRisks = () => getKey<OperationalRisk>("operational_risks");
export const persistOperationalRisks = (items: OperationalRisk[]) => setKey("operational_risks", items);

export const loadOperationalIncidents = () => getKey<OperationalIncident>("operational_incidents");
export const persistOperationalIncidents = (items: OperationalIncident[]) => setKey("operational_incidents", items);

export const loadInitiativeAudit = () => getKey<InitiativeAuditEvent>("initiative_audit_events");
export const persistInitiativeAudit = (items: InitiativeAuditEvent[]) => setKey("initiative_audit_events", items);

export function isStoreSeeded() {
  return loadInitiatives().length > 0;
}
