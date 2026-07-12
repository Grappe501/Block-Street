import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { forkSharedResource, listSharedResources, publishSharedResource } from "@/lib/federation/engine";
import type { ResourceVisibility } from "@/lib/federation/types";

export const GET = withApiGateway(
  async (ctx, request) => {
    const visibility = request.nextUrl.searchParams.get("visibility") ?? undefined;
    return apiSuccess({ resources: listSharedResources(visibility ?? undefined) }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "federation.view", endpoint: "/api/v1/federation/resources" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as {
      owner_institution_id: string;
      title: string;
      resource_type: "training" | "playbook" | "template" | "policy";
      visibility?: ResourceVisibility;
      action?: string;
      parent_id?: string;
    };
    const actorId = ctx.actor_id ?? "system";
    try {
      if (body.action === "fork" && body.parent_id) {
        return apiSuccess(
          { resource: forkSharedResource(body.parent_id, body.owner_institution_id, actorId) },
          { request_id: ctx.request_id, correlation_id: ctx.correlation_id },
          201
        );
      }
      const resource = publishSharedResource({
        owner_institution_id: body.owner_institution_id,
        title: body.title,
        resource_type: body.resource_type,
        visibility: body.visibility ?? "federation",
        actor_id: actorId,
      });
      return apiSuccess({ resource }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Resource action failed", 400);
    }
  },
  { permission: "federation.publish", endpoint: "/api/v1/federation/resources" }
);
