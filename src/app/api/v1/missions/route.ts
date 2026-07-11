import { NextRequest } from "next/server";
import { withApiGateway, withIdempotentPost } from "@/lib/api/http";
import { apiSuccess, ApiError } from "@/lib/api/errors";
import { getV1Missions, paginate, validateFields } from "@/lib/api/gateway";

export const GET = withApiGateway(
  (ctx, request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
    const cursor = searchParams.get("cursor");
    const missions = getV1Missions({
      scope: searchParams.get("scope") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      county: searchParams.get("county") ?? undefined,
      limit: 100,
    });
    const page = paginate(missions, limit, cursor);
    return apiSuccess(page.items, {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
      pagination: { next_cursor: page.next_cursor, has_more: page.has_more, limit },
    });
  },
  { permission: "missions.read", endpoint: "/api/v1/missions" }
);

export const POST = withApiGateway(
  async (ctx, request: NextRequest) => {
    return withIdempotentPost(ctx, request, "/api/v1/missions", async (body) => {
      const fieldErrors = validateFields(body, ["title", "type", "scope", "purpose", "owner"]);
      if (fieldErrors) throw new ApiError("VALIDATION_FAILED", "Some fields need attention.", 400, fieldErrors);
      const { createMission } = await import("@/lib/missions/engine");
      const mission = createMission({
        title: String(body.title),
        type: body.type as Parameters<typeof createMission>[0]["type"],
        scope: String(body.scope) as Parameters<typeof createMission>[0]["scope"],
        purpose: String(body.purpose),
        owner: String(body.owner),
        county: body.county ? String(body.county) : undefined,
        templateId: body.templateId ? String(body.templateId) : undefined,
        source: (body.source ? String(body.source) : "manual") as Parameters<typeof createMission>[0]["source"],
      });
      return mission;
    });
  },
  { permission: "missions.write", endpoint: "/api/v1/missions" }
);
