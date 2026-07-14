import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";

export const metadata = {
  title: "Power of 5 start — soft beta",
};

export default function PowerOf5StartPage() {
  return (
    <MeetingChrome
      title="Start with five"
      subtitle="You’re not building a bureaucracy tonight — you’re welcoming five people who will grow the network with you."
    >
      <ol className="list-decimal space-y-3 pl-5 text-sm text-slate-700">
        <li>Name five peers you already trust (or leave seats open until you do).</li>
        <li>Use Recruit conversation language — service first, pressure never.</li>
        <li>Prepare an invite carefully. Soft beta does not claim CERTIFIED invite activation.</li>
        <li>Follow up once with warmth and a clear next step.</li>
        <li>Point them to Join explore or an open campus seat when they&apos;re ready.</li>
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/power-of-5/my-team"
          className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
        >
          Open my five seats
        </Link>
        <Link
          href="/power-of-5/invite"
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold"
        >
          Invite prep
        </Link>
        <Link href="/power-of-5" className="rounded-lg px-4 py-2.5 text-sm font-semibold text-brand-800">
          ← Power of 5
        </Link>
      </div>
    </MeetingChrome>
  );
}
