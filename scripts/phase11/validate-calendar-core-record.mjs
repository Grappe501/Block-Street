import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
async function load() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/core-record/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/core-record/index.ts"));
  }
}
const cr = await load();
const errors = cr.validateCoreRecordStore();
if (errors.length) {
  console.error("Core record validation FAILED", errors);
  process.exit(1);
}
console.log(`calendar:core-record:validate PASS — ${cr.listCoreRecordItems().length} items`);
