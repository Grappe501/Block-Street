import { ApiError } from "@/lib/api/errors";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const AUTH_LIMITS = {
  login: { max: 8, windowMs: 15 * 60_000 },
  passwordless: { max: 6, windowMs: 15 * 60_000 },
  register: { max: 4, windowMs: 60 * 60_000 },
} as const;

export type AuthRateLimitAction = keyof typeof AUTH_LIMITS;

export function checkAuthRateLimit(action: AuthRateLimitAction, key: string): void {
  const limit = AUTH_LIMITS[action];
  const bucketKey = `${action}:${key.toLowerCase()}`;
  const now = Date.now();
  const bucket = buckets.get(bucketKey);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + limit.windowMs });
    return;
  }

  bucket.count += 1;
  if (bucket.count > limit.max) {
    throw new ApiError("RATE_LIMITED", "Too many attempts. Try again later.", 429);
  }
}

export function authRateLimitKey(ip: string | undefined, email: string): string {
  return `${ip ?? "unknown"}:${email.trim().toLowerCase()}`;
}
