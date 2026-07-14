import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";

export const metadata = {
  title: "Recruit follow-up — soft beta",
};

export default function RecruitFollowUpPage() {
  return (
    <MeetingChrome
      title="Follow-up"
      subtitle="One clear check-in. Thank them either way."
    >
      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
        <li>Thank them for considering it.</li>
        <li>Offer the explore page or a specific open seat.</li>
        <li>Invite beta feedback if they tried the site.</li>
        <li>Update your Power of 5 seat status locally.</li>
      </ol>
      <p className="mt-6 text-sm font-semibold">
        <Link href="/recruit" className="text-brand-800 underline-offset-2 hover:underline">
          ← Recruit
        </Link>
        {" · "}
        <Link href="/power-of-5/follow-up" className="text-brand-800 underline-offset-2 hover:underline">
          Power of 5 follow-up →
        </Link>
      </p>
    </MeetingChrome>
  );
}
