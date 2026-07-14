export type ManualSectionId =
  | "overview"
  | "strategy"
  | "event-engine"
  | "field-teams"
  | "local-teams"
  | "central-campaign"
  | "regnat-populus"
  | "power-of-5"
  | "voter-registration"
  | "strike-teams"
  | "county-command"
  | "election-operations"
  | "success-measures"
  | "benton"
  | "join";

export type ManualNavItem = {
  id: ManualSectionId;
  label: string;
  href: string;
  short: string;
};

/** Sticky top navigation — presentation-selling structure */
export const MANUAL_NAV: ManualNavItem[] = [
  { id: "overview", label: "Overview", short: "Overview", href: "/field-strategy" },
  { id: "strategy", label: "Strategy", short: "Strategy", href: "/field-strategy/strategy" },
  { id: "event-engine", label: "Event Engine", short: "Event", href: "/field-strategy/event-engine" },
  { id: "field-teams", label: "Field Teams", short: "Teams", href: "/field-strategy/field-teams" },
  { id: "regnat-populus", label: "Regnat Populus", short: "Regnat", href: "/field-strategy/regnat-populus" },
  { id: "power-of-5", label: "Power of 5", short: "P5", href: "/field-strategy/power-of-5" },
  { id: "county-command", label: "County Command", short: "County", href: "/field-strategy/county-command" },
  { id: "election-operations", label: "Election Ops", short: "Election", href: "/field-strategy/election-operations" },
  { id: "benton", label: "Benton County", short: "Benton", href: "/field-strategy/benton" },
];

/** Left trail — where you are in the experience */
export const SIDEBAR_TRAIL: Array<{ id: ManualSectionId; label: string; href: string }> = [
  { id: "overview", label: "Overview", href: "/field-strategy" },
  { id: "strategy", label: "Why We Win", href: "/field-strategy/strategy" },
  { id: "event-engine", label: "Event Engine", href: "/field-strategy/event-engine" },
  { id: "local-teams", label: "Local Teams", href: "/field-strategy/local-teams" },
  { id: "central-campaign", label: "Central Teams", href: "/field-strategy/central-campaign" },
  { id: "field-teams", label: "Field Teams", href: "/field-strategy/field-teams" },
  { id: "regnat-populus", label: "Regnat Populus", href: "/field-strategy/regnat-populus" },
  { id: "power-of-5", label: "Power of Five", href: "/field-strategy/power-of-5" },
  { id: "strike-teams", label: "Strike Saturdays", href: "/field-strategy/strike-teams" },
  { id: "county-command", label: "County Command", href: "/field-strategy/county-command" },
  { id: "election-operations", label: "Election Operations", href: "/field-strategy/election-operations" },
  { id: "success-measures", label: "Success", href: "/field-strategy/success-measures" },
  { id: "benton", label: "Benton County", href: "/field-strategy/benton" },
  { id: "join", label: "Join Us", href: "/field-strategy/join" },
];

export type MapMode = "glow-growing" | "network-75" | "benton" | "nodes" | "idle";

export const SECTION_MAP_MODE: Partial<Record<ManualSectionId, MapMode>> = {
  overview: "glow-growing",
  strategy: "network-75",
  "event-engine": "nodes",
  "field-teams": "nodes",
  "local-teams": "nodes",
  "central-campaign": "nodes",
  "regnat-populus": "glow-growing",
  "power-of-5": "glow-growing",
  "strike-teams": "nodes",
  "county-command": "network-75",
  "election-operations": "network-75",
  "voter-registration": "nodes",
  "success-measures": "glow-growing",
  benton: "benton",
  join: "benton",
};

export type PresentationSlide = {
  id: string;
  title: string;
  feel: string;
  /** Manual section that owns the drill-down page */
  section: ManualSectionId;
  /** Override drill-down href when it is not `/field-strategy/{section}` */
  drillHref?: string;
  drillLabel?: string;
};

export function fieldStrategyHref(section: ManualSectionId): string {
  return section === "overview" ? "/field-strategy" : `/field-strategy/${section}`;
}

export const PRESENTATION_SLIDES: PresentationSlide[] = [
  {
    id: "s1",
    title: "We Aren't Building Events",
    feel: "Hope",
    section: "overview",
    drillLabel: "Open the mission overview →",
  },
  {
    id: "s2",
    title: "This Is How It Works",
    feel: "Clarity",
    section: "strategy",
    drillLabel: "Drill into the strategy board →",
  },
  {
    id: "s3",
    title: "One Decision Sets Everything in Motion",
    feel: "Organized",
    section: "event-engine",
    drillLabel: "Open the Event Engine →",
  },
  {
    id: "s4",
    title: "Local Leaders Make It Real",
    feel: "Belonging",
    section: "local-teams",
    drillLabel: "Meet the local team seats →",
  },
  {
    id: "s5",
    title: "Central Campaign Brings the Force Multiplier",
    feel: "Support",
    section: "central-campaign",
    drillLabel: "Open central campaign support →",
  },
  {
    id: "s6",
    title: "Wear The Mission",
    feel: "Pride",
    section: "regnat-populus",
    drillLabel: "Open Regnat Populus →",
  },
  {
    id: "s7",
    title: "Five People Can Change a Neighborhood",
    feel: "Agency",
    section: "power-of-5",
    drillLabel: "Open Power of 5 →",
  },
  {
    id: "s8",
    title: "Campaign Work Should Feel Like Community",
    feel: "Joy",
    section: "strike-teams",
    drillLabel: "Open Strike Saturdays →",
  },
  {
    id: "s9",
    title: "Every County Needs an Operational Home",
    feel: "Confidence",
    section: "county-command",
    drillLabel: "Open County Command →",
  },
  {
    id: "s10",
    title: "Election Day Is Built Month by Month",
    feel: "Resolve",
    section: "election-operations",
    drillLabel: "Open Election Operations →",
  },
  {
    id: "s11",
    title: "We Measure What We Build",
    feel: "Focus",
    section: "success-measures",
    drillLabel: "Open success measures →",
  },
  {
    id: "s12",
    title: "Benton County Can Build the Model",
    feel: "Ownership",
    section: "benton",
    drillLabel: "Open Benton County playbook →",
  },
  {
    id: "s13",
    title: "Who Will Help Lead It?",
    feel: "Ownership",
    section: "benton",
    drillHref: "/field-strategy/benton",
    drillLabel: "Open Benton leadership map →",
  },
  {
    id: "s14",
    title: "Let's Build Benton County Together",
    feel: "Call to action",
    section: "join",
    drillLabel: "Open Join Us →",
  },
];
