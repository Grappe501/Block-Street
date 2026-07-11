import type { ApiRequestContext } from "./types";
import { ApiError } from "./errors";

const buckets = new Map<string, { count: number; resetAt: number }>();

const LIMITS: Record<string, { max: number; windowMs: number }> = {
  anonymous: { max: 60, windowMs: 60_000 },
  user: { max: 300, windowMs: 60_000 },
  api_client: { max: 600, windowMs: 60_000 },
};

export function checkRateLimit(ctx: ApiRequestContext, endpoint: string) {
  const tier = ctx.actor_type === "anonymous" ? "anonymous" : ctx.actor_type === "api_client" ? "api_client" : "user";
  const limit = LIMITS[tier];
  const key = `${tier}:${ctx.actor_id ?? "anon"}:${endpoint}`;
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + limit.windowMs });
    return;
  }
  bucket.count += 1;
  if (bucket.count > limit.max) {
    throw new ApiError("RATE_LIMITED", "Too many requests. Try again shortly.", 429);
  }
}
