import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
async function load() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/candidate-request/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/candidate-request/index.ts"));
  }
}
const c = await load();
const errors = c.validateCandidateStore();
if (errors.length) {
  console.error("Candidate validation FAILED", errors);
  process.exit(1);
}
console.log(`calendar:candidate:validate PASS — ${c.listCandidateItems().length} items`);
