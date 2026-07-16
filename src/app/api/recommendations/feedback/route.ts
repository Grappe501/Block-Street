import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { readFileSync } from "fs";
import { join } from "path";
import { recordFeedback, getTelemetry } from "@/lib/recommendations/engine";
import type { FeedbackAction } from "@/lib/recommendations/types";

export const GET = withApiGateway(
  async (ctx) => {
    const path = join(process.cwd(), "data", "recommendations", "feedback.json");
    const data = JSON.parse(readFileSync(path, "utf8"));
    return apiSuccess({ ...data, telemetry: getTelemetry() }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "analytics.view", endpoint: "/api/recommendations/feedback" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      recommendationId: string;
      action: FeedbackAction;
      userId?: string;
      notes?: string;
    };
    if (!body.recommendationId || !body.action) {
      return apiSuccess({ error: "recommendationId and action required" }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 400);
    }
    const entry = recordFeedback(body.recommendationId, body.action, body.userId ?? ctx.actor_id ?? undefined, body.notes);
    return apiSuccess({ ok: true, feedback: entry, telemetry: getTelemetry() }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "analytics.view", endpoint: "/api/recommendations/feedback" }
);
