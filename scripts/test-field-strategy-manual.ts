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
assert.ok(existsSync(join(process.cwd(), "src/components/field-strategy/FieldManualNavTab.tsx")));
assert.ok(existsSync(join(process.cwd(), "src/lib/field-strategy/open-manual-window.ts")));
const openManual = require("fs").readFileSync(
  join(process.cwd(), "src/lib/field-strategy/open-manual-window.ts"),
  "utf8",
);
assert.ok(openManual.includes("FIELD_PLATFORM_URL"));
assert.ok(openManual.includes("openFieldPlatformWindow"));

const adminLayout = require("fs").readFileSync(
  join(process.cwd(), "src/app/admin/layout.tsx"),
  "utf8",
);
assert.ok(adminLayout.includes("FieldManualNavTab"));

console.log("field-strategy-manual tests passed");
