import Link from "next/link";
import { MeetingChrome } from "@/components/meeting/MeetingChrome";

export const metadata = {
  title: "Recruit · Power of 5 — soft beta",
};

export default function RecruitPowerOf5Page() {
  return (
    <MeetingChrome
      title="Recruit with Power of 5"
      subtitle="Use the five-seat planner to stay intentional — then practice the conversation."
    >
      <ul className="mt-2 space-y-2 text-sm font-semibold">
        <li>
          <Link href="/power-of-5/start" className="text-brand-800 underline-offset-2 hover:underline">
            Power of 5 start →
          </Link>
        </li>
        <li>
          <Link href="/power-of-5/my-team" className="text-brand-800 underline-offset-2 hover:underline">
            My team builder →
          </Link>
        </li>
        <li>
          <Link href="/recruit/conversation" className="text-brand-800 underline-offset-2 hover:underline">
            Conversation guide →
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
