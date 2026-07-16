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

// Volunteers cannot access leadership APIs
{
  const d = auth("usr-volunteer-demo", "appointments.manage", [scopeToken("county", "clark")]);
  assert.equal(d.allowed, false, "volunteer cannot manage appointments");
  assert.equal(d.reasonCode, "missing_permission");
}

// County leader cannot access another county
{
  const d = auth("usr-county-clark", "users.view", [scopeToken("county", "benton")]);
  assert.equal(d.allowed, false, "clark county cannot view benton");
  assert.equal(d.reasonCode, "outside_scope");
}

// County leader can access own county
{
  const d = auth("usr-county-clark", "users.view", [scopeToken("county", "clark")]);
  assert.equal(d.allowed, true, "clark county can view clark");
}

// Campus lead cannot edit another campus
{
  const d = auth("usr-inst-henderson", "committee.manage", [scopeToken("institution", "uark")]);
  assert.equal(d.allowed, false, "henderson cannot manage uark");
}

// Campus lead can manage own institution
{
  const d = auth("usr-inst-henderson", "committee.manage", [scopeToken("institution", "henderson-state")]);
  assert.equal(d.allowed, true, "henderson lead manages henderson");
}

// Cluster commander views only assigned counties
{
  const ok = auth("usr-cluster-sw", "users.view", [scopeToken("county", "clark")]);
  assert.equal(ok.allowed, true, "southwest cluster includes clark");
  const deny = auth("usr-cluster-sw", "users.view", [scopeToken("county", "pulaski")]);
  assert.equal(deny.allowed, false, "southwest cluster excludes pulaski");
}

// Outreach manages onboarding; not social publish
{
  assert.equal(
    resolveEffectivePermissions("usr-outreach-demo").includes("onboarding.manage"),
    true,
    "outreach has onboarding.manage"
  );
  assert.equal(
    resolveEffectivePermissions("usr-outreach-demo").includes("social.publish"),
    false,
    "outreach lacks social.publish"
  );
}

// Social manages publish; not direct send/onboarding
{
  assert.equal(resolveEffectivePermissions("usr-social-demo").includes("social.publish"), true);
  assert.equal(resolveEffectivePermissions("usr-social-demo").includes("communications.send"), false);
  assert.equal(resolveEffectivePermissions("usr-social-demo").includes("onboarding.manage"), false);
}

// Volunteer Manager can place volunteers; not platform admin
{
  const perms = resolveEffectivePermissions("usr-vm-demo");
  assert.equal(perms.includes("appointments.manage"), true);
  assert.equal(perms.includes("platform.manage"), false);
}

// Platform admin retains emergency access
{
  const d = auth("usr-001", "platform.manage", [scopeToken("campaign", "arkansas")]);
  assert.equal(d.allowed, true);
  assert.equal(d.reasonCode, "platform_admin");
}

// Inactive appointments grant nothing
{
  const d = auth("usr-inactive-demo", "users.view", [scopeToken("county", "pulaski")]);
  assert.equal(d.allowed, false);
  assert.equal(d.reasonCode, "inactive_appointment");
}

console.log("durable authority tests passed", 12);
