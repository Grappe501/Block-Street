import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
function assert(c, m) { if (!c) throw new Error(m); }
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
cal.clearStaffingStoreForTest();
const tpl = cal.getTemplateById("tpl-campus-voter-registration-drive");
const event = cal.getEventById("evt-henderson-vr-drive");
const reqs = cal.requirementsFromTemplateRoles(event, tpl.volunteerRoles, tpl.templateId, tpl.version);
assert(reqs.length === tpl.volunteerRoles.length, "VR template requirements");
assert(reqs.some((r) => r.roleKey === "registration_table"), "registration role");
const net = cal.getTemplateById("tpl-campus-networking-event");
const netReqs = cal.requirementsFromTemplateRoles(event, net.volunteerRoles, net.templateId, net.version);
assert(netReqs.length > 0, "networking requirements");
console.log("test:calendar:staffing-requirements PASS");
