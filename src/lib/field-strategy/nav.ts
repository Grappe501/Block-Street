export type ManualSectionId =
  | "overview"
  | "event-engine"
  | "local-teams"
  | "central-campaign"
  | "regnat-populus"
  | "power-of-5"
  | "voter-registration"
  | "strike-teams"
  | "county-command"
  | "election-operations"
  | "success-measures"
  | "benton";

export type ManualNavItem = {
  id: ManualSectionId;
  label: string;
  href: string;
  short: string;
};

export const MANUAL_NAV: ManualNavItem[] = [
  { id: "overview", label: "Overview", short: "Overview", href: "/field-strategy" },
  { id: "event-engine", label: "Event Engine", short: "Event", href: "/field-strategy/event-engine" },
  { id: "local-teams", label: "Local Teams", short: "Local", href: "/field-strategy/local-teams" },
  { id: "central-campaign", label: "Central Campaign", short: "Central", href: "/field-strategy/central-campaign" },
  { id: "regnat-populus", label: "Regnat Populus", short: "Regnat", href: "/field-strategy/regnat-populus" },
  { id: "power-of-5", label: "Power of 5", short: "P5", href: "/field-strategy/power-of-5" },
  { id: "voter-registration", label: "Voter Registration", short: "VR", href: "/field-strategy/voter-registration" },
  { id: "strike-teams", label: "Strike Teams", short: "Strike", href: "/field-strategy/strike-teams" },
  { id: "county-command", label: "County Command", short: "County", href: "/field-strategy/county-command" },
  { id: "election-operations", label: "Election Operations", short: "Election", href: "/field-strategy/election-operations" },
  { id: "success-measures", label: "Success Measures", short: "Measure", href: "/field-strategy/success-measures" },
  { id: "benton", label: "Benton County", short: "Benton", href: "/field-strategy/benton" },
];

export const PRESENTATION_SLIDES: Array<{
  id: string;
  title: string;
  section: ManualSectionId | "presentation-close";
  href?: string;
}> = [
  { id: "s1", title: "We Are Building More Than Events", section: "overview", href: "/field-strategy/presentation?slide=0" },
  { id: "s2", title: "The Chain Reaction", section: "event-engine", href: "/field-strategy/presentation?slide=1" },
  { id: "s3", title: "Local Leaders Make It Real", section: "local-teams", href: "/field-strategy/presentation?slide=2" },
  { id: "s4", title: "The Central Campaign Brings Support", section: "central-campaign", href: "/field-strategy/presentation?slide=3" },
  { id: "s5", title: "Regnat Populus", section: "regnat-populus", href: "/field-strategy/presentation?slide=4" },
  { id: "s6", title: "Every Event Launches Power of 5", section: "power-of-5", href: "/field-strategy/presentation?slide=5" },
  { id: "s7", title: "Voter Registration Is Permanent", section: "voter-registration", href: "/field-strategy/presentation?slide=6" },
  { id: "s8", title: "Strike Team Saturdays", section: "strike-teams", href: "/field-strategy/presentation?slide=7" },
  { id: "s9", title: "County Command Holds It Together", section: "county-command", href: "/field-strategy/presentation?slide=8" },
  { id: "s10", title: "Election Operations Begin Now", section: "election-operations", href: "/field-strategy/presentation?slide=9" },
  { id: "s11", title: "We Measure What We Build", section: "success-measures", href: "/field-strategy/presentation?slide=10" },
  { id: "s12", title: "Benton County Can Build the Model", section: "benton", href: "/field-strategy/presentation?slide=11" },
  { id: "s13", title: "Who Will Help Lead It?", section: "benton", href: "/field-strategy/presentation?slide=12" },
  { id: "s14", title: "Our First Action", section: "presentation-close", href: "/field-strategy/presentation?slide=13" },
];
