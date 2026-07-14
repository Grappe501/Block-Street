/**
 * Double sandbox + UX contract checks for invite/signup path.
 * npm run sandbox:invite-ux
 */
import "./h-drive-env.mjs";
import { readFileSync } from "fs";
import { join as pathJoin } from "path";
import { spawnSync } from "child_process";

const root = process.cwd();
const failures = [];
function assert(cond, msg) {
  if (!cond) failures.push(msg);
}
function readSrc(rel) {
  return readFileSync(pathJoin(root, rel), "utf8");
}

// --- Token extraction unit contracts (mirror src/lib/auth/extract-invite-token.ts) ---
function extractInviteToken(raw) {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  try {
    const asUrl = value.includes("://") ? new URL(value) : null;
    if (asUrl) {
      const q = asUrl.searchParams.get("token");
      if (q) return q.trim();
      const pathMatch = asUrl.pathname.match(/\/invite\/([^/]+)\/?$/i);
      if (pathMatch?.[1]) return decodeURIComponent(pathMatch[1]);
    }
  } catch {
    /* ignore */
  }
  const pathOnly = value.match(/\/invite\/([^/?#]+)\/?/i);
  if (pathOnly?.[1]) return decodeURIComponent(pathOnly[1]);
  const queryOnly = value.match(/[?&]token=([^&]+)/i);
  if (queryOnly?.[1]) return decodeURIComponent(queryOnly[1]);
  return value.replace(/^["']|["']$/g, "");
}

const tokenCases = [
  ["abc123", "abc123"],
  ["https://block-street.netlify.app/invite/tok-9", "tok-9"],
  ["/invite/tok-9", "tok-9"],
  ["https://x.test/invitations/accept?token=zz", "zz"],
];
for (const [input, expected] of tokenCases) {
  assert(extractInviteToken(input) === expected, `extractInviteToken(${input}) != ${expected}`);
}

// --- UX source contracts ---
const joinPage = readSrc("src/app/(site)/join/page.tsx");
assert(joinPage.includes("extractInviteToken"), "join must parse invite URLs");
assert(joinPage.includes("Continue with invitation"), "join primary CTA tightened");
assert(!joinPage.includes('subtitle={t("join.body")}'), "join must not duplicate heavy body as subtitle");

const share = readSrc("src/app/(site)/s/[slug]/ShareClient.tsx");
assert(share.includes('href="/join"'), "share CTA must go to /join not /start");
assert(!share.includes('href="/start"'), "share must not send invitees to Steve /start");
assert(share.includes("Block Street"), "share brand Block Street");

const network = readSrc("src/app/(site)/network/page.tsx");
assert(network.includes("canCreateDirectInvite"), "network hides host-only invite for members");
assert(/not an[\s\S]{0,20}account invite/i.test(network), "network honesty about share vs invite");

const invite = readSrc("src/app/(site)/invite/[token]/page.tsx");
assert(invite.includes("Create account and continue"), "invite CTA should be easy language");
assert(!invite.includes("Activate identity"), "invite should not lead with Activate identity");

const login = readSrc("src/app/(site)/login/LoginClient.tsx");
assert(!login.includes("Verify our identity"), "login subtitle pronouns fixed");
assert(login.includes("I have an invitation") || login.includes("invitation link"), "login keeps invite path");

// --- Double engine sandbox ---
for (const pass of [1, 2]) {
  console.log(`\n=== SANDBOX PASS ${pass} ===`);
  const r = spawnSync("node", ["scripts/run-with-h-env.mjs", "npx", "tsx", "scripts/sandbox-invite-accept.ts"], {
    cwd: root,
    encoding: "utf8",
    shell: true,
    env: process.env,
  });
  process.stdout.write(r.stdout || "");
  process.stderr.write(r.stderr || "");
  assert(r.status === 0 && (r.stdout || "").includes("SANDBOX PASS"), `sandbox pass ${pass} failed`);
  assert((r.stdout || "").includes("next /choose-place"), `sandbox pass ${pass} next must be /choose-place`);
}

if (failures.length) {
  console.error("\ninvite-ux audit FAIL");
  for (const f of failures) console.error(" -", f);
  process.exit(1);
}
console.log("\ninvite-ux audit PASS (token contracts + UX contracts + double sandbox)");
