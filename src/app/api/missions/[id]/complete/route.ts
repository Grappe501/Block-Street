import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { completeMission } from "@/lib/missions/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const parts = request.nextUrl.pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 2] ?? "";
    const mission = completeMission(id);
    if (!mission) return apiSuccess({ error: "Mission not found" }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 404);
    return apiSuccess({ ok: true, mission }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "missions.write", endpoint: "/api/missions/{id}/complete" }
);
