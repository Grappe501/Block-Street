import { NextRequest } from "next/server";
import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getV1Search, paginate } from "@/lib/api/gateway";

export const GET = withApiGateway(
  (ctx, request: NextRequest) => {
    const q = request.nextUrl.searchParams.get("q") || "";
    const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") || "25", 10), 100);
    const cursor = request.nextUrl.searchParams.get("cursor");
    const results = getV1Search(q, 100);
    const page = paginate(results, limit, cursor);
    return apiSuccess(page.items, {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
      pagination: { next_cursor: page.next_cursor, has_more: page.has_more, limit },
    });
  },
  { endpoint: "/api/v1/search" }
);
