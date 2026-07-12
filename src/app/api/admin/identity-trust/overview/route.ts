import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/admin/http";
import {
  detectBadActorSponsor,
  getIdentityTrustOverview,
  getIdentityTrustPolicy,
  getInviteTree,
  listHumanIdentities,
  listIdentityReviews,
  listIdentityTrustAudit,
  listTrustInvitations,
} from "@/lib/identity-trust/engine";
import { listAppeals } from "@/lib/identity-trust/governance";
import { listFederationMemberships } from "@/lib/identity-trust/federation";
import { listIntelligenceAlerts } from "@/lib/identity-trust/intelligence";
import { getInvitationAnalytics } from "@/lib/identity-trust/invitations";
import { runIdentityCertification } from "@/lib/identity-trust/certification";
import { getIdentityOperationsDashboard } from "@/lib/identity-trust/operations";

export const GET = withAdmin(() =>
  NextResponse.json({
    overview: getIdentityTrustOverview(),
    policy: getIdentityTrustPolicy(),
    identities: listHumanIdentities(),
    invitations: listTrustInvitations(),
    reviews: listIdentityReviews(),
    appeals: listAppeals(),
    federation_memberships: listFederationMemberships(),
    intelligence_alerts: listIntelligenceAlerts("open"),
    invitation_analytics: getInvitationAnalytics(),
    invite_tree: getInviteTree("usr-001", 3),
    sponsor_accountability: detectBadActorSponsor("usr-001"),
    operations: getIdentityOperationsDashboard("usr-001"),
    certification: runIdentityCertification("usr-001"),
    audit: listIdentityTrustAudit(30),
  })
);
