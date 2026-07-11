import { withApiGateway } from "@/lib/api/http";
import { ApiError, apiSuccess } from "@/lib/api/errors";
import { generateJourney, getJourneyForUser } from "@/lib/onboarding/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const institutionId = request.nextUrl.searchParams.get("institution_id") ?? undefined;
    const journey = getJourneyForUser(ctx.actor_id ?? "", institutionId);
    return apiSuccess({ journey }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "onboarding.view", endpoint: "/api/v1/onboarding/journeys" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as GenerateJourneyBody;
    try {
      const journey = generateJourney({ ...body, user_id: ctx.actor_id ?? body.user_id });
      return apiSuccess({ journey }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }, 201);
    } catch (e) {
      throw new ApiError("INVALID_REQUEST", e instanceof Error ? e.message : "Journey generation failed", 400);
    }
  },
  { permission: "onboarding.manage", endpoint: "/api/v1/onboarding/journeys" }
);

type GenerateJourneyBody = {
  user_id: string;
  institution_id: string;
  unit_id?: string;
  unit_name?: string;
  institution_name?: string;
  role_key: string;
};
