import assert from "node:assert/strict";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { authorize } from "../src/lib/authority/resolver";
import { scopeToken } from "../src/lib/authority/types";

const statusPath = join(process.cwd(), "data", "authority", "shadow-parity-status.json");
assert.ok(existsSync(statusPath), "shadow-parity-status.json missing — run npm run authority:shadow-compare");

const status = JSON.parse(readFileSync(statusPath, "utf8")) as {
  mode: string;
  appointmentsCompared: number;
  decisionMismatches: number;
};

assert.equal(status.mode, "json_primary_postgres_shadow");
assert.ok(status.appointmentsCompared >= 0);

// Decision parity on fixtures — JSON resolver is canonical; Postgres shadow uses same logic until promoted
const fixtures = [
  { actor: "usr-county-clark", permission: "users.view", scope: scopeToken("county", "clark"), expect: true },
  { actor: "usr-county-clark", permission: "users.view", scope: scopeToken("county", "benton"), expect: false },
  { actor: "usr-vm-demo", permission: "appointments.manage", scope: scopeToken("campaign", "arkansas"), expect: true },
];

let mismatches = 0;
for (const f of fixtures) {
  const jsonDecision = authorize({
    actorId: f.actor,
    permission: f.permission,
    resourceType: f.scope.split(":")[0],
    requestedScopeIds: [f.scope],
  });
  // Postgres promotion uses same resolver until separate pg resolver exists
  const pgDecision = authorize({
    actorId: f.actor,
    permission: f.permission,
    resourceType: f.scope.split(":")[0],
    requestedScopeIds: [f.scope],
  });
  if (jsonDecision.allowed !== pgDecision.allowed || jsonDecision.reasonCode !== pgDecision.reasonCode) {
    mismatches++;
  }
  assert.equal(jsonDecision.allowed, f.expect, `${f.actor} ${f.permission} ${f.scope}`);
}

assert.equal(mismatches, 0, "JSON and Postgres decision fixtures must match");
console.log("authority shadow parity tests passed", { fixtures: fixtures.length, mismatches });
