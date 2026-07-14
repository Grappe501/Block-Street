/**
 * Freeze July 14 agenda registry from existing Identity i18n language.
 * Titles and body lines are exact English strings from src/lib/july14/i18n.ts
 * (+ presentation twin close line). No invented agenda doctrine.
 */
import "../h-drive-env.mjs";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");

const SLIDE_ORDER = [
  "open",
  "intro",
  "urgency",
  "problem-opportunity",
  "how",
  "why-now",
  "building",
  "website",
  "next-meeting",
  "name",
  "close",
];

/** Exact strings from i18n + presentation slides.
 * Flow: open → introductions (people) → why this matters → rest.
 * “Why This Matters” follows Quick Name and School (not before room intros).
 */
const LEAVES = [
  { n: "01", title: "Meeting Agenda: Launching ASYON", body: "Goal: Introduce the organization, rally participants, and assign roles to build collective power.", section: "open", family: "A", duration: 2, slide: "open", drill: "/july-14", action: "Review tonight’s purpose", i18n: "agenda.title+agenda.goal" },
  { n: "02", title: "1. Introductions", body: "Lead with people, not product.", section: "s1", family: "A", duration: 1, slide: "intro", drill: "/presentations/july-14?slide=1", action: "Begin introductions", i18n: "agenda.s1.title" },
  { n: "03", title: "Chance and Xay (Youth Leaders): Share vision, experience, and passion for organizing young people in politics.", body: "Chance and Xay (Youth Leaders): Share vision, experience, and passion for organizing young people in politics.", section: "s1", family: "A", duration: 2, slide: "intro", drill: "/admin/college-command/meeting/july-14", action: "Hear youth leaders", i18n: "agenda.s1.a" },
  { n: "04", title: "Politician Guests: Briefly introduce them and their role in supporting this effort.", body: "Politician Guests: Briefly introduce them and their role in supporting this effort.", section: "s1", family: "A", duration: 1, slide: "intro", drill: "/admin/college-command/meeting/july-14", action: "Welcome guests", i18n: "agenda.s1.b" },
  { n: "05", title: "Quick Name and School: Each participant introduces themselves with their name & school (e.g., “Alex, University of Arkansas”).", body: "Quick Name and School: Each participant introduces themselves with their name & school (e.g., “Alex, University of Arkansas”).", section: "s1", family: "A", duration: 2, slide: "intro", drill: "/admin/college-command/meeting/july-14", action: "Everyone introduces", i18n: "agenda.s1.c" },
  { n: "06", title: "2. Why This Matters", body: "We’re at a perfect political cusp. 2026–2028 can be decided by young voters — if we organize now.", section: "s2", family: "B", duration: 1, slide: "urgency", drill: "/how-it-works", action: "Open How Block Street works", i18n: "agenda.s2.title" },
  { n: "07", title: "We’re at a perfect political cusp. The next elections (2026–2028) have the capability to be decided by young voters. If we organize now, we can influence every seat in the state.", body: "We’re at a perfect political cusp. The next elections (2026–2028) have the capability to be decided by young voters. If we organize now, we can influence every seat in the state.", section: "s2", family: "B", duration: 1, slide: "urgency", drill: "/how-it-works", action: "Discuss", i18n: "agenda.s2.urgency.a" },
  { n: "08", title: "Steve (Overall Organizer) has never seen Arkansas colleges organize like this before. This is our chance to make history.", body: "Steve (Overall Organizer) has never seen Arkansas colleges organize like this before. This is our chance to make history.", section: "s2", family: "B", duration: 1, slide: "urgency", drill: "/how-it-works/hierarchy", action: "Discuss", i18n: "agenda.s2.urgency.b" },
  { n: "09", title: "You are the most valuable thing to politicians. Young voters are the largest and most untapped voting bloc by large margin. Politicians need us to win, but we need to organize to demand power in return.", body: "You are the most valuable thing to politicians. Young voters are the largest and most untapped voting bloc by large margin. Politicians need us to win, but we need to organize to demand power in return.", section: "s2", family: "B", duration: 1, slide: "urgency", drill: "/how-it-works/participation-journey", action: "Discuss", i18n: "agenda.s2.urgency.c" },
  { n: "10", title: "More than 50% of the voting population is under 50, but the rules are still made by those over 50. We have the numbers but not the organization to aid ourselves, yet.", body: "More than 50% of the voting population is under 50, but the rules are still made by those over 50. We have the numbers but not the organization to aid ourselves, yet.", section: "s2", family: "B", duration: 1, slide: "problem-opportunity", drill: "/how-it-works", action: "Discuss", i18n: "agenda.s2.problem.a" },
  { n: "11", title: "Ballot initiatives and lawmaking are areas where young people can have a massive impact—if we’re united.", body: "Ballot initiatives and lawmaking are areas where young people can have a massive impact—if we’re united.", section: "s2", family: "C", duration: 1, slide: "problem-opportunity", drill: "/field-plan/overview", action: "Open Field Plan", i18n: "agenda.s2.problem.b" },
  { n: "12", title: "Swinging the election for people like Kelly, people like Chris, or whoever we decide has our intentions best in mind. This isn’t about a single candidate. It’s about building team voting power to amplify our voice and demand change.", body: "Swinging the election for people like Kelly, people like Chris, or whoever we decide has our intentions best in mind. This isn’t about a single candidate. It’s about building team voting power to amplify our voice and demand change.", section: "s2", family: "B", duration: 1, slide: "problem-opportunity", drill: "/how-it-works", action: "Discuss", i18n: "agenda.s2.opportunity.a" },
  { n: "13", title: "After the election, we can uplift each other and future leaders to run for office in the coming years.", body: "After the election, we can uplift each other and future leaders to run for office in the coming years.", section: "s2", family: "D", duration: 1, slide: "problem-opportunity", drill: "/positions/college", action: "Browse positions", i18n: "agenda.s2.opportunity.b" },
  { n: "14", title: "Every campus or group will be unique. We’re providing resources and support, but every group will shape this to fit their community.", body: "Every campus or group will be unique. We’re providing resources and support, but every group will shape this to fit their community.", section: "s3", family: "B", duration: 1, slide: "how", drill: "/how-it-works", action: "Explain approach", i18n: "agenda.s3.approach.body" },
  { n: "15", title: "Social Media Lead (to grow our network and spread the word)", body: "Social Media Lead (to grow our network and spread the word)", section: "s3", family: "D", duration: 1, slide: "how", drill: "/positions/college-social-media-lead", action: "Explore this position", i18n: "agenda.s3.roles.a", positionId: "college-social-media-lead" },
  { n: "16", title: "Voter Registration Lead (to ensure our peers are registered and ready to vote)", body: "Voter Registration Lead (to ensure our peers are registered and ready to vote)", section: "s3", family: "D", duration: 1, slide: "how", drill: "/positions/college-voter-registration-lead", action: "Explore this position", i18n: "agenda.s3.roles.b", positionId: "college-voter-registration-lead" },
  { n: "17", title: "College/Community Lead (to oversee and coordinate efforts locally)", body: "College/Community Lead (to oversee and coordinate efforts locally)", section: "s3", family: "D", duration: 1, slide: "how", drill: "/positions/college-community-lead", action: "Explore this position", i18n: "agenda.s3.roles.c", positionId: "college-community-lead" },
  { n: "18", title: "Event Lead (to organize fun, engaging, and informative events)", body: "Event Lead (to organize fun, engaging, and informative events)", section: "s3", family: "D", duration: 1, slide: "how", drill: "/positions/college-event-lead", action: "Explore this position", i18n: "agenda.s3.roles.d", positionId: "college-event-lead" },
  { n: "19", title: "Canvassing/Outreach Lead (to connect with peers and expand our network)", body: "Canvassing/Outreach Lead (to connect with peers and expand our network)", section: "s3", family: "D", duration: 1, slide: "how", drill: "/positions/college-canvass-outreach-lead", action: "Explore this position", i18n: "agenda.s3.roles.e", positionId: "college-canvass-outreach-lead" },
  { n: "20", title: "Summer is the best time to organize. Life is less chaotic with school out so we can build momentum before the fall rush. Grinding this next month is essential.", body: "Summer is the best time to organize. Life is less chaotic with school out so we can build momentum before the fall rush. Grinding this next month is essential.", section: "s3", family: "A", duration: 1, slide: "why-now", drill: "/admin/college-command/meeting/july-14", action: "Commit to summer window", i18n: "agenda.s3.why.body" },
  { n: "21", title: "A social network across the state of young people (16–24) to get engaged, inform their peers, and establish political power.", body: "A social network across the state of young people (16–24) to get engaged, inform their peers, and establish political power.", section: "s4", family: "C", duration: 1, slide: "building", drill: "/field-plan/overview", action: "Open Field Plan overview", i18n: "agenda.s4.vision.a" },
  { n: "22", title: "Making politics fun", body: "Making politics fun", section: "s4", family: "G", duration: 1, slide: "building", drill: "/power-of-5", action: "Open Power of 5", i18n: "agenda.s4.vision.b" },
  { n: "23", title: "The Power of 5", body: "The Power of 5", section: "s4", family: "G", duration: 2, slide: "building", drill: "/power-of-5/start", action: "Start a Power of 5 plan", i18n: "agenda.s4.vision.c" },
  { n: "24", title: "Set a foundation for organizing young people to run for office in future elections.", body: "Set a foundation for organizing young people to run for office in future elections.", section: "s4", family: "C", duration: 1, slide: "building", drill: "/field-plan/depths", action: "Review depth layers", i18n: "agenda.s4.long.a" },
  { n: "25", title: "Build soft power to influence local politics and politicians.", body: "Build soft power to influence local politics and politicians.", section: "s4", family: "C", duration: 1, slide: "building", drill: "/field-plan/overview", action: "Review plan purpose", i18n: "agenda.s4.long.b" },
  { n: "26", title: "Ballot initiatives and lawmaking — areas where we can have massive effect.", body: "Ballot initiatives and lawmaking — areas where we can have massive effect.", section: "s4", family: "C", duration: 1, slide: "building", drill: "/field-plan/responsibilities", action: "Browse responsibilities", i18n: "agenda.s4.long.c" },
  { n: "27", title: "Create a statewide network that prepares young leaders to take on leadership roles everywhere.", body: "Create a statewide network that prepares young leaders to take on leadership roles everywhere.", section: "s4", family: "D", duration: 1, slide: "building", drill: "/positions/college", action: "Browse college positions", i18n: "agenda.s4.long.d" },
  { n: "28", title: "Build collective power so we can change the government together.", body: "Build collective power so we can change the government together.", section: "s4", family: "B", duration: 1, slide: "building", drill: "/how-it-works/hierarchy", action: "See hierarchy", i18n: "agenda.s4.long.e" },
  { n: "29", title: "Walk through the website’s features", body: "Walk through the website’s features", section: "s5", family: "B", duration: 2, slide: "website", drill: "/presentations/college", action: "Open College walkthrough", i18n: "agenda.s5.a" },
  { n: "30", title: "Highlight how they can access materials, training, and support to get started", body: "Highlight how they can access materials, training, and support to get started", section: "s5", family: "C", duration: 1, slide: "website", drill: "/field-plan", action: "Open Field Plan library", i18n: "agenda.s5.b" },
  { n: "31", title: "Tell us what dates you can’t make, and we’ll pick the widest availability.", body: "Tell us what dates you can’t make, and we’ll pick the widest availability.", section: "s6", family: "I", duration: 1, slide: "next-meeting", drill: "/presentations/july-14/commitment", action: "Share availability", i18n: "agenda.s6.a" },
  { n: "32", title: "Proposed window: July 20–26", body: "Proposed window: July 20–26", section: "s6", family: "I", duration: 1, slide: "next-meeting", drill: "/admin/college-command/meeting/july-14", action: "Note window", i18n: "agenda.s6.b" },
  { n: "33", title: "7. Name Decision for the Organization", body: "Optional, if time allows — open the floor to brainstorm names for the organization.", section: "s7", family: "I", duration: 1, slide: "name", drill: "/presentations/july-14/items/33", action: "Optional brainstorm", i18n: "agenda.s7.title+agenda.s7.body" },
  { n: "34", title: "Leave with a seat and a next step", body: "Invite one person you trust. Choose your place. Take a campus role — or recruit for an open one. Feedback from beta partners makes this stronger — tell us what works and what doesn’t.", section: "close", family: "I", duration: 2, slide: "close", drill: "/presentations/july-14/commitment", action: "Choose a commitment", i18n: "presentation.close", aliases: ["034"] },
];

