/**
 * CAL-P2 Wave 1B — template application engine tests.
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
cal.clearSessionProposedEventsForTest();

const vr = cal.getTemplateById("tpl-campus-voter-registration-drive");
const result = cal.applyTemplate({
  template: vr,
  scopeSelection: { collegeSlugs: ["henderson-state"], countySlugs: ["clark"], citySlugs: [], teamIds: [], campaignWide: false },
  overrides: { title: "Henderson VR Drive", start_at: "2026-08-01T15:00:00.000Z" },
});

assert(result.generatedVolunteerRoles.length > 0, "volunteer roles generated");
assert(result.generatedReportRequirements.some((r) => r.fieldKey === "applications-assisted"), "VR reporting");
assert(result.eventDraft.template_snapshot.name === vr.name, "snapshot preserved");
assert(result.eventDraft.template_version === vr.version, "version preserved");
assert(result.warnings.some((w) => w.includes("Soft-beta")), "soft-beta warning");

const orient = cal.getTemplateById("tpl-volunteer-orientation");
const orientApply = cal.applyTemplate({
  template: orient,
  scopeSelection: { collegeSlugs: [], countySlugs: [], citySlugs: [], teamIds: [], campaignWide: true },
  overrides: {},
});
assert(orientApply.generatedVolunteerRoles.every((r) => r.numberNeeded >= 0), "roles not confirmed participants");

const event = cal.createEventFromTemplateApply(result);
assert(event.template_id === vr.templateId, "event retains template_id");
assert(event.kelly_attendance_status !== "confirmed", "Kelly not confirmed");

const ops = cal.buildEventOperationsSummary(event);
const verify = ops.readiness.find((r) => r.dimension === "verification");
assert(verify && verify.state !== "not_required", "template verification feeds readiness");

console.log("test:calendar:template-application PASS");
