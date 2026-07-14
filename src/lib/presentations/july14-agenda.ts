import type { PresentationSlide } from "./types";

/** July 14 meeting agenda as a presentation deck (mirrors Identity i18n agenda). */
export const JULY14_AGENDA_SLIDES: PresentationSlide[] = [
  {
    id: "open",
    kicker: "Tonight · 6:00 PM · 30–45 minutes",
    title: "Launching ASYON",
    body: [
      "Goal: Introduce the organization, rally participants, and assign roles to build collective power.",
      "This deck is the agenda — walk it live. Pause for names. End with commitments.",
    ],
  },
  {
    id: "intro",
    kicker: "Section 1",
    title: "Introductions",
    body: ["Lead with people, not product."],
    bullets: [
      "Chance and Xay (Youth Leaders): vision, experience, passion for organizing young people.",
      "Politician guests: brief intro and how they support this effort.",
      "Quick name and school — everyone says who they are (e.g. “Alex, University of Arkansas”).",
    ],
  },
  {
    id: "urgency",
    kicker: "Section 2 · Why this matters",
    title: "The urgency",
    body: [
      "We’re at a perfect political cusp. 2026–2028 can be decided by young voters — if we organize now.",
      "Arkansas colleges have never organized like this. You are the untapped bloc politicians need — and you need organization to demand power in return.",
    ],
  },
  {
    id: "problem-opportunity",
    kicker: "Section 2 continued",
    title: "Problem and opportunity",
    body: [
      "More than half of voters are under 50, but rules are still made by those over 50. Numbers without organization don’t aid us yet.",
    ],
    bullets: [
      "Swing elections for leaders who share our intentions — Kelly, Chris, and allies we choose.",
      "This isn’t about a single candidate. It’s team voting power.",
      "After the election: uplift each other to run and lead.",
    ],
  },
  {
    id: "how",
    kicker: "Section 3",
    title: "How this works on every campus",
    body: [
      "Every campus is unique. We provide resources and support — each group shapes the work for their community.",
    ],
    bullets: [
      "Social Media Lead — grow the network and spread the word",
      "Voter Registration Lead — peers registered and ready",
      "College / Community Lead — oversee and coordinate locally",
      "Event Lead — fun, engaging, informative events",
      "Canvassing / Outreach Lead — connect peers and expand the network",
    ],
  },
  {
    id: "why-now",
    kicker: "Section 3 · Why now",
    title: "Summer is the window",
    body: [
      "Life is less chaotic with school out. Build momentum before the fall rush. Grinding this next month is essential.",
    ],
  },
  {
    id: "building",
    kicker: "Section 4",
    title: "What we’re building",
    body: [
      "A statewide network of young people (16–24) who get engaged, inform peers, and establish political power.",
      "Making politics fun. The Power of 5. Soft power that lasts past one election night.",
    ],
    bullets: [
      "Foundation for young people to run for office",
      "Influence local politics and politicians",
      "Ballot initiatives and lawmaking",
      "Leaders ready for roles everywhere",
      "Collective power to change government together",
    ],
  },
  {
    id: "website",
    kicker: "Section 5",
    title: "Show them the website",
    body: [
      "Walk the soft-beta path: invitation → sign in → choose your school or county → see your network.",
      "College new-user presentation explains value and next actions in detail.",
    ],
    ctaHref: "/presentations/college",
    ctaLabel: "Open College New User presentation →",
  },
  {
    id: "next-meeting",
    kicker: "Section 6",
    title: "Next steps: meet again",
    body: [
      "Tell us what dates you can’t make — we’ll pick the widest availability.",
      "Proposed window: July 20–26.",
    ],
  },
  {
    id: "name",
    kicker: "Section 7 · If time",
    title: "Name the organization",
    body: ["Optional brainstorm — leave room for participants to own the identity of the work."],
  },
  {
    id: "close",
    kicker: "Close",
    title: "Leave with a seat and a next step",
    body: [
      "Invite one person you trust. Choose your place. Take a campus role — or recruit for an open one.",
      "Feedback from beta partners makes this stronger — tell us what works and what doesn’t.",
    ],
    ctaHref: "/feedback",
    ctaLabel: "Open beta feedback →",
  },
];
