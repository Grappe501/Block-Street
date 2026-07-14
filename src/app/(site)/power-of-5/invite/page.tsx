import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";

export const metadata = {
  title: "Power of 5 invite prep — soft beta",
};

export default function PowerOf5InvitePage() {
  return (
    <MeetingChrome
      title="Invite prep"
      subtitle="Soft-beta invite preparation — practice the welcome, then use Start. We do not claim invite CERTIFIED activation here."
    >
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700">
        <li>Lead with service: why this helps them and their campus.</li>
        <li>Offer a clear next step: explore, interest form, or a campus seat page.</li>
        <li>Be honest about soft beta — what’s working now and what’s still completing.</li>
        <li>Never invent appointments or certified invite status.</li>
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/power-of-5/start"
          className="rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Back to Start →
        </Link>
        <Link href="/start" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold">
          Platform invite tools (/start)
        </Link>
        <Link href="/power-of-5/my-team" className="rounded-lg px-4 py-2.5 text-sm font-semibold text-brand-800">
          My team
        </Link>
      </div>
      <div className="mt-8">
        <HonestyPanel
          workingNow={["Prep language and Start flow", "Soft-beta seat planner"]}
          stillCompleting={["Invite-chain CERTIFIED — not claimed in soft beta"]}
        />
      </div>
    </MeetingChrome>
  );
}
