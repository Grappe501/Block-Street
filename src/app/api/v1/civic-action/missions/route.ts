import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listMissions, updateMissionStatus, escalateMission, assignMission } from "@/lib/civic-action/missions";
import { ensureCaeStore } from "@/lib/civic-action/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    ensureCaeStore();
    const initiativeId = request.nextUrl.searchParams.get("initiative_id") ?? undefined;
    const status = request.nextUrl.searchParams.get("status") as import("@/lib/civic-action/types").MissionStatus | null;
    const mine = request.nextUrl.searchParams.get("mine") === "true";
    return apiSuccess(
      listMissions({
        initiative_id: initiativeId,
        status: status ?? undefined,
        assigned_human_id: mine ? ctx.actor_id! : undefined,
      }),
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "civic_action.view", endpoint: "/api/v1/civic-action/missions" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    ensureCaeStore();
    const body = (await request.json()) as { action?: string; mission_id?: string; status?: string; human_id?: string; reason?: string };
    const actorId = ctx.actor_id ?? "system";

    if (body.action === "escalate" && body.mission_id && body.reason) {
      return apiSuccess(escalateMission(body.mission_id, actorId, body.reason), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    if (body.action === "assign" && body.mission_id && body.human_id) {
      return apiSuccess(assignMission(body.mission_id, body.human_id, actorId), {
        request_id: ctx.request_id,
        correlation_id: ctx.correlation_id,
      });
    }
    if (body.action === "update_status" && body.mission_id && body.status) {
      return apiSuccess(
        updateMissionStatus(body.mission_id, body.status as import("@/lib/civic-action/types").MissionStatus, actorId, body.reason),
        { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
      );
    }
    throw new Error("Unknown action");
  },
  { permission: "civic_action.manage", endpoint: "/api/v1/civic-action/missions" }
);
