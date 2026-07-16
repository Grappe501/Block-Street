import assert from "node:assert/strict";
import { resolveUserApiPermissions } from "../src/lib/security/user-permissions";
import { checkAuthRateLimit } from "../src/lib/auth/rate-limit";
import { securityHeaderConfig } from "../src/lib/security/headers";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname ?? path.dirname(new URL(import.meta.url).pathname), "..");

function read(rel: string) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

// 1) Members must not receive civic_action.manage by default
const memberPerms = resolveUserApiPermissions("usr-no-admin", [
  {
    id: "mem-1",
    user_id: "usr-no-admin",
    organization_id: "org-test",
    organization_name: "Test",
    workspace_id: "ws-test",
    workspace_name: "Test WS",
    roles: ["volunteer"],
    permissions: [],
    status: "active",
  },
]);
assert.equal(memberPerms.includes("civic_action.manage"), false, "volunteer must not get civic_action.manage");
assert.equal(memberPerms.includes("civic_action.view"), true, "volunteer should get civic_action.view with membership");

// 2) Platform admin receives civic_action.manage via civic.manage mapping
const adminPerms = resolveUserApiPermissions("usr-001", []);
assert.equal(adminPerms.includes("civic_action.manage"), true, "platform admin should map to civic_action.manage");
assert.equal(adminPerms.includes("users.view"), true, "platform admin retains users.view");

// 3) Auth login rate limit triggers
let limited = false;
for (let i = 0; i < 12; i++) {
  try {
    checkAuthRateLimit("login", "test-ip:hardening@example.com");
  } catch {
    limited = true;
    break;
  }
}
assert.equal(limited, true, "login rate limit should trip after repeated attempts");

// 4) Security headers config present
const headers = securityHeaderConfig();
assert.ok(headers[0]?.headers?.some((h) => h.key === "X-Frame-Options"), "security headers configured");

// 5) Middleware applies security headers helper
assert.match(read("src/middleware.ts"), /applySecurityHeaders/, "middleware applies security headers");

// 6) Session secret production guard
assert.match(read("src/lib/auth/signed-session.ts"), /AUTH_SESSION_SECRET must be set in production/, "production session secret guard");

// 7) withAdmin rejects users without admin permissions
assert.match(read("src/lib/admin/http.ts"), /effective_permissions\.length === 0/, "withAdmin requires admin permissions");

console.log("platform hardening pass: all checks passed");