const FAMILY = {
  A: "/admin/college-command/meeting/july-14",
  B: "/how-it-works",
  C: "/field-plan/overview",
  D: "/positions/college",
  G: "/power-of-5",
  I: "/presentations/july-14/commitment",
};

const totalDuration = LEAVES.reduce((a, x) => a + x.duration, 0);

const registry = {
  version: "1.0.0",
  meeting: "July 14 College Team / ASYON launch",
  updated: new Date().toISOString(),
  production_baseline_cited: "938ac14",
  canonical_sources: [
    "src/lib/july14/i18n.ts (agenda.* keys)",
    "src/lib/presentations/july14-agenda.ts (JULY14_AGENDA_SLIDES)",
    "src/app/(site)/july-14/page.tsx",
    "/presentations/july-14",
  ],
  finding: {
    requested_range: "04–034",
    status: "mapped_from_existing_language",
    note: "No pre-existing agenda IDs 04–034 existed in the repository as keyed agenda items. Items 01–34 freeze exact English language from Identity i18n and the July 14 presentation twin without inventing replacement titles. Meeting flow places Introductions (people) before Why This Matters: item 03 Chance and Xay → 04 guests → 05 name/school → 06 Why This Matters. Item 34 also resolves alias 034 for deep links.",
  },
  total_meeting_minutes_target: 45,
  total_leaf_duration_minutes: totalDuration,
  timing_note:
    totalDuration === 45
      ? "Leaf durations sum to 45 minutes."
      : `Leaf durations currently sum to ${totalDuration} minutes; preserve section order and use stay-on-agenda pacing. Recommended pacing only — do not rewrite agenda doctrine.`,
  honesty: {
    working_now: [
      "Director inspection hub",
      "College Team KPI surfaces",
      "Field Plan navigation and approved content",
      "Position exploration",
      "Soft-beta participation and interest flows",
      "Power of 5 planning",
      "Existing invitation soft-beta flow",
    ],
    still_being_completed: [
      "Certified invite-chain binding",
      "Full Volunteer Manager workspace",
      "Full County Command workspace",
      "Full leader workbench",
      "Postgres personnel persistence",
      "Production RBAC",
      "L4 execution",
    ],
  },
  items: LEAVES.map((x, i) => ({
    item_number: x.n,
    aliases: x.aliases ?? [],
    sequence: i + 1,
    title: x.title,
    duration_minutes: x.duration,
    section: x.section,
    source_reference: x.i18n,
    presenter_content: [x.body],
    participant_content: [x.body],
    current_route: `/presentations/july-14?slide=${SLIDE_ORDER.indexOf(x.slide)}`,
    item_route: `/presentations/july-14/items/${x.n}`,
    supporting_module: FAMILY[x.family] ?? "/presentations/july-14",
    drill_down_route: x.drill,
    primary_action: x.action,
    position_id: x.positionId ?? null,
    family: x.family,
    slide_id: x.slide,
    status: "live",
    notes: [],
  })),
};

const out = join(root, "data/presentation/july-14-agenda.json");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(registry, null, 2) + "\n");
console.log(`Wrote ${registry.items.length} items → ${out} (${totalDuration} min leaf sum)`);
console.log(`Items 04–34 count: ${registry.items.filter((i) => Number(i.item_number) >= 4).length}`);
