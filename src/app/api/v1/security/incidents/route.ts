import { withApiGateway, withIdempotentPost } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { createIncident, listIncidents } from "@/lib/security/engine";

export const GET = withApiGateway(
  async (ctx) => apiSuccess({ incidents: listIncidents() }, { request_id: ctx.request_id, correlation_id: ctx.correlation_id }),
  { permission: "security.view", endpoint: "/api/v1/security/incidents" }
);

export const POST = withApiGateway(
  async (ctx, request) => {
    return withIdempotentPost(ctx, request, "/api/v1/security/incidents", async (body) => {
      const incident = createIncident({
        title: String(body.title ?? "Security incident"),
        severity: (body.severity as "SEV-1" | "SEV-2" | "SEV-3" | "SEV-4") ?? "SEV-3",
        affected_services: (body.affected_services as string[]) ?? [],
        commander: ctx.actor_id ?? "system",
      });
      return { incident };
    });
  },
  { permission: "security.manage_incidents", endpoint: "/api/v1/security/incidents" }
);
