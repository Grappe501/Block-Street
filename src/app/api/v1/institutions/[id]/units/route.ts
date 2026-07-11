import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { createUnit, listInstitutionUnits } from "@/lib/organization/engine";
import type { CreateUnitInput } from "@/lib/organization/types";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.pathname.split("/")[4] ?? "";
    return apiSuccess(
      { units: listInstitutionUnits(institutionId) },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );
  },
  { permission: "organization.view", endpoint: "/api/v1/institutions/{id}/units" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.pathname.split("/")[4] ?? "";
    const body = (await request.json()) as Omit<CreateUnitInput, "institution_id">;
    try {
      const unit = createUnit({ ...body, institution_id: institutionId }, ctx.actor_id ?? "system");
      return apiSuccess({ unit }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Create failed", 400);
    }
  },
  { permission: "organization.manage", endpoint: "/api/v1/institutions/{id}/units" }
);
