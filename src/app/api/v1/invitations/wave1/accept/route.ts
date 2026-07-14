import { withApiGateway } from "@/lib/api/http";
import { apiSuccess } from "@/lib/api/errors";
import { completeWave1Activation, startWave1Acceptance } from "@/lib/identity-trust/wave1/acceptance";
import { hydrateAuthStore, clearAuthCache, loadSessions } from "@/lib/auth/data";
import { hydrateIdentityTrustStore, clearIdentityTrustCache } from "@/lib/identity-trust/data";
import { hydrateNetworkStore } from "@/lib/network";
import { clearWave1Cache } from "@/lib/identity-trust/wave1/data";
import { setSessionCookie } from "@/lib/auth/http";
import { invalidateDurableNamespace } from "@/lib/persist/durable-json";

async function refreshStoresForAccept() {
  // Force a fresh Blobs read so invites created on another serverless instance are visible
  invalidateDurableNamespace("auth");
  invalidateDurableNamespace("identity-trust");
  invalidateDurableNamespace("network");
  clearAuthCache();
  clearIdentityTrustCache();
  clearWave1Cache();
  await hydrateAuthStore();
  await hydrateIdentityTrustStore();
  await hydrateNetworkStore();
}

export const POST = withApiGateway(
  async (ctx, request) => {
    await refreshStoresForAccept();

    const body = (await request.json()) as Record<string, unknown>;
    const action = (body.action as string) ?? "accept";

    if (action === "acceptance_start") {
      const result = startWave1Acceptance(body.token as string, body.email as string | undefined);
      return apiSuccess(result, { request_id: ctx.request_id, correlation_id: ctx.correlation_id });
    }

    const result = completeWave1Activation(
      {
        token: body.token as string,
        email: body.email as string,
        password: body.password as string,
        public_name: body.public_name as string,
        preferred_short_name: body.preferred_short_name as string | undefined,
        link_existing_user_id: body.link_existing_user_id as string | undefined,
        referred_by: (body.referred_by as string | undefined) ?? null,
      },
      { ip: request.headers.get("x-forwarded-for") ?? undefined, userAgent: request.headers.get("user-agent") ?? undefined }
    );

    const next = result.next ?? "/choose-place";
    const response = apiSuccess(
      { ...result, next },
      { request_id: ctx.request_id, correlation_id: ctx.correlation_id }
    );

    if (result.session_id) {
      const session = loadSessions().find((s) => s.session_id === result.session_id);
      if (session) {
        setSessionCookie(response, session);
      }
    }

    // Persist activation (new user + wave1 status) before responding
    const { flushWave1StoreToBlobs } = await import("@/lib/identity-trust/wave1/data");
    const { writeDurableTextAsync } = await import("@/lib/persist/durable-json");
    const { DATA_DIR, loadUsers, loadSessions: loadSess, loadInvitations } = await import("@/lib/auth/data");
    const { join } = await import("path");
    await flushWave1StoreToBlobs();
    await writeDurableTextAsync("auth", "users.json", JSON.stringify({ users: loadUsers() }, null, 2), join(DATA_DIR, "users.json"));
    await writeDurableTextAsync("auth", "sessions.json", JSON.stringify({ sessions: loadSess() }, null, 2), join(DATA_DIR, "sessions.json"));
    await writeDurableTextAsync(
      "auth",
      "invitations.json",
      JSON.stringify({ invitations: loadInvitations() }, null, 2),
      join(DATA_DIR, "invitations.json")
    );

    return response;
  },
  { public: true, endpoint: "/api/v1/invitations/wave1/accept" }
);
