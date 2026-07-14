import type { ManualSectionId } from "./nav";

export type DepthTab = { id: string; label: string; body: string[]; bullets?: string[] };

export type RoleBlock = { title: string; summary: string; items: string[] };

export type ManualSection = {
  id: ManualSectionId;
  eyebrow: string;
  headline: string;
  oneLiner: string;
  levelNote: string;
  overview: string[];
  visualCaption?: string;
  chain?: string[];
  roles?: RoleBlock[];
  tabs: DepthTab[];
  success?: string[];
  nextHref: string;
  nextLabel: string;
};

export const DOCTRINE =
  "Every campaign event must leave the community stronger, more visible, and more organized than it was before Kelly arrived.";

export const LANDING_CHAIN = [
  "Event Scheduled",
  "Local Team Activated",
  "Central Support Activated",
  "Community Outreach Begins",
  "Kelly Comes to Town",
  "Power of 5 Teams Launch",
  "Local Leadership Grows",
  "County Election Operation Strengthens",
];

export const SCALE_OBJECTIVES = [
  { label: "75 County Commands", note: "Objective" },
  { label: "Priority community teams", note: "Objective" },
  { label: "Power of 5 statewide", note: "Objective" },
  { label: "Registration by county & city", note: "Objective" },
  { label: "Every polling place covered", note: "Objective" },
  { label: "Regnat Populus visible everywhere", note: "Objective" },
];

export const OVERVIEW_CARDS = [
  { title: "WHY", body: "Government works best when communities organize themselves." },
  { title: "HOW", body: "Every Kelly event launches a permanent organizing effort." },
  { title: "WHAT", body: "A statewide network of trained neighborhood leaders." },
];

export const STRATEGY_CHAIN = [
  "Kelly Event",
  "Local Team",
  "Central Campaign",
  "Community Outreach",
  "Event",
  "Power of Five",
  "County Growth",
  "Election Victory",
];

export const EVENT_BRANCHES = [
  "Event Approved",
  "County Command",
  "Local Team",
  "Central Teams",
  "Graphics",
  "Emails",
  "Phone",
  "Postcards",
  "Canvassing",
  "Media",
  "Registration",
  "Event Day",
  "Power of Five",
  "Follow Up",
];

export const COMM_TIMELINE = [
  "Today",
  "Save the Date",
  "Graphics",
  "Emails",
  "Radio",
  "Newspaper",
  "Door Hangers",
  "Reminder",
  "Event",
  "After Event",
];

export const P5_CASCADE = ["1", "5", "25", "125", "625", "3,125", "Arkansas"];

export const JOIN_NEEDS = [
  "County Command",
  "City Leads",
  "Canvassing",
  "Registration",
  "Power of Five",
  "Media",
  "Communications",
  "Strike Teams",
  "Event Planning",
];

