import Link from "next/link";
import { MeetingChrome, MeetingLinkList } from "@/components/meeting/MeetingChrome";
import { HonestyPanel } from "@/components/meeting/HonestyPanel";

export const metadata = {
  title: "Power of 5 — soft beta",
};

export default function PowerOf5Page() {
  return (
    <MeetingChrome
      title="Power of 5"
      subtitle="Soft power that lasts past one election night — start with five people you trust. Soft beta keeps seats in your browser; invite chains are not CERTIFIED."
    >
      <MeetingLinkList
        items={[
          { href: "/power-of-5/start", label: "Start", note: "Why five seats matter tonight" },
          { href: "/power-of-5/my-team", label: "My team", note: "Five-seat soft-beta builder" },
          { href: "/power-of-5/invite", label: "Invite prep", note: "Prepare carefully — not certified invites" },
          { href: "/power-of-5/follow-up", label: "Follow-up", note: "Gentle next touches" },
          { href: "/recruit", label: "Recruiting guide", note: "Conversation method (/recruit)" },
        ]}
      />
      <p className="mt-6 text-sm text-slate-600">
        Alias:{" "}
        <Link href="/power-of-5/recruiting-guide" className="font-semibold text-brand-800 underline-offset-2 hover:underline">
          /power-of-5/recruiting-guide → /recruit
        </Link>
      </p>
      <div className="mt-8">
        <HonestyPanel
          workingNow={["Local five-seat planner", "Recruit guides", "Invite prep language"]}
          stillCompleting={["CERTIFIED invite chain", "Durable shared team graphs"]}
        />
      </div>
    </MeetingChrome>
  );
}
