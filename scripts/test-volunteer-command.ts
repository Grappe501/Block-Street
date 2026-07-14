/**
 * npm run test:volunteer-command
 */
import assert from "assert";
import { existsSync } from "fs";
import { join } from "path";
import {
  buildLeaderDashboard,
  buildVolunteerCommandDashboard,
} from "../src/lib/volunteer-command/dashboard";
import {
  canAccessLeaderDashboard,
  collegeLeaderMayAccessCountyRecords,
  roleIsUnderVolunteerManager,
  roleSeesStatewideVolunteerRollups,
} from "../src/lib/volunteer-command/roles";
import { buildCommitteeFromMemberships } from "../src/lib/volunteer-command/committees";

assert.ok(existsSync(join(process.cwd(), "src/app/admin/volunteer-command/page.tsx")));
assert.ok(existsSync(join(process.cwd(), "src/app/admin/volunteers/page.tsx")));
assert.ok(existsSync(join(process.cwd(), "src/app/admin/volunteer-manager/page.tsx")));

const dash = buildVolunteerCommandDashboard({ section: "command" });
assert.ok(dash.header.title.includes("VOLUNTEER"));
assert.strictEqual(dash.header.staffing_model, "grassroots_volunteer_only");
assert.strictEqual(dash.hierarchy.college_leader_under_vm, true);
assert.strictEqual(dash.hierarchy.county_lead_under_vm, true);
assert.strictEqual(dash.hierarchy.unity_of_command, true);
assert.ok(dash.hierarchy.subordinate_commands.includes("college_command"));
assert.ok(dash.personnel.counting_rule.includes("canonical_person_id"));
assert.strictEqual(dash.persistence.postgres, false);
assert.ok(String(dash.persistence.backend).includes("blobs") || String(dash.persistence.backend).includes("seed"));
assert.ok(dash.education_command.route.includes("college-command"));
assert.strictEqual(dash.education_command.leaderboards_under_vm, true);
assert.ok(dash.field_plan.placeholder.toLowerCase().includes("field plan"));
assert.ok(dash.area_campaign_leader.route_public.includes("/leader/"));
assert.strictEqual(dash.area_campaign_leader.parent_dashboard, "volunteer_command");

const area = buildLeaderDashboard("demo-institution-henderson-events");
assert.ok(area.title.includes("Campaign Leader"));
assert.ok(area.need_to_know.toLowerCase().includes("pertinent"));
assert.ok(area.field_plan_hook.operational_phases.length > 0);
assert.strictEqual(area.reports_to_command, "/admin/volunteer-command");

assert.strictEqual(roleSeesStatewideVolunteerRollups("volunteer_manager"), true);
assert.strictEqual(roleSeesStatewideVolunteerRollups("college_leader"), false);
assert.strictEqual(roleIsUnderVolunteerManager("college_leader"), true);
assert.strictEqual(canAccessLeaderDashboard("general_volunteer"), false);
assert.strictEqual(canAccessLeaderDashboard("volunteer_manager"), true);
assert.strictEqual(collegeLeaderMayAccessCountyRecords("college_leader"), false);

const committee = buildCommitteeFromMemberships({
  scopeId: "school:henderson-state",
  positionId: "school:henderson-state::canvass",
  positionTitle: "Canvassing",
  memberships: [
    {
      id: "1",
      position_id: "school:henderson-state::canvass",
      person_id: "a",
      canonical_person_id: "a",
      scope_type: "college",
      scope_id: "school:henderson-state",
      participation_type: "lead",
      status: "active",
      joined_at: "2026-07-01",
      approved_at: "2026-07-01",
      public_visibility: true,
      display_name: "Lead A",
    },
    {
      id: "2",
      position_id: "school:henderson-state::canvass",
      person_id: "b",
      canonical_person_id: "b",
      scope_type: "college",
      scope_id: "school:henderson-state",
      participation_type: "lead",
      status: "active",
      joined_at: "2026-07-01",
      approved_at: "2026-07-01",
      public_visibility: true,
      display_name: "Lead B",
    },
    {
      id: "3",
      position_id: "school:henderson-state::canvass",
      person_id: "c",
      canonical_person_id: "c",
      scope_type: "college",
      scope_id: "school:henderson-state",
      participation_type: "volunteer",
      status: "active",
      joined_at: "2026-07-01",
      approved_at: "2026-07-01",
      public_visibility: true,
      display_name: "Vol C",
    },
  ],
});
assert.strictEqual(committee.lead_count, 2);
assert.strictEqual(committee.volunteer_count, 1);
assert.strictEqual(committee.status, "active");
assert.strictEqual(committee.field_plan_content_status, "placeholder");

console.log("volunteer-command tests passed");
