import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
async function load() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/preparation/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/preparation/index.ts"));
  }
}
const p = await load();
const errors = p.validatePreparationStore();
if (errors.length) {
  console.error("Preparation validation FAILED", errors);
  process.exit(1);
}
console.log(`calendar:preparation:validate PASS — ${p.listPreparationItems().length} items`);
