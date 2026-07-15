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
cal.ensureRsvpFromEvent(rsvpEvent);
cal.ensureVerificationFromEvent(verifyEvent);
const rsvp = cal.evaluateRsvpReadiness(rsvpEvent);
assert(rsvp.dimension === "rsvp", "rsvp dimension");
assert(["in_progress", "blocked", "ready"].includes(rsvp.state), rsvp.state);
const verification = cal.evaluateVerificationReadiness(verifyEvent);
assert(verification.dimension === "verification", "verification dimension");
assert(["not_started", "in_progress", "blocked", "ready"].includes(verification.state), verification.state);
const canvass = cal.getEventById("evt-pulaski-weekend-canvass");
const rsvpNa = cal.evaluateRsvpReadiness(canvass);
assert(rsvpNa.state === "not_required", "canvass rsvp not required");
console.log("test:calendar:attendance-readiness PASS");
