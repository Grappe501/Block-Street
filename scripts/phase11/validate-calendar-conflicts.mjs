import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
async function load() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/conflicts/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/conflicts/index.ts"));
  }
}
const cf = await load();
const errors = cf.validateConflictStore();
if (errors.length) {
  console.error("Conflict validation FAILED", errors);
  process.exit(1);
}
console.log(`calendar:conflicts:validate PASS — ${cf.listConflictRecords().length} records`);