import { randomBytes } from "crypto";
import { getUserById } from "@/lib/auth/engine";
import { buildViewerContext, listPublishedContent } from "@/lib/cms/engine";
import { listUserNotifications } from "@/lib/notifications/engine";
import { listMissions } from "@/lib/missions/engine";
import { search } from "@/lib/search/engine";
import {
  appendApiAudit,
  loadApiClients,
  loadApiCredentials,
  loadAiTools,
  loadDeprecations,
  loadTelemetry,
  loadWebhookSubscriptions,
  readApiAudit,
} from "./data";
import type { ApiOverview } from "./types";

export function getApiOverview(): ApiOverview {
  const t = loadTelemetry();
  return {
    requests_today: Number(t.requests_today ?? 0),
    success_rate: Number(t.success_rate ?? 0),
    p95_latency_ms: Number(t.p95_latency_ms ?? 0),
    authentication_failures: Number(t.authentication_failures ?? 0),
    permission_denials: Number(t.permission_denials ?? 0),
    rate_limited_requests: Number(t.rate_limited_requests ?? 0),
    webhook_failures: Number(t.webhook_failures ?? 0),
    deprecated_api_usage_percent: Number(t.deprecated_api_usage_percent ?? 0),
    critical_endpoint_status: String(t.critical_endpoint_status ?? "operational"),
    active_clients: loadApiClients().filter((c) => c.status === "active").length,
    active_credentials: loadApiCredentials().filter((c) => c.status === "active").length,
    active_webhooks: loadWebhookSubscriptions().filter((s) => s.status === "active").length,
    api_version: "v1",
  };
}

export function paginate<T>(items: T[], limit: number, cursor?: string | null) {
  const start = cursor ? parseInt(Buffer.from(cursor, "base64url").toString("utf8"), 10) || 0 : 0;
  const slice = items.slice(start, start + limit);
  const next = start + limit < items.length ? Buffer.from(String(start + limit)).toString("base64url") : null;
  return { items: slice, next_cursor: next, has_more: next !== null };
}

export function getPublicContent(filters?: { content_type?: string }) {
  const viewer = buildViewerContext(null);
  return listPublishedContent(viewer, { content_type: filters?.content_type });
}

export function getIdentityMe(userId: string) {
  const user = getUserById(userId);
  if (!user) return null;
  const { password_hash: _, mfa_secret: __, ...safe } = user;
  return safe;
}

export function getV1Missions(params: { scope?: string; status?: string; county?: string; limit?: number }) {
  return listMissions({
    scope: params.scope,
    status: params.status,
    county: params.county,
    limit: params.limit ?? 50,
  });
}

export function getV1Notifications(userId: string, unread?: boolean) {
  return listUserNotifications(userId, unread ? { unread: true } : undefined);
}

export function getV1Search(q: string, limit: number) {
  return search(q, { mode: "standard", limit });
}

export function auditApiRequest(
  ctx: { request_id: string; correlation_id: string; actor_id: string | null; actor_type: string },
  endpoint: string,
  method: string,
  status: number,
  result: string
) {
  appendApiAudit({
    request_id: ctx.request_id,
    correlation_id: ctx.correlation_id,
    actor_id: ctx.actor_id,
    actor_type: ctx.actor_type,
    endpoint,
    method,
    status_code: status,
    result,
  });
}

export function validateFields(body: Record<string, unknown>, required: string[]): Record<string, string> | null {
  const fields: Record<string, string> = {};
  for (const key of required) {
    if (body[key] === undefined || body[key] === null || body[key] === "") {
      fields[key] = `The field ${key} is required.`;
    }
  }
  return Object.keys(fields).length ? fields : null;
}

export { readApiAudit, loadApiClients, loadApiCredentials, loadDeprecations, loadAiTools, loadWebhookSubscriptions };
