import { loadHumanIdentities, loadTrustInvitations } from "./data";
import type { InvitationAnalytics } from "./types";

export function getInvitationAnalytics(): InvitationAnalytics {
  const invitations = loadTrustInvitations();
  const identities = loadHumanIdentities();
  const pending = invitations.filter((i) => i.status === "pending").length;
  const accepted = invitations.filter((i) => i.status === "accepted").length;
  const revoked = invitations.filter((i) => i.status === "revoked").length;
  const total = invitations.length;

  const sponsorCounts = new Map<string, number>();
  for (const inv of invitations) {
    sponsorCounts.set(inv.sponsor_id, (sponsorCounts.get(inv.sponsor_id) ?? 0) + 1);
  }

  const topSponsors = [...sponsorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([sponsorId, count]) => {
      const identity = identities.find((i) => i.user_id === sponsorId);
      return { sponsor_id: sponsorId, public_name: identity?.public_name ?? sponsorId, count };
    });

  return {
    total_invitations: total,
    pending,
    accepted,
    revoked,
    acceptance_rate: total > 0 ? Math.round((accepted / total) * 100) : 0,
    top_sponsors: topSponsors,
  };
}
