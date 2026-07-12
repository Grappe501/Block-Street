import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { listIdentityReviews, openIdentityReview, resolveIdentityReview } from "@/lib/identity-trust/engine";

export const GET = withApiGateway(
  async (ctx, request) => {
    const status = request.nextUrl.searchParams.get("status") as Parameters<typeof listIdentityReviews>[0];
    return apiSuccess(listIdentityReviews(status ?? undefined), {
      request_id: ctx.request_id,
      correlation_id: ctx.correlation_id,
    });
  },
  { permission: "identity_trust.view", endpoint: "/api/v1/identity-trust/reviews" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action as string;
    if (action === "resolve") {
      const review = resolveIdentityReview({
        review_id: body.review_id as string,
        resolver_id: ctx.actor_id!,
        outcome: body.outcome as Parameters<typeof resolveIdentityReview>[0]["outcome"],
        resolution_notes: body.resolution_notes as string | undefined,
      });
      return apiSuccess(review, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }
    const review = openIdentityReview({
      subject_user_id: body.subject_user_id as string,
      opened_by: ctx.actor_id!,
      reason: body.reason as string,
    });
    return apiSuccess(review, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
  },
  { permission: "identity_trust.manage", endpoint: "/api/v1/identity-trust/reviews" }
);
