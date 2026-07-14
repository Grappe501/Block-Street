/**
 * V2-A participation regression tests.
 * Run: npm run test:v2a-participation
 */
import assert from "assert";
import { writeFileSync } from "fs";
import { join } from "path";
import {
  deriveTeamDisplayLabel,
  explainLegacyFakeCurrentSix,
  resolveCanonicalPersonId,
  countDistinctPeople,
  loadPositionStore,
  upsertMembership,
  getScopeMetrics,
  listPositionCards,
  computeParticipationGoal,
} from "../src/lib/position-participation/index";

function testLabels() {
  assert.strictEqual(deriveTeamDisplayLabel(0, 0), "Help Build This Team");
  assert.strictEqual(deriveTeamDisplayLabel(0, 2), "Volunteer Team Forming");
  assert.strictEqual(deriveTeamDisplayLabel(1, 0), "Lead");
  assert.strictEqual(deriveTeamDisplayLabel(2, 0), "Co-Leads");
  assert.strictEqual(deriveTeamDisplayLabel(1, 1), "Committee");
  assert.strictEqual(deriveTeamDisplayLabel(3, 5), "Committee");
}

function testCanonicalDedup() {
  const store = loadPositionStore();
  const a = resolveCanonicalPersonId("alias-henderson-primary", store);
  const b = resolveCanonicalPersonId("alias-henderson-secondary", store);
  const c = resolveCanonicalPersonId("acct-henderson-alias", store);
  assert.strictEqual(a, "person-henderson-founder");
  assert.strictEqual(b, a);
  assert.strictEqual(c, a);
  assert.strictEqual(
    countDistinctPeople(["alias-henderson-primary", "alias-henderson-secondary", "acct-henderson-primary"], store),
    1
  );
  assert.strictEqual(countDistinctPeople(["person-henderson-founder", "person-other"], store), 2);
}

function testHendersonMetrics() {
  const m = getScopeMetrics({
    kind: "institution",
    slug: "henderson-state",
    enrollment: 3190,
    countySlug: "clark",
  });
  assert.strictEqual(m.confirmed_people, 1);
  assert.strictEqual(m.confirmed_participants, 1);
  assert.strictEqual(m.system_identities, 2);
  assert.strictEqual(m.participation_goal, 6);
  assert.strictEqual(m.remaining_need, 5);
}

function testHendersonProportionalCivic() {
  const m = getScopeMetrics({
    kind: "institution",
    slug: "henderson-state",
    enrollment: 3190,
    countySlug: "clark",
  });
  assert.ok(m.campus_enrollment === 3190);
  assert.ok((m.county_voting_age_population ?? 0) > 10000);
  assert.ok((m.campus_share_of_county_vap ?? 0) > 0.1);
  assert.ok(m.registration_target >= 15);
  assert.ok(m.vote_participation_target >= 10);
  assert.ok(m.civic_goal_formula?.includes("county_voting_age_population"));
  // Proportional: not the old 5%-of-enrollment invention (160)
  assert.ok(m.registration_target < 160);
}

function testLegacySixForensic() {
  const f = explainLegacyFakeCurrentSix(3190);
  assert.strictEqual(f.displayed, 6);
  assert.strictEqual(f.isGoal, false);
  assert.strictEqual(f.isActualPeople, false);
}

function testMembershipCoLeads() {
  const cards = listPositionCards({ kind: "institution", slug: "henderson-state" });
  assert.ok(cards.length >= 7);
  const pos = cards[0].position.id;
  upsertMembership({
    scope_type: "college",
    scope_id: "school:henderson-state",
    position_id: pos,
    person_id: "person-henderson-founder",
    participation_type: "lead",
    display_name: "Founder",
  });
  upsertMembership({
    scope_type: "college",
    scope_id: "school:henderson-state",
    position_id: pos,
    person_id: "person-colead-test",
    participation_type: "lead",
    display_name: "Co-lead B",
  });
  upsertMembership({
    scope_type: "college",
    scope_id: "school:henderson-state",
    position_id: pos,
    person_id: "person-vol-test",
    participation_type: "volunteer",
    display_name: "Vol",
  });
  upsertMembership({
    scope_type: "college",
    scope_id: "school:henderson-state",
    position_id: pos,
    person_id: "person-vol-test",
    participation_type: "lead",
    display_name: "Vol→Lead",
  });
  const again = listPositionCards({ kind: "institution", slug: "henderson-state" }).find((c) => c.position.id === pos);
  assert.ok(again);
  assert.ok(again!.lead_count >= 2);
  assert.ok(["Co-Leads", "Committee"].includes(again!.display_label));
  const active = loadPositionStore().memberships.filter(
    (m) => m.position_id === pos && m.canonical_person_id === "person-vol-test" && m.status === "active"
  );
  assert.strictEqual(active.length, 1);
  assert.strictEqual(active[0].participation_type, "lead");
}

function testGoalNotFromMembership() {
  const g = computeParticipationGoal({
    scopeId: "school:henderson-state",
    enrollment: 3190,
    kind: "institution",
  });
  assert.strictEqual(g.computed_goal, 6);
}

function restoreSeedStore() {
  const clean = {
    version: "1.0.0",
    updated: new Date().toISOString(),
    minimum_launch_team: 6,
    persons: [
      {
        canonical_person_id: "person-henderson-founder",
        display_name: "Founding organizer",
        aliases: ["alias-henderson-primary", "alias-henderson-secondary"],
        system_identity_ids: ["acct-henderson-primary", "acct-henderson-alias"],
        scopes: ["school:henderson-state"],
      },
    ],
    memberships: [],
    manual_goals: {
      "school:henderson-state": { launch_team: null },
    },
    notes: {
      "school:henderson-state":
        "Two system identities are aliases of one canonical person. Confirmed people = 1.",
    },
  };
  writeFileSync(join(process.cwd(), "data", "position-participation", "store.json"), JSON.stringify(clean, null, 2) + "\n");
}

try {
  testLabels();
  testCanonicalDedup();
  testHendersonMetrics();
  testHendersonProportionalCivic();
  testLegacySixForensic();
  testMembershipCoLeads();
  testGoalNotFromMembership();
  console.log("V2-A participation tests passed");
} finally {
  restoreSeedStore();
}
