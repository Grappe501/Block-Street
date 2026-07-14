import { getHomePlaceForUser, loadUsers } from "@/lib/auth/data";
import { loadSponsorRelationships } from "@/lib/identity-trust/data";
import { loadWave1Invitations } from "@/lib/identity-trust/wave1/data";
import {
  getNetworkProfileBySlug,
  getNetworkProfileByUserId,
  upsertNetworkProfile,
} from "./data";
import { allocateUniqueSlug } from "./slug";
import type { NetworkBoard, NetworkMember, PersonalNetworkProfile } from "./types";

const REFERRAL_COOKIE = "bs_referred_by";

export { REFERRAL_COOKIE };

export function createPersonalNetwork(input: {
  user_id: string;
  display_name: string;
  preferred_name: string;
  referred_by?: string | null;
  preferred_slug?: string;
}): PersonalNetworkProfile {
  const existing = getNetworkProfileByUserId(input.user_id);
  if (existing) {
    const updated: PersonalNetworkProfile = {
      ...existing,
      display_name: input.display_name || existing.display_name,
      preferred_name: input.preferred_name || existing.preferred_name,
      referred_by: existing.referred_by ?? input.referred_by ?? null,
      updated_at: new Date().toISOString(),
    };
    upsertNetworkProfile(updated);
    return updated;
  }

  const now = new Date().toISOString();
  const profile: PersonalNetworkProfile = {
    user_id: input.user_id,
    share_slug: allocateUniqueSlug(input.display_name, input.preferred_slug),
    display_name: input.display_name,
    preferred_name: input.preferred_name,
    referred_by: input.referred_by ?? null,
    created_at: now,
    updated_at: now,
  };
  upsertNetworkProfile(profile);
  return profile;
}

export function ensurePersonalNetworkForUser(userId: string): PersonalNetworkProfile | null {
  const user = loadUsers().find((u) => u.user_id === userId);
  if (!user) return null;
  return createPersonalNetwork({
    user_id: user.user_id,
    display_name: user.display_name,
    preferred_name: user.preferred_name,
    preferred_slug: user.preferred_name
      ? `${user.preferred_name}-${user.display_name.split(" ").slice(-1)[0] ?? ""}`
      : undefined,
  });
}

function resolveReferrerUserId(referredBySlugOrId: string | null | undefined): string | null {
  if (!referredBySlugOrId) return null;
  if (referredBySlugOrId.startsWith("usr-")) return referredBySlugOrId;
  const bySlug = getNetworkProfileBySlug(referredBySlugOrId);
  return bySlug?.user_id ?? null;
}

export function getNetworkBoard(userId: string): NetworkBoard | null {
  const profile = ensurePersonalNetworkForUser(userId);
  if (!profile) return null;

  const users = loadUsers();
  const place = getHomePlaceForUser(userId);
  const sponsorRels = loadSponsorRelationships().filter((r) => r.sponsor_id === userId);
  const invitations = loadWave1Invitations().filter(
    (i) => i.originating_sponsor_human_id === userId && i.status !== "accepted" && i.status !== "revoked"
  );

  const members: NetworkMember[] = [];
  const seen = new Set<string>();

  for (const rel of sponsorRels) {
    const u = users.find((x) => x.user_id === rel.sponsored_user_id);
    if (!u || seen.has(u.user_id)) continue;
    seen.add(u.user_id);
    const memberProfile = getNetworkProfileByUserId(u.user_id);
    members.push({
      user_id: u.user_id,
      display_name: u.display_name,
      preferred_name: u.preferred_name,
      share_slug: memberProfile?.share_slug ?? null,
      joined_at: rel.created_at,
      via: "invite",
    });
  }

  for (const u of users) {
    const mp = getNetworkProfileByUserId(u.user_id);
    if (!mp?.referred_by) continue;
    const referrerId = resolveReferrerUserId(mp.referred_by);
    if (referrerId !== userId || seen.has(u.user_id)) continue;
    seen.add(u.user_id);
    members.push({
      user_id: u.user_id,
      display_name: u.display_name,
      preferred_name: u.preferred_name,
      share_slug: mp.share_slug,
      joined_at: mp.created_at,
      via: "referral",
    });
  }

  members.sort((a, b) => b.joined_at.localeCompare(a.joined_at));

  return {
    profile,
    share_url_path: `/s/${profile.share_slug}`,
    home_place: place
      ? {
          kind: place.kind,
          slug: place.slug,
          name: place.name,
          county_slug: place.county_slug,
        }
      : null,
    members,
    invites_pending: invitations.length,
    stats: {
      network_size: members.length,
      referrals: members.filter((m) => m.via === "referral").length,
    },
  };
}

export function getPublicShareCard(slug: string) {
  const profile = getNetworkProfileBySlug(slug);
  if (!profile) return null;
  const place = getHomePlaceForUser(profile.user_id);
  return {
    share_slug: profile.share_slug,
    display_name: profile.display_name,
    preferred_name: profile.preferred_name,
    home_place_name: place?.name ?? null,
  };
}
