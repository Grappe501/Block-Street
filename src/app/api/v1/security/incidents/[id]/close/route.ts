import { withApiGateway, withIdempotentPost } from "@/lib/api/http";
import { closeIncident } from "@/lib/security/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    return withIdempotentPost(ctx, request, `/api/v1/security/incidents/${id}/close`, async () => {
      const incident = closeIncident(id, ctx.actor_id ?? "system");
      return { incident };
    });
  },
  { permission: "security.manage_incidents", endpoint: "/api/v1/security/incidents/{id}/close" }
);
