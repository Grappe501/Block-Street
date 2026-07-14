export type HierarchyNode = {
  id: string;
  title: string;
  purpose: string;
  serves: string;
  reportsTo: string | null;
  supports: string;
  responsibilities: string[];
  sees: string;
  decisions: string;
  enabledToday: string;
  pending: string;
};

export const HIERARCHY_NODES: HierarchyNode[] = [
  {
    id: "director",
    title: "Director",
    purpose: "Inspect the whole organizing system and keep honesty about what is live.",
    serves: "Statewide leadership and volunteers who need clear oversight",
    reportsTo: null,
    supports: "Volunteer Manager and command surfaces",
    responsibilities: ["Inspect programs", "Surface blockers", "Protect soft-beta honesty"],
    sees: "Director Omniview and registries",
    decisions: "Priorities and inspection follow-ups (not fake personnel assigns)",
    enabledToday: "Director inspection hub is live",
    pending: "Deeper execution boards remain incomplete",
  },
  {
    id: "volunteer-manager",
    title: "Volunteer Manager",
    purpose: "Support volunteer capacity across commands.",
    serves: "County and education volunteer pathways",
    reportsTo: "Director",
    supports: "County Volunteer Command",
    responsibilities: ["Guide volunteer pathways", "Escalate capacity needs"],
    sees: "Volunteer Command shell today",
    decisions: "Preview only until board completion",
    enabledToday: "Shell route exists",
    pending: "Full Volunteer Manager workspace",
  },
  {
    id: "county-volunteer-command",
    title: "County Volunteer Command",
    purpose: "Coordinate volunteer strength inside a county.",
    serves: "County leaders and local teams",
    reportsTo: "Volunteer Manager",
    supports: "Education Command and local leads",
    responsibilities: ["County volunteer rhythm", "Connect local asks"],
    sees: "County volunteer shell",
    decisions: "Limited until board completion",
    enabledToday: "Thin shell",
    pending: "Full county workbench",
  },
  {
    id: "education-command",
    title: "Education Command",
    purpose: "Organize campus and education institution participation.",
    serves: "College Team and institutions",
    reportsTo: "County Volunteer Command / statewide education path",
    supports: "College Leader",
    responsibilities: ["Campus participation", "Institution leadership pathways"],
    sees: "College Command KPIs",
    decisions: "Goal review and vacancy attention",
    enabledToday: "College Command KPI surfaces",
    pending: "Deeper institution operations",
  },
  {
    id: "college-leader",
    title: "College Leader",
    purpose: "Coordinate the College Team mission across campuses.",
    serves: "Institution leads and campus volunteers",
    reportsTo: "Education Command",
    supports: "Institution Leads",
    responsibilities: ["College Team coordination", "Vacancy matching conversations"],
    sees: "College Command + meeting workspace",
    decisions: "Meeting commitments (soft beta)",
    enabledToday: "Meeting path + position catalog",
    pending: "Certified appointment binding",
  },
  {
    id: "institution-leads",
    title: "Institution Leads",
    purpose: "Own campus-level coordination for one institution.",
    serves: "Students and campus teams at one school",
    reportsTo: "College Leader",
    supports: "Functional / Area Leaders",
    responsibilities: ["Campus roles", "Power of 5 launch", "Local next steps"],
    sees: "Institution goals labeled as estimates where applicable",
    decisions: "Local meeting next steps",
    enabledToday: "Position + Power of 5 soft beta",
    pending: "Durable seat assign",
  },
  {
    id: "functional-area-leaders",
    title: "Functional / Area Leaders",
    purpose: "Lead a concrete function (events, outreach, registration, media, etc.).",
    serves: "Volunteers in that function",
    reportsTo: "Institution Leads / College Lead",
    supports: "Committees and volunteers",
    responsibilities: ["Function ownership", "Weekly rhythm", "Recruit helpers"],
    sees: "Position drill-downs and Field Plan approved content",
    decisions: "Soft-beta interest and invitations",
    enabledToday: "Campus role pages",
    pending: "Full leader workbench",
  },
  {
    id: "committees",
    title: "Committees",
    purpose: "Share work under a function without requiring everyone to hold a lead seat.",
    serves: "Peers who want a scoped contribution",
    reportsTo: "Functional / Area Leaders",
    supports: "Volunteers",
    responsibilities: ["Shared tasks", "Peer support"],
    sees: "Meeting and recruiting guidance",
    decisions: "Who helps with which ask",
    enabledToday: "Guidance pages",
    pending: "Task execution (L4 blocked)",
  },
  {
    id: "volunteers",
    title: "Volunteers",
    purpose: "Take useful next steps and invite others with care.",
    serves: "Campus and community peers",
    reportsTo: "Committees / Functional Leaders",
    supports: "The whole team",
    responsibilities: ["Show up", "Invite with respect", "Follow through"],
    sees: "Participation journey and Power of 5",
    decisions: "Personal next step",
    enabledToday: "Soft-beta join + invite flow",
    pending: "Certified invite-chain binding",
  },
];

/** Clickable top-down chain for How it works → hierarchy. */
export const HIERARCHY_CHAIN: string[] = [
  "director",
  "volunteer-manager",
  "education-command",
  "college-leader",
  "institution-leads",
  "functional-area-leaders",
  "committees",
  "volunteers",
];

export function getHierarchyNode(id: string): HierarchyNode | undefined {
  return HIERARCHY_NODES.find((n) => n.id === id);
}

/** Optional next-node hints for drill sections. */
export const HIERARCHY_CHILDREN: Record<string, string[]> = {
  director: ["volunteer-manager"],
  "volunteer-manager": ["county-volunteer-command", "education-command"],
  "county-volunteer-command": ["education-command"],
  "education-command": ["college-leader"],
  "college-leader": ["institution-leads"],
  "institution-leads": ["functional-area-leaders"],
  "functional-area-leaders": ["committees"],
  committees: ["volunteers"],
  volunteers: [],
};
