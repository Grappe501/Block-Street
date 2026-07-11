import { createHash } from "crypto";
import { loadApiClients, loadApiCredentials } from "./data";

const DEMO_KEY = "bsk_live_wc_demo_county_key_v1";

export function resolveApiClientFromKey(apiKey: string) {
  if (apiKey === DEMO_KEY || apiKey.startsWith("bsk_live_wc")) {
    const client = loadApiClients().find((c) => c.id === "client-county-integration" && c.status === "active");
    const cred = loadApiCredentials().find((c) => c.api_client_id === "client-county-integration" && c.status === "active");
    if (!client || !cred) return null;
    if (apiKey !== DEMO_KEY && cred.prefix !== apiKey.slice(0, cred.prefix.length)) return null;
    return { client, credential: cred };
  }
  return null;
}

export function hashCredential(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
