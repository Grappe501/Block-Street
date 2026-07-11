import { NextRequest } from "next/server";
import { withApiGateway, withIdempotentPost } from "@/lib/api/http";
import { rollbackRelease } from "@/lib/deployment/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    return withIdempotentPost(ctx, request, `/api/v1/deployments/${id}/rollback`, async (body) => {
      return rollbackRelease(id, ctx.actor_id ?? "system", String(body.strategy ?? "application_rollback"));
    });
  },
  { permission: "deployments.rollback", endpoint: "/api/v1/deployments/{id}/rollback" }
);
