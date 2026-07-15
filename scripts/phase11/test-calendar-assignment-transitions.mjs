import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
function assert(c, m) { if (!c) throw new Error(m); }

async function load() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/assignments/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/assignments/index.ts"));
  }
}

const a = await load();
assert(a.canTransitionOffer("draft", "ready"), "offer draft→ready");
assert(a.canTransitionOffer("offered", "accepted"), "offer offered→accepted");
assert(!a.canTransitionOffer("expired", "accepted"), "expired cannot accept");
assert(a.canTransitionAssignment("soft_beta_confirmed", "canceled_by_volunteer"), "assignment cancel");
assert(a.canTransitionWaitlist("active", "offer_prepared"), "waitlist offer_prepared");
assert(a.validateAllTransitions().length === 0, "validateAllTransitions");
console.log("calendar:assignments:transitions PASS");
