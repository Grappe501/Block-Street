import type { PresentationSlide } from "./types";

/** College / campus new-user onboarding presentation. */
export const COLLEGE_NEW_USER_SLIDES: PresentationSlide[] = [
  {
    id: "welcome",
    kicker: "College new user · ASYON",
    title: "Your campus. Your network. Statewide power.",
    body: [
      "This walkthrough shows what Block Street is, why it matters on your campus, and exactly what to do next.",
      "Invitation-only soft beta — we partner with you as we build.",
    ],
  },
  {
    id: "why",
    kicker: "Why use this",
    title: "Organization is the product",
    body: [
      "Events, posts, and energy fade. Named leads, Power of 5 teams, and a visible campus network stay.",
      "Politicians notice numbers. Peers notice belonging. You get a board that shows who you’ve invited and what’s next.",
    ],
  },
  {
    id: "value",
    kicker: "Personal value",
    title: "This builds your individual network",
    body: [
      "Every invitation you send attaches to your board — people you actually know.",
      "Your place (school or county) keeps your home board focused. You are not staring at the whole state map forever.",
      "Taking a lead seat later connects your work to College Command and Field Plan responsibilities — without inventing a second org chart.",
    ],
  },
  {
    id: "how",
    kicker: "How the system works",
    title: "Invite → account → place → network",
    body: ["Four steps. That’s the soft-beta spine."],
    bullets: [
      "Someone who knows you sends an invitation link",
      "You create (or sign into) your account and confirm the invite",
      "You choose your school or county as home place",
      "You land on My Network — invite the next Human, one at a time",
    ],
  },
  {
    id: "signin",
    kicker: "Accounts",
    title: "Sign in is how you keep the chain",
    body: [
      "Use the email on your invitation. Set a password you’ll remember.",
      "Already activated? Sign in anytime at /login — then return to Network or Tonight.",
      "If accept fails, tell Steve/beta hosts via Feedback with the invite link and what you saw.",
    ],
    ctaHref: "/login",
    ctaLabel: "Sign in →",
  },
  {
    id: "campus-roles",
    kicker: "Campus leadership",
    title: "Roles that make a campus real",
    body: ["Pick a seat — or help fill open ones. Multiple co-leads are fine."],
    bullets: [
      "College / Community Lead — coordinates the campus effort",
      "Event Lead · Social · Canvass · Registration · Outreach",
      "Institution Lead dashboards (/leader/…) bind Field Plan responsibilities as content lands",
    ],
  },
  {
    id: "path-planned",
    kicker: "Where we’re going (planned — not rushed)",
    title: "Lead seats → campaign pages → your profile",
    body: [
      "Working toward: when you claim a lead seat, you land on the dashboard for that assignment and your public/profile surfaces reflect it.",
      "Today: College Command and Area Leader shells exist; durable assign + personal profile binding wait on invite-chain certification and durability gates.",
      "We will not fake that loop. You’ll see honest “shell / next” labels until it’s real.",
    ],
  },
  {
    id: "do-tonight",
    kicker: "What to do now",
    title: "Your checklist",
    body: ["Do these before you leave the room or close the tab."],
    bullets: [
      "Accept your invitation and sign in",
      "Choose your school (or county) as home place",
      "Open My Network — know how to invite one peer",
      "Name one campus role you will own or recruit for",
      "Send beta feedback — good and bad — so we improve with you",
    ],
    ctaHref: "/choose-place",
    ctaLabel: "Choose your place →",
  },
  {
    id: "feedback",
    kicker: "Partnership",
    title: "Tell us what you think",
    body: [
      "Beta partners shape the product. Praise what works. Name the friction. Request what you need for your campus.",
    ],
    ctaHref: "/feedback",
    ctaLabel: "Open feedback form →",
  },
];
