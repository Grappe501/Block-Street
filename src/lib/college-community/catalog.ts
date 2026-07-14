export type CampusTeamId =
  | "operations"
  | "social-events"
  | "social-media"
  | "outreach"
  | "voter-registration"
  | "volunteer-support"
  | "data-follow-up";

export type CampusPosition = {
  id: string;
  title: string;
  teamId: CampusTeamId;
  kind: "leadership" | "volunteer";
  purpose: string;
  serves: string;
  reportsTo: string;
  timeCommitment: string;
  responsibilities: string[];
  firstTask: string;
  firstMeeting: string[];
  first24Hours: string[];
  first7Days: string[];
  first30Days: string[];
  success: string[];
  enabledToday: string[];
  pending: string[];
};

export type CampusTeam = {
  id: CampusTeamId;
  name: string;
  purpose: string;
  whyItMatters: string;
  currentGoal: string;
  immediateAction: string;
  firstWeek: string[];
  firstMonth: string[];
  relatedEvent: string;
  relatedVr: string;
};

export const CAMPUS_TEAMS: CampusTeam[] = [
  {
    id: "operations",
    name: "Campus Operations Team",
    purpose: "Coordinate the campus organizing calendar, clarify responsibilities, and keep follow-up moving.",
    whyItMatters: "Without operations, energy becomes confusion. This team keeps every other team on rhythm.",
    currentGoal: "Confirm each team’s first task and schedule the next organizing session.",
    immediateAction: "Schedule the next campus organizing session and confirm each team’s first task.",
    firstWeek: ["Name an Operations Lead or start a leadership conversation", "Publish a simple campus calendar", "Confirm follow-up owners"],
    firstMonth: ["Weekly check-ins", "Keep deadlines visible", "Support every team lead"],
    relatedEvent: "Hold planning slots for the networking event.",
    relatedVr: "Track registration-drive deadlines and readiness gates.",
  },
  {
    id: "social-events",
    name: "Social and Events Team",
    purpose: "Plan a welcoming campus networking and recruitment event — not a long political meeting.",
    whyItMatters: "People join communities that feel good to be in. The event is how strangers become teammates.",
    currentGoal: "Identify three possible dates and locations for the campus networking event.",
    immediateAction: "Begin the campus social-event planning worksheet and identify three possible dates and locations.",
    firstWeek: ["Draft event concept", "List venue options", "Invite an early planning crew"],
    firstMonth: ["Confirm program flow", "Hospitality plan", "Recruit event volunteers"],
    relatedEvent: "Owns the social networking and recruitment event.",
    relatedVr: "Invite event guests into the voter-registration drive.",
  },
  {
    id: "social-media",
    name: "Social Media Team",
    purpose: "Build awareness, promote Orientation, the networking event, and the voter-registration drive.",
    whyItMatters: "Students look online first. Clear posts help people find the correct College Community.",
    currentGoal: "Choose campus platforms and draft a first-week content calendar.",
    immediateAction: "Choose the campus platforms, create a first-week content calendar, and prepare the Orientation invitation post.",
    firstWeek: ["Pick platforms", "Draft welcome post", "Collect student voices"],
    firstMonth: ["Weekly content rhythm", "Promote event + registration drive", "Route replies into teams"],
    relatedEvent: "Promote the networking event.",
    relatedVr: "Promote registration tables and shifts.",
  },
  {
    id: "outreach",
    name: "Outreach and Recruitment Team",
    purpose: "Reach people through relationships, student orgs, and campus partners — then follow up.",
    whyItMatters: "Most growth comes from people you already know at school.",
    currentGoal: "Build the first outreach list from people and organizations already known by current participants.",
    immediateAction: "Build the first outreach list from people and organizations already known by current participants.",
    firstWeek: ["List five personal contacts each", "Name student orgs to approach", "Start Power of 5 conversations"],
    firstMonth: ["Org outreach rounds", "Faculty/staff allies", "Follow-up cadence"],
    relatedEvent: "Invite people to the networking event.",
    relatedVr: "Recruit registration volunteers.",
  },
  {
    id: "voter-registration",
    name: "Voter Registration Team",
    purpose: "Prepare and run a first-week back-to-school voter-registration drive with clear compliance gates.",
    whyItMatters: "Registration is a concrete public service that builds civic muscle on campus.",
    currentGoal: "Start the readiness checklist: locations, dates, shifts, materials, and verification gates.",
    immediateAction: "Start the voter-registration readiness checklist and identify possible tabling locations, dates, and volunteer shifts.",
    firstWeek: ["Readiness review", "List locations", "Recruit shift leads"],
    firstMonth: ["Train volunteers", "Confirm permissions when possible", "Shift coverage"],
    relatedEvent: "Invite event attendees to help at tables.",
    relatedVr: "Owns the drive plan and readiness board.",
  },
  {
    id: "volunteer-support",
    name: "Volunteer Support Team",
    purpose: "Welcome new people, help them choose a role, and make sure no one gets lost after Orientation.",
    whyItMatters: "Belonging keeps people. Support converts interest into useful action.",
    currentGoal: "Review new interest and connect each person to one next step.",
    immediateAction: "Review new participant interest and connect each person to one useful next step.",
    firstWeek: ["Orientation guides", "Role-matching", "Welcome messages"],
    firstMonth: ["Check-ins after first action", "Include accessibility", "Escalate stuck participants"],
    relatedEvent: "Welcome desk at the networking event.",
    relatedVr: "Help new volunteers choose shifts.",
  },
  {
    id: "data-follow-up",
    name: "Data and Follow-Up Team",
    purpose: "Track goals and follow-ups honestly — planned vs reported vs verified — while protecting privacy.",
    whyItMatters: "Leaders need clear numbers without over-claiming.",
    currentGoal: "Establish the campus dashboard baseline and label what is real, estimated, or awaiting verification.",
    immediateAction: "Establish the campus dashboard baseline and identify which figures are real, estimated, or awaiting verification.",
    firstWeek: ["Baseline board", "Separate metrics lanes", "Privacy rules"],
    firstMonth: ["Weekly updates", "Follow-up lists", "Readiness scoring"],
    relatedEvent: "Record attendance interest (not private contacts publicly).",
    relatedVr: "Separate registration conversations from verified registrations.",
  },
];

