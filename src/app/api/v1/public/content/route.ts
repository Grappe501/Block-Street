import { NextRequest } from "next/server";
import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { getPublicContent, paginate } from "@/lib/api/gateway";

export const GET = withApiGateway(
  (ctx, request: NextRequest) => {
    const { searchParams } = request.nextUrl;
    const limit = Math.min(parseInt(searchParams.get("limit") || "25", 10), 100);
    const cursor = searchParams.get("cursor");
    const content_type = searchParams.get("content_type") ?? undefined;
    const all = getPublicContent({ content_type });
    const page = paginate(all, limit, cursor);
    return apiSuccess(page.items, {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
      pagination: { next_cursor: page.next_cursor, has_more: page.has_more, limit },
    });
  },
  { public: true, endpoint: "/api/v1/public/content" }
);
