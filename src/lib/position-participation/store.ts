import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { CanonicalPerson, PositionMembership } from "./types";

const ROOT = join(process.cwd(), "data", "position-participation");
const STORE = join(ROOT, "store.json");

export type PositionParticipationStore = {
  version: string;
  updated: string;
  minimum_launch_team: number;
  persons: CanonicalPerson[];
  memberships: PositionMembership[];
  manual_goals: Record<string, { launch_team?: number | null; registration?: number | null; vote_participation?: number | null }>;
  notes?: Record<string, string>;
};

function ensure(): PositionParticipationStore {
  if (!existsSync(STORE)) {
    mkdirSync(ROOT, { recursive: true });
    const empty: PositionParticipationStore = {
      version: "1.0.0",
      updated: new Date().toISOString(),
      minimum_launch_team: 6,
      persons: [],
      memberships: [],
      manual_goals: {},
    };
    writeFileSync(STORE, JSON.stringify(empty, null, 2) + "\n");
    return empty;
  }
  return JSON.parse(readFileSync(STORE, "utf8")) as PositionParticipationStore;
}

export function loadPositionStore(): PositionParticipationStore {
  return ensure();
}

export function savePositionStore(store: PositionParticipationStore): void {
  store.updated = new Date().toISOString();
  mkdirSync(ROOT, { recursive: true });
  writeFileSync(STORE, JSON.stringify(store, null, 2) + "\n");
}

export function resolveCanonicalPersonId(personOrAliasId: string, store = loadPositionStore()): string {
  for (const p of store.persons) {
    if (p.canonical_person_id === personOrAliasId) return p.canonical_person_id;
    if (p.aliases.includes(personOrAliasId)) return p.canonical_person_id;
    if (p.system_identity_ids.includes(personOrAliasId)) return p.canonical_person_id;
  }
  return personOrAliasId;
}

export function countDistinctPeople(ids: string[], store = loadPositionStore()): number {
  const set = new Set(ids.map((id) => resolveCanonicalPersonId(id, store)));
  return set.size;
}
