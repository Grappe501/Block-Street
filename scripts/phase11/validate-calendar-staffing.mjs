import "../h-drive-env.mjs";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

async function load() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/staffing/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/staffing/index.ts"));
  }
}

const s = await load();
const roleErrors = [];
const keys = new Set();
for (const r of s.STAFFING_ROLE_CATALOG) {
  if (keys.has(r.roleKey)) roleErrors.push(`duplicate role ${r.roleKey}`);
  keys.add(r.roleKey);
}
const tkeys = new Set();
for (const t of s.TRAINING_CATALOG) {
  if (tkeys.has(t.trainingKey)) roleErrors.push(`duplicate training ${t.trainingKey}`);
  tkeys.add(t.trainingKey);
}

writeFileSync(join(root, "data/calendar/staffing-role-catalog.json"), JSON.stringify(s.STAFFING_ROLE_CATALOG, null, 2));
writeFileSync(join(root, "data/calendar/staffing-training-catalog.json"), JSON.stringify(s.TRAINING_CATALOG, null, 2));
writeFileSync(
  join(root, "data/calendar/staffing-test-fixtures.json"),
  JSON.stringify({ demoUser: "usr-demo-001", primaryEvent: "evt-henderson-vr-drive", vrTemplate: "tpl-campus-voter-registration-drive" }, null, 2),
);

if (roleErrors.length) {
  console.error("Staffing validation FAILED", roleErrors);
  process.exit(1);
}
console.log(`Staffing validation PASS — ${s.STAFFING_ROLE_CATALOG.length} roles, ${s.TRAINING_CATALOG.length} training requirements`);
