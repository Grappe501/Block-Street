import { withApiGateway, withIdempotentPost } from "@/lib/api/http";
import { createPrivacyRequest } from "@/lib/security/engine";

export const POST = withApiGateway(
  async (ctx, request) => {
    return withIdempotentPost(ctx, request, "/api/v1/security/privacy-requests", async (body) => {
      const privacy_request = createPrivacyRequest({
        request_type: String(body.request_type ?? "export"),
        requesting_user_id: ctx.actor_id ?? "system",
        subject_user_id: String(body.subject_user_id ?? ctx.actor_id ?? "system"),
        organization_id: body.organization_id ? String(body.organization_id) : undefined,
      });
      return { privacy_request };
    });
  },
  { permission: "security.privacy_requests", endpoint: "/api/v1/security/privacy-requests" }
);
