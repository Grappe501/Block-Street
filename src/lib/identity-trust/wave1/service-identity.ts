import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

export interface ServiceIdentity {
  id: string;
  label: string;
  actor_type: "service_identity";
  human_owner_id: string;
  permissions: string[];
  rotatable: boolean;
  created_at: string;
  status: "active" | "revoked";
}

const PATH = join(process.cwd(), "data", "identity-trust", "service_identities.json");

export function loadServiceIdentities(): ServiceIdentity[] {
  try {
    const raw = JSON.parse(readFileSync(PATH, "utf8"));
    return raw.identities ?? [];
  } catch {
    return [];
  }
}

export function persistServiceIdentities(identities: ServiceIdentity[]) {
  writeFileSync(PATH, JSON.stringify({ identities }, null, 2));
}

export function assertNotServiceIdentityMasquerading(userId: string) {
  const svc = loadServiceIdentities().find((s) => s.id === userId && s.status === "active");
  if (svc) {
    throw new Error("Service identities cannot masquerade as human accounts.");
  }
}
