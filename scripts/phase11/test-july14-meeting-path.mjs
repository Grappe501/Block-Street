import "../h-drive-env.mjs";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const root = process.cwd();
const failures = [];

function assert(cond, msg) {
  if (!cond) failures.push(msg);
}

const agendaPath = join(root, "data/presentation/july-14-agenda.json");
assert(existsSync(agendaPath), "missing agenda registry");
const agenda = JSON.parse(readFileSync(agendaPath, "utf8"));
assert(agenda.items?.length === 34, `expected 34 items, got ${agenda.items?.length}`);
assert(agenda.items[0].item_number === "01", "first item must be 01");
assert(agenda.items.at(-1).item_number === "34", "last item must be 34");
assert(agenda.items.some((i) => i.item_number === "04"), "item 04 required");
assert(agenda.items.some((i) => i.aliases?.includes("034") || i.item_number === "34"), "034 alias / item 34 required");

const order = agenda.items.map((i) => i.item_number);
for (let i = 1; i < order.length; i++) {
  assert(Number(order[i]) > Number(order[i - 1]) || order[i] === "34", `order break at ${order[i - 1]} -> ${order[i]}`);
}

const registryText = readFileSync(agendaPath, "utf8");
assert(!/\b25%\b/.test(registryText), "25% token must not appear in agenda registry");
const honestyBlob =
  registryText +
  readFileSync(join(root, "src/components/presentations/July14MeetingDeck.tsx"), "utf8") +
  readFileSync(join(root, "src/components/meeting/HonestyPanel.tsx"), "utf8");
assert(/not CERTIFIED/i.test(honestyBlob), "honesty language required");

const requiredFiles = [
  "src/app/presentations/july-14/page.tsx",
  "src/app/presentations/july-14/presenter/page.tsx",
  "src/app/presentations/july-14/participant/page.tsx",
  "src/app/presentations/july-14/items/[item]/page.tsx",
  "src/app/presentations/july-14/commitment/page.tsx",
  "src/app/presentations/july-14/deck/page.tsx",
  "src/app/(site)/how-it-works/page.tsx",
  "src/app/(site)/how-it-works/hierarchy/page.tsx",
  "src/app/(site)/field-plan/overview/page.tsx",
  "src/app/(site)/positions/college/page.tsx",
  "src/app/(site)/positions/[positionId]/page.tsx",
  "src/app/(site)/power-of-5/my-team/page.tsx",
  "src/app/(site)/recruit/page.tsx",
  "src/app/(site)/join/interest/page.tsx",
  "src/app/admin/college-command/meeting/july-14/page.tsx",
  "src/lib/meeting/positions-catalog.ts",
  "src/lib/presentations/july14-agenda.ts",
];

for (const f of requiredFiles) {
  assert(existsSync(join(root, f)), `missing ${f}`);
}

const positions = readFileSync(join(root, "src/lib/meeting/positions-catalog.ts"), "utf8");
for (const id of [
  "college-social-media-lead",
  "college-voter-registration-lead",
  "college-community-lead",
  "college-event-lead",
  "college-canvass-outreach-lead",
]) {
  assert(positions.includes(id), `missing position ${id}`);
}
assert(!/\b25%\b/.test(positions), "positions catalog must not contain 25% token");
assert(/enrollment_share_of_county_vap_v1/.test(positions), "canonical formula mention required");

const i18n = readFileSync(join(root, "src/lib/july14/i18n.ts"), "utf8");
assert(i18n.includes("Chance and Xay"), "canonical i18n source must remain");
assert(agenda.items.find((i) => i.item_number === "04").title.includes("Chance and Xay"), "item 04 must preserve Chance and Xay language");

const slides = readFileSync(join(root, "src/lib/presentations/july14-agenda.ts"), "utf8");
assert(slides.includes("JULY14_AGENDA_SLIDES"), "classic slide spine must remain");

if (failures.length) {
  console.error("july14-meeting-path FAIL");
  for (const f of failures) console.error(" -", f);
  process.exit(1);
}
console.log("july14-meeting-path PASS");
console.log(` items=${agenda.items.length} leafMinutes=${agenda.total_leaf_duration_minutes} finding=${agenda.finding.status}`);
