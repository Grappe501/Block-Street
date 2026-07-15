import "../h-drive-env.mjs";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
function assert(c, m) { if (!c) throw new Error(m); }

async function load() {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url)(join(root, "src/lib/calendar/assignments/index.ts"));
  } catch {
    const { createRequire } = await import("module");
    return createRequire(import.meta.url)("jiti")(import.meta.url)(join(root, "src/lib/calendar/assignments/index.ts"));
  }
}

const a = await load();
const errors = [];
const ids = new Set();

for (const o of a.listOffers()) {
  if (ids.has(o.offerId)) errors.push(`duplicate offer ${o.offerId}`);
  ids.add(o.offerId);
  if (!o.volunteerUserId) errors.push(`offer missing volunteer ${o.offerId}`);
  if (o.softBeta !== undefined) errors.push("offer should not have softBeta");
}

for (const asg of a.listAssignments()) {
  if (asg.softBeta && asg.durableAuthority) errors.push(`invalid authority ${asg.assignmentId}`);
  if (asg.softBeta && asg.assignmentStatus === "soft_beta_confirmed" && asg.durableAuthority !== false) {
    errors.push(`soft beta must not claim durable ${asg.assignmentId}`);
  }
}

const pub = JSON.stringify(a.listOffers());
assert(!pub.includes("managerNotes"), "public offer export must strip manager notes in volunteer projection");
const demo = a.projectVolunteerSafeOffer(a.listOffers()[0] ?? { offerId: "x", offeredRoleLabel: "r", offeredStartAt: "", offeredEndAt: "", offerStatus: "draft", trainingConditionKeys: [], eventId: "e", shiftId: "s", requirementId: "r", volunteerUserId: "u", offeredRoleKey: "k", conditions: [], source: "soft_beta_fixture", createdAt: "", updatedAt: "" }, "Event");
assert(!JSON.stringify(demo).includes("managerNotes"), "volunteer projection privacy");

if (errors.length) {
  console.error("Assignment validation FAILED", errors);
  process.exit(1);
}
console.log(`Assignment validation PASS — ${a.listOffers().length} offers, ${a.listAssignments().length} assignments`);
