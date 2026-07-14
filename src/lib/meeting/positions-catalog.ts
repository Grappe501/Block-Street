export type MeetingPosition = {
  id: string;
  title: string;
  command: string;
  geography: string;
  reportsTo: string;
  serves: string;
  timeExpectation: string;
  status: "open" | "filled";
  readiness: "soft_beta" | "shell" | "awaiting_source";
  primaryContribution: string;
  responsibilities: string[];
  firstConversation: string[];
  first24Hours: string[];
  first7Days: string[];
  first30Days: string[];
  enabledToday: string[];
  pending: string[];
  kpis: { label: string; provisional: boolean }[];
  family: "college" | "county" | "functional";
};

export const COLLEGE_POSITIONS: MeetingPosition[] = [
  {
    id: "college-social-media-lead",
    title: "Social Media Lead",
    command: "College Team",
    geography: "Campus / institution",
    reportsTo: "College / Community Lead",
    serves: "Students and campus network visibility",
    timeExpectation: "3–5 hours / week (soft-beta guidance)",
    status: "open",
    readiness: "soft_beta",
    primaryContribution: "Grow the network and spread the word",
    responsibilities: [
      "Grow our network and spread the word (agenda language)",
      "Adapt shared graphics and stories for your campus",
      "Coordinate with Event Lead on announcements",
    ],
    firstConversation: ["Ask your College/Community Lead what channels matter locally.", "Name one story you can post this week."],
    first24Hours: ["Review this position page.", "Identify five trusted people for Power of 5.", "Draft one invitation message."],
    first7Days: ["Prepare three campus posts or stories.", "Meet your College/Community Lead once.", "Invite first Power of 5 conversation."],
    first30Days: ["Keep a simple weekly posting rhythm.", "Introduce one peer into a campus role conversation.", "Report progress in College Team follow-up."],
    enabledToday: ["Position exploration", "Interest expression (soft beta)", "Power of 5 planning", "Recruiting scripts"],
    pending: ["Certified invite binding", "Durable role appointment", "Full leader workbench"],
    kpis: [
      { label: "Campus invitation conversations started", provisional: true },
      { label: "Power of 5 seats identified", provisional: true },
    ],
    family: "college",
  },
  {
    id: "college-voter-registration-lead",
    title: "Voter Registration Lead",
    command: "College Team",
    geography: "Campus / institution",
    reportsTo: "College / Community Lead",
    serves: "Peers who need to be registered and ready to vote",
    timeExpectation: "3–5 hours / week (soft-beta guidance)",
    status: "open",
    readiness: "soft_beta",
    primaryContribution: "Ensure peers are registered and ready to vote",
    responsibilities: [
      "Ensure our peers are registered and ready to vote (agenda language)",
      "Keep registration goals separate from VCI and launch-team goals",
      "Use enrollment_share_of_county_vap_v1 when reviewing campus numbers — never the superseded flat campus share",
    ],
    firstConversation: ["Review your institution’s registration goal labeling (estimates pending ACS).", "Ask what registration support already exists on campus."],
    first24Hours: ["Open College Command goals.", "Identify five people who can help register peers.", "Prepare one recruitment text."],
    first7Days: ["Host or join one registration conversation.", "Build Power of 5 plan for registration helpers.", "Schedule a follow-up with College/Community Lead."],
    first30Days: ["Maintain a simple registration activity rhythm.", "Track interest (not appointments) for helpers.", "Separate registration counts from VCI."],
    enabledToday: ["College KPI surfaces", "Position drill-down", "Soft-beta interest", "Power of 5 builder"],
    pending: ["Certified invite-chain", "Postgres personnel persistence", "Production RBAC"],
    kpis: [
      { label: "Registration conversations held", provisional: true },
      { label: "Helpers interested (not appointed)", provisional: true },
    ],
    family: "college",
  },
  {
    id: "college-community-lead",
    title: "College / Community Lead",
    command: "College Team",
    geography: "Campus / institution",
    reportsTo: "Education Command / College leadership path",
    serves: "Local campus coordinating team",
    timeExpectation: "4–6 hours / week (soft-beta guidance)",
    status: "open",
    readiness: "soft_beta",
    primaryContribution: "Oversee and coordinate efforts locally",
    responsibilities: [
      "Oversee and coordinate efforts locally (agenda language)",
      "Help fill campus roles without inventing personnel",
      "Keep the meeting path clear: understand → choose → next step",
    ],
    firstConversation: ["Walk the July 14 agenda with your team.", "Confirm which campus seats need people."],
    first24Hours: ["Open College Team workspace.", "Review open positions.", "Start your Power of 5 plan."],
    first7Days: ["Match two people to useful role conversations.", "Support Event Lead on next gathering.", "Send one soft-beta invite via existing flow."],
    first30Days: ["Maintain weekly coordination check-in.", "Keep registration / VCI / launch-team goals separate.", "Escalate blockers honestly (shell vs live)."],
    enabledToday: ["College Command", "Agenda workspace", "Position catalog", "Power of 5", "Recruit guide"],
    pending: ["Full Volunteer Manager", "Certified hierarchy binding", "L4 execution"],
    kpis: [
      { label: "Open seats with named interest", provisional: true },
      { label: "Power of 5 teams started", provisional: true },
    ],
    family: "college",
  },
  {
    id: "college-event-lead",
    title: "Event Lead",
    command: "College Team",
    geography: "Campus / institution",
    reportsTo: "College / Community Lead",
    serves: "Campus gatherings and follow-up",
    timeExpectation: "3–5 hours / week (soft-beta guidance)",
    status: "open",
    readiness: "soft_beta",
    primaryContribution: "Organize fun, engaging, and informative events",
    responsibilities: [
      "Organize fun, engaging, and informative events (agenda language)",
      "Leave each gathering with named next steps",
      "Partner with Social and Outreach leads",
    ],
    firstConversation: ["Propose one small campus gathering window.", "Ask who can greet and who can follow up."],
    first24Hours: ["Pick a date window.", "Identify five helpers via Power of 5.", "Draft an invite message."],
    first7Days: ["Confirm venue/time approach.", "Invite helpers.", "Publish one announcement with Social Media Lead."],
    first30Days: ["Run one gathering or work session.", "Capture interest (not appointments).", "Plan the next check-in."],
    enabledToday: ["Position pages", "Recruit scripts", "Power of 5", "Soft-beta interest"],
    pending: ["Durable task assignment", "Full leader workbench"],
    kpis: [{ label: "Gatherings planned", provisional: true }],
    family: "college",
  },
  {
    id: "college-canvass-outreach-lead",
    title: "Canvassing / Outreach Lead",
    command: "College Team",
    geography: "Campus / institution",
    reportsTo: "College / Community Lead",
    serves: "Peer connection and network expansion",
    timeExpectation: "3–5 hours / week (soft-beta guidance)",
    status: "open",
    readiness: "soft_beta",
    primaryContribution: "Connect with peers and expand our network",
    responsibilities: [
      "Connect with peers and expand our network (agenda language)",
      "Use relationship-first recruiting — no pressure",
      "Help people take one useful next step",
    ],
    firstConversation: ["Name neighborhoods or orgs you already know.", "Ask what peers care about before pitching roles."],
    first24Hours: ["Open recruiting guide.", "Identify five people.", "Prepare one personal text."],
    first7Days: ["Have three conversations.", "Invite two people into a next step.", "Follow up once."],
    first30Days: ["Keep a weekly outreach rhythm.", "Support registration or event asks as needed.", "Report interest honestly."],
    enabledToday: ["Recruit module", "Power of 5", "Soft-beta invites"],
    pending: ["Certified invite binding", "County board completeness"],
    kpis: [{ label: "Outreach conversations", provisional: true }],
    family: "college",
  },
];

export function getPosition(id: string): MeetingPosition | null {
  return COLLEGE_POSITIONS.find((p) => p.id === id) ?? null;
}

export function getCollegePosition(id: string): MeetingPosition | undefined {
  return COLLEGE_POSITIONS.find((p) => p.id === id);
}

export function listPositions(family?: MeetingPosition["family"]): MeetingPosition[] {
  if (!family) return COLLEGE_POSITIONS;
  return COLLEGE_POSITIONS.filter((p) => p.family === family);
}

export function listOpenCollegePositions(): MeetingPosition[] {
  return COLLEGE_POSITIONS.filter((p) => p.family === "college" && p.status === "open");
}

export function withMeetingReturn(href: string, from?: string | null, item?: string | null): string {
  if (!from && !item) return href;
  const url = new URL(href, "https://block-street.local");
  if (from) url.searchParams.set("from", from);
  if (item) url.searchParams.set("item", item);
  return `${url.pathname}${url.search}`;
}
