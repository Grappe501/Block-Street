/**
 * CAL-P2 Wave 1B — template library tests.
 */
import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function load() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/index.ts"));
  }
}

const cal = await load();

assert(cal.TEMPLATE_CATALOG.length >= 18, "at least 18 templates");
assert(cal.assertUniqueTemplateIds().length === 0, "unique ids");
assert(cal.assertUniqueTemplateSlugs().length === 0, "unique slugs");
assert(cal.validateTemplateRegistry(cal.TEMPLATE_CATALOG).length === 0, "registry valid");

const vr = cal.getTemplateById("tpl-campus-voter-registration-drive");
const net = cal.getTemplateById("tpl-campus-networking-event");
assert(vr && net, "flagship templates exist");
assert(vr.readiness.requiredDimensions.includes("verification"), "VR drive verification");
assert(net.promotion.length > 0, "networking promotion");

const candidate = cal.getTemplateById("tpl-candidate-appearance");
assert(candidate, "candidate appearance");
const applied = cal.applyTemplate({
  template: candidate,
  scopeSelection: { collegeSlugs: [], countySlugs: ["pulaski"], citySlugs: [], teamIds: [], campaignWide: true },
  overrides: { kelly_requested: true },
});
assert(applied.eventDraft.kelly_requested, "kelly requested not confirmed");

const retired = { ...vr, status: "retired" };
const blocked = cal.applyTemplate({
  template: retired,
  scopeSelection: { collegeSlugs: ["uca"], countySlugs: [], citySlugs: [], teamIds: [], campaignWide: false },
  overrides: {},
});
assert(blocked.blockedReasons.length > 0, "retired blocked");
assert(!cal.getActiveTemplateForUse("retired-fake"), "retired not selectable");

const preview = cal.buildTemplatePreview(vr);
assert(preview.softBeta && preview.manualConfirmation.length > 0, "preview disclosures");

console.log("test:calendar:templates PASS");
