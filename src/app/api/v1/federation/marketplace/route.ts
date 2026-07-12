import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { listMarketplaceAssets, publishMarketplaceAsset } from "@/lib/federation/engine";
import type { MarketplaceAsset } from "@/lib/federation/types";

export const GET = withApiGateway(
  async (ctx) => {
    return apiSuccess({ assets: listMarketplaceAssets() }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "federation.view", endpoint: "/api/v1/federation/marketplace" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      owner_institution_id: string;
      title: string;
      asset_type: MarketplaceAsset["asset_type"];
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      const asset = publishMarketplaceAsset({ ...body, actor_id: actorId });
      return apiSuccess({ asset }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Marketplace publish failed", 400);
    }
  },
  { permission: "federation.publish", endpoint: "/api/v1/federation/marketplace" }
);
