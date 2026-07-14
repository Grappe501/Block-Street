import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";

export const metadata = {
  title: "Recruit college — soft beta",
};

export default function RecruitCollegePage() {
  return (
    <MeetingChrome
      title="College recruiting"
      subtitle="Campus roles from the agenda — social, voter registration, community, events, outreach. Every campus is unique."
    >
      <p className="text-sm text-slate-700">
        Point peers to open seats and the soft-beta interest form. Campus goals, when shown, use enrollment share of county
        VAP — not a flat 25%.
      </p>
      <ul className="mt-6 space-y-2 text-sm font-semibold">
        <li>
          <Link href="/positions/college" className="text-brand-800 underline-offset-2 hover:underline">
            College Team seats →
          </Link>
        </li>
        <li>
          <Link href="/presentations/college" className="text-brand-800 underline-offset-2 hover:underline">
            College new-user presentation →
          </Link>
        </li>
        <li>
          <Link href="/recruit" className="text-brand-800 underline-offset-2 hover:underline">
            ← Recruit
          </Link>
        </li>
      </ul>
    </MeetingChrome>
  );
}
