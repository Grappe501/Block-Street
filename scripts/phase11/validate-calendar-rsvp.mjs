import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
async function loadRsvp() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/rsvp/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/rsvp/index.ts"));
  }
}
const r = await loadRsvp();
const errors = r.validateRsvpStore();
if (errors.length) {
  console.error("RSVP validation FAILED", errors);
  process.exit(1);
}
console.log(`calendar:rsvp:validate PASS — ${r.listRsvpItems().length} items`);
