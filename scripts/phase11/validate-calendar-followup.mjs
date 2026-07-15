import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
async function load() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/followup/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/followup/index.ts"));
  }
}
const f = await load();
const errors = f.validateFollowUpStore();
if (errors.length) {
  console.error("Follow-up validation FAILED", errors);
  process.exit(1);
}
console.log(`calendar:followup:validate PASS — ${f.listFollowUpItems().length} items`);