function pos(
  partial: Omit<CampusPosition, "enabledToday" | "pending"> & Partial<Pick<CampusPosition, "enabledToday" | "pending">>,
): CampusPosition {
  return {
    enabledToday: [
      "College Community pages",
      "Express interest (soft beta)",
      "Campus Power of 5 planning",
      "Recruitment scripts",
    ],
    pending: [
      "Certified invite-chain binding",
      "Durable role appointment",
      "Postgres / production RBAC",
      "Automatic public posting",
    ],
    ...partial,
  };
}

export const CAMPUS_POSITIONS: CampusPosition[] = [
  pos({
    id: "campus-operations-lead",
    title: "Campus Operations Lead",
    teamId: "operations",
    kind: "leadership",
    purpose: "Keep the campus organizing calendar and follow-up clear.",
    serves: "All campus teams",
    reportsTo: "College Leader / campus coordinating lead",
    timeCommitment: "3–5 hours / week (guidance)",
    responsibilities: ["Calendar", "Meeting prep", "Team follow-up", "Action plan visibility"],
    firstTask: "Schedule the next campus organizing session.",
    firstMeeting: ["Confirm who owns each team’s first task", "Agree on a weekly check-in"],
    first24Hours: ["Open the College Community plan", "List open leads", "Message two people who could help"],
    first7Days: ["Publish a simple calendar", "Confirm Operations volunteers", "Support event + VR deadlines"],
    first30Days: ["Maintain weekly rhythm", "Escalate blockers honestly", "Keep readiness visible"],
    success: ["Team first tasks confirmed", "Next session scheduled"],
  }),
  pos({
    id: "meeting-coordinator",
    title: "Meeting Coordinator",
    teamId: "operations",
    kind: "volunteer",
    purpose: "Make campus meetings easy to attend and useful.",
    serves: "Campus participants",
    reportsTo: "Campus Operations Lead",
    timeCommitment: "2–3 hours / week",
    responsibilities: ["Agendas", "Reminders", "Notes", "Follow-up list"],
    firstTask: "Draft the agenda for the next organizing session.",
    firstMeeting: ["Confirm time and place", "List who should be invited"],
    first24Hours: ["Copy Orientation notes into the agenda", "Identify missing team reps"],
    first7Days: ["Send reminders", "Capture decisions", "Share next steps"],
    first30Days: ["Improve meeting rhythm", "Help new people feel oriented"],
    success: ["Meetings happen on time with clear notes"],
  }),
  pos({
    id: "social-events-lead",
    title: "Social and Events Lead",
    teamId: "social-events",
    kind: "leadership",
    purpose: "Lead planning for the campus networking and recruitment event.",
    serves: "Students and campus supporters",
    reportsTo: "College Leader / campus coordinating lead",
    timeCommitment: "3–5 hours / week",
    responsibilities: ["Event concept", "Venue/date options", "Program flow", "Volunteer asks"],
    firstTask: "Identify three possible dates and three possible locations.",
    firstMeeting: ["Choose a working event concept", "Name hospitality and activities helpers"],
    first24Hours: ["Open social-event plan", "Invite five early helpers via Power of 5"],
    first7Days: ["Shortlist venues", "Draft welcome flow", "Coordinate with Social Media"],
    first30Days: ["Confirm program", "Recruit event volunteers", "Finalize promotion with approvals"],
    success: ["Dates/venues shortlisted", "Planning team named"],
  }),
  pos({
    id: "event-recruitment-volunteer",
    title: "Event Recruitment Volunteer",
    teamId: "social-events",
    kind: "volunteer",
    purpose: "Invite people to the networking event through personal relationships.",
    serves: "Campus community growth",
    reportsTo: "Social and Events Lead",
    timeCommitment: "2–4 hours / week",
    responsibilities: ["Personal invites", "Org asks", "Follow-up"],
    firstTask: "Invite five people you know at school to learn about the event.",
    firstMeeting: ["Share who you’re inviting", "Ask for conversation tips"],
    first24Hours: ["Write one invite text", "Name five people"],
    first7Days: ["Send invites", "Track replies honestly", "Offer one next step"],
    first30Days: ["Help fill open volunteer seats", "Support night-of welcomes"],
    success: ["Conversations started", "People pointed to College Community"],
  }),
  pos({
    id: "campus-social-media-lead",
    title: "Campus Social Media Lead",
    teamId: "social-media",
    kind: "leadership",
    purpose: "Lead campus awareness without auto-posting unauthorized content.",
    serves: "Prospective and current participants",
    reportsTo: "College Leader / campus coordinating lead",
    timeCommitment: "3–5 hours / week",
    responsibilities: ["Platform choice", "Content calendar", "Event + VR promotion drafts", "Route replies"],
    firstTask: "Choose platforms and draft a first-week content calendar.",
    firstMeeting: ["Confirm brand/tone guidance", "Assign content helpers"],
    first24Hours: ["List platforms", "Draft Orientation invitation post", "Ask Operations for dates"],
    first7Days: ["Finalize calendar", "Collect photos (with consent)", "Coordinate posts with team leads"],
    first30Days: ["Weekly publishing rhythm", "Promote confirmed events only"],
    success: ["Calendar drafted", "Orientation invite post prepared"],
  }),
  pos({
    id: "outreach-recruitment-lead",
    title: "Outreach and Recruitment Lead",
    teamId: "outreach",
    kind: "leadership",
    purpose: "Grow the College Community through relationships and campus partners.",
    serves: "Campus network expansion",
    reportsTo: "College Leader / campus coordinating lead",
    timeCommitment: "3–5 hours / week",
    responsibilities: ["Outreach list", "Org/faculty liaisons", "Power of 5 coaching", "Follow-up"],
    firstTask: "Build the first outreach list from people already known by participants.",
    firstMeeting: ["Map orgs and contacts", "Assign follow-up owners"],
    first24Hours: ["Open campus recruit guide", "Start your Power of 5", "List three student orgs"],
    first7Days: ["Hold outreach conversations", "Invite people into Orientation/community", "Log interest honestly"],
    first30Days: ["Expand partnerships", "Support team matching"],
    success: ["Outreach list exists", "Power of 5 in progress"],
  }),
  pos({
    id: "voter-registration-lead",
    title: "Voter Registration Lead",
    teamId: "voter-registration",
    kind: "leadership",
    purpose: "Lead readiness for the first-week back-to-school registration drive.",
    serves: "Students who need clear, lawful registration help",
    reportsTo: "College Leader / campus coordinating lead",
    timeCommitment: "4–6 hours / week (near launch)",
    responsibilities: ["Readiness board", "Locations/shifts", "Training coordination", "Metric separation"],
    firstTask: "Start the readiness checklist and identify possible locations, dates, and shifts.",
    firstMeeting: ["Review verification gates", "Separate registration vs VCI vs launch-team counts"],
    first24Hours: ["Open VR readiness page", "List location ideas", "Ask Compliance helper to review gates"],
    first7Days: ["Recruit shift coordinator", "Draft materials list", "Coordinate Social Media"],
    first30Days: ["Train volunteers", "Pursue campus permission evidence", "Confirm coverage"],
    success: ["Readiness board started", "No false compliance claims"],
  }),
  pos({
    id: "voter-registration-volunteer",
    title: "Voter Registration Volunteer",
    teamId: "voter-registration",
    kind: "volunteer",
    purpose: "Help table shifts and conversations during the drive — after training and permissions allow.",
    serves: "Peers seeking registration help",
    reportsTo: "Voter Registration Lead / Shift Coordinator",
    timeCommitment: "Shifts as scheduled",
    responsibilities: ["Shift coverage", "Welcoming conversations", "Follow scripted guidance", "No over-claims"],
    firstTask: "Express interest in a shift window and complete training when offered.",
    firstMeeting: ["Learn tableside expectations", "Ask compliance questions"],
    first24Hours: ["Join VR team interest", "Read readiness status", "Invite one friend to volunteer"],
    first7Days: ["Pick possible shifts", "Prep invite text", "Review materials"],
    first30Days: ["Cover shifts when Ready", "Help follow-up"],
    success: ["Trained before tables", "Honest activity recording"],
  }),
  pos({
    id: "volunteer-support-lead",
    title: "Volunteer Support Lead",
    teamId: "volunteer-support",
    kind: "leadership",
    purpose: "Welcome people and connect them to one useful next step.",
    serves: "New Orientation participants",
    reportsTo: "College Leader / campus coordinating lead",
    timeCommitment: "3–4 hours / week",
    responsibilities: ["Welcome", "Role matching", "Orientation help", "Check-ins"],
    firstTask: "Review new interest and connect each person to one next step.",
    firstMeeting: ["Define welcome script", "Pair with team leads"],
    first24Hours: ["Open people page", "Message two new interested people", "Point them to one team"],
    first7Days: ["Host welcome window", "Match roles", "Follow up once"],
    first30Days: ["Keep no one stranded", "Support accessibility"],
    success: ["Every new interest has a next step"],
  }),
  pos({
    id: "campus-data-lead",
    title: "Campus Data Lead",
    teamId: "data-follow-up",
    kind: "leadership",
    purpose: "Keep campus numbers honest and separated by lane.",
    serves: "Campus leadership clarity",
    reportsTo: "College Leader / campus coordinating lead",
    timeCommitment: "2–4 hours / week",
    responsibilities: ["Baseline dashboard", "Metric separation", "Follow-up lists", "Privacy"],
    firstTask: "Establish the campus dashboard baseline and label estimated vs verified figures.",
    firstMeeting: ["Agree metric lanes", "Confirm privacy rules"],
    first24Hours: ["Open College Community homepage KPIs", "Note Soft beta labels", "List missing data"],
    first7Days: ["Publish baseline", "Help VR/event recorders", "Flag blockers"],
    first30Days: ["Weekly refresh", "Support readiness scoring"],
    success: ["No mixed registration/VCI/launch-team totals"],
  }),
  pos({
    id: "campus-ambassador",
    title: "Campus Ambassador",
    teamId: "outreach",
    kind: "volunteer",
    purpose: "Represent the College Community warmly and point people to Orientation.",
    serves: "Peers discovering Block Street",
    reportsTo: "Outreach and Recruitment Lead",
    timeCommitment: "2–3 hours / week",
    responsibilities: ["Peer conversations", "Point to College Community", "Invite to event"],
    firstTask: "Invite two classmates to open the College Community page.",
    firstMeeting: ["Practice a short welcome", "Learn where to send people"],
    first24Hours: ["Open recruit/friends scripts", "Name two people"],
    first7Days: ["Have conversations", "Follow up once"],
    first30Days: ["Support event invite night", "Help welcomes"],
    success: ["People enter the College Community without overwhelm"],
  }),
];

