import { withApiGateway } from "@/lib/api/http";
import { listPendingOutboxForAdmin } from "@/lib/civic-action/builds/11.7/events/outbox-publisher";
import { withCommunicationApi } from "@/lib/civic-action/builds/11.7/api/http-helpers";

/** Admin: list pending outbox events */
export const GET = withApiGateway(
  async (ctx, request) =>
    withCommunicationApi(
      ctx,
      request,
      (apiCtx) => {
        const limit = request.nextUrl.searchParams.get("limit")
          ? Number(request.nextUrl.searchParams.get("limit"))
          : 50;
        return {
          pending: listPendingOutboxForAdmin(limit),
          institution_id: apiCtx.institution_id,
        };
      },
      { requireAuth: true }
    ),
  { permission: "civic_action.manage", endpoint: "/api/v1/communications/events/outbox" }
);
