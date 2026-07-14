import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";

export const metadata = {
  title: "Power of 5 follow-up — soft beta",
};

export default function PowerOf5FollowUpPage() {
  return (
    <MeetingChrome
      title="Follow-up"
      subtitle="One warm check-in beats five pressure texts. Soft beta is about belonging."
    >
      <ol className="list-decimal space-y-3 pl-5 text-sm text-slate-700">
        <li>Thank them for considering the invite — no guilt if timing isn’t right.</li>
        <li>Remind them of one useful next step (explore, seat interest, or the next meeting).</li>
        <li>Offer help with the soft-beta path — choose place, open a role page, or send feedback.</li>
        <li>Mark the seat followed-up in My team (browser only).</li>
      </ol>
      <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
        <Link href="/power-of-5/my-team" className="text-brand-800 underline-offset-2 hover:underline">
          Update my seats →
        </Link>
        <Link href="/recruit/follow-up" className="text-brand-800 underline-offset-2 hover:underline">
          Recruit follow-up guide →
        </Link>
        <Link href="/power-of-5" className="text-brand-800 underline-offset-2 hover:underline">
          ← Power of 5
        </Link>
      </div>
    </MeetingChrome>
  );
}
