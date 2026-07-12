import { loadUsers } from "@/lib/auth/data";
import { loadHumanIdentities, persistHumanIdentities } from "../data";
import { appendIdentityHistory } from "../history";
import { generateHumGlobalId } from "./engine";
import { itlId, nowIso } from "../utils";
import { recordWave1Audit } from "./lineage";
import { declarePublicIdentity } from "./engine";
import { createProvisionalMembership } from "./engine";
import { loadWave1Memberships } from "./data";

export type LegacyClassification =
  | "founding_identity_candidate"
  | "known_human_sponsor_available"
  | "known_human_institutional_verification"
  | "existing_human_sponsor_unknown"
  | "service_account"
  | "test_account"
  | "duplicate_account"
  | "shared_account"
  | "archive_candidate";

export function reconcileLegacyHumans(actorId: string) {
  const users = loadUsers().filter((u) => u.account_status === "active");
  const humans = loadHumanIdentities();
  const reconciled: { user_id: string; global_human_id: string; classification: LegacyClassification }[] = [];

  for (const user of users) {
    let human = humans.find((h) => h.user_id === user.user_id);
    if (human) continue;

    const ghid = generateHumGlobalId();
    const isBootstrap = user.user_id === "usr-001";
    human = {
      id: itlId("hid"),
      global_human_id: ghid,
      user_id: user.user_id,
      legal_name: user.legal_name_optional,
      public_name: user.display_name,
      preferred_name: user.preferred_name,
      display_name: user.preferred_name,
      known_alias_approved: false,
      aliases: [],
      identity_status: "active",
      trust_level: isBootstrap ? 4 : 1,
      trust_label: isBootstrap ? "institution_leader" : "sponsored",
      public_badge: isBootstrap ? "Leader" : "Sponsored Member",
      primary_sponsor_id: isBootstrap ? null : "usr-001",
      invitation_id: isBootstrap ? "founding-seed" : "legacy-reconciled",
      institution_id: "inst-block-street",
      organization_id: "org-block-street",
      intended_role: null,
      invite_quota: isBootstrap ? -1 : 0,
      invites_sent: 0,
      independent_verification_count: 0,
      institution_leader: isBootstrap,
      federation_trusted: false,
      review_required: !isBootstrap,
      last_active_at: nowIso(),
      created_at: user.created_at,
      updated_at: nowIso(),
      trust_established_at: user.created_at,
      archived_at: null,
    };
    humans.push(human);
    declarePublicIdentity({
      human_id: user.user_id,
      global_human_id: ghid,
      public_name: user.display_name,
      preferred_short_name: user.preferred_name,
    });

    const memberships = loadWave1Memberships();
    if (!memberships.find((m) => m.human_id === user.user_id)) {
      createProvisionalMembership({
        human_id: user.user_id,
        global_human_id: ghid,
        institution_id: "inst-block-street",
        invitation_id: "legacy-reconciled",
        sponsor_human_id: isBootstrap ? "founding-seed" : "usr-001",
        proposed_role_id: "member",
        organization_unit_id: "org-block-street",
      });
    }

    appendIdentityHistory({
      global_human_id: ghid,
      user_id: user.user_id,
      event_type: "identity_created",
      actor_id: actorId,
      summary: "Legacy human reconciled — no fabricated invitation",
      details: {
        classification: isBootstrap ? "founding_identity_candidate" : "existing_human_sponsor_unknown",
        source: "legacy_reconciliation",
        migration_authority: actorId,
      },
    });

    recordWave1Audit({
      event_type: "identity.human_created",
      actor_human_id: actorId,
      subject_human_id: user.user_id,
      institution_id: "inst-block-street",
      invitation_id: null,
      sponsor_relationship_id: null,
      action: "legacy_reconciliation",
      previous_state: null,
      new_state: "active",
      reason: "Legacy lineage — not fabricated invitation",
      request_id: null,
      correlation_id: itlId("legacy"),
      result: "success",
    });

    reconciled.push({
      user_id: user.user_id,
      global_human_id: ghid,
      classification: isBootstrap ? "founding_identity_candidate" : "existing_human_sponsor_unknown",
    });
  }

  persistHumanIdentities(humans);
  return reconciled;
}
