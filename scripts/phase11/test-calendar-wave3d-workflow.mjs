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
cal.clearRsvpStoreForTest();
cal.clearVerificationStoreForTest();
const rsvpEvent = cal.getEventById("evt-uca-networking");
const verifyEvent = cal.getEventById("evt-henderson-vr-drive");
const rsvpItems = cal.ensureRsvpFromEvent(rsvpEvent);
for (const item of rsvpItems.filter((i) => i.required)) {
  cal.markRsvpReady(item.itemId, "usr-mgr-001");
}
cal.createRsvpResponse({ eventId: rsvpEvent.event_id, attendeeLabel: "Guest A", responseStatus: "yes", partySize: 2 });
const verifyItems = cal.ensureVerificationFromEvent(verifyEvent);
for (const item of verifyItems.filter((i) => i.required)) {
  cal.markVerificationComplete(item.itemId, "usr-mgr-001");
}
const rsvpSummary = cal.buildRsvpSummary(rsvpEvent.event_id);
assert(rsvpSummary.incompleteRequired === 0, "rsvp complete");
const verifySummary = cal.buildVerificationSummary(verifyEvent.event_id);
assert(verifySummary.incompleteRequired === 0, "verification complete");
console.log("test:calendar:wave3d-workflow PASS");
