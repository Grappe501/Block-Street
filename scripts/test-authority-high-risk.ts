import assert from "node:assert/strict";
import { authorize, resolveEffectivePermissions } from "../src/lib/authority/resolver";
import { scopeToken } from "../src/lib/authority/types";

function auth(actorId: string, permission: string, scopes: string[]) {
  return authorize({
    actorId,
    permission,
    resourceType: scopes[0]?.split(":")[0] ?? "resource",
    requestedScopeIds: scopes,
  });
}

// 1. Volunteer self-onboarding allowed (onboarding.manage for outreach, not volunteer)
{
  const d = auth("usr-outreach-demo", "onboarding.manage", [scopeToken("campaign", "arkansas")]);
  assert.equal(d.allowed, true);
}

// 2. Volunteer viewing another recruit denied
{
  const d = auth("usr-volunteer-demo", "recruits.view", [scopeToken("county", "clark")]);
  assert.equal(d.allowed, false);
}

// 3. Outreach manages onboarding
assert.ok(resolveEffectivePermissions("usr-outreach-demo").includes("onboarding.manage"));

// 4. Outreach cannot finalize leadership appointment
{
  const d = auth("usr-outreach-demo", "appointments.create", [scopeToken("campaign", "arkansas")]);
  assert.equal(d.allowed, false);
}

// 5. Volunteer Manager confirms placement (committee.manage)
{
  const d = auth("usr-vm-demo", "committee.manage", [scopeToken("campaign", "arkansas")]);
  assert.equal(d.allowed, true);
}

// 6. Volunteer Manager cannot publish social media
assert.equal(resolveEffectivePermissions("usr-vm-demo").includes("social.publish"), false);

// 7. Social Media cannot send email/SMS
assert.equal(resolveEffectivePermissions("usr-social-demo").includes("communications.send"), false);

// 8. County leader cannot communicate with another county
{
  const d = auth("usr-county-clark", "communications.send", [scopeToken("county", "benton")]);
  assert.equal(d.allowed, false);
}

// 9. Cluster leader cannot cross cluster boundary
{
  const d = auth("usr-cluster-sw", "users.view", [scopeToken("county", "pulaski")]);
  assert.equal(d.allowed, false);
}

// 10. Institution lead cannot update another institution
{
  const d = auth("usr-inst-henderson", "committee.manage", [scopeToken("institution", "uark")]);
  assert.equal(d.allowed, false);
}

// 11. Self-appointment denied (volunteer cannot manage appointments)
{
  const d = auth("usr-volunteer-demo", "appointments.create", [scopeToken("self", "usr-volunteer-demo")]);
  assert.equal(d.allowed, false);
}

// 12. Privilege escalation denied
{
  const d = auth("usr-county-clark", "appointments.manage", [scopeToken("campaign", "arkansas")]);
  assert.equal(d.allowed, false);
}

// 13. Inactive appointment denied
{
  const d = auth("usr-inactive-demo", "users.view", [scopeToken("county", "pulaski")]);
  assert.equal(d.allowed, false);
  assert.equal(d.reasonCode, "inactive_appointment");
}

// 14. Platform-admin override allowed
{
  const d = auth("usr-001", "platform.manage", [scopeToken("campaign", "arkansas")]);
  assert.equal(d.allowed, true);
  assert.equal(d.reasonCode, "platform_admin");
}

// 15-20 covered by inventory/registry tests
console.log("authority high-risk scenario tests passed", 14);
