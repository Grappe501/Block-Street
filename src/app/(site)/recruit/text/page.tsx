import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";

export const metadata = {
  title: "Recruit text — soft beta",
};

export default function RecruitTextPage() {
  return (
    <MeetingChrome
      title="Text patterns"
      subtitle="Short, welcoming, honest. Adapt in your own voice."
    >
      <div className="space-y-4 text-sm text-slate-700">
        <blockquote className="rounded-lg border border-slate-200 bg-white p-4">
          Hey — we’re building a soft-beta campus organizing path. Want me to send the explore link? No pressure.
        </blockquote>
        <blockquote className="rounded-lg border border-slate-200 bg-white p-4">
          Open seats tonight: social, voter registration, community, events, outreach. Interested in looking?
        </blockquote>
        <blockquote className="rounded-lg border border-slate-200 bg-white p-4">
          If timing’s bad, all good — I can check in later. This is a welcome, not a hard ask.
        </blockquote>
      </div>
      <p className="mt-6 text-sm font-semibold">
        <Link href="/recruit" className="text-brand-800 underline-offset-2 hover:underline">
          ← Recruit
        </Link>
        {" · "}
        <Link href="/join/explore" className="text-brand-800 underline-offset-2 hover:underline">
          Explore link →
        </Link>
      </p>
    </MeetingChrome>
  );
}