export const SECTIONS: Record<ManualSectionId, ManualSection> = {
  overview: {
    id: "overview",
    eyebrow: "The Mission",
    headline: "The Most Organized Grassroots Campaign Arkansas Has Ever Seen",
    oneLiner: "We aren't building events. We're building communities that organize themselves.",
    levelNote: "Feel: Hope",
    overview: [DOCTRINE],
    chain: LANDING_CHAIN,
    tabs: [
      {
        id: "mission",
        label: "The Mission",
        body: ["An event is a catalyst, not a finish line.", "Organization that remains after Kelly leaves is the product."],
      },
    ],
    success: ["Leave believing Arkansas can glow county by county."],
    nextHref: "/field-strategy/strategy",
    nextLabel: "Show Me How",
  },
  strategy: {
    id: "strategy",
    eyebrow: "The Entire Strategy",
    headline: "One Board. One Cascade. Statewide Victory.",
    oneLiner: "Thirty thousand feet — the whole chain reaction on one screen.",
    levelNote: "Feel: Clarity",
    overview: ["Click each stage. See how a single Kelly event compounds into county strength."],
    chain: STRATEGY_CHAIN,
    tabs: [
      {
        id: "board",
        label: "The Board",
        body: ["Kelly Event starts the cascade. Local + Central execute. Power of 5 compounds. Counties grow. Elections are won."],
      },
    ],
    success: ["Audience can redraw the chain from memory."],
    nextHref: "/field-strategy/event-engine",
    nextLabel: "Enter the Event Engine",
  },
  "event-engine": {
    id: "event-engine",
    eyebrow: "Level 2 · Operating system",
    headline: "The Event Engine",
    oneLiner: "Scheduling an event starts a standardized chain reaction across local and central teams.",
    levelNote: "Trigger → activation → outreach → event day → Power of 5 → follow-up.",
    overview: [
      "The campaign selects city, county, date, and objective. County Command is notified. A local event committee forms. Central teams activate. Outreach runs on a schedule. Kelly meets the community. Power of 5 launches. Follow-up begins within 24 hours.",
    ],
    chain: [
      "Event Approved",
      "County Command Activated",
      "Local Event Committee Formed",
      "Central Teams Activated",
      "Outreach Campaign Begins",
      "Event Takes Place",
      "Power of 5 Launch",
      "Follow-Up Begins",
    ],
    tabs: [
      {
        id: "trigger",
        label: "Trigger",
        body: ["Event approved with city, county, date, and objective."],
        bullets: ["Calendar entry", "County Command notified", "Objective locked"],
      },
      {
        id: "timeline",
        label: "Timeline",
        body: ["Communications and field work run in waves from confirmation through post-event continuity."],
        bullets: [
          "Immediate: calendar, graphics, media ID, email audience",
          "Launch: Kelly Is Coming email, social, partner outreach",
          "Two weeks: newspaper/radio where useful",
          "One week: reminder + bring a friend",
          "Saturday prior: door hangers",
          "Final 72 hours: countdown + staffing",
          "After: thanks, P5 invites, orientation",
        ],
      },
      {
        id: "local-activation",
        label: "Local Activation",
        body: ["Form the Local Event Committee immediately."],
        bullets: [
          "Event Lead",
          "Social Media Lead",
          "Canvassing Lead",
          "Recruitment Lead",
          "Community & Social Lead",
          "Voter Registration Lead",
          "Media Lead",
          "Logistics Lead",
        ],
      },
      {
        id: "central-activation",
        label: "Central Activation",
        body: ["Central campaign supplies templates, graphics, scripts, data, and specialized teams."],
      },
      {
        id: "outreach",
        label: "Outreach",
        body: ["Email, social, newspaper, radio, postcards, calls, texts, partners, and canvassing move on schedule."],
      },
      {
        id: "event-day",
        label: "Event Day",
        body: [
          "Funnel: Arrival → Greeting → Sign-in → Registration check → Meet volunteers → Meet Kelly → Ask → Join Power of 5 → Choose role → Training invite → Follow-up.",
          "Nobody should attend and leave without a next step.",
        ],
      },
      {
        id: "follow-up",
        label: "Follow-Up",
        body: ["24 hours: thanks, photos, P5 invites. One week: orientation. One month: metrics and next activity."],
      },
      {
        id: "metrics",
        label: "Metrics",
        body: ["Measure infrastructure built: volunteers, P5 teams, registrations, leaders — not attendance alone."],
      },
    ],
    success: ["Local committee named", "Central support requested", "Outreach wave starts", "Follow-up owner assigned"],
    nextHref: "/field-strategy/local-teams",
    nextLabel: "Meet Local Teams",
  },
  "local-teams": {
    id: "local-teams",
    eyebrow: "Level 2–3 · Local Event Committee",
    headline: "Local Leaders Make It Real",
    oneLiner: "The Local Event Committee owns community-facing execution.",
    levelNote: "Eight leads. Multiple co-leads allowed. Committees form under every function.",
    overview: [
      "Local teams adapt central templates to their community. They do not reinvent the campaign alone — and they are not abandoned without support.",
    ],
    roles: [
      {
        title: "Event Lead",
        summary: "Coordinates the complete local event operation.",
        items: ["Venue", "Objective", "Timeline", "Team coordination", "Logistics oversight", "Debrief"],
      },
      {
        title: "Social Media Lead",
        summary: "Works with Central Social on local adaptation and storytelling.",
        items: ["Local stories", "Community groups", "Graphics adapts", "Live content", "Post-event story"],
      },
      {
        title: "Canvassing Lead",
        summary: "Neighborhood outreach in a planned radius.",
        items: ["Saturday-prior door hangers", "Invite to meet Kelly", "Listen to community concerns"],
      },
      {
        title: "Recruitment Lead",
        summary: "Works with Central Field Manager / Volunteer Management.",
        items: ["Staff roles", "Recruit P5 leaders", "Move attendees into roles", "Follow-up pipeline"],
      },
      {
        title: "Community & Social Lead",
        summary: "Builds lasting local relationships.",
        items: ["Faith", "Civic clubs", "Candidates", "Businesses", "Veterans", "Colleges", "Young adults"],
      },
      {
        title: "Voter Registration Lead",
        summary: "Hits goals with Central VR Director — permanent operation, not a one-day table.",
        items: ["County goals", "Local calendar", "Volunteers", "Event integration", "Reporting"],
      },
      {
        title: "Media Lead",
        summary: "Local earned and paid media.",
        items: ["Newspaper", "Radio", "Calendars", "Interviews", "Advisories", "LTE opportunities"],
      },
      {
        title: "Logistics Lead",
        summary: "Makes the physical event work.",
        items: ["Venue", "Parking", "Weather", "Sound", "Stations", "Shirt distribution", "Flow"],
      },
    ],
    tabs: [
      {
        id: "playbook",
        label: "Playbook depth",
        body: [
          "Level 3 playbooks live under each role: timelines, checklists, and escalation.",
          "Level 4 execution packs (scripts, forms, budgets) appear as the future operating layer — reserved, not invented for every county yet.",
        ],
      },
      {
        id: "co-leads",
        label: "Shared leadership",
        body: ["Multiple people may co-lead. Leads + volunteers on the same function form that committee."],
      },
    ],
    success: ["Every role has at least one named person or open recruitment ask"],
    nextHref: "/field-strategy/central-campaign",
    nextLabel: "See Central Support",
  },
  "central-campaign": {
    id: "central-campaign",
    eyebrow: "Level 2 · Central Campaign Committee",
    headline: "Central Campaign Brings the Infrastructure",
    oneLiner: "Local leaders should not reinvent the campaign in every community.",
    levelNote: "Templates, graphics, scripts, training, data, brand, and event standards come from the center.",
    overview: [
      "Central teams surround the county operation with specialized support while County Command and local committees adapt the work on the ground.",
    ],
    tabs: [
      {
        id: "teams",
        label: "Central teams",
        body: ["Specialized statewide functions that activate when an event is scheduled."],
        bullets: [
          "Field Director & County Support",
          "Volunteer Management",
          "Central Social & Graphic Design",
          "Email · Phone · Text · Postcard",
          "City Strike Team",
          "Young Adult & Social Event teams",
          "Central Voter Registration",
          "Communications & Press",
          "Data & Targeting",
          "Operations, Fundraising, Compliance",
        ],
      },
      {
        id: "principle",
        label: "Support principle",
        body: [
          "Center creates the system. Counties adapt it.",
          "Service requests and reporting will later become live routing modules in campaign software.",
        ],
      },
    ],
    success: ["Local team knows who to ask for graphics, lists, shirts, and training"],
    nextHref: "/field-strategy/regnat-populus",
    nextLabel: "Regnat Populus Identity",
  },
  "regnat-populus": {
    id: "regnat-populus",
    eyebrow: "Brand doctrine · The People Rule",
    headline: "The Field Campaign Should Look Like a Movement",
    oneLiner: "Regnat Populus — the Arkansas motto — becomes the visual and cultural identity of the field campaign.",
    levelNote: "Different county. Different town. Different people. Same identity.",
    overview: [
      "Shirts create visibility, recognition, belonging, photographic power, and consistency across Arkansas.",
      "Wear the mission during canvasses, events, registration, Strike Team Saturdays, orientations, and election-period operations.",
      "The shirt represents service and community — volunteers visibly representing the campaign.",
    ],
    tabs: [
      {
        id: "doctrine",
        label: "Brand doctrine",
        body: ["Regnat Populus: The People Rule.", "The People Are the Campaign.", "Organize Where You Live."],
      },
      {
        id: "deployment",
        label: "Shirt deployment",
        body: ["Priority order for distribution and visibility."],
        bullets: [
          "P1: County Command, Event, Canvass, VR, Recruitment leads + regular canvassers",
          "P2: Event volunteers, P5 leaders, poll teams, Strike Team, young adults",
          "P3: Supporters and partners who commit to action",
        ],
      },
      {
        id: "story",
        label: "Visual storytelling",
        body: [
          "Group photos before every canvass. County team photos at events. Volunteer spotlights. County-by-county shirt map over time.",
        ],
      },
    ],
    success: ["Every public field activity plans shirt visibility"],
    nextHref: "/field-strategy/power-of-5",
    nextLabel: "Power of 5 Model",
  },
  "power-of-5": {
    id: "power-of-5",
    eyebrow: "Relational organizing",
    headline: "Five People Build the Next Five",
    oneLiner: "Power of 5 turns event attendance into sustained neighborhood organization.",
    levelNote: "Relational, not purely mathematical. Trusted people talking to people they already know.",
    overview: [
      "A Power of 5 leader identifies, informs, and organizes five people. Those five grow outward across neighborhoods, cities, precincts, and counties.",
      "This is the primary product of every event funnel.",
    ],
    chain: [
      "Connect with campaign",
      "Join a Power of 5 team",
      "Identify five people",
      "Receive toolkit",
      "Invite into activity",
      "Keep team informed",
      "Canvass / register",
      "Prepare for GOTV",
      "Neighborhood link",
      "Election-period help",
    ],
    tabs: [
      {
        id: "model",
        label: "Model",
        body: ["One → five → twenty-five → one hundred twenty-five — grown through relationships."],
      },
      {
        id: "journey",
        label: "Participant journey",
        body: ["From first contact to election-period neighborhood communication link."],
      },
      {
        id: "toolkit",
        label: "Leader toolkit (future pack)",
        body: ["Welcome guide, scripts, five-person sheet, graphics, calendar, VR info, canvass dates, contacts."],
        bullets: ["Level 4 execution layer — reserved for operational pack drop"],
      },
    ],
    success: ["Event ends with P5 commitments and a first meeting date"],
    nextHref: "/field-strategy/voter-registration",
    nextLabel: "Voter Registration System",
  },
  "voter-registration": {
    id: "voter-registration",
    eyebrow: "Permanent field operation",
    headline: "Registration Is Not Occasional",
    oneLiner: "Voter registration is a permanent field operation with county goals, local calendars, and central support.",
    levelNote: "Central VR Director → County VR Lead → City/Community leads → Volunteers.",
    overview: [
      "Every event should consider onsite legality/practicality, information availability, volunteer presence, recruitment into future registration activity, and promotion of local goals.",
    ],
    tabs: [
      {
        id: "structure",
        label: "Structure",
        body: ["Statewide chain of registration leadership."],
        bullets: ["Central Director", "County Lead", "City/Community Leads", "Volunteers"],
      },
      {
        id: "planning",
        label: "Local planning",
        body: ["Each county plan eventually identifies levels, goals, campuses, events, faith communities, weekly schedule, and reporting."],
      },
      {
        id: "events",
        label: "Event integration",
        body: ["Registration check is a step in the event funnel whenever lawful and practical."],
      },
    ],
    success: ["County registration goal known", "Weekly activity on calendar"],
    nextHref: "/field-strategy/strike-teams",
    nextLabel: "Strike Team Saturdays",
  },
  "strike-teams": {
    id: "strike-teams",
    eyebrow: "October rhythm",
    headline: "Campaign Work Should Feel Like Community",
    oneLiner: "Strike Team Saturdays combine disciplined canvass work with visible community energy.",
    levelNote: "Stage → deploy → return → food, fellowship, reporting, recognition.",
    overview: [
      "Central staging: park or community center, grill, music, water, family activities, bounce house when budget allows, local candidates, allies, registration, Regnat Populus visibility.",
      "Deploy for canvass, literature, registration, lawful signs, recruitment. Return for shared meal and next steps.",
      "Every Saturday in October. Coordinate with local Democratic and, where locally appropriate, Libertarian candidates — within all applicable laws.",
    ],
    tabs: [
      { id: "model", label: "Saturday model", body: ["Stage, deploy, return — community energy with campaign discipline."] },
      { id: "staging", label: "Staging", body: ["Food, music, kids activities, check-in, shirts, signage."] },
      { id: "partners", label: "Partnerships", body: ["Local candidates and community groups — finance and election-law compliant."] },
      { id: "october", label: "October calendar", body: ["Weekly Saturday rhythm leading into election operations."] },
    ],
    success: ["First Strike Team Saturday date reserved for the county"],
    nextHref: "/field-strategy/county-command",
    nextLabel: "County Command",
  },
  "county-command": {
    id: "county-command",
    eyebrow: "Operational home",
    headline: "Every County Needs an Operational Home",
    oneLiner: "County Command connects local leaders — it does not replace them.",
    levelNote: "Calendar, capacity, P5, registration, canvass, media, shirts, polls, risks, central support requests.",
    overview: [
      "County Command Lead watches the county in real time: events on schedule, committees behind, open roles, registration pace, earned media, P5 launches, follow-up completion, strike-team needs.",
    ],
    chain: [
      "County Command Lead",
      "City / Community Leads",
      "Functional Leads",
      "Precinct & Neighborhood Leaders",
      "Power of 5 Teams",
    ],
    tabs: [
      {
        id: "duties",
        label: "Responsibilities",
        body: ["Coordinate the county field operation and escalate needs before they become emergencies."],
        bullets: [
          "County calendar & events",
          "City/community leader ID",
          "Volunteer capacity",
          "P5 & registration progress",
          "Canvass & media coordination",
          "Regnat Populus deployment",
          "Strike Team Saturdays",
          "Polling-place coverage prep",
          "Partner coordination where appropriate",
        ],
      },
      {
        id: "dashboard",
        label: "Future dashboard",
        body: [
          "Later software will show events, leads, unfilled roles, volunteers, P5, registration, canvass, precinct/poll coverage, media, shirt/sign inventory, risks, and central support requests.",
          "This website is the visual blueprint for that dashboard.",
        ],
      },
    ],
    success: ["Named County Command Lead or open recruitment ask"],
    nextHref: "/field-strategy/election-operations",
    nextLabel: "Election Operations",
  },
  "election-operations": {
    id: "election-operations",
    eyebrow: "Legal clarity required",
    headline: "Election Operations Begin With Preparation",
    oneLiner: "Trained campaign presence at every polling location where operationally and legally possible.",
    levelNote: "Distinguish poll workers, authorized observers, campaign volunteers, electioneering, signs, restricted zones, and incident rules.",
    overview: [
      "State → Regional → County Command → Mobile Strike Teams → Polling-Location Teams.",
      "Election-week mobile teams confirm volunteers, reinforce lawful signage, deliver supplies, provide relief, escalate issues, and communicate with County Command.",
      "No volunteer is assigned until legal role, training, conduct, and distance rules are verified.",
    ],
    tabs: [
      {
        id: "roles",
        label: "Lawful roles",
        body: ["Final manuals must define each role precisely under Arkansas law before staffing."],
        bullets: ["Observers", "Greeters outside boundaries", "Sign holders where permitted", "Relief & supply", "Escalation & compliance"],
      },
      {
        id: "strike",
        label: "Election-week strike",
        body: ["Mobile county teams circulate continuously on Election Day."],
      },
      {
        id: "guardrail",
        label: "Guardrail",
        body: ["Training before assignment. Distance rules. No improvisation on legal roles."],
      },
    ],
    success: ["Polling-location count known", "Legal briefing scheduled"],
    nextHref: "/field-strategy/success-measures",
    nextLabel: "Success Measures",
  },
  "success-measures": {
    id: "success-measures",
    eyebrow: "Organization is the real metric",
    headline: "We Measure What We Build",
    oneLiner: "Attendance is useful. Organization is decisive.",
    levelNote: "Event, outreach, field, and continuity metrics.",
    overview: [
      "Track first-time attendees, volunteer sign-ups, Power of 5 commitments, registrations, doors, calls, texts, email, social, media, retained volunteers, and next local activities.",
    ],
    tabs: [
      {
        id: "event",
        label: "Event metrics",
        body: ["Attendance, first-timers, orgs, volunteer sign-ups, P5, registration actions, cost per recruited volunteer."],
      },
      {
        id: "outreach",
        label: "Outreach metrics",
        body: ["Email, postcards, calls, texts, social, media placements, radio/newspaper reach."],
      },
      {
        id: "field",
        label: "Field metrics",
        body: ["Doors, conversations, hangers, shifts, shirts, communities, registration activities, P5 active, poll coverage."],
      },
      {
        id: "continuity",
        label: "Continuity metrics",
        body: ["7-day and 30-day retention, P5 still active, next activity scheduled, new leaders, partnerships."],
      },
    ],
    success: ["After every event: infrastructure score, not just headcount"],
    nextHref: "/field-strategy/benton",
    nextLabel: "Benton County Launch",
  },
  benton: {
    id: "benton",
    eyebrow: "County implementation · Tomorrow’s meeting",
    headline: "Benton County: Building the Model",
    oneLiner: "A central priority — electoral opportunity and a chance to prove disciplined local organizing.",
    levelNote: "Statewide vision + exact Benton place inside it. Fill the first leadership map — not every detail.",
    overview: [
      "Who leads County Command? Which cities need leads? Where should Kelly appear? Where can P5 grow fastest? What media, campuses, registration opportunities, October rhythm, and poll coverage need exist?",
      "Immediate outcome: who will lead, recruit, organize, communicate, register voters, and help build the county operation.",
    ],
    roles: [
      {
        title: "County Command (open map)",
        summary: "Name people or mark open.",
        items: [
          "County Command Lead",
          "Deputy / Operations Lead",
          "County Volunteer Lead",
          "County VR Lead",
          "County Social & Communications Lead",
          "County Canvassing Lead",
          "County Media Lead",
          "County Election Operations Lead",
        ],
      },
      {
        title: "Community / city lead seats",
        summary: "Organizing framework — refine with Benton leaders.",
        items: [
          "Bentonville",
          "Rogers",
          "Bella Vista",
          "Siloam Springs",
          "Centerton",
          "Pea Ridge",
          "Lowell",
          "Cave Springs",
          "Gravette",
          "Decatur",
          "Gentry",
          "Rural Benton communities",
        ],
      },
    ],
    tabs: [
      {
        id: "questions",
        label: "Strategic questions",
        body: ["Use these prompts in the meeting."],
        bullets: [
          "County Command Lead?",
          "Priority communities for Kelly events?",
          "Fastest P5 growth areas?",
          "Organizations & media?",
          "Registration opportunities?",
          "Campuses & young adult networks?",
          "October canvass structure?",
          "Polling locations to staff?",
          "Existing volunteer capacity?",
          "Central support needs?",
        ],
      },
      {
        id: "sequence",
        label: "Build sequence",
        body: ["Six stages from leadership to election ops."],
        bullets: [
          "1 Leadership",
          "2 Map the county",
          "3 Schedule first trigger event",
          "4 Launch Power of 5",
          "5 October rhythm",
          "6 Election operations prep",
        ],
      },
      {
        id: "events",
        label: "Event planning board",
        body: ["Placeholder cards for the first Benton calendar."],
        bullets: [
          "Kelly town event",
          "Listening session",
          "Young adult event",
          "VR event",
          "P5 kickoff",
          "Strike Team Saturday",
          "Local candidate partnership",
          "Election ops training",
        ],
      },
      {
        id: "action",
        label: "First action",
        body: [
          "Name County Command (or interim).",
          "Name first event objective window.",
          "Assign owners for recruitment, communication, registration, and canvass.",
        ],
      },
    ],
    success: ["Leadership map has names or open asks", "First trigger event window agreed"],
    nextHref: "/field-strategy/presentation",
    nextLabel: "Run Presentation Mode",
  },
};

export const CLOSING_MESSAGE = [
  "Kelly Grappe’s field campaign will be built community by community, relationship by relationship, and team by team.",
  "Every event will create visibility.",
  "Every conversation will create opportunity.",
  "Every volunteer will receive a next step.",
  "Every county will build leadership.",
  "Every Power of 5 team will extend the campaign’s reach.",
  "And everywhere the campaign goes, Regnat Populus will remind Arkansas:",
];
