/**
 * Full soft-beta sandbox: verify July 14 + command board + job signup link graph.
 * Checks route modules exist on disk and registry wiring is coherent.
 */
import "../h-drive-env.mjs";
import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function routeToCandidates(routePath) {
  const clean = routePath.split("?")[0].replace(/\/$/, "") || "/";
  const rel = clean.replace(/^\//, "");
  return [
    join(root, "src/app", rel, "page.tsx"),
    join(root, "src/app/(site)", rel, "page.tsx"),
    join(root, "src/app", rel + ".tsx"),
  ];
}

function routeExists(routePath) {
  const clean = routePath.split("?")[0].replace(/\/$/, "") || "/";
  if (clean.includes("[")) {
    return routeToCandidates(clean).some((p) => existsSync(p));
  }
  // Try exact page, then walk up for dynamic [param] folders
  if (routeToCandidates(clean).some((p) => existsSync(p))) return true;
  const parts = clean.replace(/^\//, "").split("/");
  for (let i = parts.length - 1; i >= 0; i--) {
    const withDyn = [...parts.slice(0, i), `[${guessParam(parts[i])}]`, ...parts.slice(i + 1)].join("/");
    if (routeToCandidates("/" + withDyn).some((p) => existsSync(p))) return true;
    const truncated = [...parts.slice(0, i), `[${guessParam(parts[i])}]`].join("/");
    if (routeToCandidates("/" + truncated).some((p) => existsSync(p))) return true;
  }
  return false;
}

function guessParam(segment) {
  if (segment.startsWith("college-")) return "positionId";
  if (/^\d{2}$/.test(segment) || segment === "034") return "item";
  if (segment.includes("-") && !segment.startsWith("[")) {
    // college slug or lane id
    if (["social", "events", "registration", "canvass", "community"].includes(segment)) return "laneId";
    return "collegeSlug";
  }
  return "slug";
}

const agenda = JSON.parse(readFileSync(join(root, "data/presentation/july-14-agenda.json"), "utf8"));
const board = JSON.parse(readFileSync(join(root, "data/command/board-registry.json"), "utf8"));

const errors = [];
const checked = [];

function check(route, label) {
  checked.push({ route, label });
  if (!routeExists(route)) errors.push(`MISSING ${label}: ${route}`);
}

// Hub + modes
check("/presentations/july-14", "hub");
check("/presentations/july-14/presenter", "presenter");
check("/presentations/july-14/participant", "participant");
check("/presentations/july-14/deck", "deck");
check("/presentations/july-14/commitment", "commitment");
check("/presentations/july-14/goals", "goals");
check("/presentations/july-14/items/[item]", "items");
check("/presentations/july-14/explain/[slug]", "explain");

// Command
check("/command", "command hub");
check("/command/managers", "managers");
check("/command/events", "events board");
check("/command/campaign", "campaign boards");
check("/command/campaign/[laneId]", "campaign lane");
check("/command/campus", "campus index");
check("/command/campus/[collegeSlug]", "campus board");
check("/command/campus/[collegeSlug]/[laneId]", "campus lane");

// Positions + interest
check("/positions/college", "positions index");
for (const lane of board.lanes) {
  check(lane.position_href, `position ${lane.id}`);
  const signupPath = lane.signup_href.split("?")[0];
  check(signupPath, `signup ${lane.id}`);
}

// Every agenda drill
for (const item of agenda.items) {
  const path = item.drill_down_route.split("?")[0];
  // presenter self-links are valid pages
  if (path.includes("/presenter") || path.includes("/participant")) {
    check("/presentations/july-14/presenter", `item ${item.item_number} presenter drill`);
    continue;
  }
  if (path.includes("/explain/")) {
    const slug = path.split("/explain/")[1];
    assert(board.drilldowns.some((d) => d.slug === slug), `drill slug missing for item ${item.item_number}: ${slug}`);
    check("/presentations/july-14/explain/[slug]", `item ${item.item_number} explain`);
    continue;
  }
  if (path.includes("/items/")) {
    check("/presentations/july-14/items/[item]", `item ${item.item_number} item drill`);
    continue;
  }
  if (path.includes("/campaign/") || path.includes("/campus/")) {
    check(path.replace(/\/[^/]+$/, "/[laneId]").replace(/campus\/[^/]+/, "campus/[collegeSlug]"), `item ${item.item_number}`);
    continue;
  }
  check(path, `item ${item.item_number} drill ${path}`);
}

// Hierarchy honesty
assert(board.oversight.volunteer_manager.person === "Carol Eagan", "Carol Eagan must own Event Board");
assert(board.oversight.volunteer_manager.owns.includes("events_board"), "VM owns events_board");
assert(board.oversight.campaign_manager.scope.toLowerCase().includes("both"), "CM over both");
assert(board.oversight.assistant_campaign_manager.scope.toLowerCase().includes("both"), "ACM over both");
assert(board.lanes.find((l) => l.id === "events")?.under_events_board === true, "events under events board");
assert(board.goals.length >= 5, "goals broken out");

// Lane ↔ meeting position
for (const lane of board.lanes) {
  assert(!!lane.meeting_position_id, `${lane.id} missing meeting position`);
  assert(!!lane.campus_team_id, `${lane.id} missing campus team`);
}

console.log(`sandbox-july14-command: checked ${checked.length} routes`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("PASS");
console.log(
  JSON.stringify(
    {
      carol: board.oversight.volunteer_manager.person,
      cm: board.oversight.campaign_manager.status,
      acm: board.oversight.assistant_campaign_manager.status,
      lanes: board.lanes.map((l) => l.id),
      goals: board.goals.length,
      drilldowns: board.drilldowns.length,
      agendaItems: agenda.items.length,
    },
    null,
    2,
  ),
);
