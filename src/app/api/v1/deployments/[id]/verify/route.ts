import { NextRequest } from "next/server";
import { withApiGateway, withIdempotentPost } from "@/lib/api/http";
import { verifyRelease } from "@/lib/deployment/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    return withIdempotentPost(ctx, request, `/api/v1/deployments/${id}/verify`, async () => {
      return verifyRelease(id, ctx.actor_id ?? "system");
    });
  },
  { permission: "deployments.view", endpoint: "/api/v1/deployments/{id}/verify" }
);
