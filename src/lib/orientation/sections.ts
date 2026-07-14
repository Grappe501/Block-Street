export type OrientationSection = {
  id: string;
  title: string;
  shortExplanation: string;
  presenterNotes: string[];
  participantText: string[];
  audioScript: string;
  videoScript: string;
  transcript: string;
  estimatedDurationMinutes: number;
  supportingVisual: string;
  primaryAction: { label: string; href: string };
  completionCondition: string;
};

/** Media-ready Orientation sections — text fully usable without audio/video. */
export const ORIENTATION_SECTIONS: OrientationSection[] = [
  {
    id: "welcome",
    title: "Welcome — why we organize on campuses",
    shortExplanation: "Block Street helps people organize lasting campus communities — not one-night events.",
    presenterNotes: ["Lead with belonging", "Name tonight’s outcomes", "Invite phones out for follow-along"],
    participantText: [
      "Tonight is Orientation. By the end you should know your College Community path and one next step.",
    ],
    audioScript: "",
    videoScript: "",
    transcript: "",
    estimatedDurationMinutes: 4,
    supportingVisual: "Block Street welcome",
    primaryAction: { label: "Continue", href: "/orientation/student" },
    completionCondition: "Participant heard the purpose of Orientation",
  },
  {
    id: "path-choice",
    title: "Student path or County path",
    shortExplanation: "Choose how you primarily want to participate. You can switch later.",
    presenterNotes: ["Emphasize College Community for tonight", "County path stays available"],
    participantText: ["I am a student (or campus-connected) → College Community", "I am not a student → County Community"],
    audioScript: "",
    videoScript: "",
    transcript: "",
    estimatedDurationMinutes: 4,
    supportingVisual: "Two path cards",
    primaryAction: { label: "Choose student path", href: "/orientation/student" },
    completionCondition: "Participant selected a path",
  },
  {
    id: "college-community",
    title: "Enter your College Community",
    shortExplanation: "Your school’s page is the center of campus organizing.",
    presenterNotes: ["Demo selecting a college", "Show homepage sections"],
    participantText: ["Select your college", "Join or explore the community", "See teams and next actions"],
    audioScript: "",
    videoScript: "",
    transcript: "",
    estimatedDurationMinutes: 5,
    supportingVisual: "College community homepage",
    primaryAction: { label: "Find my college", href: "/colleges" },
    completionCondition: "Participant opened a College Community",
  },
  {
    id: "teams",
    title: "Campus teams we need to build",
    shortExplanation: "Seven teams cover operations, events, media, outreach, registration, welcome, and data.",
    presenterNotes: ["Walk 2–3 teams live", "Remind: interest ≠ appointment"],
    participantText: ["Explore teams", "Open one team drill-down"],
    audioScript: "",
    videoScript: "",
    transcript: "",
    estimatedDurationMinutes: 5,
    supportingVisual: "Teams grid",
    primaryAction: { label: "Browse teams", href: "/orientation/positions" },
    completionCondition: "Participant viewed teams",
  },
  {
    id: "vr-drive",
    title: "First-week voter-registration drive",
    shortExplanation: "Prepare a lawful, campus-aware registration drive for the week students return.",
    presenterNotes: ["Stress readiness gates", "Never claim compliance without evidence"],
    participantText: ["Open readiness board", "Separate metric lanes"],
    audioScript: "",
    videoScript: "",
    transcript: "",
    estimatedDurationMinutes: 5,
    supportingVisual: "VR readiness",
    primaryAction: { label: "See registration overview", href: "/orientation/next-step" },
    completionCondition: "Participant understands the drive goal",
  },
  {
    id: "social-event",
    title: "Campus networking event",
    shortExplanation: "Plan a social recruitment experience — short explanation, lots of belonging.",
    presenterNotes: ["It’s not a long political meeting"],
    participantText: ["Identify dates/venues", "Invite five people"],
    audioScript: "",
    videoScript: "",
    transcript: "",
    estimatedDurationMinutes: 4,
    supportingVisual: "Event plan board",
    primaryAction: { label: "Continue", href: "/orientation/power-of-5" },
    completionCondition: "Participant saw event purpose",
  },
  {
    id: "power-of-5",
    title: "Bring five people from your school",
    shortExplanation: "Start with people you already know at school.",
    presenterNotes: ["Soft-beta invitation labels", "Not five confirmed members"],
    participantText: ["Identify five people", "Prepare an invitation"],
    audioScript: "",
    videoScript: "",
    transcript: "",
    estimatedDurationMinutes: 4,
    supportingVisual: "Power of 5 seats",
    primaryAction: { label: "Open Power of 5", href: "/orientation/power-of-5" },
    completionCondition: "Participant started Power of 5",
  },
  {
    id: "next-step",
    title: "Choose your immediate next step",
    shortExplanation: "Leave Orientation with one concrete action — not a formal appointment.",
    presenterNotes: ["Collect soft-beta commitments", "Thank the room"],
    participantText: ["Pick one next step", "Return to your College Community"],
    audioScript: "",
    videoScript: "",
    transcript: "",
    estimatedDurationMinutes: 3,
    supportingVisual: "Next-step chooser",
    primaryAction: { label: "Choose next step", href: "/orientation/next-step" },
    completionCondition: "Participant selected a next step",
  },
];