export function getCampusTeam(id: string): CampusTeam | null {
  return CAMPUS_TEAMS.find((t) => t.id === id) ?? null;
}

export function getCampusPosition(id: string): CampusPosition | null {
  return CAMPUS_POSITIONS.find((p) => p.id === id) ?? null;
}

export function listPositionsForTeam(teamId: CampusTeamId): CampusPosition[] {
  return CAMPUS_POSITIONS.filter((p) => p.teamId === teamId);
}

export const MONTH_PLAN = {
  week1: {
    title: "Week 1 — Form the core",
    items: [
      "Complete Orientation",
      "Join the correct College Community",
      "Identify initial campus leaders",
      "Open leadership conversations",
      "Create initial Power of 5 lists",
      "Identify student organizations and campus contacts",
      "Begin voter-registration readiness review",
      "Begin social-event concept planning",
    ],
  },
  week2: {
    title: "Week 2 — Build the teams",
    items: [
      "Fill priority team leads",
      "Recruit initial team volunteers",
      "Hold the first campus organizing meeting",
      "Choose possible voter-registration dates and locations",
      "Choose possible social-event dates and locations",
      "Start the campus social media calendar",
      "Begin personal outreach",
    ],
  },
  week3: {
    title: "Week 3 — Prepare execution",
    items: [
      "Confirm or pursue campus permissions",
      "Train voter-registration volunteers",
      "Build shift plans",
      "Prepare promotional content",
      "Confirm networking-event program",
      "Expand Power of 5 outreach",
      "Review goals and gaps",
    ],
  },
  week4: {
    title: "Week 4 — Launch readiness",
    items: [
      "Confirm the voter-registration drive plan status",
      "Confirm volunteer coverage",
      "Finalize social-event details when ready",
      "Publish only approved promotion",
      "Conduct final team check",
      "Prepare participant follow-up",
      "Confirm first-week-back actions",
    ],
  },
} as const;
