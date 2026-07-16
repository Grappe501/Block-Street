import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getDashboard, listMissions } from "@/lib/missions/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const params = request.nextUrl.searchParams;
    const scope = params.get("scope") || undefined;
    const status = params.get("status") || undefined;
    const county = params.get("county") || undefined;
    const limit = Math.min(parseInt(params.get("limit") || "50", 10), 100);
    const missions = listMissions({ scope, status, county, limit });
    const dashboard = getDashboard();
    return apiSuccess({ count: missions.length, dashboard, missions }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "missions.read", endpoint: "/api/missions" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      title: string;
      type: string;
      scope: string;
      purpose: string;
      owner: string;
      county?: string;
      templateId?: string;
      source?: string;
    };
    const { createMission } = await import("@/lib/missions/engine");
    if (!body.title || !body.type || !body.scope || !body.purpose || !body.owner) {
      return apiSuccess({ error: "title, type, scope, purpose, owner required" }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 400);
    }
    const mission = createMission({
      title: body.title,
      type: body.type as Parameters<typeof createMission>[0]["type"],
      scope: body.scope as Parameters<typeof createMission>[0]["scope"],
      purpose: body.purpose,
      owner: body.owner,
      county: body.county,
      templateId: body.templateId,
      source: body.source as Parameters<typeof createMission>[0]["source"],
    });
    return apiSuccess({ ok: true, mission }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
  },
  { permission: "missions.write", endpoint: "/api/missions" }
);
