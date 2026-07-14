import { join } from "path";
import {
  clearDurableMemory,
  hydrateNamespace,
  readDurableText,
  writeDurableText,
} from "@/lib/persist/durable-json";
import type { PersonalNetworkProfile } from "./types";

export const NETWORK_DATA_DIR = join(process.cwd(), "data", "network");
const NS = "network";
const PROFILES_FILE = "profiles.json";

const NETWORK_BLOB_KEYS = [PROFILES_FILE];

export async function hydrateNetworkStore(): Promise<void> {
  await hydrateNamespace(NS, NETWORK_BLOB_KEYS, (key) => join(NETWORK_DATA_DIR, key));
}

function readProfiles(): PersonalNetworkProfile[] {
  try {
    const raw = JSON.parse(readDurableText(NS, PROFILES_FILE, join(NETWORK_DATA_DIR, PROFILES_FILE)));
    return (raw.profiles as PersonalNetworkProfile[]) ?? [];
  } catch {
    return [];
  }
}

function writeProfiles(profiles: PersonalNetworkProfile[]) {
  writeDurableText(
    NS,
    PROFILES_FILE,
    JSON.stringify({ profiles }, null, 2),
    join(NETWORK_DATA_DIR, PROFILES_FILE)
  );
}

export function clearNetworkCache() {
  clearDurableMemory(NS);
}

export function loadNetworkProfiles(): PersonalNetworkProfile[] {
  return readProfiles();
}

export function persistNetworkProfiles(profiles: PersonalNetworkProfile[]) {
  writeProfiles(profiles);
}

export function getNetworkProfileByUserId(userId: string): PersonalNetworkProfile | null {
  return loadNetworkProfiles().find((p) => p.user_id === userId) ?? null;
}

export function getNetworkProfileBySlug(slug: string): PersonalNetworkProfile | null {
  const normalized = slug.trim().toLowerCase();
  return loadNetworkProfiles().find((p) => p.share_slug === normalized) ?? null;
}

export function upsertNetworkProfile(profile: PersonalNetworkProfile) {
  const all = loadNetworkProfiles().filter((p) => p.user_id !== profile.user_id);
  all.push(profile);
  persistNetworkProfiles(all);
}
