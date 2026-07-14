import { NextRequest, NextResponse } from "next/server";
import { hydrateAuthStore, loadHomePlaces, loadUsers } from "@/lib/auth/data";
import { withAdmin } from "@/lib/admin/http";
import { assertAdminPermission } from "@/lib/admin/engine";
import { hydrateNetworkStore, loadNetworkProfiles } from "@/lib/network";
import { getOutreachVisibility } from "@/lib/directory/search";
import { loadWave1Invitations } from "@/lib/identity-trust/wave1/data";
import { hydrateIdentityTrustStore } from "@/lib/identity-trust/data";

export const GET = withAdmin(async (ctx, request: NextRequest) => {
  assertAdminPermission(ctx, "users.view");
  await hydrateAuthStore();
  await hydrateNetworkStore();
  await hydrateIdentityTrustStore();

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const placeFilter = url.searchParams.get("place") ?? "";
  const statusFilter = url.searchParams.get("status") ?? "";

  const places = loadHomePlaces();
  const profiles = loadNetworkProfiles();
  const invitations = loadWave1Invitations();

  let users = loadUsers().map(({ password_hash: _, mfa_secret: __, ...u }) => {
    const place = places.find((p) => p.user_id === u.user_id) ?? null;
    const network = profiles.find((p) => p.user_id === u.user_id) ?? null;
    return {
      ...u,
      home_place: place,
      share_slug: network?.share_slug ?? null,
      referred_by: network?.referred_by ?? null,
    };
  });

  if (q) {
    users = users.filter(
      (u) =>
        u.display_name.toLowerCase().includes(q) ||
        u.primary_email.toLowerCase().includes(q) ||
        (u.share_slug && u.share_slug.includes(q))
    );
  }
  if (placeFilter) {
    users = users.filter(
      (u) =>
        u.home_place?.slug === placeFilter ||
        u.home_place?.county_slug === placeFilter ||
        u.home_place?.name?.toLowerCase().includes(placeFilter.toLowerCase())
    );
  }
  if (statusFilter) {
    users = users.filter((u) => u.account_status === statusFilter);
  }

  const outreach = getOutreachVisibility();
  const pendingInvites = invitations.filter((i) => i.status !== "accepted" && i.status !== "revoked").length;

  return NextResponse.json({
    users,
    growth: {
      total_participants: users.length,
      with_home_place: places.length,
      with_share_slug: profiles.length,
      pending_invitations: pendingInvites,
      ...outreach,
    },
  });
});
