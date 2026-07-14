/**
 * npm run test:field-strategy-manual
 */
import assert from "assert";
import { existsSync } from "fs";
import { join } from "path";
import { SECTIONS, DOCTRINE, LANDING_CHAIN } from "../src/lib/field-strategy/content";
import { MANUAL_NAV, PRESENTATION_SLIDES } from "../src/lib/field-strategy/nav";

assert.ok(DOCTRINE.toLowerCase().includes("stronger"));
assert.ok(LANDING_CHAIN.length >= 8);
assert.strictEqual(MANUAL_NAV.length, 12);
assert.strictEqual(PRESENTATION_SLIDES.length, 14);
assert.ok(SECTIONS.benton.roles?.length);
assert.ok(SECTIONS["event-engine"].tabs.some((t) => t.id === "trigger"));
assert.ok(SECTIONS["regnat-populus"].headline.toLowerCase().includes("movement"));
assert.ok(existsSync(join(process.cwd(), "src/app/field-strategy/page.tsx")));
assert.ok(existsSync(join(process.cwd(), "src/app/field-strategy/presentation/page.tsx")));
assert.ok(existsSync(join(process.cwd(), "src/app/field-strategy/[section]/page.tsx")));

console.log("field-strategy-manual tests passed");
