import { withApiGateway, withIdempotentPost } from "@/lib/api/http";
import { verifyVulnerability } from "@/lib/security/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    const id = request.nextUrl.pathname.split("/")[4] ?? "";
    return withIdempotentPost(ctx, request, `/api/v1/security/vulnerabilities/${id}/verify`, async () => {
      const vulnerability = verifyVulnerability(id, ctx.actor_id ?? "system");
      return { vulnerability };
    });
  },
  { permission: "security.manage_vulnerabilities", endpoint: "/api/v1/security/vulnerabilities/{id}/verify" }
);
