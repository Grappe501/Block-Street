import { createHash, randomBytes } from "crypto";
import { loadIdempotencyRecords, persistIdempotencyRecords } from "./data";
import { ApiError } from "./errors";
import type { ApiRequestContext } from "./types";

const TTL_MS = 24 * 60 * 60 * 1000;

function hashKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

export function checkIdempotency(
  ctx: ApiRequestContext,
  endpoint: string,
  idempotencyKey: string | null,
  requestHash: string
): { replay: boolean; response?: unknown } {
  if (!idempotencyKey) return { replay: false };
  const keyHash = hashKey(idempotencyKey);
  const actorId = ctx.actor_id ?? "anonymous";
  const existing = loadIdempotencyRecords().find(
    (r) =>
      r.idempotency_key_hash === keyHash &&
      r.actor_id === actorId &&
      r.endpoint === endpoint &&
      new Date(r.expires_at).getTime() > Date.now()
  );
  if (!existing) return { replay: false };
  if (existing.request_hash !== requestHash) {
    throw new ApiError("IDEMPOTENCY_CONFLICT", "Idempotency key reused with different request body.", 409);
  }
  return { replay: true, response: JSON.parse(existing.response_reference) };
}

export function storeIdempotency(
  ctx: ApiRequestContext,
  endpoint: string,
  idempotencyKey: string,
  requestHash: string,
  response: unknown
) {
  const records = loadIdempotencyRecords();
  const now = Date.now();
  records.push({
    id: `idem-${randomBytes(4).toString("hex")}`,
    idempotency_key_hash: hashKey(idempotencyKey),
    actor_id: ctx.actor_id ?? "anonymous",
    api_client_id_optional: ctx.api_client_id_optional,
    endpoint,
    request_hash: requestHash,
    response_reference: JSON.stringify(response),
    status: "completed",
    created_at: new Date(now).toISOString(),
    expires_at: new Date(now + TTL_MS).toISOString(),
  });
  persistIdempotencyRecords(records);
}
