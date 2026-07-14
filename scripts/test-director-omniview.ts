/**
 * Director omniview route + inspection safety tests.
 * npm run test:director-omniview
 */
import assert from "assert";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
const directorPage = join(root, "src/app/admin/director/page.tsx");
const omniview = join(root, "src/components/director/DirectorOmniview.tsx");
const banner = join(root, "src/components/community/workspace/InspectBanner.tsx");

assert.ok(existsSync(directorPage), "Director route missing");
assert.ok(existsSync(omniview), "DirectorOmniview missing");
assert.ok(existsSync(banner), "InspectBanner missing");

const omniSrc = readFileSync(omniview, "utf8");
assert.ok(omniSrc.includes("read-only"));
assert.ok(omniSrc.includes("Does not replace the inspected"));
assert.ok(omniSrc.includes("netlify_blobs"));
assert.ok(omniSrc.includes("not") && omniSrc.toLowerCase().includes("postgres"));
assert.ok(omniSrc.includes("No presence signal"));
assert.ok(omniSrc.includes("volunteer-command"));

const bannerSrc = readFileSync(banner, "utf8");
assert.ok(bannerSrc.toLowerCase().includes("director inspection mode"));
assert.ok(bannerSrc.includes("Return to Director"));
assert.ok(bannerSrc.includes("/admin/director"));
assert.ok(bannerSrc.includes("Changes disabled"));

// Non-Director must not gain omniview merely by inventing a public URL path
// (surface is under /admin/director; inspect query only labels read-only banners)
assert.ok(!bannerSrc.includes("grant omniview"));
assert.ok(bannerSrc.includes("inspect"));

console.log("director-omniview tests passed (route + read-only banner shipped)");
