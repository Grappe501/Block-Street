import { NextRequest } from "next/server";
import { withApiGateway, withIdempotentPost } from "@/lib/api/http";
import { deployToProduction } from "@/lib/deployment/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    return withIdempotentPost(ctx, request, `/api/v1/deployments/${id}/deploy-production`, async () => {
      const result = deployToProduction(id, ctx.actor_id ?? "system", ctx.effective_permissions);
      return result;
    });
  },
  { permission: "deployments.deploy_production", endpoint: "/api/v1/deployments/{id}/deploy-production" }
);
