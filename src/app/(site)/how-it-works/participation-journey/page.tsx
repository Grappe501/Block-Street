import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";

export const metadata = {
  title: "Participation journey — soft beta",
};

const STEPS = [
  {
    title: "Explore",
    body: "Learn how campus teams work and what soft beta can already do.",
    href: "/join/explore",
  },
  {
    title: "Choose a seat path",
    body: "Browse open College Team positions that match how you want to serve.",
    href: "/positions/open",
  },
  {
    title: "Express interest",
    body: "Leave a soft-beta interest note — welcoming, not an appointment.",
    href: "/join/interest",
  },
  {
    title: "Invite with care",
    body: "Use Power of 5 and Recruit guides to welcome peers. Invite chains are not CERTIFIED in soft beta.",
    href: "/power-of-5/start",
  },
  {
    title: "Take a next step",
    body: "Return to the next-step page after interest so you always know what to do next.",
    href: "/join/next-step",
  },
];

export default function ParticipationJourneyPage() {
  return (
    <MeetingChrome
      title="Participation journey"
      subtitle="A clear, welcoming path from curiosity to contribution — without pretending the whole system is finished."
    >
      <p className="mb-6 text-sm">
        <Link href="/how-it-works" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          ← How it works
        </Link>
      </p>
      <ol className="space-y-4">
        {STEPS.map((step, index) => (
          <li key={step.title} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">Step {index + 1}</p>
            <h2 className="mt-1 text-lg font-bold text-slate-950">{step.title}</h2>
            <p className="mt-2 text-sm text-slate-700">{step.body}</p>
            <Link href={step.href} className="mt-3 inline-block text-sm font-semibold text-brand-800 underline-offset-2 hover:underline">
              Continue →
            </Link>
          </li>
        ))}
      </ol>
    </MeetingChrome>
  );
}
