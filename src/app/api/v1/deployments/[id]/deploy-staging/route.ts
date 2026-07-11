import { NextRequest } from "next/server";
import { withApiGateway, withIdempotentPost } from "@/lib/api/http";
import { deployToStaging } from "@/lib/deployment/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    return withIdempotentPost(ctx, request, `/api/v1/deployments/${id}/deploy-staging`, async () => {
      const candidate = deployToStaging(id, ctx.actor_id ?? "system");
      return { candidate };
    });
  },
  { permission: "deployments.deploy_staging", endpoint: "/api/v1/deployments/{id}/deploy-staging" }
);
