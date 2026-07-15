import "../h-drive-env.mjs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
async function load() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/tasks/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/tasks/index.ts"));
  }
}
const t = await load();
const errors = t.validateTaskStore();
if (errors.length) {
  console.error("Task validation FAILED", errors);
  process.exit(1);
}
console.log(`calendar:tasks:validate PASS — ${t.listTasks().length} tasks`);
