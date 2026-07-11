import { withApiGateway, withIdempotentPost } from "@/lib/api/http";
import { resolveAlert } from "@/lib/monitoring/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    return withIdempotentPost(ctx, request, `/api/v1/monitoring/alerts/${id}/resolve`, async () => {
      const alert = resolveAlert(id, ctx.actor_id ?? "system");
      return { alert };
    });
  },
  { permission: "monitoring.manage_alerts", endpoint: "/api/v1/monitoring/alerts/{id}/resolve" }
);
