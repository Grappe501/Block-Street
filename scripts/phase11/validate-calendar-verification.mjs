import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
async function loadVerification() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/verification/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/verification/index.ts"));
  }
}
const v = await loadVerification();
const errors = v.validateVerificationStore();
if (errors.length) {
  console.error("Verification validation FAILED", errors);
  process.exit(1);
}
console.log(`calendar:verification:validate PASS — ${v.listVerificationItems().length} items`);
