import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getMission, updateMission } from "@/lib/missions/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/").pop() ?? "";
    const mission = getMission(id);
    if (!mission) return apiSuccess({ error: "Mission not found" }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 404);
    return apiSuccess({ mission }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "missions.read", endpoint: "/api/missions/{id}" }
);

export const PATCH = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/").filter(Boolean).pop() ?? "";
    const body = (await request.json()) as Record<string, unknown>;
    const mission = updateMission(id, body);
    if (!mission) return apiSuccess({ error: "Mission not found" }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 404);
    return apiSuccess({ ok: true, mission }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "missions.write", endpoint: "/api/missions/{id}" }
);
