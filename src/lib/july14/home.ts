import { loadHumanIdentities, loadTrustInvitations } from "../identity-trust/data";
import { listMyInstitutions } from "../identity-trust/wave4/memberships";
import { getIdentityHome, getIdentityTimeline } from "../identity-trust/wave6/home";
import { loadJuly14Demo, getInstitutionDisplayName, maskGlobalHumanId } from "./config";

export function getEnrichedIdentityHome(humanId: string) {
  const home = getIdentityHome(humanId);
  if (!home) return null;

  const identity = loadHumanIdentities().find((h) => h.user_id === humanId);
  const sponsor = identity?.primary_sponsor_id
    ? loadHumanIdentities().find((h) => h.user_id === identity.primary_sponsor_id)
    : null;
  const invitation = identity?.invitation_id
    ? loadTrustInvitations().find((i) => i.id === identity.invitation_id)
    : null;
  const timeline = getIdentityTimeline(humanId).slice(0, 12);
  const memberships = listMyInstitutions(humanId).map((m) => ({
    ...m,
    institution_name: getInstitutionDisplayName(m.institution_id),
  }));

  return {
    ...home,
    global_human_id_masked: maskGlobalHumanId(home.global_human_id),
    preferred_name: identity?.preferred_name ?? identity?.public_name ?? home.public_name,
    approved_alias: identity?.aliases?.find((a) => a.approved)?.alias ?? null,
    sponsor_lineage: sponsor
      ? {
          sponsor_public_name: sponsor.public_name,
          sponsor_id: sponsor.user_id,
          invitation_accepted_at: invitation?.accepted_at ?? identity?.created_at ?? null,
          institution_of_entry: getInstitutionDisplayName(identity?.institution_id ?? "inst-block-street"),
          sponsor_status: "active",
        }
      : null,
    invitation_privilege: {
      available: Math.max(0, (identity?.invite_quota ?? 0) - (identity?.invites_sent ?? 0)),
      sent: identity?.invites_sent ?? 0,
      quota: identity?.invite_quota ?? 0,
    },
    memberships: memberships.map((m) => ({
      institution_id: m.institution_id,
      institution_name: m.institution_name,
      status: m.membership_status,
      role: m.role,
      trust_state: m.institution_trust_state,
    })),
    timeline,
    public_badge: identity?.public_badge ?? home.assurance_state,
  };
}

export function getJuly14MeetingContext(humanId: string) {
  const demo = loadJuly14Demo();
  const home = getEnrichedIdentityHome(humanId);
  const activeMembership = home?.memberships[0];
  return {
    meeting: demo.meeting,
    institution_name: activeMembership
      ? getInstitutionDisplayName(activeMembership.institution_id)
      : getInstitutionDisplayName(demo.meeting.institution_id),
    human: home,
    system_status: demo.system_status,
    demonstration_journey: [
      { q: "Who invited me?", a: home?.sponsor_lineage?.sponsor_public_name ?? "—" },
      { q: "How am I verified?", a: home?.assurance_explanation ?? "—" },
      { q: "Which institution am I in?", a: activeMembership?.institution_name ?? "—" },
      { q: "What can I do here?", a: "Enter meeting workspace, ask questions, invite when authorized" },
      { q: "What is my next action?", a: home?.next_action?.action ?? "Explore our identity home" },
    ],
  };
}

export function getAdminIdentityOverview() {
  const demo = loadJuly14Demo();
  const humans = loadHumanIdentities();
  const invitations = loadTrustInvitations();
  return {
    live: {
      total_humans: humans.length,
      sponsored: humans.filter((h) => h.trust_label === "sponsored").length,
      verified: humans.filter((h) => ["verified", "trusted", "institution_leader"].includes(h.trust_label)).length,
      provisional: humans.filter((h) => h.trust_label === "sponsored" || h.review_required).length,
      invitations_pending: invitations.filter((i) => i.status === "pending").length,
    },
    demonstration: demo.admin_overview_demo,
    demo_humans: demo.demo_humans,
    audit_health: "healthy",
    intelligence_locked: true,
  };
}
