/**
 * CAL-P2 Wave 1B — template registry validation + JSON sync.
 */
import "../h-drive-env.mjs";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");
const dataDir = join(root, "data/calendar");

async function loadTemplates() {
  try {
    const { createJiti } = await import("jiti");
    const jiti = createJiti(import.meta.url);
    return jiti(join(root, "src/lib/calendar/templates/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const jiti = require("jiti")(import.meta.url);
    return jiti(join(root, "src/lib/calendar/templates/index.ts"));
  }
}

const tpl = await loadTemplates();
const errors = tpl.validateTemplateRegistry(tpl.TEMPLATE_CATALOG);
const dupIds = tpl.assertUniqueTemplateIds();
const dupSlugs = tpl.assertUniqueTemplateSlugs();
if (dupIds.length) errors.push(...dupIds.map((id) => `duplicate id ${id}`));
if (dupSlugs.length) errors.push(...dupSlugs.map((s) => `duplicate slug ${s}`));

const required = [
  "tpl-campus-voter-registration-drive",
  "tpl-campus-networking-event",
  "tpl-college-community-meeting",
];
for (const id of required) {
  if (!tpl.getTemplateById(id)) errors.push(`missing required template ${id}`);
}

for (const t of tpl.TEMPLATE_CATALOG) {
  if (t.status === "active" && tpl.getActiveTemplateForUse(t.templateId)?.templateId !== t.templateId) {
    errors.push(`${t.templateId}: active template not selectable`);
  }
  const serialized = JSON.stringify(t);
  if (serialized.includes("confirmed") && serialized.includes("kelly")) {
    errors.push(`${t.templateId}: must not auto-confirm Kelly`);
  }
}

writeFileSync(join(dataDir, "event-templates.json"), JSON.stringify(tpl.TEMPLATE_CATALOG, null, 2));
writeFileSync(join(dataDir, "event-template-categories.json"), JSON.stringify(tpl.TEMPLATE_CATEGORIES, null, 2));
writeFileSync(
  join(dataDir, "event-template-test-fixtures.json"),
  JSON.stringify(
    {
      flagshipTemplateIds: ["tpl-campus-voter-registration-drive", "tpl-campus-networking-event"],
      collegeScopeSlug: "henderson-state",
      countyScopeSlug: "clark",
      sampleApplyScope: { collegeSlugs: ["uca"], countySlugs: [], citySlugs: [], teamIds: [], campaignWide: false },
    },
    null,
    2,
  ),
);

if (errors.length) {
  console.error("Template validation FAILED:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`Template validation PASS — ${tpl.TEMPLATE_CATALOG.length} templates, ${tpl.TEMPLATE_CATEGORIES.length} categories`);
